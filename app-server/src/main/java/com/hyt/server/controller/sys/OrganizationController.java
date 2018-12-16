package com.hyt.server.controller.sys;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.result.ResultObject;
import com.hyt.server.config.common.result.ResultResponse;
import com.hyt.server.entity.sys.Organization;
import com.hyt.server.service.sys.IOrganizationService;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 机构管理控制层
 * @Date: Created in 18:04 2018-4-18
 * @Modified By:
 */
@Api(tags = {"机构管理"}, description = "OrganizationController")
@RestController
@RequestMapping("/organization")
public class OrganizationController {

    @Autowired
    private IOrganizationService organizationService;


    @ApiOperation(value="添加机构信息",httpMethod="POST",notes="根据参数列表添加机构信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name="organizationName",value="机构名称",required = true, dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="code",value="机构编码",required = true, dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="pId",value="上级机构", required = true, dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="areaId",value="所属地区",required = true, dataType = "String",paramType = "query")
    })
    @PostMapping("/insert")
    public ResultObject<Object> insert(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Organization organization = JSON.parseObject(json.toJSONString(), new TypeReference<Organization>() {});
        int num = this.organizationService.insert(organization);
        if(num>0){
            return ResultResponse.make(200,"添加机构成功",organization);
        }
        return ResultResponse.make(500,"添加机构失败",null);
    }

    @ApiOperation(value="修改机构信息",httpMethod="POST", notes="根据机构ID，修改参数列表机构信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name="id",value="机构ID", dataType = "String", required = true,paramType = "query"),
        @ApiImplicitParam(name="organizationName",value="机构名称", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="code",value="机构编码", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="pId",value="上级机构", dataType = "String",paramType = "query"),
        @ApiImplicitParam(name="areaId",value="所属地区", dataType = "String",paramType = "query")
    })
    @PostMapping("/update")
    public ResultObject<Object> update(@ApiParam(hidden = true) @RequestParam Map<String,Object> map){
        JSONObject json = new JSONObject(map);
        Organization organization = JSON.parseObject(json.toJSONString(), new TypeReference<Organization>() {});
        int num = this.organizationService.update(organization);
        if(num>0){
            return ResultResponse.make(200,"修改机构成功");
        }
        return ResultResponse.make(500,"修改机构失败");
    }

    @ApiOperation(value="删除机构信息",httpMethod = "DELETE", notes="根据url的机构id来删除机构信息")
    @ApiImplicitParams({
        @ApiImplicitParam(name = "id", value = "机构ID", required = true, dataType = "String", paramType="path")
    })
    @DeleteMapping("/delete/{id}")
    public ResultObject<Object> deleteById(@PathVariable(value = "id") String id) {
        Integer num = this.organizationService.deleteById(id);
        if(num>0){
          return  ResultResponse.make(200,"删除机构成功");
        }
        return ResultResponse.make(500,"删除机构失败");
    }

    @ApiOperation(value="批量删除机构详细信息",httpMethod = "POST", notes="根据一批机构id来删除机构详细信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "机构ID", required = true, dataType = "String", paramType="query")
    })
    @PostMapping("/delete")
    public ResultObject<Object> deleteBatch(@RequestParam(value = "id") String id) {
        Integer num = this.organizationService.deleteByIds(id);
        if(num>0){
            return  ResultResponse.make(200,"删除机构成功");
        }
        return ResultResponse.make(500,"删除机构失败");
    }

    @ApiOperation(value="查询机构详细信息",httpMethod = "GET", notes="根据url的机构id来查询机构详细信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "机构ID", required = true, dataType = "String", paramType="path")
    })
    @GetMapping("/select/{id}")
    public ResultObject<Object> selectById(@PathVariable(value = "id") String id) {
        return ResultResponse.ok(this.organizationService.selectById(id));
    }

    @ApiOperation(value = "查询机构信息列表", httpMethod = "GET", notes = "根据查询条件分页查询所有机构信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name="page",value="当前页数", defaultValue="0", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="size",value="每页条数", defaultValue="10", dataType = "Integer",paramType = "query"),
            @ApiImplicitParam(name="sortName",value="排序字段名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", defaultValue = "DESC",dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="startTime",value="开始时间", dataType = "Date",paramType = "query"),
            @ApiImplicitParam(name="endTime",value="结束时间", dataType = "Date",paramType = "query"),

            @ApiImplicitParam(name="id",value="机构ID", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="organizationName",value="机构名称", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="code",value="机构编码", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="pId",value="上级机构", dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="areaId",value="所属地区", dataType = "String",paramType = "query")
    })
    @GetMapping("/select")
    public ResultObject<Object> selectAll(@ApiParam(hidden = true) @RequestParam Map<String,Object> map) {
        PageInfo<Organization> pageInfo = this.organizationService.selectAll(map);
        return ResultResponse.page(pageInfo.getTotal(), pageInfo.getList());
    }


}
