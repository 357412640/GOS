<template>
  <div class="advertising-management-box">
    <content-header title="广告位管理">
      <template slot="btn">
        <Button type="primary" @click="toPage">新建广告位</Button>
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
          <Col span="4">
            <FormItem label="广告位类型" :label-width="100">
              <Select v-model="formCustom.ad_space_type">
                <Option :value="0" key="0">全部</Option>
                <Option :value="1" key="1">固定位</Option>
                <Option :value="2" key="2">消息推送</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem label="终端">
              <Select v-model="formCustom.terminal">
                <Option v-for="item in terminalList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem label="状态">
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
          <div v-if="row.status === 0 || row.status === 2">
            <Button type="text" class="c-2D8CF0 border-right operate-btn-common" @click="setUpOrDown(row, 1)" >上线</Button>
            <Poptip trigger="hover" placement="left">
              <Button type="text" class="operate-btn-common c-2D8CF0">更多</Button>
              <div slot="content" class="button-more" ref="popTip">
                <Button type="text" class="c-2D8CF0 operate-btn-common border-right" @click="edit(row.id)">编辑</Button>
                <Button type="text" class="c-E85151 operate-btn-common border-right" @click="adDelete(row.id)">删除</Button>
                <Button type="text" class="c-2D8CF0 operate-btn-common" @click="getDetail(row.id)">查看</Button>
              </div>
            </Poptip>
          </div>
          <div v-else>
            <Button type="text" class="c-E85151 operate-btn-common border-right" @click="setUpOrDown(row, 2)">下线</Button>
            <Poptip trigger="hover" placement="left">
              <Button type="text" class="operate-btn-common c-2D8CF0">更多</Button>
              <div slot="content" class="button-more" ref="popTip">
                <Button type="text" class="c-2D8CF0 operate-btn-common border-right" @click="edit(row.id)">编辑</Button>
                <Button type="text" class="c-2D8CF0 operate-btn-common" @click="getDetail(row.id)">查看</Button>
              </div>
            </Poptip>
          </div>

          <!--@click="editProject(row.id)"-->
        </template>
        <template slot-scope="{ row, index }" slot="status">
          <span :class="row.status === 1 ? 'c-30AC52' : ''">{{ row.statusName }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="ad_space_type">
          <span v-if="row.ad_space_type === 1">固定位</span>
          <span v-else-if="row.ad_space_type === 2">消息推送</span>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <Modal
      :title="adDetail.title"
      v-model="adDetailShow"
      :styles="{top: '20px'}"
      class="ad-detail-box"
      :footer-hide=true
      >
      <Form :model="adDetail" :label-width="80" @submit.native.prevent label-position="left" class="form-box">
        <Row type="flex" align="top" class="row">
          <Col span="5">
            <span class="themeTitle">基本信息</span>
          </Col>
          <Col span="10">
            <FormItem label="广告位ID">
              <p>{{ adDetail.id }}</p>
            </FormItem>
            <FormItem label="投放终端">
              <p>{{ adDetail.terminalName }}</p>
            </FormItem>
            <FormItem label="广告位名称">
              <p>{{ adDetail.title }}</p>
            </FormItem>
            <FormItem label="广告位类型">
              <p v-if="adDetail.ad_space_type === 1">固定位</p>
              <p v-else-if="adDetail.ad_space_type === 2">消息推送</p>
              <p v-else>--</p>
            </FormItem>
            <FormItem label="广告位标识">
              <p>{{ adDetail.identification }}</p>
            </FormItem>
            <FormItem label="说明">
              <p>{{ adDetail.description }}</p>
            </FormItem>
            <FormItem label="上传示例">
              <img style="width: 140px;" :src="adDetail.example_img"/>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="top" class="row">
          <Col span="5">
            <span class="themeTitle">关联模板</span>
          </Col>
          <Col span="19">
            <FormItem label="创意模板">
              <ul>
                <li style="list-style: initial" v-for="item in adDetail.creative_module" :key="item.creative_module_id">
                  {{ item.title }}
                </li>
              </ul>

            </FormItem>
          </Col>
        </Row>
        <Row type="flex" align="top" class="row">
          <Col span="5">
            <span class="themeTitle">配置策略</span>
          </Col>
          <Col span="10">
            <FormItem label="投放策略">
              <p>{{ adDetail.strategyName }}</p>
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
import {
  adList,
  adUpOrDown,
  adDelete,
  adDetail
} from '@/api/resource-data'
import { setSerialNum } from '@/libs/util'
import ContentHeader from '_c/ContentHeader'
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
        status: '',
        ad_space_type: ''
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
          title: '名称',
          key: 'title',
          align: 'center',
          tooltip: true,
          minWidth: 120
        },
        {
          title: '标识',
          key: 'identification',
          align: 'center',
          tooltip: true,
          minWidth: 120
        },
        {
          title: '广告位类型',
          slot: 'ad_space_type',
          align: 'center',
          tooltip: true,
          width: 120
        },
        {
          title: '终端',
          key: 'terminalName',
          align: 'center',
          tooltip: true,
          width: 120
        },
        {
          title: '状态',
          slot: 'status',
          align: 'center',
          tooltip: true,
          width: 120
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
      terminalList: [
        {
          name: '全部',
          id: '-1'
        },
        {
          name: 'TV',
          id: 'tv'
        },
        {
          name: '冰箱',
          id: 'fridge'
        }
      ],
      statusList: [
        {
          name: '全部',
          id: -1
        },
        {
          name: '待上线',
          id: 0
        },
        {
          name: '上线',
          id: 1
        },
        {
          name: '下线',
          id: 2
        }
      ],
      pageInfo: {},
      searchInfo: {},
      adDetailShow: false,
      adDetail: {
        title: ''
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
      ]
    }
  },
  methods: {
    toPage () {
      this.$router.push({
        path: '/view/resource_management/advertising_add'
      })
    },
    edit (id) {
      this.$router.push({
        path: `/view/resource_management/advertising_edit#${id}`
      })
    },
    handleSubmit () {
      this.searchInfo.terminal = this.formCustom.terminal === '-1' ? '' : this.formCustom.terminal
      this.searchInfo.title = this.formCustom.title
      this.searchInfo.ad_space_type = this.formCustom.ad_space_type === '' ? '0' : this.formCustom.ad_space_type
      this.searchInfo.status = this.formCustom.status === '' || this.formCustom.status === undefined ? -1 : this.formCustom.status
      this.changePage(1)
    },
    changePage (p) {
      this.loading = true
      let params = this.searchInfo
      params.page = p
      adList(params).then((res) => {
        let data = res.data
        if (data.errno === 10000) {
          this.loading = false
          this.pageInfo.total = data.data.total
          this.pageInfo.page_size = data.data.page_size
          this.pageInfo.current = data.data.page
          let adList = this.setTerminalNameAndStatusName(data.data.data)
          if (adList.length) {
            this.table_data = setSerialNum(adList, this.pageInfo)
          } else {
            this.table_data = []
          }
        } else {
          this.$Modal.warning({
            title: '广告位列表获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    setTerminalNameAndStatusName (li) {
      let list = li
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        for (let j = 0; j < this.terminalList.length; j++) {
          let terminal = this.terminalList[j]
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
      }
      return list
    },
    setUpOrDown (row, status) {
      let data = {
        id: row.id,
        status
      }
      adUpOrDown(data).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          let page = this.pageInfo.current
          this.changePage(page)
        } else {
          this.$Modal.warning({
            title: '操作失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    adDelete (id) {
      this.$Modal.confirm({
        title: '确定删除吗',
        content: '',
        onOk: () => {
          let data = {
            id
          }
          adDelete(data).then(res => {
            let data = res.data
            if (data.errno === 10000) {
              this.$Message.success('删除成功')
              let page = this.pageInfo.current
              this.changePage(page)
            } else {
              this.$Modal.warning({
                title: '删除失败',
                content: `原因：${data.errmsg}`
              })
            }
          })
        }
      })
    },
    getDetail (id) {
      let params = {
        id
      }
      this.spinShow = true
      this.adDetailShow = true
      this.adDetail = {
        title: ''
      }
      adDetail(params).then(res => {
        this.spinShow = false
        let data = res.data
        if (data.errno === 10000) {
          let terminal = data.data.terminal
          let strategy = data.data.strategy
          let terminalName = ''
          let strategyName = ''
          for (let i = 0; i < this.terminalList.length; i++) {
            let ter = this.terminalList[i]
            if (terminal === ter.id) {
              terminalName = ter.name
              break
            }
          }
          for (let i = 0; i < this.strategyList.length; i++) {
            let str = this.strategyList[i]
            if (strategy === str.key) {
              strategyName = str.name
              break
            }
          }
          this.adDetail = data.data
          this.adDetail.terminalName = terminalName
          this.adDetail.strategyName = strategyName
        } else {
          this.$Modal.warning({
            title: '查看失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    }
  },
  mounted () {
    this.handleSubmit()
  }
}
</script>
