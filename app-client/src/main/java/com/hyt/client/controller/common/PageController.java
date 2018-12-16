package com.hyt.client.controller.common;

import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * @Copyright (C), 2015-2018
 * @FileName: PageController
 * @Author:   JiangXincan
 * @Date:     2018-5-8 15:57
 * @Description: ${DESCRIPTION}
 * @History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名         修改时间          版本号             描述
 */
@Controller
public class PageController {


    /**
     * 进入框架界面
     * @return
     */
    @RequestMapping({"/","/index"})
    public String index(){
        return "main/index";
    }

    /**
     * 进入主界面
     * @return
     */
    @RequestMapping("/home")
    public String home(){
        return "main/home";
    }

    /**
     * 页面跳转通用方法
     * @param model 模块编码
     * @param name  模块名称
     * @return
     */
    @RequestMapping("/page/{model}/{name}")
    public ModelAndView page(@PathVariable("model") String model, @PathVariable("name") String name, @RequestParam Map<String, Object> map){
        return new ModelAndView(model + "/" + name, map);
    }

    /**
     *  页面跳转通用方法
     * @param model  模块目录
     * @param name   模块名称
     * @param option 传输数据
     * @return
     */
    @RequestMapping("/page/{model}/{name}/{option}")
    public ModelAndView page(@PathVariable("model") String model,@PathVariable("name") String name, @PathVariable("option") String option){
        Map<String, Object> map = new HashMap<>();
        map.put("id", option);
        return new ModelAndView(model + "/" + name, map);
    }

    @RequestMapping("/403")
    public String unauthorizedRole(){
        System.out.println("------没有权限-------");
        return "/main/403";
    }

    /**
     * 员工登录信息
     * @param map
     * @return
     */
    @RequestMapping(value = "/login")
    String signIn(HttpServletRequest request, Map<String, Object> map){
        // 登录失败从request中获取shiro处理的异常信息。
        // shiroLoginFailure:就是shiro异常类的全类名.
        String exception = (String) request.getAttribute("shiroLoginFailure");
        String msg = "";
        if (exception != null) {
            if (UnknownAccountException.class.getName().equals(exception)) {
                msg = "账号不存在";
            }else if(AuthenticationException.class.getName().equals(exception)){
                msg = "用户名或密码错误";
            }else if (IncorrectCredentialsException.class.getName().equals(exception)) {
                msg = "密码不正确";
            } else if ("kaptchaValidateFailed".equals(exception)) {
                msg = "验证码错误";
            } else {
                msg = exception;
            }
        }
        map.put("msg", msg);
        // 此方法不处理登录成功,由shiro进行处理
        return "/main/login";

    }
}
