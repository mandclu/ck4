# Quote Widget

The _Quote Widget_ can be used as an alternative to the [Blockquote Plugin](https://ckeditor.com/cke4/addon/blockquote). It allows to wrap a blockquote element within a figure element and to add a caption in order to _"clearly relate a quote to its attribution"_ (see [WHATWG](https://html.spec.whatwg.org/multipage/grouping-content.html#the-blockquote-element)). 

The figure element will have the CSS class `quote`, so the resulting HTML would be 

    <figure class="quote>
        <blockquote>
            ...
        </blockquote>
        <figcaption>
            ...
        </figcaption>
    </figure>

If the caption is empty, the blockquote element will be unwrapped, so the resulting HTML would just be

    <blockquote>
        ...
    </blockquote>


## Demo

https://akilli.github.io/rte/ck4

## Minimalistic browser example

https://github.com/akilli/rte/tree/master/browser
