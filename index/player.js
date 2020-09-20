(function (window) {
    function Player($audio,$bg,$musicMassage) {
        return new Player.prototype.init($audio,$bg,$musicMassage);
    }
    Player.prototype={
        constructor:Player,
        musicList:[],
        init:function ($audio,$bg,$musicMassage) {
            //jq包装好的对象
            this.$audio = $audio;
        //    获取原生的 ???
            this.audio = $audio.get(0);
            this.$bg = $bg;
            this.$musicMassage = $musicMassage;
        },
        //总列表音乐播放控制
        currentIndex :-1,
        playerMusic:function (index,music) {
            //判断是否同一首音乐
            if (this.currentIndex == index){//同一首
                if (this.audio.paused){
                    //原生播放方法
                    // this.audio.load();
                    // setTimeout(function () {
                    this.audio.play();
                    // },200);
                }else {
                    this.audio.pause();
                }
            } else {
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex = index;
                this.musicMassage(music);
            }
        },
        //音乐信息初始化
        initPlayerMusic:function (music) {
            this.musicMassage(music);

        },
    //   音乐信息函数
        musicMassage:function (music) {
            this.$musicMassage.find(".img_massage").attr("src",music.link_img);
            this.$bg.css("background","url(" + music.link_img + ")");
            this.$musicMassage.find(".name_massage").text(music.name);
            this.$musicMassage.find(".singer_massage").text(music.singer);
            this.$musicMassage.find(".album_massage").text(music.album);
            this.$musicMassage.find(".time_massage").text(music.time);
            // var lrc = new Lrc(music.link_lrc);
            // var $ul = $(".right_bottom ul");
            // lrc.musicLrc(function () {
            //     $.each(lrc.lrcs,function (index,ele) {
            //         var $li = $("<li>" + ele + "</li>");
            //         $ul.append($li);
            //     });
            // });
        },
    //    当前时间同步
        currentTimeDate:function (callBack) {
            var $this = this;
            //    时间同步
            this.$audio.on("timeupdate",function () {
                var current = $this.audio.currentTime;
                var duration = $this.audio.duration;
                var currentTime = $this.initDate(current);
                callBack(currentTime,current,duration);
            });
        },
        //    初始化当前播放时间
        initDate:function(currentTime) {
            var minTime = parseInt(currentTime / 60);
            var secTime = parseInt(currentTime % 60);
            if (secTime < 10) {
                secTime = "0" + secTime;
            }
            if (minTime < 10) {
                minTime = "0" + minTime;
            }
            return minTime + ":" + secTime;
        },
    //    拖拽播放控制函数
        progressPlayer:function (percent) {
            if (isNaN(percent)) return;
                this.audio.currentTime = this.audio.duration * percent;
        },
    //    声音图标控制
        voicePlayer:function (percent) {
            if (isNaN(percent)) return;
            if (percent > 0){
                $(".footer_right .mute").addClass("musicplayer-12").removeClass("musicplayer-13");
            }else{
                $(".footer_right .mute").addClass("musicplayer-13").removeClass("musicplayer-12");
            }
        },
    //    声音大小控制
        setVoice:function (value) {
            if (isNaN(value)) return;

            //原生js设置声音大小
            if (value > 1){
                this.audio.volume = 1;
            }else if (value < 0){
                this.audio.volume = 0;
            }else {
                this.audio.volume = value;
            }

        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window)