package com.hyt.server.service.impl.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.page.MybatisPage;
import com.hyt.server.config.common.universal.AbstractService;
import com.hyt.server.entity.sys.Employee;
import com.hyt.server.entity.sys.Permission;
import com.hyt.server.entity.sys.Role;
import com.hyt.server.mapper.sys.IEmployeeMapper;
import com.hyt.server.mapper.sys.IPermissionMapper;
import com.hyt.server.mapper.sys.IRoleMapper;
import com.hyt.server.service.sys.IEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * @Author: XincanJiang
 * @Description:
 * @Date: Created in 16:29 2018-4-18
 * @Modified By:
 */
@Service("employeeService")
public class EmployeeServiceImpl extends AbstractService<Employee> implements IEmployeeService {

    @Autowired
    private IEmployeeMapper employeeMapper;

    @Autowired
    private IRoleMapper roleMapper;

    @Autowired
    private IPermissionMapper permissionMapper;

    /**
     * 根据参数分页查询员工信息
     * @param map
     * @return
     */
    @Override
    public PageInfo<Employee> selectAll(Map<String, Object> map) {
        System.out.println(map);
        MybatisPage.getPageSize(map);
        PageHelper.startPage(MybatisPage.page, MybatisPage.limit);
        List<Employee> userInfoList = this.employeeMapper.findAll(map);
        return new PageInfo<>(userInfoList);
    }


    /**
     * 员工登录查询
     * @param map
     * @return
     */
    @Override
    public JSONObject login(Map<String, Object> map) {
        Employee employee = this.employeeMapper.login(map);
        JSONObject result = (JSONObject) JSON.toJSON(employee);
        if(employee !=null){
            Map<String, Object> param = new HashMap<>();
            param.put("employeeId", employee.getId());
            List<Role> roles = this.roleMapper.findRoleByEmployeeId(param);
            JSONArray roleArray = (JSONArray) JSON.toJSON(roles);
            result.put("roles", roleArray);
            if(roles.size()>0){
                StringBuilder sb = new StringBuilder();
                roles.forEach(role -> {
                    sb.append("," + role.getId());
                });
                param.remove("employeeId");
                param.put("roleId", sb.substring(1));
                List<Permission> permissions = this.permissionMapper.findPermissionByRoleId(param);
                List<Permission> permissionList = permissions.stream().collect(
                        Collectors.collectingAndThen(Collectors.toCollection(() -> new TreeSet<>(Comparator.comparing(o -> o.getId()))), ArrayList::new)
                );
                JSONArray permissionArray = (JSONArray) JSON.toJSON(permissionList);
                result.put("permissions", permissionArray);
            }
        }
        return result;
    }

    @Override
    public Employee selectById(Map<String, Object> map) {
        return this.employeeMapper.login(map);
    }

    /**
     * 用户分配角色
     * @param map
     * @return
     */
    @Override
    @Transactional
    public int insertEmployeeRole(Map<String, Object> map) {
        this.employeeMapper.deleteEmployeeInRole(map);
        return this.employeeMapper.insertEmployeeRole(map);
    }

    /**
     * 根据用户Id查询对应的角色信息
     *
     * @param map
     * @return
     */
    @Override
    public List<Role> selectEmployeeInRole(Map<String, Object> map) {
        return this.employeeMapper.selectEmployeeInRole(map);
    }

    /**
     * 根据员工ID删除员工信息，以及对应角色信息
     * @param id
     * @return
     */
    @Override
    public int deleteByEmployeeId(String id) {

        if(StringUtils.isEmpty(id)) return 0;

        Map<String, Object> map = new HashMap<>();
        map.put("employeeId",id);
        // 1：删除员工对应的角色
        this.employeeMapper.deleteEmployeeInRole(map);
        // 2：删除员工信息
        this.employeeMapper.deleteByEmployeeId(map);
        return 1;
    }

    /**
     * 批量删除员工信息，以及对应角色信息
     * @param id
     * @return
     */
    @Override
    public int deleteByEmployeeIds(String id) {

        if(StringUtils.isEmpty(id)) return 0;

        Map<String, Object> map = new HashMap<>();
        map.put("employeeId",id);
        // 1：删除员工对应的角色
        this.employeeMapper.deleteEmployeeInRole(map);
        // 2：删除员工信息
        this.employeeMapper.deleteByEmployeeId(map);
        return 1;
    }
}
