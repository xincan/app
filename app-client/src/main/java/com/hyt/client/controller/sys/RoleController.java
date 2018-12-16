package com.hyt.client.controller.sys;

import com.alibaba.fastjson.JSONObject;
import com.hyt.client.service.sys.IAreaService;
import com.hyt.client.service.sys.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 角色信息控制层
 * @Date: Created in 10:07 2018-4-19
 * @Modified By:
 */
@RestController
@RequestMapping("role")
public class RoleController {

    @Autowired
    private IRoleService roleService;

    /**
     * 添加角色信息
     * @param map
     * @return
     */
    @PostMapping("/insert")
    JSONObject insert(@RequestParam Map<String,Object> map){
        return this.roleService.insert(map);
    }

    /**
     * 修改角色信息
     * @param map
     * @return
     */
    @PostMapping("/update")
    JSONObject update(@RequestParam Map<String,Object> map){
        return this.roleService.update(map);
    }

    /**
     * 根据角色id删除角色信息
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id){
        return this.roleService.deleteById(id);
    }

    /**
     * 根据ids批量删除角色信息
     * @param id
     * @return
     */
    @PostMapping("/delete")
    JSONObject deleteBatch(@RequestParam(value = "id") String id){
        return this.roleService.deleteBatch(id);
    }

    /**
     * 根据角色id查询角色详细信息
     * @param id
     * @return
     */
    @GetMapping("/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id){
        return this.roleService.selectById(id);
    }

    /**
     * 分页查询角色信息
     * @param map
     * @return
     */
    @GetMapping("/select")
    JSONObject selectAll(@RequestParam Map<String,Object> map){
        return this.roleService.selectAll(map);
    }

    /**
     * 查询角色
     * @param map
     * @return
     */
    @GetMapping("/select/all")
    JSONObject selectByRoleName(@RequestParam Map<String,Object> map){
        return this.roleService.selectByRoleName(map);
    }


    /**
     * 根据角色ID查询拥有的权限信息
     * @param map
     * @return
     */
    @PostMapping("/menu")
    public JSONObject selectRoleMenu(@RequestParam Map<String,Object> map){
        return this.roleService.insertRoleMenu(map);
    }

    /**
     * 根据角色ID查询拥有的权限信息
     * @param map
     * @return
     */
    @GetMapping("select/menu")
    public JSONObject selectRoleInMenu(@RequestParam Map<String,Object> map){
        return this.roleService.selectRoleInMenu(map);
    }

    /**
     * 角色配置权限
     * @param map
     * @return
     */
    @PostMapping("/permission")
    JSONObject insertRolePermission(@RequestParam Map<String,Object> map){
        return this.roleService.insertRolePermission(map);
    }

    /**
     * 根据角色ID查询拥有的权限信息
     * @param map
     * @return
     */
    @GetMapping("/select/permission")
    public JSONObject selectRoleInPermission(@RequestParam Map<String,Object> map){
        return this.roleService.selectRoleInPermission(map);
    }

}
