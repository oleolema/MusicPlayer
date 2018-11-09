(function () {
    var GetMusic = window.GetMusic = function () {
        var self = this;
        this.back = [];
        this.count = 20;
        this.source;
        this.pages = 1;
        this.name = "";
        this.picId;
        this.lyricId;
        this.musicId;
        this.sheetId;
        //全局函数
        window.yue107 = function (e) {
            self.back = e;
        }
    }

    GetMusic.prototype.http = function (src, callback) {
        var self = this;
        //加载script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        document.head.appendChild(script);
        script.onload = function () {
            callback(self.back);
            if (script) {
                document.head.removeChild(script);      //脚本加载完成后删除该脚本
            }
        }
    }
    GetMusic.prototype.getSheet = function (sheetId, callback) {
        this.http('https://y.xuelg.com/api.php?callback=yue107&types=playlist&id=' + sheetId, callback);
    }
    GetMusic.prototype.getUserSheet = function (userId, callback) {
        this.http('https://y.xuelg.com/api.php?callback=yue107&types=userlist&uid=' + userId, callback);
    }
    GetMusic.prototype.searchMusic = function (pages, callback) {
        this.http('https://y.xuelg.com/api.php?callback=yue107&types=search&count=' + this.count + '&source=' + this.source + '&pages=' + pages + '&name=' + this.name, callback);
    }
    GetMusic.prototype.getLyric = function (callback) {
        this.http("https://y.xuelg.com/api.php?callback=yue107&types=lyric&id=" + this.lyricId + "&source=" + this.source, callback);
    }
    GetMusic.prototype.getPic = function (callback) {
        this.http("https://y.xuelg.com/api.php?callback=yue107&types=pic&id=" + this.picId + "&source=" + this.source, callback);
    }
    GetMusic.prototype.getMusic = function (callback) {
        var self = this;
        var music = {};
        this.http("https://y.xuelg.com/api.php?callback=yue107&types=url&id=" + this.musicId + "&source=" + this.source, function () {
            music.music = self.back;
            self.getLyric(function () {
                music.lyric = {
                    y: self.back.lyric.split('\n'),
                    t: self.back.tlyric.split('\n'),
                    n: 0
                }
                self.getPic(function () {
                    music.pic = self.back;
                    callback(music);
                });
            });
        });

    }



}());