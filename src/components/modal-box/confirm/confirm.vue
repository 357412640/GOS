<template>
    <div class="modal-box" @click.self="$emit('cancel')">
      <div class="content-box">
        <h3 class="title">{{title}}</h3>
        <slot name="content" >
        </slot>
        <slot name="btn" >
          <Button type="primary" class="common-modal-btn common-margin-right-20" @click="$emit('confirm')">确定</Button>
          <Button type="primary" class="common-modal-btn" @click="$emit('cancel')">取消</Button>
        </slot>
      </div>
    </div>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    title: String,
    default: '投放预览'
  }
}
</script>

<style scoped lang="less">
.modal-box{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(55,55,55,.6);
  z-index: 10000;
  .content-box{
    background-color: #fff;
    z-index: 10000;
    width: 400px;
    /*min-height: 250px;*/
    max-height: 500px;
    border-radius: 6px!important;
    position: relative;
    top: calc(~'50% - 125px');
    left: calc(~'50% - 200px');
    padding: 40px;
    .title{
      font-size: 20px;
      color: #383E4B;
      margin-bottom: 10px;
    }
  }
}
</style>
