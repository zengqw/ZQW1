package com.sql.hibrenate;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

//@Repository
public class TeacherDaoHibernateTemplate extends HibernateDaoSupport {
//	@Autowired  
//    public void setSessionFactoryOverride(SessionFactory sessionFactory)      {  
//        super.setSessionFactory(sessionFactory);  
//    }  
//	
	/**
	 * ORM
	 * @param id
	 * @return
	 */
	public TeacherTab getTeacherById(String id) {
		return (TeacherTab) getHibernateTemplate().get(TeacherTab.class, "1");
	}
	/**
	 * SQL
	 * @param id
	 * @return
	 */
	public TeacherTab getTeacherById2(String id) {
		Session session = this.getHibernateTemplate().getSessionFactory()
				.getCurrentSession();
		Transaction tx = session.beginTransaction();
		SQLQuery query =session.createSQLQuery("select * from teacher where id="+id).addEntity(TeacherTab.class);
		List o = query.list();
		tx.commit();
		return  (TeacherTab) o.get(0);
		
	}
	

	/**
	 * HQL
	 * @param id
	 * @return
	 */
	public TeacherTab getTeacherById3(String id) {
		List list = getHibernateTemplate().find(" from TeacherTab where id="+id);
		return  (TeacherTab) list.get(0);
		
	}
	
	


}
