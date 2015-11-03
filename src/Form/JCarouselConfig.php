<?php
/**
 * @file
 * JCarousel global config class.
 */

namespace Drupal\jcarousel;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class jcarouselConfig.
 *
 * @package Drupal\jcarousel
 */
class JCarouselConfig extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormID() {
    return 'jcarousel_config';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('jcarousel.settings');
    $form['global_load'] = array(
      '#type' => 'checkbox',
      '#title' => t('Load jCarousel on all pages'),
      '#default_value' => $config->get('global_load'),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['jcaroucel.settings'];
  }

}