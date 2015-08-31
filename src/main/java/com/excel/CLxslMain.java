package com.excel;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

/*
 * 对xsl操作并且数据库操作
 */

public class CLxslMain {
	@SuppressWarnings("unchecked")
	public static void main(String[] args) {
		String xls = "E:\\Work\\11月26日 上线\\副本兑换数据1.xls";
		String writeName = "E:\\Work\\11月26日 上线\\"; // 輸出
		ArrayList xlsArr = null;
		ArrayList reults = new ArrayList();
		try {
			xlsArr = new JavaReadXls(xls).getXls();
			for (int i = 1; i < xlsArr.size(); i++) {
				ArrayList arrTemp = (ArrayList) xlsArr.get(i);
				System.out.println("i is " + i);
				reults.add(CL(arrTemp,i));
			}
			writeXls(reults, writeName + "results.xls");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static ArrayList CL(ArrayList arrTemp,int  i) {
		ArrayList result = new ArrayList();
		String flightDate = (String) arrTemp.get(8);
		flightDate =  flightDate.substring(0, 10);
		String originairport = ((String) arrTemp.get(5)).substring(0,3);
		String destinationairport = ((String) arrTemp.get(5)).substring(3,6);
		String name = (String) arrTemp.get(10);
		String carrier = "CZ";
		String flightno = ((String) arrTemp.get(7)).substring(2);
		
		ResultSet rs = null;
		PreparedStatement pstmt = null;
		try {
		Connection con = null;
	
		String sqlSelect;
		sqlSelect = "select t.ticketnumber, p.certificateid,F.FLIGHTDATE,p.name "
				+ "from ets_ticket t, ets_passenger p, ets_flight f, ets_coupon c where t.ticketid = c.ticketid  "
				+ " and t.ticketid = p.ticketid "
				+ "and c.couponid = f.couponid "
				+ "and to_char(f.flightdate,'YYYY-MM-DD') = ? "
				+ "and f.originairport = ? "
				+ "and f.destinationairport = ? "
				+ "and p.name = ? "
				+ "and f.carrier = ?  "
				+ "and f.flightno = ?";
				pstmt = con.prepareStatement(sqlSelect);
				int sqlCount=0;
//				pstmt.setString(++sqlCount, "2013-12-01");
//				pstmt.setString(++sqlCount, "CAN");
//				pstmt.setString(++sqlCount, "PEK");
//				pstmt.setString(++sqlCount, "曹德旺");
//				pstmt.setString(++sqlCount, "CZ");
//				pstmt.setString(++sqlCount, "3101");
				
				pstmt.setString(++sqlCount, flightDate);
				pstmt.setString(++sqlCount, originairport);
				pstmt.setString(++sqlCount, destinationairport);
				pstmt.setString(++sqlCount, name);
				pstmt.setString(++sqlCount, carrier);
				pstmt.setString(++sqlCount, flightno);
				
				
				rs = pstmt.executeQuery();
				while (rs.next()) {
					String ticketnumber = rs.getString("ticketnumber");
					String certificateid= rs.getString("certificateid");
					String name_ = rs.getString("name");
					System.out.print(flightDate+
							","+originairport+
							","+destinationairport+ ","+ name+ 
							","+ flightno);
					System.out.println( ticketnumber+","+certificateid+","+name_);
					result.add(i+"");
					result.add(ticketnumber);
					result.add(certificateid);
					result.add(name_);
				}
			} catch (SQLException e) {
				e.printStackTrace();
			} catch (Exception e) {
				e.printStackTrace();
			} 
			 
			finally {
			if (rs != null) {
				try {
					rs.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (pstmt != null) {
				try {
					pstmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}

		return result;
	}

	@SuppressWarnings("unchecked")
	public static void writeXls(ArrayList arr, String fileName) {
		try {
			File f = new File(fileName);
			if (f.exists()) {
				System.out.print("文件存在");
			} else {
				System.out.print("文件不存在");
				f.createNewFile();// 不存在则创建
			}
			WritableWorkbook wwb = Workbook.createWorkbook(new File(fileName));
			WritableSheet ws = wwb.createSheet("result", 0);
			Label labelC = null;
			for (int i = 0; i < arr.size(); i++) {
				ArrayList a = (ArrayList) arr.get(i);
				for (int j = 0; j < a.size(); j++) {
					labelC = new Label(j, i, (String) a.get(j));
					ws.addCell(labelC);
				}
			}
			wwb.write();
			wwb.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
