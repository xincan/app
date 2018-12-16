package com.hyt.server.config.common.exception;

import java.io.Serializable;

/**
 * Copyright (C), 2015-2018
 * FileName: ServiceException
 * Author:   JiangXinan
 * Date:     2018-4-29 17:32
 * Description: 异常处理机制类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名          修改时间         版本号             描述
 */
public class ServiceException extends RuntimeException implements Serializable {

    private static final long serialVersionUID = 1213855733833039552L;

    public ServiceException() {}

    public ServiceException(String message) {
        super(message);
    }

    public ServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}