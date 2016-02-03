<?php

/**
 * @file
 * Contains \Drupal\views\Plugin\views\pager\jcarouselPager.
 */
namespace Drupal\jcarousel\Plugin\views\pager;
use Drupal\views\Plugin\views\pager\SqlBase;

/**
 * The plugin to handle full pager.
 *
 * @ingroup views_pager_plugins
 *
 * @ViewsPager(
 *   id = "jcarousel_pager",
 *   title = @Translation("jCarousel (Please use for preload with Ajax enabled views)"),
 *   short_title = @Translation("jCarousel"),
 *   help = @Translation("Paged output, jCarousel style"),
 *   theme = "jcarousel_pager",
 * )
 */
class jcarouselPager extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function summaryTitle() {
    if (!empty($this->options['offset'])) {
      return $this->formatPlural($this->options['items_per_page'], 'jCarousel pager, @count item, skip @skip', 'jCarousel pager, @count items, skip @skip', array('@count' => $this->options['items_per_page'], '@skip' => $this->options['offset']));
    }
    return $this->formatPlural($this->options['items_per_page'], 'jCarousel pager, @count item', 'jCarousel pager, @count items', array('@count' => $this->options['items_per_page']));
  }

  /**
   * {@inheritdoc}
   */
  public function query() {
    parent::query();

    // Don't query for the next page if we have a pager that has a limited
    // amount of pages.
    if ($this->getItemsPerPage() > 0 && (empty($this->options['total_pages']) || ($this->getCurrentPage() < $this->options['total_pages']))) {
      // Increase the items in the query in order to be able to find out whether
      // there is another page.
      $limit = $this->view->query->getLimit();
      $limit += 1;
      $this->view->query->setLimit($limit);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function useCountQuery() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function postExecute(&$result) {
    // In query() one more item might have been retrieved than necessary. If so,
    // the next link needs to be displayed and the item removed.
    if ($this->getItemsPerPage() > 0 && count($result) > $this->getItemsPerPage()) {
      array_pop($result);
      // Make sure the pager shows the next link by setting the total items to
      // the biggest possible number but prevent failing calculations like
      // ceil(PHP_INT_MAX) we take PHP_INT_MAX / 2.
      $total = PHP_INT_MAX / 2;
    }
    else {
      $total = $this->getCurrentPage() * $this->getItemsPerPage() + count($result);
    }
    $this->total_items = $total;
  }

  /**
   * {@inheritdoc}
   */
  public function render($input) {}

}
