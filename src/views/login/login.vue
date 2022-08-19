<template>
  <el-container style="width: 100%;">
    <el-main>
      <div class="login-main">
        <div>
          <h2>信德项目管理系统</h2>
          <el-row>
  <el-input type="text" v-model.trim="user.loginName" size="medium" placeholder="请输入用户名">
            <template slot="prepend">
              <img src="@/assets/yonghuming.png" alt="" class="login-image" />
            </template>
          </el-input>
          </el-row>
            <el-row>
             <el-input type="password" v-model.trim="user.password" size="medium" placeholder="请输入密码" show-password>
            <template slot="prepend">
              <img src="@/assets/mima.png" alt="" class="login-image" /> </template>
          </el-input>
          </el-row>
            <el-row>
             <el-input v-model="yanzhengma" class="input" size="medium" placeholder="请输入验证码">
            <template slot="prepend">
              <img src="@/assets/yanzhengma.png" alt="" class="login-image" />
            </template>
            <template slot="append">
              <div @click="refreshCode">
                <s-identify :identifyCode="identifyCode" @click="refreshCode"></s-identify>
              </div>
            </template>
          </el-input>
          </el-row>
            <el-row>
              <el-button type="primary" size="medium" @click="checkLogin">登录</el-button>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import SIdentify from "@/components/yanzhengma.vue";
import { login } from "../../request/api";
import { Base64 } from 'js-base64';
import Cookie from 'js-cookie'
export default {
  data() {
    return {
      user: {
        loginName: "",
        password: "",
      },
      yanzhengma: "",
      jizhumima: false,
      identifyCode: "1254",
    };
  },
  components: {
    SIdentify,
  },
  mounted() {

    let jzmm = Boolean(window.sessionStorage.getItem("jizhumima"));
    if (jzmm) {
      this.jizhumima = jzmm;
      this.password = window.sessionStorage.getItem("isPassword");
      this.username = window.sessionStorage.getItem("isUserName");
    }
    this.refreshCode();
    console.log(window.sessionStorage.getItem("jizhumima"), this.jizhumima);
  },
  methods: {

    /*登录前校验*/
    checkLogin() {
      if (!this.user.loginName || !this.user.password) {
        this.$message({
          type: "error",
          message: "用户名或密码不允许为空",
        });
        return;
      }
      if (!this.yanzhengma) {
        this.$message({
          type: "error",
          message: "验证码不能为空",
        });
        return;
      }
      let isyanzhengma = this.getyanzhengma(this.yanzhengma);
      if (!isyanzhengma) {
        this.$message({
          type: "error",
          message: "验证码错误",
        });
        this.yanzhengma = "";
        return;
      }
      this.login(this.user.loginName, this.user.password);

    },

    /*刷新验证码*/
    refreshCode() {
      let tempNum = parseInt(Math.random() * 10000);
      if (tempNum > 999) {
        this.identifyCode = String(tempNum);
      } else {
        this.refreshCode();
      }
    },

    /*请求验证码判断*/
    getyanzhengma(yanzhengma) {
      if (yanzhengma == this.identifyCode) {
        return true;
      } else {
        this.refreshCode();
        return false;
      }
    },

    /*登录*/
    login() {
      login({
        loginName: this.user.loginName,
        password: Base64.encode(this.user.password)
      })
        .then((res) => {
          if (res.resultCode == 0) {
            Cookie.set('loginName', this.user.loginName);
            Cookie.set('loginUserId', res.data.loginUserId);
            Cookie.set('userName', res.data.userName);
            sessionStorage.setItem('token',this.user.loginName);
            sessionStorage.setItem('userType',res.data.userType);
            if(res.data.userType == "102"){
            this.$message.success(res.message);
            this.$router.push("/financeDashboard/financeDashboardContent");
            }
          } else {
            this.$message.error(res.message);
          }
          console.log(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    },
  },

};
</script>
<style scoped>
html,
body,
#app,
.el-container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.el-main {
  width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  font-family: "Alibaba Sans", "Source Han Sans" !important;
}

h2 {
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: white;
  font-size: 20px;
}

.login-image {
  width: 12px;
  height: 12px;
}

.login-main>div {
  text-align: center;
  margin-top: 10%;
}

.el-input ,.el-button{
  margin: 10px 0;
  width: 300px;
}
</style>
