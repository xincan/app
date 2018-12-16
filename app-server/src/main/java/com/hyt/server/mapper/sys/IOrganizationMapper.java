package com.hyt.server.mapper.sys;

import com.hyt.server.config.common.universal.IBaseMapper;
import com.hyt.server.entity.sys.Organization;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Author: XincanJiang
 * @Description:
 * @Date: Created in 16:30 2018-4-18
 * @Modified By:
 */
@Repository("organizationMapper")
public interface IOrganizationMapper extends IBaseMapper<Organization> {

    /**
     * 分页查询机构信息
     * @param map
     * @return
     */
    List<Organization> findAll(Map<String, Object> map);

    /**
     * 根据地区id查询机构信息
     * @param id
     * @return
     */
    Organization selectById(@Param(value="id") String id);

    /**
     * 根据机构ID，机构类型查询同级的其他机构信息
     * @param map
     * @return
     */
    Organization selectSameGradeByParam(Map<String, Object> map);
    
}
