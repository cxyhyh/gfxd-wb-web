<template>
  <div>
    <el-row>
      <el-col :span="19">
      <BreadCrumb></BreadCrumb>
      </el-col>
      <el-col :span="5"><el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-s-help"></i>语言</template>
        <el-menu-item index="1-1">
          <img src="../../assets/common/log/cn.png">&nbsp;中文简体
        </el-menu-item>

      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <el-avatar>
            <img src="../../assets/common/log/avatar.png">
          </el-avatar>{{ username }}
        </template>
        <el-menu-item index="2-1"> <a @click="dialogFormVisible = true">
            <i class="el-icon-user"> </i>
            个人信息
          </a></el-menu-item>
        <el-menu-item index="2-2"><a @click="dialogFormPwdVisible = true">
            <i class="el-icon-edit-outline"> </i>
            修改密码
          </a></el-menu-item>
        <el-menu-item index="2-3">
          <router-link to="/" @click.native="exit" class="exit">
            <i class="el-icon-turn-off"> </i>
            退出
          </router-link>
        </el-menu-item>
      </el-submenu>
    </el-menu></el-col>
 
    </el-row>
    
    
   
    <el-dialog title="个人信息" :visible.sync="dialogFormVisible" center>
      <el-form :model="form" :inline="true" label-width="80px" :label-position="labelPosition">
        <div>
          <el-row>
            <el-col :span="4">
              <el-avatar shape="square" :size="100">
                <img :src="avatar" />
              </el-avatar>
            </el-col>
            <el-col :span="5">
              <div>
                <div>
                  <span style="font-size: 19px;">{{ username }}</span><i class="el-icon-success"
                    style="color: green;font-size: 20px;"></i>
                </div>
                <div>
                  <span style="font-size: 11px;">{{ this.form.email }}</span>
                </div>
              </div>
            </el-col>


          </el-row>
        </div>
        <div @click="showBaseInfo = !showBaseInfo">
          <span class="titleSpan"><i class="el-icon-chat-line-square"></i>基本信息</span>
        </div>
        <el-divider></el-divider>
        <el-collapse-transition>
          <div v-show="showBaseInfo">
            <el-row>
              <el-form-item label="登录名称" :label-width="formLabelWidth">
                <el-input v-model="form.loginName" size="small" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="用户名称" :label-width="formLabelWidth">
                <el-input v-model="form.userName" autocomplete="off" size="small"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="性别" :label-width="formLabelWidth">
                <el-select v-model="form.sex" size="small" clearable style="width: 200px;">
                  <el-option v-for="ct in sexType" :key="ct.value" :value="ct.code" :label="ct.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工号" :label-width="formLabelWidth">
                <el-input v-model="form.workNumber" autocomplete="off" size="small"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="邮件地址" :label-width="formLabelWidth">
                <el-input v-model="form.email" autocomplete="off" size="small"></el-input>
              </el-form-item>
              <el-form-item label="移动电话" :label-width="formLabelWidth">
                <el-input v-model="form.mobile" autocomplete="off" size="small"></el-input>
              </el-form-item>
            </el-row>
          </div>
        </el-collapse-transition>
        <div @click="showDept = !showDept">
          <span class="titleSpan"><i class="el-icon-coin"></i>所属部门</span>
        </div>
        <el-divider></el-divider>
        <el-collapse-transition>
          <div v-show="showDept">
            <el-form-item :label-width="formLabelWidth">
              <el-select v-model="form.deptId" size="small" clearable>
                <el-option v-for="ct in deptList" :key="ct.deptName" :value="ct.deptId" :label="ct.deptName">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-collapse-transition>
        <div @click="showGroup = !showGroup">
          <span class="titleSpan"><i class="el-icon-coin"></i>团队角色</span>
        </div>
        <el-divider></el-divider>
        <el-collapse-transition>
          <div v-show="showGroup">
            <el-form-item label="团队名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="角色名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" size="small" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </el-collapse-transition>
        <div @click="showRole = !showRole">
          <span class="titleSpan"><i class="el-icon-coin"></i>项目角色</span>
        </div>
        <el-divider></el-divider>
        <el-collapse-transition>
          <div v-show="showRole">
            <el-form-item label="项目名称" :label-width="formLabelWidth">
              <el-select v-model="form.entId" size="small" clearable style="width: 300px;" :disabled="true">
                <el-option v-for="ct in entLibraryList" :key="ct.value" :value="ct.code" :label="ct.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" size="small" :disabled="true"></el-input>
            </el-form-item>
          </div>
        </el-collapse-transition>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="saveUser()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="dialogFormPwdVisible" width="30%" center>
      <el-form :model="formPwd" status-icon :rules="rules" ref="formPwd" :label-position="labelPosition"
        label-width="80px">
        <el-row>
          <el-form-item label="原密码" prop="oldPassword">
            <el-input type="password" v-model="formPwd.oldPassword" size="small" class="filter-item">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" v-model="formPwd.newPassword" size="small" class="filter-item">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password" v-model="formPwd.confirmPassword" size="small" class="filter-item">
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormPwdVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="beforeEditUserPwd('formPwd')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from '../../components/Breadcrumb/breadcrumb.vue';
import { initEditUser, editUserPwd, getUserAvatar, saveUser } from '../../request/api'
import Cookie from 'js-cookie';
import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.formPwd.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      labelPosition: 'right',
      username: Cookie.get("userName"),
      dialogFormVisible: false,
      dialogFormPwdVisible: false,
      form: {
        userName: '',
        loginName: '',
        workNumber: '',
        email: '',
        mobile: '',
        sexType: '',
        deptId: '',
        entId: '',

      },
      formPwd: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      formLabelWidth: '100px',
      deptList: [],
      entLibraryList: [],
      sexType: [],
      showBaseInfo: false,
      showDept: false,
      showGroup: false,
      showRole: false,
      userId: '',
      avatar: '',
      rules: {
        oldPassword: [
          { required: true, message: '这是必填字段', trigger: 'blur' },
          { min: 4, max: 20, message: ' 请输入长度在 4 到 20 之间的字符串', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '这是必填字段', trigger: 'blur' },
          { min: 4, max: 20, message: ' 请输入长度在 4 到 20 之间的字符串', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '这是必填字段', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
          { min: 4, max: 20, message: ' 请输入长度在 4 到 20 之间的字符串', trigger: 'blur' }
        ],
      }
    };
  },
  components: {BreadCrumb},
  mounted() {
    this.initEditUser();

  },
  methods: {

    /*打开个人信息界面*/
    openUserBaseInfo() {
      this.dialogFormVisible = true;
    },

    /*初始化编辑用户页面*/
    initEditUser() {
      initEditUser({

      })
        .then((res) => {
          this.form.userName = res.data.user.userName;
          this.form.loginName = res.data.user.loginName;
          this.form.workNumber = res.data.user.workNumber;
          this.form.email = res.data.user.email;
          this.form.mobile = res.data.user.mobile;
          this.form.sex = res.data.user.sex;
          this.form.deptId = res.data.user.deptId;
          this.form.entId = res.data.user.entId;
          this.userId = res.data.user.userId;
          this.deptList = res.data.deptList;
          this.sexType = res.data.sexType;
          this.entLibraryList = res.data.entLibraryList;
          this.getUserAvatar();
          console.log(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    },

    /*修改用户密码前校验*/
    beforeEditUserPwd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editUserPwd();
        } else {
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /*修改用户密码*/
    editUserPwd() {
      var oldPasswordSH = CryptoJS.SHA512(this.formPwd.oldPassword).toString();
      console.log(oldPasswordSH);
      editUserPwd({
        oldPassword: oldPasswordSH,
        newPassword: Base64.encode(CryptoJS.SHA512(this.formPwd.newPassword).toString()),
        userId: this.userId
      })
        .then((res) => {
          if (res.resultCode == "1") {
            this.dialogFormPwdVisible = false;
            this.resetForm('formPwd');
            this.$message.success("修改成功！");
            console.log(res.data);
          } else {
            this.$message.error(res.message);
          }

        })
        .catch(function (err) {
          console.log(err);
        });
    },

    /*保存用户*/
    saveUser() {
      saveUser({
        userName: this.form.userName,
        loginName: this.form.loginName,
        worknumber: this.form.worknumber,
        email: this.form.email,
        mobile: this.form.mobile,
        userId: this.userId,
        token: ''
      })
        .then((res) => {
          if (res.resultCode == "1") {
            this.dialogFormVisible = false;
            this.$message.success(res.message);
            this.resetForm('form');
            this.initEditUser();
            console.log(res.data);
          } else {
            this.$message.error(res.message);
          }

        })
        .catch(function (err) {
          console.log(err);
        });
    },

    /*获取用户头像*/
    getUserAvatar() {
      getUserAvatar({
      })
        .then((res) => {
          this.avatar = 'data:image/png;base64,' + res;
        })
        .catch(function (err) {
          console.log(err);
        });
    },

    exit() {
      sessionStorage.clear();
    },

    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          resolve(e.target.result);
        };
        // readAsDataURL
        fileReader.readAsDataURL(blob);
        fileReader.onerror = () => {
          reject(new Error('blobToBase64 error'));
        };
      });
    },

    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>
<style scoped>
body {
  width: 100%;
}

.titleSpan {
  font-size: 16px;
}

.el-menu-item {
  color: #333;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

}

.el-avatar {
  width: 29px;
  height: 29px;
  margin-bottom: 5%;
  margin-right: 3%;
}

.el-menu {
  float: right;
  background-color: #e9eef5;
  height: 48px;
}

a {
  padding: 8px 16px;
  color: #6f6f6f;
  text-decoration: none;
  display: block;
  clear: both;
  font-weight: 300;
  line-height: 18px;
  white-space: nowrap
}

.el-input {
  width: 200px;
}
</style>