// 入口函数
$(function () {
    // 一. 页面一加载：请求分类列表渲染到下拉菜单
    $.ajax({
        url: BigNew.category_list,
        success: function (backData) {
            // console.log(backData);
            if (backData.code == 200) {
                // 获取到所有的文章类别信息后, 通过模板引擎渲染到页面上
                var resHtml = template('category_list', backData.data);
                $('#selCategory').html(resHtml);
            }
        }
    });


    // -----------------------------------------------------------------------------------------------------------------

    // 声明一个变量mypage,表示当前点击的分页页签数字
    var mypage = 1;
    // 发送ajax请求封装成一个函数
    function getData(mypage, callback) {
        $.ajax({
            url: BigNew.article_query,
            data: {
                type: $('#selCategory').val().trim(), // 获取文章类别
                state: $('#selStatus').val().trim(), // 获取文章状态(草稿/已发送)
                page: mypage, // 当前的页数
                perpage: 8, // 一页显示多少条
            },
            success: function (backData) {
                // console.log(backData);
                if (backData.code == 200) {
                    // 调用模板引擎核心方法
                    var resHtml = template('article_list', backData);
                    $('tbody').html(resHtml);

                    // 这里会有一些操作
                    // 比如页面一进来这里有分页插件的设置; 点击筛选按钮这里有重新渲染分页插件结构的代码
                    if (backData.data.data.length != 0 && callback != null) {
                        // 有数据了就应该把分页插件结构给显示
                        $('#pagination-demo').show();
                        $('#pagination-demo').next().hide();

                        // 调用回调函数,把返回来的数据backData作为实参传递
                        callback(backData);
                    } else if (backData.data.data.length == 0) {
                        // 分页插件结构给隐藏
                        $('#pagination-demo').hide();
                        $('#pagination-demo').next().show(); // 提示没有数据
                    }
                }
            }
        });
    };

    // 二. 一进到页面就要获取默认条件下的文章们并显示
    getData(1, function (backData) {
        // 分页插件
        $('#pagination-demo').twbsPagination({
            totalPages: backData.data.totalPage, // 总页数
            visiblePages: 7,
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',
            onPageClick: function (event, page) {
                // console.log(event); // 点击分页页签触发的事件对象
                // console.log(page); // 当前点击的页数

                mypage = page; // 把当前点击的这一页码给mypage赋值
                getData(page, null);
            }
        });
    });


    // 三. 筛选功能
    // 3.1 按钮点击事件
    $('#btnSearch').on('click', function (e) {
        // 阻止表单默认行为
        e.preventDefault();
        // 3.2 ajax请求
        getData(1, function (backData) {
            // 调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构
            $('#pagination-demo').twbsPagination('changeTotalPages', backData.data.totalPage, 1);
        });
    });


    //四: 删除文章
    $('body').on('click', '.delete', function () {
        if (confirm('你确定要删除吗?')) {
            var id = $(this).attr('data-id');
            $.ajax({
                type: 'post',
                url: BigNew.article_delete,
                data: {
                    id: id
                },
                success: function (backData) {
                    // console.log(backData);
                    if (backData.code == 204) {
                        // 重新刷新页面
                        // window.location.reload();

                        // 重新发送ajax请求,获取当前页数据
                        getData(mypage, function (backData) {
                            // 删除了部分数据,那总页数就有可能发生改变
                            // 调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构
                            $('#pagination-demo').twbsPagination('changeTotalPages', backData.data.totalPage, mypage);
                        });
                    }
                }
            });
        }
    });



    //-------------------------------------------------------------------------------------------------------------------

    // 二. 一进到页面就要获取默认条件下的文章们并显示
    // $.ajax({
    //     url: BigNew.article_query,
    //     data: {
    //         type: $('#selCategory').val().trim(),
    //         state: $('#selStatus').val().trim(),
    //         page: 1,
    //         perpage: 8,
    //     },
    //     success: function (backData) {
    //         // console.log(backData);
    //         if (backData.code == 200) {
    //             // 调用模板引擎核心方法
    //             var resHtml = template('article_list', backData);
    //             $('tbody').html(resHtml);

    //             // 分页插件
    //             $('#pagination-demo').twbsPagination({
    //                 totalPages: backData.data.totalPage, // 总页数
    //                 visiblePages: 7,
    //                 first: '首页',
    //                 prev: '上一页',
    //                 next: '下一页',
    //                 last: '尾页',
    //                 onPageClick: function (event, page) {
    //                     // console.log(event); // 点击分页页签触发的事件对象
    //                     // console.log(page); // 当前点击的页数

    //                     $.ajax({
    //                         url: BigNew.article_query,
    //                         data: {
    //                             type: $('#selCategory').val().trim(),
    //                             state: $('#selStatus').val().trim(),
    //                             page: page,
    //                             perpage: 8
    //                         },
    //                         success: function (backData) {
    //                             // console.log(backData);
    //                             if (backData.code == 200) {
    //                                 var resHtml = template('article_list', backData);
    //                                 $('tbody').html(resHtml);
    //                             }
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     }
    // });


    // 三. 筛选功能
    // 3.1 按钮点击事件
    // $('#btnSearch').on('click', function (e) {
    //     // 阻止表单默认行为
    //     e.preventDefault();
    //     // 3.2 ajax请求
    //     $.ajax({
    //         url: BigNew.article_query,
    //         data: {
    //             type: $('#selCategory').val().trim(),
    //             state: $('#selStatus').val().trim(),
    //             page: 1,
    //             perpage: 8, // 每页返回8条数据
    //         },
    //         success: function (backData) {
    //             console.log(backData);
    //             if (backData.code == 200) {
    //                 var resHtml = template('article_list', backData);
    //                 $('tbody').html(resHtml);

    //                 // 调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构
    //                 $('#pagination-demo').twbsPagination('changeTotalPages', backData.data.totalPage, 1);
    //             }
    //         }
    //     })
    // })


    // -----------------------------------------------------------------------------------------------------------
})