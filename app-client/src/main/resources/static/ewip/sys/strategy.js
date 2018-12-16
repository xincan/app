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

    var flowFormat = function(d){
        var flow = d.flow.split(','), html = '<div class="tableFlow">', name = ['录入','审核','签发','应急办签发','发布'];
        for(var i = 0; i<flow.length; i++){
            html += '<div class="flow">';
            html += '   <div class="flowTitle">'+name[flow[i]]+'</div>';
            html += '   <div class="flowYuan"></div>';
            html +='</div>';
            if(i < flow.length-1){
                html += ' <div class="flow-line"></div>';
            }
        }
        html += '</div>';
        return html;
    };

    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/strategy/select'
        ,even: true
        ,page:true
        ,height: 'full-165'
        ,limits:[5,10,20,50,100]
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'name', title: '策略名称', sort: true}
            ,{field: 'flow', title: '预警流程',width:'40%', sort: true, templet: flowFormat}
            ,{title: '操&nbsp;&nbsp;作',width: '15%', align:'center', toolbar: '#btnGroupOption'}
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
    let reloadTable = function (param, type) {
        var where = {};
        if(type == 0){
            where = { //设定异步数据接口的额外参数，任意设
                disasterId : null
                ,disasterName: param == undefined ? null : param.disasterName
                ,disasterColor: param == undefined ? null : param.disasterColor
                ,disasterLevel: param == undefined ? null : param.disasterLevel
            }
        }else if(type == 2){
            where = param;
        }

        if(param==null) where = null;
        table.reload('table', {
            page: {
                curr: 1
            },
            where: where
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
        ,disasterId: function(value){
            if(value.length == 0) {
                $("#addDisasterId .addDisasterIdShow, #updateDisasterId .updateDisasterIdShow").css("border-color","red");
                return '请选择灾种';
            }
        }
    });

    /**78i
     * 查询渠道
     * @param callback
     */
    let selectChannel = function(callback){
        $.ajax({
            async:true
            ,type: "POST"
            ,data: {type:0} // 0：表示渠道
            ,url: "/client/channel/list"
            ,dataType: 'json'
            ,success: function(json){
                callback(json.data.length > 0 ? json.data : null);
            }
        });
    };

    /**
     * 灾种级别树点击事件
     * @param event
     * @param treeId
     * @param treeNode
     */
    var disasterLevelClick = function(event, treeId, treeNode){
        if(treeNode.type < 2){
            layer.msg('请点击灾种或灾种级别查询', {time: 1000});
            return false;
        }
        var where = {disasterId: treeNode.id};
        if(treeNode.isConfig == 0){
            where.disasterColor = null;
            where.disasterLevel = null;
        }else{
            where.disasterColor = treeNode.disasterColor;
            where.disasterLevel = treeNode.disasterLevel;
        }
        reloadTable(where, 2);
    };
    /**
     * 初始化加载机构树
     */
    var disasterLevelTree = zTree.async({
        id: "#disasterLevelTree",
        setting: {
            async:{
                enable:true,
                url: "/client/tree/disaster/level",
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
                onClick:disasterLevelClick
            },
            view: {
                addDiyDom: function(treeId, treeNode){
                    if(treeNode.isStrategy==1){
                        $("#" + treeNode.tId + "_a").prepend('<i class="layui-icon layui-icon-ok" style="font-weight: bold"></i>');
                    }
                },
                fontCss: function(treeId, treeNode) {
                    if(treeNode.level == 4){
                        if(treeNode.disasterColor == 0){
                            return {color:"red"}
                        }else  if(treeNode.disasterColor == 1){
                            return {color:"orange"}
                        }else if(treeNode.disasterColor == 2){
                            return {color:"#d0d057"}
                        }else if(treeNode.disasterColor == 3){
                            return {color:"blue"}
                        }
                    }
                    return {};
                }

            }
        }
    });


    /**
     * 提交到后台
     * @param option
     */
    let submit = function (option, callback) {
        $.ajax({
            async:option.async
            ,type: option.type
            ,data: option.param
            ,url: option.url
            ,dataType: option.dataType
            ,success: function(json){
                if(json.code == 200){
                    callback(option.param,json);
                }
            }
        });

    };


    /**
     * 统一按钮操作对象
     * @type {{addBarBtn: 添加信息, deleteBarBtn: 批量删除信息, deleteOption: 删除单个信息, updateOption: 修改信息}}
     */
    let active = {
        /**
         * 工具条：添加策略配置信息
         */
        'addBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 添加策略配置信息"
                ,area: '750px'
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
                                    $("#addDiv input[name='name']").val(treeNode.name);
                                    $("#addDiv input[name='disasterName']").val(name);
                                    $("#addDiv select[name='disasterColor']").val(treeNode.disasterColor);
                                    $("#addDiv select[name='disasterLevel']").val(treeNode.disasterLevel);
                                    selectTree.setValue(treeId,treeNode);
                                    selectTree.hideTree();
                                    form.render("select");
                                }else{
                                    layer.msg("请选择灾种级别", {time: 2000});
                                }
                                layer.msg("请选择灾种级别", {time: 1000});
                                return false;
                            }
                        });
                        // 初始化渠道
                        selectChannel(function (data) {
                            for(let i = 0; i<data.length; i++){
                                if(data[i].status==1){
                                    $("#addChannelId").append('<input type="checkbox" name="channelId" lay-verify="channelId" value="'+data[i].id+'" title="'+data[i].name+'" lay-skin="primary" >');
                                }else{
                                    $("#addChannelId").append('<input type="checkbox" name="channelId" lay-verify="channelId" value="'+data[i].id+'" title="'+data[i].name+'(未部署)" lay-skin="primary" disabled>');
                                }
                            }
                            form.render('checkbox');
                        });
                    });
                    // 渲染表单
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitAddBtn)", function(data){
                        // 数据提交到后台，通用方法
                        var channelId = "",flow = "";
                        $('#addDiv input[type="checkbox"][name="channelId"]:checked').each(function (index, element) {
                            channelId += "," + $(element).val();
                        });
                        $('#addDiv input[type="checkbox"][name="flow"]:checked').each(function (index, element) {
                            flow += "," + $(element).val();
                        });
                        data.field.channelId = channelId.substring(1);
                        data.field.flow = flow.substring(1);
                        data.field.isStrategy = 1;

                        if(channelId == ""){
                            layer.msg("请配置发布渠道",{time: 2000});
                            return false;
                        }

                        submit({
                            async: 'false'
                            ,url: '/client/strategy/insert'
                            ,type: 'POST'
                            ,param: data.field
                            ,dataType: 'json'
                        },function (param,json) {
                            $.ajax({
                                async: 'false'
                                ,url: '/client/disaster/update/strategy'
                                ,type: 'POST'
                                ,data: {id:param.disasterId, isStrategy: 1}
                                ,dataType: 'json'
                                ,success: function(data){
                                    if(data.code == 200){
                                        layer.close(index);
                                        // 异步刷新地区树
                                        disasterLevelTree.reAsyncChildNodes(null, "refresh");
                                        // 刷新列表
                                        reloadTable(null, 1);
                                    }
                                    // 弹出提示信息，2s后自动关闭
                                    layer.msg(json.msg, {time: 1000});
                                }
                            });
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitAddBtn").click();
                }
            });
        }
        /**
         * 工具条：批量删除策略配置信息
         * @returns {boolean}
         */
        ,'deleteBarBtn': function(){
            var checkStatus = table.checkStatus('table')
                ,data = checkStatus.data
                ,id = ''
                ,disasterId = '';
            if(data.length == 0){
                layer.msg('请选中列表中数据进行删除', {time: 2000});
                return false;
            }

            for(var i = 0, len = data.length; i<len; i++){
                id += ",'" + data[i].id + "'";
                disasterId += "," + data[i].disasterId;
            }

            layer.confirm('确定删除选中策略配置？', function(index){
                // 数据提交到后台，通用方法
                submit({
                    async: 'true'
                    ,url: '/client/strategy/delete'
                    ,type: 'POST'
                    ,param: {id: id.substring(1)}
                    ,dataType: 'json'
                },function (param,json) {
                    console.log(disasterId);
                    $.ajax({
                        async: 'false'
                        ,url: '/client/disaster/update/strategy'
                        ,type: 'POST'
                        ,data: {id:disasterId, isStrategy: 0}
                        ,dataType: 'json'
                        ,success: function(data){
                            if(data.code == 200){
                                layer.close(index);
                                // 异步刷新地区树
                                disasterLevelTree.reAsyncChildNodes(null, "refresh");
                                // 刷新列表
                                reloadTable(null, 1);
                            }
                            // 弹出提示信息，2s后自动关闭
                            layer.msg(json.msg, {time: 1000});
                        }
                    });
                });
            });
        }

        /**
         * 列表中：修改策略配置信息
         * @param obj
         */
        ,'updateOption': function (obj) {
            var param = obj.data;
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改策略配置信息"
                ,area: '750px'
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
                                    $("#updateDiv input[name='name']").val(treeNode.name);
                                    $("#updateDiv input[name='disasterName']").val(name);
                                    $("#updateDiv select[name='disasterColor']").val(treeNode.disasterColor);
                                    $("#updateDiv select[name='disasterLevel']").val(treeNode.disasterLevel);
                                    selectTree.setValue(treeId,treeNode);
                                    selectTree.hideTree();
                                    form.render("select");
                                }else{
                                    layer.msg("请选择灾种级别", {time: 2000});
                                }
                                return false;
                            }
                        });

                        //流程配置数据回显
                        if(param.flow.length > 0){
                            var flow = param.flow.split(",");
                            for(var i = 0; i<flow.length; i++){
                                $("#updateDiv input[type='checkbox'][name='flow'][value='"+flow[i]+"']").attr("checked","checked");
                            }
                        }

                        // 渠道查询并做数据回显
                        selectChannel(function (data) {
                            for(var i = 0; i<data.length; i++){
                                if(data[i].status==1){
                                    $("#updateChannelId").append('<input type="checkbox" name="channelId" lay-verify="channelId" value="'+data[i].id+'" title="'+data[i].name+'" lay-skin="primary" >');
                                }else{
                                    $("#updateChannelId").append('<input type="checkbox" name="channelId" lay-verify="channelId" value="'+data[i].id+'" title="'+data[i].name+'(未部署)" lay-skin="primary" disabled>');
                                }
                            }
                            // 渠道数据回显
                            if(param.channelId.length > 0 ){
                                var channleId = param.channelId.split(",");
                                for(var i = 0; i<channleId.length; i++){
                                    $("#updateChannelId input[type='checkbox'][name='channelId'][value='"+channleId[i]+"']").attr("checked","checked");
                                }
                            }
                            form.render('checkbox');
                        });

                        $("#updateDiv input[name='disasterName']").val(param.disasterName);
                        $("#updateDiv select[name='disasterColor']").val(param.disasterColor);
                        $("#updateDiv select[name='disasterLevel']").val(param.disasterLevel);
                        form.render('select');


                    });
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitUpdateBtn)", function(data){
                        data.field.id = param.id;
                        // 数据提交到后台，通用方法
                        var channelId = "",flow = "";
                        $('#updateDiv input[type="checkbox"][name="channelId"]:checked').each(function (index, element) {
                            channelId += "," + $(element).val();
                        });
                        $('#updateDiv input[type="checkbox"][name="flow"]:checked').each(function (index, element) {
                            flow += "," + $(element).val();
                        });
                        data.field.channelId = channelId.substring(1);
                        data.field.flow = flow.substring(1);
                        data.field.isStrategy = 1;

                        if(channelId == ""){
                            layer.msg("请配置发布渠道",{time: 2000});
                            return false;
                        }

                        submit({
                            async: 'false'
                            ,url: '/client/strategy/update'
                            ,type: 'POST'
                            ,param: data.field
                            ,dataType: 'json'
                        },function (param,json) {
                            $.ajax({
                                async: 'false'
                                ,url: '/client/disaster/update/strategy'
                                ,type: 'POST'
                                ,data: {id:param.disasterId, isStrategy: 1}
                                ,dataType: 'json'
                                ,success: function(data){
                                    if(data.code == 200){
                                        layer.close(index);
                                        // 异步刷新地区树
                                        disasterLevelTree.reAsyncChildNodes(null, "refresh");
                                        // 刷新列表
                                        reloadTable(null, 1);
                                    }
                                    // 弹出提示信息，2s后自动关闭
                                    layer.msg(json.msg, {time: 1000});
                                }
                            });
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitUpdateBtn").click();
                }
            });
        }

        /**
         * 列表中：删除选中的策略配置信息
         * @param obj
         */
        ,'deleteOption': function (obj) {
            layer.confirm('确定删除该策略配置？', function(index){
                obj.del();
                // 数据提交到后台，通用方法
                submit({
                    async: 'false'
                    ,url: '/client/strategy/delete/' + obj.data.id
                    ,type: 'DELETE'
                    ,param: {fileName: obj.data.icon}
                    ,dataType: 'json'
                },function (param,json) {
                    $.ajax({
                        async: 'false'
                        ,url: '/client/disaster/update/strategy'
                        ,type: 'POST'
                        ,data: {id:obj.data.disasterId, isStrategy: 0}
                        ,dataType: 'json'
                        ,success: function(data){
                            if(data.code == 200){
                                layer.close(index);
                                // 异步刷新地区树
                                disasterLevelTree.reAsyncChildNodes(null, "refresh");
                                // 刷新列表
                                reloadTable(null, 1);
                            }
                            // 弹出提示信息，2s后自动关闭
                            layer.msg(json.msg, {time: 1000});
                        }
                    });
                });
            });
        }
    };

    /**
     * 监听头部搜索
     */
    form.on('submit(search)', function(data){
        reloadTable(data.field, 0);
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