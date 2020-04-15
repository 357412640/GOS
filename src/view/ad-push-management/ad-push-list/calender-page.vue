<template>
    <div>
      <Header title="查看排期"></Header>
      <div class="page-common">
        <div class="sel-condition">
          <div class="input-base-style">
            <label>广告位</label>
            <Select v-model="params.ad_id" style="width:170px" class="common-sel-box">
              <Option value="">全部</Option>
              <Option v-for="item in addList" :value="item.ad_id" :key="item.ad_id">{{ item.ad_title }}</Option>
            </Select>
          </div>
          <div class="input-base-style">
            <label>推广名称</label>
            <Input v-model.trim="params.title" style="width: 170px" class="common-sel-box"/>
          </div>
          <div class="input-base-style search-style">
            <Button type="primary" @click="getDatePreview">搜索</Button>
          </div>
        </div>
        <el-calendar v-model="datenow" ref="calender">
          <template
            slot="dateCell"
            slot-scope="{date, data}">
            <p>{{date.getDate()}}</p>
            <div class="schedule-content scrollbar">
              <p @click="getDetail(item.id)"
                 v-for="item in dateDetail[formatDate(date, false, 1)]"
                 :key="item.id"
                 v-if="item.status === 3"
                 class="current"
              >{{item.title}}</p>
            </div>
          </template>
        </el-calendar>
      </div>
      <put-detail :id="detailId" @clearId="clearId" v-if="detailId"></put-detail>
    </div>
</template>

<script>
import Header from '_c/ContentHeader'
import { reqDatePreview, reqadList } from '@/api/ad-push-list'
import { formatDate } from '@/libs/date'
import PutDetail from './component'

export default {
  name: 'callender-page',
  data () {
    return {
      datenow: new Date(),
      dateDetail: {},
      params: {
        ad_id: '',
        title: '',
        start_time: '',
        end_time: ''
      },
      addList: [],
      formatDate,
      detailId: ''
    }
  },
  components: { Header, PutDetail },
  mounted () {
    this.getAdList()
    // 给参数设置时间
    this.setDay()
    this.getDatePreview()
    // 将原按钮的上个月下个月替换为'<'
    this.$refs.calender.$children[0].$el.children[0].innerText = '<'
    this.$refs.calender.$children[0].$el.children[2].innerText = '>'
  },
  watch: {
    datenow () {
      // 当前时间改变，则改变请求时间
      this.setDay()
      this.getDatePreview()
    }
  },
  methods: {
    async getAdList () {
      try {
        const res = await reqadList()
        if (res.errno === 10000) {
          this.addList = res.data.data
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getDatePreview () {
      try {
        const res = await reqDatePreview(this.params)
        if (res.errno === 10000) {
          this.dateDetail = res.data
          console.log('排期数据', this.dateDetail)
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error('排期列表获取失败')
      }
    },
    async getDetail (id) {
      this.detailId = id
    },
    clearId () {
      this.detailId = ''
    },
    setDay () {
      const year = this.datenow.getFullYear()
      const month = this.datenow.getMonth() + 1
      const pre = new Date(`${year}-${month}-01`)
      const next = new Date(`${year}-${month}-28`)
      // 当前月份加减20天，即取三个月数据
      this.params.start_time = formatDate(pre.getTime() - 1728000000, false, 1)
      this.params.end_time = formatDate(next.getTime() + 1728000000, false, 1)
    }
  }
}
</script>

<style scoped lang="less">
.schedule-content{
  overflow: auto;
  height: 80px;
  p{
    font-size: 12px;
    color: #383E4B;
  }
  .current:hover{
    cursor: pointer;
    color: #2d8cf0;
  }
}
</style>
