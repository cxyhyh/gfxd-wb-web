<template>
    <div>
        <el-form ref="form" :model="serchForm" :inline="true" label-width="80px">
            <el-row>
                <el-form-item label="公司名称">
                    <el-input v-model="serchForm.vcEnterpriseName" placeholder="请输入公司名称" size="small"
                        class="filter-item">
                    </el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="serchForm.reportStatus" placeholder="状态" size="small" clearable
                        class="filter-item">
                        <el-option v-for="ct in reportedStatusTypeList" :key="ct.value" :value="ct.value"
                            :label="ct.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="年份">
                    <el-col :span="11">
                        <el-date-picker type="year" value-format="yyyy" size="small" format="yyyy" placeholder="选择年"
                            v-model="serchForm.startTime" style="width: 146px;">
                        </el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-date-picker type="year" value-format="yyyy" size="small" format="yyyy" placeholder="选择年"
                            v-model="serchForm.endTime" style="width: 146px;">
                        </el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="serchForm.reportType" placeholder="类型" size="small" class="filter-item">
                        <el-option v-for="lo in reportTypeList" :key="lo.value" :value="lo.value" :label="lo.value"
                            aria-selected="true">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
        </el-form>
        <div class="ebutton">
            <el-tooltip class="item" effect="dark" placement="left">
                <div slot="content" style="width: 150px;">
                    <div class="panle-row-title">
                        财务信息整体填报说明：
                    </div>
                    <div class="tooltip-inner">
                        1) 请在《股权类投资-被投公司财务管理》编辑页面，提交企业合并层面的财务数据.
                    </div>
                    <div class="tooltip-inner">
                        2) 请在每年4月30日前提交企业上个会计年度的财务数据，在每年8月31日提交企业半年度的财务数据.
                    </div>
                    <div class="tooltip-inner">
                        <font color="red">*填写企业必须承诺，将按照企业会计准则的规定编制财务报表，公司管理层对所填写财务报表及提交相关附件的真实性、合法性和完整性承担责任。 </font>
                    </div>
                </div>
                <el-button class="filter-button" size="small" type="danger">
                    说明
                </el-button>
            </el-tooltip>
            <el-button class="filter-button" size="small" type="primary" @click="findListFinance()">
                搜索&nbsp;<i class="el-icon-search"></i>
            </el-button>
            <el-button class="filter-button" size="small" type="primary" @click="openEditFinance()">
                新增&nbsp;<i class="el-icon-plus"></i>
            </el-button>
            <!-- <el-button class="filter-button" size="small" type="primary" @click="exportFinanceReportBatch(ids)">
                批量导出&nbsp;<i class="el-icon-download"></i>
            </el-button> -->
        </div>
        <div>
            <el-table :data="financeListTable" border tooltip-effect="dark"
                :cell-style="{fontSize: '13px', textAlign: 'center', }"
                :header-cell-style="{ fontSize: '13px', textAlign: 'center', }">
                <el-table-column prop="vcEnterpriseName" label="公司名称" min-width="200">
                    <template slot-scope="props">
                        <span>{{ props.row.vcEnterpriseName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fiscalYear" label="年度" min-width="40">
                    <template slot-scope="props">
                        <span>{{ props.row.fiscalYear }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reportType" label="类型" min-width="40">
                    <template slot-scope="props">
                        <span>{{ props.row.reportType }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="financeCurrency" label="币种" min-width="60">
                    <template slot-scope="props">
                        <span>{{ props.row.financeCurrency + ", 单位：元" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="vcfinanceDate" label="填报时间" min-width="60">
                    <template slot-scope="props">
                        <span>{{ props.row.vcfinanceDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reportStatus" label="状态" min-width="60">
                    <template slot-scope="props">
                        <span>{{ props.row.reportStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="auditorName" label="审核人" min-width="60">
                    <template slot-scope="props">
                        <span>{{ props.row.auditorName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" plain
                            v-if="scope.row.reportStatus == shStatus || scope.row.reportStatus == tgStatus || scope.row.vcfinanceDate != null"
                            @click="exportFinanceReport(scope.row.financeId)">导出
                        </el-button>
                        <el-button size="mini" type="primary" plain
                            v-if="scope.row.reportStatus == shStatus || scope.row.reportStatus == tgStatus || scope.row.vcfinanceDate != null"
                            @click="openEditFinance(scope.row.financeId)">编辑</el-button>
                        <el-button size="mini" type="danger" plain v-if="scope.row.vcfinanceDate != null"
                            @click="Delete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <span class="demonstration"></span>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 15, 20, 25]" :page-size="pageSize"
                    layout="sizes, prev, pager, next, total, jumper " :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { findListFinance, initListFinance, deleteFinanceMain, exportFinanceReport, exportFinanceReportBatch } from "../../request/api";
import axios from 'axios';
export default {
    data() {
        return {
            currentPage: 0,
            pageSize: 10,
            total: 0,
            userId: "",
            financeListTable: [],
            reportedStatusTypeList: [],
            reportTypeList: [],
            dialogTableVisible: false,
            dialogFormVisible: false,
            serchForm: {
                vcEnterpriseName: "",
                reportStatus: "",
                startTime: "",
                endTime: "",
                reportType: "",
            },
            ids: "",
            shStatus: "已提交（审核中）",
            tgStatus: "已提交（已通过）"

        };
    },
    components: {},
    mounted() {
        this.initListFinance();
        this.findListFinance();
    },
    methods: {

        /*初始化被投公司财务管理列表*/
        initListFinance() {
            initListFinance({
            })
                .then((res) => {
                    this.serchForm.vcEnterpriseName = res.data.entErpriseLibrary.entName;
                    this.serchForm.startTime = new Date().getFullYear().toString();
                    this.serchForm.endTime = new Date().getFullYear().toString();
                    this.reportedStatusTypeList = res.data.reportedStatusTypeList;
                    this.reportTypeList = res.data.reportTypeList;
                    this.serchForm.reportType = this.reportTypeList[0].value;
                    console.log(res.data);
                    this.findListFinance();
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*查询财务管理列表*/
        findListFinance() {
            findListFinance({
                start: this.currentPage,
                length: this.pageSize,
                vcEnterpriseName: this.serchForm.vcEnterpriseName,
                reportStatus: this.serchForm.reportStatus,
                startTime: this.serchForm.startTime,
                endTime: this.serchForm.endTime,
                reportType: this.serchForm.reportType,
            })
                .then((res) => {
                    if (res.resultCode == "1") {
                        this.financeListTable = res.data.data;
                        this.total = Number(res.data.recordsTotal);
                        this.ids = res.data.orderStr;
                        console.log(res.data);
                    }

                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*打开编辑页面*/
        openEditFinance(id) {
            this.$router.push({ name: '财务信息编辑', params: { id: id } });
        },

        /*报表导出*/
        exportFinanceReport(id) {
            let fileName = "";
            axios.interceptors.response.use(function (response) {
                fileName = response.headers['content-disposition'].split('filename=')[1];
                return response;

            }, function (error) {
                return Promise.reject(error);
            });

            exportFinanceReport({
                id: id,
            })
                .then((res) => {

                    let blob = new Blob([res], { type: 'application/vnd.ms-excel' });

                    if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
                        navigator.msSaveBlob(blob, decodeURI(fileName));
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

        /*报表批量导出*/
        exportFinanceReportBatch(ids) {
            exportFinanceReportBatch({
                ids: ids
            })
                .then((res) => {
                    let contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
                    let filename = contentDisposition.split("filename=")[1];
                    let blob = new Blob([res], { type: 'application/octet-stream' });
                    if (window.navigator.msSaveOrOpenBlob) { //兼容IE10
                        navigator.msSaveBlob(blob, decodeURI(filename))
                    } else {
                        const href = URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
                        const a = document.createElement('a') //创建a标签
                        a.style.display = 'none'
                        a.href = href // 指定下载链接
                        a.download = decodeURI(filename) //指定下载文件名
                        a.click() //触发下载
                        URL.revokeObjectURL(a.href) //释放URL对象
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        /*删除财务数据*/
        deleteFinanceMain(id) {
            deleteFinanceMain({ id: id })
                .then((res) => {
                    if (res.resultCode == "1") {

                        this.findListFinance();
                        console.log(res.data);
                        this.$message.success("删除成功！！");
                    } else {
                        this.$message.error("删除失败！！");
                    }


                })
                .catch(function (err) {

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
                    this.deleteFinanceMain(row.financeId);
                })
                .catch(() => { });
        },

        /*选择页数*/
        handleSizeChange(val) {
            this.pageSize = val;
            this.findListFinance(val, 1);
            this.currentPage = 1;
        },

        /*显示第几页*/
        handleCurrentChange(val) {
            this.currentPage = val;
            this.findListFinance(this.pagesize, val);
        },
    }
}

</script>
<style  scoped>
.el-input {
    width: 300px;
}

.el-form-item {
    margin-left: 18%;
}
.el-row{
    margin-top: -20px;
}
.ebutton {
    float: right;
}

.el-table {
    margin-top: 5%;
}

.el-form {
    margin-top: 5%;
}
</style>