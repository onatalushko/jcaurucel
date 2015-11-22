<?php

/**
 * @file
 * Views integration for jCarousel module.
 */

use \Drupal\Component\Utility\Html;
use \Drupal\views\ViewExecutable;
use \Drupal\Core\Url;
use Drupal\Component\Utility\NestedArray;

/**
 * Menu callback; Handle AJAX Views requests for carousels.
 */
function jcarousel_views_ajax() {
  if (isset($_REQUEST['view_name']) && isset($_REQUEST['view_display_id'])) {
    $name = $_REQUEST['view_name'];
    $display_id = $_REQUEST['view_display_id'];
    $args = isset($_REQUEST['view_args']) && $_REQUEST['view_args'] !== '' ? explode('/', $_REQUEST['view_args']) : array();
    $path = isset($_REQUEST['view_path']) ? $_REQUEST['view_path'] : NULL;
    $dom_id = isset($_REQUEST['jcarousel_dom_id']) ? intval($_REQUEST['jcarousel_dom_id']) : NULL;
    $first = isset($_REQUEST['first']) ? intval($_REQUEST['first']) : NULL;
    $last = isset($_REQUEST['last']) ? intval($_REQUEST['last']) : NULL;
    views_include('ajax');
    $object = new stdClass();

    $object->status = FALSE;
    $object->display = '';

    $arg = explode('/', $_REQUEST['view_path']);

    // Load the view.
    if ($view = views_get_view($name)) {
      $view->set_display($display_id);

      if ($view->access($display_id)) {

        // Fix 'q' for paging.
        if (!empty($path)) {
          $_GET['q'] = $path;
        }

        // Disable the pager, render between the start and end values.
        // Views 2:
        if (isset($view->pager)) {
          $view->pager['use_pager'] = FALSE;
          $view->pager['offset'] = $first;
          $view->pager['items_per_page'] = $last - $first;

          $view->display[$display_id]->handler->set_option('use_pager', 0);
          $view->display[$display_id]->handler->set_option('offset', $first);
          $view->display[$display_id]->handler->set_option('items_per_page', $last - $first);
        }
        // Views 3:
        else {
          $view->set_items_per_page($last - $first);
          $view->set_offset($first);

          // Redundant but apparently needed.
          $view->items_per_page = $last - $first;
          $view->offset = $first;
        }

        // Reuse the same DOM id so it matches that in Drupal.settings.
        $view->jcarousel_dom_id = $dom_id;

        $errors = $view->validate();
        if ($errors === TRUE) {
          $object->status = TRUE;
          $object->title = $view->get_title();
          $object->display .= $view->preview($display_id, $args);
        }
        else {
          foreach ($errors as $error) {
            drupal_set_message($error, 'error');
          }
        }
      }
    }
    $messages = theme('status_messages');
    $object->messages = $messages ? '<div class="views-messages">' . $messages . '</div>' : '';

    drupal_json_output($object);
  }
}


