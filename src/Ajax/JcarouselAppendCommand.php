<?php
/**
 * @file
 * Contains \Drupal\Core\Ajax\JcarouselAppendCommand.
 */

namespace Drupal\jcarousel\Ajax;

use Drupal\Core\Ajax\CommandInterface;
use Drupal\Core\Ajax\CommandWithAttachedAssetsInterface;
use Drupal\Core\Ajax\CommandWithAttachedAssetsTrait;

/**
 * An AJAX command for adding jCarousel items dynamically.
 *
 * This command is implemented by Drupal.AjaxCommands.prototype.jcarousel_append()
 * defined in jcarousel/assets/vendor/jcarousel/jcarousel.js.
 *
 * @see http://sorgalla.com/jcarousel/docs/reference/usage.html#manipulating-the-carousel
 *
 * @ingroup ajax
 */
class JcarouselAppendCommand implements CommandInterface, CommandWithAttachedAssetsInterface {

  use CommandWithAttachedAssetsTrait;

  /**
   * A CSS selector string.
   *
   * If the command is a response to a request from an #ajax form element then
   * this value can be NULL.
   *
   * @var string
   */
  protected $selector;

  /**
   * The content for the matched element(s).
   *
   * Either a render array or an HTML string.
   *
   * @var string|array
   */
  protected $content;

  /**
   * A settings array to be passed to any any attached JavaScript behavior.
   *
   * @var array
   */
  protected $settings;

  /**
   * Preload content flag.
   *
   * If the command is a response to a request from an #ajax form element then
   * this value can be NULL.
   *
   * @var bool
   */
  protected $stop_preload;


  /**
   * {@inheritdoc}
   */
  public function __construct($selector, $content, array $settings = NULL) {
    $this->selector = $selector;
    $this->content = $content;
    $this->settings = $settings;
  }

  /**
   * {@inheritdoc}
   */
  public function render() {

    return array(
      'command' => 'jcarousel_append',
      'method' => 'append',
      'selector' => $this->selector,
      'data' => $this->getRenderedContent(),
      'settings' => $this->settings,
    );
  }

}
