package com.hyt.server.service.impl.sys;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.page.MybatisPage;
import com.hyt.server.config.common.universal.AbstractService;
import com.hyt.server.entity.sys.Area;
import com.hyt.server.entity.sys.Menu;
import com.hyt.server.mapper.sys.IAreaMapper;
import com.hyt.server.mapper.sys.IMenuMapper;
import com.hyt.server.service.sys.IAreaService;
import com.hyt.server.service.sys.IMenuService;
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
@Service("menuService")
public class MenuServiceImpl extends AbstractService<Menu> implements IMenuService {

    @Autowired
    private IMenuMapper menuMapper;

    @Override
    public PageInfo<Menu> selectAll(Map<String, Object> map) {
        MybatisPage.getPageSize(map);
        PageHelper.startPage(MybatisPage.page, MybatisPage.limit);
        List<Menu> areaList = this.menuMapper.findAll(map);
        return new PageInfo<>(areaList);
    }

}
