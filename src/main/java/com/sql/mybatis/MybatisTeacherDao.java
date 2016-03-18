package com.sql.mybatis;

import javax.annotation.Resource;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class MybatisTeacherDao {
	@Resource(name="mysqlSqlSession")
	private SqlSessionTemplate sqlSession;

	public Teacher getTeacherByName(String name){
		
		return sqlSession.selectOne("com.mabatis.model.TeacherMap.getTeacherByName",name);
		
	}
	
}
