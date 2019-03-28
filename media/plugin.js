'use strict';

(function (window, document, CKEDITOR) {
    /**
     * Defaults
     */
    var defaults = {
        align: {left: 'left', right: 'right'},
        attr: ['alt', 'height', 'src', 'width']
    };

    /**
     * Plugin
     */
    CKEDITOR.plugins.add('media', {
        requires: 'api,dialog,widget',
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
                editables: {
                    caption: {
                        selector: 'figcaption',
                        allowedContent: {
                            a: {
                                attributes: {href: true},
                                requiredAttributes: {href: true}
                            },
                            br: true,
                            em: true,
                            strong: true
                        }
                    }
                },
                allowedContent: {
                    a: {
                        attributes: {href: true},
                        requiredAttributes: {href: true}
                    },
                    audio: {
                        attributes: {controls: true, src: true},
                        requiredAttributes: {controls: true, src: true}
                    },
                    figcaption: true,
                    figure: {
                        classes: {audio: true, iframe: true, image: true, left: true, right: true, video: true}
                    },
                    iframe: {
                        attributes: {allowfullscreen: true, height: true, src: true, width: true},
                        requiredAttributes: {src: true}
                    },
                    img: {
                        attributes: {alt: true, height: true, src: true, width: true},
                        requiredAttributes: {src: true}
                    },
                    video: {
                        attributes: {controls: true, height: true, src: true, width: true},
                        requiredAttributes: {src: true}
                    }
                },
                requiredContent: 'figure',
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
                    if (CKEDITOR.api.parser.isMediaElement(el) && !el.getAscendant(CKEDITOR.api.parser.isMediaFigure)) {
                        return true;
                    }

                    if (!CKEDITOR.api.parser.isMediaFigure(el)
                        || el.children.length < 1
                        || !CKEDITOR.api.parser.isMediaElement(el.children[0]) && !CKEDITOR.api.parser.isMediaLink(el.children[0])
                    ) {
                        return false;
                    }

                    // Caption
                    if (el.children.length < 2 || el.children[1].name !== 'figcaption') {
                        el.add(new CKEDITOR.htmlParser.element('figcaption'));
                    }

                    el.children = el.children.slice(0, 2);

                    return true;
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
                        media.setAttribute('src', CKEDITOR.api.url.root(media.getAttribute('src')));
                        widget.setData('type', CKEDITOR.api.media.fromElement(media.getName()));
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

                    if (!widget.data.src || !type || !(name = CKEDITOR.api.media.element(type))) {
                        return;
                    }

                    CKEDITOR.api.media.all().concat([defaults.align.left, defaults.align.right]).forEach(function (item) {
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
                        widget.initEditable('caption', widget.definition.editables.caption);
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
    CKEDITOR.on('dialogDefinition', function (ev) {
        if (ev.data.name !== 'media') {
            return;
        }

        /**
         * Source input
         */
        var src = ev.data.definition.contents[0].elements[0];
        src.onChange = function () {
            var type = '';

            if (this.getValue()) {
                type = CKEDITOR.api.media.fromUrl(this.getValue()) || '';
            }

            this.getDialog().getContentElement('info', 'type').setValue(type);
        };

        /**
         * Type select
         */
        var type = ev.data.definition.contents[0].elements[2];
        type.items = [[ev.editor.lang.common.notSet, '']].concat(CKEDITOR.api.media.all().map(function (item) {
            return [ev.editor.lang.media[item], item];
        }).sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1;
            }

            if (a[0] > b[0]) {
                return 1;
            }

            return 0;
        }));

        /**
         * Browse button
         */
        var browse = ev.data.definition.contents[0].elements[1];
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

        // Supported APIs sorted by preference
        if (!!ev.editor.plugins.browser && typeof ev.editor.config.mediaBrowser === 'string' && !!ev.editor.config.mediaBrowser) {
            browse.browser = call;
            browse.browserUrl = ev.editor.config.mediaBrowser;
        } else if (!!ev.editor.plugins.mediabrowser) {
            browse.mediabrowser = call;
        } else if (!!ev.editor.plugins.filebrowser) {
            browse.filebrowser = 'info:src';
        }
    }, null, null, 1);
})(window, document, CKEDITOR);
