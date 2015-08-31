package com.test;

public class Test142 {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		System.out.println(new Test142().showURL());
	}
	public String showURL() {
		return this.getClass().getResource("/").toString();
	} 
}
