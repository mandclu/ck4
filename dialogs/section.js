'use strict';

(function (CKEDITOR) {
    CKEDITOR.dialog.add('section', function (editor) {
        var lang = editor.lang.section;
        var common = editor.lang.common;
        var css = [[common.notSet, '']].concat(editor.config.section.map(function (item) {
            return [item, item];
        }).sort(function (a, b) {
            if (a[0] < b[0]) {
                return -1;
            }

            if (a[0] > b[0]) {
                return 1;
            }

            return 0;
        }));

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
                            id: 'css',
                            type: 'select',
                            label: lang.css,
                            items: css,
                            setup: function (widget) {
                                this.setValue(widget.data.css);
                            },
                            commit: function (widget) {
                                widget.setData('css', this.getValue());
                            },
                            validate: CKEDITOR.dialog.validate.notEmpty(lang.validateRequired)
                        }
                    ]
                }
            ]
        };
    });
})(CKEDITOR);
