/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    //更新视图
    ZY.uiManager.updateView();

    //音乐获取
    ZY.dataManager.getMusic();

    //音乐时间轴
    ZY.music.musicTimeLine();

    //音乐播放结束
    ZY.music.musicEndHandler();

    //音乐：上一首
    $("#zy_music_prev").click(function(){
        ZY.music.musicPrev();
    });

    //音乐：下一首
    $("#zy_music_next").click(function(){
        ZY.music.musicNext();
    });

    //音乐：暂停/播放
    $("#zy_music_control").click(function(){
        ZY.music.musicControlHandler();
    });

    //切换音乐播放器
    $("#zy_music_show").click(function(){
        ZY.uiManager.toggleMiniMusicPlayer();
        $("#zy_music_section").blur();
    });

    //菜单点击事件
    $("#zy_nav a").click(function(){
        var target=$(this).attr("href");
        ZY.uiManager.scrollToTarget($(target));
        return false;
    });

    //logo点击事件
    $("#zy_logo a").click(function(){
        ZY.uiManager.scrollToTarget($("#zy_top_post"));
        return false;
    });

    //获取封面故事和推荐文章
    ZY.dataManager.getTopPosts();


    //点击头条文章
    $(document).on("click","#zy_featured_articles li",function(evt){
        var postID=$(evt.currentTarget).data("zy-post-id")
        if(postID!=null && postID!=undefined){
            ZY.dataManager.currentPostId=postID;
            ZY.uiManager.showArticle(ZY.dataManager.currentPostId);
        }
    });


    //显示单篇文章时的横向滚动
    ZY.controllerManager.bindHScroll($("#zy_article_content")[0]);

    //收回单篇文章展示
    $("#zy_article_content_close").click(function(){
        ZY.uiManager.hideArticle();
    });

    //显示视频或者大图
    $(document).on("click","#zy_article_content a",function(){
        var url="";
        var elementA=$(this);
        if(elementA.hasClass("videoslide")){
            url=ZY.config.siteurl+"/show_media/"+ZY.dataManager.currentPostId+"/"+elementA.find("img").data("zy-media-id");
            ZY.uiManager.showVideoDetail(url);
            return false;
        }else if(elementA.find("img")){
            url=elementA.attr("href");
            ZY.uiManager.showImageDetail(url);
            return false;
        }else{
            window.open(elementA.attr("href"))
        }
    });

    //关闭显示视频或者大图
    $("#zy_show_close").click(function(){
        ZY.uiManager.hideDetail();
    });

    //提示窗口关闭按钮
    $("#zy_popout_close").click(function(){
        ZY.uiManager.hidePopOut();
    });


    //window 放大缩小事件
    $(window).resize(function(){
        ZY.controllerManager.windowResizeHandler();
    });

    //window滚动事件
    $(window).scroll(function(){
        ZY.controllerManager.scrollingHandler();
    });

    //有可能刷新就已经滚动到了一定位置，需要触发一下，加载相应的数据
    $(window).trigger("scroll");


    //拖拽控制

    //整个页面滚动
    /*Draggable.create("#zy_main_wrapper",{
     type:"scrollTop",
     edgeResistance:0.5,
     throwProps:true,
     maxDuration:1,
     dragClickables:true,
     onDrag:function(){
     ZY.controllerManager.scrollingHandler()
     },
     onThrowUpdate :function(){
     ZY.controllerManager.scrollingHandler()
     }
     });*/

    //栏目列表横向滚动
    Draggable.create(".zy_list_container",{
        type:"scrollLeft",
        edgeResistance:0.5,
        throwProps:true,
        lockAxis:true,
        maxDuration:0.8,
        onClick:function(evt){
            var clickTarget = evt.target || evt.srcElement;
            clickTarget = $(clickTarget).is("*[data-zy-post-id]") ? $(clickTarget):$(clickTarget).parents("*[data-zy-post-id]");
            if(clickTarget.length>0){
                ZY.dataManager.currentPostId=$(clickTarget).data("zy-post-id");
                ZY.uiManager.showArticle(ZY.dataManager.currentPostId);
            }
        },
        onDragStart:function(evt){

            //显示左右拖动提示
            var clickTarget=evt.target || evt.srcElement;
            clickTarget=$(clickTarget).parents(".zy_list_container");
            var containerID=clickTarget.attr("id");
            switch (containerID) {
                case"zy_landscape_list_container":
                    ZY.uiManager.showMovingTips("#zy_landscape_contain");
                    break;
                case"zy_people_list_container":
                    ZY.uiManager.showMovingTips("#zy_people_contain");
                    break;
                case"zy_artifact_list_container":
                    ZY.uiManager.showMovingTips("#zy_artifact_contain");
                    break;
                case"zy_community_list_container":
                    ZY.uiManager.showMovingTips("#zy_community_contain");
                    break;
            }
        },
        onDrag:function(){
            console.log(dragLock)
            if(dragLock=="NONE"){
                if(deltaPointer.y-deltaPointer.x>2){
                    //痛苦
                    dragLock="SCROLL";
                    lockedDraggable=this;
                    this.disable()
                }else if(deltaPointer.x-deltaPointer.y>2){
                    dragLock="PAN"
                }

            }



        },
        onDragEnd:function (evt) {
            console.log("DragEnd")

            //获取更多列表数据
            var clickTarget=evt.target || evt.srcElement;
            clickTarget=$(clickTarget).parents(".zy_list_container");
            var containerID=clickTarget.attr("id");
            switch (containerID) {
                case"zy_landscape_list_container":
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_landscape_contain"),
                        width:ZY.config.articleWidths.landscapeWidth,
                        categoryId:ZY.config.categoryIds.landscapeId,
                        lastDate:ZY.dataManager.lastLandscapeDate,
                        isFirst:false
                    });
                    ZY.uiManager.hideMovingTips("#zy_landscape_contain");
                    break;
                case"zy_people_list_container":
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_people_contain"),
                        width:ZY.config.articleWidths.peopleWidth,
                        categoryId:ZY.config.categoryIds.peopleId,
                        lastDate:ZY.dataManager.lastPeopleDate,
                        isFirst:false
                    });
                    ZY.uiManager.hideMovingTips("#zy_people_contain");
                    break;
                case"zy_artifact_list_container":
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_artifact_contain"),
                        width:ZY.config.articleWidths.artifactWidth,
                        categoryId:ZY.config.categoryIds.artifactId,
                        lastDate:ZY.dataManager.lastArtifactDate,
                        isFirst:false
                    });
                    ZY.uiManager.hideMovingTips("#zy_artifact_contain");
                    break;
                case"zy_community_list_container":
                    ZY.dataManager.getCategoryPosts({
                        targetContain:$("#zy_community_contain"),
                        width:ZY.config.articleWidths.communityWidth,
                        categoryId:ZY.config.categoryIds.communityId,
                        lastDate:ZY.dataManager.lastCommunityDate,
                        isFirst:false
                    });
                    ZY.uiManager.hideMovingTips("#zy_community_contain");
                    break;
            }
        }
    });

    //内容详情滚动
    Draggable.create(".zy_article_content_wrapper",{
        type:"scrollLeft",
        edgeResistance:0.5,
        throwProps:true,
        dragClickables:true,
        lockAxis:true,
        maxDuration:0.8,
        onClick:function(evt){
            var clickTarget = evt.target || evt.srcElement;
            var url;

            clickTarget = $(clickTarget).is("a.videoslide") ? $(clickTarget):$(clickTarget).parents("a.videoslide");
            if(clickTarget.length>0){
                url=ZY.config.siteurl+"/show_media/"+ZY.dataManager.currentPostId+"/"+$(clickTarget).find("img").data("zy-media-id");
                ZY.uiManager.showVideoDetail(url);
            }
        }
    });


    //lockedDraggable存储被锁定的Draggable实例。用户不能同时水平和垂直滑动页面，所以scroll激活时，要临时锁定Draggable，等滑动结束后再解锁。
    var lockedDraggable=null;
    var startPointer={x:0,y:0};
    var deltaPointer={x:0,y:0};
    var dragLock="NONE";

    //webkit触屏事件优化
    document.addEventListener("touchstart",function(evt){
        startPointer.x=evt.touches[0].clientX;
        startPointer.y=evt.touches[0].clientY;

    },false);
    document.addEventListener("touchmove",function(evt){
        deltaPointer.x=Math.abs(evt.touches[0].clientX-startPointer.x);
        deltaPointer.y=Math.abs(evt.touches[0].clientY-startPointer.y);
        startPointer.x=evt.touches[0].clientX;
        startPointer.y=evt.touches[0].clientY;
        //console.log(deltaPointer)
    },false);
    document.addEventListener("touchend",function(){
        dragLock="NONE"
    },false);

    //IE触屏事件优化
    document.addEventListener("pointerdown",function(){
        console.log("pointerdown")
    },false);
    document.addEventListener("pointermove",function(){
        console.log("pointermove")
    },false);
    document.addEventListener("pointermoup",function(){
        console.log("pointerup")
        ZY.uiManager.updateView();
    },false);
    document.addEventListener("selectstart", function(evt) {
        evt.preventDefault();
    }, false);
    document.addEventListener("contextmenu", function(evt) {
        //evt.preventDefault();
    }, false);
    document.addEventListener("MSHoldVisual", function(evt) {
        evt.preventDefault();
    }, false);





});