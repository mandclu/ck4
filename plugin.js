'use strict';

(function (CKEDITOR) {
    function intersect(haystack, needle) {
        var filter = function (item) {
            return haystack.indexOf(item) >= 0;
        };

        return Array.isArray(haystack) && Array.isArray(needle) && needle.filter(filter).length > 0;
    }

    CKEDITOR.plugins.add('section', {
        requires: 'widget',
        icons: 'section',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            if (!editor.config.section || !Array.isArray(editor.config.section)) {
                return;
            }

            editor.widgets.add('section', {
                button: editor.lang.section.title,
                template: '<section><h2>Title</h2><div class="content"></div></section>',
                editables: {
                    title: {
                        selector: 'h2',
                        allowedContent: {}
                    },
                    content: {
                        selector: '.content'
                    }
                },
                allowedContent: 'section(*); h2; div(content)',
                requiredContent: 'section; h2; div(content)',
                upcast: function (el) {
                    if (el.name !== 'section' || !intersect(editor.config.section, el.classes)) {
                        return false;
                    }

                    var title = el.getFirst('h2');
                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});

                    if (!!title && title.children.length > 0 && title.children[0].type === CKEDITOR.NODE_ELEMENT) {
                        title.setHtml(title.children[0].getHtml());
                    } else if (!!title && title.children.length > 0 && title.children[0].type === CKEDITOR.NODE_TEXT) {
                        title.setHtml(title.children[0].value);
                    } else if (!!title) {
                        title.setHtml('Title');
                    } else {
                        title = new CKEDITOR.htmlParser.element('h2');
                        title.setHtml('Title');
                        el.add(title, 0);
                    }

                    el.add(content, 1);

                    if (el.children.length > 2) {
                        content.children = el.children.slice(2);
                        el.children = el.children.slice(0, 2);
                    }

                    return true;
                },
                downcast: function (el) {
                    el.children = el.children.slice(0, 1);
                    el.children[0].attributes = [];
                    el.setHtml(el.getHtml() + this.editables.content.getData());
                }
            });
        }
    });
})(CKEDITOR);
