// 入口函数
$(function () {
    // 一: 编辑页准备工作
    // 1. 图片预览
    $('#inputCover').on('change', function () {
        var fileIcon = this.files[0];
        var url = URL.createObjectURL(fileIcon);
        $(this).prev().attr('src', url);
    });

    // 2. 获取所有的文章类别
    $.ajax({
        url: BigNew.category_list,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                // 获取到所有的文章类别信息后, 通过模板引擎渲染到页面上
                var resHtml = template('art_cate_temp', backData);
                $('select.category').html(resHtml);
            }
        }
    });

    // 3. 编辑页使用日期插件 jeDate
    jeDate("#testico", {
        // 初始化当前时间
        isinitVal: true,
        zIndex: 20999,
        theme: { bgcolor: "#00A1CB", color: "#ffffff", pnColor: "#00CCFF" },
        format: "YYYY-MM-DD",
        isTime: false,
        minDate: "2014-09-19 00:00:00",
    })

    // 4. 编辑页使用富文本编辑器 wangEditor
    var E = window.wangEditor
    var editor = new E('#editor')
    // 或者 var editor = new E( document.getElementById('editor') )
    editor.create();

    // ----------------------------------------------------------------------------
    // 给发布按钮设置点击事件
    $('.btn-release').on('click', function (e) {
        e.preventDefault();
        // 创建fd对象
        var fd = new FormData($('#form')[0]);
        fd.append('state', '已发布');
        fd.append('content', editor.txt.html());

        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: BigNew.article_publish,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    alert('发布成功');
                    window.history.back(); // 回退回去
                }
            }
        });
    })


    // 存为草稿
    $('.btn-draft').on('click', function (e) {
        e.preventDefault();
        // 创建fd对象
        var fd = new FormData($('#form')[0]);
        // 检查下form表单中要获取值得标签有么有name属性, 并且name属性的值是不是和接口参数一致
        // 追加富文本编辑器 里面 修改后的文章内容 到fd对象中
        fd.append('content', editor.txt.html());
        // state参数不写,默认为空,那就是存草稿

        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: BigNew.article_publish,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    alert('成功存为草稿');
                    window.history.back(); // 回退回去
                }
            }
        });
    })
});