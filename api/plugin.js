'use strict';

(function (window, document, console, XMLHttpRequest, CKEDITOR) {
    /**
     * Defaults
     */
    var defaults = {
        container: ['hbox', 'vbox', 'fieldset'],
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
         * Sends a XMLHttpRequest with the HEAD method and returns given response headers as an object
         *
         * @param {string} url
         * @param {string[]} headers
         *
         * @return {Object}
         */
        head: function (url, headers) {

            if (!url || !Array.isArray(headers) || headers.length <= 0) {
                return {};
            }

            var result = {};
            var xhr = new XMLHttpRequest();

            try {
                xhr.open('HEAD', url, false);
                xhr.send();

                if (xhr.readyState === xhr.HEADERS_RECEIVED) {
                    headers.forEach(function (item) {
                        result[item] = xhr.getResponseHeader(item);
                    });
                }
            } catch (e) {
                console.log(e);
            }

            return result;
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
         * Initializes all browser buttons for given dialog definition
         *
         * @param {string} url
         * @param {string} name
         * @param {string} prop
         * @param {CKEDITOR.dialog.definition} def
         */
        browserDialog: function (url, name, prop, def) {
            if (!!url && !!name && !!def.contents && Array.isArray(def.contents)) {
                for (var i = 0; i < def.contents.length; ++i) {
                    if (def.contents[i] && def.contents[i].elements) {
                        CKEDITOR.api.browserRegister(url, name, prop, def.contents[i].elements);
                    }
                }
            }
        },

        /**
         * Recursively finds and unhides all browser button elements and sets the onClick callback
         *
         * A browser button is a button element with a specific property `prop` that is a callback function. This
         * callback function is later executed when the browser window sends a message.
         *
         * @param {string} url
         * @param {string} name
         * @param {string} prop
         * @param {CKEDITOR.dialog.definition.uiElement[]} items
         */
        browserRegister: function (url, name, prop, items) {
            if (!!url && !!name && Array.isArray(items)) {
                items.forEach(function (item) {
                    if (item.type === 'button' && item.hasOwnProperty(prop) && typeof item[prop] === 'function') {
                        item.hidden = false;
                        item.onClick = function (ev) {
                            CKEDITOR.api.browser(url, name, function (data) {
                                ev.sender[prop].call(ev.sender, data);
                            });
                        };
                    } else if (defaults.container.indexOf(item.type) >= 0 && item.children && item.children.length > 0) {
                        CKEDITOR.api.browserRegister(url, name, prop, item.children);
                    }
                });
            }
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
