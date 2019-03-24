'use strict';

(function (window, document, CKEDITOR) {
    /**
     * Defaults
     */
    var defaults = {
        align: {left: 'left', right: 'right'},
        attr: ['alt', 'height', 'src', 'width'],
        editables: {
            caption: {
                selector: 'figcaption',
                allowedContent: 'br em s strong sub sup u; a[!href]'
            }
        }
    };

    /**
     * Plugin
     */
    CKEDITOR.plugins.add('media', {
        requires: 'dialog,widget',
        icons: 'media',
        hidpi: true,
        lang: 'de,en,uk,ru',
        init: function (editor) {
            /**
             * Widget
             */
            editor.widgets.add('media', {
                button: editor.lang.media.title,
                dialog: 'media',
                template: '<figure class="image"><img /><figcaption></figcaption></figure>',
                editables: defaults.editables,
                allowedContent: 'figure(audio, iframe, image, video, left, right); a[!href]; audio[!src, controls]; iframe[!src, width, height, allowfullscreen]; img[!src, width, height, alt]; video[!src, width, height, controls]; figcaption',
                requiredContent: 'figure; audio iframe img video[src]; figcaption',
                defaults: {
                    align: '',
                    alt: '',
                    caption: false,
                    height: '',
                    link: '',
                    src: '',
                    type: '',
                    width: ''
                },
                upcast: function (el) {
                    var cls = function (e) {
                        var types = CKEDITOR.media.getTypes();

                        for (var i = 0; i < types.length; ++i) {
                            if (e.hasClass(types[i])) {
                                return true;
                            }
                        }

                        return false;
                    };
                    var crit = function (e) {
                        return e.name === 'figure' && cls(e);
                    };
                    var med = function (e) {
                        return !!CKEDITOR.media.getTypeFromElement(e.name);
                    };
                    var link = function (e) {
                        return e.name === 'a' && e.children.length === 1 && med(e.children[0]);
                    };

                    // Add missing caption
                    if (crit(el) && el.children.length === 1) {
                        el.add(new CKEDITOR.htmlParser.element('figcaption'));
                    }

                    return crit(el) && el.children.length === 2  && (med(el.children[0]) || link(el.children[0])) && el.children[1].name === 'figcaption'
                        || !crit(el) && med(el) && !el.getAscendant(crit);
                },
                downcast: function (el) {
                    if (el.name === 'figure') {
                        if (this.data.link && el.children[0].name === 'img') {
                            el.children[0].wrapWith(new CKEDITOR.htmlParser.element('a', {'href': this.data.link}));
                        }

                        if (!el.children[1].getHtml().trim()) {
                            el.children[1].remove();
                        } else {
                            el.children[1].attributes = [];
                        }
                    }
                },
                init: function () {
                    var widget = this;
                    var el = widget.element;
                    var media = el;
                    var a;

                    // Figure with caption + link
                    if (el.getName() === 'figure') {
                        widget.setData('caption', true);
                        media = el.getFirst();

                        if (media.getName() === 'a') {
                            widget.setData('link', media.getAttribute('href'));
                            media.getChild(0).move(el, true);
                            media.remove();
                            media = el.getFirst();
                        }
                    } else {
                        if (a = el.getAscendant('a')) {
                            widget.setData('link', a.getAttribute('href'));
                        }

                        widget.inline = true;
                    }

                    // Media
                    if (media.hasAttribute('src')) {
                        media.setAttribute('src', CKEDITOR.media.getUrl(media.getAttribute('src')));
                        widget.setData('type', CKEDITOR.media.getTypeFromElement(media.getName()));
                    }

                    defaults.attr.forEach(function (item) {
                        if (media.hasAttribute(item)) {
                            widget.setData(item, media.getAttribute(item));
                        }
                    });

                    // Align
                    if (el.hasClass(defaults.align.left)) {
                        widget.setData('align', 'left');
                    } else if (el.hasClass(defaults.align.right)) {
                        widget.setData('align', 'right');
                    }
                },
                data: function () {
                    var widget = this;
                    var el = widget.element;
                    var media = el;
                    var type = widget.data.type;
                    var name;
                    var caption = null;

                    if (!widget.data.src || !type || !(name = CKEDITOR.media.getTypeElement(type))) {
                        return;
                    }

                    CKEDITOR.media.getTypes().concat([defaults.align.left, defaults.align.right]).forEach(function (item) {
                        el.removeClass(item);
                    });

                    if (el.getName() === 'figure') {
                        media = el.getChild(0);
                        caption = el.getChild(1);
                    }

                    widget.inline = !widget.data.caption;

                    if (widget.data.caption && el.getName() !== 'figure') {
                        el.renameNode('figure');
                        defaults.attr.forEach(function (item) {
                            el.removeAttribute(item);
                        });
                        media = new CKEDITOR.dom.element(name);
                        el.append(media, true);
                        caption = new CKEDITOR.dom.element('figcaption');
                        el.append(caption);
                        widget.initEditable('caption', defaults.editables.caption);
                        widget.wrapper.renameNode('div');
                        widget.wrapper.removeClass('cke_widget_inline');
                        widget.wrapper.addClass('cke_widget_block');
                    } else if (!widget.data.caption && el.getName() === 'figure') {
                        el.renameNode(name);
                        media.remove();
                        media = el;
                        caption.remove();
                        caption = null;
                        widget.wrapper.renameNode('span');
                        widget.wrapper.removeClass('cke_widget_block');
                        widget.wrapper.addClass('cke_widget_inline');
                    }

                    if (el.getName() === 'figure') {
                        el.addClass(type);
                    }

                    if (media.getName() !== name) {
                        media.renameNode(name);
                    }

                    // Media attributes
                    media.setAttribute('src', widget.data.src);

                    if (widget.data.width) {
                        media.setAttribute('width', widget.data.width);
                    } else {
                        media.removeAttribute('width');
                    }

                    if (widget.data.height) {
                        media.setAttribute('height', widget.data.height);
                    } else {
                        media.removeAttribute('height');
                    }

                    if (type === 'image') {
                        media.removeAttribute('allowfullscreen');
                        media.setAttribute('alt', widget.data.alt);
                        media.removeAttribute('controls');
                    } else if (type === 'video') {
                        media.removeAttribute('allowfullscreen');
                        media.removeAttribute('alt');
                        media.setAttribute('controls', 'controls');
                    } else if (type === 'audio') {
                        media.removeAttribute('allowfullscreen');
                        media.removeAttribute('alt');
                        media.removeAttribute('height');
                        media.removeAttribute('width');
                        media.setAttribute('controls', 'controls');
                    } else if (type === 'iframe') {
                        media.setAttribute('allowfullscreen', 'allowfullscreen');
                        media.removeAttribute('alt');
                        media.removeAttribute('controls');
                    }

                    // Align
                    if (widget.data.align && defaults.align.hasOwnProperty(widget.data.align)) {
                        el.addClass(defaults.align[widget.data.align]);
                    }
                }
            });

            /**
             * Dialog
             */
            CKEDITOR.dialog.add('media', this.path + 'dialogs/media.js');
        }
    });

    /**
     * Dialog definition
     */
    CKEDITOR.on('dialogDefinition', dialogDefinition, null, null, 1);

    /**
     * Public API
     */
    CKEDITOR.media = {
        /**
         * Types
         */
        types: {
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
        },

        /**
         * Returns all type names
         *
         * @return {string[]}
         */
        getTypes: function () {
            return Object.getOwnPropertyNames(this.types);
        },

        /**
         * Indicates if given type exists
         *
         * @param {string} type
         *
         * @return {boolean}
         */
        hasType: function (type) {
            return this.types.hasOwnProperty(type);
        },

        /**
         * Determines type from HTML element
         *
         * @param {string} element
         *
         * @return {string|null}
         */
        getTypeFromElement: function (element) {
            var types = this.getTypes();

            for (var i = 0; i < types.length; ++i) {
                if (this.types[types[i]].element === element) {
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
         * @return {string}
         */
        getTypeFromUrl: function (url) {
            var key = 'content-type';
            var data = CKEDITOR.api.head(url, [key]);

            if (data.hasOwnProperty(key) && data[key]) {
                var type = data[key].split(';')[0].trim();
                var types = this.getTypes();

                for (var i = 0; i < types.length; ++i) {
                    if (this.types[types[i]].mime.indexOf(type) >= 0) {
                        return types[i];
                    }
                }
            }

            return '';
        },

        /**
         * Returns HTML element for given type
         *
         * @param {string} type
         *
         * @return {string|null}
         */
        getTypeElement: function (type) {
            return this.hasType(type) ? this.types[type].element : null;
        },

        /**
         * Transforms an absolute URL to an internal one, i.e. only returns the pathname, if it has the same origin
         *
         * @param {string} url
         *
         * @return {string}
         */
        getUrl: function (url) {
            var a = document.createElement('a');
            var origin = window.origin || window.location.origin;
            a.href = url;

            return a.origin === origin ? a.pathname : a.href;
        }
    };

    /**
     * Listener for dialogDefinition event
     *
     * @param {CKEDITOR.eventInfo} ev
     */
    function dialogDefinition (ev) {
        if (ev.data.name !== 'media') {
            return;
        }

        var button = ev.data.definition.contents[0].elements[1];
        var call = function (data) {
            if (data.src) {
                var dialog = this.getDialog();

                ['src', 'type', 'alt'].forEach(function (item) {
                    if (!!data[item]) {
                        dialog.getContentElement('info', item).setValue(data[item]);
                    }
                });
            }
        };

        /**
         * Supported APIs sorted by preference
         */
        if (!!ev.editor.plugins.mediabrowser) {
            button.mediabrowser = call;
        } else if (!!ev.editor.plugins.filebrowser) {
            button.filebrowser = 'info:src';
        }
    }
})(window, document, CKEDITOR);
