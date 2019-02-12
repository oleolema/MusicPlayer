(function () {
    window.Toast = function (text, time, close) {
        this.makeText(text, time, close);
    }

    Toast.prototype.makeText = function (text, time, close) {
        this.text = text;
        this.time = time || 2000;
        this.otherClose = close;
        text !== undefined && this.show();
        return this;
    }

    Toast.prototype.setClose = function(close){
        this.otherClose = close;
        return ;
    }


    Toast.prototype.css = function (c) {
        this.toast.css(c);
        return this;
    }

    Toast.prototype.close = function (c) {
        this.otherClose = c;
        return this;
    }


    Toast.prototype.show = function () {
        var self = this;
        this.toast = $('<div class="toast"></div>');
        this.icon = $('<i class="fa fa-times" aria-hidden="true"></i>');
        this.toast.append(this.text);
        this.icon.click(function () {
            self.close();
            self.otherClose && self.otherClose();
        });

        this.toast.append(this.icon);
        $('body').append(this.toast);
        $('body').css("overflow-y", "auto");
        var line = this.toast.outerWidth() / innerWidth;
        if (line > 1) {
            this.toast.css({
                'height': 60 * line + 'px',
                'width': innerWidth + 'px'
            });
        }
        this.toast.css({
            top: -this.toast.outerHeight() + "px"
        });
        setTimeout(function () {
            self.toast.css({
                top: "-1px",
                left: (innerWidth - self.toast.outerWidth()) / 2 + "px"
            });
        }, 20);
        setTimeout(function () {
            self.close();
            self.otherClose && self.otherClose();
        }, this.time + 618);
    }

    Toast.prototype.close = function () {
        var self = this;
        this.toast.css({
            top: -this.toast.outerHeight() + "px"
        });
        setTimeout(function () {
            self.toast.remove();
        }, 618);
        $('body').css("overflow-y", "hidden");
    }

})();