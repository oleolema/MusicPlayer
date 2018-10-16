(function () {
    window.Delete = function () {
        this.icon;
        this.hlist;
        this.p;
        this.size;
        this.pstr;
        this.isended = true;
        this.hdelete = [];
        this.timerOut;

    }

    Delete.prototype.setIcon = function (i, size) {
        this.p = i;
        this.size = size;
        var s = ['height', 'width'];
        var p = ['top', 'right', 'bottom', 'left'];
        this.pstr = p[i];
        this.icon = '<div style="background-color: #607D8B;position: absolute; z-index:10;transition:all 0.5s;' +
            p[i] + ":" + - size + 'px;' +
            p[(i + 3) % 4] + ':0px;' +
            s[(i + 1) % 2] + ': 100%;' +
            s[i % 2] + ': ' + size + 'px;"><i class="fa fa-trash-o" aria-hidden="true" style="text-align: center;' +
            s[i % 2] + ': 100%;' +
            s[(i + 1) % 2] + ': 100%;font-size: 20px;"></i></div>';
    }
    /**
     * 
     * @param  list 需要删除的列表
     * @param  startback 传给回调函数被删除行的index
     * @param  endback 删除结束调用的回调函数
     * @param  endIndex 需要删除的列表终点index（可选）,默认列表全部
     */
    Delete.prototype.start = function (list, startback, endback, endIndex) {
        var self = this;

        if (!this.isended) {
            return;
        }
        this.isended = false;
        this.hlist = list.children();
        endIndex = endIndex || this.hlist.length;
        var isH = (this.p % 2) == 0;
        this.hlist.unbind();        //解绑列表所有事件
        var lineHeight = isH ? this.size + 'px' : this.hlist.eq(0).innerHeight() + 'px';
        for (var i = 0; i < this.hlist.length && i < endIndex; i++) {
            this.hlist.eq(i).css({
                position: 'relative'
            });
            this.hdelete[i] = $(this.icon);
            //添加css
            this.hdelete[i].css({
                'line-height': lineHeight,
            });
            //添加hover
            this.hdelete[i].hover(function () {
                $(this).css({
                    color: 'red'
                });
                return false;
            }, function () {
                $(this).css({
                    color: 'white'
                });
                return false;
            });
            //添加点击事件
            (function () {
                var index = i;
                self.hdelete[index].click(function () {
                    console.info(index);
                    startback(index);
                    //设置变量isDeleteing 表示正在删除
                    self.isDeleteing = true;
                    clearTimeout(self.timerOut);
                    self.timerOut = setTimeout(function () {
                        self.isDeleteing = false;
                    }, 200);
                    return false;
                });

                setTimeout(function () {
                    self.hdelete[index].css(self.pstr, '0px');
                }, 20);
            })();
            this.hlist.eq(i).append(this.hdelete[i]);
        }
        setTimeout(function () {
            //其他地方被点击退出编辑
            window.onclick = function () {
                if (!self.isDeleteing) {    //如果正在删除就不执行
                    self.end(endIndex);
                    endback();
                    window.onclick = null;
                }
            }
        }, 500);

        //添加完成按钮
        this.button = music.smallScreen.addTools('check-circle', function () {
            // console.info('asdf');
            // self.end(endIndex);
            // endback();
        }, '编辑完成');
        this.button.show();
    }

    Delete.prototype.end = function (endIndex) {
        var self = this;
        for (var i = 0; i < endIndex; i++) {
            (function () {
                var index = i;
                setTimeout(function () {
                    self.hdelete[index].css(self.pstr, -self.size + 'px');
                }, 20);
                setTimeout(function () {
                    self.hdelete[index].remove();
                }, 500);
            })();
        }
        this.button.hide();
        this.isended = true;
        new Toast("已保存", 1000);
    }

})();