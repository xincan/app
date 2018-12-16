layui.config({
    base: '/client/layuiadmin/modules/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    ajaxFileUpload: 'ajaxFileUpload' //如果 mymod.js 是在根目录，也可以不用设定别名
    ,mod1: 'modules' //相对于上述 base 目录的子目录
});

layui.use(['table','form','laytpl','layer', 'ajaxFileUpload'], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,laytpl = layui.laytpl		// 引用layui模板引擎
        ,layer = layui.layer		// 引用layui弹出层
        ,$ = layui.$       			// 引用layui的jquery
        ,ajaxFileUpload = layui.ajaxFileUpload;


    /**
     * 格式化发布类型
     * @param d
     * @returns {string}
     */
    let typeFormat = d => {
        if(d.type == 0) return "<span class='layui-btn layui-btn-xs layui-btn-warm ewip-cursor-default'>渠道</span>";
        if(d.type == 1) return "<span class='layui-btn layui-btn-normal layui-btn-xs ewip-cursor-default'>手段</span>";
    };

    /**
     * 格式化状态类型
     * @param d
     * @returns {string}
     */
    let statusFormat = d => {
        if(d.status == 0) return "<input type='checkbox' name='status' data-id='" + d.id + "' lay-skin='switch' lay-filter='switchStatus' lay-text='启用|禁用'>";
        if(d.status == 1) return "<input type='checkbox' name='status' checked='' data-id='" + d.id + "' lay-skin='switch' lay-filter='switchStatus' lay-text='启用|禁用'>";
    };

    /**
     * 图片格式化
     * @param d
     * @returns {string}
     */
    let iconFormat = d => {
        if(d!="" || d!=null) {
            return "<img src='/client/"+d.icon+"'  style='width:50px;height:50px;' >";
        }else{
            return "暂无图片";
        }

    };

    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/channel/select'
        ,page:true
        ,even: true
        ,height: 'full-165'
        ,limits:[10,20,50,100]
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'name', title: '发布手段名称', sort: true}
            ,{field: 'code', title: '发布手段编码', sort: true}
            ,{field: 'icon', title: '图&nbsp;&nbsp;标', templet: iconFormat }
            ,{field: 'type', title: '类&nbsp;&nbsp;型', sort: true, templet: typeFormat }
            ,{field: 'status', title: '状&nbsp;&nbsp;态', sort: true, templet: statusFormat }
            ,{title: '操&nbsp;&nbsp;作', width: 170, align:'center', toolbar: '#btnGroupOption'}
        ]]
    });

    /**
     * 修改后重新刷新列表，curr: 1重新从第 1 页开始
     */
    let reloadTable = function (param) {
        table.reload('table', {
            page: {
                curr: 1
            },
            where: { //设定异步数据接口的额外参数，任意设
                name: param == undefined ? '' : param.name
                ,type: param == undefined ? '' : param.type
            }
        });
    };

    /**
     * 查询发布手段下拉列表
     * @param callback
     */
    let selectChannel = function(callback){
        $.ajax({
            async:true
            ,type: "POST"
            ,data: {type:0}
            ,url: "/client/channel/list"
            ,dataType: 'json'
            ,success: function(json){
                callback(json.data.length > 0 ? json.data : null);
            }
        });
    };

    /**
     * 自定义验证规则
     */
    form.verify({
        name: function (value) {
            if(value.length == 0)  return '请选输入发布手段名称';
            if(value.length > 10)  return '发布手段长度不能大于10';
        }
        ,code: function (value) {
            if(value=="" || value == null) return '请输入发布手段编码';
        }
        ,type: function (value) {
            if(value=="" || value == null) return '请选择发布手段类型';
        }
        ,icon: function(value){
            if(value.length == 0) return '请上传发布手段logo';
        }
    });

    /**
     * 数据提交到后台（通用发方法）
     * @param option
     */
    let submitFile = function(option){
        ajaxFileUpload.render({
            async: option.async
            ,url : option.url
            ,type: option.type
            ,param : option.param//需要传递的数据 json格式
            ,files : option.files
            ,dataType: 'json'
        },function (json) {
            if(option.index != null) layer.close(option.index);
            if(json.code == 200){
                // 刷新列表
                reloadTable();
            }
            // 弹出提示信息，2s后自动关闭
            layer.msg(json.msg, {time: 2000});
        });
    };

    /**
     * 提交到后台
     * @param option
     */
    let submit = function (option) {
        $.ajax({
            async:true
            ,type: option.type
            ,data: option.param
            ,url: option.url
            ,dataType: 'json'
            ,success: function(json){
                if(option.index != null) layer.close(option.index);
                if(json.code == 200){
                    // 刷新列表
                    reloadTable();
                }
                // 弹出提示信息，2s后自动关闭
                layer.msg(json.msg, {time: 2000});
            }
        });
        
    };

    /**
     * 统一按钮操作对象
     * @type {{addBarBtn: 添加信息, deleteBarBtn: 批量删除信息, deleteOption: 删除单个信息, updateOption: 修改信息}}
     */
    let active = {
        /**
         * 工具条：添加发布手段信息
         */
        'addBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 添加发布手段信息"
                ,area: ['700px','500px']
                ,shade: 0.3
                ,maxmin:true
                ,offset:'50px'
                ,btn: ['添加', '取消']
                ,content:"<div id='addDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(addPop.innerHTML).render([], function(html){
                        // 动态获取弹出层对象并追加html
                        $("#addDiv").empty().append(html);
                    });

                    // 发布下拉绑定
                    selectChannel(function (result) {
                        if(result!=null){
                            for(var i = 0; i<result.length; i++){
                                $("#addDiv .channel").append("<option value='"+result[i].id+"'>"+result[i].name+"</option>");
                            }
                        }
                        form.render('select');
                    });

                    // 点击上传按钮，出发文件按钮
                    $('#addUploadBtn').on('click', function(){
                        $("#addFile").click();
                    });
                    // 选择上传文件
                    $("#addFile").change(function (e) {
                        $("input[name='icon']").val($(this).val());
                    });
                    // 渲染表单
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitAddBtn)", function(data){
                        var icon = data.field.icon;
                        var iconIndex = icon.lastIndexOf("\\")+1;
                        data.field.icon = icon.substring(iconIndex, icon.length);
                        // 数据提交到后台，通用方法
                        submitFile({
                            index: index
                            ,async: 'true'
                            ,url: '/client/channel/insert'
                            ,type: 'POST'
                            ,param: data.field
                            ,files: ['addFile']
                            ,dataType: 'json'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitAddBtn").click();
                }
            });
        }
        /**
         * 工具条：批量删除信息
         * @returns {boolean}
         */
        ,'deleteBarBtn': function(){
            var checkStatus = table.checkStatus('table')
                ,data = checkStatus.data;
            if(data.length == 0){
                layer.msg('请选中发布手段进行删除', {time: 2000});
                return false;
            }

            var id = '', file='', count = 0;
            for(var i = 0, len = data.length; i<len; i++){
                id += ",'" + data[i].id + "'";
                var icon =data[i].icon;
                var iconIndex = (icon.lastIndexOf("\\")+1)||(icon.lastIndexOf("/")+1);
                file += "," + icon.substring(iconIndex, icon.length);
                count += data[i].child;
            }

            if(count > 0){
                layer.msg('选中数据存在子节点，请先删除子节点', {time: 2000});
                return false;
            }

            layer.confirm('确定删除这批发布手段？', function(index){
                // 数据提交到后台，通用方法
                submit({
                    index: index
                    ,type: 'POST'
                    ,param: {id: id.substring(1), fileName: file.substring(1)}
                    ,url: '/client/channel/delete'
                });
            });
        }
        /**
         * 列表中：删除选中的发布手段信息
         * @param obj
         */
        ,'deleteOption': function (obj) {
            layer.confirm('确定删除该发布手段？', function(index){
                obj.del();
                // 数据提交到后台，通用方法
                submit({
                    index: index
                    ,param: {fileName: obj.data.icon}
                    ,type: 'POST'
                    ,url: '/client/channel/delete/' + obj.data.id,
                });
            });
        }
        /**
         * 列表中：修改发布手段信息
         * @param obj
         */
        ,'updateOption': function (obj) {
            var param = obj.data;

            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改发布手段信息"
                ,area: ['700px','500px']
                ,shade: 0.3
                ,maxmin:true
                ,offset: '50px'
                ,btn: ['修改', '取消']
                ,content:"<div id='updateDiv' style='padding:20px 20px 0 20px'>adsfds</div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(updatePop.innerHTML).render(param, function(html){
                        // 发布下拉绑定
                        selectChannel(function (result) {
                            if(result!=null){
                                for(var i = 0; i<result.length; i++){
                                    $("#updateDiv .channel").append("<option value='"+result[i].id+"'>"+result[i].name+"</option>");
                                }
                            }
                            // 地区级别下拉框赋值
                            $("#updateDiv .channel").val(param.pId);
                            form.render('select');
                        });
                        // 动态获取弹出层对象
                        $("#updateDiv").empty().append(html);
                        // 地区级别下拉框赋值
                        $("#updateDiv select[name='type']").val(param.type);
                    });

                    // 点击上传按钮，出发文件按钮
                    $('#updateUploadBtn').on('click', function(){
                        $("#updateFile").click();
                    });
                    // 选择上传文件
                    $("#updateFile").change(function (e) {
                        $("input[name='icon']").val($(this).val());
                    });
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitUpdateBtn)", function(data){
                        data.field.id = param.id;
                        var icon = data.field.icon;
                        var iconIndex = (icon.lastIndexOf("\\")+1)||(icon.lastIndexOf("/")+1);
                        data.field.icon = icon.substring(iconIndex, icon.length);
                        // 数据提交到后台，通用方法
                        submitFile({
                            index: index
                            ,async: 'true'
                            ,url: '/client/channel/update'
                            ,type: 'POST'
                            ,param: data.field
                            ,files: ['updateFile']
                            ,dataType: 'json'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitUpdateBtn").click();
                }
            });
        }
    };

    //监听指定开关
    form.on('switch(switchStatus)', function(data){
        let param = {
            status:Number(this.checked ? true : false)
            ,id:$(data.elem).data("id")
        };

        $.ajax({
            async:true
            ,type: "POST"
            ,data: param
            ,url: "/client/channel/update/status"
            ,dataType: 'json'
            ,success: function(json){
                if(json.code == 200){
                    layer.msg(json.msg, {time:2000});
                }
            }
        });

    });

    /**
     * 监听头部搜索
     */
    form.on('submit(search)', function(data){
        reloadTable(data.field);
    });

    /**
     * 监听列表中按钮事件
     */
    table.on('tool(table)', function(obj){
        active[obj.event] ? active[obj.event].call(this, obj) : '';
    });

    /**
     * 监控表头工具条按钮事件
     */
    $('.tableBar .layui-btn').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});