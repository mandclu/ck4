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
                    data.content = CKEDITOR.block.get(editor.config.blockApi, data.id) || data.id;
                    var div = new CKEDITOR.htmlParser.element('div', {'data-block': data.id});
                    el.replaceWith(div);

                    return div;
                },
                downcast: function () {
                    if (!!this.data.id) {
                        return new CKEDITOR.htmlParser.element('block', {'id': this.data.id});
                    }

                    return new CKEDITOR.htmlParser.text('');
                },
                data: function () {
                    if (this.data.id) {
                        this.element.setAttribute('data-block', this.data.id);
                        this.element.setHtml(this.data.content);
                    }
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
                    dialog.getContentElement('info', 'id').setValue(data.id);
                    dialog.getContentElement('info', 'content').setValue(data.content || data.id);
                }
            });
        };
    }, null, null, 1);

    /**
     * Public API
     */
    CKEDITOR.block = {
        get: function (api, id) {
            if (!id || !api || typeof api !== 'function' && typeof api !== 'string') {
                return null;
            }

            var url = typeof api === 'function' ? api(id) : api + '?id=' + id;
            var xhr = new XMLHttpRequest();

            try {
                xhr.open('GET', url, false);
                xhr.send(null);

                if (xhr.readyState === xhr.DONE && xhr.status >= 200 && xhr.status < 300) {
                    return xhr.responseText || '';
                }
            } catch (e) {
                console.log(e);
            }

            return '';
        }
    }
})(CKEDITOR);
