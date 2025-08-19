<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>{{ menuItem.name }}</template>
    <div v-for="subMenuItem in menuItem.subMenu" :key="subMenuItem.key">
      <SubMenu
          v-if="subMenuItem.subMenu && subMenuItem.subMenu.length > 0"
          :menuItem="subMenuItem"
      ></SubMenu>
      <el-menu-item
          v-else
          :index="subMenuItem.key"
      >{{ subMenuItem.name }}</el-menu-item>
    </div>
  </el-sub-menu>
</template>

<script setup>
defineProps({
  menuItem: Object
});
</script>

<style lang="less" scoped>

</style>