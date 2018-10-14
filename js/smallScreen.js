(function () {
    window.SmallScreen = function () {
        this.small = $('.smallScreen');
        this.full = $('.fullScreen');
        this.musicImg = $('.musicImg');
        this.smLyric = $('.lyric');
        this.navi = $('.naviList');
        this.title = $('.naviList').children();
        this.content = $('.main').children();
        this.floatBoll = $('.floatBoll');
        this.contentScrollTop = {};
        this.titleNum = 1;
        this.isFull = false;
        this.loadIcon = null;
        this.tools = $('.tools');
        SmallScreen.SDELAY = 400;

        //Menu
        this.menuObj = new Menu();

    }


    SmallScreen.prototype.addTools = function (icon, onclick, title) {
        var tool = $('<i class="fa fa-' + icon + ' aria-hidden="true" style="display:none"></i>');
        title && tool.attr('title', title);
        tool.click(function () {
            onclick();
        })
        this.tools.append(tool);
        return {
            show: function () { tool.show(500) },
            hide: function () { tool.hide(500) },
        }
    }



    SmallScreen.prototype.init = function () {
        var self = this;
        //大小屏切换点击
        self.musicImg.click(function () {
            if (self.isFull) {
                self.toSmall(innerWidth, innerHeight);
            } else {
                self.toFull(innerWidth, innerHeight);
            }
        });
        //点击标题
        self.title.click(function (n) {
            //切换页面
            self.changeList(n.target.value);
            //存储编号
            self.titleNum = n.target.value;
        });
        //监控页面滚动来显示和隐藏返回顶部
        self.content.scroll(function () {
            var display = self.floatBoll.css('display');
            if (display == 'none' && this.scrollTop > this.offsetHeight) {
                self.floatBoll.fadeIn(500);
            } else if (display == 'block' && this.scrollTop < this.offsetHeight) {
                self.floatBoll.fadeOut(500);
            }
        });
        //点击返回顶部
        self.floatBoll.click(function () {
            SmallScreen.toScrollTop(self.content[self.titleNum], 0, 50);
        });
        self.changeList(this.titleNum);
        self.setSize(innerWidth, innerHeight);
    }
    SmallScreen.prototype.changeList = function (n) {
        var self = this;
        //隐藏返回顶部
        self.floatBoll.fadeOut(100);
        for (var i = 0; i < self.content.length; i++) {
            if (i == n) {
                console.info('down');
                this.content.eq(i).slideDown(SmallScreen.SDELAY);
                this.title.eq(i).css({
                    background: 'rgba(33, 149, 243, 0.836)'
                });
            }
            else {
                this.content.eq(i).slideUp(SmallScreen.SDELAY);
                this.title.eq(i).css({
                    background: 'rgba(33, 149, 243, 0)'
                });
            }
        }
        if (n == 0) {
            music.menuObj.showMenu();
            music.tool.show();
            SmallScreen.toScrollTop(self.content[0], $('.musicList li.ing')[0].offsetTop - innerHeight * 0.382);    //定位到当前播放
        } else {
            music.tool.hide();
        }
        if (n == 1) {
            // music.sheetObj.sMenuObj.showMenu();
            music.sheetObj.showSheet();
        } else {
            music.sheetObj.backButton && music.sheetObj.backButton.hide();
        }
        if (n == 2) {
            //延迟 绑定滚动事件 和 聚焦
            setTimeout(function () {
                $('.search')[0].onscroll = function () {
                    if (this.offsetHeight + this.scrollTop >= this.scrollHeight) {
                        music.searchObj.smusic();
                    }
                };
                //如果搜索列表为空就聚焦
                if (music.searchObj.sListObj.list.length == 0) {
                    $('.searchInput')[0].focus();
                }
            }, SmallScreen.SDELAY + 100);
            self.menuObj.showMenu();
        } else {
            //非搜索界面取消滚动事件和聚焦
            console.info(2);
            $('.searchInput')[0].blur();
            $('.search')[0].onscroll = null;
        }
    }

    SmallScreen.toScrollTop = function (element, end, k) {
        k = k || 50;
        var speed = Math.ceil((end - element.scrollTop) / k);
        var preTop = 0;
        if (speed > 0) {
            var timer = setInterval(function () {
                preTop = element.scrollTop;
                element.scrollTop += speed;
                if (preTop == element.scrollTop || element.scrollTop + speed >= end) {
                    clearInterval(timer);
                    element.scrollTop = end;
                }
            }, 1);
        } else if (speed < 0) {
            var timer = setInterval(function () {
                preTop = element.scrollTop;
                element.scrollTop += speed;
                if (preTop == element.scrollTop || element.scrollTop + speed <= end) {
                    clearInterval(timer);
                    element.scrollTop = end;
                }
            }, 1);
        }
    }

    SmallScreen.prototype.setSize = function (width, height) {
        var self = this;
        if (self.isFull) {      //满屏还是满屏
            self.toFull(width, height);
        }
        else {          //小屏还是小屏
            self.toSmall(width, height);
        }
        //内容
        self.content.css({
            "width": innerWidth,
            "height": innerHeight - 57 - Music.FLOOR + "px"
        });
        //返回顶部
        self.floatBoll.css({
            right: '50px',
            bottom: '150px'
        })


    }
    SmallScreen.prototype.toSmall = function (width, height) {
        var self = this;
        self.isFull = false;
        self.full.css({
            "height": Music.FLOOR + "px",
            "width": width + "px"
        });
        self.small.css({
            "height": (height - Music.FLOOR) + "px",
            "width": width + "px"
        });
        self.smLyric.css("height", "20px");
        upIconShow();        //切换点击图标

    }
    SmallScreen.prototype.toFull = function (width, height) {
        var self = this;

        self.full.css({
            "height": height + "px",
            "width": width + "px"
        });
        self.small.css({
            "height": 0 + "px",
            "width": width + "px"
        });
        self.smLyric.css("height", "0px");
        downIconShow();         //切换点击图标
        setTimeout(function () {
            music.lyricObj.scrollLyric();       //歌词滚动到当前位置
            self.isFull = true;
        }, 400);
        //隐藏返回顶部
        self.floatBoll.fadeOut(100);
    }
    function upIconShow() {
        setTimeout(function () {
            $('.fa-angle-double-up').show();
        }, 400);
        $('.fa-angle-double-down').hide();
    }

    function downIconShow() {

        $('.fa-angle-double-up').hide();
        setTimeout(function () {
            $('.fa-angle-double-down').show();
        }, 400);
    }

})();