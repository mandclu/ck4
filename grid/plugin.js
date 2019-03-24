'use strict';

(function (CKEDITOR) {
    /**
     * Defaults
     */
    var defaults = {
        allowed: ['block', 'div', 'figure', 'section']
    };

    /**
     * Plugin
     */
    CKEDITOR.plugins.add('grid', {
        requires: 'widget',
        icons: 'grid',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            /**
             * Widget
             */
            editor.widgets.add('grid', {
                button: editor.lang.grid.title,
                template: '<div class="grid"><div class="content"></div></div>',
                editables: {
                    content: {
                        selector: '.content',
                        allowedContent: 'section figure p; block[!id]; div[!data-block]'
                    }
                },
                allowedContent: 'div(!grid); div(!content)',
                requiredContent: 'div(grid); div(content)',
                upcast: function (el) {
                    if (el.name !== 'div' || !el.hasClass('grid')) {
                        return false;
                    }

                    if (el.children.length <= 0) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});
                    el.add(content, 0);
                    content.children = el.children.slice(1);
                    el.children = el.children.slice(0, 1);

                    return el;
                },
                downcast: function (el) {
                    el.children[0].setHtml(this.editables.content.getData());
                    el.children[0].children.forEach(function (item) {
                        if (defaults.allowed.indexOf(item.name) >= 0 && (item.isEmpty || item.getHtml().trim())) {
                            el.add(item);
                        }
                    });
                    el.children[0].remove();

                    return el.children.length > 0 ? el : new CKEDITOR.htmlParser.text('');
                }
            });
        }
    });
})(CKEDITOR);
