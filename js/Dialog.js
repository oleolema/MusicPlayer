(function () {
    window.Dialog = function (text, time) {
        var self = this;
        if (text === "" || text === undefined) {
            return;
        }
        time = time || 99999999;
        this.show();
        this.toastObj = new Toast();
        this.toastObj.makeText(text, time, function () {
            self.close();
        }).css({
            background: 'rgba(0, 0, 0, 0.77)'
        }).show();
    }

    Dialog.prototype.css = function (c) {
        this.toastObj.css(c);
    }

    /**
     * 显示背景遮挡阴影
     */
    Dialog.prototype.show = function () {
        var self = this;
        this.fill = $('<div class="fillScreen"></div>');
        $('body').append(this.fill);
        setTimeout(function () {
            self.fill.css('opacity', '1');
        }, 20);
    }

    Dialog.prototype.close = function () {
        var self = this;
        this.fill.css('opacity', '0');
        setTimeout(function () {
            self.fill.remove();
        }, 618);
    }
})();