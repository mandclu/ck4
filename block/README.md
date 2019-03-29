# Block Widget

This widget let's you create and edit non-editable and optionally previewable placeholder blocks. You can edit the placeholder block through a simple dialog where you can enter an ID into a text input. Additionally, you can integrate a block browser similar to a file/media browser and select the block through that.

When you save the editor content, the resulting placeholder will be a `block`-element with an `id` attribute

    <block id=""/>

How you use the id-attribute is completely up to you. Whatever makes sense for you or rather your application is fine.

## Block Browser

In order to enable the block browser you need

1. the [browser-plugin](https://ckeditor.com/cke4/addon/browser),
2. a browser implementation that uses the browser plugin and
3. to configure the URL to the browser implementation


    config.blockBrowser = '/example/url/to/browser';

Please check out the [demo](https://akilli.github.io/rte/ck4) to see this optional feature in action. The source code of the demo editor [configuration](https://github.com/akilli/rte/blob/master/ck4/index.js) and [minimalistic browser implementation](https://github.com/akilli/rte/tree/master/browser) could be a starting point for your own implemementation. 

## Block API

as string

    config.blockApi = '/example/url/to/api';

will produce a request to

    config.blockApi + '?id=' + id

or as callback function, p.e.

    config.blockApi = function (id) {
        return '/example/url/to/api/' + id ;
    };
