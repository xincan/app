package com.hyt.server.config.common.result;

/**
 * Copyright (C), 2015-2018, 本人专属封装
 * FileName: ResultResponse
 * Author:   JiangXincan
 * Date:     2018-4-29 16:34
 * Description: 将结果转换为封装对象实体类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
public class ResultResponse {

    private final static String SUCCESS = "success";

    /**
     * 返回处理结果
     * @param <T> 响应数据类型
     * @return ResultObject<T>
     */
    public static <T> ResultObject<T> ok() {
        return new ResultObject<T>().setCode(ResultCode.SUCCESS).setMsg(SUCCESS);
    }

    /**
     * 返回处理结果
     * @param data 响应数据
     * @param <T> 响应数据类型
     * @return ResultObject<T>
     */
    public static <T> ResultObject<T> ok(T data) {
        return new ResultObject<T>().setCode(ResultCode.SUCCESS).setMsg(SUCCESS).setData(data);
    }

    /**
     * 返回处理结果
     * @param message 响应描述
     * @param <T> 响应数据类型
     * @return ResultObject<T>
     */
    public static <T> ResultObject<T> err(String message) {
        return new ResultObject<T>().setCode(ResultCode.FAIL).setMsg(SUCCESS);
    }

    /**
     * 返回处理结果
     * @param code 响应编码
     * @param msg 响应描述
     * @param <T> 响应数据类型
     * @return ResultObject<T>
     */
    public static <T> ResultObject<T> make(int code, String msg) {
        return new ResultObject<T>().setCode(code).setMsg(msg);
    }

    /**
     * 返回处理结果
     * @param code 响应编码
     * @param msg 响应描述
     * @param data 响应数据
     * @param <T> 响应数据类型
     * @return ResultObject<T>
     */
    public static <T> ResultObject<T> make(int code, String msg, T data) {
        return new ResultObject<T>().setCode(code).setMsg(msg).setData(data);
    }

    /**
     * 返回分页数据信息
     * @param count   总条数
     * @param data    查询分页数据
     * @param <T>     响应数据类型
     * @return
     */
    public static <T> ResultObject<T> page(long count , T data){
        return new ResultObject<T>().setCount(count).setData(data);
    }

    /**
     * 返回分页数据信息
     * @param code      响应结果码
     * @param msg       响应结果信息
     * @param count     总条数
     * @param data      查询分页数据
     * @param <T>       响应数据类型
     * @return
     */
    public static <T> ResultObject<T> page(int code, String msg, long count , T data){
        return new ResultObject<T>().setCode(code).setMsg(msg).setCount(count).setData(data);
    }
}
