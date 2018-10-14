(function () {
    window.ImagePixel = function () {
        this.canvas = document.createElement('canvas');   //画布
        this.ctx = this.canvas.getContext('2d');      //上下文
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = "9999";
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px";
        // document.body.appendChild(this.canvas);
        console.info(this.ctx);
        this.img = new Image;        //图片
        this.data;      //ImageData
    }

    ImagePixel.prototype.loadImg = function (src, callback) {
        var self = this;
        this.img.setAttribute("crossOrigin", 'Anonymous');   //跨域访问
        this.img.onload = function () {  //加载图片完成
            self.canvas.width = self.img.width;
            self.canvas.height = self.img.height;
            self.ctx.drawImage(self.img, 0, 0, self.img.width, self.img.height);     //画到画布上
            self.data = self.ctx.getImageData(0, 0, self.img.width, self.img.height).data;  //读取画布上的像素。
            console.log(self.data);
            callback(self.data);    // 回调
        }
        this.img.src = src;      //加载图片

    }

    ImagePixel.prototype.getPixel = function (x, y) {
        if (x > this.img.width || x > this.img.height) {
            throw "超出图片宽度";
        }
        var i = (y * this.img.width + x) * 4;
        var color = "#";
        for (var j = 0; j < 4; j++) {
            var hex = this.data[i + j].toString(16);
            color += hex.length == 2 ? hex : '0' + hex;
        }
        return color;
    }

    ImagePixel.prototype.maxColor = function (increment) {
        console.info(this.img.width, this.img.height);
        increment *= 4;
        var count = [];
        for (var i = 0; i < this.data.length; i += increment) {
            if (this.data[i + 3] == 0) {
                continue;
            }
            var color = "#";
            for (var j = 0; j < 3; j++) {

                var hex = this.data[i + j].toString(16);
                color += hex.length == 2 ? hex : '0' + hex;
            }
            if (count[color] == undefined) {
                count[color] = 0;
            }
            count[color]++;
        }
        var max = Object.keys(count)[0];
        for (var i in count) {
            if (count[max] < count[i]) {
                max = i;
                // console.info(max);
            }
            console.info(i,count[i]);
        }
        console.info(max);
        return max;
    }
})();