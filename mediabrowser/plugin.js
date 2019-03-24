'use strict';

/**
 * Mediabrowser API
 *
 * @deprecated You can use the API plugin directly instead
 * @see https://ckeditor.com/cke4/addon/api
 */
(function (window, document, CKEDITOR) {
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
            CKEDITOR.api.browserDialog(ev.editor.config.mediabrowserUrl, 'mediabrowser', 'mediabrowser', ev.data.definition);
        }
    }
})(window, document, CKEDITOR);
