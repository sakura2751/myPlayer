$(function () {
    var lrc;
//   1.滚动条样式
   $(".content_list").mCustomScrollbar();
   $(".player_box").mCustomScrollbar();
    //2.播放进度条总长 声音进度条总长
    var $allLength = $(".progress_all").width();
    var $voiceAllLength = $(".voice").width();
    //  3.获取音乐播放标签
    var $audio = $("audio");
    var $bg = $(".bg_mask");
    var $musicMassage = $(".music_massage");
    var player = new Player($audio,$bg,$musicMassage);

    //  4.监听音乐进度条拖拽
    var $progressAll = $(".progress_all");
    var $progressBar = $(".progress_bar");
    var $progressDot = $(".progress_dot");
    var progress = new Progress($progressAll,$progressBar,$progressDot);
    progress.musicProgress(function (value) {
        player.progressPlayer(value/$allLength);
    });
    progress.moveProgress(function (value) {
        player.progressPlayer(value/$allLength);
    });
    //  5.监听声音进度条拖拽
    var $voice = $(".voice");
    var $voiceBar = $(".voice_bar");
    var $voiceDot = $(".voice_dot");
    var voiceProgress = new Progress($voice,$voiceBar,$voiceDot);
    voiceProgress.musicProgress(function (value) {
        player.voicePlayer(value/$voiceAllLength);
        player.setVoice(value/$voiceAllLength);
    });
    voiceProgress.moveProgress(function (value) {
        player.voicePlayer(value/$voiceAllLength);
        player.setVoice(value/$voiceAllLength);
    });

    //    点击图标音量控制切换
    voiceCheck();
    function voiceCheck() {
        $(".footer_right .mute").on("click",function () {
            $(this).removeClass("musicplayer-12").addClass("musicplayer-13");
            if ($(this).hasClass("musicplayer-13")){
                $(".voice_bar").css("width","0");
                $(".voice_dot").css("left","0");
                player.setVoice(0);
            }
        });
    }
    //1.获取歌曲列表信息
    getMusicList();
    function getMusicList(){
        $.ajax({
           url:"../musicSorce/tsconfig.json",
            dataType:"json",
            success:function(data){
               player.musicList = data;
                //    遍历数据
                var $contentList = $("#list");
                $.each(data,function(index,ele){
                    var $item = createMusicLists(index,ele);
                    $contentList.append($item);
                });
                initMusicPlayer(data[0]);
            },
            error:function(e){
                console.log(e);
            }
        });
    }
    // 2.创建歌曲列表
    function createMusicLists(index,music){
        var $item = $("<li class='li_parent'>\n" +
            "                            <div>\n" +
            "                                <i class=\"nocheck control_check \"></i>\n" +
            "                            </div>\n" +
            "                            <div id=\"number\">"+ (index + 1) +"</div>\n" +
            "                            <div class='name' title='" + music.name +"'>" + music.name + "</div>\n" +
            "                            <div>\n" +
            "                                <ul class=\"action\">\n" +
            "                                    <li><a class=\"musicplayer-3 control_player\" href=\"javascript:;\"></a></li>\n" +
            "                                    <li><a class=\"musicplayer-icon_add one_add\" href=\"javascript:;\"></a></li>\n" +
            "                                    <li><a class=\"musicplayer-arrow-down-circle-line\" href=\"javascript:;\"></a></li>\n" +
            "                                </ul>\n" +
            "                            </div>\n" +
            "                            <div class='singer' title='" + music.singer + "'>" + music.singer + "</div>\n" +
            "                            <div>" + music.time + "</div>\n" +
            "                        </li>");
        //将index和列表赋值给原生的
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }

    // 获取歌词信息
    function initLrc(music) {
        lrc = new Lrc(music.link_lrc);
        var $ul = $(".right_bottom ul");
        //清空上一首歌词
        $ul.html("");
        lrc.musicLrc(function () {
            $.each(lrc.lrcs,function (index,ele) {
                var $li = $("<li>" + ele + "</li>");
                $ul.append($li);
            });
        });

    }
    // 初始化歌曲播放
    function initMusicPlayer(music) {
        player.initPlayerMusic(music);
        initLrc(music);
    }


//    复选框监听
    recheck();
    function recheck() {
        // 1.复选框点击事件监听
        $("#list").delegate(".control_check","click",function () {
            $(this).toggleClass("nocheck").toggleClass("musicplayer-checkbox-marked");

        });
        // 2.总复选框点击事件
        $(".check_all").on("click",function () {
            $(this).toggleClass("nocheck").toggleClass("musicplayer-checkbox-marked");
            if ($(this).hasClass("nocheck")){
                $("#list i").addClass("nocheck").removeClass("musicplayer-checkbox-marked");
            }else {
                $("#list i").addClass("musicplayer-checkbox-marked").removeClass("nocheck");
            }
        });
    }
//    顶部事件
//     var beforeList = [];
    // var currentList = [];
    //记录添加数量
    var current = 0;
    collecterAddLoad();
    function collecterAddLoad() {
        // 1.收藏事件
        $(".collect").on("click",function () {
            $(".li_parent").each(function (index,ele) {
                if ($(this).find(".control_check").hasClass("musicplayer-checkbox-marked")){
                    $(this).addClass("like");
                    $(this).find(".control_check").removeClass("musicplayer-checkbox-marked").addClass("nocheck");
                }
            });
        });
        // 2.添加事件
        $(".add").on("click",function () {
            $(".li_parent").each(function () {
                if ($(this).find(".control_check").hasClass("musicplayer-checkbox-marked")){
                    // beforeList.push($(this).context.index);
                    // currentList.push(current++);
                    // console.log(beforeList,currentList);
                    current++;
                    $(this).find(".control_check").removeClass("musicplayer-checkbox-marked").addClass("nocheck");
                    var $item =  add($(this).find(".name").html(),$(this).find(".singer").html());
                    $(".player_box ul").append($item);
                }
            });
        });
    //    3.单首歌曲添加事件
        $("#list").delegate(".one_add","click",function () {
            var $item =  add($(this).parents(".li_parent").find(".name").html(),$(this).parents(".li_parent").find(".singer").html());
            $(".player_box ul").append($item);
            current++;
            // beforeList.push($(this).parents(".li_parent").index(0));
            // currentList.push(current++);
            // console.log(beforeList,currentList);
        });
    }
    //  4.添加播放列表
    function add(name,singer) {
        var $item = $("<li class='add_parent' >\n" +
            "                           <a class = 'add_player' href='javascript:;'><span class='add_name'>" + name +"</span>-<span>" + singer + "</span></a>" +
            "<a href='javascript:;' class='dele'>删除</a>" +
            "                        </li>");
        return $item;
    }
//    播放列表事件
    playList();
    function playList() {

        //  1.删除添加的播放列表
        $(".player_box").delegate(".dele","click",function () {
            $(this).parents(".add_parent").remove();
            current--;
        });
        //  2.清除添加后的列表播放
        $(".dele_but").click(function () {
            $(".add_parent").remove();
            current = 0;
        });
        // 3.播放列表显示与隐藏
        $(".footer_right>ul>li").last().click(function () {
            $(".player_box").slideToggle();
        });
        //   4.播放顺序切换
        $(".footer_right li").eq(0).on("click",function () {
            $(this).toggleClass("musicplayer-M_").toggleClass("musicplayer-14");
        });
    }

//    播放控制
    playControl();
    function playControl() {
        // 1.总列表播放控制切换
        $("#list").delegate(".control_player","click",function () {
            $(this).toggleClass("musicplayer-3").toggleClass("musicplayer-5");
            var $item = $(this).parents(".li_parent");
            cssPlay($(this));
            //播放音乐
            player.playerMusic($item.get(0).index,$item.get(0).music);
            initLrc($item.get(0).music);

        });
        //  2.当前时间和进度条更新
        player.currentTimeDate(function (currentTime,current,duration) {
            $(".current_time").text(currentTime);
            // console.log(currentTime);

            //    进度条更新
            var percent = current / duration;
            var leng = $allLength * percent;
            progress.setProgress(leng,percent);
            //  歌词进度更新
            var index = lrc.lrcProgress(current);
            var $li = $(".right_bottom>ul>li").eq(index);
            $li.addClass("add_green");
            $li.siblings().removeClass("add_green");
            $(".right_bottom>ul").css({
                marginTop : - $(".right_bottom>ul>li").height() * (index - 2),
            });

        });
        // 3.底部播放控制切换
        $(".pla").on("click",function () {
            $(this).toggleClass("musicplayer-7").toggleClass("musicplayer-11");
            //***
            if (player.currentIndex === -1){
                $(".li_parent").eq(0).find(".control_player").trigger("click");
            }else {
                $(".li_parent").eq(player.currentIndex).find(".control_player").trigger("click");
            }
        });
        //4.添加后列表播放触发
        $(".player_box").delegate(".add_player","click",function () {
            var $this = this;
            $(".li_parent").each(function () {
                if ($($this).find(".add_name").html() === $(this).find(".name").html()){
                    $(this).find(".control_player").trigger("click");
                    $($this).addClass("add_player1");
                    $($this).parents(".add_parent").siblings().find(".add_player").removeClass("add_player1");
                }
            });
        });
        //  5.上一首
        $(".pre").on("click",function () {
            $(".add_parent").each(function (index,ele) {
                if ($(this).find(".add_player").hasClass("add_player1")){
                    $(".add_player").eq(pre(index)).trigger("click");
                    $(".add_player").eq(pre(index)).parents(".add_parent").siblings().find(".add_player").removeClass("add_player1");

                    $(".add_player").eq(pre(index)).addClass("add_player1");
                }
            });
        });
        //  6.下一首
        $(".next").on("click",function () {
            $(".add_parent").each(function (index) {
                if ($(this).find(".add_player").hasClass("add_player1")) {
                    $(".add_player").eq(next(index,current)).trigger("click");
                    $(".add_player").eq(next(index,current)).parents(".add_parent").siblings().find(".add_player").removeClass("add_player1");

                    $(".add_player").eq(next(index,current)).addClass("add_player1");
                }
            });
        });

    }
//    6.上一首
    function pre(index) {
        var curren = 0;
        // console.log($leng);
        if (index <= 0){
            curren = - 1;
        }else {
            curren = index - 1;
        }
        return curren;

    }
//    7.下一首
    function next(index,$leng) {
        var curren = 0;
        // console.log(index,$leng);
        if (index < $leng){
            curren = index + 1;
        }else {
            curren = 0;
        }
        return curren;
    }
//    8.播放css样式函数
    function cssPlay(curr) {
        if (curr.hasClass("musicplayer-5")){
            curr.parents(".li_parent").siblings().find(".control_player").addClass("musicplayer-3").removeClass("musicplayer-5");
            $(".music_player li").eq(1).addClass("musicplayer-11").removeClass("musicplayer-7");
            curr.parents(".li_parent").addClass("list_li");
            curr.parents(".li_parent").siblings().removeClass("list_li");
            if(curr.parents(".li_parent").hasClass("like")){
                $(".footer_right li").eq(1).removeClass("musicplayer-uniE901").addClass("musicplayer-4");
            }else {
                $(".footer_right li").eq(1).addClass("musicplayer-uniE901").removeClass("musicplayer-4");
            }
        }else {
            $(".music_player li").eq(1).addClass("musicplayer-7").removeClass("musicplayer-11");
            curr.parents(".li_parent").removeClass("list_li");
        }
    }


});