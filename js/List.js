(function () {
    window.List = function (hList) {
        this.hList = hList;       //HTML列表
        this.list = [];          //播放列表
        this.sildebg = null;
        this.scrollElement = null;

        //创建删除图案
        this.deleteObj = new Delete();
        this.deleteObj.setIcon(1, 40);     //图标设置为右滑50px

    }

    List.prototype.deleteList = function () {
        var self = this;
        var now = music.sequenceObj.now();          //获取当前播放位置
        console.info(now);
        var tempNow = now;          //位置2
        var child = $(self.hList.children);
        this.deleteObj.start($(this.hList),
            //每次点击删除图标
            function (index) {
                child.eq(index).slideUp(100);
                if (self.list[index].d == 1) {
                    return;
                }
                self.list[index].d = 1;         //标记需要删除的歌
                //如果删除的是当前播放的前面的一首
                if (index < tempNow) {
                    now--;       //当前播放前移
                }
                //删除结束
            }, function () {
                console.info('oik');
                //删除歌
                var temp = [];
                for (var i in self.list) {
                    if (self.list[i].d == undefined) {
                        temp.push(self.list[i]);
                    }
                }
                self.list = temp;
                //清空列表
                self.removeHList();
                //重新写入
                self.pushList(function (index) {
                    self.playFunction(index);
                }, false);
                //设置当前播放位置
                music.sequenceObj.setLen(self.list.length);      //重新设置长度（列表发生改变后都应该调用）
                music.sequenceObj.setNow(now);
                music.loadMusic(!music.audio.paused);
            });
    }



    List.prototype.removeAll = function () {
        var self = this;
        var len = self.list.length;
        for (var i = 0; i < len; i++) {
            self.list.pop();
        }
    }
    List.prototype.pushArray = function (arr) {
        for (var i in arr) {
            this.list.push(arr[i]);
        }
    }
    List.prototype.removeHList = function () {
        var allLi = this.hList.children;
        for (var i = allLi.length - 1; i >= 0; i--) {
            this.hList.removeChild(allLi[i]);
        }
    }

    List.prototype.insert = function (element, index) {
        var self = this;
        self.list.splice(index, 0, element);        //插入列表
        console.info(index);

        self.removeHList();     //清空列表
        self.pushList(function (index) {
            self.playFunction(index);
        }, false);            //刷新列表
    }

    //在播放列表中点击index后发生的动作
    List.prototype.playFunction = function (index) {
        music.sequenceObj.setNow(index);
        music.loadMusic();
    }

    //搜索列表中点击index后发生的动作
    List.prototype.insertPlayFunction = function (listChild) {
        var self = music.listObj;
        //如果没有时间
        if (listChild.dt == undefined) {
            listChild.dt = 0;
        }
        //如果播放列表已有这首歌，直接播放
        for (var i in self.list) {
            if (self.list[i].id == listChild.id && self.list[i].source == listChild.source) {

                music.sequenceObj.setNow(parseInt(i));        //播放第i首歌
                music.loadMusic();           //播放
                return;
            }
        }
        //没有这首歌就插入播放列表
        self.insert(listChild, music.sequenceObj.next());        //插入到下一个位置
        music.sequenceObj.setNow(music.sequenceObj.now());              //播放插入这首
        music.sequenceObj.setLen(self.list.length);      //重新设置长度（列表发生改变后都应该调用）
        music.loadMusic();           //播放
    }
    // 将list添加到html中hList元素中，并给每个元素添加点击事件callback
    //callback 每个列表的点击事件
    //animation 是否开启列表动画
    //列表的起始位置
    List.prototype.pushList = function (callback, animation, start) {
        if (animation == undefined) {
            animation = true;
        }
        console.info(animation);
        start = start || 0;
        var self = this;
        var list = self.list;
        if (!self.hList) {
            return null;
        }
        var len = list.length;
        //有滑动元素就设置滑动效果
        if (!self.sildebg && self.scrollElement) {
            //先添加一个滑动背景
            self.sildebg = $('<div class="listSlide" style="width:100%"   ></div>');
            $(self.hList).before(self.sildebg);
        }

        //创建新列表
        for (var i = start; i < len; i++) {
            var li = document.createElement('li');
            var time = Music.addZero(new Date(list[i].dt).getMinutes()) + ':' + Music.addZero(new Date(list[i].dt).getSeconds())
            var html =
                '<span style="margin-right:2em;width:2em;text-align:right;float:left" class="listNum">' + (i + 1) +
                '</span> <span style="float:left;width:30%;margin-right:0px;">' + list[i].name +
                '</span>';
            //是否有时间
            if (list[i].dt != undefined) {
                html = html +
                    '<span style="width:3em;float:right;margin-right:10%">' + time +
                    '</span>'
            }
            html = html +
                '<span style="float:right">' + list[i].album +
                '</span> <span style="float:right">' + list[i].artist +
                '</span>';
            li.innerHTML = html;
            //正在播放的歌曲突出显示
            if (music && list[i].id == music.music.musicId) {
                console.info(music.music.musicId);
                li.className = "ing";
                $(li).find('.listNum').attr('class', 'listNumIng').text('');
            }
            self.hList.appendChild(li);
            //前20个列表动画效果
            if (animation && i < 20 + start) {
                //效果1
                li.style.height = '20px';
                (function () {
                    var templi = li
                    setTimeout(function () {
                        templi.style.height = '50px';
                    }, 15);
                }());

                //效果2
                // li.style.transform = 'scaleX(.5)';
                // (function () {
                //     var templi = li;
                //     var time = i;
                //     setTimeout(function () {
                //         templi.style.transform = 'scaleX(1)';
                //     }, 15 + i * 15);
                // }());
            }
            //给每个列表添加事件
            (function () {
                var index = i;
                $(li).click(function () {
                    callback(index);
                });
                //有滑动元素就设置滑动效果
                if (self.scrollElement) {
                    $(li).hover(function () {
                        self.sildebg.css({
                            opacity: 1,
                            top: this.offsetTop - self.scrollElement.scrollTop
                        });
                        return false;
                    }, function () {
                        self.sildebg.css({
                            opacity: 0,
                            top: '0xp'
                        });
                        return false;
                    });
                }
            }());
        }
    }
})();