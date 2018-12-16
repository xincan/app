package com.hyt.server.mapper.sys;

import com.hyt.server.config.common.universal.IBaseMapper;
import com.hyt.server.entity.sys.Area;
import com.hyt.server.entity.sys.Menu;
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
@Repository("menuMapper")
public interface IMenuMapper extends IBaseMapper<Menu> {

    /**
     * 分页查询菜单信息
     * @param map
     * @return
     */
    List<Menu> findAll(Map<String, Object> map);

}
