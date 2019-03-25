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
         * Sends a XMLHttpRequest with the DELETE method
         *
         * @param {string} url
         *
         * @return {string|null}
         */
        delete: function (url) {
            return request('DELETE', url);
        },

        /**
         * Sends a XMLHttpRequest with the GET method
         *
         * @param {string} url
         *
         * @return {string|null}
         */
        get: function (url) {
            return request('GET', url);
        },

        /**
         * Sends a XMLHttpRequest with the HEAD method and returns given response headers as an object
         *
         * @param {string} url
         * @param {Object} header
         *
         * @return {Object|null}
         */
        head: function (url, header) {
            return request('HEAD', url, null, header);
        },

        /**
         * Sends a XMLHttpRequest with the POST method
         *
         * @param {string} url
         * @param {string} body
         * @param {Object} [header = null]
         *
         * @return {string|null}
         */
        post: function (url, body, header) {
            return request('POST', url, body, header);
        },

        /**
         * Sends a XMLHttpRequest with the PUT method
         *
         * @param {string} url
         * @param {string} body
         * @param {Object} [header = null]
         *
         * @return {string|null}
         */
        put: function (url, body, header) {
            return request('PUT', url, body, header);
        },

        /**
         * Opens a browser window with given name and executes given callback function when a message from the browser
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

            var win = CKEDITOR.api.popup(url, name);
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
         * @param {string} [opts = null]
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

    /**
     * Sends a XMLHttpRequest with given method and returns the response as text
     *
     * @param {string} method
     * @param {string} url
     * @param {string|null} [body = null]
     * @param {Object|null} [header = {}]
     *
     * @return {Object|string|null}
     */
     function request(method, url, body, header) {
        if (!method || !url || method === 'HEAD' && typeof header === 'undefined') {
            return null;
        }

        body = typeof body === 'undefined' ? null : body;
        header = typeof header === 'undefined' || header !== Object(header) ? {} : header;
        var xhr = new XMLHttpRequest();

        if (method !== 'HEAD') {
            Object.getOwnPropertyNames(header).forEach(function (name) {
                xhr.setRequestHeader(name, header[name]);
            });
        }

        try {
            xhr.open(method, url, false);
            xhr.send(body);

            if (method === 'HEAD' && xhr.readyState === xhr.HEADERS_RECEIVED) {
                Object.getOwnPropertyNames(header).forEach(function (name) {
                    header[name] = xhr.getResponseHeader(name);
                });
                return header;
            }

            if (xhr.readyState === xhr.DONE && xhr.status >= 200 && xhr.status < 300) {
                return xhr.responseText;
            }
        } catch (e) {
            console.log(e);
        }

        return null;
    }
})(window, document, console, XMLHttpRequest, CKEDITOR);
