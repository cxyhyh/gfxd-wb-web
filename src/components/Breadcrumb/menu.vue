<template>
  <div id="menu">
    <div id="menu-top" :width="collapse ? '45px' : '200px'">
      <el-row>
        <a href="s/" v-show="!collapse">
          <img src="../../assets/common/log/logo.png" style=" width: 123px;
  height: 35px;margin: 10px;">
        </a>
        <img style="width: 14px;
    height: 14px;margin: 10px 20px;
    " src="../../assets/common/log/sidebar_toggler_icon_darkblue.png" @click="showOrHidden()">
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
</template>

<script>
import VerticalToggle from "../../store/VerticalToggle";
import Vue from "vue";
Vue.component(VerticalToggle.name, VerticalToggle);
export default {
  name: "",
  components: {
  },
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
    showOrHidden(){
      this.collapse = !this.collapse;
      if(this.collapse){
        document.getElementById('el-menu').style.width = '45px';
      }else{
        document.getElementById('el-menu').style.width = '200px';
      }

    }
  },
};
</script>
<style  scoped>
#menu-top {
  background-color: #e1e5ec;
  height: 50px;
}

.title {
  background: #e1e5ec;
  color: #b4bcc8;
  font-size: 20px;
  height: 40px;
  padding: 5px 10px;
  vertical-align: middle;
}

.el-menu {
  border-right: none;
  height: 100%;
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