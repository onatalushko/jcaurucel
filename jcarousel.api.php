<?php

/**
 * @file
 * Hooks provided by the jcarousel module.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Alter the jCarousel skin definitions.
 *
 * @param array $skins
 *   Associative array of skin definitions.
 */
function hook_jcarousel_skins_alter(&$skins) {
  // Change weight of the tango skin.
  $skins['tango']['weight'] = 5;
}

/**
 * Alter the jCarousel options.
 *
 * @param array $options
 *   Associative array of $options.
 */
function hook_jcarousel_options_alter(&$options) {

}

/**
 * @} End of "addtogroup hooks".
 */
