
layui.config({
    base: '/client/layuiadmin/modules/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    selectTree: 'selectTree' //如果 mymod.js 是在根目录，也可以不用设定别名
    ,mod1: 'modules' //相对于上述 base 目录的子目录
});

layui.use(["table","form","laytpl","layer","selectTree"], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,laytpl = layui.laytpl		// 引用layui模板引擎
        ,layer = layui.layer		// 引用layui弹出层
        ,selectTree = layui.selectTree
        ,$ = layui.$;   			// 引用layui的jquery


    /**
     * 是否启用
     * @param d
     * @returns {string}
     */
    let statusFormat = d =>{
        if(d.status == 0) return "<span class='layui-btn layui-btn-warm layui-btn-xs ewip-cursor-default'>禁用</span>";
        if(d.status == 1) return "<span class='layui-btn layui-btn-xs ewip-cursor-default'>启用</span>";
    };

    /**
     * 权限类别
     * @param d
     * @returns {string}
     */
    let typeFormat = d => {
        if(d.type == 'button') return "按钮";
        if(d.type == 'menu') return "菜单";
    };

    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/permission/select'
        ,page:true
        ,even: true
        ,height: 'full-165'
        ,limits:[20,50,100]
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'name', title: '权限名称', sort: true}
            ,{field: 'permission', title: '权限编码', sort: true}
            ,{field: 'type', title: '权限类型', sort: true, templet:typeFormat}
            ,{field: 'status', title: '是否启用', sort: true, templet:statusFormat}
            ,{field: 'createTime', title: '创建时间',sort: true}
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
                id: param == undefined ? '' : param.id
                ,status: param == undefined ? '' : param.status
            }
        });
    };

    /**
     * 自定义验证规则
     */
    form.verify({
        name: function (value) {
            if(value.length == 0) return '请输入权限名称';
            if(value.length > 10) return '权限名称不能超过10个字';
        }
        ,permission: function(value){
            if(value.length==0) return '请选择操作权限';
        }
    });


    /**
     * 数据提交到后台（通用发方法）
     * @param option
     */
    let submitServer = function(option){
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
     * @type {{addBtn: 添加信息, deleteBtn: 批量删除信息, deleteOption: 删除单个信息, updateOption: 修改信息}}
     */
    let active = {
        /**
         * 初始化查询条件角色下拉列表
         */
        "initRole": ()=>{
            $.ajax({
                async:false
                ,type: "GET"
                ,data: {}
                ,url: "/client/permission/select/all"
                ,dataType: 'json'
                ,success: function(json){
                    if(json.code == 200 && json.data != null){
                        json.data.forEach((res)=>{
                            $("form select[name='id']").append("<option value='" + res.id + "'>" + res.role + "</option>");
                        });
                        form.render();
                    }
                }
            });
        }
        /**
         * 工具条：添加权限信息
         */
        ,'addBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 添加权限信息"
                ,area: ['600px','500px']
                ,shade: 0.3
                ,maxmin:true
                ,offset:'100px'
                ,btn: ['添加', '取消']
                ,content:"<div id='addDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(addPop.innerHTML).render([], function(html){
                        // 动态获取弹出层对象并追加html
                        $("#addDiv").empty().append(html);
                    });
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitAddBtn)", function(data){
                        data.field.type="button";
                        data.field.name = $("#addDiv select[name='permission']").find("option:selected").text();
                        submitServer({
                            index: index
                            ,type: 'POST'
                            ,param: data.field
                            ,url: '/client/permission/insert'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitAddBtn").click();
                }
            });
        }
        /**
         * 工具条：批量删除权限信息
         * @returns {boolean}
         */
        ,'deleteBarBtn': function(){
            var checkStatus = table.checkStatus('table')
                ,data = checkStatus.data;
            if(data.length == 0){
                layer.msg('请选中权限进行删除', {time: 2000});
                return false;
            }

            var id = '',count = 0;
            for(var i = 0, len = data.length; i<len; i++){
                id += ",'" + data[i].id + "'";
                count += data[i].child;
            }

            if(count > 0){
                layer.msg('选中数据存在子节点，请先删除子节点', {time: 2000});
                return false;
            }

            layer.confirm('确定删除这批权限？', function(index){
                var id = '';
                for(var i = 0, len = data.length; i<len; i++){
                    id += ",'" + data[i].id + "'";
                }
                // 数据提交到后台，通用方法
                submitServer({
                    index: index
                    ,type: 'POST'
                    ,param: {id: id.substring(1)}
                    ,url: '/client/permission/delete'
                });
            });
        }
        /**
         * 列表中：删除选中的权限信息
         * @param obj
         */
        ,'deleteOption': function (obj) {
            layer.confirm('确定删除该权限？', function(index){
                obj.del();
                // 数据提交到后台，通用方法
                submitServer({
                    index: index
                    ,param: null
                    ,type: 'DELETE'
                    ,url: '/client/permission/delete/' + obj.data.id,
                });
            });
        }
        /**
         * 列表中：修改权限信息
         * @param obj
         */
        ,'updateOption': function (obj) {
            let param = obj.data;
            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改权限信息"
                ,area: ['600px','500px']
                ,shade: 0.3
                ,maxmin:true
                ,offset: '200px'
                ,btn: ['修改', '取消']
                ,content:"<div id='updateDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(updatePop.innerHTML).render(param, function(html){
                        // 动态获取弹出层对象
                        $("#updateDiv").empty().append(html);
                        $("#updateDiv select[name='type']").val(param.type);
                        $("#updateDiv select[name='permission']").val(param.permission);
                        // 权限级别下拉框赋值
                        $("#updateDiv input[type='radio'][name='status'][value='"+param.status+"']").attr("checked",true);
                    });
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitUpdateBtn)", function(data){
                        data.field.id = param.id;
                        // 数据提交到后台，通用方法
                        submitServer({
                            index: index
                            ,type: 'POST'
                            ,param: data.field
                            ,url: '/client/permission/update'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitUpdateBtn").click();
                }
            });
        }
    };

    /**
     * 添加时，如果选择的是省级，则隐藏上级权限
     */
    form.on('select(level)', function(data){
        if(data.value == 1){
            $(".pId").addClass("layui-hide");
        }else{
            $(".pId").removeClass("layui-hide");
        }
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

    // 初始化查询条件权限下拉列表
    active.initRole();

});