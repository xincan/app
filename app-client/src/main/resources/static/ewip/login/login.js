"use strict"

layui.use(['form'], function(){
    var form = layui.form
        ,$ = layui.$
        ,layer = layui.layer;

    //自定义验证规则
    form.verify({
        username: function(value){
            if(value.length == 0){
                return '登录名称不能为空';
            }
        }
        ,password: [/(.+){6,12}$/, '密码必须是6到12位']

    });

    /**
     * 如果会话超时，不论停留在那个界面，都跳转到登录页
     */
    $(document).ready(function () {
        if (window != top) {
            top.location.href = "index";
        }
    });
});