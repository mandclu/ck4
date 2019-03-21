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
                template: '<details><summary>Summary</summary><div class="content"></div></details>',
                editables: {
                    summary: {
                        selector: 'summary',
                        allowedContent: {}
                    },
                    content: {
                        selector: '.content'
                    }
                },
                allowedContent: 'details summary',
                requiredContent: 'details; summary',
                upcast: function (el) {
                    if (el.name !== 'details') {
                        return false;
                    }

                    var summary = el.getFirst('summary');
                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});

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
                    el.children[0].attributes = [];

                    // Content
                    el.children[1].setHtml(this.editables.content.getData());
                    el.children[1].children.forEach(function (item) {
                        if (item.isEmpty || item.getHtml().trim()) {
                            el.add(item);
                        }
                    });
                    el.children[1].remove();

                    return el.children.length > 1 ? el : new CKEDITOR.htmlParser.text('');
                },
                init: function () {
                    var summary = this.element.getChild(0);

                    summary.on('keyup', function (ev) {
                        if (ev.data['$'].key === ' ' || ev.data['$'].keyCode === 32) {
                            ev.data['$'].preventDefault();
                            editor.insertText(' ');
                        }
                    });
                }
            });
        }
    });
})(CKEDITOR);
