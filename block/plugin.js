'use strict';

(function (CKEDITOR) {
    /**
     * DTD
     */
    CKEDITOR.dtd.block = {};
    CKEDITOR.dtd.$block.block = 1;
    CKEDITOR.dtd.$empty.block = 1;
    CKEDITOR.dtd.body.block = 1;

    /**
     * Plugin
     */
    CKEDITOR.plugins.add('block', {
        requires: 'api,browser,dialog,widget',
        icons: 'block',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            /**
             * Config
             */
            if (!editor.config.blockBrowser || editor.config.blockBrowser !== 'string') {
                editor.config.blockBrowser = null;
            }

            if (!editor.config.blockApi || ['function', 'string'].indexOf(typeof editor.config.blockApi) > 0) {
                editor.config.blockApi = null;
            }

            /**
             * Widget
             */
            editor.widgets.add('block', {
                button: editor.lang.block.title,
                dialog: 'block',
                template: '<div data-block=""></div>',
                allowedContent: {
                    block: {
                        attributes: {id: true},
                        requiredAttributes: {id: true}
                    }
                },
                requiredContent: 'block[id]',
                upcast: function (el, data) {
                    if (el.name !== 'block') {
                        return false;
                    }

                    if (!el.attributes['id']) {
                        return new CKEDITOR.htmlParser.text('');
                    }

                    data.id = el.attributes['id'];
                    data.content = get(editor.config.blockApi, data.id);
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

            /**
             * Dialog
             */
            CKEDITOR.dialog.add('block', this.path + 'dialogs/block.js');
        }
    });

    /**
     * Dialog definition
     */
    CKEDITOR.on('dialogDefinition', function (ev) {
        if (ev.data.name !== 'block') {
            return;
        }

        var id = ev.data.definition.contents[0].elements[0];
        id.onLoad = function () {
            var dialog = this.getDialog();
            this.getInputElement().$.addEventListener('change', function () {
                var content = get(ev.editor.config.blockApi, this.value);
                dialog.getContentElement('info', 'content').setValue(content);
            });
        };

        if (!!ev.editor.plugins.browser && !!ev.editor.config.blockBrowser) {
            var button = ev.data.definition.contents[0].elements[1];
            button.hidden = false;
            button.browser = function (data) {
                if (!!data.id) {
                    var dialog = this.getDialog();
                    dialog.getContentElement('info', 'id').setValue(data.id);
                    dialog.getContentElement('info', 'content').setValue(data.content || data.id);
                }
            };
            button.browserUrl = ev.editor.config.blockBrowser;
        }
    }, null, null, 1);

    /**
     * Returns content from API
     *
     * @param {string} url
     * @param {string} id
     *
     * @return {string}
     */
    function get(url, id) {
        if (!!url && !!id) {
            return CKEDITOR.api.get(typeof url === 'function' ? url(id) : url + '?id=' + id);
        }

        return id;
    }
})(CKEDITOR);
