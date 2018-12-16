package com.hyt.server.config.common.result;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Copyright (C), 2015-2018, 本人专属封装
 * FileName: ResultObject
 * Author:   JiangXincan
 * Date:     2018-4-29 16:32
 * Description: 创建返回对象实体类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
@ApiModel(value = "ResultObject<T>",description = "状态返回信息")
public class ResultObject<T> {

    // 响应结果编码
    @ApiModelProperty(name="code", value="响应结果编码")
    public int code;

    // 响应结果信息
    @ApiModelProperty(name="code", value="响应结果信息")
    private String msg;

    // 统计列表总数
    @ApiModelProperty(name="count",value="统计列表总数（如果列表存在）")
    private long count;

    // 响应结果数据
    @ApiModelProperty(name="data",value="响应结果数据")
    private T data;

    public ResultObject<T> setCode(ResultCode retCode) {
        this.code = retCode.code;
        return this;
    }

    public int getCode() {
        return code;
    }

    public ResultObject<T> setCode(int code) {
        this.code = code;
        return this;
    }

    public String getMsg() {
        return msg;
    }

    public ResultObject<T> setMsg(String msg) {
        this.msg = msg;
        return this;
    }

    public T getData() {
        return data;
    }

    public ResultObject<T> setData(T data) {
        this.data = data;
        return this;
    }

    public long getCount() {
        return count;
    }

    public ResultObject<T> setCount(long count) {
        this.count = count;
        return this;
    }
}
