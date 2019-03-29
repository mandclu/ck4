# Block Widget

This widget

    <block id=""/>

    <div data-block=""></div>

How ou you the id is up to you. You can use

    <block id="1"/>

or

    <block id="block_example/1"/>

or whatever makes sense to you

## Block API

as string

    config.blockApi = '/example/url/to/api';

will produce a request to

    config.blockApi + '?id=' + id

or as callback function, p.e.

    config.blockApi = function (id) {
        return '/example/url/to/api/' + id ;
    };

## Block Browser

In order to enable the block browser you need

1. the [browser-plugin](https://ckeditor.com/cke4/addon/browser),
2. a browser implementation that uses the browser plugin and
3. to configure the URL to the browser implementation


    config.blockBrowser = '/example/url/to/browser';

Please check out the [demo](https://akilli.github.io/rte/ck4) to see this optional feature in action. The source code of the demo editor [configuration](https://github.com/akilli/rte/blob/master/ck4/index.js) and [minimalistic browser implementation](https://github.com/akilli/rte/tree/master/browser) could be a starting point for your own implemementation. 
