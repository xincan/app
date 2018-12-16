
layui.config({
    base: '/client/layuiadmin/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    zTree: '/modules/zTree'
    ,disaster: '/modules/disaster'
    ,index: '/lib/index' //相对于上述 base 目录的子目录
});


layui.use(['table','form','element','zTree'], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,$ = layui.$   			    // 引用layui的jquery
        ,element = layui.element
        ,zTree = layui.zTree;


    /**
     * 初始化加载地区
     */
    let initAreaTree =  zTree.async({
        id: "#areaTree",
        setting: {
            async:{
                enable:true,
                url: "/client/tree/area",
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
            }
        }
    });

    /**
     * 数据集中处理
     * @type {{calBackChannelList: calBackChannelList, calBackAreaList: calBackAreaList, calBackContentList: calBackContentList, calBackUserList: calBackUserList, calBackFileList: calBackFileList, initPageMsg: initPageMsg}}
     */
    let active = {

        /**
         * 流程转换
         * 流程：0：录入；1：审核；2：签发；3：应急办签发；4：发布；5：保存代发；6：驳回; 7：终止
         * @param flow
         */
        "parseFlow": flow => {
            if(flow == 0) return "录入";
            if(flow == 1) return "审核";
            if(flow == 2) return "签发";
            if(flow == 3) return "应急办签发";
            if(flow == 4) return "发布"
            if(flow == 5) return "保存代发";
            if(flow == 6) return "驳回";
            if(flow == 7) return "终止";
        }

        /**
         * 回显预警基础信息
         * @param result
         */
        ,"calBackWarnEditInfo": result => {
            // 回显发布机构
            $(".basis input[name='organizationName']").val(result.organizationName);
            // 回显标题
            $(".basis input[name='title']").val(result.title).attr("title", result.title);
            // 回显预警名称
            $(".basis input[name='disasterName']").val(result.disasterName);
            // 回显预警颜色
            $(".basis select[name='disasterColor']").val(result.disasterColor);
            // 回显预警级别
            $(".basis select[name='disasterLevel']").val(result.disasterLevel);
            // 预警信息类型
            $(".basis select[name='warnType']").val(result.warnType);
            // 回显发布时间
            $(".basis input[name='sendTime']").val(result.sendTime);
            // 回显预期发生时间
            $(".basis input[name='forecastTime']").val(result.forecastTime);
            // 回显生效时间
            $(".basis input[name='invalidTime']").val(result.invalidTime);
            // 回显政府应对措施
            $(".basis textarea[name='measure']").val(result.measure);
            // 回显防御指南
            $(".basis textarea[name='instruction']").val(result.instruction);
            // 回显预警图标
            $(".warn-icon-detial > img").attr("src","/client/"+result.icon).attr("title", result.disasterName);
        }

        /**
         * 数据回显渠道
         */
        ,"calBackChannelList": result => {
            $.ajax({
                async:true
                ,type: "POST"
                ,data: {type: 0}
                ,url: "/client/channel/list"
                ,dataType: 'json'
                ,success: function(json){
                    if(json.code == 200 && json.data != null){
                        var html ="";
                        json.data.forEach((currentValue)=> {
                            var cls = "";
                            result.forEach(function (value) {
                                if(currentValue.id == value.channelId){
                                    cls = "active";
                                    return;
                                }
                            });
                            html += "<div class='imgbox-back " + cls + "' style='cursor: default;' data-id='"+currentValue.id+"' data-title='"+currentValue.name+"' data-channel='"+currentValue.name+"' data-code='"+currentValue.code+"' >";
                            html += "   <img src='/client/"+currentValue.icon+"' alt='"+currentValue.name+"' />";
                            html += "<span>"+currentValue.name+"</span>";
                            html += "</div>";
                        });
                        $(".channel-list").empty().append(html);
                    }
                }
            });
        }

        /**
         * 数据回显地区
         */
        ,"calBackAreaList": result => {
            if(result == null) return;
            result.forEach((area)=> {
                let node = initAreaTree.getNodeByParam("id",area.areaId, null);
                initAreaTree.checkNode(node,true,true);
            });
            // zTree禁用选择
            initAreaTree.expandAll(true);
            initAreaTree.transformToArray(initAreaTree.getNodes()).forEach( node =>{
                initAreaTree.setChkDisabled(node, true);
            });
        }

        /**
         * 数据回显内容
         */
        ,"calBackContentList": result => {
            // 循环渠道
            result.channel.forEach(channel => {
                let html = "";
                html += "<div class='layui-row layui-col-space5'>";
                html += "	<div class='layui-col-xs9 layui-col-md9'>";
                html += "		<div class='layui-card warn-card-content'>";
                html += "			<div class='layui-card-header'><span>&nbsp;&nbsp;<i class='layui-icon warn-card-hader-icon'>&#xe618;</i>预警编辑</span></div>";
                html += "			<div  class='layui-card-body warn-card-content-list content_" + channel.channelId + "'>";
                // 循环地区
                result.area.forEach(area => {
                    html += "				<div class='layui-row layui-col-space5 warn-item_"+ channel.channelId + "_" + area.areaId + "'>";
                    html += "					<div class='layui-col-xs1 layui-col-md1 warn-content-title'>";
                    html += "						<div>" + area.areaName + "</div>";
                    html += "					</div>";
                    html += "					<div class='layui-col-xs11 layui-col-md11 warn-content-body'>";
                    html += "                       <textarea type='text' name='content_" + channel.channelId + "_" + area.areaId + "' autocomplete='off' readonly class='layui-textarea'></textarea>";
                    html += "					</div>";
                    html += "				</div>";
                });
                html += "			</div>";
                html += "		</div>";
                html += "	</div>";
                html += "	<div class='layui-col-xs3 layui-col-md3'>";
                html += "		<div class='layui-card warn-card-content'>";
                html += "			<div class='layui-card-header'><span>&nbsp;&nbsp;<i class='layui-icon layui-icon-tree warn-card-hader-icon'></i>" + channel.channelName+ "群组</span></div>";
                html += "			<div  class='layui-card-body warn-card-content-list'>";
                html += "				<div class='ztree' id='group_" + channel.channelId + "'></div>";
                html += "			</div>";
                html += "		</div>";
                html += "	</div>";
                html += "</div>"
                // 追加预警内容tab选项卡
                ,element.tabAdd('warn-tab', {
                    title: channel.channelName
                    ,content: html //支持传入html
                    ,id: channel.channelId
                });
                // 赋值预警内容
                let contents = result.content;
                for(let key in contents){
                    contents[key].forEach((obj)=> {
                        $(".warn-card-content .warn-content-body textarea[name='content_" + obj.channelId + "_" + obj.areaId + "']").val(obj.content);
                    });
                }
                // 删除tab id 为choose-tab的table页
                element.tabDelete("warn-tab", "choose-tab");
                // 默认展开第一个tab页
                element.tabChange('warn-tab', result.channel[0].channelId);
            });
            element.render();
        }

        /**
         * 数据回显群组
         */
        ,"calBackUserList": (channels, groups) => {
            if(channels == null && groups == null) return;
            for(let key in groups){
                let groupArray = groups[key];
                let nodes = [];
                groupArray.forEach((item)=> {
                    nodes.push({
                        id: item.userGroupId
                        ,name: item.userGroupName
                        ,pId: 0
                    });
                });
                zTree.sync({
                    id: '#group_'+key,
                    setting: {
                        data: {
                            simpleData: {
                                enable: true,
                                idKey: "id",
                                pIdKey: "pId",
                                rootPId: 0
                            }
                        }
                    },
                    data: nodes
                });
            }
        }

        /**
         * 数据回显文件
         */
        ,"calBackFileList": (files) => {
            if(files == null || files.length == 0) return;
            // 如果是最先添加则显示文件表格
            if($(".warn-file-table").hasClass("layui-hide")){
                $(".warn-file-table").removeClass("layui-hide");
                // 3:隐藏初始化提示信息
                $(".warn-upload-msg").addClass("layui-hide");
            }
            files.forEach((file,index)=>{
                // 计算文件大小
                let s = (file.size/1024) > 1024 ? (file.size/1024/1024).toFixed(2) + "MB": (file.size/1024).toFixed(2) + "KB";
                // 拼接文件内容
                let html = "<tr>";
                html += "   <td>" + (index+1) + "</td>";
                html += "   <td>" + file.name + "</td>";
                html += "   <td>" + s + "</td>";
                html += "   <td>" + file.name.substring(file.name.lastIndexOf(".")+1,file.name.length) + "</td>";
                html += "   <td><a class='layui-btn layui-btn-danger layui-btn-xs' src='/client"+file.url+"' data-url='"+file.url+"' data-file-class='warn-" + index + "'><i class='layui-icon layui-icon-delete'></i>下载</a></td>";
                html += "</tr>";
                //追加到文件列表
                $(".warn-file-table > tbody").append(html);
            });
        }

        /**
         * 初始化页面基础信息
         */
        ,"initPageMsg": () => {
            $.ajax({
                async:true
                ,type: "GET"
                ,data: {warnEditId: $("#warnEditId").val()}
                ,url: "/client/warn/option/detail"
                ,dataType: 'json'
                ,success: json => {
                    if(json.code == 200 && json.data != null){
                        let result = json.data;
                        // 回显预警基础信息
                        active.calBackWarnEditInfo(result);
                        // 回显渠道
                        active.calBackChannelList(result.channel);
                        // 回显地区
                        active.calBackAreaList(result.area);
                        // 回显内容
                        active.calBackContentList(result);
                        // 回显受众
                        active.calBackUserList(result.channel, result.group);
                        // 回显文件
                        active.calBackFileList(result.files);
                        form.render();
                    }
                }
            });
        }
        /**
         * 初始化加载流程信息
         */
        ,"initFlowMsg": () => {
            $.ajax({
                async:true
                ,type: "GET"
                ,data: {warnEditId: $("#warnEditId").val()}
                ,url: "/client/warn/option/select/flow/id"
                ,dataType: 'json'
                ,success: json => {
                    if(json.code == 200 && json.data != null){
                        let result = json.data, html = "";
                        result.forEach( flow => {
                            html += "<div class='ewip-timeline'></div>";
                            html += "<div class='timeline'>";
                            html += "	<div class='time'>" + flow.createTime + "</div>";
                            html += "	<div class='content'>";
                            html += "		<ul>";
                            html += "			<li>操作机构:</li><li>" + flow.organizationName + "</li>";
                            html += "			<li>操作人员:</li><li>" + flow.employeeName + "</li>";
                            html += "			<li>操作流程:</li><li>" + active.parseFlow(flow.flow) + "</li>";
                            html += "			<li>操作说明:</li><li>" + flow.advice + "</li>";
                            html += "		</ul>";
                            html += "	</div>";
                            html += "</div>";
                        });
                        html += "<div class='ewip-timeline'></div>";
                        $(".ewip-timeline-list").empty().append(html);
                    }
                }
            });
        }
    };

    /**
     * 文件下载
     */
    $(".warn-file-table > tbody").on("click","tr > td > a", function () {
        window.location.href = "/client/warn/edit/download?url=" + $(this).data("url");
    });

    /**
     * tab选项卡前按钮移动操作
     */
    let tabIndex = 0;
    $(".warn-tab").on('click','.warn-tab-prev',function () {
        // title可视化宽度
        let width = $(".warn-tab-title").width();
        // 获取可视化区域li的个数，四舍五入
        let move = Math.round(width/95);
        if(tabIndex > 0){
            tabIndex--;
            let moveWidth = move * 95 * tabIndex;
            $(".warn-tab-title > li:nth-child(1)").css({"margin-left": -moveWidth});
        }
    });

    /**
     * tab选项卡后按钮移动操作
     */
    $(".warn-tab").on('click','.warn-tab-next', () => {
        // title可视化宽度
        let width = $(".warn-tab-title").width();
        // 获取可视化区域li的个数，四舍五入
        let move = Math.round(width/95);
        // li的总个数
        let count = $(".warn-tab-title > li").length;
        if(move * (tabIndex + 1) < count){
            tabIndex++;
            let moveWidth = move * 95 * tabIndex;
            $(".warn-tab-title > li:nth-child(1)").css({"margin-left": -moveWidth});
        }
    });

    $("#calBackBtn").bind("click", () => {
        element.tabDelete("/client/page/message/detail/" + $("#messageId").val());
        window.location.href="/client/page/message/list.html";
    });

    /**
     * 预警流程（向左）
     */
    let len = 0;
    $(".ewip-timeline-detial").on("click",".ewip-timeline-left",()=>{
        let ml = parseInt($(".ewip-timeline-list").css("margin-left"));
        if(len == 0 && ml==0) len = $(".ewip-timeline-list > .timeline").length;
        if(5%len == 5){
            len = len - 5;
            let move = ml - (5 * (200+12));
            $(".ewip-timeline-list").animate({ "margin-left": move + "px" }, 1000);
            if(len < 5) len = 0;
        }
    });

    /**
     * 预警流程（向右）
     */
    $(".ewip-timeline-detial").on("click",".ewip-timeline-right",()=>{
        let move = parseInt($(".ewip-timeline-list").css("margin-left")) + (5 * (200+12));
        if(move <= 0){
            $(".ewip-timeline-list").animate({ "margin-left": move + "px" }, 1000);
        }
    });

    /**
     * 初始化加载项
     */
    active.initPageMsg();                       // 初始化页面加载信息
    active.initFlowMsg();                       // 初始化加载流程信息
    element.tabChange('warn-tab', "choose-tab");// 默认展开第一个tab页
});