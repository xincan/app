package com.hyt.server.service.impl.sys;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.page.MybatisPage;
import com.hyt.server.config.common.universal.AbstractService;
import com.hyt.server.entity.sys.Organization;
import com.hyt.server.mapper.sys.IOrganizationMapper;
import com.hyt.server.service.sys.IOrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 机构管理业务实现层
 * @Author: JiangXincan
 * @Description:
 * @Date: Created in 16:29 2018-4-18
 * @Modified By:
 */
@Service("organizationService")
public class OrganizationServiceImpl extends AbstractService<Organization> implements IOrganizationService {

    @Autowired
    private IOrganizationMapper organizationMapper;

    /**
     * 分页查询机构信息
     * @param map
     * @return
     */
    @Override
    public PageInfo<Organization> selectAll(Map<String, Object> map) {
        MybatisPage.getPageSize(map);
        PageHelper.startPage(MybatisPage.page, MybatisPage.limit);
        List<Organization> organizationList = this.organizationMapper.findAll(map);
        return new PageInfo<>(organizationList);
    }

    @Override
    public Organization selectById(String id){
        return this.organizationMapper.selectById(id);
    }
}
