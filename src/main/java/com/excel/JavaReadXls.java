package com.excel;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import jxl.Sheet;
import jxl.Workbook;


/** * @author Qin_Tianxiang * jxl读取.xls文件(可读取所有的sheet) */
public class JavaReadXls {
	private String filetype = null;
	private Workbook wb = null;

	public String getFiletype() {
		return filetype;
	}

	public void setFiletype(String filetype) {
		this.filetype = filetype;
	}

	public Workbook getWb() {
		return wb;
	}

	public void setWb(Workbook wb) {
		this.wb = wb;
	}

	public JavaReadXls(String filepath) throws Exception {
		if (filepath.trim().equals("") || filepath == null) {
			throw new IOException("参数不能为空或全为空格!");
		}
		this.filetype = filepath.substring(filepath.lastIndexOf(".") + 1);
		InputStream is = new FileInputStream(filepath);
		if (filetype.equalsIgnoreCase("xls")) {
			System.out.println("xls格式文件");
			wb = Workbook.getWorkbook(is);// 创建工作薄
		} else {
			throw new Exception("不是.xls文件，请选择.xls格式文件!");
		}
	}
	
	
	@SuppressWarnings("unchecked")
	public ArrayList getXls() throws Exception {
		ArrayList result = new ArrayList();
		Sheet[] sheets = wb.getSheets();// 获取所有的sheet
		for (int x = 0; x < sheets.length; x++) {
			Sheet s = wb.getSheet(x);
			if (s.getRows() == 0) {
				continue;
			} else {// 通用的获取cell值的方式,getCell(int column, int row) 行和列
				int Rows = s.getRows();// 总行
				int cols = s.getColumns();
				for (int i = 0; i < Rows; i++) {
					String ticketNr = (s.getCell(0,i)).getContents();
					
					ArrayList temp = new ArrayList();
					for (int j = 0; j < cols; j++) {
						String str = (s.getCell(j, i)).getContents();
						temp.add(str);
					}
					result.add(temp);	
				}
			}
		}
		wb.close();// 操作完成时，关闭对象，释放内存
	return result;
	}
}