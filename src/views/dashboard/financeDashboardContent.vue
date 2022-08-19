<template>
  <div>
    <div>
      <p style="margin-top:15px;text-align: center;font-size: 30px!important;">欢迎使用信德财务平台</p>
    </div>
    <div style="background-color:#f5f8fd;border-color: #8bb4e7;color: #010407;padding: 5px 5px 5px 5px; font-weight: bolder;">
      <p>
        财务信息整体填报说明：
      </p>
      <p>
        (1) 请在《股权类投资-被投公司财务管理》编辑页面，提交企业合并层面的财务数据.
      </p>
      <p>
        (2) 请在每年4月30日前提交企业上个会计年度的财务数据，并在每年8月31日前提交企业半年度的财务数据，具体操作请看下方.
      </p>
      <p>
        <strong style="color:#f00">*填写企业必须承诺，将按照企业会计准则的规定编制财务报表，公司管理层对所填写财务报表及提交相关附件的真实性、合法性和完整性承担责任。 </strong>
      </p>
    </div>
    <div class="card-group">
      <el-row style="margin-left:10%;">
        <el-col :span="4" v-for="label in labels" :key="label.id" :offset="1">
          <el-card class="card">
            <div style="padding: 14px;">
              <span class="lab">
                <i class="el-icon-coin"></i>
                {{ label.tille }}</span>
              <el-divider></el-divider>
              <p>{{ label.content }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="success"  size="small" @click="openEditFinance()">我已知悉，开始填报</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labels: [
        {
          id: "1",
          tille: "用户填写财务数据",
          content: "用户首先新增该上报的财务数据，点击->新增，选择币种、是否已上挂盖章版审计报告，按顺序填写资产负债表，利润表，现金流量表"
        }, {
          id: "2",
          tille: "提交或保存",
          content: "确认无误后点击保存或者上报。点击“保存”，不进行上报工作，可后续继续修改。点击“上报”，数据无法进行修改，只能等待审核完成后的操作。"
        }, {
          id: "3",
          tille: "信德审核",
          content: "数据一旦提交，审核人登录系统进入当前数据编辑，在下方进行审核“通过”或“打回“, 当审核结果为“打回”时，被投公司需要再次修改和重新上报时首次财务数据。"
        }, {
          id: "4",
          tille: "上报完成",
          content: "当审核结果为通过时，后续结果无法对数据进行相应的修改和操作。"
        }
      ]
    };
  },
  methods: {
    /*打开编辑页面*/
    openEditFinance(id) {
      this.$router.push({ name: '财务信息编辑', params: { id: id } });
    },
  }
}
</script>
<style scoped>
.card-group {
  background-color: #f5f5f5 !important;
  margin-top: 2%;
  padding-top: 2%;
  padding-bottom: 2%;
}

.el-row {
  text-align: center;
  margin-top: 1%;
}

.card {
  height: 300px;
  margin-top: 5%;
  margin-left: 10%;
  font-weight: bolder;
  font-size: 14px !important;
  text-align: left;
}

.lab {
  color: #32c5d2 !important;
  white-space: pre-wrap
}

.el-button {
  margin-top: 30px;
  background-color:orangered ;
  color: white;
   border: none;
}
</style>