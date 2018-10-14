(function () {
    window.Toast = function (text, time) {
        this.text = text;
        this.time = time || 2000;

        this.show();
    }

    Toast.prototype.show = function () {
        console.info('toast',this);
        var self = this;
        this.toast = $('<div class="toast">' + this.text + '</div>');
        this.icon = $('<i class="fa fa-times" aria-hidden="true"></i>');
        this.icon.click(function () {
            self.close();
        });
       
        this.toast.append(this.icon);
        $('body').append(this.toast);
        var line = this.toast.outerWidth() / innerWidth;
        console.info("line : " + line);
        if(line > 1){
            this.toast.css({
                'height':60 * line +  'px',
                'width' : innerWidth + 'px'
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
    }

})();