package com.shiro;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSON;
import com.mvc.BaseController;
import com.sql.hibrenate.TeacherDaoHibernateTemplate;

@Controller
public class LoginController extends BaseController {
	
	@RequestMapping(value = "/login")
	public ModelAndView login(HttpServletRequest request, String username,
			String password) {
		ModelAndView mv = new ModelAndView();
		log.info("loginControler....");
		if (username == null && password == null) {
			mv.setViewName("login");
			return mv;
		}
		Subject currentUser = SecurityUtils.getSubject();
		currentUser.logout();
		UsernamePasswordToken token = new UsernamePasswordToken(username,
				password, true);
		try {
			currentUser.login(token);
			log.info("home..");
			//mv.setViewName("redirect:/home#welcome");//资产前端
			mv.addObject("msg", "zeng");
			
			mv.setViewName("HelloWorldPage");
		} catch (AccountException e) {
			e.printStackTrace();
			log.error(e.getMessage(), e);
			mv.addObject("errorMsg", e.getMessage());
			mv.setViewName("login");
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage(), e);
			mv.addObject("errorMsg", e.getMessage());
			mv.setViewName("login");
		}
		return mv;
	}
	@RequestMapping("/home")
	public String home(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		return "home";
	}
	
	@RequestMapping("/logout")
	public String logout(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		return "login";
	}
	
	@RequestMapping("/")
	public String root(String username, String password, String validateCode,
			HttpServletRequest request) {
		return "login";
	}


	
	/**
	 * 
	 * 测试hibernate
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/hibernate")
	public void hibernate(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
//		TeacherDaoHibernateTemplate a=  new TeacherDaoHibernateTemplate();
//		a.setSessionFactory(null);
		PrintWriter out = response.getWriter();
		Map rootMap = new HashMap();
		rootMap.put("getTeacherById1", teacherDao.getTeacherById("1").getName());
//		rootMap.put("getTeacherById2", teacherDao.getTeacherById2("1").getName());
//		rootMap.put("getTeacherById3", teacherDao.getTeacherById3("1").getName());
//		rootMap.put("template.getTeacherById1", teacherDaoHibernateTemplate.getTeacherById("1").getAge());
//		rootMap.put("template.getTeacherById2", teacherDaoHibernateTemplate.getTeacherById2("1").getAge());
//		rootMap.put("template.getTeacherById3", teacherDaoHibernateTemplate.getTeacherById3("1").getAge());
		teacherDao.testTransaction();
		
		
		rootMap.put("testTransaction", teacherDao.getTeacherById("1").getName());
		
		rootMap.put("status", "true");
		out.println(JSON.toJSONString(rootMap));
	}
	
	/**
	 * 
	 * 测试mybatis
	 * @param request
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping("/mybatis")
	public void mybatis(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		PrintWriter out = response.getWriter();
		Map rootMap = new HashMap();
		rootMap.put("getTeacherByName", mybatisTeacherDao.getTeacherByName("zhang5").getAge());
		rootMap.put("status", "true");
		out.println(JSON.toJSONString(rootMap));
	}
	
	
}