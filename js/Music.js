(function () {
    var Music = window.Music = function () {
        var self = this;
        //播放器
        this.player = document.getElementsByClassName('musicPlayer')[0];
        this.audio = this.player.getElementsByClassName('myAudio')[0];
        this.name = this.player.getElementsByClassName('musicName')[0];
        this.img = this.player.getElementsByClassName('musicImg')[0];
        this.bgPic = this.player.getElementsByClassName('bgPic')[0];
        this.loading = this.player.getElementsByClassName('loading')[0];
        //进度条
        this.progress = this.player.getElementsByClassName('progressBar')[0];
        this.progressAll = this.progress.getElementsByClassName('progressAll')[0];
        this.progressPoint = this.progress.getElementsByClassName('progressPoint')[0];
        this.progressTime = this.progress.getElementsByClassName('progressTime')[0];
        this.progressAllTime = this.progress.getElementsByClassName('progressAllTime')[0];
        this.progressBuffer = this.progress.getElementsByClassName('progressBuffer')[0];
        //按钮
        this.button = this.player.getElementsByClassName('button')[0];
        this.playButton = this.button.getElementsByClassName('playButton')[0];
        this.preButton = this.button.getElementsByClassName('preButton')[0];
        this.nextButton = this.button.getElementsByClassName('nextButton')[0];
        this.listButton = this.button.getElementsByClassName('listButton')[0];
        this.downloadButton = this.button.getElementsByClassName('downloadButton')[0];
        //音量按钮
        this.volume = $('.volume');

        //歌词
        this.lyric = this.player.getElementsByClassName('lyric')[0];
        this.lyricList = this.lyric.getElementsByClassName('lyricList')[0];


        //列表
        this.playingList = document.getElementsByClassName('playingList')[0];

        //SmallScreen
        this.smallScreen = new SmallScreen();

        //List
        this.listObj = new List(this.playingList);              //创建播放列表
        //设置滑动元素
        this.listObj.scrollElement = $('.playing')[0];

        //Sheet
        this.sheetObj = new Sheet();

        //Search
        this.searchObj = new Search();

        //Menu
        this.menuObj = new Menu([{
            title: "编辑",
            fun: function () {
                self.listObj.deleteList();
            }
        }, {
            title: "清空列表",
            fun: function () {
                self.listObj.removeAll();
                self.listObj.removeHList();
                self.storeSetting();
                new Toast("已清空");
            }
        }]);

        //smallScreen.tools   定位到当前歌曲
        this.tool = this.smallScreen.addTools('dot-circle-o', function () {
            SmallScreen.toScrollTop(self.smallScreen.content[0], $('.musicList li.ing')[0].offsetTop - innerHeight * 0.382);
        }, '定位到当前歌曲');


        //音乐来源

        Music.FLOOR = 100;
        this.lyricObj = new Lyric();            //歌词对象
        this.music = new GetMusic();            //音乐资源对象

        this.srList = [];          //搜索列表
        this.m;             //所选音乐的信息
        //播放顺序
        this.sequenceObj = new Sequence();
        //设置信息
        this.setting;

        //初始化
        this.init();
        //设置大小
        this.dynamicSize();



    }


    //加载音乐并播放
    Music.prototype.loadMusic = function (autoPlay) {
        if (autoPlay === undefined) {
            autoPlay = true;
        }
        if (this.listObj.list.length == 0) {
            return;
        }
        var self = this;

        var now = self.sequenceObj.now();
        //判断是否为同一首歌
        if (self.listObj.list[now].id == self.preMusicId) {
            if (autoPlay && self.audio.paused) {
                self.play();
            }
            return;
        }
        self.preMusicId = self.listObj.list[now].id;

        //存储设置
        music.storeSetting();
        var timer = setTimeout(function () {
            self.loading.className = "loading";
        }, 500);
        console.info(now);


        //设置歌曲id
        self.music.musicId = self.listObj.list[now].id;
        self.music.picId = self.listObj.list[now].pic_id;
        self.music.lyricId = self.listObj.list[now].lyric_id;
        self.music.source = self.listObj.list[now].source;
        //改变列表颜色
        this.changListColor(this.listObj);              //改变播放列表颜色      
        this.changListColor(this.sheetObj.mListObj);    //改变歌单歌曲列表颜色      
        this.changListColor(this.searchObj.sListObj);    //改变搜索列表颜色  

        self.music.getMusic(function (m) {
            self.m = m;
            if (self.m.music.url == "") {     //歌曲没有版权，加载下一首
                new Toast('<span class="color-yellow">' + self.listObj.list[now].name + '</span>' + " 没有版权或者为试听付费音乐！自动播放下一首", 3000);
                console.info(self.listObj.list[now]);
                self.sequenceObj.next();
                self.loadMusic();
            }
            self.audio.oncanplay = function () {
                console.info('canplay');
                if (autoPlay) {
                    self.play();
                }
                self.loading.className = "loaded";
            }
            self.setMusic(m.music.url, self.listObj.list[now].name + ' - ' + self.listObj.list[now].artist, m.pic.url);       //设置音频，图片
            self.lyricObj.m = self.m;               //传入歌词数据
            self.lyricObj.setLyric();               //设置大屏歌词
            self.lyricObj.backTop();                //返回歌词顶部
            clearInterval(timer);
        });
    }



    //歌词显示
    Music.prototype.moveLyric = function () {
        var self = this;
        var pre = self.lyricObj.m.lyric.index;
        var a = $('li.lyricshow1');
        var b = $('li.lyricshow2');
        var c = $('li.lyricshow3');
        if (!this.m.lyric.y[0] && a.html() != "没有歌词") {
            a.html("没有歌词");      //显示歌词
            b.html("没有歌词");
            c.html("没有歌词");
            return;
        }
        that = this.m.lyric.time[Object.keys(self.m.lyric.time)[pre]];
        if (pre == this.m.lyric.preTime) {
            return;
        }

        a.html(that + "");      //显示歌词
        c.html("");      //显示歌词
        a.attr('class', 'lyricshow2');
        b.attr('class', 'lyricshow3');
        c.attr('class', 'lyricshow1');

        this.m.lyric.preTime = pre;
        return;

    }
    Music.prototype.useSheetWithList = function (list, autoplay) {
        var self = this;
        if (autoplay === undefined) {
            autoplay = true;
        }
        //移除旧列表
        self.listObj.removeAll();
        self.listObj.removeHList();
        //将传入的歌单放入到listObj.list中
        self.listObj.list = list;
        //如果还没有加载该歌单
        if (!self.listObj.list) {
            return;
        }
        music.sequenceObj.index = 0;
        music.sequenceObj.setLen(music.listObj.list.length);
        console.info(music.sequenceObj.now());
        //推入HTML中
        self.listObj.pushList(function (index) {
            self.listObj.playFunction(index);
        }, false); //不使用列表动画

    }

    Music.prototype.useSheet = function (index, autoplay) {
        this.useSheetWithList(this.sheetObj.parseSheet(index), autoplay);
        this.loadMusic(autoplay);
    }

    Music.prototype.refresh = function () {
        var self = this;
        self.progressTime.innerText = Music.addZero(new Date(self.audio.currentTime * 1000).getMinutes()) + ':' + Music.addZero(new Date(self.audio.currentTime * 1000).getSeconds());
        //歌词滚动
        self.lyricObj.moveLyric();
        if (!this.smallScreen.isFull) {
            self.moveLyric();
        }
    }
    //存储设置
    Music.prototype.storeSetting = function () {
        this.setting = {
            volume: this.audio.volume,
            sequenceObj_typeIndex: this.sequenceObj.typeIndex,
            sequenceObj_now: this.sequenceObj.now(),
            listObj_list: this.listObj.list,
            isAnimation: this.isAnimation
        }
        localStorage['setting'] = JSON.stringify(this.setting);
    }
    //加载设置
    Music.prototype.loadSetting = function () {
        var setting = localStorage.getItem('setting');
        if (setting == null) {
            this.setting = null;
            return false;
        }
        this.setting = JSON.parse(setting);
        //还原数据
        this.isAnimation = this.setting['isAnimation'];
        this.setVolume(this.setting['volume']);
        this.sequenceObj.setType(this.setting['sequenceObj_typeIndex']);
        this.useSheetWithList(this.setting['listObj_list'], false);
        this.sequenceObj.setNow(this.setting['sequenceObj_now']);
        this.loadMusic(false);
        return true;
    }

    //初始化
    Music.prototype.init = function () {
        var self = this;

        //窗口大小调整
        window.onresize = function () {
            self.dynamicSize();
        }
        //音频
        this.audio.onplay = function () {
            self.playButton.getElementsByTagName('i')[0].className = "fa fa-pause";
        }
        //播放结束的动作
        this.audio.onended = function () {
            // self.pause();
            self.sequenceObj.next();        //下一首
            self.loadMusic();
        }

        //音频加载错误
        this.audio.onerror = function () {
            console.error("音频加载失败");
        }

        //音频加载中


        //音量
        this.setVolume = function (volume) {
            volume = volume < 0 ? 0 : volume;
            volume = volume > 1 ? 1 : volume;
            //音量条移动
            var x = volume * volumeLen;
            volumeBoll.css('left', x + 'px');
            //图标改变
            if (volume == 0) {          //音量为0使用这个图标
                self.volume.find('i').attr('class', 'fa fa-volume-off volumeButton');
            }
            else if (volume < 0.5) {
                self.volume.find('i').attr('class', 'fa fa-volume-down volumeButton');
            }
            else {
                self.volume.find('i').attr('class', 'fa fa-volume-up volumeButton');
            }
            self.audio.volume = volume;

        }

        var volumeLine = this.volume.find('.volumeLine');
        var volumeBoll = this.volume.find('.volumeBoll');
        var volumeShell = this.volume.find('.volumeShell');
        var volumeLen = volumeLine.innerWidth() - volumeBoll.width() / 2;
        this.volume.find('.volumeButton').click(function () {
            self.volume.find('.volumeBox').fadeToggle(300);
            return false;
        });
        $(window).click(function () {
            self.volume.find('.volumeBox').fadeOut(300);
        });
        // 点击
        this.volume.click(function () {
            return false;
        });
        volumeShell.click(function (e) {
            self.setVolume((e.offsetX - 10 - 6) / volumeLen);
            //存储设置
            self.storeSetting();
            return false;
        });
        //滑动
        //鼠标在球下按下鼠标表示开始滑动
        volumeBoll.mousedown(function (e) {
            volumeBoll.css({
                'zIndex': '0',
                'transition': "left 0s"
            });
            //鼠标抬起事件  滑动结束
            $(window).mouseup(function () {
                $(window).unbind('mousemove');
                $(window).unbind('mouseup');
                volumeBoll.css({
                    'zIndex': '1',
                    'transition': "left 0.3s"
                });
                console.info(self.audio.volume);
                //存储设置
                self.storeSetting();
                return false;
            });
            var left = volumeBoll[0].offsetLeft;        //球距离最小音量的长度
            var startX = e.clientX - left;                  //最小音量在屏幕上的X坐标
            //鼠标移动      改变音量和球位置
            $(window).mousemove(function (e) {
                self.setVolume((e.clientX - startX) / volumeLen);       //鼠标距离最小音量的长度
                return false;
            });
            return false;
        });

        //进度条
        this.progress.onclick = function (e) {
            if (self.audio.src) {
                var x = e.offsetX - 6;
                self.audio.currentTime = x * self.audio.duration / self.progressLen;
                self.progressPoint.style.left = x + 'px';
                music.lyricObj.scrollLyric();       //歌词滚动到当前位置
            }
        }
        //滑动结束鼠标抬起
        window.onmouseup = function () {
            self.progressPoint.style.transition = 'left 0.3s';
            self.progress.onmousemove = null;
        }
        //鼠标按下，开始滑动
        this.progress.onmousedown = function () {
            self.progressPoint.style.transition = '0s';
            //滑动
            this.onmousemove = function (e) {
                var x = e.offsetX - 6;
                if (self.audio.src) {
                    self.audio.currentTime = x * self.audio.duration / self.progressLen;
                    self.progressPoint.style.left = x + 6 + 'px';
                }
            }
        }


        this.playButton.onclick = function () {

            if (self.audio.paused) {
                self.play();
            }
            else {
                self.pause();
            }
        }
        this.downloadButton.onclick = function () {
            if (self.m.music.url) {
                window.open(self.m.music.url);
            }
        }

        this.nextButton.onclick = function () {
            self.sequenceObj.next();
            self.loadMusic();
        }
        this.preButton.onclick = function () {
            self.sequenceObj.previous();
            self.loadMusic();
        }


    }
    Music.prototype.dynamicSize = function () {
        var self = this;
        self.lyricObj.setSize(innerWidth, innerHeight);
        self.smallScreen.setSize(innerWidth, innerHeight);
        self.searchObj.setPosition();
        self.setSize(innerWidth, Music.FLOOR);

    }

    Music.prototype.setMusic = function (src, name, img) {
        var self = this;
        if (src == "") {
            return;
        }
        src = src.replace(/:\/\/m(\d)c/, '://m7');         //去掉c，网易前缀有c会出现请求403
        this.prePlaySrc = self.audio.src;       //存储上次src
        this.m.music.url = src;
        this.audio.src = src;
        this.name.innerHTML = name;
        this.img.style.backgroundImage = 'url(' + img + ')';



    }

    //接收一个列表对象，改变该列表正在播放歌曲的颜色
    Music.prototype.changListColor = function (listObj) {
        //歌曲列表
        var hList = $(listObj.hList).find('li');      //选取li
        var list = listObj.list;
        for (var i = 0; i < hList.length; i++) {
            if (hList[i].className == 'ing') {
                hList[i].className = '';
                $(hList[i]).find('.listNumIng').attr('class', 'listNum').text(i + 1);
            }
            if (list[i].id == this.music.musicId && list[i].source == this.music.source) {
                hList[i].className = 'ing';
                $(hList[i]).find('.listNum').attr('class', 'listNumIng').text('');
            }
        }
    }

    Music.prototype.play = function () {

        var self = this;
        if (!self.audio.src) {
            return;
        }
        self.audio.play();


        self.audio.onabort = function () {
            console.info('over');
        }

        //设置进度条
        var minutes = new Date(self.audio.duration * 1000).getMinutes();
        var seconds = new Date(self.audio.duration * 1000).getSeconds();
        self.progressAllTime.innerHTML = Music.addZero(minutes) + ':' + Music.addZero(seconds);
        //提前显示
        self.refresh();
        self.progressPoint.style.left = self.progressLen * self.audio.currentTime / self.audio.duration + 'px';         //进度条
        this.timer1;
        this.timer2;
        clearInterval(this.timer1);
        clearInterval(this.timer2);
        this.timer1 = setInterval(function () { self.refresh(); }, 100);
        //进度条定时器刷新时间较慢，因为太快了在滑动或点击时容易卡顿
        this.timer2 = setInterval(function () {
            self.progressLen = self.progressAll.offsetWidth - 6;        //进度条长度
            self.progressPoint.style.left = self.progressLen * self.audio.currentTime / self.audio.duration + 'px';         //进度条
            //显示缓存条
            // var buffer = self.audio.buffered;
            // // if(buffer.)
            // var htmlBuffer = "";
            // for (var i = 0; i < buffer.length; i++) {
            //     var start = self.progressLen * buffer.start(i) / self.audio.duration;
            //     var end = self.progressLen * buffer.end(i) / self.audio.duration;
            //     htmlBuffer += '<span style="left:' + start + 'px;width:' + (end - start) + 'px"></span>';
            //     console.info(i + " : " + buffer.start(i) + ' - ' + buffer.end(i));
            // }
            // self.progressBuffer.innerHTML = htmlBuffer;

        }, 1000);
    }
    Music.prototype.pause = function () {
        this.audio.pause();
        this.playButton.getElementsByTagName('i')[0].className = "fa fa-play";
    }

    Music.addZero = function (num) {
        return num = num < 10 ? '0' + num : num + "";
    }
    Music.prototype.setSize = function (width, height) {
        //播放器
        this.player.style.width = width + 'px';
        this.player.style.height = height + 'px';
        //图片
        this.img.style.width = height + 'px';
        this.img.style.height = height + 'px';
        this.img.style.backgroundSize = height + 'px ' + height + 'px';
        //加载背景
        this.loading.style.width = width + 'px';
        this.loading.style.height = height + 40 + 'px';
        //背景图片
        this.bgPic.style.width = width + 'px ';
        this.bgPic.style.height = height + 40 + 'px ';
        this.bgPic.style.backgroundSize = width + 'px ';
        //歌名
        this.name.style.left = height + height / 10 + 'px';
        //进度条
        this.progress.style.left = height + height / 10 + 'px';
        this.progress.style.top = height / 3 + 'px';
        this.progress.style.width = width - height - height / 10 - 30 + 'px';
        this.progressAll.style.width = width - height - height / 10 - 30 + 'px';
        //按钮
        this.button.style.left = height + height / 10 + 'px';
        this.button.style.top = height * 2 / 3 + 'px';
        this.button.style.width = width - height - height / 10 - 30 + 'px';

        //歌词
        this.lyric.style.width = width + 'px';
        this.lyric.style.top = height - 30 + 'px';
        var lyrics = $(this.lyricList).children();
        for (var i = 0; i < lyrics.length; i++) {
            lyrics.eq(i).css('width', width);
        }

    }
}());