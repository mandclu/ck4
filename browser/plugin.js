'use strict';

/**
 * Browser
 */
(function (CKEDITOR) {
    /**
     * Plugin
     */
    CKEDITOR.plugins.add('browser', {requires: 'api'});

    /**
     * Dialog definition
     */
    CKEDITOR.on('dialogDefinition', dialogDefinition);

    /**
     * Listener for dialogDefinition event
     *
     * @param {CKEDITOR.eventInfo} ev
     */
    function dialogDefinition (ev) {
        if (!!ev.editor.plugins.browser) {
            browserDialog(ev.data.definition);
        }
    }

    /**
     * Initializes all browser buttons for given dialog definition
     *
     * @param {CKEDITOR.dialog.definition} def
     */
    function browserDialog(def) {
        if (Array.isArray(def.contents) && def.contents.length > 0) {
            for (var i = 0; i < def.contents.length; ++i) {
                if (def.contents[i] && def.contents[i].elements) {
                   browserRegister(def.contents[i].elements);
                }
            }
        }
    }

    /**
     * Recursively finds and unhides all browser button elements and sets the onClick callback
     *
     * A browser button is a button element with a `browser` property that is a callback function and a `browserUrl`
     * with the URL to the browser page that will be opened in a new window. The `browser` callback function is later
     * executed when this browser window sends a message.
     *
     * @param {CKEDITOR.dialog.definition.uiElement[]} items
     */
    function browserRegister(items) {
        if (Array.isArray(items)) {
            items.forEach(function (item) {
                if (item.type === 'button' && typeof item.browser === 'function' && typeof item.browserUrl === 'string' && !!item.browserUrl) {
                    item.hidden = false;
                    item.onClick = function (ev) {
                        CKEDITOR.api.browser(item.browserUrl, 'browser', function (data) {
                            ev.sender.browser.call(ev.sender, data);
                        });
                    };
                } else if (defaults.container.indexOf(item.type) >= 0 && item.children && item.children.length > 0) {
                    browserRegister(item.children);
                }
            });
        }
    }
})(CKEDITOR);
