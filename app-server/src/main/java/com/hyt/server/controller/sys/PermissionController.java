package com.hyt.server.controller.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.result.ResultObject;
import com.hyt.server.config.common.result.ResultResponse;
import com.hyt.server.entity.sys.Area;
import com.hyt.server.entity.sys.Permission;
import com.hyt.server.entity.sys.Role;
import com.hyt.server.service.sys.IAreaService;
import com.hyt.server.service.sys.IPermissionService;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 地区管理控制层
 * @Date: Created in 18:04 2018-4-18
 * @Modified By:
 */
@Api(tags = {"权限管理"}, description = "PermissionController")
@RestController
@RequestMapping("/permission")
public class PermissionController {

    @Autowired
    private IPermissionService permissionService;

    @ApiOperation(value="添加权限信息",httpMethod="POST",notes="根据参数列表添加权限信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="name",value="权限名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="permission",value="权限字符串", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="type",value="资源类型，[menu、button]", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="status",value="是否可用", dataType = "Integer",paramType = "query")
    })
    @PostMapping("/insert")
    public ResultObject<Object> insert(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Permission permission = JSON.parseObject(json.toJSONString(), new TypeReference<Permission>() {});
        int num = this.permissionService.insert(permission);
        if(num>0){
            return ResultResponse.make(200,"添加权限成功",permission);
        }
        return ResultResponse.make(500,"添加权限失败",null);
    }

    @ApiOperation(value="修改权限信息",httpMethod="POST", notes="根据权限ID，修改参数列表权限信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="id",value="权限ID", dataType = "String", required = true,paramType = "query"),
            @ApiImplicitParam(name="name",value="权限名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="permission",value="权限字符串", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="type",value="资源类型，[menu、button]", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="status",value="是否可用", dataType = "Integer",paramType = "query")
    })
    @PostMapping("/update")
    public ResultObject<Object> update(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Permission permission = JSON.parseObject(json.toJSONString(), new TypeReference<Permission>() {});
        int num = this.permissionService.update(permission);
        if(num>0){
            return ResultResponse.make(200,"修改权限成功");
        }
        return ResultResponse.make(500,"修改权限失败");
    }

    @ApiOperation(value="删除权限信息",httpMethod = "DELETE", notes="根据url的权限ID来删除权限信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "权限ID", required = true, dataType = "String", paramType="path")
    })
    @DeleteMapping("/delete/{id}")
    public ResultObject<Object> deleteById(@PathVariable(value = "id") String id) {
        Integer num = this.permissionService.deleteById(id);
        if(num>0){
          return  ResultResponse.make(200,"删除权限成功");
        }
        return ResultResponse.make(500,"删除权限失败");
    }

    @ApiOperation(value="批量删除权限信息",httpMethod = "POST", notes="根据一批权限ID来删除权限信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "权限ID", required = true, dataType = "String", paramType="query")
    })
    @PostMapping("/delete")
    public ResultObject<Object> deleteBatch(@RequestParam(value = "id") String id) {
        Integer num = this.permissionService.deleteByIds(id);
        if(num>0){
            return  ResultResponse.make(200,"删除权限成功");
        }
        return ResultResponse.make(500,"删除权限失败");
    }

    @ApiOperation(value="查询权限信息",httpMethod = "POST", notes="根据url的权限id来查询权限信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "权限ID", required = true, dataType = "String", paramType="path")
    })
    @PostMapping("/select/{id}")
    public ResultObject<Object> selectById(@PathVariable(value = "id") String id) {
        return ResultResponse.ok(this.permissionService.selectById(id));
    }

    @ApiOperation(value = "查询权限信息列表", httpMethod = "GET", notes = "根据查询条件分页查询所有权限信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="page",value="当前页数", defaultValue="0", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="size",value="每页条数", defaultValue="10", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="sortName",value="排序字段名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", defaultValue = "DESC",dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="startTime",value="开始时间", dataType = "Date",paramType = "query"),
            @ApiImplicitParam(name="endTime",value="结束时间", dataType = "Date",paramType = "query"),

            @ApiImplicitParam(name="id",value="权限ID", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="name",value="权限名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="permission",value="权限字符串", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="type",value="资源类型，[menu、button]", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="status",value="是否可用", dataType = "Integer",paramType = "query")
    })
    @GetMapping("/select")
    public ResultObject<Object> selectAll(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        PageInfo<Permission> pageInfo = this.permissionService.selectAll(map);
        return ResultResponse.page(pageInfo.getTotal(), pageInfo.getList());
    }

    @ApiOperation(value = "查询权限信息", httpMethod = "GET", notes = "根据查询条件查询所有权限信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="page",value="当前页数", defaultValue="0", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="size",value="每页条数", defaultValue="10", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="sortName",value="排序字段名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", defaultValue = "DESC",dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="startTime",value="开始时间", dataType = "Date",paramType = "query"),
            @ApiImplicitParam(name="endTime",value="结束时间", dataType = "Date",paramType = "query"),

            @ApiImplicitParam(name="id",value="权限ID", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="name",value="权限名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="permission",value="权限字符串", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="type",value="资源类型，[menu、button]", dataType = "String",paramType = "query")
    })
    @GetMapping("/select/all")
    public ResultObject<Object> selectByPermissionName(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        List<Permission> list = this.permissionService.selectByPermissionName(map);
        if(list.size() > 0){
            return  ResultResponse.make(200,"查询权限成功", list);
        }
        return ResultResponse.make(500,"查询权限失败", null);
    }

}
