(function () {
    window.Search = function () {
        this.sList = document.getElementsByClassName('search')[0];
        this.searchList = this.sList.getElementsByClassName('searchList')[0];
        //搜索框
        this.searchGroup = document.getElementsByClassName('searchGroup')[0];
        this.searchInput = document.getElementsByClassName('searchInput')[0];
        this.sButton = this.searchGroup.getElementsByClassName('sButton')[0];
        this.radioGroup = this.searchGroup.getElementsByClassName('radioGroup')[0];
        this.sListObj = new List(this.searchList);              //创建搜索列表
        this.isSearching = false;       //是否在加载中
        this.searchSource = 'netease';
        this.init();
        this.sListObj.scrollElement = this.sList;
    }

    Search.prototype.init = function () {
        var self = this;
        //搜索按钮
        this.sButton.onclick = function () {
            var musicObj = music;
            musicObj.music.source = self.searchSource;
            musicObj.music.name = self.searchInput.value;
            if (musicObj.music.name == "") {
                return;
            }
            self.searchPage = 1;
            self.smusic();
        }
        //搜索输入框
        this.searchInput.onkeydown = function (e) {
            var musicObj = music;
            if (e.key == "Enter") {
                musicObj.music.source = self.searchSource;
                musicObj.music.name = this.value;
                if (this.value == "") {
                    return;
                }
                self.searchPage = 1;
                self.smusic();
            }
        }
        //搜索框选择按钮点击
        var rgChild = $(".radioGroup").children();
        var radiobg = $('.radioGroup .radio6');
        var radiohbg = $('.radioGroup .radio7');
        rgChild.click(function () {
            for (var i = 0; i < rgChild.length - 2; i++) {
                if (rgChild[i] == this) {
                    rgChild.eq(i).children(0).attr('check', 'true');
                    self.searchSource = rgChild.eq(i).children(0).attr('source');
                    radiobg.css('left', rgChild.eq(i).children(0)[0].offsetLeft + 'px');        //滑动
                    console.info(rgChild.eq(i).children(0)[0].offsetLeft);
                } else {
                    rgChild.eq(i).children(0).attr('check', 'false');
                }
            }
        });
        //搜索框按钮滑动
        // rgChild.hover(function () {
        //     radiohbg.css({
        //         'left': this.offsetLeft + 'px',
        //         opacity: 1
        //     });
        // }, function () {
        //     radiohbg.css({
        //         opacity: 0
        //     });
        // });
    }
    //搜索音乐
    Search.prototype.smusic = function () {
        var self = this;
        if (this.isSearching) {
            return;
        }
        var load = new Loading($('.main'));
        var musicObj = music;
        console.info(self.searchPage);
        if (self.searchPage < 0) {      //搜索到底直接返回
            return;
        }
        load.loading();
        self.isSearching = true;
        musicObj.music.searchMusic(self.searchPage, function (back) {
            console.info(back);
            if (self.searchPage == 1) {
                //移除旧列表
                self.sListObj.removeHList();
                self.sListObj.removeAll();
            }
            //搜索结果放入搜索列表
            self.sListObj.pushArray(back);

            if (self.sListObj.list.length == 0) {         //没有搜索结果
                self.sListObj.hList.innerHTML = '<li style="text-align:center;margin-top: 100px;">' + '没有找到音乐' + '</li>';
            } else if (back.length == 0) {              //搜索到尾了
                var li = document.createElement('li');
                li.innerText = '到底了~';
                li.style.textAlign = "center";
                self.sListObj.hList.appendChild(li);
                self.searchPage = -1;
            } else {
                var start = musicObj.music.count * (self.searchPage - 1);
                self.sListObj.pushList(function (index) {
                    musicObj.listObj.insertPlayFunction(self.sListObj.list[index]);
                }, !start, start);
                self.searchPage++;
            }
            self.isSearching = false;
            load.loaded();
        });
    }

    Search.prototype.setPosition = function () {
        this.offsetWidth = this.searchGroup.offsetWidth || this.offsetWidth;
        this.searchGroup.style.left = (innerWidth - this.offsetWidth) / 2 + 'px';

    }

})();