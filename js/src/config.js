/**
 * Created with JetBrains WebStorm.
 * User: ty
 * Date: 13-8-22
 * Time: 下午4:59
 * config file,contains some static data,these data ara not change by procedure code but artificial change
 * */
var ZY=ZY||{};

ZY.config={
    ajaxurl:"http://lotusprize.com/travel/wp-admin/admin-ajax.php",
    siteurl:"http://lotusprize.com/travel",
    categoryIds:{
        tdId:1,  //每个分类的id
        peopleId:2,
        landscapeId:3,
        communityId:4,
        artifactId:5
    },
    articleWidths:{
        peopleWidth:240, //每个分类的li的宽度
        landscapeWidth:320,
        communityWidth:240,
        artifactWidth:200
    },
    errorCode:{
        connectionError:"无法连接到服务器。", //错误提示信息
        musicError:"无法从服务器获取音乐。",
        postsError:"无法从服务器获取文章摘要。",
        articleError:"无法从服务器获取文章详情。"
    },
	deviceCode:{
		iOS : navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false
	},
    defaultWrapZindex:9996 //遮挡层的默认z-index
};
Object.freeze(ZY.config);
