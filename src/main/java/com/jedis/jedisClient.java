package com.jedis;
import redis.clients.jedis.Jedis;


/**
 * ����spring����jedis����redis
 * ����redis����  requirepass admin
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
