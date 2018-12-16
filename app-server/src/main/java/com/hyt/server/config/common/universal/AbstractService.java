package com.hyt.server.config.common.universal;

import org.springframework.beans.factory.annotation.Autowired;
import tk.mybatis.mapper.entity.Condition;

import java.lang.reflect.ParameterizedType;
import java.util.List;

/**
 * @Description: 基于通用MyBatis Mapper插件的Service接口的实现
 * @author JiangXincan
 * @date 2018/4/18 11:28
 */
public abstract class AbstractService<T> implements IBaseService<T> {

	@Autowired
	protected IBaseMapper<T> mapper;

	/**
	 * 	当前泛型真实类型的Class
 	 */
	private Class<T> modelClass;

	@SuppressWarnings("unchecked")
	public AbstractService() {
		ParameterizedType pt = (ParameterizedType) this.getClass().getGenericSuperclass();
		modelClass = (Class<T>) pt.getActualTypeArguments()[0];
	}

	/**
	 * 添加对象信息
	 * @param model
	 * @return Integer
	 */
	@Override
	public Integer insert(T model) {
		return mapper.insertSelective(model);
	}

	/**
	 * 根据主键id删除对应对象
	 * @param id
	 * @return
	 */
	@Override
	public Integer deleteById(String id) {
		return mapper.deleteByPrimaryKey(id);
	}

	/**
	 * @param ids
	 * @Description: 根据一批id，批量刪除 eg：ids -> “1,2,3,4”
	 * @Reutrn Integer
	 */
	@Override
	public Integer deleteByIds(String ids) {
		return mapper.deleteByIds(ids);
	}

	/**
	 * @param model
	 * @Description: 更新对象信息，传入对象必须有对象主键id
	 * @Reutrn Integer
	 */
	@Override
	public Integer update(T model) {
		return mapper.updateByPrimaryKeySelective(model);
	}

	/**
	 * @param id
	 * @Description: 根据主键id查询对应对象信息
	 * @Reutrn T
	 */
	@Override
	public T selectById(String id) {
		return mapper.selectByPrimaryKey(id);
	}

	/**
	 * @param ids
	 * @Description: 根据一批主键id查询对应对象信息集合，例如（"1,2,3"）
	 * @Reutrn List<T>
	 */
	@Override
	public List<T> selectListByIds(String ids) {
		return mapper.selectByIds(ids);
	}

	/**
	 * 根据条件查找一批对象信息
	 * @param condition
	 * @return List<T>
	 */
	@Override
	public List<T> selectByCondition(Condition condition) {
		return mapper.selectByCondition(condition);
	}

	/**
	 * 查询所有对象信息
	 * @return List<T>
	 */
	@Override
	public List<T> selectAll() {
		return mapper.selectAll();
	}

	/**
	 * 根据实体中的属性值进行查询，查询条件使用等号
	 * @param record
	 * @return List<T>
	 */
	@Override
	public List<T> select(T record){
		return mapper.select(record);
	}

	/**
	 * 根据实体中的属性值进行查询，查询条件使用等号
	 * @param recoed
	 * @return T
	 */
	@Override
	public T selectOne(T recoed){
		return mapper.selectOne(recoed);
	}
}