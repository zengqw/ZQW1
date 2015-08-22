package com.jedis;
import redis.clients.jedis.Jedis;


/**
 * 测试spring整合jedis操作redis
 * 启动redis配置  requirepass admin
 * redis-server.exe redis-conf
 * @author Administrator
 *
 */
public class jedisClient extends Jedis {

	public jedisClient(String host, int port) {
		super(host, port);
	}

	public void  init(){
		this.auth("admin");
	}
	
	
}
