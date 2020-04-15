<template>
  <div class="creative-add-box">
    <content-header :title="title"></content-header>
    <Form ref="formValidate" :model="formCustom" :label-width="120" @submit.native.prevent label-position="left"
          :rules="ruleValidate" class="form-box">
      <Row type="flex" align="top">
        <Col span="10">
          <FormItem label="创意ID" v-if="pageType === 'edit'">
            <p>{{ formCustom.id }}</p>
          </FormItem>
          <FormItem label="创意名称" prop="title">
            <Input v-model="formCustom.title"></Input>
          </FormItem>
          <FormItem label="创意模板" prop="creative_module_id">
            <Select v-model="formCustom.creative_module_id" @on-change="changeModule">
              <Option v-for="item in creativeModuleList" :value="item.creative_module_id"
                      :key="item.creative_module_id">{{ item.title }}
              </Option>
            </Select>
          </FormItem>
          <div v-if="material_type">
            <div v-if="material_type !== 'msg'">
              <FormItem label="上传素材" prop="example_img" class="upload-box">
                <Upload
                  :action="uploadUrl + '/uploadFdfs'"
                  :before-upload="beforeUpload"
                  :on-success="uploadSuccess"
                  :show-upload-list="false"
                  name="uploadfile">
                  <!-- :format="['png','jpg','jpeg','gif','bmp']" -->
                  <img style="width: 140px;cursor:pointer;" :src="example_img" v-if="example_img"/>
                  <div
                    style="width: 80px;height:80px;line-height: 80px;color: rgba(0,0,0,0.3); background-color: rgba(200,200,200,0.1);cursor: pointer;text-align: center;position:relative;"
                    v-else>
                    <Icon type="md-add" size="45" v-if="!uploadSpinShow"/>
                    <Spin fix v-else></Spin>
                  </div>
                </Upload>
                <div v-if="material.suffix !== ''" class="upload-div">
                  <p>{{ material.suffix }}</p>
                  <p v-if="material_type === 'img'">{{ material.width }} * {{ material.height }}px</p>
                  <p>{{ material.conditionName }}{{ material.size }}M</p>
                  <p v-if="material.condition === 'gte'">小于等于50M</p>
                </div>
              </FormItem>
              <FormItem label="预下载">
                <p v-if="!formCustom.pre_download">否</p>
                <p v-else>提前{{ formCustom.days }}天预下载</p>
              </FormItem>
              <FormItem label="跳转类型" prop="openType">
                <Select v-model="jump.openType" @on-change="initSubJump">
                  <Option v-for="item in turnList.list" :value="item.value" :key="item.value">{{ item.description }}
                  </Option>
                </Select>
              </FormItem>
              <!-- 二级 -->
              <div v-if="defSubJump.formType === 'select' && defSubJump.list.length">
                <FormItem :label="defSubJump.list[0].name" prop="openSubType">
                  <Select v-model="jump.openSubType" @on-change="initThirdJump">
                    <Option v-for="item in defSubJump.list" :value="item.value" :key="item.value">{{ item.description }}
                    </Option>
                  </Select>
                </FormItem>
              </div>
              <div v-else-if="defSubJump.formType === 'input' && defSubJump.list.length">
                <FormItem :label="item.name" prop="openSubType" v-for="item in defSubJump.list" :key="item.key">
                  <Input v-model="jump.openSubType"></Input>
                </FormItem>
              </div>
              <div v-else-if="defSubJump.formType === 'text' && defSubJump.list.length">
                <FormItem :label="item.name" prop="openSubType" v-for="item in defSubJump.list" :key="item.key">
                  <Input v-model="jump.openSubType" type="textarea"></Input>
                </FormItem>
              </div>
              <div v-else></div>
              <!-- 三级 -->
              <div v-if="defThirdJump.formType === 'select' && defThirdJump.list.length">
                <FormItem :label="defThirdJump.list[0].name" :prop="defThirdJump.key">
                  <Select v-model="jump[defThirdJump.key]">
                    <Option v-for="item in defThirdJump.list" :value="item.value" :key="item.value">{{ item.description
                      }}
                    </Option>
                  </Select>
                </FormItem>
              </div>
              <div v-else-if="defThirdJump.formType === 'input' && defThirdJump.list.length">
                <FormItem :label="item.name" :prop="jump.openType !== 'custom' ? item.key : ''"
                          v-for="item in defThirdJump.list" :key="item.key"
                          :id="item.key">
                  <Input v-model="jump[item.key]"></Input>
                </FormItem>
              </div>
              <div v-else></div>
            </div>
            <span v-for="(item, index) in customFormCustom" :key="index">
              <!--      字符串      -->
              <FormItem :label="item.name" v-if="item.type === 'string'" :prop="item.identification" key="string">
                <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                  <span class="help-icon">
                    <Icon type="md-help-circle"/>
                  </span>
                </Tooltip>
                <Input v-model.trim="formCustom.custom_fields[item.identification]" :disabled="item.locked"/>
              </FormItem>
              <!--      数字      -->
              <FormItem :label="item.name" v-else-if="item.type === 'numeric'" :prop="item.identification"
                        key="numeric">
                <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                  <span class="help-icon">
                    <Icon type="md-help-circle"/>
                  </span>
                </Tooltip>
                <Input v-model.trim="formCustom.custom_fields[item.identification]" :disabled="item.locked"/>
              </FormItem>
              <!--      单选      -->
              <FormItem :label="item.name" v-else-if="item.type === 'single_choice'" :prop="item.identification"
                        key="single_choice">
                <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                  <span class="help-icon">
                    <Icon type="md-help-circle"/>
                  </span>
                </Tooltip>
                <Select v-model="formCustom.custom_fields[item.identification]">
                  <Option v-for="(li, i) in item.subCustom.option" :value="li.key"
                          :key="li.key + i">{{ li.value }}</Option>
                </Select>
              </FormItem>
              <!--      多选      -->
              <FormItem :label="item.name" v-else-if="item.type === 'multiple_choice'" :prop="item.identification"
                        key="multiple_choice">
                <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                  <span class="help-icon">
                    <Icon type="md-help-circle"/>
                  </span>
                </Tooltip>
                <Select v-model="formCustom.custom_fields[item.identification]" multiple>
                  <Option v-for="(li, i) in item.subCustom.option" :value="li.key"
                          :key="li.key + i">{{ li.value }}</Option>
                </Select>
              </FormItem>
              <!--      日期时间      -->
              <FormItem :label="item.name" v-else-if="item.type === 'datetime'" :prop="item.identification"
                        key="datetime">
                <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                  <span class="help-icon">
                    <Icon type="md-help-circle"/>
                  </span>
                </Tooltip>
                <!-- 单位，day 天；时 hour；分 minute；秒 second -->
                <DatePicker v-model="formCustom.custom_fields[item.identification]" type="date"
                            placement="bottom-end"
                            style="width: 200px" v-if="item.subCustom.datetime === 'day'"></DatePicker>
                <DatePicker v-model="formCustom.custom_fields[item.identification]" type="datetime"
                            placement="bottom-end"
                            style="width: 200px" format="yyyy-MM-dd HH" v-if="item.subCustom.datetime === 'hour'"
                            class="date-hour"></DatePicker>
                <DatePicker v-model="formCustom.custom_fields[item.identification]" type="datetime"
                            placement="bottom-end"
                            style="width: 200px" format="yyyy-MM-dd HH:mm"
                            v-if="item.subCustom.datetime === 'minute'"></DatePicker>
                <DatePicker v-model="formCustom.custom_fields[item.identification]" type="datetime"
                            placement="bottom-end"
                            style="width: 200px" v-if="item.subCustom.datetime === 'second'"></DatePicker>

              </FormItem>



              <!--      图片      -->
              <FormItem :label="item.name" v-else-if="item.type === 'img'" :prop="item.identification" key="img" class="upload-box">
                <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                  <span class="help-icon">
                    <Icon type="md-help-circle"/>
                  </span>
                </Tooltip>
                <upload-img
                  :action="uploadUrl + '/uploadFdfs'"
                  :format="item.subCustom.suffix"
                  :upload-before="beforeUploadImg"
                  :upload-success="uploadSuccessImg"
                  :index='index'
                  name="uploadfile"
                  style="display: inline-block">
                  <img style="width: 140px;cursor:pointer;" :src="formCustom.custom_fields[item.identification]"
                       v-if="formCustom.custom_fields[item.identification]"/>
                  <div
                    style="width: 80px;height:80px;line-height: 80px;color: rgba(0,0,0,0.3); background-color: rgba(200,200,200,0.1);cursor: pointer;text-align: center;position: relative;"
                    v-else>
                    <Icon type="md-add" size="45" v-if="!uploadSpinShow"/>
                    <Spin fix v-else></Spin>
                  </div>
                </upload-img>
                <div class="upload-div">
                  <p v-if="item.subCustom.suffix && item.subCustom.suffix.length">{{ item.subCustom.suffix.toString() }}</p>
                  <p v-if="item.subCustom.width && item.subCustom.height">{{ item.subCustom.width }} * {{ item.subCustom.height }}px</p>
                  <p v-if="item.subCustom.condition && item.subCustom.size">{{ item.subCustom.condition === 'lte' ? '小于等于' : '大于等于' }}{{ item.subCustom.size }}M</p>
                </div>
              </FormItem>



              <!--      视频      -->
              <FormItem :label="item.name" v-else-if="item.type === 'video'" :prop="item.identification" key="video">
                <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                  <span class="help-icon">
                    <Icon type="md-help-circle"/>
                  </span>
                </Tooltip>
                <Upload
                  :action="uploadUrl + '/uploadFdfs'"
                  :before-upload="beforeUpload"
                  :on-success="uploadSuccess"
                  :show-upload-list="false"
                  name="uploadfile">
                  <!-- :format="['png','jpg','jpeg','gif','bmp']" -->
                  <img style="width: 140px;cursor:pointer;" :src="example_img" v-if="example_img"/>
                  <div
                    style="width: 80px;height:80px;line-height: 80px;color: rgba(0,0,0,0.3); background-color: rgba(200,200,200,0.1);cursor: pointer;text-align: center;position:relative;"
                    v-else>
                    <Icon type="md-add" size="45" v-if="!uploadSpinShow"/>
                    <Spin fix v-else></Spin>
                  </div>
                </Upload>
                <div class="upload-div">
                  <p v-if="item.subCustom.suffix && item.subCustom.suffix.length">{{ item.subCustom.suffix.toString() }}</p>
                  <p v-if="item.subCustom.width && item.subCustom.height">{{ item.subCustom.width }} * {{ item.subCustom.height }}px</p>
                  <p v-if="item.subCustom.condition && item.subCustom.size">{{ item.subCustom.condition === 'lte' ? '小于等于' : '大于等于' }}{{ item.subCustom.size }}M</p>
                </div>
              </FormItem>
              <!--      跳转      -->
              <div v-else-if="item.type === 'jump'">
                <FormItem :label="item.name" :prop="item.identification + '_openType'" key="openType">
                  <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                    <span class="help-icon">
                      <Icon type="md-help-circle"/>
                    </span>
                  </Tooltip>
                  <Select v-model="formCustom.custom_fields[item.identification].openType"
                          @on-change="initCustomSubJump(formCustom.custom_fields[item.identification].openType, false, item)">
                    <Option v-for="(li, i) in turnList.list" :value="li.value"
                            :key="li.value + i">{{ li.description }}</Option>
                  </Select>
                </FormItem>
                <!-- 二级 -->
                <div
                  v-if="subJump[item.identification] && subJump[item.identification].formType === 'select' && subJump[item.identification].list.length">
                  <FormItem :label="subJump[item.identification].list[0].name"
                            :prop="item.identification + '_openSubType'" :key="item.identification + '_openSubType'">
                    <Select v-model="formCustom.custom_fields[item.identification].openSubType"
                            @on-change="initCustomThirdJump(formCustom.custom_fields[item.identification].openSubType, false, item)">
                      <Option v-for="(li, i) in subJump[item.identification].list" :value="li.value"
                              :key="li.value + i">{{ li.description }}</Option>
                    </Select>
                  </FormItem>
                </div>
                <div
                  v-else-if="subJump[item.identification] && subJump[item.identification].formType === 'input' && subJump[item.identification].list.length">
                  <FormItem :label="subJump[item.identification].list[0].name"
                            v-for="(li, i) in subJump[item.identification].list" :key="li.key + i"
                            :prop="item.identification + '_openSubType'">
                    <Input v-model="formCustom.custom_fields[item.identification].openSubType"></Input>
                  </FormItem>
                </div>
                <div
                  v-else-if="subJump[item.identification] && subJump[item.identification].formType === 'text' && subJump[item.identification].list.length">
                  <FormItem :label="subJump[item.identification].list[0].name"
                            v-for="(li, i) in subJump[item.identification].list" :key="li.key + i"
                            :prop="item.identification + '_openSubType'">
                    <Input v-model="formCustom.custom_fields[item.identification].openSubType" type="textarea"></Input>
                  </FormItem>
                </div>
                <div v-else></div>
                <!-- 三级 -->
                <div
                  v-if="thirdJump[item.identification] && thirdJump[item.identification].formType === 'select' && thirdJump[item.identification].list.length">
                  <FormItem :label="thirdJump[item.identification].list[0].name"
                            :prop="item.identification + '_' + thirdJump[item.identification].list[0].key">
                    <Select
                      v-model="formCustom.custom_fields[item.identification][thirdJump[item.identification].list[0].key]">
                      <Option v-for="(li, i) in thirdJump[item.identification].list" :value="li.value"
                              :key="li.value + i">{{ li.description }}</Option>
                    </Select>
                  </FormItem>
                </div>
                <div
                  v-else-if="thirdJump[item.identification] && thirdJump[item.identification].formType === 'input' && thirdJump[item.identification].list.length">
                  <FormItem :label="li.name"
                            v-for="(li, i) in thirdJump[item.identification].list" :key="li.key + i" :id="li.key"
                            :prop="formCustom.custom_fields[item.identification].openType !== 'custom' ? item.identification + '_' + li.key : ''">
                    <Input v-model="formCustom.custom_fields[item.identification][li.key]"></Input>
                  </FormItem>
                </div>

              </div>
            </span>
          </div>
        </Col>
      </Row>
      <Row type="flex" align="top">
        <Col span="2">
        </Col>
        <Col span="10">
          <Button type="primary" @click="save('formValidate')" class="button-common">保存</Button>
        </Col>
      </Row>
    </Form>
    <video id="video" width="320" style="display: none"></video>
  </div>
</template>

<script>
  import './index.less'
  import {
    creSave,
    creativeList, creDetail, creTurnList, creativeDetail
  } from '@/api/resource-data'
  import ContentHeader from '_c/ContentHeader'
  import BMF from 'browser-md5-file'
  import unpreview from '@/assets/images/material-unpreview.jpg'
  import axios from '@/libs/api.request'
  import {resetTime} from '@/libs/util'
  import {deepClone} from '../../../libs/util'
  import UploadImg from '_c/custom-upload-img'

  export default {
    name: 'add',
    components: {
      ContentHeader,
      UploadImg
    },
    data() {
      return {
        uploadSpinShow: false,
        spinShow: true,
        title: '',
        pageType: '',
        uploadUrl: 'http://api.scloud.gome.inc/uploadfile',
        formCustom: {
          title: '',
          identification: '',
          custom_fields: {}
        },
        ruleValidate: {
          title: [
            {
              validator: (rule, val, callback) => {
                if (!this.formCustom.title.trim()) {
                  callback(new Error('名称不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          creative_module_id: [
            {
              validator: (rule, val, callback) => {
                if (!this.formCustom.creative_module_id) {
                  callback(new Error('请选择创意模板'))
                } else {
                  callback()
                }
              }
            }
          ],
          example_img: [
            {
              validator: (rule, val, callback) => {
                if (!this.example_img) {
                  callback(new Error('请上传示例'))
                } else {
                  callback()
                }
              },
              trigger: 'none'
            }
          ],
          openType: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump || !this.jump.openType) {
                  callback(new Error('请选择跳转方式'))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }
          ],
          openSubType: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump || !this.jump.openSubType) {
                  callback(new Error('不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          openEpId: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.openEpId || !this.jump.openEpId.trim()) {
                  callback(new Error('视频id不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          openEqId: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.openEqId || !this.jump.openEqId.trim()) {
                  callback(new Error('专辑id不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          openSpecialId: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.openSpecialId || !this.jump.openSpecialId.trim()) {
                  callback(new Error('专题id不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          openGameId: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.openGameId || !this.jump.openGameId.trim()) {
                  callback(new Error('游戏id不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          openAppId: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.openAppId || !this.jump.openAppId.trim()) {
                  callback(new Error('应用id不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          openAppName: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.openAppName || !this.jump.openAppName.trim()) {
                  callback(new Error('应用名称不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          openAppPackage: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.openAppPackage || !this.jump.openAppPackage.trim()) {
                  callback(new Error('应用包名不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          openParam: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.openParam || !this.jump.openParam.trim()) {
                  callback(new Error('第三方跳转参数不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          keyword: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.keyword || !this.jump.keyword.trim()) {
                  callback(new Error('关键词不能为空'))
                } else {
                  callback()
                }
              }
            }
          ],
          resourceId: [
            {
              validator: (rule, val, callback) => {
                if (!this.jump.resourceId || !this.jump.resourceId.trim()) {
                  callback(new Error('资源ID不能为空'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        material: {},
        material_type: '',
        creativeModuleList: [],
        turnList: [],
        jump: {
          openType: '',
          openSubType: ''
        },
        // 原始跳转
        defSubJump: {},
        defThirdJump: {},
        // 自定义使用字段
        subJump: {},
        thirdJump: {},
        md5: '',
        conditionList: [
          {
            name: '小于等于',
            key: 'lte'
          },
          {
            name: '大于等于',
            key: 'gte'
          }
        ],
        videoFile: {},
        example_img: '',
        unpreviewImg: unpreview,
        isPreview: true,
        isUpload: false,
        customFormCustom: [],
        firstCopy: true
      }
    },
    methods: {
      toPage(path) {
        this.$router.push({
          path
        })
      },
      beforeUpload(file) {
        // 计算MD5
        const bmf = new BMF()
        bmf.md5(
          file,
          (err, md5) => {
            console.log('err:', err)
            // console.log('md5 string:', md5)
            this.md5 = md5
          }
          // , progress => {
          //   console.log('progress number:', progress)
          // }
        )
        // console.log(file, 'before')
        let limitSize = this.material.size * 1024 * 1024
        let maxSize = 50 * 1024 * 1024
        let fileSize = file.size
        let conditionType = this.material.condition
        if (conditionType === 'lte') {
          if (limitSize < fileSize) {
            this.$Modal.warning({
              title: '上传失败',
              content: `原因：文件过大`
            })
            return false
          }
        } else if (conditionType === 'gte') {
          if (limitSize > fileSize) {
            this.$Modal.warning({
              title: '上传失败',
              content: `原因：文件过小`
            })
            return false
          } else if (maxSize < fileSize) {
            this.$Modal.warning({
              title: '上传失败',
              content: `原因：文件不能大于50M`
            })
            return false
          }
        }
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
                  debugger
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
      uploadSuccess(res, file, fileList) {
        // if (res.errno === 10000) {
        //   if (this.material_type === 'video') {
        //     // 读取视频文件
        //     let $vm = this
        //     let videoFile = this.videoFile
        //     // video 标签只支持mp4 Ogg WebM 格式视频文件
        //     if ($vm.isPreview) {
        //       let reader = new FileReader()
        //       reader.readAsDataURL(videoFile)
        //       reader.onload = function (e) {
        //         let video = document.getElementById('video')
        //         video.src = e.target.result
        //         video.addEventListener('loadeddata', () => {
        //           let canvas = document.createElement('canvas')
        //           canvas.width = video.videoWidth
        //           canvas.height = video.videoHeight
        //           canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        //           let img = canvas.toDataURL('image/png')
        //           let imgBlob = $vm.convertBase64UrlToBlob(img)
        //           $vm.uploadFile(
        //             imgBlob, (data) => {
        //               $vm.$Message.success('视频及预加载图片上传成功！')
        //               $vm.example_img = data.data.fileUrl
        //               $vm.formCustom.material_preview = data.data.fileUrl
        //             }, (data) => {
        //               $vm.$Modal.warning({
        //                 title: '视频上传成功，浏览图片上传失败',
        //                 content: `原因：${data.errmsg}`
        //               })
        //             }, () => {
        //               $vm.checkRule('example_img')
        //             }
        //           )
        //         })
        //       }
        //     } else {
        //       $vm.example_img = this.unpreviewImg
        //       $vm.formCustom.material_preview = ''
        //       $vm.$Message.success('视频上传成功，视频格式不支持预览！')
        //     }
        //   } else {
        //     this.$Message.success('上传成功！')
        //     this.example_img = res.data.fileUrl
        //     this.$forceUpdate()
        //     this.checkRule('example_img')
        //   }
        //   this.formCustom.material = res.data.fileUrl
        // } else {
        //   this.$Modal.warning({
        //     title: '上传失败',
        //     content: `原因：${res.errmsg}`
        //   })
        // }
        // this.uploadSpinShow = true
      },
      initSubJump(value, flag) {
        if (value) {
          let openType = value
          for (let i = 0; i < this.turnList.list.length; i++) {
            let item = this.turnList.list[i]
            if (openType === item.value) {
              // && item.list.length
              this.defSubJump = item
              break
            }
          }
        }
        if (!flag) {
          this.jump.openSubType = ''
          if (this.defThirdJump.list && this.defThirdJump.list.length) {
            for (let i = 0; i < this.defThirdJump.list.length; i++) {
              let item = this.defThirdJump.list[i]
              this.jump[item.key] = ''
            }
          }
          this.defThirdJump = {}
        }
      },
      initThirdJump(value, flag) {
        if (!flag && this.defThirdJump.list && this.defThirdJump.list.length) {
          for (let i = 0; i < this.defThirdJump.list.length; i++) {
            let item = this.defThirdJump.list[i]
            this.jump[item.key] = ''
          }
        }
        if (value) {
          let subOpenType = value
          for (let i = 0; i < this.defSubJump.list.length; i++) {
            let item = this.defSubJump.list[i]
            if (subOpenType === item.value) {
              this.defThirdJump = item
              break
            }
          }
        }

        // console.log(this.thirdJump)
      },
      initCustomSubJump(value, flag, item) {
        if (value) {
          let openType = value
          for (let i = 0; i < this.turnList.list.length; i++) {
            let li = this.turnList.list[i]
            if (openType === li.value) {
              // && item.list.length
              this.subJump[item.identification] = li
              break
            }
          }
          if (!flag) {
            this.formCustom.custom_fields[item.identification].openSubType = ''
            if (this.thirdJump[item.identification] && this.thirdJump[item.identification].list) {
              this.thirdJump[item.identification].list.forEach((li, index) => {
                delete this.formCustom.custom_fields[item.identification][li.key]
              })
            }
            this.thirdJump[item.identification] = {}
          }
        }
        this.$forceUpdate()
      },
      initCustomThirdJump(value, flag, item) {
        if (value) {
          if (!flag && this.thirdJump[item.identification] && this.thirdJump[item.identification].list) {
            let openType = this.formCustom.custom_fields[item.identification].openType
            let openSubType = this.formCustom.custom_fields[item.identification].openSubType
            this.formCustom.custom_fields[item.identification] = {
              openType,
              openSubType
            }
            this.thirdJump[item.identification].list.forEach((li, index) => {
              this.formCustom.custom_fields[item.identification][li.key] = ''
            })
          }

          let subOpenType = value
          for (let i = 0; i < this.subJump[item.identification].list.length; i++) {
            let li = this.subJump[item.identification].list[i]
            if (subOpenType === li.value) {
              this.thirdJump[item.identification] = li
              break
            }
          }

          this.setThirdRule(item)
        }
        this.$forceUpdate()
      },

      changeModule(creative_module_id, flag) {
        let $vm = this
        if (creative_module_id) {
          this.uploadSpinShow = false
          let params = {
            creative_module_id
          }
          if (!flag) {
            this.example_img = ''
            this.jump = {
              openType: '',
              openSubType: ''
            }
            this.defThirdJump = {}
            this.defSubJump = {}
          }

          creativeDetail(params).then(res => {
            let data = res.data
            if (data.errno === 10000) {
              if (data.data.status !== 2) {
                $vm.material_type = data.data.material_type
                $vm.material = data.data.material
                $vm.formCustom.pre_download = data.data.pre_download
                $vm.formCustom.days = data.data.days
                // 自定义字段
                $vm.customFormCustom = data.data.custom_fields
                $vm.setCustomRule()
                let setSuffixArr = false
                let custom_fields = {}
                if ($vm.customFormCustom && $vm.customFormCustom.length) {
                  for (let i = 0; i < this.customFormCustom.length; i++) {
                    let item = this.customFormCustom[i]
                    // 如果是跳转， 则添加两个字段
                    if (item.type === 'jump') {
                      // 如果是编辑或者复制，则回显跳转

                      if (($vm.pageType === 'edit') && this.firstCopy) {
                        // 回显跳转类型
                        $vm.initCustomSubJump($vm.formCustom.custom_fields[item.identification].openType, true, item)
                        custom_fields[item.identification] = $vm.formCustom.custom_fields[item.identification]
                        if ($vm.formCustom.custom_fields[item.identification].openType !== 'none') {
                          $vm.initCustomThirdJump($vm.formCustom.custom_fields[item.identification].openSubType, true, item)
                        }
                      } else {
                        custom_fields[item.identification] = {
                          openType: '',
                          openSubType: ''
                        }
                        $vm.subJump[item.identification] = {}
                        $vm.thirdJump[item.identification] = {}
                      }
                    }
                    // 使用第一个图片/视频的设置格式
                    if ((item.type === 'img' || item.type === 'video') && !setSuffixArr) {
                      $vm.suffixArr = item.subCustom.suffix
                      setSuffixArr = true
                    }

                    // 设置默认值
                    if (item.subCustom && (item.subCustom.default || item.subCustom.default * 1 === 0) && (!this.firstCopy || $vm.pageType === 'create')) {
                      custom_fields[item.identification] = item.subCustom.default
                    }

                    // 如果是日期，转成 标准时间格式
                    if (item.type === 'datetime') {
                      if ($vm.pageType === 'edit' && $vm.formCustom.custom_fields[item.identification] && this.firstCopy) {
                        console.log(resetTime)
                        custom_fields[item.identification] = resetTime($vm.formCustom.custom_fields[item.identification])
                      } else {
                        custom_fields[item.identification] = ''
                      }
                    }
                  }
                }
                if ($vm.pageType === 'edit' && this.firstCopy) {
                  $vm.formCustom.custom_fields = {
                    ...$vm.formCustom.custom_fields,
                    ...custom_fields
                  }
                } else {
                  $vm.formCustom.custom_fields = custom_fields
                }
              } else {
                $vm.formCustom.creative_module_id = ''
                $vm.example_img = ''
                $vm.material_type = ''
                $vm.material = {}
                $vm.formCustom.pre_download = ''
                $vm.formCustom.days = ''
                $vm.md5 = ''
              }
              let conditionType = $vm.material.condition
              for (let i = 0; i < $vm.conditionList.length; i++) {
                let condition = $vm.conditionList[i]
                if (condition.key === conditionType) {
                  $vm.material.conditionName = condition.name
                  break
                }
              }
              this.firstCopy = false
            } else {
              $vm.$Modal.warning({
                title: '模板获取失败',
                content: `原因：${data.errmsg}`
              })
            }
          })
        }
      },
      save(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let data = deepClone(this.formCustom)
            data.jump = JSON.stringify(this.jump)
            data.material_verify = this.md5
            // custom_fields 转 json
            // 遍历 customFormCustom 将 日期转成时间戳
            if (this.customFormCustom && this.customFormCustom.length) {
              for (let i = 0; i < this.customFormCustom.length; i++) {
                let item = this.customFormCustom[i]
                if (item.type === 'datetime') {
                  data.custom_fields[item.identification] = parseInt((new Date(data.custom_fields[item.identification]).getTime()) / 1000)
                }
              }
            }

            data.custom_fields = JSON.stringify(data.custom_fields)
            if (this.pageType !== 'edit') {
              delete this.formCustom.id
            }
            creSave(data).then(res => {
              let data = res.data
              if (data.errno === 10000) {
                this.$Message.success('保存成功')
                this.$router.push({
                  path: '/view/ad_push_management/creative_management'
                })
              } else {
                this.$Modal.warning({
                  title: '保存失败',
                  content: `原因：${data.errmsg}`
                })
              }
            })
          }
        })
      },
      convertBase64UrlToBlob(urlData) {
        // 去掉url的头，并转换为byte
        let bytes = window.atob(urlData.split(',')[1])
        // 处理异常,将ascii码小于0的转换为大于0
        let ab = new ArrayBuffer(bytes.length)
        let ia = new Uint8Array(ab)
        for (let i = 0; i < bytes.length; i++) {
          ia[i] = bytes.charCodeAt(i)
        }
        return new Blob([ab], {type: 'image/png'})
      },
      checkRule(propName) {
        this.$refs['formValidate'].validateField(propName)
      },
      uploadFile(file, successCb, failCb, finalCb) {
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
      },
      setCustomRule() {
        let $vm = this
        // ruleValidate
        if (!$vm.customFormCustom) return
        for (let i = 0; i < $vm.customFormCustom.length; i++) {
          let item = $vm.customFormCustom[i]
          switch (item.type) {
            case 'string': {
              let rule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification] || ''
                    if (!item.required && value === '') {
                      callback()
                    } else if (item.required && value === '') {
                      callback('请输入' + item.name)
                    }
                    if (item.subCustom && item.subCustom.long_min && item.subCustom.long_min !== '' && item.subCustom.long_max && item.subCustom.long_max !== '') {
                      if (value.length < item.subCustom.long_min || value.length > item.subCustom.long_max) {
                        callback(`字符长度错误，限${item.subCustom.long_min}-${item.subCustom.long_max}字符`)
                      } else {
                        callback()
                      }
                    } else {
                      callback()
                    }
                  },
                  trigger: 'blur'
                }
              ]
              $vm.ruleValidate[item.identification] = rule
              break
            }
            case 'numeric': {
              let rule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification]
                    value = (value * 1 === 0 || value) ? value : ''
                    if (!item.required && value === '') {
                      callback()
                    } else if (item.required && value === '') {
                      callback('请输入' + item.name)
                    }
                    if (item.subCustom && item.subCustom.long_min && item.subCustom.long_min !== '' && item.subCustom.long_max && item.subCustom.long_max !== '') {
                      if (value < item.subCustom.long_min || value > item.subCustom.long_max) {
                        callback(`范围错误，限${item.subCustom.long_min}-${item.subCustom.long_max}`)
                      } else {
                        callback()
                      }
                    } else {
                      callback()
                    }
                  },
                  trigger: 'blur'
                }
              ]
              $vm.ruleValidate[item.identification] = rule
              break
            }
            case 'single_choice': {
              let rule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请选择' + item.name)
                    } else {
                      callback()
                    }
                  },
                  trigger: 'change'
                }
              ]
              $vm.ruleValidate[item.identification] = rule
              break
            }
            case 'multiple_choice': {
              let rule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请选择' + item.name)
                    } else {
                      callback()
                    }
                  },
                  trigger: 'change'
                }
              ]
              $vm.ruleValidate[item.identification] = rule
              break
            }
            case 'datetime': {
              let rule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请选择' + item.name)
                    } else {
                      callback()
                    }
                  },
                  trigger: 'change'
                }
              ]
              $vm.ruleValidate[item.identification] = rule
              break
            }
            case 'img': {
              let rule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请上传' + item.name)
                    } else {
                      callback()
                    }
                  },
                  trigger: 'change'
                }
              ]
              $vm.ruleValidate[item.identification] = rule
              break
            }
            case 'video': {
              let rule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请上传' + item.name)
                    } else {
                      callback()
                    }
                  },
                  trigger: 'change'
                }
              ]
              $vm.ruleValidate[item.identification] = rule
              break
            }
            case 'jump': {
              let openTypeRule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification].openType
                    if (item.required && !value) {
                      callback('请选择' + item.name)
                    } else {
                      callback()
                    }
                  },
                  trigger: 'change'
                }
              ]

              let openSubTypeRule = [
                {
                  validator: (rule, val, callback) => {
                    let value = $vm.formCustom.custom_fields[item.identification].openSubType

                    if (!value) {
                      callback('不能为空')
                    } else {
                      callback()
                    }
                  }
                }
              ]

              $vm.ruleValidate[item.identification + '_openType'] = openTypeRule
              $vm.ruleValidate[item.identification + '_openSubType'] = openSubTypeRule
              this.setThirdRule(item)
              break
            }
          }
        }
      },
      setThirdRule(item) {
        let $vm = this
        if ($vm.thirdJump[item.identification] && $vm.thirdJump[item.identification].list) {
          let list = $vm.thirdJump[item.identification].list
          if (list && list.length) {
            for (let i = 0; i < list.length; i++) {
              let li = list[i]
              let rule
              switch (li.key) {
                // openEpId:视频id不能为空
                case 'openEpId': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('视频id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // openEqId:专辑id不能为空
                case 'openEqId': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('专辑id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // openSpecialId: 专题id不能为空
                case 'openSpecialId': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('专题id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // openGameId:游戏id不能为空
                case 'openGameId': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('游戏id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // openAppId: 应用id不能为空
                case 'openAppId': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('应用id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // openAppName:应用名称不能为空
                case 'openAppName': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('应用名称不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // openAppPackage:应用包名不能为空
                case 'openAppPackage': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('应用包名不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // openParam:第三方跳转参数不能为空
                case 'openParam': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('第三方跳转参数不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // keyword:关键词不能为空
                case 'keyword': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('关键词不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
                // resourceId:资源ID不能为空
                case 'resourceId': {
                  rule = [
                    {
                      validator: (rule, value, callback) => {
                        let val = $vm.formCustom.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('资源ID不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  ]
                  break
                }
              }
              this.ruleValidate[`${item.identification}_${li.key}`] = rule
            }
          }
        }
      },
      beforeUploadImg (file) {
        console.log(file, '12')
      },
      uploadSuccessImg (params) {
        console.log(params, '23')
      }
    },
    mounted() {
      let href = location.href
      let hash
      let id
      let paramsCreative = {
        all: true,
        status: 1,
        ad_space_type: 1
      }
      if (~href.indexOf('creative_add')) { // 新建
        this.spinShow = false
        this.pageType = 'create'
        this.title = '新建创意'
        Promise.all([creativeList(paramsCreative), creTurnList()]).then(res => {
          let creListData = res[0].data
          let turnListData = res[1].data
          if (creListData.errno === 10000) {
            this.creativeModuleList = creListData.data.data
          } else {
            this.$Modal.warning({
              title: '获取创意模板列表失败',
              content: `原因：${creListData.errmsg}`
            })
            return
          }
          if (turnListData.errno === 10000) {
            this.turnList = turnListData.data
          } else {
            this.$Modal.warning({
              title: '获取跳转列表失败',
              content: `原因：${turnListData.errmsg}`
            })
          }
        })
      } else if (~href.indexOf('creative_edit')) { // 编辑
        hash = href.split('#')[1]
        if (hash) {
          id = hash.split('?')[0]
        } else {
          this.toPage('/view/ad_push_management/creative_add')
        }
        this.pageType = 'edit'
        this.title = '编辑创意'
        let paramsDetail = {
          id
        }
        Promise.all([creDetail(paramsDetail), creativeList(paramsCreative), creTurnList()]).then(res => {
          this.spinShow = false
          let detailData = res[0].data
          let creListData = res[1].data
          let turnListData = res[2].data

          if (creListData.errno === 10000) {
            this.creativeModuleList = creListData.data.data
          } else {
            this.$Modal.warning({
              title: '获取创意模板列表失败',
              content: `原因：${creListData.errmsg}`
            })
            return
          }

          if (turnListData.errno === 10000) {
            this.turnList = turnListData.data
          } else {
            this.$Modal.warning({
              title: '获取跳转列表失败',
              content: `原因：${turnListData.errmsg}`
            })
            return
          }
          if (detailData.errno === 10000) {
            this.formCustom = detailData.data
            this.jump = detailData.data.jump
            // console.log(this.formCustom, 'jump')
            this.md5 = detailData.data.material_verify
            let material_preview = detailData.data.material_preview
            if (detailData.data.material_type === 'video' && material_preview === '') {
              material_preview = this.unpreviewImg
            }
            this.example_img = material_preview || detailData.data.material
            this.initSubJump(this.jump.openType, true)
            this.initThirdJump(this.jump.openSubType, true)
            this.changeModule(detailData.data.creative_module_id, true)
          } else {
            this.$Modal.warning({
              title: '获取详情失败',
              content: `原因：${detailData.errmsg}`
            })
          }
        })
      }
    },
    destroyed() {
      this.uploadFile()
    }
  }
</script>
