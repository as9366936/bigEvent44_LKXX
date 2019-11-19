// 入口函数
$(function () {
    // 一: 登录需求
    // 1. 给登录按钮设置一个点击事件
    $('.input_sub').on('click', function (e) {
        e.preventDefault();
        // 2. 获取用户输入的用户名和密码
        var username = $('.input_txt').val().trim();
        var password = $('.input_pass').val().trim();
        // 3. 判断非空
        if (username == "" || password == "") {
            // alert('用户名和密码不能为空!');
            $('#myModal .modal-body').text('账号密码不能为空!');
            $('#myModal').modal();
            return;
        }
        // 4. 发送ajax请求,完成登录
        $.ajax({
            type: 'post',
            // url: 'http://localhost:8080/api/v1/admin/user/login',
            url: window.BigNew.user_login,
            data: {
                username: username,
                password: password
            },
            success: function (backData) {
                console.log(backData);
                $('#myModal .modal-body').text(backData.msg);
                $('#myModal').modal();
                if (backData.code == 200) {
                    // 账号密码正确, 会返回一个token,把他存在本地
                    window.localStorage.setItem('token', backData.token);

                    // 此事件在模态框被隐藏(并且同时在 css 过渡效果完成) 之后被触发
                    $('#myModal').on('hidden.bs.modal', function (e) {
                        window.location.href = 'index.html';
                    });
                }
            }
        });
    });
});