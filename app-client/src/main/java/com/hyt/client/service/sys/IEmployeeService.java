package com.hyt.client.service.sys;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 员工信息接口层
 * @Author: JiangXincan
 * @Description:
 * @Date: Created in 17:04 2018-4-18
 * @Modified By:
 */
@Service("employeeService")
@FeignClient("EWIP-SERVER")
public interface IEmployeeService {

    /**
     * 用户登录信息
     * @param map
     * @return
     */
    @PostMapping("/employee/login")
    JSONObject login(@RequestParam Map<String, Object> map);

    /**
     * 添加用户信息
     * @param map
     * @return
     */
    @PostMapping("/employee/insert")
    JSONObject insert(@RequestParam Map<String, Object> map);

    /**
     * 修改用户信息
     * @param map
     * @return
     */
    @PostMapping("/employee/update")
    JSONObject update(@RequestParam Map<String, Object> map);

    /**
     * 根据用户id删除用户信息
     * @param id
     * @return
     */
    @DeleteMapping("/employee/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id);

    /**
     * 根据ids批量删除用户信息
     * @param id
     * @return
     */
    @PostMapping("/employee/delete")
    JSONObject deleteBatch(@RequestParam("id") String id);

    /**
     * 根据用户id查询用户详细信息
     * @param id
     * @return
     */
    @GetMapping("/employee/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id);

    /**
     * 分页查询用户信息
     * @param map
     * @return
     */
    @GetMapping("/employee/select")
    JSONObject selectAll(@RequestParam Map<String, Object> map);

    /**
     * 用户分配角色
     * @param map
     * @return
     */
    @PostMapping("/employee/insert/role")
    JSONObject insertEmployeeRole(@RequestParam Map<String,Object> map);

    /**
     * 用户分配角色
     * @param map
     * @return
     */
    @GetMapping("/employee/select/role")
    JSONObject selectEmployeeInRole(@RequestParam Map<String,Object> map);

}
