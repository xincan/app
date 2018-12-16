package com.hyt.server.controller.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.result.ResultObject;
import com.hyt.server.config.common.result.ResultResponse;
import com.hyt.server.entity.sys.Employee;
import com.hyt.server.entity.sys.Permission;
import com.hyt.server.entity.sys.Role;
import com.hyt.server.service.sys.IEmployeeService;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: XincanJiang
 * @Description: 员工控制层
 * @Date: Created in 18:04 2018-4-18
 * @Modified By:
 */
@Api(tags = {"员工管理"}, description = "EmployeeController")
@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private IEmployeeService employeeService;

    @ApiOperation(value="员工登录信息",httpMethod="POST",notes="根据参数列表查询员工信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="loginName",value="登陆名称",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="loginPassword",value="登陆密码",required = true, dataType = "String",paramType = "query")
    })
    @PostMapping("/login")
    public JSONObject login(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        return this.employeeService.login(map);
    }


    @ApiOperation(value="添加员工信息",httpMethod="POST",notes="根据参数列表添加员工信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="loginName",value="登陆名称",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="loginPassword",value="登陆密码",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="name",value="真实名称", required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sex",value="用户性别", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="phone",value="用户电话",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="email",value="用户邮箱", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="areaId",value="用户所属地区",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="organizationId",value="用户所属机构",required = true, dataType = "String",paramType = "query")
    })
    @PostMapping("/insert")
    public ResultObject<Object> insert(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Employee user = JSON.parseObject(json.toJSONString(), new TypeReference<Employee>() {});
        int num = this.employeeService.insert(user);
        if(num>0){
            return ResultResponse.make(200,"添加员工成功",user);
        }
        return ResultResponse.make(500,"添加员工失败",null);
    }

    @ApiOperation(value="修改员工信息",httpMethod="POST", notes="根据用户ID，修改参数列表员工信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="id",value="员工ID", dataType = "String", required = true,paramType = "query"),
            @ApiImplicitParam(name="loginName",value="登陆名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="loginPassword",value="登陆密码", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="name",value="真实名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sex",value="用户性别", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="phone",value="用户电话", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="email",value="用户邮箱", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="areaId",value="用户所属地区", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="organizationId",value="用户所属机构", dataType = "String",paramType = "query")
    })
    @PostMapping("/update")
    public ResultObject<Object> update(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Employee employee = JSON.parseObject(json.toJSONString(), new TypeReference<Employee>() {});
        int num = this.employeeService.update(employee);
        if(num>0){
            return ResultResponse.make(200,"修改用户成功");
        }
        return ResultResponse.make(500,"修改用户失败");
    }

    @ApiOperation(value="删除员工详细信息",httpMethod = "DELETE", notes="根据url的用户id来删除员工详细信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "员工ID", required = true, dataType = "String", paramType="path")
    })
    @DeleteMapping("/delete/{id}")
    public ResultObject<Object> deleteById(@PathVariable(value = "id") String id) {
        Integer num = this.employeeService.deleteByEmployeeId(id);
        if(num>0){
          return  ResultResponse.make(200,"删除员工成功");
        }
        return ResultResponse.make(500,"删除员工失败");
    }

    @ApiOperation(value="批量删除员工详细信息",httpMethod = "POST", notes="根据一批用户id来删除员工详细信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "员工ID", required = true, dataType = "String", paramType="query")
    })
    @PostMapping("/delete")
    public ResultObject<Object> deleteBatch(@RequestParam(value = "id") String id) {
        Integer num = this.employeeService.deleteByEmployeeIds(id);
        if(num>0){
            return  ResultResponse.make(200,"删除员工成功");
        }
        return ResultResponse.make(500,"删除员工失败");
    }

    @ApiOperation(value="查询员工详细信息",httpMethod = "GET", notes="根据url的用户id来查询员工详细信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "员工ID", required = true, dataType = "String", paramType="path")
    })
    @GetMapping("/select/{id}")
    public ResultObject<Object> selectById(@PathVariable(value = "id") String id) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", id);
        return ResultResponse.ok(this.employeeService.selectById(map));
    }

    @ApiOperation(value = "查询员工信息列表", httpMethod = "GET", notes = "根据查询条件分页查询所有员工信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="page",value="当前页数", defaultValue="0", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="size",value="每页条数", defaultValue="10", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="sortName",value="排序字段名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", defaultValue = "DESC",dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="startTime",value="开始时间", dataType = "Date",paramType = "query"),
            @ApiImplicitParam(name="endTime",value="结束时间", dataType = "Date",paramType = "query"),

            @ApiImplicitParam(name="id",value="用户ID", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="loginName",value="登陆名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="loginPassword",value="登陆密码", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="name",value="真实名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sex",value="用户性别", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="phone",value="用户电话", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="email",value="用户邮箱", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="areaId",value="用户所属地区", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="organizationId",value="用户所属机构", dataType = "String",paramType = "query")
    })
    @GetMapping("/select")
    public ResultObject<Object> selectAll(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        PageInfo<Employee> pageInfo = this.employeeService.selectAll(map);
        return ResultResponse.page(pageInfo.getTotal(), pageInfo.getList());
    }

    @ApiOperation(value="用户分配角色",httpMethod="POST",notes="根据用户信息分配角色信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="employeeId",value="用户ID",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="roleId",value="角色ID（多个','隔开）",required = true, dataType = "String",paramType = "query")
    })
    @PostMapping("/insert/role")
    public ResultObject<Object> insertEmployeeRole(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        int num = this.employeeService.insertEmployeeRole(map);
        if(num > 0){
            return  ResultResponse.make(200,"用户分配角色成功", 0);
        }
        return ResultResponse.make(500,"用户分配角色失败", null);
    }

    @ApiOperation(value = "查询用户配置的角色", httpMethod = "GET", notes = "根据用户ID查询已经配置的角色")
    @ApiImplicitParams({
            @ApiImplicitParam(name="employeeId",value="用户ID",required = true, dataType = "String",paramType = "query")
    })
    @GetMapping("/select/role")
    public ResultObject<Object> selectEmployeeInRole(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        List<Role> list = this.employeeService.selectEmployeeInRole(map);
        if(list.size() > 0){
            return  ResultResponse.make(200,"查询用户拥有配置的角色成功", list);
        }
        return ResultResponse.make(500,"查询用户拥有配置的角色失败", null);
    }
}
