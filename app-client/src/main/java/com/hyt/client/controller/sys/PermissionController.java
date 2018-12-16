package com.hyt.client.controller.sys;

import com.alibaba.fastjson.JSONObject;
import com.hyt.client.service.sys.IAreaService;
import com.hyt.client.service.sys.IPermissionService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 权限信息控制层
 * @Date: Created in 10:07 2018-4-19
 * @Modified By:
 */
@RestController
@RequestMapping("permission")
public class PermissionController {

    @Autowired
    private IPermissionService permissionService;

    /**
     * 添加权限信息
     * @param map
     * @return
     */
    @PostMapping("/insert")
    JSONObject insert(@RequestParam Map<String,Object> map){
        return this.permissionService.insert(map);
    }

    /**
     * 修改权限信息
     * @param map
     * @return
     */
    @PostMapping("/update")
    JSONObject update(@RequestParam Map<String,Object> map){
        return this.permissionService.update(map);
    }

    /**
     * 根据权限id删除权限信息
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id){
        return this.permissionService.deleteById(id);
    }

    /**
     * 根据ids批量删除权限信息
     * @param id
     * @return
     */
    @PostMapping("/delete")
    JSONObject deleteBatch(@RequestParam(value = "id") String id){
        return this.permissionService.deleteBatch(id);
    }

    /**
     * 根据权限id查询权限详细信息
     * @param id
     * @return
     */
    @GetMapping("/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id){
        return this.permissionService.selectById(id);
    }

    /**
     * 分页查询权限信息
     * @param map
     * @return
     */
    @GetMapping("/select")
    JSONObject selectAll(@RequestParam Map<String,Object> map){
        return this.permissionService.selectAll(map);
    }

    /**
     * 分页查询权限信息
     * @param map
     * @return
     */
    @GetMapping("/select/all")
    JSONObject selectByPermissionName(@RequestParam Map<String,Object> map){
        return this.permissionService.selectByPermissionName(map);
    }
}
