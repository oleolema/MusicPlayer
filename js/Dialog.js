(function () {
    window.Dialog = function (text, time) {
        this.text = text;
        this.time = time || 2000;

        // this.show = function(){
        //     console.info('asd');
        //     this.__proto__.show();
        // }
        // this.show();
        // Toast.call(this);
        console.info(this);
    }
    Dialog.prototype = Toast.prototype;

})();