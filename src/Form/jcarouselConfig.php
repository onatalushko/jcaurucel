<?php
/**
 * Created by PhpStorm.
 * User: oleg
 * Date: 25.10.15
 * Time: 21:15
 */

namespace Drupal\jcarousel;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class jcarouselConfig extends ConfigFormBase {
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
    return ['jcarousel.settings'];
  }
}
