import { post,postFile,postExportFile} from './http'

/*登录*/
export const login = p => post('/user/login', p)

/*初始化编辑用户页面*/
export const initEditUser = p => post('/user/initEditUser', p)

/*修改用户密码*/
export const editUserPwd = p => post('/user/editUserPwd', p)

/*获取用户头像*/
export const getUserAvatar = p => post('/user/getUserAvatar', p)

/*保存用户*/
export const saveUser = p => post('/user/saveUser', p)


/*初始化被投公司财务管理列表*/
export const initListFinance = p => post('/finance/initListFinance', p)

/*查询财务管理列表*/
export const findListFinance = p => post('/finance/findListFinance', p)

/*初始化财务新增、编辑*/
export const initEditFinance = p => post('/finance/initEditFinance', p)

/*保存财务数据*/
export const saveFinance = p => post('/finance/saveFinance', p)

/*更新财务基本信息*/
export const updateFinanceBaseInfo = p => post('/finance/updateFinanceBaseInfo', p)

/*上报前校验*/
export const checkDocExit = p => post('/finance/checkDocExit', p)

/*批量报表导出*/
export const exportFinanceReportBatch = p => postFile('/finance/exportFinanceReportBatch', p)

/*报表导出*/
export const exportFinanceReport = p => postExportFile('/finance/exportFinanceReport', p)

/*删除财务数据*/
export const deleteFinanceMain = p => post('/finance/deleteFinanceMain', p)

/*查询文档列表*/
export const findDocInfoList = p => post('/doInfo/findDocInfoList', p)

/*OCR识别*/
export const ocrProcessFile = p => post('/doInfo/ocrProcessFile', p)

/*删除文件列表*/
export const deleteDocInfoById = p => post('/doInfo/deleteDocInfoById', p)

/*下载文件*/
export const download = p => postExportFile('/doInfo/download', p)

/*下载Excel模板*/
export const exportCollectionExcel = p => postExportFile('/finance/exportCollectionExcel', p)

/*文件上传*/
export const doUploadFile = p => postFile('/doInfo/doUploadFile', p)

/*保存文件*/
export const saveDocInfo = p => post('/doInfo/saveDocInfo', p)

/*导入被投公司财务管理信息*/
export const importExcelAboutFinance = p => post('/finance/importExcelAboutFinance', p)





