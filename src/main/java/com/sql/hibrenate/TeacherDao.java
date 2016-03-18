package com.sql.hibrenate;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

@Repository
public class TeacherDao extends BaseDao {

	/**
	 * ORM
	 * 
	 * @param id
	 * @return
	 */
	public TeacherTab getTeacherById(String id) {
		// Session session = getSession();
		// Transaction tx = session.beginTransaction();
		BeginTransaction();

		TeacherTab result = (TeacherTab) load(TeacherTab.class, "1");
		Commit();
		return result;
	}

	/**
	 * 
	 * SQL
	 * 
	 * @param id
	 * @return
	 */
	public TeacherTab getTeacherById2(String id) {
		Session session = getSession();
		BeginTransaction();
		// Transaction tx = session.beginTransaction();
		// TeacherTab result = (TeacherTab) load(TeacherTab.class, "1");
		SQLQuery query = session
				.createSQLQuery("select * from teacher where id=" + id)
				.addEntity(TeacherTab.class);
		List o = query.list();
		Commit();
		return (TeacherTab) o.get(0);
	}

	/**
	 * HQL
	 * 
	 * @param id
	 * @return
	 */
	public TeacherTab getTeacherById3(String id) {
		Session session = getSession();
		BeginTransaction();
		Query query = (Query) session
				.createQuery(" from TeacherTab where id=" + id);
		List o = query.list();
		Commit();
		return (TeacherTab) o.get(0);
	}

	/**
	 * 测试事务控制
	 * 
	 * @return
	 */
	public boolean testTransaction() {
		try {
			BeginTransaction();
			Session session = getSession();
			TeacherTab result = (TeacherTab) load(TeacherTab.class, "1");
			result.setName("12123");
			session.update(result);
			testTransactionSon();

			// int a= 1/0;
			Commit();
		} catch (Exception e) {
			e.printStackTrace();
			RollBacke();
		}

		return true;

	}

	private void testTransactionSon() {

		TeacherTab result = (TeacherTab) load(TeacherTab.class, "1");
		result.setName("zhang6");

	}

}
