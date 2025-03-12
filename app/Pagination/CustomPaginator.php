<?php

namespace App\Pagination;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\UrlWindow;

class CustomPaginator extends LengthAwarePaginator
{
    /**
     * Number of page links displayed on each side of current page.
     */
    public $onEachSide = 0; // Default to 1 instead of Laravel's default 3
    
    /**
     * Customize the pagination links with fewer elements.
     */
    protected function elements()
    {
        // Create a custom window with fewer pages on each side
        $window = UrlWindow::make($this);
        
        // Simplified element array with fewer items
        return array_filter([
            // Only include first if not already in slider
            isset($window['slider'][1]) ? null : $window['first'],
            // Only show one ellipsis instead of potentially two
            (!isset($window['slider'][1]) && is_array($window['slider'])) ? '...' : null,
            $window['slider'],
            // Only show last pages if they aren't already part of the slider
            (isset($window['last']) && $window['last'] && !isset($window['slider'][$this->lastPage()])) ? '...' : null,
            (isset($window['last']) && $window['last'] && !isset($window['slider'][$this->lastPage()])) ? $window['last'] : null,
        ]);
    }
    
    /**
     * Set the number of links to display on each side.
     *
     * @param  int  $count
     * @return $this
     */
    public function onEachSide($count)
    {
        $this->onEachSide = $count;
        
        return parent::onEachSide($count);
    }
}
