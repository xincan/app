package com.hyt.server.service.sys;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.universal.IBaseService;
import com.hyt.server.entity.sys.Employee;
import com.hyt.server.entity.sys.Permission;

import java.util.List;
import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 员工接口层
 * @Date: Created in 16:29 2018-4-18
 * @Modified By:
 */
public interface IPermissionService extends IBaseService<Permission> {

    PageInfo<Permission> selectAll(Map<String, Object> map);

    List<Permission> selectById(Map<String, Object> map);

    List<Permission> selectByPermissionName(Map<String, Object> map);

}
