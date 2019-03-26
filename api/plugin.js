'use strict';

(function (window, document, CKEDITOR) {
    /**
     * Defaults
     */
    var defaults = {
        browser: {
            name: 'browser',
            opts: 'alwaysRaised=yes,dependent=yes,height=' + window.screen.height + ',location=no,menubar=no,' +
                'minimizable=no,modal=yes,resizable=yes,scrollbars=yes,toolbar=no,width=' + window.screen.width
        },
        container: ['hbox', 'vbox', 'fieldset'],
        media: {
            audio: {
                element: 'audio',
                mime: [
                    'audio/aac', 'audio/flac', 'audio/mp3', 'audio/mpeg', 'audio/mpeg3', 'audio/ogg', 'audio/wav', 'audio/wave', 'audio/webm',
                    'audio/x-aac', 'audio/x-flac', 'audio/x-mp3', 'audio/x-mpeg', 'audio/x-mpeg3', 'audio/x-pn-wav', 'audio/x-wav'
                ]
            },
            iframe: {
                element: 'iframe',
                mime: ['text/html']
            },
            image: {
                element: 'img',
                mime: ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
            },
            video: {
                element: 'video',
                mime: ['video/mp4', 'video/ogg', 'video/webm']
            }
        }
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
         * Opens a browser window with given name and executes given callback function when a message from the browser
         * window is received and closes the browser window
         *
         * @param {string} url
         * @param {function} call
         * @param {string} [name = "browser"]
         * @param {string} [opts = null]
         */
        browser: function (url, call, name, opts) {
            if (!url || typeof call !== 'function') {
                return;
            }

            var win = window.open(url, name || defaults.browser.name, opts || defaults.browser.opts);
            var origin;

            try {
                origin = win.origin || win.location.origin;
            } catch (e) {
                console.log(e);
                origin = CKEDITOR.api.url.origin(url);
            }

            window.addEventListener('message', function (ev) {
                if (ev.origin === origin && ev.source === win) {
                    call(ev.data);
                    win.close();
                }
            }, false);
        },

        /**
         * Applies a callback function on all UI elements in given dialog definition
         *
         * @param {CKEDITOR.dialog.definition} def
         * @param {Function} call
         */
        dialog: function (def, call) {
            if (def.hasOwnProperty('contents') && Array.isArray(def.contents) && def.contents.length > 0 && typeof call === 'function') {
                def.contents.forEach(function (item) {
                    dialogApply(item.elements, call);
                });
            }
        },

        /**
         * Media API
         */
        media: {
            /**
             * Returns all type names
             *
             * @return {string[]}
             */
            all: function () {
                return Object.getOwnPropertyNames(defaults.media);
            },

            /**
             * Determines type from HTML element
             *
             * @param {string} element
             *
             * @return {string|null}
             */
            fromElement: function (element) {
                var types = Object.getOwnPropertyNames(defaults.media);

                for (var i = 0; i < types.length; ++i) {
                    if (defaults.media[types[i]].element === element) {
                        return types[i];
                    }
                }

                return null;
            },

            /**
             * Determines type from URL by trying to map the content
             *
             * @param {string} url
             *
             * @return {string|null}
             */
            fromUrl: function (url) {
                var contentType = CKEDITOR.api.xhr.head(url, {'content-type': null})['content-type'] || null;

                if (!!contentType) {
                    var type = contentType.split(';')[0].trim();
                    var types = Object.getOwnPropertyNames(defaults.media);

                    for (var i = 0; i < types.length; ++i) {
                        if (defaults.media[types[i]].mime.indexOf(type) >= 0) {
                            return types[i];
                        }
                    }
                }

                return null;
            },

            /**
             * Returns HTML element for given type
             *
             * @param {string} type
             *
             * @return {string|null}
             */
            element: function (type) {
                return defaults.media.hasOwnProperty(type) ? defaults.media[type].element : null;
            }
        },

        /**
         * URL API
         */
        url: {
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
             * Transforms given URL to a root-relative or absolute URL depending on its origin
             *
             * @param {string} url
             *
             * @return {string}
             */
            root: function (url) {
                var a = document.createElement('a');
                a.href = url;

                return a.origin === (window.origin || window.location.origin) ? a.pathname : a.href;
            }
        },

        /**
         * XMLHttpRequest API
         */
        xhr: {
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
            }
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

    /**
     * Recursively finds all UI elements considering container elements and applies given callback function on them
     *
     * @param {CKEDITOR.dialog.definition.uiElement[]} items
     * @param {Function} call
     */
    function dialogApply(items, call) {
        if (Array.isArray(items) && typeof call === 'function') {
            items.forEach(function (item) {
                if (item.hasOwnProperty('type') && defaults.container.indexOf(item.type) >= 0) {
                    dialogApply(item.children, call);
                } else {
                    call(item);
                }
            });
        }
    }
})(window, document, CKEDITOR);
