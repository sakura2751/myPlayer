(function (window) {
    function Progress($progressAll,$progressBar,$progressDot) {
        return new Progress.prototype.init($progressAll,$progressBar,$progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        flag:false,
        init: function ($progressAll,$progressBar,$progressDot) {
            this.$progressAll = $progressAll;
            this.$progressBar = $progressBar;
            this.$progressDot = $progressDot;
        },
        // 对进度条背景的点击操作
        musicProgress:function(callback) {
            var $this = this;
            var $progressLeft = parseInt(this.$progressAll.offset().left);
            var $allWidth = parseInt(this.$progressAll.css("width"));
            var $progress;
            this.$progressAll.click(function (e) {
                $this.flag = true;
                var e = e || window.event;
                $progress = e.clientX - $progressLeft;
                if ($progress <=  0){
                    $len = 0;
                }else if ($progress >= $allWidth){
                    $len = $allWidth;
                }else {
                    $len = $progress;
                }
                $this.$progressBar.css("width", $progress + "px");
                $this.$progressDot.css("left", $progress + "px");
                callback($progress);
                $this.flag = false;
            });
        },
        //    拖拽进度条
        moveProgress:function (callBack) {
            var $this = this;
        //    1.鼠标按下
            var $progressLeft = parseInt(this.$progressAll.offset().left);
            var $allWidth = parseInt(this.$progressAll.css("width"));
            var $len,$progress;
            this.$progressAll.mousedown(function () {
                $this.flag = true;
                //    2.鼠标移动
                $(document).mousemove(function (ev2) {
                    $progress = ev2.clientX - $progressLeft;
                    if ($progress <=  0){
                       $len = 0;
                    }else if ($progress >= $allWidth){
                       $len = $allWidth;
                    }else {
                        $len = $progress;
                    }
                    $this.$progressBar.css("width", $len );
                    $this.$progressDot.css("left", $len );

                });
            });
        //    3.鼠标抬起
            $(document).mouseup(function () {
                $(document).off("mousemove");
                callBack($progress);
                $this.flag = false;
            });

        },
    //    实时更新进度条
        setProgress:function (value,percent) {
            if (this.flag)return;
            if (percent < 0 || percent >= 1) return;
            this.$progressBar.css("width",value);
            this.$progressDot.css("left",value);

        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window)