<template>

  <el-container>
    <el-aside :width="collapse ? '50px' : '200px'">
      <div id="menu">
        <div id="menu-top">
          <el-row>
            <a href="s/" v-show="!collapse">
              <img src="../../assets/common/log/logo.png" style=" width: 123px;
  height: 35px;margin: 10px;">
            </a>
            <img style="width: 14px;
    height: 14px;margin: 10px 20px;
    " src="../../assets/common/log/sidebar_toggler_icon_darkblue.png" @click="collapse = !collapse">
          </el-row>

        </div>
        <el-menu router :background-color="backgroundColor" :text-color="textColor" :collapse="collapse" id="el-menu">
          <el-menu-item :index="item.url" v-for="item in noChildren" :key="item.url" @click="clickMenu(item)">
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </el-menu-item>
          <el-submenu :index="item.name" v-for="(item, index) in hasChildren" :key="index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title" class="tit">{{ item.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="subItem.url" v-for="(subItem, subIndex) in item.children" :key="subIndex"
                @click="clickMenu(subItem)">
                {{ subItem.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>
    <el-container>
      <el-header style="height: 50px;">
        <ContentHead></ContentHead>
      </el-header>
      <el-main>
        <div>
          <router-view></router-view>
        </div>
      </el-main>
      <el-footer>
        <ContentFoot></ContentFoot>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import VerticalToggle from "../../store/VerticalToggle";
import Vue from "vue";
Vue.component(VerticalToggle.name, VerticalToggle);
import ContentHead from '../common/contentHead.vue';
import ContentFoot from '../common/contentFoot.vue';
export default {
  inject: ["reload"],
  name: "index",
  data() {
    return {
      collapse: false, //是否折叠
      backgroundColor: "#304156",
      textColor: "#b4bcc8",
      logo: "",
      list: [],
      role: "",
    };
  },
  components: {
    ContentFoot,
    ContentHead
  },
  created() {
    // 表示一打开这个页面，就运行这里
    this.role = sessionStorage.getItem("userType");
    this.getMenuLIst(); // 获取菜单
  },

  computed: {
    // 获取菜单对象中不包含子级的菜单
    noChildren() {
      return this.list.filter((item) => !item.children);
    },

    // 获取菜单对象中包含子级的菜单
    hasChildren() {
      return this.list.filter((item) => item.children);
    },

  },

  methods: {
    getMenuLIst() {
      // 如果登录角色为 role = admin1
      if (this.role == "102") {
        this.list = [
          {
            name: "首页",
            id: 1,
            icon: "el-icon-s-home",
            url: "/financeDashboard/financeDashboardContent",
          },
          {
            name: "被投公司财务管理",
            id: 2,
            icon: "el-icon-film",
            url: "/financeDashboard/financeInfo",
          },
        ];
      }
    },
    clickMenu(item) {
      // 调用store中的tab.js文件定义的selectMenu方法
      this.$store.commit("selectMenu", item);
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
}

.el-header {
  background-color: #e9eef5;
}

.el-footer {
  margin-left: -12%;
  background-color: #304156;
}

.el-aside {
  background-color: #304156;
  transition: width 0.25s;
  -webkit-transition: width 0.25s;
  -moz-transition: width 0.25s;
  -webkit-transition: width 0.25s;
  -o-transition: width 0.25s;
}

body::-webkit-scrollbar {
  display: none;
}

body {
  background-color: #e1e5ec !important;
  color: #333;
  font-family: "Alibaba Sans", "Source Han Sans" !important;
}

* {
  font-size: 14px !important;
}

#menu-top {
  background-color: #e1e5ec;
  height: 50px;
}


.el-menu {
  border-right: none;
  height: 100%;
}

.el-menu-item {
  margin: 0px -10px;
}

a {
  text-decoration: none;
}

span {
  position: relative;
  text-decoration: none;
  font-size: 14px;
  font-weight: 300;
  color: #b4bcc8;
  font-family: "Alibaba Sans", "Source Han Sans" !important;
}
</style>