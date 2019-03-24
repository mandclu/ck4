'use strict';

(function (window, document, console, XMLHttpRequest, CKEDITOR) {
    /**
     * Defaults
     */
    var defaults = {
        popup: 'alwaysRaised=yes,dependent=yes,height=' + window.screen.height + ',location=no,menubar=no,' +
            'minimizable=no,modal=yes,resizable=yes,scrollbars=yes,toolbar=no,width=' + window.screen.width
    };

    /**
     * Plugin
     */
    CKEDITOR.plugins.add('api', {});

    /**
     * Public API
     *
     * @class
     * @singleton
     */
    CKEDITOR.api = {
        /**
         * Sends a XMLHttpRequest with given method and returns the response as text
         *
         * @param {string} method
         * @param {string} url
         * @param {string|null} body
         *
         * @return {string|null}
         */
         request: function (method, url, body) {
            if (!method || !url) {
                return null;
            }

            var xhr = new XMLHttpRequest();

            try {
                xhr.open(method, url, false);
                xhr.send(body);

                if (xhr.readyState === xhr.DONE && xhr.status >= 200 && xhr.status < 300) {
                    return xhr.responseText;
                }
            } catch (e) {
                console.log(e);
            }

            return null;
        },

        /**
         * Sends a XMLHttpRequest with the GET method
         *
         * @param {string} url
         *
         * @return {string|null}
         */
        get: function (url) {
            return CKEDITOR.api.request('GET', url, null);
        },

        /**
         * Sends a XMLHttpRequest with the HEAD method
         *
         * @param {string} url
         *
         * @return {string|null}
         */
        head: function (url) {
            return CKEDITOR.api.request('HEAD', url, null);
        },

        /**
         * Sends a XMLHttpRequest with the POST method
         *
         * @param {string} url
         * @param {string} body
         *
         * @return {string|null}
         */
        post: function (url, body) {
            return CKEDITOR.api.request('POST', url, body);
        },

        /**
         * Opens a browser window with given name and executes given callback function when a message from browser
         * window is received and closes the browser window
         *
         * @param {string} url
         * @param {string} name
         * @param {function} call
         */
        browser: function (url, name, call) {
            if (!url || !name || typeof call !== 'function') {
                return;
            }

            var win = CKEDITOR.api.popup(url, name, null);
            var origin;

            try {
                origin = win.origin || win.location.origin;
            } catch (e) {
                console.log(e);
                origin = CKEDITOR.api.origin(url);
            }

            window.addEventListener('message', function (ev) {
                if (ev.origin === origin && ev.source === win) {
                    call(ev.data);
                    win.close();
                }
            }, false);
        },

        /**
         * Opens a new window with given name and options
         *
         * @param {string} url
         * @param {string} name
         * @param {string|null} opts
         *
         * @return {Window}
         */
        popup: function (url, name, opts) {
            return window.open(url, name, opts || defaults.popup);
        },

        /**
         * Returns origin from given URL
         *
         * @param {string} url
         *
         * @return {string}
         */
        origin: function (url) {
            var a = document.createElement('a');
            a.href = url;

            return a.origin;
        }
    };
})(window, document, console, XMLHttpRequest, CKEDITOR);
