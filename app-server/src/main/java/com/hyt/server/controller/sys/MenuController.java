package com.hyt.server.controller.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.result.ResultObject;
import com.hyt.server.config.common.result.ResultResponse;
import com.hyt.server.entity.sys.Menu;
import com.hyt.server.service.sys.IMenuService;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 菜单管理控制层
 * @Date: Created in 18:04 2018-4-18
 * @Modified By:
 */
@Api(tags = {"菜单管理"}, description = "MenuController")
@RestController
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private IMenuService menuService;

    @ApiOperation(value="添加菜单信息",httpMethod="POST",notes="根据参数列表添加菜单信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="name",value="菜单名称",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="code",value="菜单编码",required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="pId", value="上级菜单", required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="level",value="菜单级别", required = true,dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="url",value="菜单路径", required = true,  dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="icon",value="菜单图标", required = true, dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="order",value="菜单排序", required = true, dataType = "Integer",paramType = "query")
    })
    @PostMapping("/insert")
    public ResultObject<Object> insert(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Menu menu = JSON.parseObject(json.toJSONString(), new TypeReference<Menu>() {});
        int num = this.menuService.insert(menu);
        if(num>0){
            return ResultResponse.make(200,"添加菜单成功",map);
        }
        return ResultResponse.make(500,"添加菜单失败",null);
    }

    @ApiOperation(value="修改菜单信息",httpMethod="POST", notes="根据菜单ID，修改参数列表菜单信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="id",value="菜单ID", dataType = "String", required = true,paramType = "query"),
            @ApiImplicitParam(name="name",value="菜单名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="code",value="菜单编码", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="pId", value="上级菜单", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="level",value="菜单级别", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="url",value="菜单路径",  dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="icon",value="菜单图标", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="order",value="菜单排序", dataType = "Integer",paramType = "query")
    })
    @PostMapping("/update")
    public ResultObject<Object> update(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Menu menu = JSON.parseObject(json.toJSONString(), new TypeReference<Menu>() {});
        int num = this.menuService.update(menu);
        if(num>0){
            return ResultResponse.make(200,"修改菜单成功");
        }
        return ResultResponse.make(500,"修改菜单失败");
    }

    @ApiOperation(value="删除菜单信息",httpMethod = "DELETE", notes="根据url的菜单ID来删除菜单信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "菜单ID", required = true, dataType = "String", paramType="path")
    })
    @DeleteMapping("/delete/{id}")
    public ResultObject<Object> deleteById(@PathVariable(value = "id") String id) {
        Integer num = this.menuService.deleteById(id);
        if(num>0){
          return  ResultResponse.make(200,"删除菜单成功");
        }
        return ResultResponse.make(500,"删除菜单失败");
    }

    @ApiOperation(value="批量删除菜单信息",httpMethod = "POST", notes="根据一批菜单ID来删除菜单信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "菜单ID", required = true, dataType = "String", paramType="query")
    })
    @PostMapping("/delete")
    public ResultObject<Object> deleteBatch(@RequestParam(value = "id") String id) {
        Integer num = this.menuService.deleteByIds(id);
        if(num>0){
            return  ResultResponse.make(200,"删除菜单成功");
        }
        return ResultResponse.make(500,"删除菜单失败");
    }

    @ApiOperation(value="查询菜单信息",httpMethod = "POST", notes="根据url的菜单id来查询菜单信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "菜单ID", required = true, dataType = "String", paramType="path")
    })
    @PostMapping("/select/{id}")
    public ResultObject<Object> selectById(@PathVariable(value = "id") String id) {
        return ResultResponse.ok(this.menuService.selectById(id));
    }

    @ApiOperation(value = "查询菜单信息列表", httpMethod = "GET", notes = "根据查询条件分页查询所有菜单信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="page",value="当前页数", defaultValue="0", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="size",value="每页条数", defaultValue="10", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="sortName",value="排序字段名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", defaultValue = "DESC",dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="startTime",value="开始时间", dataType = "Date",paramType = "query"),
            @ApiImplicitParam(name="endTime",value="结束时间", dataType = "Date",paramType = "query"),

            @ApiImplicitParam(name="id",value="菜单ID", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="name",value="菜单名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="pId", value="上级菜单", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="level",value="菜单级别", dataType = "Integer",paramType = "query")
    })
    @GetMapping("/select")
    public ResultObject<Object> selectAll(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        PageInfo<Menu> pageInfo = this.menuService.selectAll(map);
        return ResultResponse.page(pageInfo.getTotal(), pageInfo.getList());
    }


}
