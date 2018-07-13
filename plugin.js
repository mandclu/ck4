'use strict';

(function (window, CKEDITOR) {
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
        return ['hbox', 'vbox', 'fieldset'].indexOf(item.type) >= 0 && item.children && item.children.length > 0;
    }

    function isMediabrowser(item) {
        return item.type === 'button' && item.mediabrowser && Object.getOwnPropertyNames(item.mediabrowser);
    }

    function onClick(ev) {
        var dialog = ev.sender.getDialog();
        var url = dialog.getParentEditor().config.mediabrowserUrl;
        var win = popup(url);

        window.addEventListener('message', function (e) {
            var id = e.data.id;
            var data = e.data.data;
            var mb = ev.sender.mediabrowser

            if (e.origin !== win.origin || id !== 'mediabrowser' || !data.src) {
                return;
            }


            Object.getOwnPropertyNames(data).forEach(function (key) {
                var target;

                if (mb.hasOwnProperty(key) && (target = mb[key].split(':')) && target.length === 2) {
                    dialog.getContentElement(target[0], target[1]).setValue(data[key]);
                }
            });
        }, false);
    }

    function popup(url) {
        return window.open(
            url,
            'mediabrowser',
            'location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes'
        );
    }
})(window, CKEDITOR);
