package com.hyt.server.entity.sys;

import com.alibaba.fastjson.annotation.JSONField;
import io.swagger.annotations.ApiModel;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 权限实体类
 */
@ApiModel(value = "Permission",description = "权限信息")
@Table(name = "permission")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",length = 64)
    private String id;

    @Column(name = "name", length = 50)
    private String name;                         // 权限名称

    @Column(name = "permission",length = 100)    // 权限字符串,menu例子：role:*，button例子：role:create,role:update,role:delete,role:view
    private String permission;

    @Column(name = "type", length = 20, columnDefinition="enum('menu','button')")
    private String type;                        // 资源类型，[menu|button]

    @Column(name = "url", length = 100)
    private String url;                         // 资源路径.

    @Column(name = "status", length = 1)
    private Integer status;                     // 是否可用：0：不可用；1：可用；如果不可用将不会添加给用户

    @JSONField(format="yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time")
    private Date createTime;

    public Permission() {}

    public Permission(String name, String permission, String type, String url, Integer status, Date createTime) {
        this.name = name;
        this.permission = permission;
        this.type = type;
        this.url = url;
        this.status = status;
        this.createTime = createTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
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
