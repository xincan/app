package com.hyt.server.mapper.sys;

import com.hyt.server.config.common.universal.IBaseMapper;
import com.hyt.server.entity.sys.Employee;
import com.hyt.server.entity.sys.Role;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Author: JiangXincan
 * @Description:
 * @Date: Created in 16:30 2018-4-18
 * @Modified By:
 */
@Repository("employeeMapper")
public interface IEmployeeMapper extends IBaseMapper<Employee> {

    /**
     * 根据条件分页查询员工信息
     * @param map
     * @return
     */
    List<Employee> findAll(Map<String,Object> map);

    /**
     * 员工登录信息查询
     * @param map
     * @return
     */
    Employee login(Map<String,Object> map);

    /**
     * 用户分配角色
     * @param map
     * @return
     */
    int insertEmployeeRole(Map<String,Object> map);

    /**
     * 根据用户Id查询对应的角色信息
     * @param map
     * @return
     */
    List<Role> selectEmployeeInRole(Map<String,Object> map);

    /**
     * 根据用户Id删除对应的角色信息
     * @param map
     * @return
     */
    int deleteEmployeeInRole(Map<String,Object> map);

    /**
     * 根据员工ID删除员工信息
     * @param map
     * @return
     */
    int deleteByEmployeeId(Map<String, Object> map);


}
