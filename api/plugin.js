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
     */
    CKEDITOR.api = {
        /**
         * Sends a XMLHttpRequest with the GET method
         *
         * @param {string} url
         *
         * @return {string|null}
         */
        get: function (url) {
            return ajax('GET', url, null);
        },

        /**
         * Sends a XMLHttpRequest with the HEAD method
         *
         * @param {string} url
         *
         * @return {string|null}
         */
        head: function (url) {
            return ajax('HEAD', url, null);
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
            return ajax('POST', url, body);
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

            var win = this.popup(url, name, null);
            var origin;

            try {
                origin = win.origin || win.location.origin;
            } catch (e) {
                console.log(e);
                origin = this.getOrigin(url);
            }

            window.addEventListener('message', function (ev) {
                if (ev.origin === origin && ev.source === win) {
                    call(ev.data);
                    win.close();
                }
            }, false);
        }
    };

    /**
     * Sends a XMLHttpRequest with given method and returns the response as text
     *
     * @param {string} method
     * @param {string} url
     * @param {string|null} body
     *
     * @return {string|null}
     */
    function ajax(method, url, body) {
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
    }
})(window, document, console, XMLHttpRequest, CKEDITOR);
