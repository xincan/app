package com.hyt.server.entity.sys;

import com.alibaba.fastjson.annotation.JSONField;
import io.swagger.annotations.ApiModel;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * Copyright (C), 2015-2018
 * FileName: Employee
 * Author:   JiangXincan
 * Date:     2018-4-30 10:44
 * Description: 员工实体类
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */

@ApiModel(value = "Employee",description = "员工信息")
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",length = 64)
    private String id;

    @Column(name = "login_name",length = 25, unique = true)
    private String loginName;

    @Column(name = "login_password",length = 64)
    private String loginPassword;

    @Column(name = "name",length = 25)
    private String name;

    @Column(name = "area_id",length = 64)
    private String areaId;

    @Column(name = "organization_id",length = 64)
    private String organizationId;

    @Column(name = "phone",length = 11)
    private String phone;

    @Column(name = "email",length = 50)
    private String email;

    @Column(name = "sex",length = 1)
    private Integer sex;

    @JSONField(format="yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time")
    private Date createTime;

    private String organizationName;

    private Integer organizationType;

    private String organizationCode;

    private String areaName;

    private String level;

    public Employee() {}

    public Employee(String loginName, String loginPassword, String name, String areaId, String organizationId, String phone, String email, Integer sex, Date createTime) {
        this.loginName = loginName;
        this.loginPassword = loginPassword;
        this.name = name;
        this.areaId = areaId;
        this.organizationId = organizationId;
        this.phone = phone;
        this.email = email;
        this.sex = sex;
        this.createTime = createTime;
    }

    public Employee(String loginName, String loginPassword, String name, String areaId, String organizationId, String phone, String email, Integer sex, Date createTime, String organizationName, Integer organizationType, String organizationCode, String areaName, String level) {
        this.loginName = loginName;
        this.loginPassword = loginPassword;
        this.name = name;
        this.areaId = areaId;
        this.organizationId = organizationId;
        this.phone = phone;
        this.email = email;
        this.sex = sex;
        this.createTime = createTime;
        this.organizationName = organizationName;
        this.organizationType = organizationType;
        this.organizationCode = organizationCode;
        this.areaName = areaName;
        this.level = level;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getLoginPassword() {
        return loginPassword;
    }

    public void setLoginPassword(String loginPassword) {
        this.loginPassword = loginPassword;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAreaId() {
        return areaId;
    }

    public void setAreaId(String areaId) {
        this.areaId = areaId;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getSex() {
        return sex;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public Integer getOrganizationType() {
        return organizationType;
    }

    public void setOrganizationType(Integer organizationType) {
        this.organizationType = organizationType;
    }

    public String getOrganizationCode() {
        return organizationCode;
    }

    public void setOrganizationCode(String organizationCode) {
        this.organizationCode = organizationCode;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
