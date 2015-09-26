package com.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/welcome")
public class WelComeController {
	
	@RequestMapping(method = RequestMethod.GET)
	public String helloWorld(ModelMap model) {

		return "HelloWorldPage";
	}
}