package com.test;

import java.util.Date;

import org.joda.time.DateTime;

import com.lombok.AbcBean;

public class Test142 {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		java.util.Date jdkDate = new Date();
		DateTime dateTime = new DateTime(jdkDate);
		System.out.println(dateTime.toString("yyyy-MM-dd HH:mm:ss.SSS"));
	AbcBean a = new AbcBean();
	a.getName();
//	a.getName()
//	a.
		
		String companyTel = "1234,456-11#23";
		String[] tels = companyTel.split(",");
		for(String tel:tels){
			if(tel.length()<4||tel.length()>13){
				System.out.println("出错");
			}
			if(!checkTel(tel)){
				System.out.println("出错11");
			}
			
		}
		
		
		
		
		
		
		
		
		
		
		
//		String parms = "useremail=corp"  
//    			+ "&from=oa" 
//    			+ "&apikey=NzUTI3RGxobUpuNFhkN09jai84cFVtaDZVNnNJTTF0dnBQNUVvemtweHKAnduz18da4";
//       System.out.println(HttpUtil.getHttpContent("POST",
//                        "https://service.netease.com:5001/checkuser",  
//                        parms) );
//		String restr = HttpUtil.getHttpsContent("GET", "https://www.baidu.com/", "");
//		System.out.println(restr);
	}
	
	
	private static boolean checkTel(String str){
		char[] chars=		str.toCharArray();
		for(char c:chars){
			if("0123456789-".indexOf(c)<0)
				return false;
		}
		return true;
	}
	public String showURL() {
		return this.getClass().getResource("/").toString();
	} 
}
