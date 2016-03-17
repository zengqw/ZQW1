package com.test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.URL;
import java.net.UnknownHostException;
import java.security.cert.X509Certificate;
import java.util.Enumeration;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.servlet.http.HttpServletRequest;

public class HttpUtil {
	public static String getHttpsContentByGet(String linkUrl) {
		return getHttpsContent("GET", linkUrl, "");
	}

	public static String getHttpsContentByPost(String linkUrl, String postData) {
		return getHttpsContent("POST", linkUrl, postData);
	}

	public static String getHttpContentByGet(String linkUrl) {
		return getHttpContent("GET", linkUrl, "");
	}

	public static String getHttpContentByPOST(String linkUrl) {
		return getHttpContent("POST", linkUrl, "");
	}

	public static String getHttpContentByPOSTI(String linkUrl, String postData) {
		return getHttpContent("POST", linkUrl, postData);
	}

	/**
	 * 获取服务器IP地址
	 * 
	 * @return
	 */
	public static String getServerIp() {
		String SERVER_IP = "";
		try {
			Enumeration netInterfaces = NetworkInterface.getNetworkInterfaces();
			InetAddress ip = null;
			while (netInterfaces.hasMoreElements()) {
				NetworkInterface ni = (NetworkInterface) netInterfaces.nextElement();
				ip = ni.getInetAddresses().nextElement();
				SERVER_IP = ip.getHostAddress();
				if (!ip.isSiteLocalAddress() && !ip.isLoopbackAddress() && ip.getHostAddress().indexOf(":") == -1) {
					SERVER_IP = ip.getHostAddress();
					break;
				} else {
					ip = null;
				}
			}
		} catch (SocketException e) {

			e.printStackTrace();
		}

		return SERVER_IP;
	}

	/**
	 * 获取服务器IP地址
	 * 
	 * @return
	 */
	public static String getServerIp(HttpServletRequest request) {
		String localAddr = request.getLocalAddr();
		return localAddr;

	}

	/**
	 * 获取用户的ip地址
	 * 
	 * @param request
	 *            用户请求对象
	 */
	public static String getRemoteHost(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}

		return ip.equals("0:0:0:0:0:0:0:1") ? "127.0.0.1" : ip;
	}

	public static String getIpAddr(HttpServletRequest request) {
		String ipAddress = request.getHeader("x-forwarded-for");
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
			ipAddress = request.getHeader("Proxy-Client-IP");
		}
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
			ipAddress = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
			ipAddress = request.getRemoteAddr();
			// 本地正常IP
			String lacalhostIp = "127.0.0.1";
			// 使用WIN7系统可能获取到的IP
			String lacalhostIpv6 = "0:0:0:0:0:0:0:1";
			if (ipAddress.equals(lacalhostIp) || ipAddress.equals(lacalhostIpv6)) {
				// 根据网卡取本机配置的IP
				InetAddress inet = null;
				try {
					inet = InetAddress.getLocalHost();
				} catch (UnknownHostException e) {
					e.printStackTrace();
				}
				ipAddress = inet.getHostAddress();
			}
		}
		// 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
		if (ipAddress != null && ipAddress.length() > 15) { // "***.***.***.***".length()
															// = 15
			if (ipAddress.indexOf(",") > 0) {
				ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
			}
		}
		return ipAddress;
	}

	public static String getHttpContent(String method, String linkUrl, String postData) {

		try {
			URL url = new URL(linkUrl);

			HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
			httpConn.setRequestMethod(method);
			if (!postData.isEmpty()) {
				// httpConn.addRequestProperty("content-type","application/json");
				httpConn.setDoOutput(true);
				httpConn.getOutputStream().write(postData.getBytes("utf-8"));

			}
			BufferedReader br = new BufferedReader(new InputStreamReader(httpConn.getInputStream(), "UTF-8"));
			StringBuffer sb = new StringBuffer();
			String line = null;
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}
			return sb.toString();
		} catch (Exception ex) {
			ex.printStackTrace();
			return "";
		}

	}

	public static String getHttpsContent(String method, String linkUrl, String postData) {

		try {
			URL url = new URL(linkUrl);
			// *******https请求配置start***********************//
			TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
				@Override
				public java.security.cert.X509Certificate[] getAcceptedIssuers() {
					return null;
				}

				@Override
				public void checkClientTrusted(X509Certificate[] certs, String authType) {
				}

				@Override
				public void checkServerTrusted(X509Certificate[] certs, String authType) {
				}
			} };
			SSLContext sc = SSLContext.getInstance("SSL");
			sc.init(null, trustAllCerts, new java.security.SecureRandom());
			HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

			HttpsURLConnection httpConn = (HttpsURLConnection) url.openConnection();
			httpConn.setRequestMethod(method);
			if (!postData.isEmpty()) {
				httpConn.addRequestProperty("content-type", "application/json");
				httpConn.setDoOutput(true);
				httpConn.getOutputStream().write(postData.getBytes());
			}
			BufferedReader br = new BufferedReader(new InputStreamReader(httpConn.getInputStream()));
			StringBuffer sb = new StringBuffer();
			String line = null;
			while ((line = br.readLine()) != null) {
				sb.append(line + "\n");
			}
			return sb.toString();
		} catch (Exception ex) {
			ex.printStackTrace();
			return "";
		}

	}

}
