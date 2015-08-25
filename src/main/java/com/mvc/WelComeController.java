package com.mvc;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import redis.clients.jedis.Jedis;

@Controller
@RequestMapping("/welcome")
public class WelComeController {

	@Autowired
	@Resource(name="jedis")
	private Jedis jedis;
	
	@RequestMapping(method = RequestMethod.GET)
	public String helloWorld(ModelMap model) {
		jedis.set("bnm", "²âÊÔjedisÍ¨¹ý111");
		System.out.println("Test jedis "+ jedis.get("bnm"));
		model.addAttribute("msg", "hello worlsdf");

		return "HelloWorldPage";
	}
}