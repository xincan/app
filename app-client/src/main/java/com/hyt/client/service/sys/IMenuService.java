package com.hyt.client.service.sys;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 菜单信息接口层
 * @Author: JiangXincan
 * @Description:
 * @Date: Created in 17:04 2018-4-18
 * @Modified By:
 */
@Service("menuService")
@FeignClient("EWIP-SERVER")
public interface IMenuService {

    /**
     * 添加菜单信息
     * @param map
     * @return
     */
    @PostMapping("/menu/insert")
    JSONObject insert(@RequestParam Map<String, Object> map);

    /**
     * 修改菜单信息
     * @param map
     * @return
     */
    @PostMapping("/menu/update")
    JSONObject update(@RequestParam Map<String, Object> map);

    /**
     * 根据菜单id删除菜单信息
     * @param id
     * @return
     */
    @DeleteMapping("/menu/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id);

    /**
     * 根据ids批量删除菜单信息
     * @param id
     * @return
     */
    @PostMapping("/menu/delete")
    JSONObject deleteBatch(@RequestParam("id") String id);

    /**
     * 根据用户id查询菜单详细信息
     * @param id
     * @return
     */
    @GetMapping("/menu/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id);

    /**
     * 分页查询菜单信息
     * @param map
     * @return
     */
    @GetMapping("/menu/select")
    JSONObject selectAll(@RequestParam Map<String, Object> map);

}
