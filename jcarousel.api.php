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
 * @param $skins
 *   Associative array of skin definitions.
 */
function hook_jcarousel_skins_alter(&$skins) {
  // Change weight of the tango skin.
  $items['tango']['weight'] = 5;
}

/**
 * @} End of "addtogroup hooks".
 */
