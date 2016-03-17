define(["common/validatorHelper"], function (ValidatorHelper) {
		return {
			assetRegist  : [
				{
					title: "使用技术人员",
					list : [
						{
							text: "技术部网管组管理员"
						},
						{
							text: "IT部管理员"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“资产登记”，进入资产登记页面"
						},
						{
							text: "系统默认进入到添加服务器页面，如果要添加配件，请点击二级菜单上的“配件”。"
						},
						{
							text: "在相应的输入框中输入或选择属性值"
						},
						{
							text: "在添加服务器时您可以添加和服务器关联的磁盘阵列。当您选择服务器后，系统列出所有已经注册的的磁盘阵列的资产编号列表，您可以在其中选择。"
						},
						{
							text: "在添加磁盘阵列时您可以添加和磁盘政列关联的服务器。当您选择磁盘阵列后，系统列出所有已经注册的服务器的资产编号列表，您可以在其中选择。"
						},
						{
							text: "添加完成后点击“提交”按钮或敲回车键，资产添加完成。"
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : [
						{
							text: "注册资产是资产编号必须输入，在系统中资产编号不允许重复，如果您添加的一个在系统中已经存在的资产编号，系统将以错页面的形式提示您。"
						},
						{
							text: "在服务器和磁盘阵列之间相关联的时候，为了确保数据的正确性，请您从列表中选择，当输入错误时可以手动从输入框中删除或者点击清空按钮删除所有的数据。"
						}
					]
				}
			],
			queryAsset   : [
				{
					title: "使用技术人员",
					list : [
						{
							text: "技术部网管组管理员"
						},
						{
							text: "网络部普通用户"
						},
						{
							text: "IT部管理员"
						},
						{
							text: " IT部普通用户"
						},
						{
							text: " 财务部用户"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“资产查询”，进入资产查询页面。"
						},
						{
							text: "页面上默认可以输入三个查询条件，要输入更多的查询条件时可以点击条件输入框下的“添加查询条件”。系统中限制最多可以有十个查询条件输入框。"
						},
						{
							text: "在选择设备属性列表框中列出的是您可以看到的所有的资产属性。"
						},
						{
							text: "输入查询条件。"
						},
						{
							text: "添加完成后点击“查询”按钮或敲回车键，查询资产。列出所有符合条件的资产信息。"
						},
						{
							text: "在查询的结果显示列表中的三处连接：",
							children:[
								{
									text:"排序，在每个属性列的列名称上点击，系统将按照这一列的属性值重新对结果集进行升序排序。"
								},
								{
									text:"配置相关：在配置相关属性列中如果有“@”符号的说明该资产有和其相关联的服务器或盘阵，如果资产没有关联该处将是空白。点击“@”连接弹出页面列出所有和该设备关联的设备。"
								},
								{
									text: "修改：在ID列中点击序列号，将进入资产修改页面，财务部的用户还可以在这里删除资产。"
								}
							]
						},
						{
							text: "将查询结果导出，点击页面的“导出”按钮，将查询到的结果导出成EXCEL文件。"
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : [
						{
							text: "当您没有输入查询条件的情况下要查询数据，系统将弹出确认对话框。。"
						}
					]
				}
			],
			modifyAsset  : [
				{
					title: "使用技术人员",
					list : [
						{
							text: "技术部网管组管理员"
						},
						{
							text: "网络部普通用户"
						},
						{
							text: "IT部管理员"
						},
						{
							text: " IT部普通用户"
						},
						{
							text: " 财务部用户"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“资产查询”，进入资产查询页面。"
						},
						{
							text: "输入查询条件。点击“查询”按钮或敲回车键，获得查询结果。"
						},
						{
							text: "在ID列中点击序列号，将进入资产修改页面。"
						},
						{
							text: "页面上列出资产的属性，属性是否显现、是否可以修改，是根据不同的用户类型的不同而不同。"
						},
						{
							text: "您可以修改您有权限修改的资产属性。"
						},
						{
							text: "修改完成后，点击“修改”按钮或敲回车键提交修改。 ",
						},
						{
							text: "如果您是技术部网管组管理员，你可以查看服务器修改的历史记录"
						},
						{
							text: "如果您是财务部用户，你可以删除这个资产。"
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : []
				}
			],
			deleteAsset  : [
				{
					title: "使用技术人员",
					list : [
						{
							text: " 财务部用户"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“资产查询”，进入资产查询页面。"
						},
						{
							text: "输入查询条件。点击“查询”按钮或敲回车键，获得查询结果。"
						},
						{
							text: "在ID列中点击序列号，将进入资产修改页面。"
						},
						{
							text: "点击“删除”按钮，你可以删除这个资产。"
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : []
				}
			],
			viewHistory  : [
				{
					title: "使用技术人员",
					list : [
						{
							text: " 技术部网管组管理员"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“资产查询”，进入资产查询页面。"
						},
						{
							text: "输入查询条件。点击“查询”按钮或敲回车键，获得查询结果。"
						},
						{
							text: "在ID列中点击序列号，将进入资产修改页面。"
						},
						{
							text: "点击“查看服务器历史记录”按钮，你可以查看服务器修改的历史记录。 "
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : []
				}
			],
			bachQuery    : [
				{
					title: "使用技术人员",
					list : [
						{
							text: " 技术部网管组管理员 "
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“批量查询”，进入批量查询页面。"
						},
						{
							text: "输入查询条件。点击“查询”按钮或敲回车键，获得查询结果。"
						},
						{
							text: "在查询的结果显示列表中的三处连接：",
							children:[
								{
									text: "排序，在每个属性列的列名称上点击，系统将按照这一列的属性值重新对结果集进行升序排序。"
								},
								{
									text:" 配置相关：在配置相关属性列中如果有“@”符号的说明该资产有和其相关联的服务器或盘阵，如果资产没有关联该处将是空白。点击“@”连接弹出页面列出所有和该设备关联的设备。"
								},
								{
									text:"修改：在ID列中点击序列号，将进入资产修改页面，财务部的用户还可以在这里删除资产。"
								}
							]
						},
						{
							text: "将查询结果导出，点击页面的“导出”，将查询到的结果导出成EXCEL文件。"
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : [
						{
							text: "多个查询条件之间是用回车符或“,”逗号分割的，您也可以从EXCEL文件中直接复制，然后粘贴到输入框中。"
						}
					]
				}
			],
			batchModify  : [
				{
					title: "使用技术人员",
					list : [
						{
							text: "技术部网管组管理员"
						},
						{
							text: "网络部普通用户"
						},
						{
							text: "IT部管理员"
						},
						{
							text: " IT部普通用户"
						},
						{
							text: " 财务部用户"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“批量修改”，进入批量修改页面。"
						},
						{
							text: "点击“浏览”按钮，选择您要进行修改的资产数据。"
						},
						{
							text: "点击“提交”按钮或敲回车键进行批量修改。"
						},
						{
							text: "当导入完成后，系统将给出所有导入成功和不成功的资产信息，用资产编号标识资产。"
						}
					]
				},
				{
					title: "提示",
					list : [
						{
							text: "在批量修改的时候，为了防止不需要修改的属性被修改。建议您将不需要修改的属性列连同列名称一起删除 "
						}
					]
				},
				{
					title: "注意事项",
					list : [
						{
							text:"在进行数据录入前，请先到“模板下载”功能中，下载模板。"
						},
						{
							text:"用于导入数据的EXCEL文件应该是从“模板下载”功能中下载的EXCEL文件，数据是在这个模板中添加到对应的属性名称下的。请管理员注意，如果您不是使用这个模板添加的数据，或您修改了这个模板中工作表的名称或列名称，都将引起数据错误或系统异常。"
						},
						{
							text:"系统在处理修改的时候会根据您所属于的用户类型，自动过滤掉您没有权限修改的资产属性列。 "
						},
						{
							text:"如果您一次导入的数据很多，系统可能会处理很长一段时间，请您耐心的等待。"
						},
						{
							text: "在导入的时候，系统检查您给出的是数据中的资产编号是否在系统已经存在，如果不存在，在导入完成后可以从给出的信息中查看到在系统中不存在的资产编号。"
						}
					]
				}
			],
			importData   : [
				{
					title: "使用技术人员",
					list : [
						{
							text: "技术部网管组管理员"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“数据导入”，进入数据导入页面。"
						},
						{
							text: "点击“浏览”按钮，选择您要进行导入的资产数据。"
						},
						{
							text: "点击“导入”按钮或敲回车键进行导入。"
						},
						{
							text: "当导入完成后，系统将给出所有导入成功和不成功的资产信息，用资产编号标识资产"
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : [
						{
							text:"在进行数据录入前，请先到“模板下载”功能中，下载模板。"
						},
						{
							text:"用于导入数据的EXCEL文件应该是从“模板下载”功能中下载的EXCEL文件，数据是在这个模板中添加到对应的属性名称下的。请管理员注意，如果您不是使用这个模板添加的数据，或您修改了这个模板中工作表的名称或列名称，都将引起数据错误或系统异常。"
						},
						{
							text:"如果您一次导入的数据很多，系统可能会处理很长一段时间，请您耐心的等待。"
						},
						{
							text:"在导入的时候，系统检查您给出的是数据中的资产编号是否在系统已经存在，如果已经存在，将不会被导入，并且在导入完成后可以从给出的信息中查看重复的资产编号。"
						}
					]
				}
			],
			propertyMamage:[
				{
					title: "使用技术人员",
					list : [
						{
							text: "技术部网管组管理员"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“属性管理”，进属性管理页面。"
						},
						{
							text: "如果是技术部网管组管理员，系统默认进入到配置管理页面，如果您想管理其他的属性请点击二级菜单上的相应按钮。"
						},
						{
							text: "如果是IT部管理员，系统默认进入到CUP管理页面，如果您想管理其他的属性请点击二级菜单上的相应按钮。"
						},
						{
							text: "配置管理",
							children:[
								{
									text: "进入到配置管理页面中系统列出所有的品牌。"
								},
								{
									text:"点击对应品牌ID列中的序号，在类型中列出所有属于该品牌的类型。"
								},
								{
									text:"点击对应类型ID列中的序号，在型号中列出所有属于该类型的型号。"
								},
								{
									text:"在输入框中修改属性值点击“修改”按钮，提交修改。"
								},
								{
									text:"点击“删除”按钮，删除属性。"
								}
							]
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : [
						{
							text:"如果删除某个品牌，该品牌下的所有类型和型号也将被删除"
						},
						{
							text:"如果删除某个类型，该类型下的所有型号也将被删除。"
						}
					]
				}
			],
			displayCtrl  : [
				{
					title: "使用技术人员",
					list : [
						{
							text: "技术部网管组管理员"
						},
						{
							text: "技术部网管组普通用户"
						},
						{
							text: "IT部管理员"
						},
						{
							text: " IT部普通用户"
						},
						{
							text: " 财务部用户"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "该功能是为了控制在查询结果资产属性是否显示。",
							children:[
								{
									text: "在菜单条上点击“显示控制”，进显示控制页面。"
								},
								{
									text: "列出所有您可以看到的资产属性，通过点击复选框使其在选中和不选中状态切换。"
								},
								{
									text: "点击“提交”按钮，修改被保存。"
								},
								{
									text:"对应资产属性的复选框如果是被选中的状态，在对资产查询时，查询结果中将显示这个属性；反之，则不显示。"
								}
							]
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : [
						{
							text:"如果删除某个品牌，该品牌下的所有类型和型号也将被删除"
						},
						{
							text:"如果删除某个类型，该类型下的所有型号也将被删除。"
						}
					]
				}
			],
			assetSatistic: [
				{
					title: "使用技术人员",
					list : [
						{
							text: " 财务部用户"
						}
					]
				},
				{
					title: "操作步骤",
					list : [
						{
							text: "在菜单条上点击“资产统计”，进入资产统计页面。"
						},
						{
							text: "系统默认的是进入“按公司统计”页面。"
						},
						{
							text: "统计条件,点击“统计”按钮或敲回车键，显示统计结果。"
						},
						{
							text: "在统计结果通过点击不同的功能按钮显示不同的统计结果。 "
						},
						{
							text: "按公司统计"
						},
						{
							text: "按财务编号统计"
						},
						{
							text: "月内购买设备统计"
						}
					]
				},
				{
					title: "提示",
					list : []
				},
				{
					title: "注意事项",
					list : []
				}
			]
		}
});
