'use strict';

(function (window, CKEDITOR) {
    var container = ['hbox', 'vbox', 'fieldset'];

    CKEDITOR.plugins.add('mediabrowser', {});

    CKEDITOR.on('dialogDefinition', function (ev) {
        if (!ev.editor.plugins.mediabrowser || !ev.editor.config.mediabrowserUrl) {
            return;
        }

        var def = ev.data.definition;

        for (var i = 0; i < def.contents.length; ++i) {
            if (def.contents[i] && def.contents[i].elements) {
                findElements(def.contents[i].elements);
            }
        }
    });

    function findElements(items) {
        if (!Array.isArray(items) || items.length <= 0) {
            return;
        }

        items.forEach(function (item) {
            if (isContainer(item)) {
                findElements(item.children);
            } else if (isMediabrowser(item)) {
                item.hidden = false;
                item.onClick = onClick;
            }
        });
    }

    function isContainer(item) {
        return container.indexOf(item.type) >= 0 && item.children && item.children.length > 0;
    }

    function isMediabrowser(item) {
        return item.type === 'button' && item.mediabrowser && Object.getOwnPropertyNames(item.mediabrowser);
    }

    function onClick(ev) {
        var dialog = ev.sender.getDialog();
        var url = dialog.getParentEditor().config.mediabrowserUrl;

        CKEDITOR.mediabrowser.open(url, function (data) {
            var mb = ev.sender.mediabrowser;

            Object.getOwnPropertyNames(data).forEach(function (key) {
                var t;
                var target;

                if (mb.hasOwnProperty(key) && (t = mb[key].split(':')) && t.length === 2 && !!(target = dialog.getContentElement(t[0], t[1]))) {
                    target.setValue(data[key]);
                }
            });
        });
    }

    /**
     * Public API
     */
    CKEDITOR.mediabrowser = {
        popupFeatures: 'alwaysRaised=yes,dependent=yes,height=' + window.screen.height + ',location=no,menubar=no,' +
            'minimizable=no,modal=yes,resizable=yes,scrollbars=yes,toolbar=no,width=' + window.screen.width,
        open: function (url, call) {
            if (!url || typeof call !== 'function') {
                return;
            }

            var win = this.popup(url);

            window.addEventListener('message', function (ev) {
                if (ev.origin !== win.origin || ev.source !== win || !ev.data.src) {
                    return;
                }

                call(ev.data);
                win.close();
            }, false);
        },
        popup: function (url) {
            return window.open(url, 'mediabrowser', this.popupFeatures);
        }
    };
})(window, CKEDITOR);
