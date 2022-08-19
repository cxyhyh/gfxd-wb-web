<template>
  <div>
    <div class="page-footer-inner">
        {{contentYear}}
        <a href="https://www.gfinvestment.cn/#/" target="_blank">{{contentHref}}</a>{{contentFoot}}
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      contentYear:"2022©",
      contentHref:"GF  XINDE  INVESTMENT  MANAGEMENT  CO.,  LTD.",
      contentFoot:" All rights reserved."
    };
  },
  components: {},
  methods: {}
}

</script>
<style scoped>
.page-footer-inner {
    color: #98a6ba;
    margin-top: 1%;
     font-size: 13px;
    font-family: "Alibaba Sans", "Source Han Sans" !important;
    text-align: center;
}
a {
    color: #037ef3;
    text-decoration: none;
    background-color: transparent;
}
</style>