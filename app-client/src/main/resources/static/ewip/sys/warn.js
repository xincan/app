layui.config({
    base: '/client/layuiadmin/modules/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    selectTree: 'selectTree'
    ,zTree: 'zTree'
    ,disaster: 'disaster'
});

layui.use(['table','form','laytpl','layer', 'selectTree', 'zTree', 'disaster'], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,laytpl = layui.laytpl		// 引用layui模板引擎
        ,layer = layui.layer		// 引用layui弹出层
        ,$ = layui.$       			// 引用layui的jquery
        ,selectTree = layui.selectTree
        ,zTree = layui.zTree
        ,disaster = layui.disaster;

    /**
     * 颜色转换
     * @param d
     * @returns {string}
     */
    let colorFormat = function(d){
        return disaster.color(d.disasterColor,"bg");
    };

    /**
     * 级别转换
     * @param d
     * @returns {string}
     */
    let levelFormat = function(d){
        return disaster.level(d.disasterLevel);
    };


    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/warn/select'
        ,page:true
        ,even: true
        ,height: 'full-165'
        ,limits:[5,10,20,50,100]
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'disasterName', title: '预警名称', sort: true}
            ,{field: 'disasterColor', title: '预警颜色', sort: true, templet:colorFormat}
            ,{field: 'disasterLevel', title: '预警级别', templet: levelFormat }
            ,{field: 'content', title: '预警内容', sort: true}
            ,{field: 'instruction', title: '防御指南'}
            ,{title: '操&nbsp;&nbsp;作', width: 150, align:'center', toolbar: '#btnGroupOption'}
        ]]
        ,done:function (res, curr, count) {
            var panelHeight = $(".ewip-panel-right").height();
            var cardHeight = $(".ewip-panel-left .layui-card .layui-card-header").height();
            $(".ewip-left-tree").height(panelHeight - cardHeight - 20 - 2);
            $(".ewip-left-tree").parent().css("overflow","auto");
        }
    });

    /**
     * 修改后重新刷新列表，curr: 1重新从第 1 页开始
     */
    let reloadTable = function (param) {
        console.log(param);
        table.reload('table', {
            page: {
                curr: 1
            },
            where: { //设定异步数据接口的额外参数，任意设
                disasterName: param == undefined ? '' : param.disasterName
                ,disasterColor: param == undefined ? '' : param.disasterColor
                ,disasterLevel: param == undefined ? '' : param.disasterLevel
            }
        });
    };


    /**
     * 自定义验证规则
     */
    form.verify({
        areaId: function(value){
            if(value.length == 0) {
                $("#addAreaId .addAreaIdShow, #updateAreaId .updateAreaIdShow").css("border-color","red");
                return '请选择所属地区';
            }
        }
        ,organizationId: function(value){
            if(value.length == 0) {
                $("#addOrganizationId .addOrganizationIdShow, #updateOrganizationId .updateOrganizationIdShow").css("border-color","red");
                return '请选择所属机构';
            }
        }
        ,channelId: function(value){
            if(value.length == 0) return '请选择发布渠道';
        }
        ,disasterId: function(value){
            if(value.length == 0) {
                $("#addDisasterId .addDisasterIdShow, #updateDisasterId .updateDisasterIdShow").css("border-color","red");
                return '请选择灾种';
            }
        }
        ,content: function (value) {
            if(value.length == 0)  return '请输入预警内容';
            if(value.length > 10)  return '预警内容长度不能大于1000';
        }
        ,measure: function (value) {
            if(value.length == 0)  return '请输入政府应对措施';
            if(value.length > 10)  return '政府应对措施内容长度不能大于1000';
        }
        ,instruction: function (value) {
            if(value.length == 0) return '请输入防御指南';
            if(value.length > 100) return '防御指南长度不能大于1000';
        }
    });

    /**
     * 群组树点击事件
     * @param event
     * @param treeId
     * @param treeNode
     */
    var organizationClick = function(event, treeId, treeNode){
        table.reload('table', {
            page: {
                curr: 1
            },
            where: { organizationId: treeNode.id}
        });
    };
    /**
     * 初始化加载机构树
     */
    zTree.async({
        id: "#organizationTree",
        setting: {
            async:{
                enable:true,
                url: "/client/tree/organization",
                autoParam:["id"],
                dataType:"json",
            },
            check: {
                enable: false,
                chkboxType: {"Y":"", "N": ""},
                chkStyle:"checkbox"
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback:{
                onClick:organizationClick
            }
        }
    });


    /**
     * 提交到后台
     * @param option
     */
    let submit = function (option) {
        $.ajax({
            async:option.async
            ,type: option.type
            ,data: option.param
            ,url: option.url
            ,dataType: option.dataType
            ,success: function(json){
                if(option.index != null) layer.close(option.index);
                if(json.code == 200){
                    // 异步刷新地区树
                    // userGroupZtree.reAsyncChildNodes(null, "refresh");
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
         * 工具条：添加预警配置信息
         */
        'addBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 添加预警配置信息"
                ,area: '600px'
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
                        // 初始化下拉地区拉树
                        selectTree.render({
                            'id': 'addAreaId'
                            ,'url': '/client/tree/area'
                            ,'isMultiple': false
                        });
                        // 初始化下拉机构拉树
                        selectTree.render({
                            'id': 'addOrganizationId'
                            ,'url': '/client/tree/organization'
                            ,'isMultiple': false
                        });
                        // 初始化下拉灾种级别拉树
                        selectTree.render({
                            'id': 'addDisasterId'
                            ,'url': '/client/tree/disaster/level'
                            ,'isMultiple': false
                            ,clickNode:function (event, treeId, treeNode) {
                                if(treeNode.isConfig==1){
                                    var name = treeNode.name;
                                    name = name.substring(0, name.indexOf("["));
                                    treeNode.name = name;
                                    $("#addDiv input[name='disasterName']").val(name);
                                    $("#addDiv select[name='disasterColor']").val(treeNode.disasterColor);
                                    $("#addDiv select[name='disasterLevel']").val(treeNode.disasterLevel);
                                    selectTree.setValue(treeId,treeNode);
                                    selectTree.hideTree();
                                    form.render("select");
                                }
                                return false;
                            }
                        });
                    });
                    // 渲染表单
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitAddBtn)", function(data){
                        // 数据提交到后台，通用方法
                        submit({
                            index: index
                            ,async: 'true'
                            ,url: '/client/warn/insert'
                            ,type: 'POST'
                            ,param: data.field
                            ,dataType: 'json'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitAddBtn").click();
                }
            });
        }
        /**
         * 工具条：批量删除受众信息
         * @returns {boolean}
         */
        ,'deleteBarBtn': function(){
            var checkStatus = table.checkStatus('table')
                ,data = checkStatus.data;
            if(data.length == 0){
                layer.msg('请选中列表中数据进行删除', {time: 2000});
                return false;
            }

            var id = '';
            for(var i = 0, len = data.length; i<len; i++){
                id += ",'" + data[i].id + "'";
            }

            layer.confirm('确定删除选中预警配置？', function(index){
                // 数据提交到后台，通用方法
                submit({
                    index: index
                    ,async: 'true'
                    ,url: '/client/warn/delete'
                    ,type: 'POST'
                    ,param: {id: id.substring(1)}
                    ,dataType: 'json'
                });
            });
        }

        /**
         * 列表中：修改预警配置信息
         * @param obj
         */
        ,'updateOption': function (obj) {
            var param = obj.data;
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改预警配置信息"
                ,area: '600px'
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
                        // 初始化下拉地区拉树
                        selectTree.render({
                            'id': 'updateAreaId'
                            ,'url': '/client/tree/area'
                            ,'isMultiple': false
                            ,'checkNodeId': param.areaId
                        });
                        // 初始化下拉机构拉树
                        selectTree.render({
                            'id': 'updateOrganizationId'
                            ,'url': '/client/tree/organization'
                            ,'isMultiple': false
                            ,'checkNodeId': param.organizationId
                        });
                        // 初始化下拉灾种级别拉树
                        selectTree.render({
                            'id': 'updateDisasterId'
                            ,'url': '/client/tree/disaster/level'
                            ,'isMultiple': false
                            ,'checkNodeId': param.disasterId
                            ,clickNode:function (event, treeId, treeNode) {
                                if(treeNode.isConfig==1){
                                    var name = treeNode.name;
                                    name = name.substring(0, name.indexOf("["));
                                    treeNode.name = name;
                                    $("#updateDiv input[name='disasterName']").val(name);
                                    $("#updateDiv select[name='disasterColor']").val(treeNode.disasterColor);
                                    $("#updateDiv select[name='disasterLevel']").val(treeNode.disasterLevel);
                                    selectTree.setValue(treeId,treeNode);
                                    selectTree.hideTree();
                                    form.render("select");
                                }
                                return false;
                            }
                        });
                        $("#updateDiv input[name='disasterName']").val(param.disasterName);
                        $("#updateDiv select[name='disasterColor']").val(param.disasterColor);
                        $("#updateDiv select[name='disasterLevel']").val(param.disasterLevel);
                        $("#updateDiv textarea[name='content']").val(param.content);
                        $("#updateDiv textarea[name='measure']").val(param.measure);
                        $("#updateDiv textarea[name='instruction']").val(param.instruction);
                        form.render('select');
                    });
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitUpdateBtn)", function(data){
                        data.field.id = param.id;
                        // 数据提交到后台，通用方法
                        submit({
                            index: index
                            ,async: 'true'
                            ,url: '/client/warn/update'
                            ,type: 'POST'
                            ,param: data.field
                            ,dataType: 'json'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitUpdateBtn").click();
                }
            });
        }

        /**
         * 列表中：删除选中的预警配置信息
         * @param obj
         */
        ,'deleteOption': function (obj) {
            layer.confirm('确定删除该预警配置？', function(index){
                obj.del();
                // 数据提交到后台，通用方法
                submit({
                    index: index
                    ,async: 'true'
                    ,url: '/client/warn/delete/' + obj.data.id
                    ,type: 'DELETE'
                    ,param: {fileName: obj.data.icon}
                    ,dataType: 'json'
                });
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