(function () {
    window.Sheet = function () {
        this.id = [3778678, 3779629, 19723756, 2884035, 1978921795, 71385702, 991319590, 60198, 180106, 11641012];
        //491416585
        this.userId = null;
        this.sheetList = [];
        this.hList = document.getElementsByClassName('sheet')[0];
        this.hpList = document.getElementsByClassName('sheetList')[0];
        this.hmList = document.getElementsByClassName('sheetMusicList')[0];
        this.mListObj = new List(this.hmList);
        this.isSheet = true;
        this.nowSheetIndex;
        this.sheetScrollTop;
        //设置滑动元素
        this.mListObj.scrollElement = this.hList;
        //创建菜单
        this.createMenu();

        //获取本地ID
        this.getLocalId();

        //创建删除图案
        this.deleteObj = new Delete();
        this.deleteObj.setIcon(2, 50);
    }

    Sheet.prototype.deleteSheet = function () {
        var self = this;
        var child = $(self.hpList.children);
        self.getLocalId();
        console.info(self.id);
        self.deleteObj.start(
            $(self.hpList),
            function (index) {
                console.info(self.id);
                if (self.id[index] == -1) {
                    return;
                }
                if (confirm("确认删除歌单<" + self.sheetList[index].playlist.name + ">？")) {
                    child.eq(index).hide(500);
                    self.id[index] = -1;        //标记要删除的id
                }
            },
            function () {

                var temp = [];
                for (var i in self.id) {
                    if (self.id[i] != -1) {
                        console.info(self.id[i]);
                        temp.push(self.id[i]);
                    }
                }
                self.id = temp;
                console.info(self.id);
                localStorage['id'] = self.id;       //保存
                console.info(self.id);
                self.getUserAllSheet();
            },
            self.id.length
        );
    }


    Sheet.prototype.setLocalId = function () {
        localStorage['id'] = this.id;
        localStorage['userId'] = this.userId;
    }
    Sheet.prototype.getLocalId = function () {
        var id = localStorage['id'];
        if (id != undefined) {//获取到了
            Sheet.copyArray(this.id, id.split(','));
        } else {
            localStorage['id'] = this.id;
        }
        var userId = localStorage['userId'];
        if (userId != undefined) {
            this.userId = userId;
        } else {
            localStorage['userId'] = this.userId;
        }

    }

    Sheet.copyArray = function (target, source) {
        //清空目标数组
        var len = target.length;
        for (var i = 0; i < len; i++) {
            target.pop();
        }
        //复制到目标数组
        for (var i in source) {
            target[i] = source[i];
        }
    }

    //创建 Menu
    Sheet.prototype.createMenu = function () {
        var self = this;
        //Menu
        //歌单菜单
        this.sMenuObj = new Menu([{
            title: "编辑",
            fun: function () { self.deleteSheet(); }
        }, {
            title: "刷新歌单",
            fun: function () { self.reflushSheet(); }
        }, {
            title: "添加歌单ID",
            fun: function () { self.addSheet(); }
        }, {
            title: "设置用户ID",
            fun: function () { self.addUser(); }
        }, {
            title: "帮助",
            fun: function () { self.useHelp(); }
        }, {
            title: "清除所有数据",
            fun: function () {
                if (confirm("这将会删除您所有数据，是否继续?")) {
                    localStorage.clear();
                    location.reload();
                }
            }
        }]);
        //歌单中歌曲菜单
        this.mMenuObj = new Menu([{
            title: "播放全部",
            fun: function () {
                music.useSheet(self.nowSheetIndex);
            }
        }]);
    }
    //显示歌单
    Sheet.prototype.showSheet = function () {
        console.info('showSheet');
        this.isSheet = true;
        var self = this;

        $(this.hmList).slideUp(SmallScreen.SDELAY);

        $(this.hpList).slideDown(SmallScreen.SDELAY, function () {
            // SmallScreen.toScrollTop(self.hList, self.sheetScrollTop); //还原位置
        });
        this.sMenuObj.showMenu();
        self.backButton && self.backButton.hide();

    }
    //显示歌单中的歌曲
    Sheet.prototype.showMusicList = function () {
        var self = this;
        //给歌曲列表创建返回按钮
        if (this.backButton == undefined) {
            this.backButton = music.smallScreen.addTools('arrow-circle-left', function () {
                self.showSheet();
                self.backButton.hide();
            }, '返回');
        }
        this.backButton.show();
        this.isSheet = false;
        this.sheetScrollTop = this.hList.scrollTop;   //记录滑动位置
        this.hList.scrollTop = 0;
        $(this.hpList).hide();
        $(this.hmList).fadeIn(SmallScreen.SDELAY - 200);
        this.mMenuObj.showMenu();
    }
    //获取用户歌单和自带歌单
    Sheet.prototype.getUserAllSheet = function (callback) {
        var musicObj = music;
        var self = this;
        var save = localStorage["cacheU" + self.userId];

        if (save != undefined) {
            var back = JSON.parse(save);
            var day = (new Date().getTime() - back.date) / 1000 / 60 / 60 / 24;
            //如果歌单获取不到一天，直接使用
            if (day < 1) {
                var len = self.id.length;
                for (var i in back.playlist) {
                    self.id.push(back.playlist[i].id);          //存储用户歌单id
                    self.sheetList[len + parseInt(i)] = { playlist: back.playlist[i] };
                }
                callback && self.getAllSheet(callback);         //加载全部歌单
                return;
            }
        }
        musicObj.music.getUserSheet(self.userId, function (back) {

            var len = self.id.length;
            for (var i in back.playlist) {
                self.id.push(back.playlist[i].id);          //存储用户歌单id
                self.sheetList[len + parseInt(i)] = { playlist: back.playlist[i] };
            }
            back['date'] = new Date().getTime();
            localStorage["cacheU" + self.userId] = JSON.stringify(back);     //保存到本地
            self.getAllSheet(callback);         //加载全部歌单
        });
    }
    //获取所有歌单有userId就获取用户歌单
    Sheet.prototype.getAllOfSheet = function (callback) {
        var self = this;
        if (self.userId) {
            self.getUserAllSheet(callback);
        } else {
            self.getAllSheet(callback);
        }
    }

    //获取所有歌单
    Sheet.prototype.getAllSheet = function (callback) {
        var self = this;
        self.initHList();
        for (var i = 0; i < self.id.length; i++) {
            //跳过已经加载过的歌单
            if (self.sheetList[i]) {
                self.write(i);
                continue;
            }
            (function () {
                var index = i;
                self.getSheet(index, function () {
                    self.write(index);                  //写入html
                    callback && callback(index);
                });
            })();
        }
        console.info(self.sheetList);
    }

    //清空歌单
    Sheet.prototype.removeSheet = function () {
        var len = this.sheetList.length;
        for (var i = 0; i < len; i++) {
            this.sheetList.pop();
        }
        $(this.hpList).children().remove();
    }



    //获取单个歌单
    Sheet.prototype.getSheet = function (index, callback) {
        var musicObj = music;
        var self = this;
        var save = localStorage['cache' + self.id[index]];
        if (save != undefined) {
            var list = JSON.parse(save);
            var day = (new Date().getTime() - list.date) / 1000 / 60 / 60 / 24;
            //如果歌单获取超过一天，重新获取
            if (day < 1) {
                self.sheetList[index] = list;
                callback(index);
                return;
            }
        }
        musicObj.music.getSheet(self.id[index], function (back) {
            var list = back;
            //将获取的歌单存储
            list["date"] = new Date().getTime();
            console.info(back);
            if (back.msg != undefined) {
                new Toast(back.msg, 1500);
                callback(-1);
                return;
            }
            localStorage['cache' + self.id[index]] = JSON.stringify(list);       //保存到本地
            self.sheetList[index] = list;
            callback && callback(index);        //每加载完成一个调用回调函数
            return list;
        });
    }
    //初始化HList，创建好歌单格子
    //如果一边获取歌单一边创建html歌单，歌单位置容易混乱，所以先创建好html再将获取到的歌单对应放入就好
    Sheet.prototype.initHList = function () {
        var self = this;
        for (var i = 0; i < self.id.length; i++) {
            var li = document.createElement('li');
            //添加点击事件
            (function () {
                var index = i;
                li.onclick = function () {
                    console.info(index);
                    //存储歌单下标
                    self.nowSheetIndex = index;
                    if (self.sheetList[index] === undefined) {
                        return;
                    }
                    //清空歌曲列表
                    self.mListObj.removeHList();
                    //显示列表
                    self.showMusicList();
                    //加载列表
                    //如果这列表没有歌
                    if (self.sheetList[index].playlist.tracks == null) {
                        console.info(self.sheetList[index]);
                        var load = new Loading($('.main'));
                        load.loading();     //开始加载
                        self.getSheet(index, function (index) {
                            //解析歌单并写入html
                            var list = self.parseSheet(index);
                            self.mListObj.list = list;
                            self.mListObj.pushList(function (index) {
                                music.listObj.insertPlayFunction(list[index]);
                            });
                            load.loaded();      //加载结束
                        });
                        return;
                    }
                    //解析歌单并写入html
                    var list = self.parseSheet(index);
                    self.mListObj.list = list;
                    self.mListObj.pushList(function (index) {
                        music.listObj.insertPlayFunction(list[index]);
                    });
                }
            })();
            self.hpList.appendChild(li);
        }
    }
    //写入HTML，
    Sheet.prototype.write = function (index) {
        if (this.sheetList[index] === undefined) {
            console.error("*" + index);
        }
        this.hpList.children[index].title = this.sheetList[index].playlist.description;
        this.hpList.children[index].innerHTML = '<div class="bg">' + '</div>';
        this.hpList.children[index].innerHTML += '<div class="tabletext">' + this.sheetList[index].playlist.name + ' (' + this.sheetList[index].playlist.trackCount + ')' + '</div>';
        this.hpList.children[index].style.backgroundImage = 'url(' + this.sheetList[index].playlist.coverImgUrl + ')';
        this.hpList.children[index].style.backgroundSize = '100%';
    }




    //解析歌单，将歌单转换为音乐播放列表，才能显示在html列表上
    Sheet.prototype.parseSheet = function (index) {
        var self = this;
        if (!self.sheetList[index]) {
            console.error('self.sheetList[index] == false')
            return [];
        }
        var list = self.sheetList[index].playlist.tracks;
        var musicList = [];
        for (i in list) {
            var artist = "";
            for (var j = 0; j < list[i].ar.length - 1; j++) {
                artist += list[i].ar[j].name + ', ';
            }
            artist += list[i].ar[list[i].ar.length - 1].name
            musicList.push({
                album: list[i].al.name,
                artist: artist,
                id: list[i].id,
                lyric_id: list[i].id,
                name: list[i].name,
                pic_id: list[i].al.pic_str ? list[i].al.pic_str : list[i].al.pic,
                source: "netease",
                url_id: list[i].id,
                dt: list[i].dt,
            });
        }
        return musicList;
    }

    Sheet.prototype.addSheet = function () {
        var self = this;
        var input = prompt("请输入网易云歌单ID");
        if (input == null) {
            return;
        }
        music.music.getSheet(input, function (back) {
            var list = back;
            //将获取的歌单存储
            console.info(back);
            if (back.code != 200) {
                new Toast(back.msg, 1500);
                return;
            }
            list["date"] = new Date().getTime();
            localStorage['cache' + input] = JSON.stringify(list);       //保存到本地
            //获取初始id
            self.getLocalId();
            //在初始id基础上添加新的id
            self.id.push(input);
            self.setLocalId();      //保存到本地
            console.info(self.id);
            //清空列表
            self.removeSheet();
            self.getAllOfSheet(function (index) {
                console.info(index);
            });
            new Toast("已添加 " + '<span class="color-yellow">' + back.playlist.name + '</span>', 3000);
        });
    }

    Sheet.prototype.addUser = function () {
        var self = this;
        var input = prompt("请输入网易云用户ID");
        if (input == null) {
            return;
        }
        music.music.getUserSheet(input, function (back) {
            if (back.code != 200) {
                new Toast(back.msg, 1500);
                return;
            }
            if (back.playlist.length == 0) {
                new Toast('这个用户没有歌单', 1500);
                return;
            }
            //获取初始id
            self.getLocalId();
            //保存用户id
            self.userId = input;
            self.setLocalId();

            back['date'] = new Date().getTime();
            localStorage["cacheU" + self.userId] = JSON.stringify(back);     //保存到本地
            self.removeSheet();
            //加载全部歌单
            self.getAllOfSheet(function (index) {
                console.info(index);

            });
            if (back.playlist.length > 0) {
                new Toast('欢迎  ' + '<span class="color-yellow">' + back.playlist[0].creator.nickname + '</span>', 5000);
            }
        });
    }

    Sheet.prototype.reflushSheet = function () {
        var self = this;
        //清空缓存数据
        for (var key in localStorage) {
            if (key.indexOf('cache') > -1) {
                localStorage.removeItem(key);
            }
        }
        //获取初始id
        self.getLocalId();
        //清空列表
        self.removeSheet();
        self.getAllOfSheet(function (index) {
            console.info(index);
        });
        new Toast("已刷新", 1500);
    }

    Sheet.prototype.useHelp = function () {
        var msg =
            '<h3 class="color-pink">⚪ 设置用户\n</h3>' +
            '<p>1、首先打开网易云音乐官网(<a href="https://music.163.com/" target="_blank" class="color-orange">点击我打开</a>)</p>\n' +
            '<p>2、然后点击页面右上角的“登录”，登录您的账号</p>\n' +
            '<p>3、点击您的头像，进入个人中心</p>\n' +
            '<p>4、此时浏览器地址栏<span class="color-yellow"> /user/home?id= </span>后面的数字就是您的网易云 ID</p>\n\n' +
            '<br>' +
            '<h3 class="color-pink">⚪ 添加歌单</h3>\n' +
            '<p>1、同样点击 确定 打开网易云音乐官网</p>\n' +
            '<p>2、找到一个需要添加的歌单并点击进入</p>\n' +
            '<p>3、此时浏览器地址栏<span class="color-yellow"> playlist?id= </span>后面的数字就是歌单的ID</p>'
        new Dialog(msg);
    }

})();