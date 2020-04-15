<template>
  <div>
    <Upload
      :action="action"
      :before-upload="beforeUpload"
      :on-success="uploadSuccessImg"
      :show-upload-list="false"
      :format= 'format'
      :name="name">
      <slot></slot>
    </Upload>
  </div>
</template>

<script>
  // 自定义上传图片组件
export default {
  name: 'upload-img',
  // 上传图片， 如果有，则传入限制条件的params({}), 图片 大小，格式
  props: {
    // 当前点击的上传位置
    index: {
      type: Number,
      default: -1
    },
    action: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'file'
    },
    format: {
      type: Array,
      default: []
    },
    uploadBefore: {
      type: Function,
      default: () => {}
    },
    uploadSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      uploadSpinShow: false,
      example_img: ''
    }
  },
  methods: {
    beforeUpload(file) {
      this.uploadBefore(file)
    },
    uploadSuccessImg(res) {
      let params = {
        res,
        index: this.index
      }
      this.uploadSuccess(params)
    }
  }
}
</script>
