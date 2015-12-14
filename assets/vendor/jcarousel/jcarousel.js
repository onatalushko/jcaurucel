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

        instance.on('jcarousel:visiblein', 'li', function(event, carousel) {

          console.log('jcarousel:visiblein start');
          console.log(event);
          console.log(carousel);
          console.log('jcarousel:visiblein end');



        });

      });

      //
      //  // Add navigation to the carousel if enabled.
      //  if (!callbacks.create) {
      //    $carousel.on('jcarousel:create', function(event, carousel) {
      //      console.log(event);
      //      console.log(carousel);
      //      console.log('jcarousel:create triggered');
      //      Drupal.jcarousel.createCarousel(event, carousel);
      //        //if (options.navigation) {
      //        //  Drupal.jcarousel.addNavigation(carousel, options.navigation);
      //        //}
      //        if (options.responsive) {
      //          carousel.reload();
      //        }
      //      if (options.navigation && !options.itemVisibleInCallback) {
      //        options.itemLastInCallback = {
      //          onAfterAnimation: Drupal.jcarousel.updateNavigationActive
      //        };
      //      }
      //    });
      //  }

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
        element.on(ev, Drupal[behavior[0]][behavior[1]](event, element));
      }
    }
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
  Drupal.jcarousel.animateCallback = function (event, carousel) {
    console.log('animate');
  };
  Drupal.jcarousel.inactiveCallback = function (event, carousel) {
    console.log('inactive');
    console.log(event);
    console.log(carousel);
  };
//  Drupal.jcarousel.ajaxLoadCallback = function (jcarousel, state) {
  Drupal.jcarousel.ajaxLoadCallback = function (event, carousel, target, animate) {
    console.log('scroll');
    if (typeof carousel.jcarousel('options').ajaxPath == "undefined") {
      return ;
    }
    // Check if the requested items already exist.
    console.log(event);
    console.log(target);
    console.log(animate);
    console.log(carousel.jcarousel('options'));
//    if (state == 'init' || jcarousel.has(jcarousel.first, jcarousel.last)) {
//      return;
//    }
//
//    var $list = carousel.jcarousel('items').size();
//    console.log($list);
//    var $first = carousel.jcarousel('first');
//    var $last = carousel.jcarousel('last');
//    var $view = $list.parents('.view:first');
    var ajaxPath = carousel.jcarousel('options').ajaxPath;

    var last = carousel.last();
    var lastIndex  = carousel.index(last);
    var total      = carousel.jcarousel('items').size();
    console.log(lastIndex);
    console.log(total);

    if (lastIndex == (total - 1)) {
      console.log('last');
      //Drupal.views.ajaxView.attachPagerLinkAjax('1','link');
    }


//      .jcarousel.ajaxPath;
//    var target = $view.get(0);
//
     //Find this view's settings in the Views AJAX settings.
//    var settings;
//    $.each(drupalSettings.jcarousel.carousels, function (domID, carouselSettings) {
//      if ($list.is('.' + domID)) {
//        settings = carouselSettings['view_options'];
//      }
//    });
//
    //Copied from ajax_view.js:
    //var viewData = {
    //  'js': 1,
    //  'first': $first - 1,
    //  'last': $last
    //};
   // Construct an object using the settings defaults and then overriding
   // with data specific to the link.
//   $.extend(
//     viewData,
//     settings
//   );
//
//    $.ajax({
//      url: ajaxPath,
//      type: 'GET',
//      data: viewData,
//      success: function (response) {
//        Drupal.jcarousel.ajaxResponseCallback(jcarousel, target, response);
//      },
//      error: function (xhr) {
//        Drupal.jcarousel.ajaxErrorCallback(xhr, ajaxPath);
//      },
//      dataType: 'json'
//    });
//
  };

  /**
   * Init callback for jCarousel. Pauses the carousel when hovering over.
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

  /**
  * Setup callback for jCarousel. Calculates number of pages.
  */
  Drupal.jcarousel.createCarousel = function (event, carousel) {
    console.log('create');
    // Determine the number of pages this carousel includes.
    // This only works for a positive starting point. Also, .first is 1-based
    // while .last is a count, so we need to reset the .first number to be
    // 0-based to make the math work.
    carousel.pageSize = carousel.last - (carousel.first - 1);

    // jCarousel's Views integration sets "size" in the carousel options. Use that
    // if available, otherwise count the number of items in the carousel.
    var itemCount = carousel.options.size ? carousel.options.size : $(carousel.list).children('li').length;
    carousel.pageCount = Math.ceil(itemCount / carousel.pageSize);
    carousel.pageNumber = 1;

    // Disable the previous/next arrows if there is only one page.
    if (carousel.options.wrap != 'circular' && carousel.pageCount == 1) {
      carousel.buttons(false, false);
    }
  };

 /**
  * itemVisibleInCallback for jCarousel. Update the navigation after page change.
  */
  Drupal.jcarousel.updateNavigationActive = function (carousel, item, idx, state) {
    // The navigation doesn't even exist yet when this is called on init.
    var $listItems = $(carousel.list).parents('.jcarousel-container:first').find('.jcarousel-navigation li');
    if ($listItems.length == 0) {
      return;
    }

    // jCarousel does some very odd things with circular wraps. Items before the
    // first item are given negative numbers and items after the last are given
    // numbers beyond the total number of items. This complicated logic calculates
    // which page number is active based off this numbering scheme.
    var pageNumber = Math.ceil(idx / carousel.pageSize);
    if (pageNumber <= 0 || pageNumber > carousel.pageCount) {
      pageNumber = pageNumber % carousel.pageCount;
      pageNumber = pageNumber == 0 ? carousel.pageCount : pageNumber;
      pageNumber = pageNumber < 0 ? pageNumber + carousel.pageCount : pageNumber;
    }
    carousel.pageNumber = pageNumber;
    var currentPage = $listItems.get(carousel.pageNumber - 1);

    // Set the current page to be active.
    $listItems.not(currentPage).removeClass('active');
    $(currentPage).addClass('active');
  }

  /**
  * AJAX callback for all jCarousel-style views.
  */
  Drupal.jcarousel.ajaxResponseCallback = function (jcarousel, target, response) {
    if (response.debug) {
      alert(response.debug);
    }

    var $view = $(target);
    var jcarousel = $view.find('ul.jcarousel').data('jcarousel');

    // Add items to the jCarousel.
    $('ul.jcarousel > li', response.display).each(function (i) {
      var itemNumber = this.className.replace(/.*?jcarousel-item-(\d+).*/, '$1');
      jcarousel.add(itemNumber, this.innerHTML);
    });

    // Add Drupal behaviors to the content of the carousel to affect new items.
    Drupal.attachBehaviors(jcarousel.list.get(0));

    // Treat messages the same way that Views typically handles messages.
    if (response.messages) {
      // Show any messages (but first remove old ones, if there are any).
      $view.find('.views-messages').remove().end().prepend(response.messages);
    }
  };

  /**
  * Display error messages using the same mechanism as Views module.
  */
  Drupal.jcarousel.ajaxErrorCallback = function (xhr, path) {
    var error_text = '';

    if ((xhr.status == 500 && xhr.responseText) || xhr.status == 200) {
      error_text = xhr.responseText;

      // Replace all &lt; and &gt; by < and >
      error_text = error_text.replace("/&(lt|gt);/g", function (m, p) {
        return (p == "lt") ? "<" : ">";
      });

      // Now, replace all html tags by empty spaces
      error_text = error_text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, "");

      // Fix end lines
      error_text = error_text.replace(/[\n]+\s+/g, "\n");
    }
    else {
      if (xhr.status == 500) {
        error_text = xhr.status + ': ' + Drupal.t("Internal server error. Please see server or PHP logs for error information.");
      }
      else {
        error_text = xhr.status + ': ' + xhr.statusText;
      }
    }

    alert(Drupal.t("An error occurred at @path.\n\nError Description: @error", {
      '@path': path,
      '@error': error_text
    }));
  };
  console.log('00');
  console.log(Drupal.views);

  if (typeof Drupal.views != 'undefined') {
    Drupal.views.ajaxView.prototype.attachPagerLinkAjax = function (id, link) {
      var $link = $(link);
      var viewData = {};
      var href = $link.attr('href');
      // Construct an object using the settings defaults and then overriding
      // with data specific to the link.
      $.extend(
        viewData,
        this.settings,
        Drupal.Views.parseQueryString(href),
        // Extract argument data from the URL.
        Drupal.Views.parseViewArgs(href, this.settings.view_base_path)
      );

      var jCarousel = $(this.element_settings.selector).find('[data-jcarousel]');
      console.log(jCarousel);
      if (jCarousel.length) {
        this.element_settings.url = drupalSettings.path.baseUrl + 'jcarousel/views/ajax';
        this.element_settings.progress.type = 'jcarousel';
        if (isNaN(this.element_settings.submit.page)) {
          this.element_settings.submit.page = 1;
        }
        console.log(this.element_settings);
        //this.element_settings.success = onSuccess;
      }

      console.log('page');
      console.log(this.element_settings.submit.page);
      var self_settings = $.extend({}, this.element_settings, {
        submit: viewData,
        base: false,
        element: $link
      });
      self_settings.submit.page = this.element_settings.submit.page;
      if (jCarousel.length && this.element_settings.submit.stop_preload) {
        return false;
      }

      this.pagerAjax = Drupal.ajax(self_settings);
    };

    ///**
    // * Attach the ajax behavior to each link.
    // */
    //  Drupal.views.ajaxView.prototype.attachPagerAjax = function () {
    //  this.$view.find('ul.js-pager__items > li > a, th.views-field a, .attachment .views-summary a, a.jcarousel-control-next')
    //    .each(jQuery.proxy(this.attachPagerLinkAjax, this));
    //};
  }

  /**
   * Sets the throbber progress indicator.
   */
  Drupal.Ajax.prototype.setProgressIndicatorJcarousel = function () {
    console.log('progress');
    console.log(this);
    var jCarousel = $(this.element_settings.selector).find('[data-jcarousel]');
    console.log(jCarousel.jcarousel('items').size());
    this.progress.element = $('<li><div class="ajax-progress ajax-progress-throbber ajax-progress-jcarousel"><div class="throbber">&nbsp;</div></div></li>');
    jCarousel.jcarousel('list').append(this.progress.element);
    jCarousel.jcarousel('reload');
    console.log(jCarousel.jcarousel('items').size());
    if (this.progress.message) {
      this.progress.element.find('.throbber').after('<div class="message">' + this.progress.message + '</div>');
    }
    $(this.element).after(this.progress.element);
  };

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
  Drupal.AjaxCommands.prototype.jcarousel_append = function(ajax, response, status) {
    // Get information from the response. If it is not there, default to
    // our presets.
    var wrapper = response.selector ? $(response.selector + ' .jcarousel-wrapper') : $(ajax.wrapper + ' .jcarousel-wrapper');
    var slide_parent = wrapper.find('ul');
    var jCarousel = wrapper.find('[data-jcarousel]');
    var control = $(ajax.element);
    var control_options = control.jcarouselControl('options');
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
    else if (effect.showEffect !== 'show') {
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
    jCarousel.jcarousel('scroll', control_options.target);


    console.log(ajax);
    if (isNaN(ajax.element_settings.submit.page)) {
      ajax.element_settings.submit.page = 1;
    }
    else {
      ajax.element_settings.submit.page++;
    }

    ajax.element_settings.submit.stop_preload = response.stop_preload;

    //if (response.stop_preload) {
    //  control.jcarouselControl('destroy');
    //  // Unbind ajax preload.
    //  control.unbind('click');
    //  control.jcarouselControl(control_options);
    //}

  }

})(jQuery, Drupal, window, drupalSettings);
