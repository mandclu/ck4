'use strict';

(function (CKEDITOR) {
    CKEDITOR.dtd.template = {};
    CKEDITOR.dtd.$block.template = 1;
    CKEDITOR.dtd.body.template = 1;

    CKEDITOR.plugins.add('block', {
        requires: 'widget',
        icons: 'block',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('block', {
                button: editor.lang.block.title,
                template: '<template class="block" data-entity="" data-id=""></template>',
                allowedContent: 'template(!block)[!data-entity, !data-id]',
                requiredContent: 'template(block)[data-entity, data-id]',
                upcast: function (el) {
                    return el.name === 'template' && el.hasClass('block') && el.attributes['data-entity'] && el.attributes['data-id'];
                },
                downcast: function (el) {
                    el.children = [];
                }
            });
        }
    });
})(CKEDITOR);
