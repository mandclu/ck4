'use strict';

(function (CKEDITOR) {
    CKEDITOR.dtd['$editable']['summary'] = 1;
    CKEDITOR.plugins.add('detail', {
        requires: 'widget',
        icons: 'detail',
        hidpi: true,
        lang: 'de,en,uk,ru',
        init: function (editor) {
            editor.widgets.add('detail', {
                button: editor.lang.detail.title,
                template: '<details><summary>Summary</summary><div class="details-content"></div></details>',
                editables: {
                    summary: {
                        selector: 'summary',
                        allowedContent: {}
                    },
                    content: {
                        selector: '.details-content'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; summary',
                upcast: function (el) {
                    if (el.name !== 'details') {
                        return false;
                    }

                    var summary = el.getFirst('summary');
                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'details-content'});

                    if (!!summary && summary.children.length > 0 && summary.children[0].type === CKEDITOR.NODE_ELEMENT) {
                        summary.setHtml(summary.children[0].getHtml());
                    } else if (!!summary && summary.children.length > 0 && summary.children[0].type === CKEDITOR.NODE_TEXT) {
                        summary.setHtml(summary.children[0].value);
                    } else if (!!summary) {
                        summary.setHtml('Summary');
                    } else {
                        summary = new CKEDITOR.htmlParser.element('summary');
                        summary.setHtml('Summary');
                        el.add(summary, 0);
                    }

                    el.add(content, 1);

                    if (el.children.length > 2) {
                        content.children = el.children.slice(2);
                        el.children = el.children.slice(0, 2);
                    }

                    return true;
                },
                downcast: function (el) {
                    el.attributes = [];
                    el.children = el.children.slice(0, 1);
                    el.setHtml(el.getHtml() + this.editables.content.getData());
                },
                init: function () {
                    var summary = this.element.getChild(0);

                    summary.on('keyup', function (ev) {
                        if (ev.data['$'].keyCode === 32) {
                            ev.data['$'].preventDefault();
                            editor.insertText(' ');
                        }
                    });
                }
            });
        }
    });
})(CKEDITOR);
