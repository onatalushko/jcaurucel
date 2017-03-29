/**
 * @file
 * Add jCarousel behaviors to the page and provide Views-support.
 */

(function ($, Drupal, window, drupalSettings) {
  "use strict";

  Drupal.behaviors.jcarousel = {
    attach: function (context) {
      $(context).find('[data-jcarousel]').once('jcarousel').each(function() {

        // Analyze options.
        var options = $(this).data();
        var events = options.events;
        delete options.events;
        var autoscroll_options = {};
        for (var option in options) {
          if (option.indexOf('autoscroll') == 0) {
            var param_name = option.replace('autoscroll', '');
            autoscroll_options[param_name] = options[option];
            delete options[option];
          }
        }

        // Init jCarousel.
        var instance = $(this).jcarousel(options);
        Drupal.jcarousel.attachEvents(events, instance);

        if ($(instance).closest('[class*="js-view-dom-id-"]').length > 0) {
          // Preload next page.
          var preload_page = $(instance).data('preload-page') || false;
          if (preload_page) {
            Drupal.jcarousel.attachAjaxPreload($(instance), 'jcarousel:last');
          }

          instance.on('jcarousel:scroll', function(event, carousel) {
            // Trigger jcarousel:last to force ajax page preload.
            var last = carousel.last();
            var lastIndex  = carousel.index(last);
            var total      = carousel.items().length;
            if (lastIndex == (total - 1)) {
              var preload_page = $(this).attr('data-preload-page') || false;
              if (preload_page) {
                event.preventDefault();
                $(this).trigger('jcarousel:last');
              }
            }
          });

        }

        // Init autoscroll plugin if any autoscroll option available.
        if (Object.getOwnPropertyNames(autoscroll_options).length > 0) {
          instance.jcarouselAutoscroll(autoscroll_options);
          Drupal.jcarousel.attachEvents(events, instance);
        }

        // Init control plugin.
        $(this).siblings('[data-jcarousel-control]').each(function() {
          var options = $(this).data();
          var events = options.events;
          delete options.events;
          var control = $(this).jcarouselControl(options);

          Drupal.jcarousel.attachEvents(events, control);
        });

      });
    }
  };

  Drupal.jcarousel = {};

  /**
   * Attach event callbacks.
   *
   * @param events
   *   Event array.
   * @param element
   *   jCarousel object.
   */
  Drupal.jcarousel.attachEvents = function(events, element) {
    for (var ev in events) {
      var behavior = events[ev].split('.');
      if ($.isFunction(Drupal[behavior[0]][behavior[1]])) {
        element.on(ev, Drupal[behavior[0]][behavior[1]](ev, element));
      }
    }
  };

  /**
   * Attach ajax preload.
   *
   * @param element
   *   jQuery element ajax preload attached to.
   * @param event
   *   Event name.
   */
  Drupal.jcarousel.attachAjaxPreload = function (element, event) {
    var preload_page = element.data('preload-page') || false;
    var ajax_path = element.data('ajax-path') || 'jcarousel/views/ajax';
    var classes  = element.closest('[class*="js-view-dom-id-"]').attr('class');
    var views_id = classes.split(' ').filter(function(element){
      return element.split('js-view-dom-id-').length == 2;
    });

    var views_dom_id = '';
    if (views_id.length == 1) {
      views_dom_id = 'views_dom_id:' + views_id[0].split('js-view-dom-id-')[1];
    }

    var viewData = drupalSettings.views.ajaxViews[views_dom_id] || {};
    var pager = {page : preload_page};
    $.extend(
      viewData,
      pager
    );

    var  element_settings = {
      url: drupalSettings.path.baseUrl + ajax_path,
      base: views_dom_id,
      event: event,
      progress: {
        type: 'jcarousel'
      },
      submit: viewData,
      element: element
    };

    Drupal.ajax(element_settings);
  };

  Drupal.jcarousel.reloadCallback = function (event, carousel) {
    console.log('reload');
    // Set the clip and container to auto width so that they will fill
    // the available space.
    var width = carousel.innerWidth();
    carousel.jcarousel('items').css('width', 'auto');
//    carousel.jcarousel('items').css('width', width + 'px');
//    carousel.carousel('items')container.css('width', 'auto');
//    carousel.clip.css('width', 'auto');
//    var clipWidth = carousel.clip.width();
//    var containerExtra = carousel.container.width() - carousel.clip.outerWidth(true);
//     Determine the width of an item.
    var itemWidth = carousel.jcarousel('items').find('li').first().outerWidth(true);
    var numItems = Math.floor(width / itemWidth) || 1;
    carousel.jcarousel('items').css('width', itemWidth + 'px');

//    var numItems = Math.floor(carousel.clip.width() / itemWidth) || 1;
//     Set the new scroll number.
//    carousel.options.scroll = numItems;
//    var newClipWidth = numItems * itemWidth;
//    var newContainerWidth = newClipWidth + containerExtra;
//     Resize the clip and container.
//    carousel.clip.width(newClipWidth);
//    carousel.container.width(newContainerWidth);
  };

  /**
   * Auto pause callback for jCarousel. Pauses the carousel when hovering over.
   */
  Drupal.jcarousel.autoPauseCallback = function (event, carousel) {
    function pauseAuto() {
      carousel.jcarouselAutoscroll('stop');
    }
    function resumeAuto() {
      carousel.jcarouselAutoscroll('start');
    }
    if (carousel.jcarouselAutoscroll) {
      carousel.hover(pauseAuto, resumeAuto);
    }
  };

  if (typeof Drupal.Ajax != "undefined") {
    /**
     * Sets the throbber progress indicator.
     */
    Drupal.Ajax.prototype.setProgressIndicatorJcarousel = function () {
      console.log('progress');
      console.log(this);
      var jCarousel = $(this.element_settings.selector).find('[data-jcarousel]');
      this.progress.element = $('<li><div class="ajax-progress ajax-progress-throbber ajax-progress-jcarousel"><div class="throbber">&nbsp;</div></div></li>');
      jCarousel.jcarousel('list').append(this.progress.element);
      jCarousel.jcarousel('reload');
      console.log(jCarousel.jcarousel('items').size());
      if (this.progress.message) {
        this.progress.element.find('.throbber').after('<div class="message">' + this.progress.message + '</div>');
      }
      $(this.element).after(this.progress.element);
    };
  }

  if (typeof Drupal.AjaxCommands != "undefined") {
    /**
     * Command to insert new jCarousel slide into the DOM.
     *
     * @param {Drupal.Ajax} ajax
     * @param {object} response
     * @param {string} response.data
     * @param {string} [response.method]
     * @param {string} [response.selector]
     * @param {object} [response.settings]
     * @param {number} [status]
     */
    Drupal.AjaxCommands.prototype.jcarousel_append = function (ajax, response, status) {
      // Get information from the response. If it is not there, default to
      // our presets.
      var wrapper = response.selector ? $(response.selector + ' .jcarousel-wrapper') : $(ajax.wrapper + ' .jcarousel-wrapper');
      var slide_parent = wrapper.find('ul');
      var jCarousel = wrapper.find('[data-jcarousel]');
      var jCarouselOptions = jCarousel.jcarousel('options');
//    var control = $(ajax.element);
//    var control_options = control.jcarouselControl('options');
      var method = response.method || ajax.method;
      var effect = ajax.getEffect(response);
      var settings;

      // jCarousel slide should be wrapped with $('<li></li>').
      var new_content_wrapped = $('<li></li>').html(response.data);
      var new_content = new_content_wrapped.contents();

      // For legacy reasons, the effects processing code assumes that
      // new_content consists of a single top-level element. Also, it has not
      // been sufficiently tested whether attachBehaviors() can be successfully
      // called with a context object that includes top-level text nodes.
      // However, to give developers full control of the HTML appearing in the
      // page, and to enable Ajax content to be inserted in places where DIV
      // elements are not allowed (e.g., within TABLE, TR, and SPAN parents),
      // we check if the new content satisfies the requirement of a single
      // top-level element, and only use the container DIV created above when
      // it doesn't. For more information, please see
      // https://www.drupal.org/node/736066.
      if (new_content.length !== 1 || new_content.get(0).nodeType !== 1) {
        new_content = new_content_wrapped;
      }

      // Add the new content to the page.
      slide_parent[method](new_content);

      // Immediately hide the new content if we're using any effects.
      if (effect.showEffect !== 'show') {
        new_content.hide();
      }

      // Determine which effect to use and what content will receive the
      // effect, then show the new content.
      if (new_content.find('.ajax-new-content').length > 0) {
        new_content.find('.ajax-new-content').hide();
        new_content.show();
        new_content.find('.ajax-new-content')[effect.showEffect](effect.showSpeed);
      }
      else
        if (effect.showEffect !== 'show') {
          new_content[effect.showEffect](effect.showSpeed);
        }

      // Attach all JavaScript behaviors to the new content, if it was
      // successfully added to the page, this if statement allows
      // `#ajax['wrapper']` to be optional.
      if (new_content.parents('html').length > 0) {
        // Apply any settings from the returned JSON if available.
        settings = response.settings || ajax.settings || drupalSettings;
        Drupal.attachBehaviors(new_content.get(0), settings);
      }

      // Reload jCarousel and scroll it forward.
      jCarousel.jcarousel('reload');
      // @todo get scroll count from carousel settings.
      jCarousel.jcarousel('scroll', '+=1');

      if (isNaN(ajax.element_settings.submit.page)) {
        ajax.element_settings.submit.page = 1;
      }
      else {
        if (response.settings.next_page == null) {
          jCarousel.removeAttr('data-preload-page');
        }
        else {
          ajax.element_settings.submit.page = response.settings.next_page;
        }
      }
    }
  }

})(jQuery, Drupal, window, drupalSettings);
