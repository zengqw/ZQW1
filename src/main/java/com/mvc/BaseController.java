package com.mvc;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.sql.hibrenate.TeacherDao;
import com.sql.hibrenate.TeacherDaoHibernateTemplate;
import com.sql.mybatis.MybatisTeacherDao;

public class BaseController {
	protected static Log log = LogFactory.getLog("assetinfo");
	@Resource
	protected TeacherDao teacherDao;
	@Resource
	protected TeacherDaoHibernateTemplate teacherDaoHibernateTemplate;
	
	@Resource
	protected MybatisTeacherDao mybatisTeacherDao;
	
}