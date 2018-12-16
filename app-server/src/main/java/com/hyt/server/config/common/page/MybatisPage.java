package com.hyt.server.config.common.page;

import java.util.Map;

/**
 * Copyright (C), 2015-2018, XXX有限公司
 * FileName: MybatisPage
 * Author:   JiangXincan
 * Date:     2018-5-4 15:47
 * Description: ${DESCRIPTION}
 * History:
 * <author>          <time>          <version>          <desc>
 * 作者姓名           修改时间           版本号              描述
 */
public class MybatisPage {

    public static int page = 0;
    public static int limit = 10;
    /**
     * 计算分页
     * @param map
     * @return
     */
    public static int[] getPageSize(Map<String, Object> map){
        if(map.containsKey("page") && map.containsKey("limit")){
            int p = Integer.parseInt(map.get("page").toString());
            int s = Integer.parseInt(map.get("limit").toString());
            MybatisPage.page = p;
            MybatisPage.limit = s;
        }
        return new int[]{MybatisPage.page, MybatisPage.limit};
    }

    /**
     * 计算分页
     * @param page
     * @param size
     * @return
     */
    public static int[] getPageSize(int page, int size){
        if(size>0){
            MybatisPage.page = (page-1)*size;
            MybatisPage.limit = size;
        }
        return new int[]{MybatisPage.page, MybatisPage.limit};
    }
}
