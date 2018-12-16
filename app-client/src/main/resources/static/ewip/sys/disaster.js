layui.config({
    base: '/client/layuiadmin/modules/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    ajaxFileUpload: 'ajaxFileUpload' //如果 mymod.js 是在根目录，也可以不用设定别名
    ,selectTree: 'selectTree'
    ,zTree: 'zTree'
    ,disaster: 'disaster'
});

layui.use(['table','form','laytpl','layer', 'ajaxFileUpload', 'selectTree', 'zTree', 'disaster'], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,laytpl = layui.laytpl		// 引用layui模板引擎
        ,layer = layui.layer		// 引用layui弹出层
        ,$ = layui.$       			// 引用layui的jquery
        ,ajaxFileUpload = layui.ajaxFileUpload
        ,selectTree = layui.selectTree
        ,zTree = layui.zTree
        ,disaster = layui.disaster;


    /**
     * 格式化灾种类型
     * @param d
     * @returns {string}
     */
    let typeFormat = function(d){
        if(d.type == -1) return "<span class='layui-btn layui-btn-xs layui-btn-normal ewip-cursor-default'>根节点</span>";
        if(d.type == 0) return "<span class='layui-btn layui-btn-xs layui-btn-warm ewip-cursor-default'>事件</span>";
        if(d.type == 1) return "<span class='layui-btn layui-btn-normal layui-btn-xs ewip-cursor-default'>灾种</span>";
    };

    /**
     * 图片格式化
     * @param d
     * @returns {string}
     */
    let iconFormat = function(d){
        if(d.icon!="" && d.icon!=null) {
            return "<img src='/client/"+d.icon+"'  style='width:50px;height:50px;' >";
        }else{
            return "暂无图片";
        }
    };

    /**
     * 颜色转换
     * @param d
     * @returns {string}
     */
    let colorFormat = function(d){
        return disaster.color(d.disasterColor);
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
        ,url:'/client/disaster/select'
        ,page:true
        ,even: true
        ,height: 'full-165'
        ,limits:[10,20,50,100]
        ,where:{isConfig: 1}
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'code', title: '灾种编码', sort: true}
            ,{field: 'name', title: '灾种名称', sort: true}
            ,{field: 'disasterColor', title: '灾种颜色', sort: true, templet:colorFormat}
            ,{field: 'disasterLevel', title: '灾种级别', templet: levelFormat }
            ,{field: 'icon', title: '图&nbsp;&nbsp;标', width:80, templet: iconFormat }
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
        table.reload('table', {
            page: {
                curr: 1
            },
            where: { //设定异步数据接口的额外参数，任意设
                name: param == undefined ? '' : param.name
                ,code: param == undefined ? '' : param.code
            }
        });
    };


    /**
     * 自定义验证规则
     */
    form.verify({
        pId: function(value){
            if(value.length == 0) {
                $("#addPId .addPIdShow, #updatePId .updatePIdShow").css("border-color","red");
                return '请选择上级灾种';
            }
        }
        ,type: function (value) {
            if(value.length == 0) return '请选择灾种类型';
        }
        ,name: function (value) {
            if(value.length == 0)  return '请选输入灾种名称';
            if(value.length > 10)  return '渠道手段长度不能大于10';
        }
        ,code: function (value) {
            if(value.length == 0) return '请输入灾种编码';
            if(value.length != 5) return "灾种编码长度是5位";
            var reg = /^[0-9a-zA-Z]+$/;
            if(!reg.test(value)) return '灾种编码必须包含数字和字母';
        }
        ,icon: function(value){
            if(value.length == 0) return '请上传灾种logo';
        }
    });

    /**
     * 灾种树点击事件
     * @param event
     * @param treeId
     * @param treeNode
     */
    var disasterClick = function(event, treeId, treeNode){
        table.reload('table', {
            page: {
                curr: 1
            },
            where: { //设定异步数据接口的额外参数，任意设
                pId: treeNode.id
            }
        });
    };
    /**
     * 初始化加载灾种树
     */
    var disasterZtree = zTree.async({
        id: "#disasterTree",
        setting: {
            async:{
                enable:true,
                url: "/client/tree/disaster",
                autoParam:["id"],
                dataType:"json",
            },
            check: {
                enable: true,
                chkboxType: {"Y":"", "N": ""},
                chkStyle:"checkbox"
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback:{
                onClick:disasterClick
            }
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
            async:option.async
            ,type: option.type
            ,data: option.param
            ,url: option.url
            ,dataType: option.dataType
            ,success: function(json){
                if(option.index != null) layer.close(option.index);
                if(json.code == 200){
                    // 异步刷新地区树
                    disasterZtree.reAsyncChildNodes(null, "refresh");
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
         * 工具条：添加灾种信息
         */
        'addBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 添加灾种信息"
                ,area: ['600px','400px']
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
                        // 初始化下拉树
                        selectTree.render({
                            'id': 'addPId'
                            ,'url': '/client/tree/disaster'
                            ,'isMultiple': false
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
                            ,url: '/client/disaster/insert'
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
         * 工具条：修改灾种信息
         * @param obj
         */
        ,'updateBarBtn': function (obj) {
            // 获取灾种树选中节点
            var nodes = disasterZtree.getCheckedNodes(true);
            if(nodes.length == 0){
                layer.msg('请选中灾种进行修改', {time: 2000});
                return false;
            }
            if(nodes.length > 1){
                layer.msg('请选中一个灾种进行修改', {time: 2000});
                return false;
            }
            var param = nodes[0];
            console.log(param);

            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改灾种信息"
                ,area: ['600px','500px']
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
                        // 地区级别下拉框赋值
                        $("#updateDiv select[name='type']").val(param.type);

                        // 初始化下拉树
                        selectTree.render({
                            'id': 'updatePId'
                            ,'url': '/client/tree/disaster'
                            ,'isMultiple': false
                            ,'checkNodeId': param.pId

                        });



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
                            ,url: '/client/disaster/update'
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
         * 工具条：批量删除灾种信息
         * @returns {boolean}
         */
        ,'deleteBarBtn': function(){
            // 获取灾种树选中节点
            var nodes = disasterZtree.getCheckedNodes(true);
            
            if(nodes.length == 0){
                layer.msg('请选中灾种进行删除', {time: 2000});
                return false;
            }
            var id = '', count =0, level = -1;
            for(var i = 0; i<nodes.length; i++){
                id += ",'" + nodes[i].id + "'";
                level = nodes[i].level == 0 ? 0 : -1;
                count += nodes[i].children == undefined ? 0 : nodes[i].children.length;
            }
            if(count > 0){
                layer.msg('选中数据存在子节点，请先删除子节点', {time: 2000});
                return false;
            }
            // 判断是否是根节点
            if(level == 0){
                layer.msg('根节点不允许删除', {time: 2000});
                return false;
            }

            layer.confirm('确定删除选中灾种？', function(index){
                // 数据提交到后台，通用方法
                submit({
                    index: index
                    ,async: 'true'
                    ,url: '/client/disaster/delete'
                    ,type: 'POST'
                    ,param: {id: id.substring(1)}
                    ,dataType: 'json'
                });
            });
        }
        /**
         * 工具条：批量删除灾种信息
         * @returns {boolean}
         */
        ,'deleteLevelBarBtn': function(){
            var checkStatus = table.checkStatus('table')
                ,data = checkStatus.data;
            if(data.length == 0){
                layer.msg('请选中列表中数据进行删除', {time: 2000});
                return false;
            }

            var id = '', file='';
            for(var i = 0, len = data.length; i<len; i++){
                id += ",'" + data[i].id + "'";
                var icon =data[i].icon;
                var iconIndex = (icon.lastIndexOf("\\")+1)||(icon.lastIndexOf("/")+1);
                file += "," + icon.substring(iconIndex, icon.length);
            }

            layer.confirm('确定删除选中灾种？', function(index){
                // 数据提交到后台，通用方法
                submitFile({
                    index: index
                    ,async: 'true'
                    ,url: '/client/disaster/delete/level'
                    ,type: 'POST'
                    ,param: {id: id.substring(1), fileName: file.substring(1)}
                    ,dataType: 'json'
                    ,files: []
                });
            });
        }
        /**
         * 工具条：灾种级别配置信息
         */
        ,'configLevelBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 灾种级别配置"
                ,area: ['600px','500px']
                ,shade: 0.3
                ,maxmin:true
                ,offset:'50px'
                ,btn: ['添加', '取消']
                ,content:"<div id='configDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(configAddPop.innerHTML).render([], function(html){
                        // 动态获取弹出层对象并追加html
                        $("#configDiv").empty().append(html);
                        // 初始化下拉灾种拉树
                        selectTree.render({
                            'id': 'configAddPId'
                            ,'url': '/client/tree/disaster'
                            ,'isMultiple': false
                            ,clickNode:function (event, treeId, treeNode) {
                                $("#configDiv select[name='type']").val(treeNode.type);
                                $("#configDiv input[name='name']").val(treeNode.name);
                                $("#configDiv input[name='code']").val(treeNode.code);
                                selectTree.setValue(treeId,treeNode);
                                selectTree.hideTree();
                                form.render("select");
                            }
                        });

                        // 点击上传按钮，出发文件按钮
                        $('#addUploadBtn').on('click', function(){
                            $("#addFile").click();
                        });
                        // 选择上传文件
                        $("#addFile").change(function (e) {
                            $("#configDiv input[name='icon']").val($(this).val());
                        });
                        // 监听color颜色单选
                        form.on('radio(color)', function (data) {
                            $('#configDiv input[name="levelName"]').val(disaster.chooseColorToLevel(data.value).name);
                            $('#configDiv input[name="disasterLevel"]').val(data.value);
                        });
                        // 默认选择级别为蓝色四级
                        $('#configDiv input[name="levelName"]').val(disaster.chooseColorToLevel(3).name);
                        $('#configDiv input[name="disasterLevel"]').val(3);

                    });
                    // 渲染表单
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitConfigAddBtn)", function(data){
                        // 数据提交到后台，通用方法
                        submitFile({
                            index: index
                            ,async: 'true'
                            ,url: '/client/disaster/insert/level'
                            ,type: 'POST'
                            ,param: data.field
                            ,files: ['addFile']
                            ,dataType: 'json'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitConfigAddBtn").click();
                }
            });
        }

        /**
         * 列表中：删除选中的灾种信息
         * @param obj
         */
        ,'deleteOption': function (obj) {
            layer.confirm('确定删除该灾种？', function(index){
                obj.del();
                // 数据提交到后台，通用方法
                submit({
                    index: index
                    ,param: {fileName: obj.data.icon}
                    ,type: 'POST'
                    ,url: '/client/disaster/delete/' + obj.data.id,
                });
            });
        }
        /**
         * 列表中：修改灾种级别信息
         * @param obj
         */
        ,'updateOption': function (obj) {
            var param = obj.data;
            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改灾种级别信息"
                ,area: ['600px','500px']
                ,shade: 0.3
                ,maxmin:true
                ,offset: '50px'
                ,btn: ['修改', '取消']
                ,content:"<div id='updateDiv' style='padding:20px 20px 0 20px'></div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(configUpdatePop.innerHTML).render(param, function(html){
                        // 动态获取弹出层对象
                        $("#updateDiv").empty().append(html);
                        // 初始化下拉树
                        selectTree.render({
                            'id': 'configUpdatePId'
                            ,'url': '/client/tree/disaster'
                            ,'isMultiple': false
                            ,'range':'#updateDiv'
                            //,'setData':['type','name','code']
                            ,'checkNodeId': param.pId
                            ,clickNode:function (event, treeId, treeNode) {
                                $("#updateDiv select[name='type']").val(treeNode.type);
                                $("#updateDiv input[name='name']").val(treeNode.name);
                                $("#updateDiv input[name='code']").val(treeNode.code);
                                selectTree.setValue(treeId,treeNode);
                                selectTree.hideTree();
                                form.render("select");
                            }
                        });
                        // 点击上传按钮，出发文件按钮
                        $('#updateUploadBtn').on('click', function(){
                            $("#updateFile").click();
                        });
                        // 选择上传文件
                        $("#updateFile").change(function (e) {
                            $("input[name='icon']").val($(this).val());
                        });
                        $('#updateDiv select[name="type"]').val(param.type);
                        // 灾种颜色赋值
                        $("#updateDiv input[name='disasterColor'][value='"+param.disasterColor+"']").attr("checked",true);
                        // 灾种级别名称赋值
                        $('#updateDiv input[name="levelName"]').val(disaster.chooseColorToLevel(param.disasterLevel).name);
                        // 灾种级别赋值
                        $('#updateDiv input[name="disasterLevel"]').val(param.disasterLevel);

                        // 监听color颜色单选
                        form.on('radio(color)', function (data) {
                            $('#updateDiv input[name="levelName"]').val(disaster.chooseColorToLevel(data.value).name);
                            $('#updateDiv input[name="disasterLevel"]').val(data.value);
                        });
                    });
                    form.render();
                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitConfigUpdateBtn)", function(data){
                        data.field.id = param.id;
                        var icon = data.field.icon;
                        var iconIndex = (icon.lastIndexOf("\\")+1)||(icon.lastIndexOf("/")+1);
                        data.field.icon = icon.substring(iconIndex, icon.length);
                        // 数据提交到后台，通用方法
                        submitFile({
                            index: index
                            ,async: 'true'
                            ,url: '/client/disaster/update/level'
                            ,type: 'POST'
                            ,param: data.field
                            ,files: ['updateFile']
                            ,dataType: 'json'
                        });
                    });
                    // 触发表单按钮点击事件
                    $("#submitConfigUpdateBtn").click();
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