<?php
/**
 * @file
 * Contains \Drupal\jcarousel\Controller\JcarouselViewAjaxController.
 */

namespace Drupal\jcarousel\Controller;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\views\Controller\ViewAjaxController;
use Symfony\Component\HttpFoundation\Request;

/**
 * Defines a controller to load a jCarousel view via AJAX.
 */
class JcarouselViewAjaxController extends ViewAjaxController implements ContainerInjectionInterface {

  public function ajaxView(Request $request) {
    $response = parent::ajaxView($request);
    return $response;
  }
}