(function () {
    window.Sequence = function () {
        this.sequenceButton = $('.sequenceButton');
        //播放顺序
        var self = this;
        this.type = [{
            icon: 'fa fa-refresh',
            fun: function (len) { self.loop(len); }
        },
        {
            icon: 'fa fa-random',
            fun: function (len) { self.random(len); }
        }];
        this.typeIndex = 0;            //顺序类型下标
        this.sequence = [];
        this.index = 0;         //播放下标
    }

    Sequence.prototype.canClick = function () {
        var self = this;
        //点击事件绑定
        this.sequenceButton.click(function () {
            self.typeIndex = (self.typeIndex + 1) % self.type.length;
            self.sequenceButton.children(0).attr('class', self.type[self.typeIndex].icon);
            self.setLen(music.listObj.list.length);
        });
    }

    Sequence.prototype.setLen = function (len) {
        console.info('setLen');
        this.sequenceButton.children(0).attr('class', this.type[this.typeIndex].icon);
        this.type[this.typeIndex].fun(len);
    }

    Sequence.prototype.random = function (len) {
        len = len || music.listObj.list.length;
        var now = this.now()          //恢复位置
        var temp = [];
        for (var i = 0; i < len; i++) {     //先有序
            temp[i] = i;
        }
        var t, r;
        for (var i = 0; i < len; i++) {         //再随机打乱
            r = parseInt(Math.random() * len);
            t = temp[i];
            temp[i] = temp[r];
            temp[r] = t;
        }
        this.sequence = temp;
        this.setNow(now);
    }

    Sequence.prototype.loop = function (len) {
        var now = this.now()        
        len = len || music.listObj.list.length;
        var temp = [];
        for (var i = 0; i < len; i++) {
            temp[i] = i;
        }
        this.sequence = temp;
        this.setNow(now);
    }

    Sequence.prototype.setNow = function (e) {
        for (var i = 0; i < this.sequence.length; i++) {
            if (this.sequence[i] == e) {
                this.index = i;
                return;
            }
        }
        console.info('out bounds' + this.index);
    }

    Sequence.prototype.now = function () {
        return this.sequence[this.index] == undefined ? 0 : this.sequence[this.index];
    }

    Sequence.prototype.next = function () {
        this.index = (this.index + 1) % this.sequence.length;
        return this.sequence[this.index];
    }

    Sequence.prototype.previous = function () {
        this.index = (this.index + this.sequence.length - 1) % this.sequence.length;
        return this.sequence[this.index];
    }
})();