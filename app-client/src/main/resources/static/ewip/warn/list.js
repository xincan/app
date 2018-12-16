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
        ,disaster = layui.disaster
        ,employee = layui.sessionData("ewip").employee; // 当前登录用户信息

    /**
     * 图片格式化
     * @param d
     * @returns {string}
     */
    let iconFormat = d => {
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
    let colorFormat = d => {
        let color = "";
        if(d.disasterColor == 0) color = "red";
        if(d.disasterColor == 1) color = "orange";
        if(d.disasterColor == 2) color = "yellow";
        if(d.disasterColor == 3) color = "blue";
        return "<span style='color:" + color + "'>" + disaster.color(d.disasterColor) + "[" + disaster.level(d.disasterLevel) + "]" + "</span>";
    };

    /**
     * （预警）预警类型：
     * [Alert（首次）,Update（更新）,Cancel（解除）,Ack（确认）,Error（错误）]，目前只采用“Alert”“Update”“Cancel”三个枚举值，其余枚举值保留，暂不使用。
     * @param d
     * @returns {string}
     */
    let warnTypeFormat = d => {
        if(d.warnType=="Actual") return "实际";
        if(d.warnType=="Exercise") return "演练";
        if(d.warnType=="Test") return "测试";
        if(d.warnType=="Draft") return "草稿";
    };

    /**
     * （预警）信息类型：
     * [Actual（实际）,Exercise（演练）,Test（测试）,Draft（草稿）],目前取值仅使用“Actual”和“Test”，其中 “Test”可用于发布测试预警， Exercise和Draft暂不使用
     * @param d
     * @returns {string}
     */
    let msgTypeFormat = d =>{
        if(d.msgType=="Alert") return "首次";
        if(d.msgType=="Update") return "更新";
        if(d.msgType=="Cancel") return "解除";
        if(d.msgType=="Ack") return "确认";
        if(d.msgType=="Error") return "错误";
    };

    /**
     * 流程状态：
     * 0：录入；1：审核；2：签发；3：应急办签发；4：发布；5：保存代发；6：驳回; 7：终止
     * @param d
     * @returns {string}
     */
    let flowFormat = d => {
        if(d.flow == 0) return "录入";
        if(d.flow == 1) return "审核";
        if(d.flow == 2) return "签发";
        if(d.flow == 3) return "应急办签发";
        if(d.flow == 4) return "发布"
        if(d.flow == 5) return "保存代发";
        if(d.flow == 6) return "驳回";
        if(d.flow == 7) return "终止";
    };

    /**
     * 发布状态：
     * 0：未发布；1：已发布；2：解除；
     * @param d
     * @returns {string}
     */
    let statusFormat = d => {
        if(d.status==0) return "未发布";
        if(d.status==1) return "已发布";
        if(d.status==2) return "解除";
    };

    /**
     * 加载表格
     */
    table.render({
        id: 'table'
        ,elem: '#table'
        ,url:'/client/warn/edit/select'
        ,page:true
        ,even: true
        ,height: 'full-125'
        ,limits:[5,10,20,50,100]
        ,cols: [[
            // {type: 'checkbox'}
            {type: 'numbers', title: '编号'}
            ,{field: 'icon', title: '预警图标', width:100, align:'center', sort: true, templet:iconFormat}
            ,{field: 'title', title: '预警标题',width:300, sort: true}
            ,{field: 'disasterName', title: '预警名称', align:'center', sort: true}
            ,{field: 'disasterColor',width:160, title: '预警颜色/级别', align:'center', sort: true, templet:colorFormat}
            ,{field: 'warnType',  title: '预警类型', align:'center', sort: true, templet: warnTypeFormat}
            ,{field: 'msgType',  title: '信息类型', align:'center', sort: true, templet: msgTypeFormat}
            ,{field: 'status',   title: '流程状态', align:'center', templet: flowFormat}
            ,{field: 'status',   title: '发布状态', align:'center', templet: statusFormat}
            ,{field: 'createTime', width:160, align:'center', title: '操作时间'}
            ,{title: '操&nbsp;&nbsp;作', width: 150, align:'center', toolbar: '#btnGroupOption'}
        ]]
    });

    /**
     * 修改后重新刷新列表，curr: 1重新从第 1 页开始
     */
    let reloadTable = function (param) {
        console.log(param);
        table.reload('table', {
            page: { curr: 1 },
            where: { //设定异步数据接口的额外参数，任意设
                disasterName: param == undefined ? '' : param.disasterName
                ,disasterColor: param == undefined ? '' : param.disasterColor
                ,disasterLevel: param == undefined ? '' : param.disasterLevel
            }
        });
    };

    /**
     * 统一按钮操作对象
     * @type {{historyOption: historyOption, resendOption: resendOption}}
     */
    let active = {
        /**
         * 列表中：预警追溯操作
         * @param obj
         */
        historyOption: obj => {
            let index = layer.open({
                title: "<i class='layui-icon layui-icon-form'></i>预警追溯"
                ,type: 2
                ,content: "/client/page/warn/history/" + obj.data.id
                ,success: (layero, index) => {
                    setTimeout(() => {
                        layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500);
                }
            });
            layer.full(index);
        }
        /**
         * 重新发送：跳转到预警编辑界面
         * @param obj
         */
        ,resendOption: obj => {
            let index = layer.open({
                title: "<i class='layui-icon layui-icon-form'></i>预警编辑"
                ,type: 2
                ,content: "/client/page/warn/resend/" + obj.data.id
                ,success: (layero, index) => {
                    setTimeout(() => {
                        layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500);
                },end: () => {
                    reloadTable(); // 刷新列表
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

    /**
     * 监控表头工具条按钮事件
     */
    $('.tableBar .layui-btn').on('click', function(){
        let type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});