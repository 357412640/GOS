<template>
  <Modal
    title="查看创意"
    :value="creativeShow"
    :styles="{top: '20px'}"
    :footer-hide=true
    class="creative-detail-box creative-box"
    @on-ok='ok'
    @on-cancel='cancel'>
    <Form :model="creativeDetail" :label-width="110" @submit.native.prevent label-position="left" class="form-box">
      <Row type="flex" align="top" class="row">
        <Col span="22">
          <FormItem label="创意名称">
            <p>{{ creativeDetail.title }}</p>
          </FormItem>
          <FormItem label="创意模板">
            <p>{{ creativeDetail.creative_module_name }}</p>
          </FormItem>
          <FormItem label="上传素材">
            <img style="width: 140px;" :src="creativeDetail.material_preview || creativeDetail.material"/>
          </FormItem>
          <FormItem label="预下载">
            <p v-if="creativeDetail.pre_download">提前{{ creativeDetail.days }}天预下载</p>
            <p v-else >否</p>
          </FormItem>
          <FormItem label="跳转">
            <p v-if="creativeDetail.jump" class="break-all">
              <span>{{ openTypeName }}</span>
              <span v-if="openType === 'web' || openType === 'web_fridge'">-{{ openSubType }}</span>
              <span v-else-if="openType !== 'none'">-{{ openSubTypeName }}</span>
              <span v-for="(item, index) in creativeDetail.jump" :key="index" v-if="item !== ''" class="break-all">-{{ item }}</span>
            </p>
          </FormItem>
          <span v-for="(item, index) in customFormCustom" :key="index">
            <!--      字符串      -->
            <FormItem :label="item.name" v-if="item.type === 'string'">
              <p>{{ creativeDetail.custom_fields[item.identification] }}</p>
            </FormItem>
        <!--      数字      -->
            <FormItem :label="item.name" v-if="item.type === 'numeric'">
              <p>{{ creativeDetail.custom_fields[item.identification] }}</p>
            </FormItem>
        <!--      单选      -->
            <FormItem :label="item.name" v-if="item.type === 'single_choice'">
              <p>{{ creativeDetail.custom_fields_name[item.identification].toString() }}</p>
            </FormItem>
        <!--      多选      -->
            <FormItem :label="item.name" v-if="item.type === 'multiple_choice'">
              <p>{{ creativeDetail.custom_fields_name[item.identification].toString()  }}</p>
            </FormItem>
            <!--      日期时间      -->
            <FormItem :label="item.name" v-if="item.type === 'datetime'">
            <!-- 单位，day 天；时 hour；分 minute；秒 second -->
              <p>{{ creativeDetail.custom_fields[item.identification] }}</p>
            </FormItem>
            <!--      图片      -->
            <FormItem :label="item.name" v-if="item.type === 'img'">
              <img style="width: 140px;" :src="creativeDetail.custom_fields[item.identification]"/>
            </FormItem>
            <!--      视频      -->
            <FormItem :label="item.name" v-if="item.type === 'video'">
              <video style="width: 140px;cursor:pointer;" :src="creativeDetail.custom_fields[item.identification]"/>
            </FormItem>
            <!--      跳转      -->
            <FormItem :label="item.name" v-if="item.type === 'jump'">
              <div>
<!--                <span>{{ creativeDetail.custom_fields[item.identification].openType }}</span>-->
<!--                <span v-if="creaƒtiveDetail.custom_fields[item.identification].openSubType !== 'none'">-{{ creativeDetail.custom_fields[item.identification].openSubType }}</span>-->
                <span v-for="(li, i) in creativeDetail.custom_fields[item.identification]" :key="i" v-if="li !== ''" class="break-all">
                  <span v-if="i !== 'openType' && (li || li === 0 )">-</span>
                  <span v-if="(creativeDetail.custom_fields[item.identification].openType === 'web' || creativeDetail.custom_fields[item.identification].openType === 'web_fridge') && i === 'openSubType'">{{ creativeDetail.custom_fields[item.identification].openSubType }}</span>
                  <span v-else-if="i !== 'openSubType' && i !== 'openType'">{{ li }}</span>
                  <span v-else>{{ creativeDetail.custom_fields_name[item.identification][i + 'Name'] }}</span>
                </span>
              </div>
            </FormItem>
          </span>
        </Col>
      </Row>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </Modal>
</template>
<script>
import './index.less'
import {
  creDetail
} from '@/api/resource-data'
import unpreview from '@/assets/images/material-unpreview.jpg'
import { resetTime } from '@/libs/util'
export default {
  name: 'creative-detail',
  props: {
    detailId: {
      type: String,
      default: ''
    },
    creativeShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      creativeDetail: {},
      spinShow: false,
      openType: '',
      openTypeName: '',
      openSubType: '',
      openSubTypeName: '',
      customFormCustom: {},
      customOpenType: {},
      customSubType: {},
      customThirdType: {}
    }
  },
  methods: {
    ok () {
      this.$emit('on-hide')
      this.creativeDetail = {}
      this.customFormCustom = []
    },
    cancel () {
      this.$emit('on-hide')
      this.creativeDetail = {}
      this.customFormCustom = []
    },
    getDetail () {
      this.spinShow = true
      let params = {
        id: this.$props.detailId
      }
      creDetail(params).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.spinShow = false
          this.creativeDetail = data.data
          if (this.creativeDetail.material_type === 'video' && this.creativeDetail.material_preview === '') {
            this.creativeDetail.material_preview = unpreview
          }
          this.openType = this.creativeDetail.jump.openType
          this.openSubType = this.creativeDetail.jump.openSubType
          this.openTypeName = this.creativeDetail.jump_names.openTypeName
          this.openSubTypeName = this.creativeDetail.jump_names.openSubTypeName
          delete this.creativeDetail.jump.openType
          delete this.creativeDetail.jump.openSubType

          this.customFormCustom = this.creativeDetail.module_custom_fields
          if (this.customFormCustom && this.customFormCustom.length) {
            for (let i = 0; i < this.customFormCustom.length; i++) {
              let item = this.customFormCustom[i]
              if (item.type === 'datetime') {
                this.creativeDetail.custom_fields[item.identification] = resetTime(this.creativeDetail.custom_fields[item.identification])
              }
            }
          }
          // 遍历 重写自定义跳转自定义跳转
          console.log(this.creativeDetail)
        } else {
          this.$Modal.warning({
            title: '创意详情获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    }
  },
  computed: {
    popShow () {
      return this.$props.detailId && this.$props.creativeShow
    }
  },
  watch: {
    popShow (val) {
      if (val) {
        this.getDetail()
      }
    }
  }
}
</script>
