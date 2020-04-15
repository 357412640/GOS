<template>
  <div>
    <my-header title="新建投放"></my-header>
    <div class="page-common edit-page">
      <el-steps :active="current" class="step-box">
        <el-step title="基本信息"></el-step>
        <el-step title="投放排期"></el-step>
        <el-step title="设备定向"></el-step>
      </el-steps>
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="120" class="form-box">
        <!--基本信息-->
        <div class="first" v-if="current === 1">
          <FormItem label="推广名称" prop="title">
            <Input v-model.trim="formData.title"/>
          </FormItem>
          <FormItem label="计算方式" prop="cost_type">
            <RadioGroup v-model="formData.cost_type">
              <Radio label="cpd">CPD</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="投放终端" prop="terminal">
            <RadioGroup v-model="formData.terminal" @on-change="changeTerminal">
              <Radio label="tv">TV</Radio>
              <Radio label="fridge">冰箱</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="广告位" prop="ad_id">
            <Select v-model="formData.ad_id" style="width:100%" @on-change="formData.ad_id !== '' && getCreativeList()">
              <Option v-for="item in adList" :key="item.ad_id" :value="item.ad_id">{{item.ad_title}}</Option>
            </Select>
          </FormItem>
          <FormItem label="投放类型" prop="put_type">
            <Select v-model="formData.put_type" style="width:100%">
              <Option v-for="item in put_type_list" :key="item.value" :value="item.value">{{item.title}}</Option>
            </Select>
          </FormItem>
          <FormItem label="选择创意" prop="creative.creative_id" v-if="formData.creative">
            <Select v-model="formData.creative.creative_id" style="width:calc(100% - 74px)" filterable>
              <Option v-for="item in creativeList" :key="item.id" :value="item.id">{{item.title}}</Option>
            </Select>
            <Button style="margin-left: 4px;width: 70px; height: 40px" @click="getCreativeDetail">查看</Button>
          </FormItem>
          <FormItem label="说明" prop="remarks">
            <Input v-model="formData.remarks" placeholder="非必填项"></Input>
          </FormItem>
        </div>
        <!--投放排期-->
        <div class="second" v-if="current === 2">
          <FormItem label="已选天数">
            {{totalDays}}天
          </FormItem>
          <FormItem
            v-for="(item, index) in formData.dynamic"
            :key="index"
            :label="index === 0 ? '选择日期' : ''"
            :prop="'dynamic.' + index + '.value'"
            :rules="{validator, trigger: 'change'}">
            <DatePicker type="daterange" confirm placement="bottom-end"
                        placeholder="请选择日期"
                        style="width: calc(100% - 100px)" v-model="item.value"></DatePicker>
            <Button @click="removeDateItem(index)" class="icon-btn" v-if="index !== 0">
              <Icon type="md-remove"/>
            </Button>
            <Button @click="formData.dynamic.push({ value: []})" class="icon-btn"
                    v-if="index + 1 === formData.dynamic.length">
              <Icon type="md-add"/>
            </Button>
          </FormItem>
        </div>
        <!--设备定向-->
        <div class="last" v-if="current === 3">
          <FormItem label="定向类型" prop="device_orientation.orientation_type">
            <Select v-model="formData.device_orientation.orientation_type" style="width:100%"
                    @on-change="changeDirection">
              <Option v-for="item in device_orientation_list" :key="item.value" :value="item.value">{{item.name}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="设备列表" prop="device_orientation.url"
                    v-if="formData.device_orientation.orientation_type === 'sub_device'">
            <Upload action="http://api.scloud.gome.inc/uploadfile/uploadFdfs"
                    :format="['txt']"
                    :on-success="uploadSuccess"
                    :on-format-error="formatFail"
                    :show-upload-list="false"
                    name="uploadfile">
              <Button type="primary" class="page-main-btn common-margin-right-10 common-margin-bottom-5">上传文件</Button>
              <span>{{formData.device_orientation.filename}}</span>
              <p class="minor-font-color">上传设备ID构成的.txt文件，设备ID之间以换行间隔</p>
              <p class="minor-font-color">电视设备ID为小写的有线mac地址，如：b01bd20e0a22</p>
            </Upload>
          </FormItem>
          <FormItem label="" prop="device_orientation.front_content"
                    v-if="formData.device_orientation.orientation_type === 'device_group'">
            <div v-for="(item, index) in groupTitle" :key="index">
              <div>
                <Checkbox
                  :indeterminate="indeterminateGroup[item]"
                  :value="checkAllGroup[item]"
                  @click.prevent.native="handleCheckAll(item)">{{item}}全选
                </Checkbox>
              </div>
              <CheckboxGroup v-model="formData.device_orientation.front_content"
                             @on-change="checkAllGroupChange"
                             style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                  v-for="(val, i) in groupList[item]"
                  :label="val.group_id"
                  :key="i">
                  {{val.group_name}}
                </Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
        </div>
        <FormItem>
          <Button type="primary" @click="pre" v-if="current !== 1" class="page-main-btn common-margin-right-10">上一步
          </Button>
          <Button type="primary" @click="next" :disabled="current === 3 && isAchieve" class="page-main-btn">{{current
            !== 3 ? '下一步' : '完成'}}
          </Button>
        </FormItem>
      </Form>
      <creativeDetail :creativeShow='showCreDetail' @on-hide="showCreDetail=false"
                      :detailId="formData.creative.creative_id" v-if="formData.creative"></creativeDetail>
    </div>
  </div>
</template>

<script>
import { reqadList, reqcreativeList, reqStrategyGroup, reqPutPreview, reqEdit } from '@/api/ad-push-list'
import { deepcopy } from '@/libs/deepcopy'
import { formatDate } from '@/libs/date'
import creativeDetail from '_c/creative-detail'

const ruleValidate = {
  title: [{ required: true, message: '推广名称不能为空' }],
  put_type: [{ required: true, message: '投放类型不能为空', trigger: 'change' }],
  'creative.creative_id': [{ required: true, message: '请选择创意', trigger: 'change' }],
  ad_id: [{ required: true, message: '请选择广告位', trigger: 'change' }],
  'device_orientation.orientation_type': [{ required: true, message: '定向类型不能为空', trigger: 'change' }],
  'device_orientation.url': [{ required: true, message: '请上传文件' }],
  'device_orientation.front_content': [{
    validator: (rule, value, callback) => { value && value.length ? callback() : callback('定向类型数据不能为空') }
  }]
}
const put_type_list = [
  { value: 'business', title: '商广' },
  { value: 'internal', title: '内推' }
]
const device_orientation_list = [
  { value: 'all_device', name: '全部设备' },
  { value: 'sub_device', name: '指定设备' },
  { value: 'device_group', name: '设备分组' }
  // { value: 'crowd', name: '人群画像' }
]
const formData = {
  title: '',
  cost_type: 'cpd',
  terminal: 'tv',
  ad_id: '',
  put_type: '',
  creative: {
    creative_id: ''
  },
  remarks: '',
  front_put_day: [
    { start_time: '', end_time: '' }
  ],
  device_orientation: {
    orientation_type: '',
    url: '',
    filename: '',
    front_content: []
  },
  dynamic: [{ value: [] }]
}
export default {
  name: 'editpage',
  data () {
    return {
      current: 1,
      formData: {},
      adList: [],
      put_type_list,
      device_orientation_list,
      creativeList: [],
      ruleValidate,
      indeterminateGroup: {},
      checkAllGroup: {},
      groupList: {},
      groupTitle: [],
      showCreDetail: false,
      // 日期校验
      validator: (rule, value, callback) => {
        if (value.filter(item => item !== '').length) {
          this.checkDate(value) ? callback('日期不能重复哦') : callback()
        } else {
          callback('日期不能为空')
        }
      },
      isAchieve: false
    }
  },
  computed: {
    totalDays () {
      let totalDay = 0
      this.formData.dynamic.forEach(val => {
        if (val.value[0]) totalDay += (val.value[1] - val.value[0]) / 86400000 + 1
      })
      return totalDay
    }
  },
  mounted () {
    this.getDetail()
  },
  components: { creativeDetail },
  methods: {
    async getDetail () {
      if (!(this.getQueryVal('isEdit') === 'true' || this.getQueryVal('isEdit') === true)) {
        this.formData = deepcopy(formData)
        this.getAdList()
        return
      }
      try {
        const res = await reqPutPreview({ id: this.getQueryVal('id') })
        if (res.errno === 10000) {
          this.formData = {
            ...deepcopy(formData),
            ...res.data,
            device_orientation: { ...formData.device_orientation, ...res.data.device_orientation }
          }
          this.getAdList()
          // 处理日期函数
          this.formData.dynamic = this.formData.front_put_day.map(item => {
            return { value: [item.start_time, item.end_time] }
          })
          console.log('this.formData', this.formData)
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    changeTerminal () {
      this.formData.ad_id = ''
      this.formData.creative.creative_id = ''
      this.formData.device_orientation.front_content = []
      this.getAdList()
    },
    async getAdList () {
      try {
        const res = await reqadList({ terminal: this.formData.terminal, ad_space_type: 1 })
        if (res.errno === 10000) {
          this.adList = res.data.data
          this.formData.ad_id && this.getCreativeList()
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getCreativeList () {
      try {
        const res = await reqcreativeList({ ad_id: this.formData.ad_id })
        if (res.errno === 10000) {
          this.creativeList = res.data.list
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async saveAdd () {
      this.isAchieve = true
      try {
        // 将creative_id向外移除一层，原因：返回详情接口和保存结构不同
        const newParams = deepcopy(this.formData)
        newParams.creative_id = newParams.creative.creative_id
        delete newParams.creative
        delete newParams.dynamic
        newParams.front_put_day = JSON.stringify(newParams.front_put_day)
        newParams.device_orientation = JSON.stringify(newParams.device_orientation)
        this.getQueryVal('isCopy') && delete newParams.id
        const res = await reqEdit({ ...newParams })
        if (res.errno === 10000) {
          // 跳转列表页面
          this.$router.push({ path: 'ad_push_list' })
          this.$Message.success('保存成功！')
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      } finally {
        this.isAchieve = false
      }
    },
    getCreativeDetail () {
      // 处理创意详情
      this.showCreDetail = true
    },
    uploadSuccess (response, file, fileList) {
      if (response.errno === 10000) {
        this.formData.device_orientation.url = response.data.fileUrl
        this.formData.device_orientation.filename = file.name
        this.formData = { ...this.formData }
      } else this.$Message.error(response.errmsg)
    },
    formatFail () {
      this.$Message.error('只能上传txt哟')
    },
    removeDateItem (index) {
      this.formData.dynamic.splice(index, 1)
    },
    changeDirection () {
      // 如果是设备分组则加载列表并清空url和filename，清空content
      if (this.formData.device_orientation && this.formData.device_orientation.orientation_type === 'device_group') {
        this.getGroupList(true)
        this.formData.device_orientation.url = this.formData.device_orientation.filename = ''
      } else {
        this.formData.device_orientation.front_content = []
      }
    },
    // 日期校验是否有重复
    checkDate (value) {
      const newDynamic = deepcopy(this.formData.dynamic)
      const index = newDynamic.findIndex(val => JSON.stringify(val.value) === JSON.stringify(value))
      // 删除新对象中当前值，即对比时排除本身之间对比
      newDynamic.splice(index, 1)
      // 只要当前值中有日期在新对象之间（有交集）就返回false报错，否则返回true
      return newDynamic.filter(item => (item.value[0] <= value[0] && item.value[1] >= value[0]) || (item.value[0] <= value[1] && item.value[1] >= value[1])).length
    },
    next () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.current !== 3) {
            this.current++
            this.current === 2 && this.changeDirection()
          }
          // 第三部调用保存接口
          else {
            // 处理日期传值
            this.recodeDate()
            this.saveAdd()
            console.log('保存', this.formData)
          }
        } else {
          this.$Message.error('请将信息填写完整!')
        }
      })
    },
    pre () {
      this.current !== 0 && this.current--
    },
    async getGroupList (isinit) {
      try {
        this.groupTitle = []
        const device_type = this.formData.terminal.toUpperCase()
        const type = device_type ? { device_type } : {}
        const res = await reqStrategyGroup(type)
        if (res.errno === 10000) {
          this.groupList = res.data.list
          this.groupTitle = Object.keys(this.groupList)
          // 初始化为全选赋初值
          this.groupTitle.forEach(item => {
            this.indeterminateGroup[item] = false
            this.checkAllGroup[item] = false
          })
          if (isinit) this.initCheckAll()
        } else {
          throw res.errmsg
        }
      } catch (e) {
        console.log(e)
        this.$Message.error(e)
      }
    },
    handleCheckAll (item) {
      if (this.indeterminateGroup[item]) {
        this.checkAllGroup[item] = false
      } else {
        this.checkAllGroup[item] = !this.checkAllGroup[item]
      }
      this.indeterminateGroup[item] = false
      if (this.checkAllGroup[item]) {
        this.formData.device_orientation.front_content.push(...this.filterGroup(this.groupList[item], 'group').concat())
      } else {
        // 找到组内元素，逐个删除
        this.filterGroup(this.groupList[item], 'group').forEach(val => {
          const index = this.formData.device_orientation.front_content.indexOf(val)
          if (index !== -1) {
            this.formData.device_orientation.front_content.splice(index, 1)
          }
        })
      }
      // 手动触发校验
      this.$nextTick(() => {
        this.$refs.formData.validateField('device_orientation.front_content')
      })
    },
    checkAllGroupChange () {
      this.groupTitle.forEach(item => {
        if (this.hasCheckAll(item) === 'all') {
          this.indeterminateGroup[item] = false
          this.checkAllGroup[item] = true
        } else if (this.hasCheckAll(item) > 0) {
          this.indeterminateGroup[item] = true
          this.checkAllGroup[item] = false
        } else {
          this.indeterminateGroup[item] = false
          this.checkAllGroup[item] = false
        }
      })
    },
    initCheckAll () {
      this.groupTitle.forEach(item => {
        if (this.hasCheckAll(item) === 'all') {
          this.indeterminateGroup[item] = false
          this.checkAllGroup[item] = true
        } else if (this.hasCheckAll(item) > 0) {
          this.indeterminateGroup[item] = true
          this.checkAllGroup[item] = false
        } else {
          this.indeterminateGroup[item] = false
          this.checkAllGroup[item] = false
        }
      })
    },
    filterGroup (list, type) {
      const newList = []
      list.forEach(item => {
        newList.push(item.group_id)
      })
      return newList
    },
    hasCheckAll (item) {
      let count = 0
      this.groupList[item].forEach(val => {
        if (this.formData.device_orientation.front_content && this.formData.device_orientation.front_content.includes(val.group_id)) {
          count++
        }
      })
      if (count === this.groupList[item].length) {
        return 'all'
      } else {
        return count
      }
    },
    getQueryVal (name) {
      return this.$route.query[name]
    },
    recodeDate () {
      this.formData.front_put_day = this.formData.dynamic.map(item => {
        return { start_time: formatDate(item.value[0], false, 1), end_time: formatDate(item.value[1], false, 1) }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .step-box {
    padding: 0 50px;
  }

  .form-box {
    padding-top: 40px;
  }
</style>
