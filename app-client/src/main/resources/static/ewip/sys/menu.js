
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
     * 格式化级别
     * @param d
     * @returns {string}
     */
    let levelFormat = function(d){
        if(d.level == 1) return "<span class='layui-btn layui-btn-warm layui-btn-xs ewip-cursor-default'>一级菜单</span>";
        if(d.level == 2) return "<span class='layui-btn layui-btn-normal layui-btn-xs ewip-cursor-default'>二级菜单</span>";
        if(d.level == 3) return "<span class='layui-btn layui-btn-xs ewip-cursor-default'>三级菜单</span>";
    };

    /**
     * 格式化级别
     * @param d
     * @returns {string}
     */
    let parentFormat = function(d){
        if(d.parentName.length==0) return "导航管理";
        return d.parentName;
    };

    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/menu/select'
        ,page:true
        ,even: true
        ,height: 'full-165'
        ,limit: 15
        ,limits:[15,30,50,100]
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'name', title: '菜单名称', sort: true}
            ,{field: 'code', title: '菜单编码', sort: true}
            ,{field: 'url', title: '访问路径'}
            ,{field: 'level', title: '菜单级别', sort: true, templet:levelFormat}
            ,{field: 'parentName', title: '上级菜单', sort: true, templet: parentFormat}
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
                areaName: param == undefined ? '' : param.areaName
                ,code: param == undefined ? '' : param.code
                ,level: param == undefined ? '' : param.level
            }
        });
    };

    /**
     * 自定义验证规则
     */
    form.verify({
        level: function (value) {
            if(value.length == 0) return '请选择菜单级别';
        }
        ,pId: function (value) {
           if($(".pId").hasClass("layui-hide") == false){
               if(value.length == 0) {
                   $("#addPId .addPIdShow, #updatePId .updatePIdShow").css("border-color","red");
                   return '请选择上级菜单';
               }
           }
        }
        ,name: function(value){
            if(value.length == 0) return '请输入菜单名称';
            if(value.length > 20) return '菜单名称长度不能超过20位';

        }
        ,code: function (value) {
            if(value.length == 0) return '请输入菜单编码';
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
         * 工具条：添加菜单信息
         */
        'addBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 添加菜单信息"
                ,area: '600px'
                ,shade: 0.3
                ,maxmin:true
                ,offset:'150px'
                ,btn: ['添加', '取消']
                ,content:"<div id='addDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(addPop.innerHTML).render([], function(html){
                        // 动态获取弹出层对象并追加html
                        $("#addDiv").empty().append(html);
                        // 初始化下拉树
                        selectTree.render({
                            'id': 'addPId'
                            ,'url': '/client/tree/menu'
                            ,'isMultiple': false
                            ,clickNode:function (event, treeId, treeNode){

                                if(treeNode.level + 1 == 1){
                                    $("#addDiv .menu-url").hide();
                                    $("#addDiv .menu-icon").show();
                                }else{
                                    $("#addDiv .menu-url").show();
                                    $("#addDiv .menu-icon").hide();
                                }

                                // 选择菜单默认选择菜单级别
                                $("#addDiv select[name='level']").val(treeNode.level+1);
                                selectTree.setValue(treeId,treeNode);
                                selectTree.hideTree();
                                form.render("select");
                            }
                        });

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
                            ,url: '/client/menu/insert'
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
                layer.msg('请选中菜单进行删除', {time: 2000});
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

            layer.confirm('确定删除这批菜单？', function(index){
                var id = '';
                for(var i = 0, len = data.length; i<len; i++){
                    id += ",'" + data[i].id + "'";
                }
                // 数据提交到后台，通用方法
                submitServer({
                    index: index
                    ,type: 'POST'
                    ,param: {id: id.substring(1)}
                    ,url: '/client/menu/delete'
                });
            });
        }
        /**
         * 列表中：删除选中的菜单信息
         * @param obj
         */
        ,'deleteOption': function (obj) {
            layer.confirm('确定删除该菜单？', function(index){
                obj.del();
                // 数据提交到后台，通用方法
                submitServer({
                    index: index
                    ,param: null
                    ,type: 'DELETE'
                    ,url: '/client/menu/delete/' + obj.data.id,
                });
            });
        }
        /**
         * 列表中：修改菜单信息
         * @param obj
         */
        ,'updateOption': function (obj) {
            let param = obj.data;
            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改菜单信息"
                ,area: '500px'
                ,shade: 0.3
                ,maxmin:true
                ,offset: '50px'
                ,btn: ['修改', '取消']
                ,content:"<div id='updateDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(updatePop.innerHTML).render(param, function(html){
                        // 动态获取弹出层对象
                        $("#updateDiv").empty().append(html);
                        // 菜单级别下拉框赋值
                        $("#updateDiv select[name='level']").val(param.level);

                        if(param.level == 1){
                            $("#updateDiv .menu-url").hide();
                            $("#updateDiv .menu-icon").show();
                        }else{
                            $("#updateDiv .menu-url").show();
                            $("#updateDiv .menu-icon").hide();
                        }

                        // 初始化下拉树
                        selectTree.render({
                            'id': 'updatePId'
                            ,'url': '/client/tree/menu'
                            ,'isMultiple': false
                            ,'checkNodeId': param.pId
                            ,clickNode:function (event, treeId, treeNode){

                                if(treeNode.level + 1 == 1){
                                    $("#updateDiv .menu-url").hide();
                                    $("#updateDiv .menu-icon").show();
                                }else{
                                    $("#updateDiv .menu-url").show();
                                    $("#updateDiv .menu-icon").hide();
                                }
                                // 选择菜单默认选择菜单级别
                                $("#updateDiv select[name='level']").val(treeNode.level+1);
                                selectTree.setValue(treeId,treeNode);
                                selectTree.hideTree();
                                form.render("select");
                            }
                        });


                    });
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitUpdateBtn)", function(data){
                        data.field.id = param.id;

                        if($(".pId").hasClass("layui-hide")){
                            data.field.pId = "";
                        }

                        // 数据提交到后台，通用方法
                        submitServer({
                            index: index
                            ,type: 'POST'
                            ,param: data.field
                            ,url: '/client/menu/update'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitUpdateBtn").click();
                }
            });
        }
    };

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