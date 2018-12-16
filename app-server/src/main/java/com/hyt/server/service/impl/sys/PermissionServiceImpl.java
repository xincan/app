package com.hyt.server.service.impl.sys;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.page.MybatisPage;
import com.hyt.server.config.common.universal.AbstractService;
import com.hyt.server.entity.sys.Area;
import com.hyt.server.entity.sys.Permission;
import com.hyt.server.mapper.sys.IAreaMapper;
import com.hyt.server.mapper.sys.IPermissionMapper;
import com.hyt.server.service.sys.IAreaService;
import com.hyt.server.service.sys.IPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @Author: XincanJiang
 * @Description:
 * @Date: Created in 16:29 2018-4-18
 * @Modified By:
 */
@Service("permissionService")
public class PermissionServiceImpl extends AbstractService<Permission> implements IPermissionService {

    @Autowired
    private IPermissionMapper permissionMapper;

    @Override
    public PageInfo<Permission> selectAll(Map<String, Object> map) {
        MybatisPage.getPageSize(map);
        PageHelper.startPage(MybatisPage.page, MybatisPage.limit);
        List<Permission> areaList = this.permissionMapper.findAll(map);
        return new PageInfo<>(areaList);
    }

    @Override
    public List<Permission> selectById(Map<String, Object> map){
        return this.permissionMapper.findPermissionByRoleId(map);
    }

    @Override
    public List<Permission> selectByPermissionName(Map<String, Object> map){
        return this.permissionMapper.selectByPermissionName(map);
    }

}
