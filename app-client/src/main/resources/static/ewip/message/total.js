
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

    /**
     * 初始化发布时间
     */
    laydate.render({
        elem: '#startTime'
        ,type: 'date'
        ,theme: 'molv'
        ,value: new Date()
        ,format: 'yyyy-MM-dd'
    });
    /**
     * 初始化预计发生时间
     */
    laydate.render({
        elem: '#endTime'
        ,type: 'date'
        ,value: new Date()
        ,theme: 'molv'
        ,format: 'yyyy-MM-dd'
    });

    var active = {

        /**
         * 统计发布渠道占比饼状图
         */
        "channelPieTotal":function(id){
            var typeTotal = (data) =>{
                var option = {
                    title : {
                        text: '业务类型发布比率统计',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {d} %"
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: false, readOnly: false},// 数据按钮
                            restore : {show: false},// 刷新按钮
                            saveAsImage : {show: false},// 保存按钮
                            magicType : {
                                show: true,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '50%',
                                        funnelAlign: 'left',
                                        max: 1548
                                    }
                                }
                            }
                        }
                    },
                    calculable : true,
                    noDataLoadingOption:{
                        effect:"bubble",
                        text:"暂无数据",
                        effectOption:{
                            effect:{
                                n:0
                            }
                        },
                        textStyle:{
                            fontSize:32,
                            fontWeight:'bold'
                        }
                    },
                    series : [{
                        name:'业务类型',
                        type:'pie',
                        radius : '55%',//饼图的半径大小
                        center: ['50%', '50%'],//饼图的位置
                        data:data,
                        label: {
                            normal: {
                                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}条  {per|{d}%}  ',
                                backgroundColor: '#FFF',
                                borderColor: '#2f9688',
                                borderWidth: 0.5,
                                borderRadius: 4,
                                rich: {
                                    a: {
                                        color: '#FFF',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    abg: {
                                        backgroundColor: '#2f9688',
                                        width: '100%',
                                        align: 'right',
                                        height: 22,
                                        borderRadius: [4, 4, 0, 0]
                                    },
                                    hr: {
                                        borderColor: '#2f9688',
                                        width: '100%',
                                        borderWidth: 0.5,
                                        height: 0
                                    },
                                    b: {
                                        fontSize: 16,
                                        lineHeight: 33
                                    },
                                    per: {
                                        color: '#FFF',
                                        backgroundColor: '#2f9688',
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }
                            }
                        },
                    }]
                };
                var chart = echarts.init(id,'walden');
                chart.setOption(option,true);
                chart.on("click", (param)=>{
                    var data = param.data;
                    //点击扇形区域查询柱状图
                    active.channelColumnTotal(document.getElementById("column"), data.type, data.name);
                });
            };
            // 获取后台信息
            $.ajax({
                async:true
                ,type: "POST"
                ,data: {startTime: $("#startTime").val(), endTime: $("#endTime").val()}
                ,url: '/client/message/monitor/type'
                ,dataType: 'json'
                ,success: function(json){
                    if(json.length == 0){
                        $("#pie").empty().append("<div class='echarts-no-data'><span>暂无数据</span></div>");
                        $("#pie").removeAttr("_echarts_instance_");
                        return;
                    }else {
                        typeTotal(json);
                    }
                }
            });
        }

        /**
         * 统计渠道发布成功树柱状图
         */
        ,"channelColumnTotal": (id, type,title) => {
            var title = title==undefined ? "一键发布业务类型" : title;
            var channelTotal = (data)=>{
                var option = {
                    title : {
                        text: title + '渠道发布统计',
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
                            restore : {show: false},
                            myTool1: {
                                show: true,
                                title: '刷新',
                                icon: 'image://../../images/restore.png',
                                onclick: function (){
                                    // 自定义刷新
                                    active.channelColumnTotal(document.getElementById("column"));
                                }
                            },
                            saveAsImage : {show: false}
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
                ,data: {type: type!=undefined?type:null, startTime: $("#startTime").val(), endTime: $("#endTime").val()}
                ,url: '/client/message/monitor/channel'
                ,dataType: 'json'
                ,success: function(json){
                    if(Object.keys(json).length == 0){
                        $("#column").empty().append("<div class='echarts-no-data'><span>暂无数据</span></div>");
                        $("#column").removeAttr("_echarts_instance_");
                        return;
                    }else {
                        channelTotal(json);
                    }
                }
            });
        }

        /**
         * 列表信息统计
         * @param result
         */
        ,"initTableTotal": () => {
            //展示已知数据
            table.render({
                id: 'table'
                ,elem: '#table'
                ,url:'/client/message/monitor/list'
                ,page:true
                ,even: true
                ,limits:[10,20,50,100]
                ,where: { //设定异步数据接口的额外参数，任意设
                    startTime: $("#startTime").val()
                    ,endTime: $("#endTime").val()
                }
                ,cols: [[
                    {type: 'checkbox'}
                    ,{type: 'numbers', title: '编号'}
                    ,{field: 'channelName', title: '渠道名称', sort: true}
                    ,{field: 'total', title: '总数', sort: true}
                    ,{field: 'success', title: '成功数', sort: true}
                    ,{field: 'fail', title: '失败数',sort: true}
                ]]
            });
        }
    };

    /**
     * 监听头部搜索
     */
    form.on('submit(search)', function(data){
        // 统计发布渠道占比饼状图
        active.channelPieTotal(document.getElementById("pie"));
        // 统计渠道发布成功树柱状图
        active.channelColumnTotal(document.getElementById("column"));
        // 统计数据列表
        table.reload('table', {
            page: {
                curr: 1
            },
            where: { //设定异步数据接口的额外参数，任意设
                startTime: data.field.startTime == undefined ? '' : data.field.startTime
                ,endTime: data.field.endTime == undefined ? '' : data.field.endTime
            }
        });
    });

    // 统计发布渠道占比饼状图
    active.channelPieTotal(document.getElementById("pie"));
    // 统计渠道发布成功树柱状图
    active.channelColumnTotal(document.getElementById("column"));
    // 统计数据列表
    active.initTableTotal();

});