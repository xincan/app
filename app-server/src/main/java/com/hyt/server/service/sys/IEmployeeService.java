package com.hyt.server.service.sys;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.universal.IBaseService;
import com.hyt.server.entity.sys.Employee;
import com.hyt.server.entity.sys.Role;
import netscape.javascript.JSObject;

import java.util.List;
import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 员工接口层
 * @Date: Created in 16:29 2018-4-18
 * @Modified By:
 */
public interface IEmployeeService extends IBaseService<Employee> {

    /**
     * 根据条件分页查询员工信息
     * @param map
     * @return
     */
    PageInfo<Employee> selectAll(Map<String,Object> map);

    /**
     * 员工登录
     * @param map
     * @return
     */
    JSONObject login(Map<String, Object> map);

    /**
     * 根据员工id查询员工信息
     * @param map
     * @return
     */
    Employee selectById(Map<String, Object> map);

    /**
     * 用户分配角色
     * @param map
     * @return
     */
    int insertEmployeeRole(Map<String, Object> map);

    /**
     * 根据用户Id查询对应的角色信息
     * @param map
     * @return
     */
    List<Role> selectEmployeeInRole(Map<String,Object> map);

    /**
     * 根据员工ID删除员工信息
     * @param id
     * @return
     */
    int deleteByEmployeeId(String id);

    /**
     * 根据员工ID批量删除员工信息
     * @param id
     * @return
     */
    int deleteByEmployeeIds(String id);

}
