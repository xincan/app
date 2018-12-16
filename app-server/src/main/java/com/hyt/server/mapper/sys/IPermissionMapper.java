package com.hyt.server.mapper.sys;

import com.hyt.server.config.common.universal.IBaseMapper;
import com.hyt.server.entity.sys.Employee;
import com.hyt.server.entity.sys.Permission;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Author: XincanJiang
 * @Description:
 * @Date: Created in 16:30 2018-4-18
 * @Modified By:
 */
@Repository("permissionMapper")
public interface IPermissionMapper extends IBaseMapper<Permission> {

    /**
     * 查询权限列表
     * @param map
     * @return
     */
    List<Permission> findAll(Map<String, Object> map);

    /**
     * 根据角色查询拥有权限信息
     * @param map
     * @return
     */
    List<Permission> findPermissionByRoleId(Map<String, Object> map);

    List<Permission> selectByPermissionName(Map<String, Object> map);
}
