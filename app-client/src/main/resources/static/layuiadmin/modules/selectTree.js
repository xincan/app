
layui.define(['form','zTree'], function(exports){

    var $ = layui.$,
        zTree = layui.zTree;

    var beforeClick = function(treeId, treeNode) {
        var check = (treeNode && !treeNode.isParent);
        if (!check) alert("只能选择城市...");
        return check;
    };

    var onClick = function(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        if (zTree.setting.check.enable == true) {
            zTree.checkNode(treeNode, !treeNode.checked, false)
            assignment(treeId, zTree.getCheckedNodes());
        } else {
            assignment(treeId, zTree.getSelectedNodes());
            selectTree.hideTree();
        }
    };

    var onCheck = function(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        assignment(treeId, zTree.getCheckedNodes());
    };

    var assignment = function(treeId, nodes) {
        var names = "";
        var ids = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            names += nodes[i].name + ",";
            ids += nodes[i].id + ",";
        }
        if (names.length > 0) {
            names = names.substring(0, names.length - 1);
            ids = ids.substring(0, ids.length - 1);
        }
        treeId = treeId.substring(0, treeId.length - 4);
        $("#"+treeId+" ."+treeId+"Show").css("border-color","#e6e6e6");

        if(names.indexOf('[') > -1){
            var name = names.substring(0,names.indexOf('['));
            $("#" + treeId + " ." + treeId + "Show").attr("value", name);
            $("#" + treeId + " ." + treeId + "Show").attr("title", name);
        }else{
            $("#" + treeId + " ." + treeId + "Show").attr("value", names);
            $("#" + treeId + " ." + treeId + "Show").attr("title", names);
        }
        $("." + treeId + "TreeDiv ." + treeId + "Hide").attr("value", ids);
    };

    /**
     * 获取树
     * @param param
     * @returns {*}
     */
    var getData = function (param) {
        var treeData = null;
        $.ajax({
            async:false
            ,type: 'POST'
            ,data: param.data||{}
            ,url: param.url
            ,dataType: 'json'
            ,success: function(data){
                treeData = data;
            }
        });
        return treeData;
    };

    /**
     * 下拉zTree封装
     * @param id         div id
     * @param zNodes     zTree 节点数据
     * @param isMultiple 是否多选
     * @param chkboxType 多选框类型{"Y": "ps", "N": "s"}
     * @param checkNodeId 数据回显时的树节点id
     * @param isVerify    是否验证：false: true
     * @param checkNode   选中节点函数
     * @param clickNode   点击节点函数
     */

    var selectTree = {
        /**
         * 初始化下拉树
         * @param option
         */
        "render": function(option) {
            var setting = {
                view: {
                    dblClickExpand: false,
                    showLine: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey : 'id',
                        pIdKey: 'pId'
                    }
                },
                check: {
                    enable: false,
                    chkboxType: {"Y": "ps", "N": "s"}
                },
                callback: {
                    onClick: option.clickNode != undefined ? option.clickNode : onClick,
                    onCheck: option.checkNode != undefined ? option.checkNode : onCheck
                }
            };
            if (option.isMultiple) {
                setting.check.enable = option.isMultiple;
            }
            if (option.chkboxType !== undefined && option.chkboxType != null) {
                setting.check.chkboxType = option.chkboxType;
            }

            var inputName = $("#" + option.id).attr("name");

            $("#" + option.id).prepend("<div class = 'layui-select-title' >" +
            "<input class='" + option.id + "Show layui-input' type = 'text' name='" + inputName + "' placeholder = '" + $("#" + option.id).attr("placeholder") + "' value = '' readonly='readonly'>" +
            "<i class= 'layui-edge' ></i>" +
            "</div>");

            var treeHtml = "<div class='tree-content scrollbar " + option.id + "TreeDiv'>";
            // 是否参与校验
            if(option.isVerify != undefined && option.isVerify == false){
                treeHtml += "   <input hidden class='" + option.id + "Hide' name='" + inputName + "' >";
            }else {
                treeHtml += "   <input hidden class='" + option.id + "Hide' name='" + inputName + "' lay-verify='" + inputName +"'>";
            }
            treeHtml += "   <ul id='" + option.id + "Tree' class = 'ztree scrollbar' style='margin-top:0;'></ul>";
            treeHtml += "</div>";

            $("#" + option.id).parent().append(treeHtml);
            $("#" + option.id).bind("click", function () {
                if ($(this).parent().find(".tree-content").css("display") !== "none") {
                    selectTree.hideTree();
                } else {
                    $(this).addClass("layui-form-selected");
                    var Offset = $(this).offset();
                    var width = $(this).width() - 2;
                    $(this).parent().find(".tree-content").css({left: Offset.left + "px", top: Offset.top + $(this).height() + "px" }).slideDown("fast");
                    $(this).parent().find(".tree-content").css({width: width});
                    $("body").bind("mousedown", selectTree.onBodyDown);
                }
            });

            var idTree = option.id;
            option.id = "." + option.id + "TreeDiv #" + option.id + "Tree";
            option.setting = setting;
            option.data = getData(option);
            // 初始化树
            var tree = zTree.sync(option);
            // 如果有选中项则回填选中结果
            if(option.checkNodeId != undefined && option.checkNodeId != null){
                var node = tree.getNodeByParam("id",option.checkNodeId, null);
                tree.selectNode(node,true);//将指定ID的节点选中
                onClick(event, idTree + "Tree", node);

            }
            return tree;
        }
        /**
         * 点击事件后赋值
         * @param treeId
         * @param treeNode
         */
        ,"setValue":function (treeId, treeNode) {
            treeId = treeId.substring(0, treeId.length - 4);
            $("#"+treeId+" ."+treeId+"Show").css("border-color","#e6e6e6");
            $("#" + treeId + " ." + treeId + "Show").attr("value", treeNode.name);
            $("#" + treeId + " ." + treeId + "Show").attr("title", treeNode.name);
            $("." + treeId + "TreeDiv ." + treeId + "Hide").attr("value", treeNode.id);
        }
        /**
         * 隐藏弹出层
         */
        ,"hideTree":function () {
            $(".select-tree").removeClass("layui-form-selected");
            $(".tree-content").fadeOut("fast");
            $("body").unbind("mousedown", selectTree.onBodyDown);
        }
        /**
         * 点击div之外关闭层
         * @param event
         */
        ,"onBodyDown":function (event) {
            if ($(event.target).parents(".tree-content").html() == null) {
                selectTree.hideTree();
            }
        }
    };
    //输出test接口
    exports('selectTree', selectTree);
});