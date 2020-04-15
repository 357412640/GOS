<template>
    <div>
      <Header title="投放列表">
        <template slot="btn">
          <div>
            <Button type="primary" class="common-margin-right-20" @click="gotocalender">查看排期</Button>
            <Button type="primary" @click="$router.push({path: 'edit-page', query: {isEdit: false}})">新建投放</Button>
          </div>
        </template>
      </Header>
      <div class="page-common">
        <div class="sel-condition">
          <div class="input-base-style">
            <label>名称</label>
            <Input v-model.trim="params.title" style="width: 200px" class="common-sel-box"/>
          </div>
          <div class="input-base-style">
            <label>广告位</label>
            <Select v-model="params.ad_id" style="width:120px" class="common-sel-box">
              <Option value="">全部</Option>
              <Option v-for="item in addList" :value="item.ad_id" :key="item.ad_id">{{ item.ad_title }}</Option>
            </Select>
          </div>
          <div class="input-base-style">
            <label>投放类型</label>
            <Select v-model="params.put_type" style="width:120px" class="common-sel-box">
              <Option value="">全部</Option>
              <Option value="business">商广</Option>
              <Option value="internal">内推</Option>
            </Select>
          </div>
          <div class="input-base-style">
            <label>状态</label>
            <Select v-model="params.status" style="width:120px" class="common-sel-box">
              <Option v-for="item in statusList" :value="item.code" :key="item.code">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="input-base-style">
            <label>终端</label>
            <Select v-model="terminal" style="width:120px" class="common-sel-box">
              <Option v-for="item in terminalList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="input-base-style search-style">
            <Button type="primary" @click="getSearchData(true)">搜索</Button>
          </div>
        </div>
        <Table stripe :columns="columns" :data="tableData" :loading="loading">
          <template slot-scope="{ row, index }" slot="action">
            <Button
              :type="item.color === 'error' ?  'error' : 'primary'" size="small"
              @click="item.method(row.id, row)"
              :class="['btn-border-none', {'common-right-line': index === 0}]"
              v-for="(item, index) in row.action && row.action.length > 2 ? row.action.slice(0, 1) : row.action"
              :key="index"
              ghost>{{item.name}}</Button>
            <Poptip trigger="hover" v-if="row.action && row.action.length > 2" class="pop-tip-style">
              <div slot="content">
                <Button
                  :type="item.color === 'error' ?  'error' : 'primary'"
                  size="small"
                  v-for="(item, index) in row.action.slice(1)"
                  @click="item.method(row.id, row)"
                  :class="['btn-border-none', {'common-right-line': index !== row.action.slice(1).length - 1}]"
                  :key="index"
                  ghost>{{item.name}}</Button>
              </div>
              <Button
                type="primary" size="small"
                class="btn-border-none common-margin-right-5"
                ghost>更多</Button>
            </Poptip>
          </template>
          <template slot="live_data" slot-scope="{ row }">
            <div>
              <p>曝光：{{row.exposures_num}}</p>
              <p>点击：{{row.clicks_num}}</p>
              <p>点击率：{{row.click_rate}}</p>
            </div>
          </template>
        </Table>
        <div class="page-turing">
          <Page :total="total" @on-change="changePage" :current="params.page" />
        </div>
      </div>
      <Modal title="投放预览" @confirm="getPreview" @cancel="showTVPreview=false" v-if="showTVPreview">
        <template slot="content">
          <Input v-model="mac" type="textarea" :rows="6" placeholder="预览设备的mac列表，多个设备之间使用英文逗" />
        </template>
      </Modal>
      <Modal title="" @confirm="confirmDelete" @cancel="showDelete=false" v-if="showDelete">
        <template slot="content">
          <h3 style="text-align: center">确定删除吗？</h3>
        </template>
      </Modal>
      <put-detail :id="putId" @clearId="showDetail=false" v-if="showDetail"></put-detail>
    </div>
</template>

<script>
import Header from '_c/ContentHeader'
import Modal from '_c/modal-box/confirm'
import { reqList, reqadList, TVPreview, reqDestroy, reqPpdate, reqStatusList } from '@/api/ad-push-list'
import { formatDate } from '@/libs/date'
// import { adPush } from '@/libs/dict'
import PutDetail from './component'

const columns = [
  { type: 'index', title: '序号', width: 80, align: 'center' },
  // { title: '投放类型', minWidth: 100, key: 'put_type_name' },
  { title: '广告位', minWidth: 100, key: 'ad_name' },
  { title: '名称', minWidth: 100, key: 'title' },
  { title: '状态', minWidth: 100, key: 'status_name' },
  { title: '实时数据', minWidth: 150, slot: 'live_data' },
  { title: '操作时间', minWidth: 130, key: 'updated_at_copy' },
  { title: '操作人', minWidth: 120, key: 'operator' },
  {
    title: '操作',
    slot: 'action',
    width: 140,
    align: 'center'
  }
]
export default {
  name: 'list',
  data () {
    return {
      params: {
        page: 1,
        title: '',
        ad_id: '',
        put_type: '',
        status: '-1',
        terminal: ''
      },
      mac: '',
      columns,
      tableData: [],
      addList: [],
      statusList: [],
      pageTurning: {},
      showTVPreview: false,
      showDelete: false,
      showDetail: false,
      putId: '',
      total: 0,
      loading: false,
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
      terminal: ''
    }
  },
  mounted () {
    this.getSearchData()
    this.getAdList()
    this.getStatusList()
  },
  methods: {
    async getStatusList () {
      try {
        const res = await reqStatusList()
        if (res.errno === 10000) {
          this.statusList = res.data.list
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getSearchData (init) {
      try {
        if (init) this.params.page = 1
        this.params.terminal = this.terminal === '-1' ? '' : this.terminal
        this.loading = true
        const res = await reqList(this.params)
        if (res.errno === 10000) {
          this.tableData = res.data.data
          this.total = res.data.total
          // 初始化按钮状态
          this.tableData.forEach(item => {
            // 转换实时数据的展示
            item.exposures_num = item.status === 0 || item.status === 4 ? '' : item.exposures_num
            item.clicks_num = item.status === 0 || item.status === 4 ? '' : item.clicks_num
            item.click_rate = item.status === 0 || item.status === 4 ? '' : (item.click_rate * 100 === 0 ? 0 : Math.round(item.click_rate * 10000) / 100 + '%')
            // 翻译时间和status
            item.updated_at_copy = formatDate(item.updated_at)
            // 根据status初始化按钮
            switch (item.status) {
              case 0:
                item.action = [
                  { name: '编辑', method: this.actionEdit },
                  { name: '上线', method: this.actionOnline },
                  { name: '删除', color: 'error', method: this.actionDelete },
                  { name: '预览', method: this.actionPreview },
                  { name: '复制', method: this.actionCopy },
                  { name: '查看', method: this.actionDetail }
                ]
                break
              case 1:
                item.action = [
                  { name: '上线', method: this.actionOnline },
                  { name: '下线', color: 'error', method: this.actionOffline },
                  { name: '复制', method: this.actionCopy },
                  { name: '查看', method: this.actionDetail },
                  { name: '数据详情', method: this.actionDTDetail }
                ]
                break
              case 2:
              case 6: {
                item.action = [
                  { name: '复制', method: this.actionCopy },
                  { name: '查看', method: this.actionDetail },
                  { name: '数据详情', method: this.actionDTDetail }
                ]
                break
              }
              case 3:
              case 5: {
                item.action = [
                  { name: '暂停', method: this.actionPause },
                  { name: '下线', color: 'error', method: this.actionOffline },
                  { name: '复制', method: this.actionCopy },
                  { name: '查看', method: this.actionDetail },
                  { name: '数据详情', method: this.actionDTDetail }
                ]
                break
              }
              case 4:
                item.action = [
                  { name: '暂停', method: this.actionPause },
                  { name: '下线', color: 'error', method: this.actionOffline },
                  { name: '复制', method: this.actionCopy },
                  { name: '查看', method: this.actionDetail }
                ]
            }
            this.tableData = [...this.tableData]
          })
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      } finally {
        this.loading = false
      }
    },
    async getAdList () {
      try {
        const res = await reqadList({ ad_space_type: 1 })
        if (res.errno === 10000) {
          this.addList = res.data.data
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getPreview () {
      try {
        const res = await TVPreview({ put_ad_id: this.putId, mac: this.mac })
        if (res.errno === 10000) {
          this.showTVPreview = false
          this.$Message.success('保存成功')
          this.getSearchData()
        } else throw res.errmsg
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async confirmDelete () {
      try {
        const res = await reqDestroy({ id: this.putId })
        if (res.errno === 10000) {
          this.$Message.success('删除成功')
          this.showDelete = false
          this.getSearchData()
        } else throw res.errmsg
      } catch (e) {
        console.log(e)
        this.$Message.error(e)
      }
    },
    async changeStatus (id, status) {
      try {
        const res = await reqPpdate({ id, status })
        if (res.errno === 10000) {
          this.$Message.success(`${status === 1 ? '暂停' : status === 2 ? '下线' : '上线'}成功`)
          this.getSearchData()
        } else throw res.errmsg
      } catch (e) {
        this.$Message.error(e)
      }
    },
    changePage (page) {
      this.params.page = page
      this.getSearchData()
    },
    gotocalender () {
      this.$router.push({ path: 'calender-page' })
    },
    async actionCopy (id, params) {
      this.$router.push({ path: 'edit-page', query: { isEdit: true, isCopy: true, id } })
    },
    actionEdit (id) {
      this.$router.push({ path: 'edit-page', query: { isEdit: true, id } })
    },
    actionOnline (id) {
      this.changeStatus(id, 8)
    },
    actionDelete (id) {
      this.putId = id
      this.showDelete = true
    },
    actionPreview (id) {
      this.putId = id
      this.showTVPreview = true
    },
    actionDetail (id) {
      this.putId = id
      this.showDetail = true
    },
    actionOffline (id) {
      this.changeStatus(id, 2)
    },
    actionPause (id) {
      this.changeStatus(id, 1)
    },
    actionDTDetail (id) {
      this.$router.push({ path: 'data-detail', query: { id } })
    }
  },
  components: { Header, Modal, PutDetail }
}
</script>
