package com.hyt.server.entity.sys;

import com.alibaba.fastjson.annotation.JSONField;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 角色实体类
 */
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",length = 64)
    private String id;

    @Column(name = "role",length = 50)
    private String role;                        // 角色名称

    @Column(name = "description",length = 200)
    private String description;                 // 角色描述,UI界面显示使用

    @Column(name = "status",length = 1)
    private Integer status;                     // 是否可用：0：不可用；1：可用；如果不可用将不会添加给用户

    @JSONField(format="yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time")
    private Date createTime;

    public Role() {}

    public Role(String role, String description, Integer status, Date createTime) {
        this.role = role;
        this.description = description;
        this.status = status;
        this.createTime = createTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
