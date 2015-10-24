<?php
/**
 * Created by PhpStorm.
 * User: niko
 * Date: 24.10.15
 * Time: 14:09
 */

namespace Drupal\jcarousel;


interface jCarouselSkinsManagerInterface {
  public function getSkinsByGroup($group);
  public function getGroups();
  public function getGroupProviders($group);
}