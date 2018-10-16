(function () {
    window.Dialog = function (text, time) {
        var self = this;
        time = time || 99999999;
        this.show();
        this.toastObj = new Toast(text, time, function () {
            self.close();
        }).css({
            background: 'rgb(96, 125, 139)'
        });
    }

    Dialog.prototype.show = function () {
        var self = this;
        this.full = $('<div class="dialogfull"></div>');
        $('body').append(this.full);
        setTimeout(function () {
            self.full.css('opacity', '1');
        }, 20);
    }

    Dialog.prototype.close = function () {
        var self = this;
        this.full.css('opacity', '0');
        setTimeout(function () {
            self.full.remove();
        }, 618);
    }
})();