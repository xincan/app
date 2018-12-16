package com.hyt.client.service.sys;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 地区信息接口层
 * @Author: JiangXincan
 * @Description:
 * @Date: Created in 17:04 2018-4-18
 * @Modified By:
 */
@Service("areaService")
@FeignClient("EWIP-SERVER")
public interface IAreaService {

    /**
     * 添加地区信息
     * @param map
     * @return
     */
    @PostMapping("/area/insert")
    JSONObject insert(@RequestParam Map<String, Object> map);

    /**
     * 修改地区信息
     * @param map
     * @return
     */
    @PostMapping("/area/update")
    JSONObject update(@RequestParam Map<String, Object> map);

    /**
     * 根据地区id删除地区信息
     * @param id
     * @return
     */
    @DeleteMapping("/area/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id);

    /**
     * 根据ids批量删除地区信息
     * @param id
     * @return
     */
    @PostMapping("/area/delete")
    JSONObject deleteBatch(@RequestParam("id") String id);

    /**
     * 根据用户id查询地区详细信息
     * @param id
     * @return
     */
    @GetMapping("/area/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id);

    /**
     * 分页查询地区信息
     * @param map
     * @return
     */
    @GetMapping("/area/select")
    JSONObject selectAll(@RequestParam Map<String, Object> map);

}
