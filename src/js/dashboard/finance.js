
var Finance = function () {
    /**
     * 查询表格
     */
    var draw = 0;
    var listTable = null;
    var initListTable = function () {
        if (listTable != null) {
            listTable.bootstrapTable("refresh", {
                silent: true
            });
            return;
        }
        $("#financeListTable").empty().attr("class", "").attr("data-resizable", "true");
        listTable = $("#financeListTable").bootstrapTable({
            url: "finance/findListFinance.do",
            toolbar: $("#financeListTable").siblings(".dd-table-title"),
            queryParams: function (params) {
                draw++;
                var formData = $("#financeListForm").serializeJSON(); // 查询表单的参数
                var json = {
                    "draw": draw,
                    "start": params.offset,
                    "length": params.limit
                };
                if (params.sort) {
                    json["order"] = "[{\"column\":\"" + params.sort + "\",\"dir\":\"" + params.order + "\"}]";
                }
                var c = $.extend({}, formData, json);
                return c;
            },
            columns: [{
                formatter: function (value, c, index) {
                    let sNo = parseInt(index) + 1;
                    return "<input type='hidden' class='financeIdInp' value='"+c.financeId+"'>" + sNo;
                },
                title: '序号',
                align: "center",
                width: "3%"
            }, {
                field: 'vcEnterpriseName',
                title: '公司名称',
                align: "left",
                width: "15%"
            }, {
                field: 'fiscalYear',
                title: '年度',
                align: "center",
                width: "10%"
            }, {
                field: 'reportType',
                title: '类型',
                align: "center",
                width: "8%"
            }, {
                field: 'financeCurrency',
                title: '币种',
                align: "center",
                width: "8%",
                formatter: function (value, c, index) {
                    return value + ", 单位：元";
                }
            },/* {
                field: 'unit',
                title: '单位',
                align: "center",
                width: "5%"
            },*/ {
                    field: 'vcfinanceDate',
                    title: '填报时间',
                    align: "center",
                    width: "10%"
                },
                {
                    field: 'reportStatus',
                    title: '状态',
                    align: "center",
                    width: "10%"
                },{
                    field: 'auditorName',
                    title: '审核人',
                    align: "center",
                    width: "10%"
                }, {
                    field: 'common_operation',// 操作列,key可随意更换
                    title: i18n.t('GENERAL.COMMON_OPERATION'),
                    align: "center",
                    width: "10%",
                    formatter: function (value, c, index) {
                        if(c.vcfinanceDate==''||c.vcfinanceDate==null){
                            return "";
                        }
                        if(c.reportStatus=="已提交（审核中）"||c.reportStatus=="已提交（已通过）"){
                            return "<a class=\"fa-btn\" onclick=\"Finance.editFinanceBtId('"+c.financeId+"');\">编辑</a>"+
                                "&nbsp;&nbsp;<a class=\"fa-btn\" onclick=\"Finance.exportFinance('"+c.financeId+"');\">导出</a>";
                        }
                        var _financeId = c.financeId;
                        // 操作按钮
                        var _htmlContent = $("#FinancePermissionTemp").html();
                        // 编辑,删除,权限控制
                        _htmlContent = (_htmlContent).replace(/_SHIRO_TEMP_ROLEID/g, _financeId);
                        _htmlContent = (_htmlContent).replace(/_SHIRO_TEMP_TYPE/g, c.feedbackState);
                        _htmlContent = (_htmlContent).replace(/_SHIRO_TEMP_STAGE/g, c.reportStage);
                        _htmlContent = (_htmlContent).replace(/_SHIRO_TEMP_FLAG/g, "true");
                        return _htmlContent;
                    }
                }],
                onLoadSuccess: function (res) {
                // console.log(res)
                    $("#docIdsDiv").text(res.orderStr);
                }
        });

    };
    
    /**
	 * 提交上报
	 * 1 未上报
	 * 4 已打回
	 * 2 已上报
	 * stage 阶段 2 审核上报信息
	 * flag true 为列表 上报, false 为页面内部上报
	 */
	this.onFeedbackState = function(id, type, stage, flag, obj) {
	    //禁用点击
        $(obj).attr("onclick","");
		if(type == '1' || type == '4'){
			GlobalCommon.globaConfirm('上报前必须要保存,确认上报信息?', function() {
                _reportData(id, stage);
            });
		} else {
            $(obj).attr("onclick","Finance.onFeedbackState('" + id + "', '2', '" + stage + "', true, this)");
			bootbox.alert({
                size: 'small',
                message: i18n.t('REPOTED.ERRORINFO')
            });
		}
	};
	
	
	this._reportData = function(id, stage, flag) {
		var url = "rest/finance/editFeedbackState.do";
		var requestParams = {
                type: 'GET',
                url: url,
                alertType: '3',
                data: {
                    financeId: id,
                    feedbackState: "2"
                },
                callback: function(result) {
                    if (result.message == "2") {
                        var title = "财务报表表间勾稽关系不正确，是否继续上报？如继续请在 <span style='font-size: 16px;font-family: 700'>填报说明与反馈</span> 处填写原因。";
                        bootbox.confirm({
                            size: 'large',
                            message: title,
                            buttons: {
                                confirm: {
                                    label: i18n.t('GENERAL.GO')
                                },
                                cancel: {
                                    label: i18n.t('GENERAL.CANCEL')
                                }
                            },
                            callback: function (v) {
                                if (v) {
                                    var formRequest = {
                                        type: 'GET',
                                        url: url,
                                        alertType: '3',
                                        data: {
                                            financeId: id,
                                            feedbackState: "2",
                                            appearOperaction: "true"
                                        },
                                        callback: function(re) {
                                            if(re.resultCode == "0") {
                                                $("#syncRecodeButton").attr("data-report", "0");
                                                bootbox.alert({
                                                    size: 'small',
                                                    message: re.message
                                                });
                                                $("#financeSearchBt").click();
                                                $(".reclick").attr("onclick","Finance.onFeedbackState('" + id + "', '2', '" + stage + "', true, this)");
                                            } else {
                                                $("#syncRecodeButton").attr("data-report", "1");
                                                $(".add-feedback").click();
                                            }
                                        }
                                    };
                                    GlobalCommon.globaAjaxCallback(formRequest);
                                }
                            }
                        });
                    } else {
                        if (!flag) {
                            bootbox.alert({
                                size: 'small',
                                message: result.message
                            });
                        }
                    }
                    $("#financeSearchBt").click();
                    if(result.resultCode == "0") $(".reclick").attr("onclick","Finance.onFeedbackState('" + id + "', '2', '" + stage + "', true, this)");
                }
		};
		GlobalCommon.globaAjaxCallback(requestParams);
	};

    /**
     * 编辑财务
     */
    var editFinanceBtId = function (id) {
        var url = "s/finance/initEditFinance.do?id=" + id, name = "FinanceEdit" + id, title = "财务信息编辑";
        window.parent.Contabs.creatContabs(url, name + id, title);
        console.log(window.parent.Contabs.creatContabs(url, name + id, title));
    };


    /**
     * 财务数据保存前验证数据
     * @returns {boolean}
     */
    var saveFinanceDataBefore = function (flag, myFlag, reportStatus) {
        var projectId = jQuery("#sourceId").val();
        var docType = jQuery("#docType").val();
        var docFlag ='1';
        if(myFlag){
            docFlag = _checkDocExit(projectId, docType);
        }
        // flag为空或undefinde时提示，否则不提示
        if(flag) {
            // Form 验证字段内容
            var fiscalYear = $("#fiscalYear").val();
            if ( fiscalYear == null || fiscalYear == "") {
                bootbox.alert({
                    size: 'small',
                    message: "年度不能为空！"
                });
                return false;
            }
            var financeCurrency = $("#financeCurrency").val();
            if (financeCurrency == "-1" || financeCurrency == "") {
                bootbox.alert({
                    size: 'small',
                    message: "币种不能为空！"
                });
                return false;
            }
            var reportType = $("#reportType").val();
            if (reportType == "-1" || reportType == "") {
                bootbox.alert({
                    size: 'small',
                    message: "类型不能为空！"
                });
                return false;
            }
            var entPerson = $("#entPerson").val();
            if (entPerson == "" || entPerson == null) {
                bootbox.alert({
                    size: 'small',
                    message: "联系人不能为空！"
                });
                return false;
            }
            var entPersonPhone = $("#entPersonPhone").val();
            if (entPersonPhone == "" || entPersonPhone == null) {
                bootbox.alert({
                    size: 'small',
                    message: "联系人联系方式不能为空！"
                });
                return false;
            }
            var entCommitment = $("#entCommitment").val();
            if (entCommitment == "" || entCommitment == null) {
                bootbox.alert({
                    size: 'small',
                    message: "填写承诺不能为空！"
                });
                return false;
            }

            /*var isStampedVersionAudit = $("#isStampedVersionAudit").val();
            if (isStampedVersionAudit == "-1" || isStampedVersionAudit == "") {
                bootbox.alert({
                    size: 'small',
                    message: "是否已上挂盖章版审计报告不能为空！"
                });
                return false;
            }*/

            let opt = jQuery("#reportType").val();
            if(opt == '3' && myFlag){//三季度必须处理
                let inputYear = $("#fiscalYear").val();
                let lastYear = parseInt(inputYear) - 1;
                let tips = "必传两份：[" + inputYear + "] 和 [" + lastYear + "] 三季度盖章版审计报告/财务报告";
                if(parseInt(docFlag) < 2){
                    bootbox.alert({
                        size: 'small',
                        message: tips
                    });
                    return false;
                }
            }else{
                if(docFlag == '0'){
                    bootbox.alert({
                        size: 'small',
                        message: "必须上传一个文档才能保存数据！"
                    });
                    return false;
                }
            }
            saveFinance(flag, myFlag, reportStatus);
        } else {
            if(docFlag == '0'){
                bootbox.alert({
                    size: 'small',
                    message: "必须上传一个文档才能保存数据！"
                });
                return false;
            }
            saveFinance(flag, myFlag, reportStatus);
        }
    };

    /**
     * 判断对象{}是否为空
     * @param e
     * @returns {boolean}
     */
    function isEmptyObject(e) {
        var t;
        for (t in e)
            return !1;
        return !0;
    }

    // 判断文档是否存在
    var _checkDocExit = function(projectId,docType){
        var flag = 0;
        jQuery.ajax({
            type: 'POST',
            url: 's/finance/checkDocExit.json',
            async: false,
            data: {
                projectId: projectId,
                docType: docType
            },
            success: function (data) {
                var result = data;
                flag = result.resultCode;
            }
        });
        return flag;
    };



    /**
     * list表单转json
     * @param id
     */
    function listToJson(id) {
        var array = new Array();
        var re = /^-?[1-9]+(\.\d+)?$|^-?0(\.\d+)?$|^-?[1-9]+[0-9]*(\.\d+)?$/;
        var flag = true;
        $("#" + id).find("tr").each(function () {
            var data = {};
            $(this).find("input").each(function () {
                var inputName = $(this).attr("name");
                var inputValue = $(this).val();
                var isNotEmpty = (inputName == "index1QuarterValue" || inputName == "index1YearValue"
                    || inputName == "index2QuarterValue" || inputName == "index2YearValue") &&
                    inputValue != null &&  inputValue != "";
                if (isNotEmpty) {
                    inputValue = inputValue.replace(/,/g,'');
                    if (!re.test(inputValue)) {
                        bootbox.hideAll();
                        $(this).attr("style", "background-color: red");
                        $(this).click(function(){
                            $(this).removeAttr("style");
                        });
                        if (flag) {
                            flag = false;
                        }
                    }
                }
                if(inputName != undefined) data[inputName] = inputValue;
            });
            if (!isEmptyObject(data)) {
                array.push(data);
            }
        });
        if (!flag) {
            return false;
        }
        return JSON.stringify(array);
    }

    /**
     * 保存财务数据
     */
    var financeIndexValide_continueSave = false;
	var setRedBorder = false;
    var saveFinance = function (flag, myFlag, reportStatus) {
        //console.log("myFlag"+myFlag);
        let opt = jQuery("#reportType").val(); 
        if(opt != '3'){//如果不是三季度则需要校验
            financeRequiredVerify();
        }else if(opt == '3' && myFlag){
            let retStr = checkSeason3DataInput();
            if(retStr != ""){
                bootbox.alert({
                    title: '以下列举字段为必填项，请校验后保存！',
                    size: 'large',
                    message: retStr
                });
                return;
            }
        }
        var balanceSheetJson = listToJson("balanceSheetTable");
        var incomeStatementJson = listToJson("incomeStatementTable");
        var cashFlowStatementJson = listToJson("cashFlowStatementTable");
        if (!balanceSheetJson || !incomeStatementJson || !cashFlowStatementJson) {
            bootbox.alert({
                size: 'small',
                message: "财务指标值必须为数字，请检查修改后重新提交"
            });
            return;
        }
        //必填项验证
        if(opt != '3'){//如果不是三季度则需要校验
            var financeVerify = financeRequiredVerify();
            if (financeVerify != true && myFlag) {
                bootbox.alert({
                    size: 'large',
                    title: '以下列举字段为必填项，请校验后保存！',
                    message: financeVerify
                });
                return;
            }
        }
        var lcpyId = $("#lcpyId").val();
        var financeId = $("#financeId").val();
        var vcEnterpriseName = $("#vcEnterpriseName").val();
        var fiscalYear = $("#fiscalYear").val();
        var reportType = $("#reportType").val();
        var financeCurrency = $("#financeCurrency").val();
        var isStampedVersionAudit = $("#isStampedVersionAudit").val();
        var entPerson = $("#entPerson").val();
        var entPersonPhone = $("#entPersonPhone").val();
        var entCommitment = $("#entCommitment").val();
        var form = $("#FINANCE_ADD_FORM");
        $.ajax({
            type: 'POST',
            url: 's/finance/saveFinance.do',
            data: {
                entId: lcpyId,
                financeId: financeId,
                vcEnterpriseName: vcEnterpriseName,
                fiscalYear: fiscalYear,
                reportType: reportType,
                isStampedVersionAudit: isStampedVersionAudit,
                reportStatus:reportStatus,
                financeCurrency: financeCurrency,
                balanceSheetJson: balanceSheetJson,
                incomeStatementJson: incomeStatementJson,
                cashFlowStatementJson: cashFlowStatementJson,
                continueSave: financeIndexValide_continueSave,
                entPerson:entPerson,
                entPersonPhone:entPersonPhone,
                entCommitment:entCommitment
            },
            success: function (data) {
                financeIndexValide_continueSave = false;
                var result = data;
                var dataHtml = "";
                if (result.resultCode == 0) {
                    if(!setRedBorder) {
                        $("#balanceSheetTable, #incomeStatementTable, #cashFlowStatementTable").find("tbody .badge-danger").each(function(i, e) {
                            $(e).removeClass("badge-danger");
                        });
                    }
                    dataHtml = i18n.t('GENERAL.SUCCESS');
                    //syncRecordeDate.syncMethod(dataHtml);//创建同步记录
                    setRedBorder = false;
                } else {                
                    setRedBorder = false;
                    var dataMessage = result.data;
                    $(dataMessage).each(function () {
                        var message = this.split("::");
                        $("#balanceSheetTable, #incomeStatementTable, #cashFlowStatementTable").find("tr").each(function () {
                            $(this).find("input[name$='SourceName']").each(function () {
                                var td = $(this).closest("td");
                                var inputValue = $(this).val();
                                if (message[0] == inputValue) {
                                    var tdArray = $(td).nextAll();
                                    var bortherTd = tdArray[message[1]];
                                    $(bortherTd).find("input").addClass("badge-danger");
                                    $(bortherTd).find("input").trigger("focus");
                                    $(bortherTd).find("input").click(function(){
                                        $(bortherTd).find("input").removeClass("badge-danger");
                                    });
                                    return true;
                                }
                            });
                        });
                    });
                    var promptTitle;
                    var alertMessage = result.message;
                    var alterMessageCode = result.resultCode;
                    var title = "请检验一下勾稽关系验证是否正确！";
                    if (alterMessageCode == "1") {
                        bootbox.confirm({
                            size: 'large',
                            title: title,
                            message: alertMessage,
                            buttons: {
                                confirm: {
                                    label: i18n.t('GENERAL.OK')
                                },
                                cancel: {
                                    label: i18n.t('GENERAL.CANCEL')
                                }
                            },
                            callback: function (v) {
                                if(v) {
                                    //financeIndexValide_continueSave = true;
                                    //setRedBorder = true;
                                    //saveFinance(flag);
                                }
                            }
                        });
                    } else if (alterMessageCode == "2") {
                        title = "财务报表表间勾稽关系不正确，请校验后保存！";
                    }else if (alterMessageCode == "10") {
                        bootbox.confirm({
                            size: 'small',
                            message: alertMessage,
                            buttons: {
                                confirm: {
                                    label: i18n.t('GENERAL.OK')
                                },
                                cancel: {
                                    label: i18n.t('GENERAL.CANCEL')
                                }
                            },
                            callback: function (v) {
                                if(v) {
                                    $(window.parent.document).contents().find("iframe[src='s/finance/initListFinance.do']")[0].contentWindow.refreshList();
                                    window.parent.Contabs.closeTab();
                                }
                            }
                        });
                    }else{
                        bootbox.confirm({
                            size: 'large',
                            title: title,
                            message: alertMessage,
                            buttons: {
                                confirm: {
                                    label: i18n.t('GENERAL.OK')
                                },
                                cancel: {
                                    label: i18n.t('GENERAL.CANCEL')
                                }
                            },
                            callback: function (v) {
                                if(v) {
                                    //financeIndexValide_continueSave = true;
                                    //setRedBorder = true;
                                    //saveFinance(flag);
                                }
                            }
                        });
                    }
                }
            }
        });
    };

    //三季度数据必填验证
    function checkSeason3DataInput(){
        let retStr = "";
        let trList = jQuery("#balanceSheetTable").find("tr");
        if(!isValueEmpty($(trList[21].children[4]).find('input[type="text"]').val())){
            retStr += "<p>资产负债表-负债合计[期末余额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[21].children[5]).find('input[type="text"]').val())){
            retStr += "<p>资产负债表-负债合计[去年同期余额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[28].children[4]).find('input[type="text"]').val())){
            retStr += "<p>资产负债表-所有者权益合计[期末余额]不能为空</p>";
        }
        if(!isValueEmpty($(trList[28].children[5]).find('input[type="text"]').val())){
            retStr += "<p>资产负债表-所有者权益合计[去年同期余额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[29].children[4]).find('input[type="text"]').val())){
            retStr += "<p>资产负债表-归属母公司所有者权益[期末余额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[29].children[5]).find('input[type="text"]').val())){
            retStr += "<p>资产负债表-归属母公司所有者权益[去年同期余额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[30].children[1]).find('input[type="text"]').val())){
            retStr += "<p>资产负债表-资产总计[期末余额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[30].children[2]).find('input[type="text"]').val())){
            retStr += "<p>资产负债表-资产总计[去年同期余额]不能为空;</p>";
        }
        trList = jQuery("#incomeStatementTable").find("tr");
        if(!isValueEmpty($(trList[1].children[1]).find('input[type="text"]').val())){
            retStr += "<p>利润表-营业收入[三季度累计金额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[15].children[1]).find('input[type="text"]').val())){
            retStr += "<p>利润表-营业利润[三季度累计金额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[20].children[1]).find('input[type="text"]').val())){
            retStr += "<p>利润表-净利润[三季度累计金额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[1].children[2]).find('input[type="text"]').val())){
            retStr += "<p>利润表-营业收入[去年同期累计金额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[15].children[2]).find('input[type="text"]').val())){
            retStr += "<p>利润表-营业利润[去年同期累计金额]不能为空;</p>";
        }
        if(!isValueEmpty($(trList[20].children[2]).find('input[type="text"]').val())){
            retStr += "<p>利润表-净利润[去年同期累计金额]不能为空;</p>";
        }

        return retStr;
    }
    
    //财务 资产负债表, 利润表 必填验证
    function financeRequiredVerify() {

        var result = "";
        var balanceTbody = $("#balanceSheetTable tbody");
        var incomeTbody = $("#incomeStatementTable tbody");
        var cashFlowTbody = $("#cashFlowStatementTable tbody");
        
/*
    	var zczj = $(balanceTbody).find("tr").eq(29).find("td").eq(1).find("input").eq(0).val(); //资产总计
    	var zczjnc = $(balanceTbody).find("tr").eq(29).find("td").eq(2).find("input").eq(0).val(); //资产总计
    	var fzzj = $(balanceTbody).find("tr").eq(29).find("td").eq(4).find("input").eq(0).val(); //负债和所有者权益（或股东权益）总计
    	var fzzjnc = $(balanceTbody).find("tr").eq(29).find("td").eq(5).find("input").eq(0).val(); //负债和所有者权益（或股东权益）总计
    	var jly = $(incomeTbody).find("tr").eq(22).find("td").eq(1).find("input").eq(0).val(); //四、净利润（净亏损以“-”号填列）
*/
    	//var jlync = $(incomeTbody).find("tr").eq(22).find("td").eq(2).find("input").eq(0).val(); //四、净利润（净亏损以“-”号填列）
        /*if (!isValueEmpty(zczj) || !isValueEmpty(zczjnc) ||
                !isValueEmpty(fzzj) || !isValueEmpty(fzzjnc) ||
                !isValueEmpty(jly) ) {
            result += "（资产负债表）资产总计 </br>";
            result += "（资产负债表）负债和所有者权益（或股东权益）总计 </br>";
            result += "（利润表）四、净利润（净亏损以“-”号填列）为必填项";
            return result;
        }*/
        balanceTbody.find("input[type='text']").each(function () {
            if(!isValueEmpty($(this).val())){
                result = "资产负债表 的所有数据必须得填写";
            }
        });
        incomeTbody.find("input[type='text']").each(function () {
            let showFlag = $(this).parent().css('display');
            if('none' != showFlag && !isValueEmpty($(this).val())){
                result = "利润表 的所有数据必须得填写";
            }

        });
        cashFlowTbody.find("input[type='text']").each(function () {
            if(!isValueEmpty($(this).val())){
                result = "现金流量表 的所有数据必须得填写";
            }
        });
        if("" != result){
            return result;
        }
        return true;
    }
    
    function isValueEmpty(val) {
        if (val == undefined || val == null || val == "") {
            return false;
        }
        return true;
    }
    
    //财务模板导出
    var templeExport = function(){
        //var _path=$("#path").val();
        var _action = _path + "/rest/finance/downloadfile.do";
        var url = _action + "?fileName=financeTemplate.xlsx" + "&rm=" + Math.random();
        var left = (window.screen.availWidth - 600) / 2;
        var top = (window.screen.availHeight - 400) / 2;
        window.open(url, "", "height=400, width=600,left=" + left + ", top= " + top + ", toolbar=no," +
            "menubar=no, scrollbars=yes, resizable=yes,location=yes,titlebar=no, menubar=no, status=no");
    };


    var _exportFinance = function(id){
        location.href = "s/finance/exportFinanceReport.do"+ "?id="+id;
    };

    /**
     * 进入导入财务数据页面
     */
    var importFile = function (financeId, obj) {
        var _path = $("#path").val();
        var event = $(obj).data("event");
        var iframeName = $(obj).data("iframename");
        var url = _path + "/rest/finance/importFinance.do?financeId=" 
            + financeId 
            + "&eventType=" + event 
            + "&iframeName="+iframeName;
        $.ajax({
            type: 'GET',
            url: url,
            success: function (data) {
                bootbox.dialog({
                    size: "small",
                    message: data,
                    className: 'uploadFileDialog',
                    title: i18n.t('GENERAL.UPLOADFILE'),
                });
            }
        });
    };

    /**
     * 上传并导入财务指标数据
     * @param financeId
     */
    var importFileData = function (financeId, obj) {
        var formData = new FormData(document.getElementById("importDoc"));
        var event = $(obj).data("event");
        var iframeName = $(obj).data("iframename");
        $.ajax({
            url: $("#path").val() + "/rest/finance/importFinanceData.do?financeId=" + financeId,
            type: "POST",
            data: formData,
            dataType: "json",
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            error: function (data) {
                alert(data.message);
            },
            success: function (data) {
                var result = data;
                var dataHtml = "";
                if (result.resultCode == 1) {
                    dataHtml = i18n.t('GENERAL.SUCCESS');
                } else {
                    dataHtml = result.message;
                }
                $('#importDoc').hideLoading();
                bootbox.alert({
                    size: 'small',
                    message: dataHtml,
                    callback: function(v){
    	                bootbox.hideAll(); // 隐藏所有的bootbox
                        if(event != "edit") {
    	            		initListTable();	//初始化查询
                        } else {
    	            	    //刷新当前页面
                            var $iframs = $(".J_mainContent .J_iframe[name^='iframe"+iframeName+"']", window.parent.parent.document);
                            $iframs.attr('src', $iframs.attr('src'));
	                		//GlobalUtil.reloadTab(iframeName);
                        }
                    }
                });
            }
        });
    };
    var deleteFinanceMain = function (id) {
        bootbox.confirm({
            size: 'small',
            message: i18n.t('GENERAL.CONFIRM.GEN'),
            buttons: {
                confirm: {
                    label: i18n.t('GENERAL.OK')
                },
                cancel: {
                    label: i18n.t('GENERAL.CANCEL')
                }
            },
            callback: function (result) {
                if (result) {
                    jQuery.ajax({
                        type: 'POST',
                        url: "s/finance/deleteFinanceMain.json",
                        data: {
                            "id": id
                        },
                        success: function (data) {
                            var result = data;
                            var dataHtml = "";
                            if (result.resultCode == 1) {
                                dataHtml = i18n.t('GENERAL.SUCCESS');
                            } else {
                                var message = result.message;
                                dataHtml = message;
                            }
                            bootbox.hideAll();
                            initListTable();
                            bootbox.alert({
                                size: 'small',
                                message: dataHtml
                            });
                        }
                    });
                }
            }
        })
    };
    var updateFinanceReportStatus = function (financeId,reportStatus) {
        bootbox.confirm({
            size: 'small',
            message: i18n.t('GENERAL.CONFIRM.GEN'),
            buttons: {
                confirm: {
                    label: i18n.t('GENERAL.OK')
                },
                cancel: {
                    label: i18n.t('GENERAL.CANCEL')
                }
            },
            callback: function (result) {
                if (result) {
                    jQuery.ajax({
                        type: 'POST',
                        url: "s/finance/updateFinanceReportStatus.json",
                        data: {
                            "financeId": financeId,
                            "reportStatus":reportStatus
                        },
                        success: function (data) {
                            var result = data;
                            var dataHtml = "";
                            if (result.resultCode == 1) {
                                dataHtml = i18n.t('GENERAL.SUCCESS');
                            } else {
                                var message = result.message;
                                dataHtml = message;
                            }
                            bootbox.hideAll();
                            bootbox.alert({
                                size: 'small',
                                message: dataHtml,
                                callback: function(v){
                                    bootbox.hideAll(); // 隐藏所有的bootbox
                                    $(window.parent.document).contents().find("iframe[src='s/finance/initListFinance.do']")[0].contentWindow.refreshList();
                                    window.parent.Contabs.closeTab();
                                }
                            });
                        }
                    });
                }
            }
        })
    };
    /**
     * 退回-财务
     */
    var backFeedbackState = function() {
        var url = "rest/finance/manageEditFeedbackStage.do",
            financeId = $("#FINANCE_EDIT_FORM #financeId").val(),
            companyId = $("#FINANCE_EDIT_FORM input[name='companyId']").val(),
            params = {
                financeId: financeId,
                feedbackState: "4",
                lcpyId: companyId,
                type: "finance"
            };
        if(!GlobalUtil.valiadedIsEmpty(financeId)) {
            ReportDataManage.backFeedbackState(url, params);
        } else {
            bootbox.alert({
                size: 'small',
                message: "没有[财务信息]数据！"
            });
        }
    };
    
    /**
     * 移入时改变文本框的值
     */
    this.focusReinputVal = function(obj) {
        var decimalValue = $(obj).attr("decimal-value");
        if(decimalValue) {
            decimalValue = GlobalUtil.finnanceDataCancel(decimalValue);
            decimalValue = GlobalUtil.number_format(decimalValue,'2', '.', ',');
            $(obj).val(decimalValue);
            //置空，避免多次移入时改变值
            $(obj).removeAttr("decimal-value");
        }
    };
    
    /**
     * 移除时重新赋值
     */
    this.blurReinputVal = function(obj) {
        var value = $(obj).val();
        if (value) {
            value = GlobalUtil.finnanceDataCancel(value);
            value = GlobalUtil.number_format(value,'2', '.', ',');
        }
        $(obj).val(value);
        $(obj).closest("td").find("input:eq(0)").val(value);
    }
    /*===================下载文件
     * options:{
     * url:'',  //下载地址
     * data:{name:value}, //要发送的数据
     * method:'post'
     * }
     */
    var DownLoadFile = function (options) {
        var config = $.extend(true, { method: 'post' }, options);
        var $iframe = $('<iframe id="down-file-iframe" />');
        var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
        $form.attr('action', config.url);
        for (var key in config.data) {
            $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
        }
        $iframe.append($form);
        $(document.body).append($iframe);
        $form[0].submit();
        $iframe.remove();
    };
    var downloadFinanceZip = function () {
        /*var idList = new Array();
        jQuery('.financeIdInp').each(function () {
            if($(this).val()!=null&&$(this).val()!=''&&$(this).val()!='null')
            idList.push($(this).val())
        });*/
        //location.href = "s/finance/exportFinanceReportBatch.do"+ "?ids="+$("#docIdsDiv").text();
        DownLoadFile({
            url:"s/finance/exportFinanceReportBatch.do",
            method:"POST",
            data:{
                ids:$("#docIdsDiv").text()
            }
        });
    };
    return {
        init: function () {
            $("#financeSearchBt").click(function () {
                initListTable();
            });
            initListTable();
        },
        //编辑财务
        editFinanceBtId: function (id) {
            editFinanceBtId(id);
        },
        downloadFinanceZip:function () {
            downloadFinanceZip();
        },
        //保存
        saveFinance: function (flag, myFlag, reportStatus) {
            return saveFinanceDataBefore(flag, myFlag, reportStatus);
        },
        templeExport: function() {
            templeExport();
        },
        //导入数据
        importFile: function (financeId, obj) {
            importFile(financeId, obj);
        },
        importFileData: function (financeId, obj) {
            importFileData(financeId, obj);
        },
        onFeedbackState: function(id, type, stage, flag,obj) {
            onFeedbackState(id, type, stage, flag,obj);
        },
        backFeedbackState: function() {
            backFeedbackState();
        },
        focusReinputVal: function(obj) {
            focusReinputVal(obj);
        },
        blurReinputVal: function(obj) {
            blurReinputVal(obj);
        },
        deleteFinanceMain: function(id) {
            deleteFinanceMain(id);
        },
        updateFinanceReportStatus:function (financeId,reportStatus){
            updateFinanceReportStatus(financeId,reportStatus);
        },
        exportFinance:function(id){
            _exportFinance(id);
        }
    };
}();
// 新增或编辑财务信息
const editFinanceBtId = (id) =>{

    
}
export default{

}