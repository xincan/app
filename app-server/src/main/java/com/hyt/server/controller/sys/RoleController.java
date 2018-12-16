package com.hyt.server.controller.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.result.ResultObject;
import com.hyt.server.config.common.result.ResultResponse;
import com.hyt.server.entity.sys.Area;
import com.hyt.server.entity.sys.Menu;
import com.hyt.server.entity.sys.Permission;
import com.hyt.server.entity.sys.Role;
import com.hyt.server.service.sys.IAreaService;
import com.hyt.server.service.sys.IRoleService;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 角色管理控制层
 * @Date: Created in 18:04 2018-4-18
 * @Modified By:
 */
@Api(tags = {"角色管理"}, description = "RoleController")
@RestController
@RequestMapping("/role")
public class RoleController {

    @Autowired
    private IRoleService roleService;

    @ApiOperation(value="添加角色信息",httpMethod="POST",notes="根据参数列表添加角色信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name="role",value="角色名称",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="description",value="角色说明",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="status", value="是否启用", required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="level",value="角色级别", required = true,dataType = "Integer",paramType = "query")
    })
    @PostMapping("/insert")
    public ResultObject<Object> insert(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Role role = JSON.parseObject(json.toJSONString(), new TypeReference<Role>() {});
        int num = this.roleService.insert(role);
        if(num>0){
            return ResultResponse.make(200,"添加角色成功",role);
        }
        return ResultResponse.make(500,"添加角色失败",null);
    }

    @ApiOperation(value="修改角色信息",httpMethod="POST", notes="根据角色ID，修改参数列表角色信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="id",value="角色ID", dataType = "String", required = true,paramType = "query"),
            @ApiImplicitParam(name="role",value="角色名称",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="description",value="角色说明",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="status", value="是否启用", required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="level",value="角色级别", required = true,dataType = "Integer",paramType = "query")
    })
    @PostMapping("/update")
    public ResultObject<Object> update(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Role role = JSON.parseObject(json.toJSONString(), new TypeReference<Role>() {});
        int num = this.roleService.update(role);
        if(num>0){
            return ResultResponse.make(200,"修改角色成功");
        }
        return ResultResponse.make(500,"修改角色失败");
    }

    @ApiOperation(value="删除角色信息",httpMethod = "DELETE", notes="根据url的角色ID来删除角色信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "角色ID", required = true, dataType = "String", paramType="path")
    })
    @DeleteMapping("/delete/{id}")
    public ResultObject<Object> deleteById(@PathVariable(value = "id") String id) {
        Integer num = this.roleService.deleteByRoleId(id);
        if(num>0){
          return  ResultResponse.make(200,"删除角色成功");
        }
        return ResultResponse.make(500,"删除角色失败");
    }

    @ApiOperation(value="批量删除角色信息",httpMethod = "POST", notes="根据一批角色ID来删除角色信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "角色ID", required = true, dataType = "String", paramType="query")
    })
    @PostMapping("/delete")
    public ResultObject<Object> deleteBatch(@RequestParam(value = "id") String id) {
        Integer num = this.roleService.deleteByRoleIds(id);
        if(num>0){
            return  ResultResponse.make(200,"删除角色成功");
        }
        return ResultResponse.make(500,"删除角色失败");
    }

    @ApiOperation(value="查询角色信息",httpMethod = "POST", notes="根据url的角色id来查询角色信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "角色ID", required = true, dataType = "String", paramType="path")
    })
    @PostMapping("/select/{id}")
    public ResultObject<Object> selectById(@PathVariable(value = "id") String id) {
        return ResultResponse.ok(this.roleService.selectById(id));
    }

    @ApiOperation(value = "查询角色信息列表", httpMethod = "GET", notes = "根据查询条件分页查询所有角色信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="page",value="当前页数", defaultValue="0", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="size",value="每页条数", defaultValue="10", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="sortName",value="排序字段名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", defaultValue = "DESC",dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="startTime",value="开始时间", dataType = "Date",paramType = "query"),
            @ApiImplicitParam(name="endTime",value="结束时间", dataType = "Date",paramType = "query"),

            @ApiImplicitParam(name="id",value="角色ID",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="role",value="角色名称",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="description",value="角色说明",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="status", value="是否启用", required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="level",value="角色级别", required = true,dataType = "Integer",paramType = "query")
    })
    @GetMapping("/select")
    public ResultObject<Object> selectAll(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        PageInfo<Role> pageInfo = this.roleService.selectAll(map);
        return ResultResponse.page(pageInfo.getTotal(), pageInfo.getList());
    }

    @ApiOperation(value = "查询角色信息", httpMethod = "GET", notes = "根据查询条件查询所有角色信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="page",value="当前页数", defaultValue="0", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="size",value="每页条数", defaultValue="10", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="sortName",value="排序字段名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", defaultValue = "DESC",dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="startTime",value="开始时间", dataType = "Date",paramType = "query"),
            @ApiImplicitParam(name="endTime",value="结束时间", dataType = "Date",paramType = "query"),

            @ApiImplicitParam(name="id",value="角色ID",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="role",value="角色名称",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="status", value="是否启用", required = true, dataType = "Integer",paramType = "query")
    })
    @GetMapping("/select/all")
    public ResultObject<Object> selectByRoleName(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        List<Role> list = this.roleService.selectByRoleName(map);
        if(list.size() > 0){
            return  ResultResponse.make(200,"查询角色成功", list);
        }
        return ResultResponse.make(500,"查询角色失败", null);
    }

    @ApiOperation(value = "角色配置菜单", httpMethod = "POST", notes = "根据角色ID配置该角色拥有的菜单")
    @ApiImplicitParams({
            @ApiImplicitParam(name="roleId",value="角色ID",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="menuId",value="菜单ID（多个','隔开）",required = true, dataType = "String",paramType = "query")
    })
    @PostMapping("/menu")
    public ResultObject<Object> insertRoleMenu(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        int num = this.roleService.insertRoleMenu(map);
        if(num > 0){
            return  ResultResponse.make(200,"角色配置菜单成功", 0);
        }
        return ResultResponse.make(500,"角色配置菜单失败", null);
    }

    @ApiOperation(value = "查询角色配置的菜单", httpMethod = "GET", notes = "根据角色ID查询已经配置的菜单")
    @ApiImplicitParams({
            @ApiImplicitParam(name="roleId",value="角色ID",required = true, dataType = "String",paramType = "query")
    })
    @GetMapping("/select/menu")
    public ResultObject<Object> selectRoleInMenu(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        JSONArray array = this.roleService.selectRoleInMenu(map);
        if(array.size() > 0){
            return  ResultResponse.make(200,"查询角色对应配置的菜单成功", array);
        }
        return ResultResponse.make(500,"查询角色对应配置的菜单失败", null);
    }

    @ApiOperation(value = "角色配置权限", httpMethod = "POST", notes = "根据角色ID配置该权限拥有的权限")
    @ApiImplicitParams({
            @ApiImplicitParam(name="roleId",value="角色ID",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="permissionId",value="权限ID（多个','隔开）",required = true, dataType = "String",paramType = "query")
    })
    @PostMapping("/permission")
    public ResultObject<Object> insertRolePermission(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        int num = this.roleService.insertRolePermission(map);
        if(num > 0){
            return  ResultResponse.make(200,"角色配置权限成功", 0);
        }
        return ResultResponse.make(500,"角色配置权限失败", null);
    }

    @ApiOperation(value = "查询角色配置的权限", httpMethod = "GET", notes = "根据角色ID查询已经配置的权限")
    @ApiImplicitParams({
            @ApiImplicitParam(name="roleId",value="角色ID",required = true, dataType = "String",paramType = "query")
    })
    @GetMapping("/select/permission")
    public ResultObject<Object> selectRoleInPermission(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        List<Permission> list = this.roleService.selectRoleInPermission(map);
        if(list.size() > 0){
            return  ResultResponse.make(200,"查询角色拥有配置的权限成功", list);
        }
        return ResultResponse.make(500,"查询角色拥有配置的权限失败", null);
    }

}
