
layui.define(function(exports){

    /**
     * 灾种相关数据转换
     */
    var disaster = {
        /**
         * 灾种颜色：0：红色；1：橙色；2：黄色；3：蓝色
         * @param option
         * @returns {*}
         */
        "color": function(option, bg) {
            var obj = parseInt(option);
            if(!isNaN(obj)){
                if(obj == 0) return bg == undefined || bg == "" || bg == null ? "红色" : "<span class='ewip-btn-tips ewip-red'>红色</span>";
                if(obj == 1) return bg == undefined || bg == "" || bg == null ? "橙色" : "<span class='ewip-btn-tips ewip-orange'>橙色</span>";
                if(obj == 2) return bg == undefined || bg == "" || bg == null ? "黄色" : "<span class='ewip-btn-tips ewip-yellow'>黄色</span>";
                if(obj == 3) return bg == undefined || bg == "" || bg == null ? "蓝色" : "<span class='ewip-btn-tips ewip-blue'>蓝色</span>";
            }else{
                if(obj == '红色') return 0;
                if(obj == '橙色') return 1;
                if(obj == '黄色') return 2;
                if(obj == '蓝色') return 3;
            }
        }
        /**
         * 灾种级别：0：Ⅰ级/特别重大；1：Ⅱ级/重大；2：Ⅲ级/较大；3：Ⅳ级/一般
         * @param option
         * @returns {*}
         */
        ,"level":function (option) {
            var obj = parseInt(option);
            if(!isNaN(obj)){
                if(obj == 0) return 'Ⅰ级/特别重大';
                if(obj == 1) return 'Ⅱ级/重大';
                if(obj == 2) return 'Ⅲ级/较大';
                if(obj == 3) return 'Ⅳ级/一般';
            }else{
                if(obj == 'Ⅰ级/特别重大') return 0;
                if(obj == 'Ⅱ级/重大') return 1;
                if(obj == 'Ⅲ级/较大') return 2;
                if(obj == 'Ⅳ级/一般') return 3;
            }
        }

        /**
         * 灾种级别：0：Ⅰ级/特别重大；1：Ⅱ级/重大；2：Ⅲ级/较大；3：Ⅳ级/一般
         * @param option
         * @returns {*}
         */
        ,"chooseColorToLevel":function (option) {
            if(option == 0) return {level: 0, name:'Ⅰ级/特别重大'};
            if(option == 1) return {level: 1, name:'Ⅱ级/重大'};
            if(option == 2) return {level: 2, name:'Ⅲ级/较大'};
            if(option == 3) return {level: 3, name:'Ⅳ级/一般'};
        }

        /**
         * 一键发布信息类型：0：短期预报；1：中期预报；2：长期预报；3：气象专题专报；4：重大气象专题专报
         * @param option
         * @returns {*}
         */
        ,"chooseMessageToType":function (option) {
            if(option == 0) return {level: 0, name:'短期预报'};
            if(option == 1) return {level: 1, name:'中期预报'};
            if(option == 2) return {level: 2, name:'长期预报'};
            if(option == 3) return {level: 3, name:'气象专题专报'};
            if(option == 4) return {level: 4, name:'重大气象专题专报'};
        }
    };
    //输出test接口
    exports('disaster', disaster);
});