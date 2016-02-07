
Description
-----------
This module provides a central function for adding jCarousel jQuery plugin
elements. For more information about jCarousel, visit the official project:
http://sorgalla.com/jcarousel/


Installation
------------
1) Place this module directory in your modules folder (this will usually be
   "modules/contrib").

2) Enable the module within your Drupal site at Administration -> Extend (admin/modules).

Usage
-----
The jCarousel module is most commonly used with the Views module to turn
listings of images or other content into a carousel.

1) Add a new view at Administration -> Structure -> Views (admin/structure/views).

2) Change the "Display format" of the view to "jCarousel". Click the
   "Continue & Edit" button to configure the rest of the View.

3) Enable views ajax and use special jCarousel pager if you need preload. jCarousel not compatible with standard pages.

4) Click on the "Settings" link next to the jCarousel Format to configure the
   options for the carousel such as the animation speed and skin.

5) Add the items you would like to include in the rotator under the "Fields"
   section, and build out the rest of the view as you would normally. Note that
   the preview of the carousel within Views probably will not appear correctly
   because the necessary JavaScript and CSS is not loaded in the Views
   interface. Save your view and visit a page URL containing the view to see
   how it appears.

API Usage
---------

The jcarousel_add function is deprecated in favor to Drupal 8 render API usage.

If you need to use jCarousel over hardcoded images list you can enable global load of jCarousel library and configure
each list via data atributes

The configuration options can be found at: http://sorgalla.com/projects/jcarousel/#Configuration

A few special keys may also be provided in $settings, such as $settings['skin'],
which can be used to apply a specific skin to the carousel. jCarousel module
comes with a few skins by default, but other modules can provide their own skins
by implementing MYMODULE.jcarousel_skins.yml file.

Example
-------

Skin implementation
Please add file MYMODULE.jcarousel_skins.yml into module or MYTHEME.jcarousel_skins.yml into theme

myskin:
  label: 'My Skin'
  file: assets/vendor/jcarousel/skins/myskin/jcarousel-myskin.css
  weight: 1

The following code in module will add a vertical jCarousel to the page:
  <?php
    $output = '';
    $renderer = \Drupal::service('renderer');
    $images = [
      'http://sorgalla.com/jcarousel/examples/_shared/img/img1.jpg',
      'http://sorgalla.com/jcarousel/examples/_shared/img/img2.jpg',
      'http://sorgalla.com/jcarousel/examples/_shared/img/img3.jpg',
      'http://sorgalla.com/jcarousel/examples/_shared/img/img4.jpg',
      'http://sorgalla.com/jcarousel/examples/_shared/img/img5.jpg',
      'http://sorgalla.com/jcarousel/examples/_shared/img/img6.jpg',
    ];
    $items_list = [];
    foreach ($images as $image) {
      $items_list[] = [
        '#theme' => 'image',
        '#uri' => $image,
        '#width' => '150px',
        '#height' => '100px',
        '#alt' => t('Image alt'),
      ];
    }
    $options = [
      'skin' => 'tango',
    ];
    $jcourusel = [
      '#theme' => 'jcarousel',
      '#options' => $options,
      '#items' => $items_list,
    ];
    $output .= $renderer->render($jcourusel);
  ?>
See jCarousel help page admin/help/jcarousel for more information.

Authors
-------
Nate Haug (http://quicksketch.org)
Matt Farina (http://www.mattfarina.com)
Wim Leers (work@wimleers.com | http://wimleers.com/work)
Rob Loach (http://www.robloach.net)
