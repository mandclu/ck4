/**
 * Block Dialog
 *
 * @author Ayhan Akilli
 */
'use strict';

(function (CKEDITOR) {
    CKEDITOR.dialog.add('block', function (editor) {
        var lang = editor.lang.block;
        var common = editor.lang.common;

        return {
            title: lang.title,
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
            minWidth: 250,
            minHeight: 100,
            contents: [
                {
                    id: 'info',
                    label: lang.info,
                    elements: [
                        {
                            id: 'id',
                            type: 'text',
                            label: lang.id,
                            setup: function (widget) {
                                this.setValue(widget.data.id);
                            },
                            commit: function (widget) {
                                widget.setData('id', this.getValue());
                            },
                            validate: CKEDITOR.dialog.validate.notEmpty(lang.validateRequired)
                        },
                        {
                            id: 'browse',
                            type: 'button',
                            label: common.browseServer,
                            hidden: true
                        },
                        {
                            id: 'content',
                            type: 'html',
                            label: lang.content,
                            html: '',
                            setup: function (widget) {
                                this.setValue(widget.data.content);
                            },
                            commit: function (widget) {
                                widget.setData('content', this.getValue());
                            },
                            hidden: true
                        }
                    ]
                }
            ]
        };
    });
})(CKEDITOR);
