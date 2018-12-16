package com.hyt.client.controller.sys;

import com.alibaba.fastjson.JSONObject;
import com.hyt.client.service.sys.IAreaService;
import com.hyt.client.service.sys.IMenuService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 菜单信息控制层
 * @Date: Created in 10:07 2018-4-19
 * @Modified By:
 */
@RestController
@RequestMapping("menu")
public class MenuController {

    @Autowired
    private IMenuService menuService;

    /**
     * 添加菜单信息
     * @param map
     * @return
     */
    @PostMapping("/insert")
    JSONObject insert(@RequestParam Map<String,Object> map){
        Subject subject = SecurityUtils.getSubject();
        JSONObject employee = (JSONObject) subject.getSession().getAttribute("employee");
        map.put("areaId", employee.getString("areaId"));
        map.put("organizationId", employee.getString("organizationId"));
        return this.menuService.insert(map);
    }

    /**
     * 修改菜单信息
     * @param map
     * @return
     */
    @PostMapping("/update")
    JSONObject update(@RequestParam Map<String,Object> map){
        return this.menuService.update(map);
    }

    /**
     * 根据菜单id删除菜单信息
     * @param id
     * @return
     */
    @DeleteMapping("/delete/{id}")
    JSONObject deleteById(@PathVariable(value = "id") String id){
        return this.menuService.deleteById(id);
    }

    /**
     * 根据ids批量删除菜单信息
     * @param id
     * @return
     */
    @PostMapping("/delete")
    JSONObject deleteBatch(@RequestParam(value = "id") String id){
        return this.menuService.deleteBatch(id);
    }

    /**
     * 根据菜单id查询菜单详细信息
     * @param id
     * @return
     */
    @GetMapping("/select/{id}")
    JSONObject selectById(@PathVariable(value = "id") String id){
        return this.menuService.selectById(id);
    }

    /**
     * 分页查询菜单信息
     * @param map
     * @return
     */
    @GetMapping("/select")
    JSONObject selectAll(@RequestParam Map<String,Object> map){
        return this.menuService.selectAll(map);
    }

}
