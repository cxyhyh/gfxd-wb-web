<template>
  <div class="contains">
    <el-container>
      <el-main>
        <Login></Login>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import Login from "../login/login.vue"
export default {
  inject: ["reload"],
  name: "index",
  data() {
    return {
    };
  },
  components: { Login },
  methods: {
  },
};
</script>
<style scoped>
body::-webkit-scrollbar {
  display: none;
}

.contains {
  background: linear-gradient(to top right, #1169c2 0%, #0f79c5 25%, #b1cae2 100%);
  background-size: 100% 100%;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>