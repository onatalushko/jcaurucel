<?php

/**
 * @file
 * Contains \Drupal\jcarousel\jCarouselSkinsManager.
 */

namespace Drupal\jcarousel;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Extension\ThemeHandlerInterface;
use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\Core\Plugin\Discovery\ContainerDerivativeDiscoveryDecorator;
use Drupal\Core\Plugin\Discovery\YamlDiscovery;
use Drupal\Core\Plugin\Factory\ContainerFactory;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;


/**
 * Defines a jcarousel skins plugin manager to deal with skins.
 *
 * Extension can define skins in a EXTENSION_NAME.jcarousel_skins.yml file
 * contained in the extension's base directory. Each skin has the
 * following structure:
 * @code
 *   MACHINE_NAME:
 *     label: STRING
 *     file: STRING
 *     weight: INTEGER
 * @endcode
 */
class jCarouselSkinsManager extends DefaultPluginManager {
  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  protected $defaults = [
    // Human readable label for skin.
    'label' => '',
    // The file containing css for the skin.
    'file' => '',
    // Weight used for ordering skins.
    'weight' => 0,
  ];

  /**
   * The theme handler.
   *
   * @var \Drupal\Core\Extension\ThemeHandlerInterface
   */
  protected $themeHandler;

  /**
   * Constructs a new BreakpointManager instance.
   *
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   * @param \Drupal\Core\Extension\ThemeHandlerInterface $theme_handler
   *   The theme handler.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   The cache backend.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $string_translation
   *   The string translation service.
   */
  public function __construct(ModuleHandlerInterface $module_handler, ThemeHandlerInterface $theme_handler, CacheBackendInterface $cache_backend, TranslationInterface $string_translation) {
    $this->factory = new ContainerFactory($this);
    $this->moduleHandler = $module_handler;
    $this->themeHandler = $theme_handler;
    $this->setStringTranslation($string_translation);
    $this->alterInfo('jcarousel_skins');
    $this->setCacheBackend($cache_backend, 'jcarousel_skins', ['jcarousel_skins']);
  }

  /**
   * {@inheritdoc}
   */
  protected function getDiscovery() {
    if (!isset($this->discovery)) {
      $this->discovery = new YamlDiscovery('jcarousel_skins', $this->moduleHandler->getModuleDirectories() + $this->themeHandler->getThemeDirectories());
      $this->discovery = new ContainerDerivativeDiscoveryDecorator($this->discovery);
    }
    return $this->discovery;
  }

  /**
   * {@inheritdoc}
   */
  protected function providerExists($provider) {
    return $this->moduleHandler->moduleExists($provider) || $this->themeHandler->themeExists($provider);
  }

  /**
   * {@inheritdoc}
   */
  public function clearCachedDefinitions() {
    parent::clearCachedDefinitions();
    $this->instances = [];
  }

}
