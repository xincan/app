package com.hyt.server.config.common.result;

/**
 * Copyright (C), 2015-2018, 本人专属封装
 * FileName: ResultCode
 * Author:   JiangXincan
 * Date:     2018-4-29 16:30
 * Description: 状态响应码工具类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
public enum  ResultCode {
    // 成功
    SUCCESS(200),

    // 失败
    FAIL(400),

    // 未认证（签名错误）
    UNAUTHORIZED(401),

    // 接口不存在
    NOT_FOUND(404),

    // 服务器内部错误
    INTERNAL_SERVER_ERROR(500);

    public int code;

    ResultCode(int code) {
        this.code = code;
    }
}
