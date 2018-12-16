package com.hyt.server.controller.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.result.ResultObject;
import com.hyt.server.config.common.result.ResultResponse;
import com.hyt.server.entity.sys.Area;
import com.hyt.server.service.sys.IAreaService;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 地区管理控制层
 * @Date: Created in 18:04 2018-4-18
 * @Modified By:
 */
@Api(tags = {"地区管理"}, description = "AreaController")
@RestController
@RequestMapping("/area")
public class AreaController {

    @Autowired
    private IAreaService areaService;

    @ApiOperation(value="添加地区信息",httpMethod="POST",notes="根据参数列表添加地区信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name="areaName",value="地区名称",required = true, dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="code",value="地区编码",required = true, dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="pId", value="上级地区", required = true, dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="level",value="地区级别", required = true,dataType = "Integer",paramType = "query"),
        @ApiImplicitParam(name="longitude",value="地区经度", dataType = "Double",paramType = "query"),
        @ApiImplicitParam(name="latitude",value="地区纬度", dataType = "Double",paramType = "query"),
        @ApiImplicitParam(name="altitude",value="海拔高度", dataType = "Double",paramType = "query")
    })
    @PostMapping("/insert")
    public ResultObject<Object> insert(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Area area = JSON.parseObject(json.toJSONString(), new TypeReference<Area>() {});
        int num = this.areaService.insert(area);
        if(num>0){
            return ResultResponse.make(200,"添加地区成功",area);
        }
        return ResultResponse.make(500,"添加地区失败",null);
    }

    @ApiOperation(value="修改地区信息",httpMethod="POST", notes="根据地区ID，修改参数列表地区信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name="id",value="地区ID", dataType = "String", required = true,paramType = "query"),
        @ApiImplicitParam(name="areaName",value="地区名称", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="code",value="地区编码", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="pId",value="上级地区", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="level",value="地区级别", dataType = "Integer",paramType = "query")
    })
    @PostMapping("/update")
    public ResultObject<Object> update(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Area area = JSON.parseObject(json.toJSONString(), new TypeReference<Area>() {});
        int num = this.areaService.update(area);
        if(num>0){
            return ResultResponse.make(200,"修改地区成功");
        }
        return ResultResponse.make(500,"修改地区失败");
    }

    @ApiOperation(value="删除地区信息",httpMethod = "DELETE", notes="根据url的地区ID来删除地区信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "地区ID", required = true, dataType = "String", paramType="path")
    })
    @DeleteMapping("/delete/{id}")
    public ResultObject<Object> deleteById(@PathVariable(value = "id") String id) {
        Integer num = this.areaService.deleteById(id);
        if(num>0){
          return  ResultResponse.make(200,"删除地区成功");
        }
        return ResultResponse.make(500,"删除地区失败");
    }

    @ApiOperation(value="批量删除地区信息",httpMethod = "POST", notes="根据一批地区ID来删除地区信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "地区ID", required = true, dataType = "String", paramType="query")
    })
    @PostMapping("/delete")
    public ResultObject<Object> deleteBatch(@RequestParam(value = "id") String id) {
        Integer num = this.areaService.deleteByIds(id);
        if(num>0){
            return  ResultResponse.make(200,"删除地区成功");
        }
        return ResultResponse.make(500,"删除地区失败");
    }

    @ApiOperation(value="查询地区信息",httpMethod = "POST", notes="根据url的地区id来查询地区信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "地区ID", required = true, dataType = "String", paramType="path")
    })
    @PostMapping("/select/{id}")
    public ResultObject<Object> selectById(@PathVariable(value = "id") String id) {
        return ResultResponse.ok(this.areaService.selectById(id));
    }

    @ApiOperation(value = "查询地区信息列表", httpMethod = "GET", notes = "根据查询条件分页查询所有地区信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name="page",value="当前页数", defaultValue="0", dataType = "Integer",paramType = "query"),
        @ApiImplicitParam(name="size",value="每页条数", defaultValue="10", dataType = "Integer",paramType = "query"),
        @ApiImplicitParam(name="sortName",value="排序字段名称", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", defaultValue = "DESC",dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="startTime",value="开始时间", dataType = "Date",paramType = "query"),
        @ApiImplicitParam(name="endTime",value="结束时间", dataType = "Date",paramType = "query"),

        @ApiImplicitParam(name="id",value="地区ID", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="areaName",value="地区名称", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="code",value="地区编码", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="pId",value="上级地区", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="level",value="地区级别", dataType = "Integer",paramType = "query"),
        @ApiImplicitParam(name="longitude",value="地区经度", dataType = "Double",paramType = "query"),
        @ApiImplicitParam(name="latitude",value="地区纬度", dataType = "Double",paramType = "query"),
        @ApiImplicitParam(name="altitude",value="海拔高度", dataType = "Double",paramType = "query")
    })
    @GetMapping("/select")
    public ResultObject<Object> selectAll(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        PageInfo<Area> pageInfo = this.areaService.selectAll(map);
        return ResultResponse.page(pageInfo.getTotal(), pageInfo.getList());
    }


}
