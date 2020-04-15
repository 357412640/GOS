<template>
  <div>

  </div>
</template>

<script>
import BMF from 'browser-md5-file'
import unpreview from '@/assets/images/material-unpreview.jpg'
import axios from '@/libs/api.request'

export default {
  name: 'upload-video',
  props: {
    // 传入的限制参数，包括但不限于 大小(limitSize,maxSize)，格式()
    params: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      md5: '',
      uploadUrl: 'http://api.scloud.gome.inc/uploadfile',
      unpreviewImg: unpreview
    }
  },
  mounted () {
  },
  methods: {
    beforeUpload (file) {
      // 计算MD5
      const bmf = new BMF()
      bmf.md5(
        file,
        (err, md5) => {
          this.md5 = md5
        }
      )

      // 校验视频大小、格式

      // let limitSize = this.material.size * 1024 * 1024
      // let maxSize = 50 * 1024 * 1024
      // let fileSize = file.size
      // let conditionType = this.material.condition
      // if (conditionType === 'lte') {
      //   if (limitSize < fileSize) {
      //     this.$Modal.warning({
      //       title: '上传失败',
      //       content: `原因：文件过大`
      //     })
      //     return false
      //   }
      // } else if (conditionType === 'gte') {
      //   if (limitSize > fileSize) {
      //     this.$Modal.warning({
      //       title: '上传失败',
      //       content: `原因：文件过小`
      //     })
      //     return false
      //   } else if (maxSize < fileSize) {
      //     this.$Modal.warning({
      //       title: '上传失败',
      //       content: `原因：文件不能大于50M`
      //     })
      //     return false
      //   }
      // }
      let fileArr = file.name.split('.')
      let len = fileArr.length - 1
      let fileType = fileArr[len].toLowerCase()
      let acceptTypeArr = this.material.suffix.split(',')
      let upFlag = true
      for (let i = 0; i < acceptTypeArr.length; i++) {
        if (fileType === acceptTypeArr[i]) {
          upFlag = false
        }
      }
      if (this.material_type === 'img') {
        if (upFlag) {
          this.$Modal.warning({
            title: '上传失败',
            content: `原因：图片格式有误,仅支持${this.material.suffix}`
          })
          return false
        }
      } else {
        if (upFlag) {
          this.$Modal.warning({
            title: '上传失败',
            content: `原因：视频格式有误,仅支持${this.material.suffix}`
          })
          return false
        }
        // 保存当前视频文件
        this.videoFile = file

        // 判断视频文件是否为 mp4，如果不是，无法预览
        if (!(fileType === 'mp4')) {
          this.isPreview = false
        }
      }
      let $vm = this
      this.uploadSpinShow = true
      this.uploadFile(
        file, (data) => {
          if ($vm.material_type === 'video') {
            // 读取视频文件
            let videoFile = $vm.videoFile
            // video 标签只支持mp4 Ogg WebM 格式视频文件
            if ($vm.isPreview) {
              let reader = new FileReader()
              reader.readAsDataURL(videoFile)
              reader.onload = function (e) {
                let video = document.getElementById('video')
                video.src = e.target.result
                // 手动修改视频格式上传为mp4时，可以上传，未知风险不确定
                video.addEventListener('error', () => {
                  $vm.example_img = $vm.unpreviewImg
                  $vm.formCustom.material_preview = ''
                  $vm.$Message.success('视频上传成功，视频格式不支持预览')
                  $vm.uploadSpinShow = false
                })
                video.addEventListener('loadeddata', () => {
                  let canvas = document.createElement('canvas')
                  canvas.width = video.videoWidth
                  canvas.height = video.videoHeight
                  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
                  let img = canvas.toDataURL('image/png')
                  let imgBlob = $vm.convertBase64UrlToBlob(img)
                  $vm.uploadFile(
                    imgBlob, (data) => {
                      $vm.$Message.success('视频及预加载图片上传成功！')
                      $vm.example_img = data.fileUrl
                      $vm.formCustom.material_preview = data.fileUrl
                    }, (errmsg) => {
                      $vm.$Modal.warning({
                        title: '视频上传成功，浏览图片上传失败',
                        content: `原因：${errmsg}`
                      })
                    }, () => {
                      $vm.checkRule('example_img')
                    }
                  )
                })
              }
            } else {
              $vm.example_img = $vm.unpreviewImg
              $vm.formCustom.material_preview = ''
              $vm.$Message.success('视频上传成功，视频格式不支持预览！')
              $vm.uploadSpinShow = false
            }
          } else {
            $vm.$Message.success('上传成功！')
            $vm.example_img = data.fileUrl
            $vm.$forceUpdate()
            $vm.checkRule('example_img')
            $vm.uploadSpinShow = false
          }
          $vm.formCustom.material = data.fileUrl
          // todo 暂时只能上传一张图片或一个视频，因图片或视频自定义后不感知位置，所以遍历customFormCustom，找到对应字段传入图片地址
          if (this.customFormCustom && this.customFormCustom.length) {
            for (let i = 0; i < this.customFormCustom.length; i++) {
              let item = this.customFormCustom[i]
              if (item.type === 'img' || item.type === 'video') {
                this.formCustom.creative[item.identification] = data.fileUrl
              }
            }
          }
        }, (errmsg) => {
          $vm.$Modal.warning({
            title: '上传失败',
            content: `原因：${errmsg}`
          })
          $vm.uploadSpinShow = false
        }, () => {

        }
      )
      return false
    },
    uploadFile (file, successCb, failCb, finalCb) {
      let url = this.uploadUrl + '/uploadFdfs'
      let formData = new FormData()
      formData.append('uploadfile', file)
      axios.request({
        url,
        data: formData,
        method: 'post',
        upload: true
      }).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          successCb && successCb(data.data)
        } else {
          failCb && failCb(data.errmsg)
        }
        finalCb && finalCb(data)
      })
    }
  }

}
</script>

<style scoped>

</style>
