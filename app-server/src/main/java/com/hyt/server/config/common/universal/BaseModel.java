package com.hyt.server.config.common.universal;

import com.alibaba.fastjson.JSON;

/**
 * @Description: 所有model重写toString方法
 * @author JiangXincan
 * @date 2018/4/18 11:28
 */
public class BaseModel {

    @Override
    public String toString(){
        return this.getClass().getSimpleName()+":"+JSON.toJSONString(this)+"\n";
    }
}
