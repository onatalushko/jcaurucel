<?php
/**
 * @file
 * Contains \Drupal\jcarousel\Controller\JcarouselViewAjaxController.
 */

namespace Drupal\jcarousel\Controller;

use Drupal\Component\Utility\UrlHelper;
use Drupal\Core\Ajax\AppendCommand;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\EventSubscriber\AjaxResponseSubscriber;
use Drupal\Core\Render\BubbleableMetadata;
use Drupal\Core\Render\RenderContext;
use Drupal\jcarousel\Ajax\JcarouselAppendCommand;
use Drupal\views\Ajax\ViewAjaxResponse;
use Drupal\views\Controller\ViewAjaxController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Defines a controller to load a jCarousel view via AJAX.
 */
class JcarouselViewAjaxController extends ViewAjaxController implements ContainerInjectionInterface {

  /**
   * {@inheritdoc}
   */
  public function ajaxView(Request $request) {
    $name = $request->request->get('view_name');
    $display_id = $request->request->get('view_display_id');
    if (isset($name) && isset($display_id)) {
      $args = $request->request->get('view_args');
      $args = isset($args) && $args !== '' ? explode('/', $args) : array();

      // Arguments can be empty, make sure they are passed on as NULL so that
      // argument validation is not triggered.
      $args = array_map(function ($arg) {
        return ($arg == '' ? NULL : $arg);
      }, $args);

      $path = $request->request->get('view_path');
      $dom_id = $request->request->get('view_dom_id');
      $dom_id = isset($dom_id) ? preg_replace('/[^a-zA-Z0-9_-]+/', '-', $dom_id) : NULL;
      $pager_element = $request->request->get('pager_element');
      $pager_element = isset($pager_element) ? intval($pager_element) : NULL;

      $response = new ViewAjaxResponse();

      // Remove all of this stuff from the query of the request so it doesn't
      // end up in pagers and tablesort URLs.
      foreach (array(
                 'view_name', 'view_display_id', 'view_args', 'view_path',
                 'view_dom_id', 'pager_element', 'view_base_path',
                 AjaxResponseSubscriber::AJAX_REQUEST_PARAMETER,
               ) as $key) {
        $request->query->remove($key);
        $request->request->remove($key);
      }

      // Load the view.
      if (!$entity = $this->storage->load($name)) {
        throw new NotFoundHttpException();
      }
      $view = $this->executableFactory->get($entity);
      if ($view && $view->access($display_id)) {
        $response->setView($view);
        // Fix the current path for paging.
        if (!empty($path)) {
          $this->currentPath->setPath('/' . $path, $request);
        }

        // Add all POST data, because AJAX is always a post and many things,
        // such as tablesorts, exposed filters and paging assume GET.
        $request_all = $request->request->all();
        $query_all = $request->query->all();
        $request->query->replace($request_all + $query_all);

        // Overwrite the destination.
        // @see the redirect.destination service.
        $origin_destination = $path;
        $query = UrlHelper::buildQuery($request->query->all());
        if ($query != '') {
          $origin_destination .= '?' . $query;
        }
        $this->redirectDestination->set($origin_destination);

        // Override the display's pager_element with the one actually used.
        if (isset($pager_element)) {
          $view->displayHandlers->get($display_id)
            ->setOption('pager_element', $pager_element);
        }
        // Reuse the same DOM id so it matches that in drupalSettings.
        $view->dom_id = $dom_id;

        $context = new RenderContext();
        $preview = $this->renderer->executeInRenderContext($context, function () use ($view, $display_id, $args) {
          return $view->preview($display_id, $args);
        });
        if (!$context->isEmpty()) {
          $bubbleable_metadata = $context->pop();
          foreach ($view->result as $row) {
            $rendered_row = $view->rowPlugin->render($row);
            BubbleableMetadata::createFromRenderArray($rendered_row)
              ->merge($bubbleable_metadata)
              ->applyTo($rendered_row);
            $next_page = NULL;
            if ($view->pager->total_items == PHP_INT_MAX / 2) {
              $next_page = $view->getCurrentPage() + 1;
            }
            $response->addCommand(new JcarouselAppendCommand(".js-view-dom-id-$dom_id", $rendered_row, array('next_page' => $next_page)));
          }
        }

        return $response;
      }
      else {
        throw new AccessDeniedHttpException();
      }
    }
    else {
      throw new NotFoundHttpException();
    }
  }

}
