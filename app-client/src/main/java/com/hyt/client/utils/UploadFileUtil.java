package com.hyt.client.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.io.FileUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.IOException;

/**
 * 文件上传
 */
public class UploadFileUtil {

    /**
     * 资源上传(单文件上传)
     * @param file
     * @param uploadPath
     * @param level
     * @return
     */
    public static String upload(MultipartFile file, String uploadPath, String level){
        BufferedOutputStream bw = null;
        try {
            String fileName = file.getOriginalFilename();
            //判断是否有文件且是否为图片文件
            if(fileName!=null && !"".equalsIgnoreCase(fileName.trim()) && isImageFile(fileName)) {
                //创建输出文件对象
                File outFile = new File(uploadPath + "/" + level + "/" + fileName);
                //拷贝文件到输出文件对象
                FileUtils.copyInputStreamToFile(file.getInputStream(), outFile);
            }
            return "/" + level + "/" + fileName;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if(bw!=null) {bw.close();}
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 删除单个文件
     *
     * @param fileName
     *            要删除的文件的文件名
     * @return 单个文件删除成功返回true，否则返回false
     */
    public static boolean deleteFile(String fileName) {
        File file = new File(fileName);
        // 如果文件路径所对应的文件存在，并且是一个文件，则直接删除
        if (file.exists() && file.isFile()) {
            if (file.delete()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * 资源上传(多文件文件上传)
     * @param files
     * @param uploadPath
     * @param level
     * @return
     */
    public static JSONArray upload(MultipartFile[] files, String uploadPath, String level){
        if(files.length == 0) return null;
        BufferedOutputStream bw = null;
        JSONArray array = new JSONArray();
        try {
            for(MultipartFile file : files){
                JSONObject json = new JSONObject();
                String fileName = file.getOriginalFilename();
                //判断是否有文件
                if(!StringUtils.isEmpty(fileName)) {
                    //创建输出文件对象
                    File outFile = new File(uploadPath + "/" + level + "/" + fileName);
                    //拷贝文件到输出文件对象
                    FileUtils.copyInputStreamToFile(file.getInputStream(), outFile);
                    json.put("name", fileName);
                    json.put("size",file.getSize());
                    json.put("url","/" + level + "/" + fileName);
                    array.add(json);
                }

            }
            return array;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if(bw!=null) {bw.close();}
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    /**
     * 删除多个文件
     *
     * @param fileName
     *            要删除的文件的文件名
     * @return 多个文件删除成功返回true，否则返回false
     */
    public static boolean deleteFile(String[] fileName) {
        boolean bool = false;
        if(fileName.length>0){
            for(int i = 0; i<fileName.length; i++){
                File file = new File(fileName[i]);
                // 如果文件路径所对应的文件存在，并且是一个文件，则直接删除
                if(file.exists() && file.isFile()){
                    bool = file.delete();
                }
            }
        }
        return  bool;
    }

    /**
     * 判断文件是否为图片文件
     * @param fileName
     * @return
     */
    private static Boolean isImageFile(String fileName) {
        String[] img_type = new String[]{".jpg", ".jpeg", ".png", ".gif", ".bmp"};
        if(fileName == null) return false;
        fileName = fileName.toLowerCase();
        for(String type : img_type){
            if(fileName.endsWith(type)) return true;
        }
        return false;
    }

    /**
     * 获取文件后缀名
     * @param fileName
     * @return
     */
    private static String getFileType(String fileName) {
        if(fileName!=null && fileName.indexOf(".")>=0) {
            return fileName.substring(fileName.lastIndexOf("."), fileName.length());
        }
        return "";
    }
}
