
layui.config({
    base: '/client/layuiadmin/modules/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    selectTree: 'selectTree' //如果 mymod.js 是在根目录，也可以不用设定别名
    ,zTree: 'zTree'
    ,mod1: 'modules' //相对于上述 base 目录的子目录
});

layui.use(["table","form","laytpl","layer","selectTree","zTree"], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,laytpl = layui.laytpl		// 引用layui模板引擎
        ,layer = layui.layer		// 引用layui弹出层
        ,zTree = layui.zTree
        ,selectTree = layui.selectTree
        ,$ = layui.$;   			// 引用layui的jquery


    /**
     * 是否启用
     * @param d
     * @returns {string}
     */

    let statusFormat = function(d){
        if(d.status == 0) return "<span class='layui-btn layui-btn-warm layui-btn-xs ewip-cursor-default'>禁用</span>";
        if(d.status == 1) return "<span class='layui-btn layui-btn-xs ewip-cursor-default'>启用</span>";
    };

    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/role/select'
        ,page:true
        ,even: true
        ,height: 'full-165'
        ,limits:[10,20,50,100]
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'role', title: '角色名称', sort: true}
            ,{field: 'description', title: '角色说明', sort: true}
            // ,{field: 'status', title: '是否启用', sort: true, templet:statusFormat}
            ,{field: 'createTime', title: '创建时间',sort: true}
            ,{title: '操&nbsp;&nbsp;作', align:'center', toolbar: '#btnGroupOption'}
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
        role: function (value) {
            if(value.length == 0) return '请输入角色名称';
            if(value.length > 10) return '角色名称不能超过10个字';
        }
        ,description: function(value){
            if(value.length > 20) return '角色说明不能超过90个字';
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
         * 初始化菜单
         */
        selectMenuTree: null
        /**
         * 根据角色id，查询拥有的角色
         */
        ,"selectRoleInMenu": (roleId, callback) =>{
            $.ajax({
                async:false
                ,type: "GET"
                ,data: {roleId, roleId}
                ,url: "/client/role/select/menu"
                ,dataType: 'json'
                ,success: function(json){
                    if(json.code == 200 && json.data != null){
                        callback(json.data);
                    }
                }
            });
        }
        /**
         * 初始化查询条件角色下拉列表
         */
        ,"initRole": ()=>{
            $.ajax({
                async:false
                ,type: "GET"
                ,data: {}
                ,url: "/client/role/select/all"
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
         * 根据角色id，查询拥有的角色
         */
        ,"selectRoleInPermision": (roleId, callback) =>{
            $.ajax({
                async:false
                ,type: "GET"
                ,data: {roleId, roleId}
                ,url: "/client/role/select/permission"
                ,dataType: 'json'
                ,success: function(json){
                    if(json.code == 200 && json.data != null){
                        callback(json.data);
                    }
                }
            });
        }
        /**
         * 初始化查询条件角色下拉列表
         */
        ,"selectPermision": (callback)=>{
            $.ajax({
                async:false
                ,type: "GET"
                ,data: {}
                ,url: "/client/permission/select/all"
                ,dataType: 'json'
                ,success: function(json){
                    if(json.code == 200 && json.data != null){
                            callback(json.data);
                    }
                }
            });
        }
        /**
         * 工具条：添加角色信息
         */
        ,'addBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 添加角色信息"
                ,area: '600px'
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
                        submitServer({
                            index: index
                            ,type: 'POST'
                            ,param: data.field
                            ,url: '/client/role/insert'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitAddBtn").click();
                }
            });
        }
        /**
         * 工具条：批量删除员工信息
         * @returns {boolean}
         */
        ,'deleteBarBtn': function(){
            var checkStatus = table.checkStatus('table')
                ,data = checkStatus.data;
            if(data.length == 0){
                layer.msg('请选中角色进行删除', {time: 2000});
                return false;
            }

            var id = '',count = 0;
            for(var i = 0, len = data.length; i<len; i++){
                id += "," + data[i].id;
                count += data[i].child;
            }

            if(count > 0){
                layer.msg('选中数据存在子节点，请先删除子节点', {time: 2000});
                return false;
            }

            layer.confirm('确定删除这批角色？', function(index){
                // 数据提交到后台，通用方法
                submitServer({
                    index: index
                    ,type: 'POST'
                    ,param: {id: id.substring(1)}
                    ,url: '/client/role/delete'
                });
            });
        }
        /**
         * 列表中：删除选中的角色信息
         * @param obj
         */
        ,'deleteOption': function (obj) {
            layer.confirm('确定删除该角色？', function(index){
                obj.del();
                // 数据提交到后台，通用方法
                submitServer({
                    index: index
                    ,param: null
                    ,type: 'DELETE'
                    ,url: '/client/role/delete/' + obj.data.id,
                });
            });
        }
        /**
         * 列表中：修改角色信息
         * @param obj
         */
        ,'updateOption': function (obj) {
            let param = obj.data;
            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改角色信息"
                ,area: '500px'
                ,shade: 0.3
                ,maxmin:true
                ,offset: '200px'
                ,btn: ['修改', '取消']
                ,content:"<div id='updateDiv' style='padding:20px 20px 0 20px'>adsfds</div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(updatePop.innerHTML).render(param, function(html){
                        // 动态获取弹出层对象
                        $("#updateDiv").empty().append(html);
                        // 角色级别下拉框赋值
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
                            ,url: '/client/role/update'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitUpdateBtn").click();
                }
            });
        }
        /**
         * 分配菜单
         */
        ,"menuOption": obj => {
            let param = obj.data;
            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 角色分配菜单"
                ,area: ['500px','550px']
                ,shade: 0.3
                ,maxmin:true
                ,offset: '200px'
                ,btn: ['分配', '取消']
                ,content:"<div id='menuDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(menuPop.innerHTML).render(param, function(html){
                        // 动态获取弹出层对象
                        $("#menuDiv").empty().append(html);
                        /**
                         * 初始化加载地区树
                         */
                        active.selectMenuTree =  zTree.async({
                            id: "#menu",
                            setting: {
                                async:{
                                    enable:true,
                                    url: "/client/tree/menu",
                                    autoParam:["id"],
                                    dataType:"json",
                                    dataFilter:function (treeId, parentNode, responseData) {
                                        if(responseData!=null){
                                            for(var i = 0; i<responseData.length; i++){
                                                if(responseData[i].id=='navigation')
                                                    responseData[i].nocheck = true;
                                                responseData[i].open = true;
                                            }

                                            // 根据选中的角色ID，查询该角色对应的菜单
                                            active.selectRoleInMenu(param.id, (res)=>{
                                                res.forEach((menu)=>{
                                                    for(var i = 0; i<responseData.length; i++){
                                                        if(responseData[i].id == menu.id){
                                                            responseData[i].checked = true;
                                                        }
                                                        if(menu.child.length>0){
                                                            menu.child.forEach(child => {
                                                                if(responseData[i].id == child.id){
                                                                    responseData[i].checked = true;
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                        return responseData;
                                    }
                                },
                                check: {
                                    enable: true,
                                    chkboxType: {"Y":"ps", "N": "s"},
                                    chkStyle:"checkbox"
                                },
                                data: {
                                    simpleData: {
                                        enable: true
                                    }
                                },
                                callback:{
                                    onClick:null,
                                    onCheck:null
                                }
                            }
                        });
                    });

                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitMenuBtn)", function(data){
                        data.field.roleId = param.id;
                        var menuId = "";
                        active.selectMenuTree.getCheckedNodes(true).forEach((node)=>{
                            menuId += "," + node.id;
                        });
                        data.field.menuId = menuId.substring(1);
                        // 数据提交到后台，通用方法
                        submitServer({
                            index: index
                            ,type: 'POST'
                            ,param: data.field
                            ,url: '/client/role/menu'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitMenuBtn").click();
                }
            });
        }
        /**
         * 分配权限
         */
        ,"permissionOption": obj => {
            let param = obj.data;
            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 角色分配权限"
                ,area: '500px'
                ,shade: 0.3
                ,maxmin:true
                ,offset: '200px'
                ,btn: ['分配', '取消']
                ,content:"<div id='permissionDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(permissionPop.innerHTML).render(param, function(html){
                        // 动态获取弹出层对象
                        $("#permissionDiv").empty().append(html);
                        // 查询系统中所有角色
                        active.selectPermision((res)=>{
                            res.forEach((permission)=>{
                                $("#permissionDiv .permission").append("<input type='checkbox' name='permissionId' value='" + permission.id + "' title='" + permission.name + "' lay-skin='primary' />");
                            });
                        });
                        // 查询该角色拥有的权限
                        active.selectRoleInPermision(param.id, (res)=>{
                            res.forEach((permission)=>{
                                $("#permissionDiv .permission input[type='checkbox'][value='" + permission.id + "']").attr("checked","checked");
                            });
                        });


                    });
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitPermissionBtn)", function(data){
                        data.field.roleId = param.id;
                        var permissionId = "";
                        $("#permissionDiv .permission input[type='checkbox'][name='permissionId']:checked").each(function(){
                            permissionId += "," + $(this).val();
                        });
                        data.field.permissionId = permissionId.substring(1);

                        if(permissionId == ""){
                            layer.msg('请勾选权限', {
                                time: 1000, //1s后自动关闭
                            });
                            return false;
                        }

                        console.log(data.field);
                        // 数据提交到后台，通用方法
                        submitServer({
                            index: index
                            ,type: 'POST'
                            ,param: data.field
                            ,url: '/client/role/permission'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitPermissionBtn").click();
                }
            });
        }
    };

    /**
     * 添加时，如果选择的是省级，则隐藏上级角色
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

    // 初始化查询条件角色下拉列表
    active.initRole();

});