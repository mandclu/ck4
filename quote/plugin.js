'use strict';

(function (CKEDITOR) {
    /**
     * Plugin
     */
    CKEDITOR.plugins.add('quote', {
        requires: 'api,widget',
        icons: 'quote',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            /**
             * Widget
             */
            editor.widgets.add('quote', {
                button: editor.lang.quote.title,
                template: '<figure class="quote"><blockquote></blockquote><figcaption></figcaption></figure>',
                editables: {
                    quote: {
                        selector: 'blockquote'
                    },
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
                    blockquote: true,
                    figcaption: true,
                    figure: {
                        classes: {quote: true},
                        requiredClasses: {quote: true}
                    }
                },
                requiredContent: 'figure(quote)',
                upcast: function (el) {
                    if (el.name === 'blockquote' && el.children.length > 0) {
                        var figure = new CKEDITOR.htmlParser.element('figure', {class: 'quote'});
                        el.wrapWith(figure);
                        figure.add(new CKEDITOR.htmlParser.element('figcaption'));

                        return figure;
                    }

                    if (el.name !== 'figure' || !el.hasClass('quote')) {
                        return false;
                    }

                    if (el.children.length <= 0 || el.children[0].name !== 'blockquote') {
                        var text = new CKEDITOR.htmlParser.text('');
                        el.replaceWith(text);

                        return text;
                    }

                    // Caption
                    if (el.children.length < 2 || el.children[1].name !== 'figcaption') {
                        el.add(new CKEDITOR.htmlParser.element('figcaption'), 1);
                    }

                    el.children = el.children.slice(0, 2);

                    return el;
                },
                downcast: function (el) {
                    // Quote
                    el.children[0].attributes = [];
                    el.children[0].setHtml(this.editables.quote.getData());
                    el.children[0].children.forEach(CKEDITOR.api.parser.remove);
                    this.editables.quote.setHtml(el.children[0].getHtml());

                    if (!el.children[0].getHtml().trim()) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    // Caption
                    el.children[1].attributes = [];
                    el.children[1].setHtml(this.editables.caption.getData());

                    return !el.children[1].getHtml().trim() ? el.children[0] : el;
                }
            });
        }
    });
})(CKEDITOR);
