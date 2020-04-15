<template>
  <div class="header-wrapper">
    <h3 class="header-title">
      {{title}}
    </h3>
    <slot name="btn">
      <Button type="primary" @click="$router.go(-1)">返回</Button>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'my-header',
  props: {
    title: {
      title: String,
      default: '广告位管理'
    }
  }
}
</script>

<style scoped lang="less">
.header-wrapper{
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  height: 72px;
  line-height: 72px;
  align-items: center;
  padding: 16px 30px 16px 20px;
  .header-title{
    font-size: 20px;
  }
}
</style>
