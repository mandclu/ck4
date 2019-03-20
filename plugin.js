'use strict';

(function (CKEDITOR) {
    CKEDITOR.dtd.block = {};
    CKEDITOR.dtd.$block.block = 1;
    CKEDITOR.dtd.$empty.block = 1;
    CKEDITOR.dtd.body.block = 1;

    CKEDITOR.plugins.add('block', {
        requires: 'widget',
        icons: 'block',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('block', {
                button: editor.lang.block.title,
                template: '<section class="block"></section>',
                allowedContent: 'block[!data-block]; section(!block)',
                requiredContent: 'block[data-block]; section(block)',
                upcast: function (el, data) {
                    if (el.name !== 'block') {
                        return false;
                    }

                    var p;

                    if (!el.attributes['data-block'] || !(p = el.attributes['data-block'].split('/')) || [1, 2].indexOf(p.length) < 0) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    data.id = p.pop();
                    data.entity = p.pop() || null;
                    var section = new CKEDITOR.htmlParser.element('section', {'class': 'block'});
                    section.setHtml(el.attributes['data-block']);
                    el.replaceWith(section);

                    return section;
                },
                downcast: function () {
                    if (!this.data.id) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    var block = (this.data.entity ? this.data.entity + '/' : '') + this.data.id;

                    return new CKEDITOR.htmlParser.element('block', {'data-block': block});
                },
                init: function () {
                },
                data: function () {
                }
            });
        }
    });
})(CKEDITOR);
