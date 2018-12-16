
layui.define(function(exports){

    /**
     *  对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     *  可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     *  eg:
     *  (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
     *  (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     *  (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     *  (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     *  (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.pattern = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1, //月份
            "d+" : this.getDate(), //日
            "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
            "H+" : this.getHours(), //小时
            "m+" : this.getMinutes(), //分
            "s+" : this.getSeconds(), //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S" : this.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "/u65e5",
            "1" : "/u4e00",
            "2" : "/u4e8c",
            "3" : "/u4e09",
            "4" : "/u56db",
            "5" : "/u4e94",
            "6" : "/u516d"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    /**
     * 检查是不是两位数字，不足补全
     * @param str
     * @returns {string | *}
     */
    var check = function(str){
        str=str.toString();
        if(str.length<2){
            str='0'+ str;
        }
        return str;
    };


    /**
     * 灾种相关数据转换
     */
    var time = {
        /**
         * date 类型时间转换
         * @param date
         * @param str
         * @returns {string}
         */
        "formatDate": function(date,str){
            var mat={};
            mat.M=date.getMonth()+1;//月份记得加1
            mat.H=date.getHours();
            mat.s=date.getSeconds();
            mat.m=date.getMinutes();
            mat.Y=date.getFullYear();
            mat.D=date.getDate();
            mat.d=date.getDay();//星期几
            mat.d=check(mat.d);
            mat.H=check(mat.H);
            mat.M=check(mat.M);
            mat.D=check(mat.D);
            mat.s=check(mat.s);
            mat.m=check(mat.m);
            console.log(typeof mat.D)
            if(str.indexOf(":")>-1){
                mat.Y=mat.Y.toString().substr(2,2);
                return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+":"+mat.m+":"+mat.s;
            }
            if(str.indexOf("/")>-1){
                return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+"/"+mat.m+"/"+mat.s;
            }
            if(str.indexOf("-")>-1){
                return mat.Y+"-"+mat.M+"-"+mat.D+" "+mat.H+"-"+mat.m+"-"+mat.s;
            }
        }

        /**
         * 获取当前系统时间
         * @param fmt
         * @returns {string | void | *}
         */
        ,"getCurrentTime":function (fmt) {
            return (new Date()).pattern(fmt)
        }
        ,
        "formatStringTime":function (str, fmt) {
            var time = str.replace(/-/g,"/");//一般得到的时间的格式都是：yyyy-MM-dd hh24:mi:ss，所以我就用了这个做例子，是/的格式，就不用replace了。
            var date = new Date(time);//将字符串转化为时间
            return date.pattern(fmt);
        }

    };
    //输出test接口
    exports('time', time);
});