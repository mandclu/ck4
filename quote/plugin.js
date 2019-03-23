'use strict';

(function (CKEDITOR) {
    CKEDITOR.plugins.add('quote', {
        requires: 'widget',
        icons: 'quote',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('quote', {
                button: editor.lang.quote.title,
                template: '<figure class="quote"><blockquote></blockquote><figcaption></figcaption></figure>',
                editables: {
                    quote: {
                        selector: 'blockquote'
                    },
                    caption: {
                        selector: 'figcaption',
                        allowedContent: 'br em s strong sub sup u; a[!href]'
                    }
                },
                allowedContent: 'figure(!quote); blockquote; figcaption',
                requiredContent: 'figure(quote); blockquote; figcaption',
                upcast: function (el) {
                    if (el.name !== 'figure' || !el.hasClass('quote')) {
                        return false;
                    }

                    if (el.children.length <= 0 || el.children[0].name !== 'blockquote') {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    // Caption
                    if (el.children.length < 2 || el.children[1].name !== 'figcaption') {
                        el.add(new CKEDITOR.htmlParser.element('figcaption'), 1);
                    }

                    el.children = el.children.slice(0, 2);

                    return el;
                },
                downcast: function (el) {
                    el.children[0].attributes = [];
                    el.children[0].setHtml(this.editables.quote.getData());
                    el.children[0].children.forEach(function (item) {
                        if (!item.isEmpty && !item.getHtml().trim()) {
                            item.remove();
                        }
                    });

                    if (!el.children[0].getHtml().trim()) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    // Caption
                    el.children[1].attributes = [];
                    el.children[1].setHtml(this.editables.caption.getData());

                    if (!el.children[1].getHtml().trim()) {
                        el.children[1].remove();
                    }

                    return el;
                }
            });
        }
    });
})(CKEDITOR);
