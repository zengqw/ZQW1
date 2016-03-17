/**
 * @接口配置文件
 */
define(function () {
	return {
		home: {
			todo: '/service/workload/staff/todoList.jsp',
			done: '/service/workload/staff/doneList.jsp'
		},
		setting: {
			right: '/service/workload/admin/rightList.jsp',
			rightOprt: '/service/workload/admin/rightOprt.jsp',
			project: '/service/workload/admin/productList.jsp',
			projectOprt: '/service/workload/admin/productOprt.jsp',
			projectExp: '/service/workload/admin/productExp.jsp',
			time: '/service/workload/admin/timeList.jsp',
			timeOprt: '/service/workload/admin/timeOprt.jsp',
			org: '/service/workload/admin/orgList.jsp',
			orgOprt: '/service/workload/admin/orgOprt.jsp',
			orgExp: '/service/workload/admin/orgExp.jsp',
			orgImp: '/service/workload/admin/orgImp.jsp',
			role: '/service/workload/admin/roleList.jsp',
			roleUser: '/service/workload/admin/roleUserList.jsp',
			roleOprt: '/service/workload/admin/roleUserOprt.jsp',
			roleUserExp: '/service/workload/admin/roleUserExp.jsp',
			hrm: '/service/workload/admin/hrmList.jsp',
			hrmOprt: '/service/workload/admin/hrmOprt.jsp',
			hrmExp: '/service/workload/admin/hrmExp.jsp',
			hrmImp: '/service/workload/admin/hrmImp.jsp',
			dept: '/service/workload/admin/deptList.jsp',
			deptOprt: '/service/workload/admin/deptOprt.jsp',
			deptExp: '/service/workload/admin/deptExp.jsp',
			deptImp: '/service/workload/admin/deptImp.jsp',
			hrmType: '/service/workload/admin/hrmTypeList.jsp',
			hrmTypeOprt: '/service/workload/admin/hrmTypeOprt.jsp',
			message: '/service/workload/admin/messageHistory.jsp',
			messageExp: '/service/workload/admin/messageHistoryExp.jsp',
			blacklist: '/service/workload/admin/autoRemindBlacklist.jsp',
			blacklistOprt: '/service/workload/admin/autoRemindBlacklistOprt.jsp',
			blacklistExp: '/service/workload/admin/autoRemindBlacklistExp.jsp',
		},
		unit: {
			list: '/service/workload/staff/todoDetails.jsp',
			save: '/service/workload/staff/saveAndCommit.jsp',
			returnBack: '/service/workload/staff/returnBack.jsp',
			search: '/service/workload/staff/searchProduct.jsp',
			exp: '/service/workload/staff/todoListExp.jsp',
			expDone: '/service/workload/staff/doneListExp.jsp',
			expDemo: '/service/workload/staff/productExp.jsp',
			batch: '/service/workload/staff/batchProcess.jsp',
			recover: '/service/workload/staff/revertContent.jsp'
		},
		excelOut: '/weaver/weaver.file.ExcelOut',
		msg: '/service/workload/staff/sendMsg.jsp'
	};
});