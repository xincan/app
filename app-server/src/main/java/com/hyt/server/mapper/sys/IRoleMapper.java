package com.hyt.server.mapper.sys;

import com.alibaba.fastjson.JSONArray;
import com.hyt.server.config.common.universal.IBaseMapper;
import com.hyt.server.entity.sys.Employee;
import com.hyt.server.entity.sys.Menu;
import com.hyt.server.entity.sys.Permission;
import com.hyt.server.entity.sys.Role;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Author: XincanJiang
 * @Description:
 * @Date: Created in 16:30 2018-4-18
 * @Modified By:
 */
@Repository("roleMapper")
public interface IRoleMapper extends IBaseMapper<Role> {

    /**
     * 查询角色列表信息
     * @param map
     * @return
     */
    List<Role> findAll(Map<String, Object> map);

    /**
     * 根据用户查询用户拥有的角色
     * @param map
     * @return
     */
    List<Role> findRoleByEmployeeId(Map<String, Object> map);

    /**
     * 查询所有角色名称
     * @param map
     * @return
     */
    List<Role> selectByRoleName(Map<String, Object> map);

    /**
     * 角色配置菜单
     *
     * @param map
     * @return
     */
    int insertRoleMenu(Map<String, Object> map);

    /**
     * 根据角色ID查询对应的菜单信息
     * @param map
     * @return
     */
    List<Menu> selectRoleInMenu(Map<String, Object> map);

    /**
     * 角色配置权限
     *
     * @param map
     * @return
     */
    int insertRolePermission(Map<String, Object> map);

    /**
     * 根据角色ID查询对应的权限信息
     * @param map
     * @return
     */
    List<Permission> selectRoleInPermission(Map<String, Object> map);

    /**
     * 根据角色ID删除拥有的菜单信息
     * @param map
     * @return
     */
    int deleteByRoleId(Map<String, Object> map);

    /**
     * 根据角色ID删除拥有的菜单信息
     * @param map
     * @return
     */
    int deleteRoleInMenu(Map<String, Object> map);

    /**
     * 根据角色ID删除拥有的权限信息
     * @param map
     * @return
     */
    int deleteRoleInPermission(Map<String, Object> map);

    int deleteByRoleIds(Map<String, Object> map);

}
