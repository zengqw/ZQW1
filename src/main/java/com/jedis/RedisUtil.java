package com.jedis;

import com.config.RedisConfig;
import com.util.StringUtil;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

/**
 * ����redis�����ӳ�
 * @author zengqw
 *
 */
public final class RedisUtil {
    
    //Redis������IP
    private static String ADDR = RedisConfig.getConfig("redis.host");
    
    //Redis�Ķ˿ں�
    private static int PORT = StringUtil.str2int(RedisConfig.getConfig("redis.port"));
    
    //��������
    private static String AUTH = RedisConfig.getConfig("redis.pass");
    
    //��������ʵ���������Ŀ��Ĭ��ֵΪ8��
    //�����ֵΪ-1�����ʾ�����ƣ����pool�Ѿ�������maxActive��jedisʵ�������ʱpool��״̬Ϊexhausted(�ľ�)��
    private static int MAX_ACTIVE = 1024;
    
    //����һ��pool����ж��ٸ�״̬Ϊidle(���е�)��jedisʵ����Ĭ��ֵҲ��8��
    private static int MAX_IDLE = 200;
    
    //�ȴ��������ӵ����ʱ�䣬��λ���룬Ĭ��ֵΪ-1����ʾ������ʱ����������ȴ�ʱ�䣬��ֱ���׳�JedisConnectionException��
    private static int MAX_WAIT = 10000;
    
    private static int TIMEOUT = 10000;
    
    //��borrowһ��jedisʵ��ʱ���Ƿ���ǰ����validate���������Ϊtrue����õ���jedisʵ�����ǿ��õģ�
    private static boolean TEST_ON_BORROW = true;
    
    private static JedisPool jedisPool = null;
    
    /**
     * ��ʼ��Redis���ӳ�
     */
    static {
        try {
            JedisPoolConfig config = new JedisPoolConfig();
            config.setMaxActive(MAX_ACTIVE);
            config.setMaxIdle(MAX_IDLE);
            config.setMaxWait(MAX_WAIT);
            config.setTestOnBorrow(TEST_ON_BORROW);
            jedisPool = new JedisPool(config, ADDR, PORT, TIMEOUT, AUTH);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    /**
     * ��ȡJedisʵ��
     * @return
     */
    public synchronized static Jedis getJedis() {
        try {
            if (jedisPool != null) {
                Jedis resource = jedisPool.getResource();
                return resource;
            } else {
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * �ͷ�jedis��Դ
     * @param jedis
     */
    public static void returnResource(final Jedis jedis) {
        if (jedis != null) {
            jedisPool.returnResource(jedis);
        }
    }
}