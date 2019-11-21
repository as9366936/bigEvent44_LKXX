// 入口函数
$(function () {
    // 一. 热点图
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/hotpic',
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                var resHtml = template('hotPic_temp', backData);
                $('ul.focus_list').html(resHtml);
            }
        }
    });

    // 二. 最新资讯
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/latest',
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                var resHtml = template('latest_temp', backData);
                $('div.common_news').html(resHtml);
            }
        }
    });


    // 三. 文章热门排行
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/rank',
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                // 1. 模板方法
                // var resHtml = template('rank_temp', backData);
                // $('ul.hotrank_list').html(resHtml);

                // 2. 不用模板的方法
                // 遍历数组
                // 找到数据要渲染的标签, 分别渲染上
                for (var i = 0; i < backData.data.length; i++) {
                    $('ul.hotrank_list>li').eq(i).children('a').text(backData.data[i].title);
                    $('ul.hotrank_list>li').eq(i).children('a').attr('href', './article.html?id=' + backData.data[i].id);
                }
            }
        }
    });


    // 四. 最新评论
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/latest_comment',
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                var month = new Date().getMonth() + 1; // 当前月份
                backData.month = month; // 添加到backData数据中
                var resHtml = template('latestComment_temp', backData);
                $('ul.comment_list').html(resHtml);
            }
        }
    })

    // 五. 焦点关注
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/attention',
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                var resHtml = template('attention_temp', backData);
                $('ul.guanzhu_list').html(resHtml);
            }
        }
    })

    // 六. 获取所有文章类型
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/category',
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                var resHtml = template('category_temp', backData);
                $('ul.level_two').html(resHtml);
            }
        }
    })
});