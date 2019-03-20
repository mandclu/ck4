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
                allowedContent: 'block[!data-entity, !data-id]; section(!block)',
                requiredContent: 'block[data-entity, data-id]; section(block)',
                upcast: function (el, data) {
                    if (el.name !== 'block') {
                        return false;
                    }

                    if (!el.attributes['data-entity'] || !el.attributes['data-id']) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    data.entity = el.attributes['data-entity'];
                    data.id = el.attributes['data-id'];
                    var section = new CKEDITOR.htmlParser.element('section', {'class': 'block'});
                    section.setHtml(el.attributes['data-entity'] + '/' + el.attributes['data-id']);
                    el.replaceWith(section);

                    return section;
                },
                downcast: function () {
                    if (!this.data.entity || !this.data.id) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    return new CKEDITOR.htmlParser.element('block', {'data-entity': this.data.entity, 'data-id': this.data.id});
                },
                init: function () {
                },
                data: function () {
                }
            });
        }
    });
})(CKEDITOR);
