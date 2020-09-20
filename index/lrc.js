(function (window) {
    function Lrc(path) {
        return new Lrc.prototype.init(path);
    }
    Lrc.prototype = {
        constructor:Lrc,
        time:[],
        lrcs:[],

        init:function (path) {
            this.path = path;
        },
        musicLrc:function (callBack) {
            var $this = this;
            $.ajax({
                url:$this.path,
                dataType:"text",
                success:function(data){
                    $this.parseLrc(data);
                    //回调函数
                    callBack();
                },
                error:function(e){
                    console.log(e);
                }
            });
        },
        parseLrc:function (data) {
            var $this = this;
            //清空上一首
            $this.time=[];
            $this.lrcs=[];
            var arr = data.split("\n");
            //加括弧即单独取出(分组)
            var time = /\[(\d*\:\d*\.\d*)\]/;
            $.each(arr,function (index,ele) {
                var lrcr = ele.split("]")[1];
                //去除歌曲中空行部分**
                if (lrcr === '')return true;
                $this.lrcs.push(lrcr);
                // console.log(lrcr);
                var res = time.exec(ele);
                // console.log(index);
                //继续执行下一次循环
                if (res == null) return true;
                var timeStr = res[1];
                var timer = timeStr.split(":");
                var min = Number(timer[0]*60 + parseInt(timer[1]));
                // console.log(min);
                $this.time.push(min);

            })
            // console.log(time.test(arr));
        },
        currentIndex:-1,
        lrcProgress:function (current) {
            // if (this.currentIndex == -1)return ;
            // console.log(current.toFixed(2));


            if (current >= this.time[0]){

                this.time.shift();
                this.currentIndex++;
                // console.log(current, this.time[0]);
            }
            return this.currentIndex;
        }


    }
    Lrc.prototype.init.prototype = Lrc.prototype;
    window.Lrc = Lrc;
})(window)