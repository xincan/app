package com.hyt.server.service.sys;

import com.github.pagehelper.PageInfo;
import com.hyt.server.config.common.universal.IBaseService;
import com.hyt.server.entity.sys.Organization;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

/**
 * @Author: JiangXincan
 * @Description: 机构管理接口层
 * @Date: Created in 16:29 2018-4-18
 * @Modified By:
 */
public interface IOrganizationService extends IBaseService<Organization> {

    PageInfo<Organization> selectAll(Map<String, Object> map);

    Organization selectById(@Param(value="id") String id);

}
