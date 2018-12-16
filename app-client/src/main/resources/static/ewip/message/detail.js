
layui.config({
    base: '/client/layuiadmin/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    zTree: '/modules/zTree'
    ,disaster: '/modules/disaster'
    ,index: '/lib/index' //相对于上述 base 目录的子目录
});


layui.use(['table','form','element','zTree', 'disaster'], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,$ = layui.$   			    // 引用layui的jquery
        ,element = layui.element
        ,zTree = layui.zTree
        ,disaster = layui.disaster;


    /**
     * 初始化加载地区
     */
    var initAreaTree =  zTree.async({
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
    var active = {
        /**
         * 数据回显渠道
         */
        "calBackChannelList": (result) => {
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
        ,"calBackAreaList": (result) => {
            if(result == null) return;
            result.forEach((area)=> {
                var node = initAreaTree.getNodeByParam("id",area.areaId, null);
                initAreaTree.checkNode(node,true,true);
            });
            // ztree禁用选择
            initAreaTree.expandAll(true);
            initAreaTree.transformToArray(initAreaTree.getNodes()).forEach((node)=>{
                initAreaTree.setChkDisabled(node, true);
            });
        }

        /**
         * 数据回显内容
         */
         ,"calBackContentList": (contents) => {
            if(contents == null) return;
            for(var key in contents){
                contents[key].forEach((con)=> {
                    var html = "";
                    if($(".warn-card-content-list > div").length == 0){
                        html += "<div class='layui-row layui-col-space5 warn-item_" + con.areaId + "' data-area-id='" + con.areaId + "'>";
                        html += "	<div class='layui-col-xs1 layui-col-md1 warn-content-title'>";
                        html += "		<div>" + con.areaName + "</div>";
                        html += "	</div>";
                        html += "	<div class='layui-col-xs11 layui-col-md11 warn-content-body'>";
                        html += "       <textarea type='text' autocomplete='off' class='layui-textarea' readonly='readonly' >" + con.content + "</textarea>";
                        html += "	</div>";
                        html += "</div>";
                        $(".warn-card-content-list").append(html);
                    }else{
                        $(".warn-card-content-list > div").each(function(){
                            var areaId = $(this).data("areaId");
                            if(areaId != con.areaId){
                                html += "<div class='layui-row layui-col-space5 warn-item_" + con.areaId + "' data-area-id='" + con.areaId + "'>";
                                html += "	<div class='layui-col-xs1 layui-col-md1 warn-content-title'>";
                                html += "		<div>" + con.areaName + "</div>";
                                html += "	</div>";
                                html += "	<div class='layui-col-xs11 layui-col-md11 warn-content-body'>";
                                html += "       <textarea type='text' autocomplete='off' class='layui-textarea' readonly='readonly' >" + con.content + "</textarea>";
                                html += "	</div>";
                                html += "</div>";
                                $(".warn-card-content-list").append(html);
                            }
                        });
                    }
                });
            }
        }

        /**
         * 数据回显群组
         */
        ,"calBackUserList": (channels, groups) => {
            if(channels == null && groups == null) return;
            // 先清除tab页所有内容
            $(".warn-tab .warn-tab-title, .warn-tab .warn-tab-content").empty();
            channels.forEach((channel)=> {
                // 追加预警内容tab选项卡
                element.tabAdd('warn-tab', {
                    title: channel.channelName
                    ,content: "<div class='ztree' id='group_" + channel.channelId + "'></div>" //支持传入html
                    ,id: channel.channelId
                });
                // 默认展开第一个tab页
                element.tabChange('warn-tab',channels[0].channelId);
                element.render();
            });

            for(var key in groups){
                var groupArray = groups[key];
                var nodes = [];
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
         * 数据回显群组
         */
        ,"calBackFileList": (files) => {
            if(files == null  || files.length == 0) return;
            // 如果是最先添加则显示文件表格
            if($(".warn-file-table").hasClass("layui-hide")){
                $(".warn-file-table").removeClass("layui-hide");
                // 3:隐藏初始化提示信息
                $(".warn-upload-msg").addClass("layui-hide");
            }
            files.forEach((file,index)=>{
                // 计算文件大小
                var s = (file.size/1024) > 1024 ? (file.size/1024/1024).toFixed(2) + "MB": (file.size/1024).toFixed(2) + "KB";
                // 拼接文件内容
                var html = "<tr>";
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
        ,"initPageMsg": ()=>{
            $.ajax({
                async:true
                ,type: "POST"
                ,data: {messageId: $("#messageId").val()}
                ,url: "/client/message/detail"
                ,dataType: 'json'
                ,success: function(json){
                    if(json.code == 200 && json.data != null){
                        var result = json.data;
                        // 回显标题
                        $(".basis input[name='title']").val(result.title);
                        // 回显发布时间
                        $(".basis input[name='sendTime']").val(result.sendTime);
                        // 回显发布时间
                        $(".basis input[name='type']").val( disaster.chooseMessageToType(result.type).name);
                        // 回显机构
                        $(".basis input[name='organizationName']").val(result.organizationName);
                        // 回显渠道
                        active.calBackChannelList(result.channel);
                        // 回显地区
                        active.calBackAreaList(result.area);
                        // 回显内容
                        active.calBackContentList(result.content);
                        // 回显受众
                        active.calBackUserList(result.channel, result.group);
                        // 回显文件
                        active.calBackFileList(result.files);
                    }
                }
            });
        }
    };

    $(".warn-file-table > tbody").on("click","tr > td > a", function () {

        window.location.href = "/client/message/download?url=" + $(this).data("url");

    });

    /**
     * tab选项卡前按钮移动操作
     */
    var tabIndex = 0;
    $(".warn-tab").on('click','.warn-tab-prev',function () {
        // title可视化宽度
        var width = $(".warn-tab-title").width();
        // 获取可视化区域li的个数，四舍五入
        var move = Math.round(width/95);
        if(tabIndex > 0){
            tabIndex--;
            var moveWidth = move * 95 * tabIndex;
            $(".warn-tab-title > li:nth-child(1)").css({"margin-left": -moveWidth});
        }
    });

    /**
     * tab选项卡后按钮移动操作
     */
    $(".warn-tab").on('click','.warn-tab-next',function () {
        // title可视化宽度
        var width = $(".warn-tab-title").width();
        // 获取可视化区域li的个数，四舍五入
        var move = Math.round(width/95);
        // li的总个数
        var count = $(".warn-tab-title > li").length;
        if(move * (tabIndex + 1) < count){
            tabIndex++;
            var moveWidth = move * 95 * tabIndex;
            $(".warn-tab-title > li:nth-child(1)").css({"margin-left": -moveWidth});
        }
    });

    $("#calBackBtn").bind("click", function () {
        element.tabDelete("/client/page/message/detail/" + $("#messageId").val());
        window.location.href="/client/page/message/list.html";
    });

    /**
     * 初始化加载项
     */
    active.initPageMsg();                       // 初始化页面加载信息
    element.tabChange('warn-tab', "choose-tab");// 默认展开第一个tab页
});