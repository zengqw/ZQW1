package com.jedis;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

import com.util.StringUtil;
import com.utilconfig.RedisConfig;

import redis.clients.jedis.Jedis;

/**
 * 
 * ֱ����Junit���м��ɡ�
 * @author Administrator
 *
 */
public class TestRedis {
	
    private Jedis jedis; 
    
    @Before
    public void setup() {
        //����redis��������192.168.0.100:6379
        jedis = new Jedis(RedisConfig.getConfig("redis.host"), 
        		StringUtil.str2int(RedisConfig.getConfig("redis.port")));
        //Ȩ����֤
        jedis.auth(RedisConfig.getConfig("redis.pass"));  
    }
    
    /**
     * redis�洢�ַ�
     */
    @Test
    public void testString() {
        //-----������----------  
        jedis.set("name","xinxin");//��key-->name�з�����value-->xinxin  
        System.out.println(jedis.get("name"));//ִ�н��xinxin  
        
        jedis.append("name", " is my lover"); //ƴ��
        System.out.println(jedis.get("name")); 
        
        jedis.del("name");  //ɾ��ĳ����
        System.out.println(jedis.get("name"));
        //���ö����ֵ��
        jedis.mset("name","liuling","age","23","qq","476777389");
        jedis.incr("age"); //���м�1����
        System.out.println(jedis.get("name") + "-" + jedis.get("age") + "-" + jedis.get("qq"));
        
    }
    
    /**
     * redis����Map
     */
    @Test
    public void testMap() {
        //-----������----------  
        Map<String, String> map = new HashMap<String, String>();
        map.put("name", "xinxin");
        map.put("age", "22");
        map.put("qq", "123456");
        jedis.hmset("user1",map);
        //ȡ��user1�е�name��ִ�н��:[minxr]-->ע������һ�����͵�List  
        //��һ�������Ǵ���redis��map�����key���������Ƿ���map�еĶ����key�������key���Ը������ǿɱ����  
        List<String> rsmap = jedis.hmget("user1", "name", "age", "qq");
        System.out.println(rsmap);  
  
        //ɾ��map�е�ĳ����ֵ  
        jedis.hdel("user1","age");
        System.out.println(jedis.hmget("user1", "age")); //��Ϊɾ���ˣ����Է��ص���null  
        System.out.println(jedis.hlen("user1")); //����keyΪuser1�ļ��д�ŵ�ֵ�ĸ���2 
        System.out.println(jedis.exists("user1"));//�Ƿ����keyΪuser1�ļ�¼ ����true  
        System.out.println(jedis.hkeys("user1"));//����map�����е�����key  
        System.out.println(jedis.hvals("user1"));//����map�����е�����value 
  
        Iterator<String> iter=jedis.hkeys("user1").iterator();  
        while (iter.hasNext()){  
            String key = iter.next();  
            System.out.println(key+":"+jedis.hmget("user1",key));  
        }  
    }
    
    /** 
     * jedis����List 
     */  
    @Test  
    public void testList(){  
        //��ʼǰ�����Ƴ����е�����  
        jedis.del("java framework");  
        System.out.println(jedis.lrange("java framework",0,-1));  
        //����key java framework�д���������  
        jedis.lpush("java framework","spring");  
        jedis.lpush("java framework","struts");  
        jedis.lpush("java framework","hibernate");  
        //��ȡ���������jedis.lrange�ǰ���Χȡ����  
        // ��һ����key���ڶ�������ʼλ�ã�������ǽ���λ�ã�jedis.llen��ȡ���� -1��ʾȡ������  
        System.out.println(jedis.lrange("java framework",0,-1));  
        
        jedis.del("java framework");
        jedis.rpush("java framework","spring");  
        jedis.rpush("java framework","struts");  
        jedis.rpush("java framework","hibernate"); 
        System.out.println(jedis.lrange("java framework",0,-1));
    }  
    
    /** 
     * jedis����Set 
     */  
    @Test  
    public void testSet(){  
        //���  
        jedis.sadd("userSet","liuling");  
        jedis.sadd("userSet","xinxin");  
        jedis.sadd("userSet","ling");  
        jedis.sadd("userSet","zhangxinxin");
        jedis.sadd("userSet","who");  
        //�Ƴ�noname  
        jedis.srem("userSet","who");  
        System.out.println(jedis.smembers("userSet"));//��ȡ���м����value  
        System.out.println(jedis.sismember("userSet", "who"));//�ж� who �Ƿ���userSet���ϵ�Ԫ��  
        System.out.println(jedis.srandmember("userSet"));  
        System.out.println(jedis.scard("userSet"));//���ؼ��ϵ�Ԫ�ظ���  
    }  
  
    @Test  
    public void test() throws InterruptedException {  
        //jedis ����  
        //ע�⣬�˴���rpush��lpush��List�Ĳ�������һ��˫�����?���ӱ��������ģ�  
        jedis.del("a");//�������ݣ��ټ�����ݽ��в���  
        jedis.rpush("a", "1");  
        jedis.lpush("a","6");  
        jedis.lpush("a","3");  
        jedis.lpush("a","9");  
        System.out.println(jedis.lrange("a",0,-1));// [9, 3, 6, 1]  
        System.out.println(jedis.sort("a")); //[1, 3, 6, 9]  //�����������  
        System.out.println(jedis.lrange("a",0,-1));  
    }  
    
    @Test
    public void testRedisPool() {
        RedisUtil.getJedis().set("newname", "���Ĳ���");
        System.out.println(RedisUtil.getJedis().get("newname"));
    }
}