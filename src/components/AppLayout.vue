<template>
  <app-header></app-header>
  <app-navbar></app-navbar>
  <app-main></app-main>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppNavbar from "@/components/AppNavbar";
import AppMain from "@/components/AppMain";
export default {
  name: "AppLayout",
  components: {AppMain, AppNavbar, AppHeader}
}
</script>

<style scoped>
.header {
  position: absolute;
  height: 40px;
  padding: 0;
  top: 0;
  left: 0;
  right: 0;
  background-color:#2d3436;
  color:#e1ffff;
  /*background-color: #545c64;*/
}

.navbar {
  position: absolute;
  width: 200px;
  top: 40px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  background-color: #29333a;
}

.main {
  position: absolute;
  top: 40px;
  left: 200px;
  right: 0;
  bottom: 0;
  /*padding: 10px;*/
  overflow-y: auto;
  /*background-color: yellowgreen;*/
}

</style>