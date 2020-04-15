<template>
  <div class="msg-box">
    <content-header title="消息列表">
      <template slot="btn">
        <Button type="primary" @click="toPage">新建消息</Button>
      </template>
    </content-header>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="80" @submit.native.prevent>
        <Row>
          <Col span="5">
            <FormItem label="名称" :label-width="60">
              <Input type="text" v-model.trim="formCustom.title"></Input>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem label="广告位">
              <Select v-model="formCustom.ad_id">
                <Option value="-1">全部</Option>
                <Option v-for="item in adList" :value="item.ad_id" :key="item.ad_id">{{ item.ad_title }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="状态" :label-width="100">
              <Select v-model="formCustom.status">
                <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="2">
            <FormItem :label-width="30">
              <Button type="primary" @click="handleSubmit" class="button-common">搜索</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div class="table-box">
      <Table stripe :loading="loading" :columns="table_columns" :data="table_data" style="margin-top: 10px">
        <template slot-scope="{ row, index }" slot="operate">
          <div v-if="row.status === 1 || row.status === 3">
            <Button type="text" class="c-2D8CF0 operate-btn-common border-right" @click="copy(row.id)">复制</Button>
            <Button type="text" class="c-2D8CF0 operate-btn-common" @click="getDetail(row.id)">查看</Button>
          </div>
          <div v-else>
            <Button type="text" class="c-2D8CF0 operate-btn-common border-right" @click="edit(row.id)">编辑</Button>
            <Poptip trigger="hover" placement="left">
              <Button type="text" class="operate-btn-common c-2D8CF0">更多</Button>
              <div slot="content" class="button-more" ref="popTip">
                <Button type="text" class="c-2D8CF0 operate-btn-common border-right" @click="copy(row.id)">复制</Button>
                <Button type="text" class="c-2D8CF0 border-right operate-btn-common" @click="setUpOrDown(row, 0, $event)" v-if="row.status === 2">启用</Button>
                <Button type="text" class="c-2D8CF0 border-right operate-btn-common" @click="setUpOrDown(row, 2, $event)" v-else-if="row.status === 0">停用</Button>
                <Button type="text" class="c-2D8CF0 operate-btn-common" @click="getDetail(row.id)">查看</Button>
              </div>
            </Poptip>
          </div>
        </template>
        <template slot-scope="{ row, index }" slot="statusName">
          <span v-if="row.status === 3">{{ row.statusName }}: {{ row.push_error }}</span>
          <span :class="row.status === 1 ? 'c-30AC52' : ''" v-else>{{ row.statusName }}</span>
        </template>

        <template slot-scope="{ row, index }" slot="once_data">
<!--          <p>预估人数：{{ row.predict_num }}</p>-->
          <p>送达：{{ row.receive_num }}</p>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <Modal
      :title="msgInfo.title"
      v-model="msgInfoShow"
      :styles="{top: '20px',marginBottom: '20px'}"
      class="ad-detail-box"
      :footer-hide=true
    >
      <Form :model="msgInfo" :label-width="110" @submit.native.prevent label-position="left" class="form-box">
        <Row type="flex" align="top" class="row">
          <Col span="5">
            <span class="themeTitle">基本信息</span>
          </Col>
          <Col span="19">
            <FormItem label="推广名称">
              <p>{{ msgInfo.title }}</p>
            </FormItem>
            <FormItem label="投放类型">
              <p v-if="msgInfo.put_type === 'business'">商广</p>
              <p v-else-if="msgInfo.put_type === 'internal'">内推</p>
              <p v-else>--</p>
            </FormItem>
            <FormItem label="投放终端">
              <p v-if="msgInfo.terminal === 'tv'">TV</p>
              <p v-else-if="msgInfo.terminal === 'bx'">冰箱</p>
              <p v-else>--</p>
            </FormItem>
            <FormItem label="推送方式">
              <p v-if="(msgInfo.popul_id * 1) === 1">即时消息</p>
              <p v-else>--</p>
            </FormItem>
            <FormItem label="广告位">
              <p>{{ msgInfo.ad_title }}</p>
            </FormItem>
            <FormItem label="创意模板">
              <p>{{ msgInfo.creative_module_name || '--' }}</p>
            </FormItem>
            <FormItem label="备注">
              <p>{{ msgInfo.remark }}</p>
            </FormItem>
          </Col>
        </Row>

        <Row type="flex" align="top" class="row">
          <Col span="5">
            <span class="themeTitle">配置创意</span>
          </Col>
          <Col span="19">
            <span v-for="(item, index) in customFormCustom" :key="index">
                <!--      字符串      -->
                <FormItem :label="item.name" v-if="item.type === 'string'">
                  <p>{{ formData[item.identification] }}</p>
                </FormItem>
              <!--      数字      -->
                <FormItem :label="item.name" v-if="item.type === 'numeric'">
                  <p>{{ formData[item.identification] }}</p>
                </FormItem>
              <!--      单选      -->
                <FormItem :label="item.name" v-if="item.type === 'single_choice'">
                  <p>{{ custom_fields_name[item.identification] && custom_fields_name[item.identification].toString() }}</p>
                </FormItem>
              <!--      多选      -->
                <FormItem :label="item.name" v-if="item.type === 'multiple_choice'">
                  <p>{{ custom_fields_name[item.identification] && custom_fields_name[item.identification].toString() }}</p>
                </FormItem>
              <!--      日期时间      -->
                <FormItem :label="item.name" v-if="item.type === 'datetime'">
                <!-- 单位，day 天；时 hour；分 minute；秒 second -->
                  <p>{{ formData[item.identification] }}</p>
                </FormItem>
              <!--      图片      -->
                <FormItem :label="item.name" v-if="item.type === 'img'">
                  <img style="width: 140px;cursor:pointer;" :src="formData[item.identification]"
                       v-if="formData[item.identification]"/>
                </FormItem>
              <!--      视频      -->
                <FormItem :label="item.name" v-if="item.type === 'video'">
                  <img style="width: 140px;cursor:pointer;" :src="formData[item.identification]"
                       v-if="formData[item.identification]"/>
                </FormItem>
              <!--      跳转      -->
               <FormItem :label="item.name" v-if="item.type === 'jump'">
                  <div>
                    <span v-for="(li, i) in formData[item.identification]" :key="i" v-if="li !== ''" class="break-all">
                      <span v-if="i !== 'openType' && (li || li === 0 )">-</span>
                      <span v-if="(formData[item.identification].openType === 'web' || formData[item.identification].openType === 'web_fridge') && i === 'openSubType'">{{ formData[item.identification].openSubType }}</span>
                      <span v-else-if="i !== 'openSubType' && i !== 'openType'">{{ li }}</span>
                      <span v-else>{{ custom_fields_name[item.identification][i + 'Name'] }}</span>
                    </span>
                  </div>
                </FormItem>
              </span>
          </Col>
        </Row>
        <Row type="flex" align="top" class="row">
          <Col span="5">
            <span class="themeTitle">投放排期</span>
          </Col>
          <Col span="19">
            <FormItem label="发送时间">
              <p>
                <span v-if="msgInfo.send_type === 1">立即</span>
                <span v-else-if="msgInfo.send_type === 2">定时 &nbsp;&nbsp; {{ msgInfo.set_time }}</span>
              </p>
            </FormItem>
            <FormItem label="消息展示有效期至">
              <p>{{ msgInfo.valid_time }}</p>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="top" class="row">
          <Col span="5">
            <span class="themeTitle">设备定向</span>
          </Col>
           <Col span="19">
             <FormItem label="全部设备" v-if="msgInfo.device_orientation && msgInfo.device_orientation.orientation_type === 'all_device'">
             </FormItem>
             <FormItem label="指定设备" v-else-if="msgInfo.device_orientation && msgInfo.device_orientation.orientation_type === 'sub_device'">
               <span>{{msgInfo.device_orientation.filename}}</span>
             </FormItem>
             <FormItem label="设备分组" v-else-if="msgInfo.device_orientation && msgInfo.device_orientation.orientation_type === 'device_group'">
               <p v-for="group in groupNameList" :key="group.group_id">{{ group.group_name }}</p>
             </FormItem>
          </Col>
        </Row>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Modal>
  </div>
</template>

<script>
import './index.less'
import { reqadList, reqStrategyGroup } from '@/api/ad-push-list'
import { creTurnList } from '@/api/resource-data'
import {
  msgList,
  msgUpdate,
  msgInfo
} from '@/api/msg-list'
import { setSerialNum } from '@/libs/util'
import ContentHeader from '_c/ContentHeader'
import { formatDate } from '@/libs/date'
export default {
  name: 'advertising-management',
  components: {
    ContentHeader
  },
  data () {
    return {
      loading: true,
      spinShow: false,
      formCustom: {
        title: '',
        terminal: '',
        status: ''
      },
      table_columns: [
        {
          title: '序号',
          key: 'number',
          align: 'center',
          tooltip: true,
          width: 80
        },
        {
          title: '发送时间',
          key: 'create_time',
          align: 'center',
          // tooltip: true,
          width: 120
        },
        {
          title: '广告位',
          key: 'ad_title',
          align: 'center',
          tooltip: true,
          minWidth: 120
        },
        {
          title: '名称',
          key: 'title',
          align: 'center',
          tooltip: true,
          minWidth: 120
        },
        {
          title: '状态',
          slot: 'statusName',
          align: 'center',
          tooltip: true,
          width: 120
        },
        {
          title: '实时数据',
          slot: 'once_data',
          align: 'center',
          tooltip: true,
          width: 200
        },
        {
          title: '操作时间',
          key: 'modify_time',
          align: 'center',
          tooltip: true,
          width: 160
        },
        {
          title: '操作人',
          key: 'modify_user',
          align: 'center',
          tooltip: true,
          width: 160
        },
        {
          title: '操作',
          slot: 'operate',
          align: 'center',
          tooltip: true,
          width: 160
        }
      ],
      table_data: [
      ],
      msgList: [],
      statusList: [
        {
          name: '全部',
          id: -1
        },
        {
          name: '待推送',
          id: 0
        },
        {
          name: '已推送',
          id: 1
        },
        {
          name: '已停用',
          id: 2
        },
        {
          name: '推送失败',
          id: 3
        }
      ],
      pageInfo: {},
      searchInfo: {
        title: '',
        ad_id: '',
        status: ''
      },
      msgInfoShow: false,
      msgInfo: {
        title: '',
        creative: {}
      },
      adList: [],
      turnList: [],
      jumpName: {},
      groupNameList: [],
      formData: {},
      customFormCustom: [],
      custom_fields_name: {}
    }
  },
  methods: {
    toPage () {
      this.$router.push({
        path: '/view/msg_management/msg_add'
      })
    },
    edit (id) {
      this.$router.push({
        path: `/view/msg_management/msg_edit#${id}`
      })
    },
    copy (id) {
      this.$router.push({
        path: `/view/msg_management/msg_copy#${id}`
      })
    },
    handleSubmit () {
      this.searchInfo.title = this.formCustom.title
      this.searchInfo.ad_id = this.formCustom.ad_id === '-1' ? '' : this.formCustom.ad_id
      this.searchInfo.status = this.formCustom.status === '' ? -1 : this.formCustom.status
      this.changePage(1)
    },
    changePage (p) {
      this.loading = true
      let params = this.searchInfo
      params.page = p
      msgList(params).then((res) => {
        let data = res.data
        if (data.errno === 10000) {
          this.loading = false
          this.pageInfo.total = data.data.total
          this.pageInfo.page_size = data.data.page_size
          this.pageInfo.current = data.data.page
          let msgList = this.setTerminalNameAndStatusName(data.data.data)
          if (msgList.length) {
            this.table_data = setSerialNum(msgList, this.pageInfo)
          } else {
            this.table_data = []
          }
        } else {
          this.$Modal.warning({
            title: '消息列表获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    setTerminalNameAndStatusName (li) {
      let list = li
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        for (let j = 0; j < this.msgList.length; j++) {
          let terminal = this.msgList[j]
          if (item.terminal === terminal.id) {
            item.terminalName = terminal.name
          }
        }
        for (let k = 0; k < this.statusList.length; k++) {
          let status = this.statusList[k]
          if (item.status === status.id) {
            item.statusName = status.name
          }
        }
        item.create_time = formatDate(item.create_time, true)
        item.modify_time = formatDate(item.modify_time)
      }

      return list
    },
    setUpOrDown (row, status, e) {
      let data = {
        id: row.id,
        status
      }
      msgUpdate(data).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let page = this.pageInfo.current
          this.changePage(page)
        } else if (data.errno === 10039) { // 启动时临近5分钟或者时间已过
          e.target.parentElement.disabled = true
          this.$Modal.warning({
            title: '操作失败',
            content: `原因：该消息发送时间临近或已过，系统无法处理，请重新创建`
          })
        } else {
          this.$Modal.warning({
            title: '操作失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    getDetail (id) {
      let params = {
        id
      }
      this.spinShow = true
      this.msgInfoShow = true
      msgInfo(params).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let terminal = data.data.terminal
          // let strategy = data.data.strategy
          let terminalName = ''
          let strategyName = ''
          for (let i = 0; i < this.msgList.length; i++) {
            let ter = this.msgList[i]
            if (terminal === ter.id) {
              terminalName = ter.name
              break
            }
          }
          this.msgInfo = data.data
          this.formData = this.msgInfo.creative.custom_fields
          // 自定义跳转对应的中文字段
          this.custom_fields_name = (this.msgInfo.creative && this.msgInfo.creative.custom_fields_name) || {}
          this.msgInfo.terminalName = terminalName
          this.msgInfo.strategyName = strategyName
          if (this.msgInfo.send_type === 2) {
            this.msgInfo.set_time = formatDate(this.msgInfo.set_time, true)
          }
          this.msgInfo.valid_time = formatDate(this.msgInfo.valid_time, true)

          // this.jumpName = data.data.creative.jump
          // let openType = this.jumpName.openType
          // let openSubType = this.jumpName.openSubType
          // let turnList = this.turnList.list
          // let subList, item, subItem
          // if (openType) {
          //   for (let i = 0; i < turnList.length; i++) {
          //     item = turnList[i]
          //     if (item.value === openType) {
          //       this.jumpName.openType = item.description
          //       break
          //     }
          //   }
          // }
          // if (openType !== 'none') {
          //   if (openSubType) {
          //     subList = item.list
          //     for (let i = 0; i < subList.length; i++) {
          //       subItem = subList[i]
          //       if (subItem.value === openSubType) {
          //         this.jumpName.openSubType = subItem.description
          //         break
          //       }
          //     }
          //   }
          // }

          if (this.msgInfo.device_orientation.orientation_type === 'device_group') {
            this.groupNameList = []
            const device_type = terminal.toUpperCase()
            const type = device_type ? { device_type } : {}
            reqStrategyGroup(type).then(res => {
              let data = res
              if (data.errno === 10000) {
                let groupList = data.data.list
                let count = 0
                let groupTitle = Object.keys(groupList)
                for (let i = 0; i < groupTitle.length; i++) {
                  let title = groupTitle[i]
                  let group = groupList[title]
                  for (let j = 0; j < group.length; j++) {
                    if (this.msgInfo.device_orientation.front_content.length === count) {
                      return
                    }
                    let item = group[j]
                    if (~this.msgInfo.device_orientation.front_content.indexOf(item.group_id.toString())) {
                      this.groupNameList.push(item)
                      count++
                    }
                  }
                }
              } else {
                throw data.errmsg
              }
            })
          }

          this.customFormCustom = this.msgInfo.creative.module_custom_fields || []
          console.log(this.msgInfo)
        } else {
          this.$Modal.warning({
            title: '查看失败',
            content: `原因：${data.errmsg}`
          })
        }
        this.spinShow = false
      })
    },
    getAdList () {
      let params = {
        ad_space_type: 2
      }
      reqadList(params).then(res => {
        if (res.errno === 10000) {
          let data = res.data
          this.adList = data.data
        } else {
          this.$Modal.warning({
            title: '广告位列表获取失败',
            content: `原因${res.errmsg}`
          })
        }
      })
    },
    async getJumpList () {
      try {
        const res = await creTurnList()
        if (res.data.errno === 10000) {
          this.turnList = res.data.data
        } else {
          throw res.data.errmsg
        }
      } catch (e) {
        throw e
      }
    }
  },
  mounted () {
    this.getJumpList()
    this.getAdList()
    this.handleSubmit()
  }
}
</script>
