package com.hyt.client.service.sys;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 角色信息接口层
 * @Author: JiangXincan
 * @Description:
 * @Date: Created in 17:04 2018-4-18
 * @Modified By:
 */
@Service("roleService")
@FeignClient("EWIP-SERVER")
public interface IRoleService {

    /**
     * 添加角色信息
     * @param map
     * @return
     */
    @PostMapping("/role/insert")
    JSONObject insert(@RequestParam Map<String, Object> map);

    /**
     * 修改角色信息
     * @param map
     * @return
     */
    @PostMapping("/role/update")
    JSONObject update(@RequestParam Map<String, Object> map);

    /**
     * 根据角色id删除角色信息
     * @param id
     * @return
     */
    @DeleteMapping("/role/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id);

    /**
     * 根据ids批量删除角色信息
     * @param id
     * @return
     */
    @PostMapping("/role/delete")
    JSONObject deleteBatch(@RequestParam("id") String id);

    /**
     * 根据用户id查询角色详细信息
     * @param id
     * @return
     */
    @GetMapping("/role/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id);

    /**
     * 分页查询角色信息
     * @param map
     * @return
     */
    @GetMapping("/role/select")
    JSONObject selectAll(@RequestParam Map<String, Object> map);

    /**
     * 查询角色信息
     * @param map
     * @return
     */
    @GetMapping("/role/select/all")
    JSONObject selectByRoleName(@RequestParam Map<String, Object> map);


    /**
     * 角色配置菜单
     * @param map
     * @return
     */
    @PostMapping("/role/menu")
    JSONObject insertRoleMenu(@RequestParam Map<String, Object> map);

    /**
     * 根据角色ID查询拥有的菜单信息
     * @param map
     * @return
     */
    @GetMapping("/role/select/menu")
    JSONObject selectRoleInMenu(@RequestParam Map<String,Object> map);


    /**
     * 角色配置权限
     * @param map
     * @return
     */
    @PostMapping("/role/permission")
    JSONObject insertRolePermission(@RequestParam Map<String, Object> map);

    /**
     * 根据角色ID查询拥有的权限信息
     * @param map
     * @return
     */
    @GetMapping("/role/select/permission")
    JSONObject selectRoleInPermission(@RequestParam Map<String,Object> map);

}
