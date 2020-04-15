<template>
    <div class="mask" @click.self="$emit('clearId')">
      <div class="content-box">
        <header>
          <h4>查看投放</h4>
          <Icon type="md-close" class="close-icon" @click="$emit('clearId')" />
        </header>
        <section class="content modal-scrollbar">
          <article class="common-flex">
            <p class="classify-title">基本信息</p>
            <ul>
              <li class="common-flex">
                <p class="des-title">推广名称</p>
                <p class="des">{{detailData.title}}</p>
              </li>
              <li class="common-flex">
                <p class="des-title">计费方式</p>
                <p class="des">{{detailData.cost_type}}</p>
              </li>
              <li class="common-flex">
                <p class="des-title">投放终端</p>
                <p class="des">{{terminal[detailData.terminal]}}</p>
              </li>
              <li class="common-flex">
                <p class="des-title">广告位</p>
                <p class="des">{{detailData.ad_name}}</p>
              </li>
              <li class="common-flex">
                <p class="des-title">投放类型</p>
                <p class="des">{{detailData.put_type_name}}</p>
              </li>
              <li v-if="detailData.creative">
                <p class="des-title common-inline-block">选择创意</p>
                <p class="des common-inline-block">{{detailData.creative.title}}</p>
                <div class="common-flex common-margin-left-10">
                  <p class="des-title">创意模板</p>
                  <p class="des">{{detailData.creative.creative_module_name}}</p>
                </div>
                <div class="common-flex common-margin-left-10">
                  <p class="des-title">素材</p>
                  <img class="des img-style" :src="detailData.creative.material_preview || detailData.creative.material" />
                </div>
                <div class="common-flex common-margin-left-10">
                  <p class="des-title">预下载</p>
                  <p class="des" v-if="detailData.creative.pre_download">提前{{detailData.creative.days}}预下载</p>
                  <p class="des" v-if="!detailData.creative.pre_download">否</p>
                </div>
                <div class="common-flex common-margin-left-10">
                  <p class="des-title">跳转</p>
                  <p class="des">{{jumpNameJoint}}</p>
                </div>

                <span v-for="(item, index) in customFormCustom" :key="index">
                  <!--      字符串      -->
                  <div class="common-flex common-margin-left-10" v-if="item.type === 'string'">
                    <p class="des-title">{{item.name}}</p>
                    <p class="des">{{creativeDetail.custom_fields[item.identification]}}</p>
                  </div>
                  <!--      数字      -->
                  <div class="common-flex common-margin-left-10" v-if="item.type === 'numeric'">
                    <p class="des-title">{{item.name}}</p>
                    <p class="des">{{creativeDetail.custom_fields[item.identification]}}</p>
                  </div>
                  <!--      单选      -->
                  <div class="common-flex common-margin-left-10" v-if="item.type === 'single_choice'">
                    <p class="des-title">{{item.name}}</p>
                    <p class="des">{{creativeDetail.custom_fields_name && creativeDetail.custom_fields_name[item.identification].toString()}}</p>
                  </div>
                  <!--      多选      -->
                  <div class="common-flex common-margin-left-10" v-if="item.type === 'multiple_choice'">
                    <p class="des-title">{{item.name}}</p>
                    <p class="des">{{creativeDetail.custom_fields_name && creativeDetail.custom_fields_name[item.identification].toString()}}</p>
                  </div>
                  <!--      日期时间      -->
                  <div class="common-flex common-margin-left-10" v-if="item.type === 'datetime'">
                    <p class="des-title">{{item.name}}</p>
                    <p class="des">{{creativeDetail.custom_fields[item.identification]}}</p>
                  </div>
                  <!--      图片      -->
                  <div class="common-flex common-margin-left-10" v-if="item.type === 'img'">
                    <p class="des-title">{{item.name}}</p>
                    <img class="des img-style" :src="creativeDetail.custom_fields[item.identification]" />
                  </div>
                  <!--      视频      -->
                  <div class="common-flex common-margin-left-10" v-if="item.type === 'video'">
                    <p class="des-title">{{item.name}}</p>
                    <video style="width: 140px;cursor:pointer;" :src="creativeDetail.custom_fields[item.identification]"/>
                  </div>
                  <!--      跳转      -->
                  <div class="common-flex common-margin-left-10" v-if="item.type === 'jump'">
                    <p class="des-title">{{item.name}}</p>
                    <div class="des">
                      <span v-for="(li, i) in creativeDetail.custom_fields[item.identification]" :key="i" v-if="li !== ''" class="break-all">
                        <span v-if="i !== 'openType' && (li || li === 0 )">-</span>
                        <span v-if="(creativeDetail.custom_fields[item.identification].openType === 'web' || creativeDetail.custom_fields[item.identification].openType === 'web_fridge') && i === 'openSubType'">{{ creativeDetail.custom_fields[item.identification].openSubType }}</span>
                        <span v-else-if="i !== 'openSubType' && i !== 'openType'">{{ li }}</span>
                        <span v-else>{{ creativeDetail.custom_fields_name[item.identification][i + 'Name'] }}</span>
                      </span>
                    </div>
                  </div>
                </span>
              </li>
              <li class="common-flex">
                <p class="des-title">备注</p>
                <p class="des">{{detailData.remarks}}</p>
              </li>

            </ul>
          </article>
          <article class="common-flex">
            <p class="classify-title">投放排期</p>
            <ul>
              <li class="common-flex">
                <p class="des-title">投放日期</p>
                <div>
                  <p class="des"
                     v-for="(item, index) in detailData.front_put_day"
                     :key="index"
                  >{{item.start_time+'至'+item.end_time}}</p>
                </div>
              </li>
            </ul>
          </article>
          <article class="common-flex">
            <p class="classify-title">设备定向</p>
            <ul v-if="detailData.device_orientation">
              <li class="common-flex">
                <p class="des-title">定向类型</p>
                <p class="des">{{adPush.orientType[detailData.device_orientation.orientation_type]}}</p>
              </li>
              <li class="common-flex" v-if="detailData.device_orientation.orientation_type !== 'all_device' ">
                <p class="des-title">定向内容</p>
                <div>
                  <div v-if="detailData.device_orientation.orientation_type !== 'sub_device'">
                    <p class="des"
                       v-for="(item, index) in detailData.device_orientation.content"
                       :key="index">{{ groupList[+item] || item }}</p>
                  </div>
                  <p v-else>{{detailData.device_orientation.filename}}</p>
                </div>
              </li>
            </ul>
          </article>
          </section>
        </div>
    </div>
</template>

<script>
import { reqPutPreview, reqStrategyGroup } from '@/api/ad-push-list'
import { adPush } from '@/libs/dict'
import { deepcopy } from '@/libs/deepcopy'
import { resetTime } from '@/libs/util'
const terminal = {
  bx: '冰箱',
  fridge: '冰箱',
  tv: 'TV'
}
export default {
  name: 'put-detail',
  data () {
    return {
      detailData: {},
      groupList: {},
      adPush,
      terminal,
      customFormCustom: [],
      creativeDetail: {}
    }
  },
  created () {
    this.getGroupName()
  },
  props: { id: '' },
  computed: {
    jumpNameJoint () {
      const fixTitle = this.detailData.creative.jump_names && `${this.detailData.creative.jump_names.openTypeName} ${this.detailData.creative.jump_names.openSubTypeName ? ('-' +
        ((this.detailData.creative.jump.openType === 'web' || this.detailData.creative.jump.openType === 'web_fridge') ? this.detailData.creative.jump.openSubType : this.detailData.creative.jump_names.openSubTypeName)) : ''}`
      let jumpData = this.detailData.creative.jump_names && deepcopy(this.detailData.creative.jump_names)
      jumpData.openSubTypeName && delete jumpData.openSubTypeName
      jumpData.openTypeName && delete jumpData.openTypeName
      const newKey = Object.keys(jumpData)
      return fixTitle + newKey.reduce((acc, cur) => acc.concat(cur.replace(/Name$/, '')), []).reduce((acc, cur) => `${acc}-${this.detailData.creative.jump[cur]}`, '')
    }
  },
  methods: {
    async getDetail () {
      try {
        const res = await reqPutPreview({ id: this.id })
        if (res.errno === 10000) {
          this.detailData = res.data
          this.customFormCustom = (this.detailData.creative && this.detailData.creative.creative_module && this.detailData.creative.creative_module.custom_fields) || []
          this.creativeDetail = this.detailData.creative || {}
          console.log(' this.customFormCustom', this.customFormCustom)
          console.log(this.detailData)
          for (let i = 0; i < this.customFormCustom.length; i++) {
            let item = this.customFormCustom[i]
            if (item.type === 'datetime') {

              if (this.creativeDetail.custom_fields[item.identification]) {
                this.creativeDetail.custom_fields[item.identification] = resetTime(this.creativeDetail.custom_fields[item.identification])
              } else {
                this.creativeDetail.custom_fields[item.identification] = ''
              }
            }
          }
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getGroupName () {
      try {
        const res = await reqStrategyGroup()
        if (res.errno === 10000) {
          const list = res.data.list
          for (let key in list) {
            list[key].forEach(item => {
              this.groupList[item.group_id] = item.group_name
            })
          }
          this.getDetail()
        } else throw res.errmsg
      } catch (e) {
        this.$Message.error(e)
      }
    }
  }
}
</script>

<style scoped lang="less">
.mask{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(55,55,55,.6);
  z-index: 10000;
  .content-box{
    z-index: 10001;
    margin: 0 auto;
    position: relative;
    top: 70px;
    background-color: #fff;
    width: 540px;
    height: calc(~'100% - 130px');
    padding: 40px;
    border-radius: 6px!important;
    color: #383E4B;
    header{
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      .close-icon{
        font-size: 25px;
        color: #868E9E;
        cursor: pointer;
      }
    }
    .content{
      height: calc(~'100% - 40px');
      overflow: auto;
      margin-top: 30px;
      line-height: 40px;
      .classify-title{
        width: 90px;
      }
      .des-title{
        color:  #868E9E;
        width: 100px;
      }
      .des {
        width: 200px;
        word-wrap: break-word;
        word-break: break-all;
      }
      .img-style{
        width: 142px;
        height: 100%;
      }
    }
  }
}
</style>
