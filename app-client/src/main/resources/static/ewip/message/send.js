layui.config({
    base: '/client/layuiadmin/modules/'
}).extend({
    zTree: 'zTree'
    ,ajaxFileUpload: 'ajaxFileUpload'
    ,disaster: 'disaster'
});

layui.use(['table','form','laydate','element','laytpl','layer','zTree', 'ajaxFileUpload','disaster'], function(){
    let table = layui.table			// 引用layui表格
        ,form = layui.form			// 引用layui表单
        ,laytpl = layui.laytpl		// 引用layui模板引擎
        ,layer = layui.layer		// 引用layui弹出层
        ,$ = layui.$   			// 引用layui的jquery
        ,element = layui.element
        ,laydate = layui.laydate
        ,zTree = layui.zTree
        ,ajaxFileUpload = layui.ajaxFileUpload
        ,disaster = layui.disaster
        ,employee = layui.sessionData("ewip").employee; // 当前登录用户信息


    /**
     * 自定义验证规则
     */
    form.verify({
        title: function(value){
            if(value.length == 0) return '请输入标题';
        }
        ,type: function (value) {
            if(value.length == 0) return "请选择业务类型";
        }
        ,sendTime: function (value) {
            if(value.length == 0) return "请选择发布时间";
        }
        ,content: function (value) {
            if(value.length == 0) return "请输入【"+disaster.chooseMessageToType(active.type).name +"】信息内容";
        }
    });

    var active = {
        /**
         * 业务类型
         */
        "type":""

        /**
         * 渠道对应受众树加载
         * @param option
         */
        ,"channelToUserGroup": function (option) {
            zTree.async({
                id: '#group_'+option.channelId,
                setting: {
                    async:{
                        enable:true,
                        url: '/client/tree/user/group/count',
                        autoParam:["id"],
                        otherParam: { "areaId":option.areaId, "channelId":option.channelId},
                        dataType:"json",
                        dataFilter:function (treeId, parentNode, responseData) {
                            if(responseData!=null){
                                for(var i = 0; i<responseData.length; i++){
                                    responseData[i].checked = true;
                                }
                            }
                            return responseData;
                        }
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
                        onClick:null,
                        onCheck:null
                    }
                }
            });
        }
        /**
         * 发送内容拼接
         * @param param
         */
        ,"setContent": function (result) {
            // 判断是否有提示信息，如果有则删除
            if($(".warn-card-content-list .warn-content-skip").length > 0) $(".warn-card-content-list .warn-content-skip").remove();
            var html = "";
            // 循环地区
            result.areas.forEach(function (area) {
                html += "<div class='layui-row layui-col-space5 warn-item_" + area.areaId+ "'>";
                html += "	<div class='layui-col-xs1 layui-col-md1 warn-content-title'>";
                html += "		<div>" + area.areaName + "</div>";
                html += "	</div>";
                html += "	<div class='layui-col-xs11 layui-col-md11 warn-content-body'>";
                html += "       <textarea type='text' name='content_" + area.areaId + "' lay-verify='content' placeholder='请输入预警内容' autocomplete='off' class='layui-textarea'></textarea>";
                html += "	</div>";
                html += "</div>";
            });
            $(".warn-card-content-list").append(html);
        }

        /**
         * 动态加载渠道、地区对应的受众
         * @param result
         */
        ,"setGroupUsers":function (result) {
            result.channels.forEach(function (channel) {
                // 追加预警内容tab选项卡
                element.tabAdd('warn-tab', {
                    title: channel.channelName
                    ,content: "<div class='ztree' id='group_" + channel.channelId + "'></div>" //支持传入html
                    ,id: channel.channelId
                });
                // 删除tab页提示信息
                element.tabDelete("warn-tab","choose-tab");
                // 默认展开第一个tab页
                element.tabChange('warn-tab',result.channels[0].channelId);
                // 动态添加渠道地区对应的受众（根据地区和渠道查询）
                active.channelToUserGroup({
                    areaId: function () {
                        var id = "";
                        for (let item of result.areas) {
                            id += "," + item.areaId;
                        }
                        return id.substring(1);
                    }(),
                    organizationId: result.organizationId,
                    channelId: channel.channelId
                });
            });
        }
        /**
         * 勾选地区追加预警内容
         * 如果result.checked == true,则添加，否则删除
         * @param result
         */
        ,"setAreaWarnContent":function (result) {
            if(result.checked == false){
                var area = result.areas[0];
                $(".warn-item_" + area.areaId).remove();
                // 如果当前地区节点取消勾选，则删除指定该地区对应所有渠道的预警内容删除
                result.channels.forEach(function (channel) {
                    // 获取每个渠道对应的受众树
                    var userGroupZtree = zTree.getZTree("group_" + channel.channelId)
                    , remove = [];
                    // 获取当前渠道下全部受众节点，如果取消勾选地区，则将当前地区、渠道对应的受众删除
                    userGroupZtree.getNodes().forEach(function (item) {
                        if(area.areaId == item.areaId && item.channelId == channel.channelId) remove.push(item);
                    });
                    for(var i = 0; i<remove.length; i++) userGroupZtree.removeNode(remove[i]);
                });
            }else{
                // 如果tab页提示信息存在，说明tab页中没有渠道标题，则添加渠道tab页，同时根据渠道地区拼接预警内容和受众群组
                // 否则说明之前选中了渠道和地区，则只追加改选中地区对应的预警内容和受众群组
                if($(".warn-card-content-list .warn-content-skip").length > 0){
                    // 删除tab页提示信息
                    element.tabDelete("warn-tab","choose-tab");
                    // 拼接预警内容
                    active.setContent(result);
                    // 拼接预警内容
                    active.setGroupUsers(result);
                }else{
                    var html = "";
                    // 循环地区 预警内容追加
                    result.areas.forEach(function (area) {
                        html += "<div class='layui-row layui-col-space5 warn-item_" + area.areaId+ "'>";
                        html += "	<div class='layui-col-xs1 layui-col-md1 warn-content-title'>";
                        html += "		<div>" + area.areaName + "</div>";
                        html += "	</div>";
                        html += "	<div class='layui-col-xs11 layui-col-md11 warn-content-body'>";
                        html += "       <textarea type='text' name='content_" + area.areaId + "' lay-verify='content' placeholder='请输入预警内容' autocomplete='off' class='layui-textarea'></textarea>";
                        html += "	</div>";
                        html += "</div>";
                        $(".warn-card-content-list").append(html);
                    });

                    // 循环渠道
                    result.channels.forEach(function (channel) {
                        // 追加受众树
                        $.ajax({
                            async:true
                            ,type: "POST"
                            ,data: {
                                "areaId":function () {
                                    var id = "";
                                    for (let item of result.areas) {
                                        id += "," + item.areaId;
                                    }
                                    return id.substring(1);
                                },
                                "organizationId": result.organizationId,
                                "channelId":channel.channelId
                            }
                            ,url: '/client/tree/user/group/count'
                            ,dataType: 'json'
                            ,success: function(json){
                                // 对其每个渠道做受众追加
                                if(json != null){
                                    for(var i = 0; i<json.length; i++){
                                        json[i].checked = true;
                                    }
                                    var userGroupZtree = zTree.getZTree("group_" + channel.channelId);
                                    userGroupZtree.addNodes(null, json);
                                }
                            }
                        });
                    });
                }
                element.render();
            }
        }
        /**
         * 渠道单击事件
         * 判断active选中样式是否存在
         * 如果存在：已经选中，否则没有选中
         * @param obj
         */
        ,"channelOneClick": function (obj) {
            // 判断业务类型是否选中，如果没有选中则提示先选中业务类型
            if(active.type==""){
                layer.msg("请先选择业务类型", {time: 2000});
                $(".channel-list .imgbox.active").removeClass("active");
                return false;
            }
            // 获取渠道id和渠道名称
            var channelId = $(obj).data("id"), channelName = $(obj).data("title");
            // 判断渠道是否选中
            if ($(obj).hasClass("active")) {
                // 获取选中渠道
                var param = {
                    "organizationId": employee.organizationId
                    /**
                     * 获取选中渠道
                     */
                    ,"channels": [{channelId:channelId, channelName:channelName}]
                    /**
                     * 获取选中地区
                     */
                    , "areas": function () {
                        var area = [];
                        initAreaTree.getCheckedNodes().forEach(function (item) {
                            area.push({
                                areaId: item.id,
                                areaName: item.name
                            });
                        });
                        return area;
                    }()
                };
                active.setGroupUsers(param);
            }else {
                // 取消渠道勾选时，同时删除对应的tab页渠道
                element.tabDelete("warn-tab", channelId);
            }
        }

        /**
         * 地区选择
         */
        ,"areaCheck": function (event, treeId, treeNode) {
            // 判断渠道、预警是否选中，如果没有选中渠道则先选择渠道、如果预警没有选中则选择预警，做拦截
            var channel = $(".channel-list .imgbox.active");
            // 判断渠道是否选中
            if(channel.length == 0){
                initAreaTree.checkNode(treeNode, true, true);
                layer.msg("请先选择渠道", {time: 2000});
                return false;
            }
            // 判断至少选中一个地区
            var areaTree = zTree.getZTree(treeId);
            var nodes = areaTree.getCheckedNodes(true);
            if(nodes.length == 0){
                initAreaTree.checkNode(treeNode, true, true);
                layer.msg("请至少选中一个地区", {time: 2000});
                return false;
            }
            // 判断当前节点是否选中
            var checked = treeNode.getCheckStatus().checked;
            // 拼接参数
            var param = {
                "treeId":treeId
                ,"checked":checked
                ,"channels": function () {
                    var cId = [];
                    $(channel).each(function () {
                        cId.push({
                            channelId: $(this).data("id"),
                            channelName: $(this).data("title")
                        });
                    }) ;
                    return cId;
                }()
                ,"areas": [{
                    areaId: treeNode.id,
                    areaName: treeNode.name
                }]
            };
            active.setAreaWarnContent(param);
        }
        /**
         * 预警内容没有时提示，通常是点击取消渠道全选和，地区没有勾选时回填提示信息
         * @param param
         * @returns {string}
         */
        ,"defaultWarnMsg": function (param) {
            var html = "<div class='warn-content-skip'>"+param.msg+"</div>";
            // 追加预警内容tab选项卡
            element.tabAdd('warn-tab', {
                title: param.title
                ,content: html //支持传入html
                ,id: param.id
            });
            // 默认展开第一个tab页
            element.tabChange('warn-tab', param.id);
            element.render();
        }
    };

    /**
     * 初始化页面基础信息
     */
    var initPageMsg = function(){
        $(".basis input[name='organizationName']").val(employee.organizationName);
        $(".basis input[name='organizationCode']").val(employee.organizationCode);
    };

    /**
     * 初始化发布时间
     */
    laydate.render({
        elem: '#sendTime'
        ,type: 'datetime'
        ,theme: 'molv'
        ,value: new Date()
        ,format: 'yyyy-MM-dd HH:mm:ss'
    });


    /**
     * 初始化加载群组树
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
            },
            callback:{
                onClick:null,
                onCheck:active.areaCheck
            }
        }
    });

    /**
     * 初始化加载渠道
     */
    var initChannelList = function(){
        $.ajax({
            async:true
            ,type: "POST"
            ,data: {type: 0}
            ,url: "/client/channel/list"
            ,dataType: 'json'
            ,success: function(json){
                if(json.code == 200 && json.data != null){
                    // var html ="";
                    // json.data.forEach(function (currentValue, index, arr) {
                    //     html += "<div class='imgbox' data-id='"+currentValue.id+"' data-title='"+currentValue.name+"' data-channel='"+currentValue.name+"' data-code='"+currentValue.code+"' >";
                    //     html += "   <img src='/client/"+currentValue.icon+"' alt='"+currentValue.name+"' />";
                    //     html += "<span>"+currentValue.name+"</span>";
                    //     html += "</div>";
                    // });
                    // $(".channel-list").empty().append(html);

                    let html ="";
                    json.data.forEach(function (currentValue, index, arr) {
                        html += "<div class='"+(currentValue.status == 1 ? "imgbox" : "imgbox-gray")+"' data-id='"+currentValue.id+"' data-title='"+currentValue.name+"' data-channel='"+currentValue.name+"' data-code='"+currentValue.code+"' >";
                        html += "   <img class='"+(currentValue.status == 0 ? "gray" : "")+"' src='/client/"+currentValue.icon+"' title='"+(currentValue.status == 0 ? currentValue.name+"渠道未部署" : currentValue.name)+"' />";
                        html += "<span>"+currentValue.name+"</span>";
                        html += "</div>";
                    });
                    $(".channel-list").empty().append(html);

                }
            }
        });
    };

    /**
     * 渠道全选、反选
     */
    $(".channel-option").on("click", "div > span", function(element) {
        var text = $(this).text(),
            event = $(this).data("event");

        if(active.type == ""){
            layer.msg("请先选择业务类型", {time: 2000});
            return false;
        }

        if(text == '全选'){
            // 给所有渠道添加选中样式
            $("." + event + " .imgbox").addClass("active");
            // 获取选中渠道
            var param = {
                /**
                 * 获取选中渠道
                 */
                "channels": function () {
                    var cId = [];
                    $("." + event + " .imgbox").each(function () {
                        cId.push({
                            channelId:$(this).data("id"),
                            channelName: $(this).data("title")
                        });
                    });
                    return cId;
                }()
                /**
                 * 获取选中地区
                 */
                ,"areas": function () {
                    var area = [];
                    initAreaTree.getCheckedNodes().forEach(function (item) {
                        area.push({
                            areaId: item.id,
                            areaName: item.name
                        });
                    });
                    return area;
                }()
            };
            // 清除tab页所有内容
            $(".warn-tab .warn-tab-title, .warn-tab .warn-tab-content").empty();
            // 动态追加群组树
            active.setGroupUsers(param);
        }else{
            // 1：取消渠道勾选
            $("." + event + " .imgbox").removeClass("active");

            // 2：清空内容回填提示信息
            $(".warn-card-content-list").empty().append("<div class='layui-col-xs12 layui-col-md12 warn-content-skip'>请选择业务类型</div>");

            // 3：清除tab页所有内容
            $(".warn-tab .warn-tab-title, .warn-tab .warn-tab-content").empty();
            // 拼回默认提示
            active.defaultWarnMsg({id:'choose-tab',title:'温馨提示',msg:'请选择渠道'});
        }
    });
    /**
     * 渠道点击单选、取消选择
     */
    $(".channel-list").on("click", ".imgbox", function(element) {
        // 追加或删除样式
        if($(this).hasClass("active")){
            if($(".channel-list .imgbox.active").length == 1){
                layer.msg("请至少选择一个渠道", {time: 2000});
                return false;
            }
            $(this).removeClass("active");
        }else{
            $(this).addClass("active");
        }
        // 调用渠道点击事件业务
        return active.channelOneClick($(this));
    });

    /**
     * 文件上传
     */
    $(".fileUpload, .warn-upload-msg").on("click", function () {
        // 文件唯一标志
        var index = new Date().getTime();
        // 1:拼接文件文本框
        $(".warn-file-list").append("<input type='file' id='warn-"+index+"' name='warnFile' class='warn-"+index+"' data-file-index='"+index+"'>");
        // 2: 触发文件文本框
        $(".warn-file-list > .warn-"+index).click().change(function () {
            // 如果是最先添加则显示文件表格
            if($(".warn-file-table").hasClass("layui-hide")){
                $(".warn-file-table").removeClass("layui-hide");
                // 3:隐藏初始化提示信息
                $(".warn-upload-msg").addClass("layui-hide");
            }
            // 获取选中文件信息
            var file = $(this)[0].files[0], size = file.size;
            // 计算文件大小
            var s = (size/1024) > 1024 ? (file.size/1024/1024).toFixed(2) + "MB": (file.size/1024).toFixed(2) + "KB";
            // 拼接文件内容
            var html = "<tr>";
            html += "   <td>" + index + "</td>";
            html += "   <td>" + file.name + "</td>";
            html += "   <td>" + s + "</td>";
            html += "   <td>" + file.name.substring(file.name.lastIndexOf(".")+1,file.name.length) + "</td>";
            html += "   <td><a class='layui-btn layui-btn-danger layui-btn-xs' data-file-class='warn-" + index + "'><i class='layui-icon layui-icon-delete'></i>删除</a></td>";
            html += "</tr>";
            //追加到文件列表
            $(".warn-file-table > tbody").append(html);
            // 点击列表删除事件，删除当前行，并且删除，文件文本框
            $(".warn-file-table > tbody > tr > td > a").on("click",function () {
                var fileClass = $(this).data("fileClass");
                // 删除文件文本框
                $(".warn-file-list > ." + fileClass).remove();
                // 删除当前行
                $(this).parent().parent().remove();

                if($(".warn-file-table > tbody > tr").length == 0){
                    $(".warn-file-table").addClass("layui-hide");
                    // 3:隐藏初始化提示信息
                    $(".warn-upload-msg").removeClass("layui-hide");
                }
            });
        });
    });

    /**
     * tab选项卡删除监听事件
     */
    element.on('tabDelete(warn-tab)', function(data){
        // 获取当前删除的tab title中的渠道id
        var channelId = $(this).parent().attr("lay-id");
        if(channelId != undefined) {
            var channel = $(".channel-list .imgbox.active");
            // 判断当前是否是最后一个渠道，如果是则提示至少选中一个渠道
            if ($(channel).length == 1) {

                var result = {
                    channels: [{channelId:$(channel).data("id"), channelName:$(channel).data("title")}],
                    areas: []
                };
                // 循环获取当前地区树选中的地区
                initAreaTree.getCheckedNodes(true).forEach(function (item) {
                    result.areas.push({
                        areaId: item.id,
                        areaName: item.name
                    });
                });
                active.setGroupUsers(result);
                layer.msg("请至少选中一个渠道", {time: 2000});
                return false;
            }
            // 删除渠道对应的样式
            $(".channel-list .imgbox.active[data-id='" + channelId + "']").removeClass("active");

        }
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


    /**
     * 监听业务类型选择
     */
    form.on('select', function(data){
        var type = data.value;
        if(type == ""){
            // 清空渠道
            $(".channel-list").children().removeClass("active");
            // 清空勾选地区
            initAreaTree.checkAllNodes(false);
            // 清空对应的内容
            $(".warn-card-content-list").empty().append("<div class='layui-col-xs12 layui-col-md12 warn-content-skip'>请选择业务类型</div>");
            // 清除tab页所有内容
            $(".warn-tab .warn-tab-title, .warn-tab .warn-tab-content").empty();
            // 拼回默认提示
            active.defaultWarnMsg({id:'choose-tab',title:'温馨提示',msg:'请选择业务类型'});
            return false;
        }
        // 给全局业务类型赋值
        active.type = type;

        // 判断渠道是否选中
        if($(".channel-list").find(".active").length == 0) {
            // 默认勾选当前地区
            var node = initAreaTree.getNodeByParam("id", employee.areaId, null);
            initAreaTree.checkNode(node, true, true);
            // 加载默认第一个渠道
            $(".channel-list").children().eq(0).addClass("active");

            // 加载对应的内容
            var param = {
                organizationId: employee.organizationId
                , areas: function () {
                    var area = [];
                    initAreaTree.getCheckedNodes(true).forEach(function (item) {
                        area.push({
                            areaId: item.id,
                            areaName: item.name,
                            areaCode: item.code
                        });
                    });
                    return area;
                }()
                , channels: function () {
                    var channel = [];
                    $(".channel-list .imgbox.active").each(function () {
                        channel.push({
                            channelId: $(this).data("id"),
                            channelName: $(this).data("title"),
                            channelCode: $(this).data("code")
                        });
                    });
                    return channel;

                }()
            };
            // 拼接内容
            active.setContent(param);
            // 加载对应的受众
            active.setGroupUsers(param);
        }
    });

    /**
     * 监听预警提交事件
     */
    form.on("submit(submit)", function(data){
        // 数据提交到后台，通用方法
        var param = data.field;
        param.template = 2;  // 微信模板类型：1：气象灾害预警提醒；2：服务提醒通知；3：突发事件预警提醒；

        // 渠道处理
        param.channel = function(){
            var channel = [];
            $(".channel-list .imgbox.active").each(function () {
                channel.push({
                    channelId: $(this).data("id"),
                    channelName: $(this).data("title"),
                    channelCode: $(this).data("code")
                });
            });
            return JSON.stringify(channel).replace(/\"/g,"'");
        }();

        // 地区处理
        param.area = function(){
            var area = [];
            initAreaTree.getCheckedNodes(true).forEach(function (item) {
                area.push({
                    areaId: item.id,
                    areaName: item.name,
                    areaCode: item.code
                });
            });
            return JSON.stringify(area).replace(/\"/g,"'");
        }();

        // 群组处理
        param.group = function(){
            var group = {};
            $(".channel-list .imgbox.active").each(function () {
                var channelId = $(this).data("id")
                    ,channelGroup = [];
                zTree.getZTree("group_"+channelId).getCheckedNodes(true).forEach(function (item) {
                    channelGroup.push({
                        userGroupId: item.id,
                        userGroupName: item.name
                    });
                });
                group[channelId] = channelGroup;
            });
            return JSON.stringify(group).replace(/\"/g,"'");
        }();

        // 获取文件内容
        $("textarea[name^='content_']").each(function () {
            var name = $(this).attr("name"),
                typeName = "";
            // 0：短期预报；1：中期预报；2：长期预报；3：气象专题专报；4：重大气象专题专报
            if(param.type==0) typeName = "【短期预报】";
            if(param.type==1) typeName = "【中期预报】";
            if(param.type==2) typeName = "【长期预报】";
            if(param.type==3) typeName = "【气象专题专报】";
            if(param.type==4) typeName = "【重大气象专题专报】";
            param[name] = typeName + ":" + $(this).val();
        });


        // 上传文件名称处理
        var files = function () {
            delete param.warnFile;
            var file = [];
            $(".warn-file-list > input[type='file']").each(function () {
                file.push("warn-" + $(this).data("fileIndex"));
            });
            return file;
        };

        console.log(param);

        ajaxFileUpload.render({
            async: true
            ,url : "/client/message/insert"
            ,type: "POST"
            ,param : param//需要传递的数据 json格式
            ,files : files()
            ,dataType: 'json'
        },function (json) {
            if(json.code == 200){
                // 弹出提示信息，2s后自动关闭
                layer.msg(json.msg, {time: 2000},function(){
                    //location.reload();
                });
            }
        });
    });


    /**
     * 初始化加载项
     */
    initPageMsg();                              // 初始化页面加载信息
    initChannelList();                          // 初始化加载渠道
    element.tabChange('warn-tab', "choose-tab");// 默认展开第一个tab页
});