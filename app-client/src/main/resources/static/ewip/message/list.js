
layui.config({
    base: '/client/layuiadmin/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    zTree: '/modules/zTree',
    selectTree: '/modules/selectTree' //如果 mymod.js 是在根目录，也可以不用设定别名
    ,index: '/lib/index' //相对于上述 base 目录的子目录
});

layui.use(["table","form","laytpl","layer","selectTree","index"], function(){
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
    let typeFormat = function(d){

        if(d.type == 0) return "<span class='layui-btn layui-btn-danger layui-btn-xs ewip-cursor-default'>短期预报</span>";
        if(d.type == 1) return "<span class='layui-btn layui-btn-warm layui-btn-xs ewip-cursor-default'>中期预报</span>";
        if(d.type == 2) return "<span class='layui-btn layui-btn-normal layui-btn-xs ewip-cursor-default'>长期预报</span>";
        if(d.type == 3) return "<span class='layui-btn layui-btn-xs ewip-cursor-default'>气象专题专报</span>";
        if(d.type == 4) return "<span class='layui-btn layui-btn-disabled layui-btn-xs ewip-cursor-default'>重大气象专题专报</span>";
    };

    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/message/select'
        ,page:true
        ,even: true
        ,height: 'full-165'
        ,limits:[10,20,50,100]
        ,cols: [[
            {type: 'checkbox'}
            ,{type: 'numbers', title: '编号'}
            ,{field: 'title', title: '地区编码', sort: true}
            ,{field: 'type', title: '业务类型', sort: true, templet: typeFormat}
            ,{field: 'organizationName', title: '机构名称'}
            ,{field: 'sendTime', title: '发布时间',sort: true}
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
                title: param == undefined ? '' : param.title
                ,type: param == undefined ? '' : param.type
            }
        });
    };

    /**
     * 统一按钮操作对象
     * @type {{addBtn: 添加信息, deleteBtn: 批量删除信息, deleteOption: 删除单个信息, updateOption: 修改信息}}
     */
    let active = {
        /**
         * 列表中：删除选中的地区信息
         * @param obj
         */
        'detailOption': (obj) => {
            var index = layer.open({
                title: "<i class='layui-icon layui-icon-form'></i>信息详情"
                ,type: 2
                ,content: "/client/page/message/detail/" + obj.data.id
                ,success: (layero, index) => {
                    setTimeout( () => {
                        layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500);
                }
            });
            layer.full(index);
        }
        /**
         * 列表中：删除选中的地区信息
         * @param obj
         */
        ,"totalOption": (obj) => {
            var index = layer.open({
                title: "<i class='layui-icon layui-icon-form'></i>信息统计"
                ,type: 2
                ,anim: 1
                ,content: "/client/page/message/oneDetail?id=" + obj.data.id + "&type=" + obj.data.type
                ,success: (layero, index) => {
                    setTimeout( () => {
                        layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500);
                }
            });
            layer.full(index);
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

});