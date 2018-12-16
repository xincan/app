package com.hyt.server.service.impl.sys;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.page.MybatisPage;
import com.hyt.server.config.common.universal.AbstractService;
import com.hyt.server.entity.sys.Area;
import com.hyt.server.mapper.sys.IAreaMapper;
import com.hyt.server.service.sys.IAreaService;
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
@Service("areaService")
public class AreaServiceImpl extends AbstractService<Area> implements IAreaService {

    @Autowired
    private IAreaMapper areaMapper;

    @Override
    public PageInfo<Area> selectAll(Map<String, Object> map) {
        MybatisPage.getPageSize(map);
        PageHelper.startPage(MybatisPage.page, MybatisPage.limit);
        List<Area> areaList = this.areaMapper.findAll(map);
        return new PageInfo<>(areaList);
    }

    @Override
    public Area selectById(String id){
        return this.areaMapper.selectById(id);
    }

}
