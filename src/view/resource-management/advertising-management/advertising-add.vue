<template>
  <div class="advertising-add-box">
    <content-header :title="title"></content-header>
    <Form ref="formValidate" :model="formCustom" :label-width="110" @submit.native.prevent label-position="left" :rules="ruleValidate" class="form-box">
      <Row type="flex" align="top">
        <Col span="3">
          <span class="themeTitle">基本信息</span>
        </Col>
        <Col span="10">
          <FormItem label="广告位ID" v-if="pageType === 'edit'">
            <span>{{ formCustom.id }}</span>
          </FormItem>
          <FormItem label="投放终端" prop="terminal">
            <div v-if="pageType === 'edit'">
              <span v-if="formCustom.terminal === 'tv'">TV</span>
              <span v-else-if="formCustom.terminal === 'fridge'">冰箱</span>
            </div>
            <RadioGroup v-model="formCustom.terminal" v-else>
              <Radio label="tv">
                <span>TV</span>
              </Radio>
              <Radio label="fridge">
                <span>冰箱</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="广告位名称" prop="title">
            <Input v-model="formCustom.title"></Input>
          </FormItem>
          <FormItem label="广告位标识" prop="identification">
            <span v-if="pageType === 'edit'">{{ formCustom.identification }}</span>
            <Input v-model="formCustom.identification" placeholder="限输入英文、数字、下划线" v-else></Input>
          </FormItem>
          <FormItem label="广告位类型" prop="ad_space_type">
            <div v-if="pageType === 'edit'">
              <span v-if="formCustom.ad_space_type === 1">固定位</span>
              <span v-else-if="formCustom.ad_space_type === 2">消息推送</span>
            </div>
            <Select v-model="formCustom.ad_space_type" @on-change="changeAd" v-else>
              <Option :value=1 key="1">固定位</Option>
              <Option :value=2 key="2">消息推送</Option>
            </Select>
          </FormItem>

          <FormItem label="说明" prop="description">
            <Input v-model="formCustom.description" placeholder="非必填项"></Input>
          </FormItem>
          <FormItem label="上传示例" prop="example_img">
            <Upload
              :action="uploadUrl + '/uploadFdfs'"
              :format="['png','jpg','jpeg','gif','bmp']"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :show-upload-list="false"
              name="uploadfile">
              <img style="width: 140px;cursor:pointer;" :src="formCustom.example_img" v-if="formCustom.example_img" />
              <div style="width: 80px;height:80px;line-height: 80px;color: rgba(0,0,0,0.3); background-color: rgba(200,200,200,0.1);cursor: pointer;text-align: center;position:relative;" v-else>
                <Icon type="md-add" size="45" v-if="!uploadSpinShow"/>
                <Spin fix v-else></Spin>
              </div>
            </Upload>
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" align="top">
        <Col span="3">
          <span class="themeTitle">关联模板</span>
        </Col>
        <Col span="15">
          <FormItem label="创意模板" prop="creative_module">
            <div style="overflow:hidden;">
              <div class="left">
                <Input v-model="creative_search" placeholder="输入名称搜索" @on-change="changeCreativeSearch" search></Input>
                <div class="left-box">
                  <Tree :data="creativeSearchList" show-checkbox multiple @on-check-change="creativeChange"></Tree>
                </div>
              </div>
              <div class="right">
                <p class="right-p">已选创意模板</p>
                <div class="right-box">
                  <Tag v-for="item in creativeCheckedList" :key="item.creative_module_id" :name="item.creative_module_id" closable @on-close="closeCreative">{{ item.title }}</Tag>
                </div>
              </div>
            </div>
            <p style="height: 24px;line-height: 24px;color: #999;margin-top: 5px"><Icon type="md-alert" style="margin-bottom: 2px" />若无可用模板，请前往创意模板管理中添加。</p>
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" align="top">
        <Col span="3">
          <span class="themeTitle">配置策略</span>
        </Col>
        <Col span="10">
          <FormItem label="投放策略" prop="strategy">
            <Select v-model="formCustom.strategy">
              <Option v-for="item in strategyList" :value="item.key" :key="item.key">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row type="flex" align="top">
        <Col span="3">
        </Col>
        <Col span="10">
          <Button type="primary" @click="save('formValidate')" class="button-common">保存</Button>
        </Col>
      </Row>
    </Form>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import './index.less'
import { adDetail, adSave, creativeList } from '@/api/resource-data'
import ContentHeader from '_c/ContentHeader'
export default {
  name: 'advertising-add',
  components: {
    ContentHeader
  },
  data () {
    return {
      uploadSpinShow: false,
      spinShow: true,
      title: '',
      pageType: '',
      uploadUrl: 'http://api.scloud.gome.inc/uploadfile',
      formCustom: {
        terminal: 'tv',
        title: '',
        identification: '',
        example_img: ''
      },
      ruleValidate: {
        terminal: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.terminal) {
                callback(new Error('请选择投放终端'))
              } else {
                callback()
              }
            }
          }
        ],
        title: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.title.trim()) {
                callback(new Error('广告位名称不能为空'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        identification: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.identification.trim()) {
                callback(new Error('广告位标识不能为空'))
              } else if (!/^[0-9a-zA-Z_]+$/.test(this.formCustom.identification)) {
                callback(new Error('广告位标识仅限英文、数字、下划线'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        example_img: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.example_img) {
                callback(new Error('请上传示例'))
              } else {
                callback()
              }
            },
            trigger: 'none'
          }
        ],
        creative_module: [
          // {
          //   validator: (rule, val, callback) => {
          //     if (!this.creativeCheckedList.length) {
          //       callback(new Error('关联模板不能为空'))
          //     } else {
          //       callback()
          //     }
          //   },
          //   trigger: 'none'
          // }
        ],
        strategy: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.strategy) {
                callback(new Error('请选择投放策略'))
              } else {
                callback()
              }
            }
          }
        ],
        ad_space_type: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.ad_space_type) {
                callback(new Error('请选择广告位类型'))
              } else {
                callback()
              }
            }
          }
        ]

      },
      strategyList: [
        {
          name: '全部',
          key: 'all'
        },
        {
          name: '轮播',
          key: 'carousel'
        },
        {
          name: '随机',
          key: 'random'
        }
      ],
      creative_search: '',
      creativeList: [], // 全数据
      creativeSearchList: [], // 搜索数据
      creativeCheckedList: [] // 选中数据
    }
  },
  methods: {
    toPage (path) {
      this.$router.push({
        path
      })
    },
    beforeUpload (file) {
      let fileArr = file.name.split('.')
      let len = fileArr.length - 1
      let fileType = fileArr[len].toLowerCase()
      if (!(fileType === 'jpeg' || fileType === 'jpg' || fileType === 'png' || fileType === 'gif' || fileType === 'bmp')) {
        this.$Modal.warning({
          title: '图片上传失败',
          content: `原因：图片格式有误，只能上传png,jpg,jpeg,gif,bmp格式的图片`
        })
        return false
      }
      this.uploadSpinShow = true
    },
    uploadSuccess (res, file, fileList) {
      if (res.errno === 10000) {
        this.$Message.success('图片上传成功！')
        this.formCustom.example_img = res.data.fileUrl
      } else {
        this.$Modal.warning({
          title: '图片上传失败',
          content: `原因：${res.errmsg}`
        })
      }
      this.checkRule('example_img')
      this.uploadSpinShow = false
    },
    save (name) {
      // creative_module 是一个id 数组
      let creative_module = []
      for (let i = 0; i < this.creativeCheckedList.length; i++) {
        let item = this.creativeCheckedList[i]
        creative_module.push(item.creative_module_id)
      }
      this.formCustom.creative_module = creative_module

      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = this.formCustom
          adSave(data).then(res => {
            let data = res.data
            if (data.errno === 10000) {
              this.$Message.success('保存成功')
              this.toPage('/view/resource_management/advertising_management')
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
    creativeChange (items, item) {
      // 选中去重
      let oldChecked = this.creativeCheckedList
      let newChecked = items
      if (item.checked === true) {
        for (let i = 0; i < oldChecked.length; i++) {
          let oldItem = oldChecked[i]
          for (let j = 0; j < newChecked.length; j++) {
            let newItem = newChecked[j]
            if (oldItem.creative_module_id === newItem.creative_module_id) {
              newChecked.splice(j, 1)
              j--
              break
            }
          }
        }
        this.creativeCheckedList = oldChecked.concat(newChecked)
      } else {
        for (let i = 0; i < oldChecked.length; i++) {
          let oldItem = oldChecked[i]
          if (oldItem.creative_module_id === item.creative_module_id) {
            oldChecked.splice(i, 1)
          }
        }
        this.creativeCheckedList = oldChecked
        let searchList = this.deepClone(this.creativeSearchList)
        let allList = this.creativeList
        // 待选删除
        for (let i = 0; i < searchList.length; i++) {
          let li = searchList[i]
          if (item.creative_module_id === li.creative_module_id) {
            delete li.checked
          }
        }
        // 全部数据删除
        for (let i = 0; i < allList.length; i++) {
          let li = allList[i]
          if (item.creative_module_id === li.creative_module_id) {
            delete li.checked
          }
        }
        this.creativeSearchList = searchList
      }

      // 选中模板属性保存至全数据
      let allList = this.creativeList
      let checkedList = this.creativeCheckedList
      let index = 0
      let checkedLength = checkedList.length
      for (let i = 0; i < allList.length; i++) {
        let allItem = allList[i]
        allItem.checked = false
        if (!(index === checkedLength)) {
          for (let j = 0; j < checkedList.length; j++) {
            let checkedItem = checkedList[j]
            if (allItem.creative_module_id === checkedItem.creative_module_id) {
              allItem.checked = true
              index++
              break
            }
          }
        }
      }
      this.checkRule('creative_module')
    },
    closeCreative (event, id) {
      let checkedList = this.creativeCheckedList
      let searchList = this.deepClone(this.creativeSearchList)
      let allList = this.creativeList
      // 已选删除
      for (let i = 0; i < checkedList.length; i++) {
        let item = checkedList[i]
        if (id === item.creative_module_id) {
          checkedList.splice(i, 1)
          break
        }
      }
      // 待选删除
      for (let i = 0; i < searchList.length; i++) {
        let item = searchList[i]
        if (id === item.creative_module_id) {
          delete item.checked
        }
      }
      // 全部数据删除
      for (let i = 0; i < allList.length; i++) {
        let item = allList[i]
        if (id === item.creative_module_id) {
          delete item.checked
        }
      }
      this.creativeSearchList = searchList
    },
    // 创意模板前台搜索名称
    changeCreativeSearch () {
      let val = this.creative_search && this.creative_search.trim()
      let allSearchList = this.creativeList
      if (val) {
        let list = []
        for (let i = 0; i < allSearchList.length; i++) {
          let item = allSearchList[i]
          if (~item.title.indexOf(val)) {
            list.push(item)
          }
        }
        this.creativeSearchList = this.deepClone(list)
      } else {
        this.creativeSearchList = this.deepClone(allSearchList)
      }
    },
    deepClone (obj) {
      let result
      let oClass = this.isClass(obj)
      // 确定result的类型
      if (oClass === 'Object') {
        result = {}
      } else if (oClass === 'Array') {
        result = []
      } else {
        return obj
      }
      for (let key in obj) {
        let copy = obj[key]
        if (this.isClass(copy) === 'Object') {
          result[key] = this.deepClone(copy)// 递归调用
        } else if (this.isClass(copy) === 'Array') {
          result[key] = this.deepClone(copy)
        } else {
          result[key] = obj[key]
        }
      }
      return result
    },
    isClass (o) {
      if (o === null) return 'Null'
      if (o === undefined) return 'Undefined'
      return Object.prototype.toString.call(o).slice(8, -1)
    },
    checkRule (propName) {
      this.$refs['formValidate'].validateField(propName)
    },
    changeAd (ad_space_type) {
      let paramsCreative = {
        status: 1,
        all: true,
        ad_space_type
      }
      creativeList(paramsCreative).then(res => {
        this.spinShow = false
        let creativeData = res.data
        if (creativeData.errno === 10000) {
          this.creativeList = creativeData.data.data
          this.creativeSearchList = this.creativeList
          this.creativeCheckedList = this.formCustom.creative_module || []
          let allList = this.creativeList
          let creativeCheckedList = this.creativeCheckedList
          console.log(creativeCheckedList)
          if (creativeCheckedList) {
            let newCheckedList = []
            for (let i = 0; i < allList.length; i++) {
              let item = allList[i]
              for (let j = 0; j < creativeCheckedList.length; j++) {
                let checked = creativeCheckedList[j]
                if (item.creative_module_id === checked.creative_module_id) {
                  item.checked = true
                  newCheckedList.push(checked)
                  break
                }
              }
            }
            this.creativeCheckedList = newCheckedList
          }
        } else {
          this.$Modal.warning({
            title: '获取创意模板列表失败',
            content: `原因：${creativeData.errmsg}`
          })
        }
      })
    }
  },
  mounted () {
    let href = location.href
    let hash
    let id
    if (~href.indexOf('advertising_add')) { // 新建
      this.pageType = 'create'
      this.title = '新建广告位'
      this.spinShow = false
    } else if (~href.indexOf('advertising_edit')) { // 编辑
      hash = href.split('#')[1]
      if (hash) {
        id = hash.split('?')[0]
      } else {
        this.toPage('/view/resource_management/advertising_add')
      }
      this.pageType = 'edit'
      this.title = '编辑广告位'
      let paramsDetail = {
        id
      }
      Promise.all([adDetail(paramsDetail)]).then(res => {
        this.spinShow = false
        let detailData = res[0].data
        if (detailData.errno === 10000) {
          this.formCustom = detailData.data
          this.changeAd(detailData.data.ad_space_type)
        } else {
          this.$Modal.warning({
            title: '获取广告详情失败',
            content: `原因：${detailData.errmsg}`
          })
        }
      })
    }
  }
}
</script>
