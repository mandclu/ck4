'use strict';

(function (CKEDITOR) {
    /**
     * Plugin
     */
    CKEDITOR.plugins.add('grid', {
        requires: 'api,widget',
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
                        allowedContent: {
                            block: {
                                attributes: {id: true},
                                requiredAttributes: {id: true}
                            },
                            figure: true,
                            p: true,
                            section: true
                        }
                    }
                },
                allowedContent: {
                    div: {
                        classes: {content: true, grid: true}
                    }
                },
                requiredContent: 'div(grid)',
                upcast: function (el) {
                    if (el.name !== 'div' || !el.hasClass('grid')) {
                        return false;
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
                        if (item.name !== 'p') {
                            CKEDITOR.api.parser.add(item, el);
                        }
                    });
                    el.children[0].remove();

                    return el.children.length > 0 ? el : new CKEDITOR.htmlParser.text('');
                }
            });

            /**
             * Styles
             */
            editor.addContentsCss(this.path + 'styles/grid.css');
        }
    });
})(CKEDITOR);
