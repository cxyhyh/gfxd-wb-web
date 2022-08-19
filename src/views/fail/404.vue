
<template>
  <div class="wscn-http404-container">

    <div style="margin-top: 5%;">
       <img src="../../assets/common/404/404_cloud.png" alt="404">
      <img src="../../assets/common/404/404.png" alt="404">
     
    </div>
    <div>
      <div>OOPS!</div>
      <div>{{ message }}</div>
      <div>Please check that the URL you entered is correct, or click the button below to return to the homepage.</div>
      <a href="/">Back to home</a>
    </div>
  </div>

</template>

<script>

export default {
  name: 'f404vue',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style scoped>
.wscn-http404-container {
  background-color: white;
  text-align: center;
}
</style>
