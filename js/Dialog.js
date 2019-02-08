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

    Dialog.prototype.css = function(c){
        this.toastObj.css(c);
    }

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