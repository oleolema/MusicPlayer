(function () {
    window.Menu = function (obj) {
        this.list = [];
        this.hList = $('<ul class="menuList"></ul>');
        this.parent = $('.menu');
        this.icon = $('.menu i');
        this.isDown = false;
        this.init();
        if (obj) {
            this.setMenu(obj);
        }
        var self = this;
        // $(window).click(function(){
        //     self.sildeUp();
        // });
    }

    Menu.prototype.showMenu = function () {
        var child = $('.menuList');
        for (var i = 0; i < child.length; i++) {
            if (child[i] == this.hList[0]) {
                child.eq(i).show();
            }
            else {
                child.eq(i).hide();
            }
        }
    }

    Menu.prototype.init = function () {
        var self = this;
        this.parent.click(function () {
            if (self.isDown) {
                self.sildeUp(this);
            } else {
                self.sildeDown();
            }
            self.isDown = !self.isDown;
        });
        //创建一个列表
        this.parent.append(this.hList);
    }

    Menu.prototype.setList = function (index, title) {
        this.hList.children(index).text(title);
    }

    Menu.prototype.setMenu = function (list) {
        this.hList.children().remove();
        if (!list) {
            return;
        }
        for (var i = 0; i < list.length; i++) {
            var li = $('<li></li>')
            li.text(list[i].title);
            (function () {
                var index = i;
                li.click(function () {
                    list[index].fun();
                });
            })();
            this.hList.append(li);
        }

    }
    Menu.prototype.write = function () {
        Menu.parent.append(this.hList);
    }
    Menu.prototype.sildeDown = function () {
        var self = this;
        var height = self.hList.children().length * self.hList.children(0).innerHeight();
        self.icon.css({
            transform: 'rotate(225deg)',
            color: 'white'
        });
        self.hList.css({
            height: height + 'px',
        });
    }
    Menu.prototype.sildeUp = function (e) {
        var self = this;

        self.icon.css({
            transform: 'rotate(0deg)',
            color: 'rgba(248, 248, 248, 0.527)'
        });
        self.hList.css({
            height: '0px',
        });
    }
})();