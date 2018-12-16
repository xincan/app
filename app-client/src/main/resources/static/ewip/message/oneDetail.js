
layui.config({
    base: '/client/layuiadmin/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    zTree: '/modules/zTree'
    ,disaster: '/modules/disaster'
});


layui.use(['table','form','element','zTree','laydate' , 'disaster'], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,$ = layui.$   			    // 引用layui的jquery
        ,element = layui.element
        ,zTree = layui.zTree
        ,laydate = layui.laydate
        ,disaster = layui.disaster;

    var active = {

        /**
         * 查询发布手段下拉列表
         * @param callback
         */
        "selectChannel": (callback) =>{
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
        }

        /**
         * 修改后重新刷新列表，curr: 1重新从第 1 页开始
         */
        ,"reloadTable": (param) => {
            table.reload('table', {
                page: {
                    curr: 1
                }
                ,where: { //设定异步数据接口的额外参数，任意设
                    channelCode: param.channelCode
                    ,name: param.name
                    ,messageId: $("#messageId").val()
            }
            });
        }

        /**
         * 统计渠道发布成功树柱状图
         */
        ,"channelColumnTotal": (id) => {
            var channelTotal = (data)=>{
                var option = {
                    title : {
                        text: disaster.chooseMessageToType($("#type").val()).name + "渠道发布统计",
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['总数','成功数']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            dataView : {show: false, readOnly: false},
                            magicType : {show: true, type: ['bar','line']},
                            restore : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [{
                        type : 'category',
                        data : data.title
                    }],
                    yAxis : [{
                        type : 'value'
                    }],
                    series : [{
                        name:'总数',
                        type:'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        data:data.total
                    },{
                        name:'成功数',
                        type:'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        data:data.success
                    }]
                };
                var chart = echarts.init(id,'walden');
                chart.setOption(option,true);
            };
            // 获取后台信息
            $.ajax({
                async:true
                ,type: "POST"
                ,data: {messageId: $("#messageId").val(), startTime: $("#startTime").val(), endTime: $("#endTime").val()}
                ,url: '/client/message/monitor/channel'
                ,dataType: 'json'
                ,success: function(json){
                    if(Object.keys(json).length == 0){
                        $("#column").empty().append("<div class='echarts-no-data'><span>暂无数据</span></div>");
                        return;
                    }else {
                        channelTotal(json);
                    }
                }
            });
        }

        /**
         * 格式化机构类型
         * @param d
         * @returns {string}
         */
        ,"statusFormat": (d) => {
            if(d.type == 0) return "<span class='layui-btn layui-btn-xs layui-btn-warm ewip-cursor-default'>成功</span>";
            if(d.type == 1) return "<span class='layui-btn layui-btn-normal layui-btn-xs ewip-cursor-default'>失败</span>";
        }
        /**
         * 列表信息统计
         * @param result
         */
        ,"initTableTotal": () => {
            console.log($("#channelCode").val());
            //展示已知数据
            table.render({
                id: 'table'
                ,elem: '#table'
                ,url:'/client/message/monitor/users'
                ,page:true
                ,even: true
                ,limits:[10,20,50,100]
                ,where: { //设定异步数据接口的额外参数，任意设
                    messageId: $("#messageId").val()
                }
                ,cols: [[
                    {type: 'checkbox'}
                    ,{type: 'numbers', title: '编号'}
                    ,{field: 'channelName', title: '渠道名称', sort: true}
                    ,{field: 'name', title: '终端名称', sort: true}
                    ,{field: 'code', title: '终端编码', sort: true}
                    ,{field: 'status', title: '接收状态', sort: true, templet: active.statusFormat}
                ]]
            });
        }
    };

    /**
     * 监听头部搜索
     */
    form.on('submit(search)', function(data){
        console.log(data);
        active.reloadTable(data.field);
    });

    /**
     * 初始化延迟加载
     */
    setTimeout(()=>{
        // 统计渠道发布成功树柱状图
        active.channelColumnTotal(document.getElementById("column"));
        // 统计数据列表
        active.initTableTotal();
        // 发布渠道下拉绑定
        active.selectChannel(function (result) {
            if(result!=null){
                for(var i = 0; i<result.length; i++){
                    $(".channel").append("<option value='"+result[i].code+"'>"+result[i].name+"</option>");
                }
            }
            form.render('select');
        });
    },200);


});