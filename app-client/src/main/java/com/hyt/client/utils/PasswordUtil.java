package com.hyt.client.utils;

import org.apache.shiro.crypto.hash.SimpleHash;

public class PasswordUtil {

    public static void main(String[] args) {
        Object password = new SimpleHash("MD5", "111111",	"zxw", 2);
        System.out.println(password);
    }

}
