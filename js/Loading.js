(function () {
    window.Loading = function (parent, style) {
        this.icon = ['cog', 'circle-o-notch', 'spinner','futbol-o', ];
        this.css = null;
        this.allIcon = [];
        this.parent = parent || document.body;
        this.style = style || 0;
        this.loadIcon = null;
        this.parent = $(this.parent);
    }
    Loading.prototype.loading = function () {
        if (this.style < 0) {
            this.style = parseInt(Math.random() * this.icon.length);
        }
        if (this.loadIcon) {
            return;
        }
        this.loadIcon = $('<i class="fa fa-' + this.icon[this.style] + ' fa-spin Loading' + '"></i>');
        if (this.css == null) {
            this.loadIcon.css({
                'font-size': '100px',
                'position': 'absolute',
                'left': innerWidth / 2 - 50 + 'px',
                'top': innerHeight / 2 - 50 + 'px',
            });
        }

        this.parent.append(this.loadIcon);
    }

    Loading.prototype.loaded = function () {
        console.info(this.loadIcon);
        this.loadIcon.remove();
        this.loadIcon = null;
    }

})();

