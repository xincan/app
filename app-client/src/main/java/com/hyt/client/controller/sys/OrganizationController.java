package com.hyt.client.controller.sys;

import com.alibaba.fastjson.JSONObject;
import com.hyt.client.service.sys.IOrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 机构信息控制层
 * @Date: Created in 10:07 2018-4-19
 * @Modified By:
 */
@RestController
@RequestMapping("organization")
public class OrganizationController {

    @Autowired
    private IOrganizationService organizationService;

    /**
     * 添加机构信息
     * @param map
     * @return
     */
    @PostMapping("/insert")
    JSONObject insert(@RequestParam Map<String,Object> map){
        return this.organizationService.insert(map);
    }

    /**
     * 修改地区信息
     * @param map
     * @return
     */
    @PostMapping("/update")
    JSONObject update(@RequestParam Map<String,Object> map){
        return this.organizationService.update(map);
    }

    /**
     * 根据机构id删除机构信息
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id){
        return this.organizationService.deleteById(id);
    }

    /**
     * 根据ids批量删除机构信息
     * @param id
     * @return
     */
    @PostMapping("/delete")
    JSONObject deleteBatch(@RequestParam(value = "id") String id){
        return this.organizationService.deleteBatch(id);
    }

    /**
     * 根据地区id查询机构详细信息
     * @param id
     * @return
     */
    @GetMapping("/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id){
        return this.organizationService.selectById(id);
    }

    /**
     * 分页查询机构信息
     * @param map
     * @return
     */
    @GetMapping("/select")
    JSONObject selectAll(@RequestParam Map<String,Object> map){
        return this.organizationService.selectAll(map);
    }


}
