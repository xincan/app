
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
     * 格式化机构类型
     * @param d
     * @returns {string}
     */
    let typeFormat = function(d){
        if(d.type == 0) return "<span class='layui-btn layui-btn-xs layui-btn-warm ewip-cursor-default'>发布中心</span>";
        if(d.type == 1) return "<span class='layui-btn layui-btn-normal layui-btn-xs ewip-cursor-default'>预案单位</span>";
        if(d.type == 2) return "<span class='layui-btn layui-btn-normal layui-btn-xs ewip-cursor-default'>应急办</span>";
    };

    /**
     * 格式化机构类型
     * @param d
     * @returns {string}
     */
    let nameFormat = function(d){
        if(d.parentName == "") return "<span class='layui-btn layui-btn-xs layui-btn-warm ewip-cursor-default'>没有上级机构</span>";
        return d.parentName;
    };

    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/organization/select'
        ,page:true
        ,even: true
        ,height: 'full-165'
        ,limits:[5,10,20,50,100]
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'code', title: '机构编码', sort: true}
            ,{field: 'organizationName', title: '机构名称', sort: true}
            ,{field: 'parentName', title: '上级机构', sort: true, templet:nameFormat}
            ,{field: 'areaName', title: '所属地区', sort: true}
            ,{field: 'type', title: '机构类型',sort: true, templet: typeFormat}
            ,{title: '操&nbsp;&nbsp;作', width: 170, align:'center', toolbar: '#btnGroupOption'}
        ]]
    });

    /**
     * 初始化下拉树(地区)
     */
    selectTree.render({
        'id': 'searchAreaId'
        ,'url': '/client/tree/area'
        ,'isMultiple': false
        ,'isVerify': false
    });
    /**
     * 初始化下拉树(机构)
     */
    selectTree.render({
        'id': 'searchPId'
        ,'url': '/client/tree/organization'
        ,'isMultiple': false
        ,'isVerify': false
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
                organizationName: param == undefined ? '' : param.organizationName
                ,areaId: param == undefined ? '' : param.areaId
                ,pId: param == undefined ? '' : param.pId
            }
        });
    };

    /**
     * 自定义验证规则
     */
    form.verify({
        areaId: function (value) {
            if(value.length == 0) {
                $("#addAreaId .addAreaIdShow, #updateAreaId .updateAreaIdShow").css("border-color","red");
                return '请选择所属地区';
            }
        }
        ,type: function (value) {
            if(value == "") return "请选择机构类型";
        }
        ,organizationName: function(value){
            if(value.length == 0) return '请输入机构名称';
            if(value.length > 20) return '机构名称长度不能超过20位';

        }
        ,code: function (value) {
            if(value.length == 0) return '请输入机构编码';
            if(!(value >= 10000000000000 && value <= 99999999999999)) return '机构编码范围值为[10000000000000, 99999999999999]';
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
     * @type {{addBarBtn: 添加信息, deleteBarBtn: 批量删除信息, deleteOption: 删除单个信息, updateOption: 修改信息}}
     */
    let active = {
        /**
         * 工具条：添加机构信息
         */
        'addBarBtn': function(){
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 添加地区信息"
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
                        // 初始化下拉树(地区)
                        selectTree.render({
                            'id': 'addAreaId'
                            ,'url': '/client/tree/area'
                            ,'isMultiple': false
                        });
                        // 初始化下拉树(机构)
                        selectTree.render({
                            'id': 'addPId'
                            ,'url': '/client/tree/organization'
                            ,'isMultiple': false
                        });
                    });
                    form.render();

                }
                ,yes: function(index, layero){
                    //触发表单按钮点击事件后，立刻监听form表单提交，向后台传参
                    form.on("submit(submitAddBtn)", function(data){
                        // 数据提交到后台
                        submitServer({
                            index: index
                            ,type: 'POST'
                            ,param: data.field
                            ,url: '/client/organization/insert'
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
                layer.msg('请选中机构进行删除', {time: 2000});
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

            layer.confirm('确定删除这批机构？', function(index){
                // 数据提交到后台，通用方法
                submitServer({
                    index: index
                    ,type: 'POST'
                    ,param: {id: id.substring(1)}
                    ,url: '/client/organization/delete'
                });
            });
        }
        /**
         * 列表中：删除选中的机构信息
         * @param obj
         */
        ,'deleteOption': function (obj) {
            layer.confirm('确定删除该机构？', function(index){
                obj.del();
                // 数据提交到后台，通用方法
                submitServer({
                    index: index
                    ,param: null
                    ,type: 'DELETE'
                    ,url: '/client/organization/delete/' + obj.data.id,
                });
            });
        }
        /**
         * 列表中：修改机构信息
         * @param obj
         */
        ,'updateOption': function (obj) {
            let param = obj.data;
            //示范一个公告层
            layer.open({
                type: 1
                ,title: "<i class='layui-icon'>&#xe642;</i> 修改机构信息"
                ,area: ['600px','400px']
                ,shade: 0.3
                ,maxmin:true
                ,offset: '50px'
                ,btn: ['修改', '取消']
                ,content:"<div id='updateDiv' style='padding:20px 20px 0 20px'>adsfds</div>"
                ,success: function(layero,index){
                    // 获取模板，并将数据绑定到模板，然后再弹出层中渲染
                    laytpl(updatePop.innerHTML).render(param, function(html){
                        // 动态获取弹出层对象
                        $("#updateDiv").empty().append(html);
                        // 地区级别下拉框赋值
                        $("select[name='level']").val(param.level);
                        $("select[name='type']").val(param.type);
                        // 初始化下拉树(地区)
                        selectTree.render({
                            'id': 'updateAreaId'
                            ,'url': '/client/tree/area'
                            ,'isMultiple': false
                            ,'checkNodeId': param.areaId
                        });
                        // 初始化下拉树(机构)
                        selectTree.render({
                            'id': 'updatePId'
                            ,'url': '/client/tree/organization'
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
                        submitServer({
                            index: index
                            ,type: 'POST'
                            ,param: data.field
                            ,url: '/client/organization/update'
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