package com.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 加载配置文件  
 * 项目路径是src/main/resources
 * 打包之后路径是classes下 
 * @author zengqw
 *
 */
public class RedisConfig {
	private static final Properties pro;
	static{
		InputStream in = RedisConfig.class.getResourceAsStream("/redis.properties");
		pro = new Properties();
		try {
			pro.load(in);
		} catch (IOException e) {
			throw new ExceptionInInitializerError("加载初始化配置文件失");
		}
		
	}
	/**
	 * 获取初始化配置项
	 * @param configName
	 * @return
	 */
	public static String getConfig(String configName){
		return pro.getProperty(configName);
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println(RedisConfig.getConfig("redis.host"));
		
	}

}
