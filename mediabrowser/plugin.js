'use strict';

/**
 * Media Browser
 */
(function (CKEDITOR) {
    /**
     * Plugin
     */
    CKEDITOR.plugins.add('mediabrowser', {requires: 'api'});

    /**
     * Dialog definition
     */
    CKEDITOR.on('dialogDefinition', dialogDefinition);

    /**
     * Public API
     *
     * @class
     * @singleton
     * @deprecated Use api plugin {@see CKEDITOR.api} directly
     */
    CKEDITOR.mediabrowser = {
        /**
         * Opens a mediabrowser window and executes given callback function when a message from the mediabrowser window
         * is received and closes the browser window
         *
         * @param {string} url
         * @param {function} call
         */
        open: function (url, call) {
            CKEDITOR.api.browser(url, 'mediabrowser', call);
        },

        /**
         * Opens a new mediabrowser window with given options
         *
         * @param {string} url
         * @param {string|null} opts
         *
         * @return {Window}
         */
        popup: function (url, opts) {
            return CKEDITOR.api.popup(url, 'mediabrowser', opts);
        },

        /**
         * Returns origin from given URL
         *
         * @param {string} url
         *
         * @return {string}
         */
        getOrigin: function (url) {
            return CKEDITOR.api.origin(url);
        }
    };

    /**
     * Listener for dialogDefinition event
     *
     * @param {CKEDITOR.eventInfo} ev
     */
    function dialogDefinition (ev) {
        if (!!ev.editor.plugins.mediabrowser && !!ev.editor.config.mediabrowserUrl) {
            browserDialog(ev.editor.config.mediabrowserUrl, ev.data.definition);
        }
    }

    /**
     * Initializes all mediabrowser buttons for given dialog definition
     *
     * @param {string} url
     * @param {CKEDITOR.dialog.definition} def
     */
    function browserDialog(url, def) {
        if (!!url && Array.isArray(def.contents) && def.contents.length > 0) {
            for (var i = 0; i < def.contents.length; ++i) {
                if (def.contents[i] && def.contents[i].elements) {
                    browserRegister(url, def.contents[i].elements);
                }
            }
        }
    }

    /**
     * Recursively finds and unhides all mediabrowser button elements and sets the onClick callback
     *
     * A mediabrowser button is a button element with a `mediabrowser` property that is a callback function. This
     * callback function is later executed when the mediabrowser window sends a message.
     *
     * @param {string} url
     * @param {CKEDITOR.dialog.definition.uiElement[]} items
     */
    function browserRegister(url, items) {
        if (!!url && Array.isArray(items)) {
            items.forEach(function (item) {
                if (item.type === 'button' && item.hasOwnProperty('mediabrowser') && typeof item.mediabrowser === 'function') {
                    item.hidden = false;
                    item.onClick = function (ev) {
                        CKEDITOR.api.browser(url, 'mediabrowser', function (data) {
                            ev.sender.mediabrowser.call(ev.sender, data);
                        });
                    };
                } else if (defaults.container.indexOf(item.type) >= 0 && item.children && item.children.length > 0) {
                    browserRegister(url, item.children);
                }
            });
        }
    }
})(CKEDITOR);
