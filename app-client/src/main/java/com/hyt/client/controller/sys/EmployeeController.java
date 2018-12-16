package com.hyt.client.controller.sys;

import com.alibaba.fastjson.JSONObject;
import com.hyt.client.service.sys.IEmployeeService;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 员工信息控制层
 * @Date: Created in 10:07 2018-4-19
 * @Modified By:
 */
@RestController
@RequestMapping("employee")
public class EmployeeController {

    @Autowired
    private IEmployeeService employeeService;


    /**
     * 添加员工信息
     *
     * hashIterations       加密的次数
     * salt                 盐值
     * credentials          密码
     * hashAlgorithmName    加密方式
     *
     * @param map
     * @return
     */
    @PostMapping("/insert")
    JSONObject insert(@RequestParam Map<String,Object> map){
        Object password = new SimpleHash("MD5", map.get("loginPassword").toString(),	map.get("loginName").toString(), 2);
        map.put("loginPassword", password);
        return this.employeeService.insert(map);
    }

    /**
     * 修改员工信息
     * @param map
     * @return
     */
    @PostMapping("/update")
    JSONObject update(@RequestParam Map<String,Object> map){
        Object password = new SimpleHash("MD5", map.get("loginPassword").toString(),	map.get("loginName").toString(), 2);
        map.put("loginPassword", password);
        return this.employeeService.update(map);
    }

    /**
     * 根据员工id删除用户信息
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id){
        return this.employeeService.deleteById(id);
    }

    /**
     * 根据ids批量删除员工信息
     * @param id
     * @return
     */
    @PostMapping("/delete")
    JSONObject deleteBatch(@RequestParam(value = "id") String id){
        return this.employeeService.deleteBatch(id);
    }

    /**
     * 根据用户id查询员工详细信息
     * @param id
     * @return
     */
    @GetMapping("/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id){
        return this.employeeService.selectById(id);
    }

    /**
     * 分页查询用户信息
     * @param map
     * @return
     */
    @GetMapping("/select")
    JSONObject selectAll(@RequestParam Map<String,Object> map){
        return this.employeeService.selectAll(map);
    }

    /**
     * 用户分配角色
     * @param map
     * @return
     */
    @PostMapping("/insert/role")
    JSONObject insertEmployeeRole(@RequestParam Map<String,Object> map){
        return this.employeeService.insertEmployeeRole(map);
    }

    /**
     * 用户分配角色
     * @param map
     * @return
     */
    @GetMapping("/select/role")
    JSONObject selectEmployeeInRole(@RequestParam Map<String,Object> map){
        return this.employeeService.selectEmployeeInRole(map);
    }

}
