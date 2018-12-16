package com.hyt.server.config.common.universal;

import tk.mybatis.mapper.entity.Condition;

import java.util.List;

/**
 * @Description: Service层基础接口，其他Service接口请继承该接口
 * @author JiangXincan
 * @date 2018/4/18 11:25
 */
public interface IBaseService<T> {

    /**
     * 添加对象信息
     * @param model
     * @return Integer
     */
    Integer insert(T model);

    /**
     * 根据主键id删除对应对象
     * @param id
     * @return Integer
     */
    Integer deleteById(String id);

    /**
     * @param ids
     * @Description: 根据一批id，批量刪除 eg：ids -> “1,2,3,4”
     * @Reutrn Integer
     */
    Integer deleteByIds(String ids);

    /**
     * @param model
     * @Description: 更新对象信息，传入对象必须有对象主键id
     * @Reutrn Integer
     */
    Integer update(T model);

    /**
     * @param id
     * @Description: 根据主键id查询对应对象信息
     * @Reutrn T
     */
    T selectById(String id);

    /**
     * @param ids
     * @Description: 根据一批主键id查询对应对象信息集合，例如（"1,2,3"）
     * @Reutrn List<T>
     */
    List<T> selectListByIds(String ids);

    /**
     * 根据条件查找一批对象信息
     * @param condition
     * @return List<T>
     */
    List<T> selectByCondition(Condition condition);

    /**
     * 查询所有对象信息
     * @return List<T>
     */
    List<T> selectAll();

    /**
     * @param record
     * @return List<T>
     * @Description: 根据实体中的属性值进行查询，查询条件使用等号
     */
    List<T> select(T record);

    /**
     * @param record
     * @return T
     * @Description: 根据实体中的属性值进行查询，查询条件使用等号
     */
    T selectOne(T record);
}
