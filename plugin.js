'use strict';

(function (CKEDITOR) {
    CKEDITOR.dtd['block'] = {};
    CKEDITOR.dtd['$block']['block'] = 1;
    CKEDITOR.dtd['$empty']['block'] = 1;
    CKEDITOR.plugins.add('block', {
        requires: 'widget',
        icons: 'block',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('block', {
                button: editor.lang.block.title,
                template: '<block data-entity="" data-id="" />',
                allowedContent: 'block[!data-entity, !data-id]',
                requiredContent: 'block[data-entity, data-id]',
                upcast: function (el) {
                    return el.name === 'block' && el.attributes['data-entity'] && el.attributes['data-id'];
                },
                downcast: function (el) {
                    el.children = [];
                }
            });
        }
    });
})(CKEDITOR);
