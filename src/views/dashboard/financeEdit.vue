<template>
    <div>
        <el-form ref="form" :model="editForm" :inline="true" label-width="300px" :label-position="labelPosition">
            <el-row>
                <el-form-item label="公司名称">
                    <el-input v-model="editForm.vcEnterpriseName" size="small" placeholder="请输入公司名称"
                        class="filter-item">
                    </el-input>
                </el-form-item>
                <el-form-item label="年度">
                    <el-date-picker type="year" value-format="yyyy" size="small" format="yyyy" placeholder="选择年"
                        v-model="editForm.fiscalYear" style="width: 146px;">
                    </el-date-picker>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="已挂盖章版审计报告/财务报表">
                    <el-select v-model="editForm.isStampedVersionAudit" size="small" placeholder="已挂盖章版审计报告/财务报表"
                        clearable class="filter-item">
                        <el-option v-for="it in isNot" :key="it.value" :value="it.code" :label="it.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="editForm.reportType" size="small" placeholder="类型" class="filter-item">
                        <el-option v-for="rt in reportTypeList" :key="rt.value" :value="rt.code" :label="rt.value"
                            aria-selected="true">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="填写人">
                    <el-input v-model="editForm.entPerson" size="small" placeholder="填写人" class="filter-item">
                    </el-input>
                </el-form-item>
                <el-form-item label="币种">
                    <el-select v-model="editForm.financeCurrency" size="small" placeholder="币种" class="filter-item">
                        <el-option v-for="cc in currencyList" :key="cc.value" :value="cc.code" :label="cc.value"
                            aria-selected="true">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="填写人联系方式">
                    <el-input v-model="editForm.entPersonPhone" size="small" placeholder="填写人联系方式" class="filter-item">
                    </el-input>
                </el-form-item>
                <el-form-item label="填写承诺">
                    <el-select v-model="editForm.entCommitment" size="small" placeholder="填写承诺" class="filter-item">
                        <el-option aria-selected="true"
                            value="本公司承诺，按照企业会计准则的规定编制财务报表是我们的责任，本公司管理层对以下财务报表的真实性、合法性和完整性承担责任">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-tabs type="border-card" style="margin-top: 2%;">
                    <el-tab-pane label="文档列表">
                        <el-button size="mini" type="primary" @click="dialogVisible = true" style="float: right;">新增
                        </el-button>
                        <el-table class="etab" :data="ocrListTable" border tooltip-effect="dark"
                            :cell-style="{ fontFamily: 'Arial', fontSize: '13px', textAlign: 'center', }"
                            :header-cell-style="{ fontFamily: 'Helvetica', fontSize: '13px', textAlign: 'center', }">
                            <el-table-column prop="docname" label="文档名称" min-width="200">
                                <template slot-scope="props">
                                    <span>{{ props.row.docname }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="operateUser" label="操作人员" min-width="80">
                                <template slot-scope="props">
                                    <span>{{ props.row.operateUser }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="operateTime" label="操作时间" min-width="80">
                                <template slot-scope="props">
                                    <span>{{ props.row.operateTime }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="common_operation0" label="OCR识别导入" min-width="30">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" plain
                                        @click="ocrProcessFile(scope.row.fileId)">AI识别
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="50">
                                <template slot-scope="scope">
                                    <el-button size="mini" plain type="primary"
                                        @click="download(scope.row.docId, scope.row.docname)">下载
                                    </el-button>
                                    <el-button size="mini" plain type="danger" @click="Delete(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                                layout="sizes, prev, pager, next, total, jumper " :total="total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div>
                    <el-dialog width="400px" :visible.sync="dialogVisible" title="文件上传">
                        <el-upload action="http://10.128.4.99:9011/doInfo/doUploadFile" :on-remove="handleRemove" multiple
                            :data="uploadData" :on-success="handle_success" :on-exceed="exceed" :limit="3"
                            :before-upload="beforeUpload" :show-file-list="true">
                            <el-button size="small" type="primary" plain>选择文件</el-button>
                        </el-upload>
                        <el-button size="mini" type="primary" style="margin-left: 80%" @click="saveDocInfo()">保存
                        </el-button>
                    </el-dialog>
                </div>
            </el-row>
            <br><br>
            <el-row>
                <span style="color: red">*以下财务数据可以通过上传文档后，AI识别填充（需人工校验），或在页面最下方下载excel模板，填写后导入（准确度高）</span>
            </el-row>
            <br><br>
            <el-row>
                <el-tabs type="border-card">
                    <el-tab-pane label="资产负债表">
                        <el-table :data="balanceSheetTable" border :cell-style="{
                            fontFamily: 'Arial',
                            fontSize: '13px',
                            textAlign: 'left',
                        }" :header-cell-style="{ fontFamily: 'Helvetica', fontSize: '13px', textAlign: 'center', height: '5px' }"
                            style="width: 100%">
                            <el-table-column prop="index1SourceName" label="资产">
                            </el-table-column>

                            <el-table-column label="期末余额" prop="index1QuarterValue">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.index1QuarterValue" size="small" style="width: 100%;">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="年初余额" prop="index1YearValue">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.index1YearValue" size="small" style="width: 100%;">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="index2SourceName" label="负债和所有者权益（或股东权益）">
                            </el-table-column>
                            <el-table-column label="期末余额" prop="index2QuarterValue">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.index2QuarterValue" size="small" style="width: 100%;">
                                    </el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="年初余额" prop="index2YearValue">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.index2YearValue" size="small" style="width: 100%;">
                                    </el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="利润表">
                        <el-table :data="incomeStatementTable" border :cell-style="{
                            fontFamily: 'Arial',
                            fontSize: '13px',
                            textAlign: 'left',
                        }" :header-cell-style="{ fontFamily: 'Helvetica', fontSize: '13px', textAlign: 'center', }"
                            style="width: 100%">
                            <el-table-column prop="index1SourceName" label="项目">
                            </el-table-column>
                            <el-table-column label="半年/全年累计金额" prop="index1YearValue">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.index1YearValue" size="small" style="width: 30%;">
                                    </el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="现金流表">
                        <el-table :data="cashFlowStatementTable" border :cell-style="{
                            fontFamily: 'Arial',
                            fontSize: '13px',
                            textAlign: 'left',
                        }" :header-cell-style="{ fontFamily: 'Helvetica', fontSize: '13px', textAlign: 'center', }"
                            style="width: 100%">
                            <el-table-column prop="index1SourceName" label="项目">
                            </el-table-column>
                            <el-table-column label="半年/全年累计金额" prop="index1YearValue">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.index1YearValue" size="small" style="width: 30%;">
                                    </el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <br><br>
            <el-row>
                <div style="margin-left:35%;">
                    <el-button class="filter-button" size="small" type="primary" @click="exportCollectionExcel()">
                        下载Excel模板&nbsp;<i class="el-icon-download"></i>
                    </el-button>
                    <el-button class="filter-buttons" size="small" type="success" @click="beforeImport()">
                        批量Excel导入&nbsp;<i class="el-icon-folder-opened"></i>
                    </el-button>

                    <el-button class="filter-button" size="small" type="primary" @click="saveFinance(true, false)">
                        保存
                    </el-button>
                    <el-button class="filter-buttons" size="small" type="success" @click="saveFinance(true, true, '1')">
                        上报
                    </el-button>
                    <el-dialog width="400px" :visible.sync="dialogVisibleImport" title="批量导入Excel数据">
                        <el-upload action="http://10.128.4.99:9011/doInfo/doUploadFile" :on-remove="handleRemove"
                            :data="uploadData" :on-success="handle_success" :on-exceed="exceed" :limit="1"
                            :show-file-list="true">
                            <el-button size="small" type="primary" plain>选择文件</el-button>
                        </el-upload>
                        <el-button size="mini" type="primary" style="margin-left: 80%"
                            @click="importExcelAboutFinance()">保存
                        </el-button>
                    </el-dialog>
                </div>

            </el-row>
        </el-form>
    </div>
</template>
<script>
import { initEditFinance, findDocInfoList, ocrProcessFile, deleteDocInfoById, download, exportCollectionExcel, saveDocInfo, saveFinance, checkDocExit, importExcelAboutFinance, updateFinanceBaseInfo } from "../../request/api";
import Cookie from 'js-cookie';
import axios from 'axios';
export default {
    data() {
        return {
            currentPage: 0,
            pageSize: 5,
            total: 0,
            labelPosition: "right",
            ocrListTable: [],
            currencyList: [],
            reportTypeList: [],
            isNot: [],
            balanceSheetTable: [],
            cashFlowStatementTable: [],
            incomeStatementTable: [],
            editForm: {
                vcEnterpriseName: "",
                fiscalYear: "",
                isStampedVersionAudit: "",
                reportType: "",
                entPerson: "",
                financeCurrency: "",
                entPersonPhone: "",
                entCommitment: "",
                continueSave: false,
                entId: ""
            },
            dialogVisible: false,
            dialogVisibleImport: false,
            uploadData: {
                loginName: Cookie.get("loginName")
            },
            docInfo: {
                docType: "enterpriseFinance",
                projectid: "",
                filePath: "",
                vcdocpath: "",
                newFileName: "",
                fileSize: "",
                fileSuffix: "",
                fileType: "",
                vcdocname: "",

            },
            flag: "",
            rules: {
                fiscalYear: [{ required: true, message: '年度不能为空', trigger: 'blur' }],
                financeCurrency: [{ required: true, message: '币种不能为空', trigger: 'blur' }],
                reportType: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
                entPerson: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
                entPersonPhone: [{ required: true, message: '联系人联系方式不能为空', trigger: 'blur' }],
                entCommitment: [{ required: true, message: '填写承诺不能为空', trigger: 'blur' }],

            },
            financeIdAdd: ""
        };
    },
    components: {},
    mounted() {
        this.openNotification();
        this.openNotification1();
        this.openNotification2();
        this.initEditFinance(this.$route.params.id);
    },
    methods: {

        /*初始化财务新增、编辑*/
        initEditFinance(financeId) {
            initEditFinance({
                financeId: financeId,
            })
                .then((res) => {
                    if (res.messageCode == "1") {
                        if (financeId != null) {
                            this.financeIdAdd = financeId;
                            this.findDocInfoList(financeId);
                        } else {

                            this.financeIdAdd = res.data.finance.financeId;
                            this.findDocInfoList(this.financeIdAdd);
                        }
                        this.currencyList = res.data.currencyList;
                        this.reportTypeList = res.data.reportTypeList;
                        this.docInfo.projectid = res.data.finance.financeId;
                        this.editForm.vcEnterpriseName = res.data.finance.vcEnterpriseName;
                        this.isNot = res.data.isNot;
                        this.editForm.entId = res.data.finance.entId;
                        this.editForm.isStampedVersionAudit = res.data.isNot[0].code;
                        this.editForm.fiscalYear = res.data.finance.fiscalYear;
                        this.editForm.reportType = res.data.finance.reportType;
                        this.editForm.entPerson = res.data.finance.entPerson;
                        this.editForm.financeCurrency = res.data.finance.financeCurrency;
                        this.editForm.entPersonPhone = res.data.finance.entPersonPhone;
                        this.editForm.entCommitment = res.data.finance.entCommitment;
                        this.balanceSheetTable = res.data.balanceSheetIndexList;
                        this.incomeStatementTable = res.data.incomeStatementIndexList;
                        this.cashFlowStatementTable = res.data.cashFlowStatementIndexList;
                    } else {
                        this.$message.error("查询失败！");
                    }

                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*财务数据保存前验证*/
        checkBeforeSaveFinance(flag, myFlag, reportStatus) {
            var projectId = this.$route.params.id;
            var docType = this.docInfo.docType;
            var docFlag = '1';
            if (myFlag) {
                this.checkDocExit(projectId, docType);
                docFlag = this.flag;
                if (this.editForm.reportType == '3' && myFlag) {//三季度必须处理
                    let inputYear = this.editForm.fiscalYear;
                    let lastYear = parseInt(inputYear) - 1;
                    let tips = "必传两份：[" + inputYear + "] 和 [" + lastYear + "] 三季度盖章版审计报告/财务报告";
                    if (parseInt(docFlag) < 2) {
                        this.$message.error(tips);
                        return false;
                    }
                } else {
                    if (docFlag == '0') {
                        this.$message.error("必须上传一个文档才能保存数据！");
                        return false;
                    }
                }
                saveFinance(flag, myFlag, reportStatus);
            } else {
                if (docFlag == '0') {
                    this.$message.error("必须上传一个文档才能保存数据！");
                    return false;
                }
                saveFinance(flag, myFlag, reportStatus);
            }
        },

        checkDocExit(projectId, docType) {
            checkDocExit({
                projectId: projectId,
                docType: docType,
            })
                .then((res) => {
                    this.flag = res.resultCode;
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*财务数据保存*/
        saveFinance(flag, myFlag, reportStatus) {
            if (!this.editForm.fiscalYear) {
                this.$message.error("【年度】不能为空！");
            } else
                if (!this.editForm.reportType) {
                    this.$message.error("【类型】不能为空！");
                } else
                    if (!this.editForm.entPerson) {
                        this.$message.error("【填写人】不能为空！");
                    } else
                        if (!this.editForm.financeCurrency) {
                            this.$message.error("【币种】不能为空！");
                        } else
                            if (!this.editForm.entPersonPhone) {
                                this.$message.error("【填写人联系方式】不能为空！");
                            } else
                                if (!this.editForm.entCommitment) {
                                    this.$message.error("【填写承诺】不能为空！");
                                } else {
                                    let opt = this.editForm.reportType;
                                    if (opt != '3') {//如果不是三季度则需要校验
                                        // financeRequiredVerify();
                                    } else if (opt == '3' && myFlag) {
                                        //let retStr = checkSeason3DataInput();
                                        let retStr = "";
                                        if (retStr != "") {
                                            this.$message.error('以下列举字段为必填项，请校验后保存！' + retStr);
                                            return;
                                        }
                                    }
                                    var balanceSheetJson = this.balanceSheetTable;
                                    var incomeStatementJson = this.incomeStatementTable;
                                    var cashFlowStatementJson = this.cashFlowStatementTable;
                                    if (!balanceSheetJson || !incomeStatementJson || !cashFlowStatementJson) {
                                        this.$message.error('财务指标值必须为数字，请检查修改后重新提交');
                                        return;
                                    }
                                    //必填项验证
                                    if (opt != '3') {//如果不是三季度则需要校验
                                        var financeVerify = "";
                                        //financeRequiredVerify();
                                        if (financeVerify != true && myFlag) {
                                            this.$message.error('以下列举字段为必填项，请校验后保存！' + financeVerify);
                                            return;
                                        }
                                    }
                                }
            saveFinance({
                entId: this.editForm.entId,
                financeId: this.financeIdAdd,
                fiscalYear: this.editForm.fiscalYear,
                reportType: this.editForm.reportType,
                reportStatus: reportStatus,
                isStampedVersionAudit: this.editForm.isStampedVersionAudit,
                financeCurrency: this.editForm.financeCurrency,
                continueSave: this.editForm.continueSave,
                entPerson: this.editForm.entPerson,
                entPersonPhone: this.editForm.entPersonPhone,
                entCommitment: this.editForm.entCommitment,
                balanceSheetJson: JSON.stringify(this.balanceSheetTable),
                incomeStatementJson: JSON.stringify(this.incomeStatementTable),
                cashFlowStatementJson: JSON.stringify(this.cashFlowStatementTable)

            })
                .then((res) => {
                    if (res.resultCode == "10") {
                        this.findDocInfoList();
                        this.$message.success("保存成功！");
                    } else {
                        this.$message.error(res.message);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*更新财务基本信息*/
        updateFinanceBaseInfo() {
            updateFinanceBaseInfo({
                vcEnterpriseName: this.editForm.vcEnterpriseName,
                entId: this.editForm.entId,
                fiscalYear: this.editForm.fiscalYear,
                reportType: this.editForm.reportType,
                isStampedVersionAudit: this.editForm.isStampedVersionAudit,
                financeCurrency: this.editForm.financeCurrency,
                entPerson: this.editForm.entPerson,
                entPersonPhone: this.editForm.entPersonPhone,
                entCommitment: this.editForm.entCommitment,
            })
                .then((res) => {
                    if (res.resultCode == "1") {
                        this.financeIdAdd = res.data;
                        this.dialogVisibleImport = true;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*弹出提示文字*/
        openNotification() {
            const h = this.$createElement;
            this.$notify({
                message: h('i', { style: 'color: orange' }, '请您在页面最下方上传财务文档!'),
                type: 'warning',
            });
        },
        openNotification1() {
            const h1 = this.$createElement;
            this.$notify({
                message: h1('i', { style: 'color: teal' }, '如果您的屏幕金额显示不完整,请调节您的电脑缩放!显示设置→缩放与布局'),
                type: 'warning',
                offset: 50,
            });
        },
        openNotification2() {
            const h2 = this.$createElement;
            this.$notify({
                message: h2('i', { style: 'color: orange' }, '填写过程中请及时保存!'),
                type: 'warning',
                offset: 120
            });
        },

        /*查询文档列表*/
        findDocInfoList(id) {
            findDocInfoList({
                start: this.currentPage,
                length: this.pageSize,
                lid: id,
                docType: this.docInfo.docType,
                sourceId: id,
            })
                .then((res) => {
                    if (res.messageCode == "1") {
                        this.ocrListTable = res.data.data;
                    } else {
                        this.$message.error("查询文档列表失败！");
                    }

                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*OCR识别*/
        ocrProcessFile(id) {
            ocrProcessFile({
                gfDocId: id
            })
                .then((res) => {
                    if (res.resultCode === "1") {
                        this._processResult(res);
                        let msg = "完成处理，请检查、校验并保存数据。无法识别的请人工进行录入。非常感谢";
                        alert(msg);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        _checkIsNum(str) {
            var regPos = /^\d+(\.\d+)?$/; //非负浮点数
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
            if (regPos.test(str) || regNeg.test(str)) {
                return true;
            } else {
                return false;
            }
        },

        _processResult(res) {
            var data = res.data;
            var mesg = "";
            if (data.errno != 0) {
                mesg = "请求发生错误：" + data.msg;
                this.$message.success(mesg);
                return;
            }
            for (let s = 0; s < data.data.length; s++) {
                var ocr_data = data.data[s];
                for (let i = 0; i < ocr_data.length; i++) {
                    //需要识别的Table
                    let orc_table = ocr_data[i];
                    for (let j = 0; j < orc_table.length; j++) {
                        let row = orc_table[j];
                        let head = orc_table[0];
                        var headList = [];
                        for (let index = 0; index < head.length; index++) {
                            const element = head[index];
                            var json = { index, element }
                            headList.push(json);
                        }
                        let rowLength = row.length;
                        //如果行数小于2列，忽略处理
                        if (rowLength < 2) {
                            continue;
                        } else {
                            this._autoFillData(row, headList);
                        }
                    }
                }
            }
        },

        _autoFillData(p_row, headList) {
            let label = p_row[0];
            label = label.replace(/:/g, "：").replace(/\(/g, "（").replace(/\)/g, "）").replace(/"([^"]*)"/g, "“$1”");
            var regex = "（(.+?)）";
            var replaceArr = ["加：", "减：", "其中：", "一、", "二、", "三、", "四、", "五、", "六、", "七、", "八、", "九、", "*", "："];
            let mathArr = label.match(regex);
            if (mathArr && mathArr.length > 0) {
                let replaceKua = mathArr[0];
                //去掉括号内信息
                label = label.replace(replaceKua, "");
            }
            for (let j = 0; j < replaceArr.length; j++) {
                label = label.replace(replaceArr[j], "");
            }
            var qmlist = [];
            var nclist = [];
            for (let j = 0; j < headList.length; j++) {
                if (headList[j].element.includes('期末')) {
                    qmlist.push(headList[j].index);
                }
                if (headList[j].element.includes('年初')) {
                    nclist.push(headList[j].index);
                }
            }
            for (let i = 0; i < this.balanceSheetTable.length; i++) {
                if (this.balanceSheetTable[i].index1SourceName.includes(label)) {
                    this.balanceSheetTable[i].index1QuarterValue = p_row[qmlist[0]];
                    this.balanceSheetTable[i].index2QuarterValue = p_row[qmlist[1]];
                    this.balanceSheetTable[i].index1YearValue = p_row[nclist[0]];
                    this.balanceSheetTable[i].index2YearValue = p_row[nclist[1]];
                } 

            }
         
            for (let i = 0; i < this.incomeStatementTable.length; i++) {
                if (this.incomeStatementTable[i].index1SourceName.includes(label)) {
                    for (let j = 0; j < headList.length; j++) {
                        if (headList[j].element.includes('去年累计') || headList[j].element.includes('上期金额') || headList[j].element.includes('本年')
                            || headList[j].element.includes('累计金额')) {
                            this.incomeStatementTable[i].index1YearValue = p_row[j];
                        }

                    }
                }
            }
            for (let i = 0; i < this.cashFlowStatementTable.length; i++) {
                if (this.cashFlowStatementTable[i].index1SourceName.includes(label)) {
                    for (let j = 0; j < headList.length; j++) {
                        if (headList[j].element.includes('本年累计') || headList[j].element.includes('上期金额') || headList[j].element.includes('累计金额')
                            || headList[j].element == '金额') {
                            this.cashFlowStatementTable[i].index1YearValue = p_row[j];
                        }

                    }

                } else {
                    let str = '的';
                    let str1 = '所';
                    if (this.cashFlowStatementTable[i].index1SourceName.replaceAll(str, "").includes(label.replaceAll(str, "").replaceAll(str1, ""))) {
                        for (let j = 0; j < headList.length; j++) {
                            if (headList[j].element.includes('本年累计') || headList[j].element.includes('上期金额') || headList[j].element.includes('累计金额')
                                || headList[j].element == '金额') {
                                this.cashFlowStatementTable[i].index1YearValue = p_row[j];
                            }

                        }
                    }

                }
            }
        },

        /*下载文件*/
        download(id, fileName) {
            download({
                docId: id,
            })
                .then((res) => {
                    let blob = new Blob();
                    var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
                    if (fileType == 'pdf') {
                        blob = new Blob([res], { type: 'application/pdf' });
                    } if (fileType == 'jpg') {
                        blob = new Blob([res], { type: 'application/jpg' });
                    }
                    if (fileType == 'png') {
                        blob = new Blob([res], { type: 'application/png' });
                    }

                    if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
                        navigator.msSaveBlob(blob, fileName)
                    } else {
                        const href = URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
                        const a = document.createElement('a') //创建a标签
                        a.style.display = 'none'
                        a.href = href // 指定下载链接
                        a.download = fileName; //指定下载文件名
                        a.click() //触发下载
                        URL.revokeObjectURL(a.href) //释放URL对象
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*下载Excel模板*/
        exportCollectionExcel() {
            let fileName = "";
            axios.interceptors.response.use(function (response) {
                fileName = response.headers['content-disposition'].split('filename=')[1];
                return response;
            }, function (error) {
                return Promise.reject(error);
            });
            exportCollectionExcel({
            })
                .then((res) => {
                    let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                    if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
                        navigator.msSaveBlob(blob, decodeURI(fileName))
                    } else {
                        const href = URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
                        const a = document.createElement('a') //创建a标签
                        a.style.display = 'none'
                        a.href = href // 指定下载链接
                        a.download = decodeURI(fileName); //指定下载文件名
                        a.click() //触发下载
                        URL.revokeObjectURL(a.href) //释放URL对象
                    }

                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*文件上传*/
        handle_success(res) {
            this.docInfo.vcdocpath = res.data.realPath;
            this.docInfo.filePath = res.data.filePath;
            this.docInfo.newFileName = res.data.newFileName;
            this.docInfo.fileSize = res.data.fileSize;
            this.docInfo.fileSuffix = res.data.fileSuffix;
            this.docInfo.fileType = res.data.fileType;
            this.docInfo.vcdocname = res.data.fileName;
        },

        /*文件上传保存*/
        saveDocInfo() {
            saveDocInfo({
                docType: "enterpriseFinance",
                projectid: this.docInfo.projectid,
                filePath: this.docInfo.filePath,
                vcdocpath: this.docInfo.vcdocpath,
                newFileName: this.docInfo.newFileName,
                fileSize: this.docInfo.fileSize,
                fileSuffix: this.docInfo.fileSuffix,
                fileType: this.docInfo.fileType,
                vcdocname: this.docInfo.vcdocname,
            })
                .then((res) => {
                    if (res.resultCode == "1") {
                        this.findDocInfoList(this.docInfo.projectid);
                        this.$message.success("上传成功");
                        this.dialogVisible = false;
                    } else {
                        this.$message.error("上传失败");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*导入前校验*/
        beforeImport() {
            if (!this.editForm.fiscalYear) {
                this.$message.error("【年度】不能为空！");
            } else
                if (!this.editForm.reportType) {
                    this.$message.error("【类型】不能为空！");
                } else
                    if (!this.editForm.entPerson) {
                        this.$message.error("【填写人】不能为空！");
                    } else
                        if (!this.editForm.financeCurrency) {
                            this.$message.error("【币种】不能为空！");
                        } else
                            if (!this.editForm.entPersonPhone) {
                                this.$message.error("【填写人联系方式】不能为空！");
                            } else
                                if (!this.editForm.entCommitment) {
                                    this.$message.error("【填写承诺】不能为空！");
                                } else {
                                    this.updateFinanceBaseInfo();
                                }
        },
        beforeUpload(file) {
            var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
            const extension = testmsg === "pdf";
            const extension1 = testmsg === "jpg";
            if (!extension && !extension1) {
                this.$message.warning("请在此上传盖章版审计报告/财务报表，文件格式应为PDF/JPG!");
            }
        },

        /*导入被投公司财务管理信息*/
        importExcelAboutFinance() {
            importExcelAboutFinance({
                docRelatedId: "",
                docPath: this.docInfo.filePath,
                realPath: this.docInfo.vcdocpath,
                newFileName: this.docInfo.newFileName,
                fileSize: this.docInfo.fileSize,
                fileSuffix: this.docInfo.fileSuffix,
                fileType: this.docInfo.fileType,
                financeId: this.financeIdAdd,
                docName: this.docInfo.vcdocname,
            })
                .then((res) => {
                    if (res.resultCode == "1") {
                        this.$message.success("上传成功");
                        console.log(this.financeIdAdd + "--------------");
                        this.initEditFinance(this.financeIdAdd);
                        this.findDocInfoList(this.financeIdAdd);
                        this.dialogVisibleImport = false;

                    } else {
                        this.$message.error("上传失败");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*删除文件列表*/
        deleteDocInfoById(docId) {
            deleteDocInfoById({ docId: docId })
                .then((res) => {
                    this.$message.success("删除成功！！");
                    this.findDocInfoList(this.financeIdAdd);
                    console.log(res.data);
                })
                .catch(function (err) {
                    this.$message.error("删除失败！！");
                    console.log(err);
                });
        },

        /*删除前提示*/
        Delete(row) {
            this.$confirm(`确定删除这条删除吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {

                    this.deleteDocInfoById(row.docId);
                })
                .catch(() => { });
        },

        /*选择页数*/
        handleSizeChange(val) {
            this.pageSize = val;
            this.findDocInfoList(val, 1);
            this.currentPage = 1;
        },

        /*显示第几页*/
        handleCurrentChange(val) {
            this.currentPage = val;
            this.findDocInfoList(this.pagesize, val);
        },

        exceed: function () {
            this.$message.error("最多只能上传3个文件");
        },

        handleRemove() {
            this.list = [];
        },
    }
}

</script>
<style scoped>
.filter-buttons {
    background-color: orangered;
    border: none;
}

.el-row {
    margin-top: -20px;
}

.el-form {
    margin-top: 5%;
}

.el-input {
    width: 300px;
}

.el-select {
    width: 300px;
}

.ebutton {
    float: center;
}
</style>