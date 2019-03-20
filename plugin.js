'use strict';

(function (CKEDITOR) {
    CKEDITOR.dtd.block = {};
    CKEDITOR.dtd.$block.block = 1;
    CKEDITOR.dtd.$empty.block = 1;
    CKEDITOR.dtd.body.block = 1;
    var widget = null;

    CKEDITOR.plugins.add('block', {
        requires: 'widget',
        icons: 'block',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            editor.widgets.add('block', {
                button: editor.lang.block.title,
                dialog: 'block',
                template: '<div data-block=""></div>',
                allowedContent: 'block[!id]; div[!data-block]',
                requiredContent: 'block[id]; div[data-block]',
                upcast: function (el, data) {
                    if (el.name !== 'block') {
                        return false;
                    }

                    if (!el.attributes['id']) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    data.id = el.attributes['id'];
                    var div = new CKEDITOR.htmlParser.element('div', {'data-block': data.id});
                    div.setHtml(data.id);
                    el.replaceWith(div);

                    return div;
                },
                downcast: function () {
                    if (!!this.data.id) {
                        return new CKEDITOR.htmlParser.element('block', {'id': this.data.id});
                    }

                    return new CKEDITOR.htmlParser.text('');
                },
                init: function () {
                    widget = this;
                },
                data: function () {
                    if (!this.data.id) {
                        return;
                    }

                    var widget = this;
                    var el = widget.element;
                    el.setAttribute('data-block', this.data.id);
                    el.setHtml(this.data.content);
                }
            });

            CKEDITOR.dialog.add('block', this.path + 'dialogs/block.js');
        }
    });

    CKEDITOR.on('dialogDefinition', function (dev) {
        if (dev.data.name !== 'block' || !dev.editor.config.blockBrowser || !dev.editor.plugins.mediabrowser) {
            return;
        }

        var button = dev.data.definition.contents[0].elements[1];
        button.hidden = false;
        button.onClick = function (ev) {
            CKEDITOR.mediabrowser.open(dev.editor.config.blockBrowser, function (data) {
                if (!!data.id) {
                    var dialog = ev.sender.getDialog();

                    ['id', 'content'].forEach(function (item) {
                    if (!!data[item]) {
                        dialog.getContentElement('info', item).setValue(data[item]);
                    }
                });
                }
            });
        };
    }, null, null, 1);
})(CKEDITOR);
