<template>
  <div class="creative-management-box">
    <content-header title="创意管理">
      <template slot="btn">
        <Button type="primary" @click="toPage('/view/ad_push_management/creative_add')">新建创意</Button>
      </template>
    </content-header>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="80" @submit.native.prevent>
        <Row>
          <Col span="6">
            <FormItem label="名称" :label-width="60">
              <Input type="text" v-model="formCustom.title" placeholder="请输入创意名称搜索"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="创意模板" :label-width="80">
              <Select v-model="formCustom.creative_module_id" filterable>
                <Option v-for="item in creativeModuleList" :value="item.creative_module_id" :key="item.creative_module_id">{{ item.title }}</Option>
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
          <Button type="text" class="c-2D8CF0 operate-btn-common border-right" @click="edit(row.id)">编辑</Button>
          <Poptip trigger="hover" placement="left">
            <Button type="text" class="operate-btn-common c-2D8CF0">更多</Button>
            <div slot="content" class="button-more" ref="popTip">
              <Button type="text" class="c-E85151 operate-btn-common border-right" @click="creativeDelete(row.id)">删除</Button>
              <Button type="text" class="c-2D8CF0 operate-btn-common" @click="getDetail(row.id)">查看</Button>
            </div>
          </Poptip>
        </template>
        <template slot-scope="{ row, index }" slot="creative_module_status">
          <div style="position:relative;padding: 10px 0">
            <span class="c-30AC52" v-if="row.creative_module_status === 1">上线</span>
            <div v-else>
              <span>下线</span>
            </div>
            <Tooltip content="该创意的模板已下线，请更新" style="position: absolute;top: 2px;left: 52px;" placement="top" v-if="row.creative_module_status === 2">
              <Icon type="ios-help" style="font-size: 18px;font-weight: 700;color:#aaa;"/>
            </Tooltip>
          </div>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <creative-detail :detailId="detailId" :creativeShow="creativeShow" @on-hide="detailHide"></creative-detail>
  </div>
</template>

<script>
import './index.less'
import { setSerialNum, setSelectAll } from '@/libs/util'
import {
  creList,
  creDelete,
  creativeList
} from '@/api/resource-data'
import ContentHeader from '_c/ContentHeader'
import CreativeDetail from '_c/creative-detail'
export default {
  name: 'list',
  components: {
    ContentHeader,
    CreativeDetail
  },
  data () {
    return {
      loading: true,
      formCustom: {
        title: '',
        creative_module_id: ''
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
          title: '创意名称',
          key: 'title',
          align: 'center',
          tooltip: true,
          minWidth: 120
        },
        {
          title: '创意模板',
          key: 'creative_module_name',
          align: 'center',
          tooltip: true,
          minWidth: 120
        },
        {
          title: '模板状态',
          slot: 'creative_module_status',
          align: 'center',
          tooltip: true,
          width: 120
        },
        {
          title: '操作人',
          key: 'operator',
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
      table_data: [],
      pageInfo: {},
      searchInfo: {},
      creativeShow: false,
      creativeDetail: {},
      detailId: '',
      creativeModuleList: []
    }
  },
  methods: {
    toPage (path) {
      this.$router.push({
        path
      })
    },
    handleSubmit () {
      this.searchInfo.title = this.formCustom.title.trim()
      this.searchInfo.creative_module_id = this.formCustom.creative_module_id === -1 ? '' : this.formCustom.creative_module_id
      this.changePage(1)
    },
    changePage (p) {
      this.loading = true
      let params = this.searchInfo
      params.page = p
      creList(params).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          this.loading = false
          this.pageInfo.total = data.data.total
          this.pageInfo.page_size = data.data.page_size
          this.pageInfo.current = data.data.page
          let creList = data.data.data
          if (creList.length) {
            this.table_data = setSerialNum(creList, this.pageInfo)
          } else {
            this.table_data = []
          }
        } else {
          this.$Modal.warning({
            title: '创意列表获取失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    edit (id) {
      this.toPage(`/view/ad_push_management/creative_edit#${id}`)
    },
    creativeDelete (id) {
      this.$Modal.confirm({
        title: '确定删除吗',
        content: '',
        onOk: () => {
          let data = {
            id
          }
          creDelete(data).then(res => {
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
      this.creativeShow = true
      this.detailId = id
    },
    detailHide () {
      this.creativeShow = false
      this.detailId = ''
    }
  },
  mounted () {
    let params = {
      all: true,
      status: 1
    }
    creativeList(params).then(res => {
      let data = res.data
      if (data.errno === 10000) {
        this.creativeModuleList = setSelectAll(data.data.data, { title: '全部', creative_module_id: -1 })
        this.changePage(1)
      } else {
        this.$Modal.warning({
          title: '创意模板列表获取失败',
          content: `原因：${data.errmsg}`
        })
      }
    })
  }
}
</script>
