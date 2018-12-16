package com.hyt.server.config.common.page;

import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.Date;

/**
 * 默认BaseQuery 包含分页、排序条件
 * 
 * @ClassName: MySQLBaseQuery
 * @author Jiangxincan
 * @date 2018年3月1日 下午3:28:37 
 * @version 1.0
 */
public class MySQLBaseQuery implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(name="page",value="当前页数", dataType = "Integer")
    private Integer page = 0;

    @ApiModelProperty(name="limit",value="每页条数", dataType = "Integer")
    private Integer limit = 10;

    /**
     * 排序的字段名称
     */
    @ApiModelProperty(name="sortName",value="排序字段名称", dataType = "String")
    private String sortName;

    /**
     * 排序规则，默认DESC
     */
    @ApiModelProperty(name="sortOrder",value="排序规则(ASC,DESC)，默认DESC", dataType = "String")
    private String sortOrder;

    /**
     * 开始时间
     */
    @ApiModelProperty(name="startTime",value="开始时间", dataType = "Date")
    private Date startTime;

    /**
     * 结束时间
     */
    @ApiModelProperty(name="endTime",value="结束时间", dataType = "Date")
    private Date endTime;

    public MySQLBaseQuery() {
        super();
    }

    public MySQLBaseQuery(Integer page, Integer limit, String sortName, String sortOrder, Date startTime, Date endTime) {
        this.page = page;
        this.limit = limit;
        this.sortName = sortName;
        this.sortOrder = sortOrder;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Integer getPage() {
        return this.page * this.limit;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return limit;
    }

    public void setSize(Integer size) {
        this.limit = size;
    }

    public String getSortName() {
        return sortName;
    }

    public void setSortName(String sortName) {
        this.sortName = sortName;
    }

    public String getSortOrder() {
        return sortOrder == null || "".equals(sortOrder.trim()) ? "DESC" : sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }
}
