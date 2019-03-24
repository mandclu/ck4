'use strict';

(function (window, document, CKEDITOR) {
    /**
     * Defaults
     */
    var defaults = {
        container: ['hbox', 'vbox', 'fieldset']
    };

    /**
     * Plugin
     */
    CKEDITOR.plugins.add('mediabrowser', {});

    /**
     * Dialog definition listener
     */
    CKEDITOR.on('dialogDefinition', function (ev) {
        if (!!ev.editor.plugins.mediabrowser && !!ev.editor.config.mediabrowserUrl) {
            var def = ev.data.definition;

            for (var i = 0; i < def.contents.length; ++i) {
                if (def.contents[i] && def.contents[i].elements) {
                    findButtons(def.contents[i].elements);
                }
            }
        }
    });

    /**
     * Public API
     */
    CKEDITOR.mediabrowser = {
        popupFeatures: 'alwaysRaised=yes,dependent=yes,height=' + window.screen.height + ',location=no,menubar=no,' +
            'minimizable=no,modal=yes,resizable=yes,scrollbars=yes,toolbar=no,width=' + window.screen.width,
        open: function (url, callback) {
            if (!url || typeof callback !== 'function') {
                return;
            }

            var win = this.popup(url);
            var origin;

            try {
                origin = win.origin || win.location.origin;
            } catch (e) {
                console.log(e);
                origin = this.getOrigin(url);
            }

            window.addEventListener('message', function (ev) {
                if (ev.origin === origin && ev.source === win) {
                    callback(ev.data);
                    win.close();
                }
            }, false);
        },
        popup: function (url) {
            return window.open(url, 'mediabrowser', this.popupFeatures);
        },
        getOrigin: function (url) {
            var a = document.createElement('a');
            a.href = url;

            return a.origin;
        }
    };

    /**
     * Recursively finds and unhides button elements with a mediabrowser callback and sets the onClick callback
     *
     * @param {Array} items
     */
    function findButtons(items) {
        if (!Array.isArray(items) || items.length <= 0) {
            return;
        }

        items.forEach(function (item) {
            if (isContainer(item)) {
                findButtons(item.children);
            } else if (isButton(item)) {
                item.hidden = false;
                item.onClick = onClick;
            }
        });
    }

    /**
     * Indicates if given UI element is a container and has child elements
     *
     * @param {CKEDITOR.dialog.definition.uiElement} item
     *
     * @return {boolean}
     */
    function isContainer(item) {
        return defaults.container.indexOf(item.type) >= 0 && item.children && item.children.length > 0;
    }

    /**
     * Indicates if given UI element is a button with a mediabrowser callback
     *
     * @param {CKEDITOR.dialog.definition.uiElement} item
     *
     * @return {boolean}
     */
    function isButton(item) {
        return item.type === 'button' && item.mediabrowser && typeof item.mediabrowser === 'function';
    }

    /**
     * Button click listener
     *
     * @param {CKEDITOR.eventInfo} ev
     */
    function onClick(ev) {
        var dialog = ev.sender.getDialog();
        var url = dialog.getParentEditor().config.mediabrowserUrl;

        CKEDITOR.mediabrowser.open(url, function (data) {
            ev.sender.mediabrowser.call(ev.sender, data);
        });
    }
})(window, document, CKEDITOR);
