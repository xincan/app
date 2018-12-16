package com.hyt.client.controller.sys;

import com.alibaba.fastjson.JSONObject;
import com.hyt.client.service.sys.IAreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 地区信息控制层
 * @Date: Created in 10:07 2018-4-19
 * @Modified By:
 */
@RestController
@RequestMapping("area")
public class AreaController {

    @Autowired
    private IAreaService areaService;

    /**
     * 添加地区信息
     * @param map
     * @return
     */
    @PostMapping("/insert")
    JSONObject insert(@RequestParam Map<String,Object> map){
        return this.areaService.insert(map);
    }

    /**
     * 修改地区信息
     * @param map
     * @return
     */
    @PostMapping("/update")
    JSONObject update(@RequestParam Map<String,Object> map){
        return this.areaService.update(map);
    }

    /**
     * 根据地区id删除地区信息
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id){
        return this.areaService.deleteById(id);
    }

    /**
     * 根据ids批量删除地区信息
     * @param id
     * @return
     */
    @PostMapping("/delete")
    JSONObject deleteBatch(@RequestParam(value = "id") String id){
        return this.areaService.deleteBatch(id);
    }

    /**
     * 根据地区id查询地区详细信息
     * @param id
     * @return
     */
    @GetMapping("/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id){
        return this.areaService.selectById(id);
    }

    /**
     * 分页查询地区信息
     * @param map
     * @return
     */
    @GetMapping("/select")
    JSONObject selectAll(@RequestParam Map<String,Object> map){
        return this.areaService.selectAll(map);
    }

}
