package com.hyt.client.service.sys;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 权限信息接口层
 * @Author: JiangXincan
 * @Description:
 * @Date: Created in 17:04 2018-4-18
 * @Modified By:
 */
@Service("permissionService")
@FeignClient("EWIP-SERVER")
public interface IPermissionService {

    /**
     * 添加权限信息
     * @param map
     * @return
     */
    @PostMapping("/permission/insert")
    JSONObject insert(@RequestParam Map<String, Object> map);

    /**
     * 修改权限信息
     * @param map
     * @return
     */
    @PostMapping("/permission/update")
    JSONObject update(@RequestParam Map<String, Object> map);

    /**
     * 根据权限id删除权限信息
     * @param id
     * @return
     */
    @DeleteMapping("/permission/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id);

    /**
     * 根据ids批量删除权限信息
     * @param id
     * @return
     */
    @PostMapping("/permission/delete")
    JSONObject deleteBatch(@RequestParam("id") String id);

    /**
     * 根据用户id查询权限详细信息
     * @param id
     * @return
     */
    @GetMapping("/permission/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id);

    /**
     * 分页查询权限信息
     * @param map
     * @return
     */
    @GetMapping("/permission/select")
    JSONObject selectAll(@RequestParam Map<String, Object> map);

    /**
     * 分页查询权限信息
     * @param map
     * @return
     */
    @GetMapping("/permission/select/all")
    JSONObject selectByPermissionName(@RequestParam Map<String, Object> map);



}
