package com.hyt.server.entity.sys;

import com.alibaba.fastjson.annotation.JSONField;
import io.swagger.annotations.ApiModel;

import javax.persistence.*;
import java.util.Date;

/**
 * Copyright (C), 2015-2018
 * FileName: Organization
 * Author:   JiangXincan
 * Date:     2018-4-30 10:44
 * Description: 机构实体类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */

@ApiModel(value = "Organization",description = "机构信息")
@Table(name = "organization")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",length = 64)
    private String id;

    @Column(name = "organization_name",length = 50)
    private String organizationName;

    @Column(name = "code",length = 50)
    private String code;

    @Column(name = "p_id",length = 64)
    private String pId;

    @Column(name = "area_id",length = 64)
    private String areaId;

    @Column(name = "type",length = 1)
    private Integer type;

    @JSONField(format="yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time")
    private Date createTime;


    private String parentName;

    private String areaName;

    private Integer child;

    public Organization() {
    }

    public Organization(String organizationName, String code, String pId, String areaId, Integer type, Date createTime, String parentName, String areaName, Integer child) {
        this.organizationName = organizationName;
        this.code = code;
        this.pId = pId;
        this.areaId = areaId;
        this.type = type;
        this.createTime = createTime;
        this.parentName = parentName;
        this.areaName = areaName;
        this.child = child;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getpId() {
        return pId;
    }

    public void setpId(String pId) {
        this.pId = pId;
    }

    public String getAreaId() {
        return areaId;
    }

    public void setAreaId(String areaId) {
        this.areaId = areaId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public Integer getChild() {
        return child;
    }

    public void setChild(Integer child) {
        this.child = child;
    }
}
