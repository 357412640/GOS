<template>
  <div class="data-detail-box">
    <Header title="数据详情">
      <template slot="btn">
        <div>
          <Button type="primary" class="common-margin-right-20" @click="$router.go(-1)">返回</Button>
        </div>
      </template>
    </Header>
    <div class="content-box">
      <Form :modal="formCustom">
        <Row>
          <Col span="5" style="min-width: 200px; height: 52px">
            <FormItem>
              <DatePicker :value="dateValue" format="yyyy-MM-dd" type="daterange" split-panels
                          placement="bottom-start" class="date-picker" @on-change="changeDate"></DatePicker>
            </FormItem>
          </Col>
          <Col span="2" style="min-width: 100px; height: 52px">
            <FormItem>
              <Select v-model="formCustom.dateType" @on-change="changeSearch" style="height: 34px;">
                <Option v-for="item in dateTypeList" :value="item.value" :key="item.value">{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Tabs :animated="false">
        <TabPane label="趋势">
          <div v-if="noChartData" style="text-align:center;position:relative;">
            <span style="position:absolute;top: 0">暂无数据</span>
          </div>
          <div ref="echartsBox" class="echarts-box" v-else>
          </div>
        </TabPane>
        <TabPane label="概览">
          <Table stripe :columns="tableColumns" :data="tableData" :loading="loading"></Table>
        </TabPane>

      </Tabs>
    </div>
  </div>
</template>
<script>
import Header from '_c/ContentHeader'
import echart from 'echarts'
import { getWeek } from '@/libs/util'
import { getDetail } from '@/api/ad-push-list'

export default {
  name: 'data-detail',
  components: { Header },
  data () {
    return {
      loading: false,
      formCustom: {
        id: this.$route.query.id,
        startTime: '',
        endTime: '',
        dateType: 'day'
      },
      tableColumns: [
        { key: 'date', title: '日期', align: 'center' },
        { key: 'click_num', title: '点击次数', align: 'center' },
        { key: 'click_people_num', title: '点击人数', align: 'center' },
        { key: 'exposure_num', title: '曝光次数', align: 'center' },
        { key: 'exposure_people_num', title: '曝光人数', align: 'center' },
        { key: 'click_rate', title: '点击率', align: 'center' }
      ],
      tableData: [],
      dateValue: [],
      nearWeek: [],
      dateTypeList: [
        {
          title: '按天',
          value: 'day'
        },
        {
          title: '按小时',
          value: 'hour'
        }
      ],
      chart: '',
      chartLineList: {
        click_num: '点击次数',
        click_people_num: '点击人数',
        exposure_num: '曝光次数',
        exposure_people_num: '曝光人数',
        click_rate: '点击率'
      },
      chartOption: {},
      noChartData: false,
      chartDefaultOption: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: `{b} <br/> <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#c23531;"></span>{a0} : {c0} <br/>
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#2f4554;"></span>{a1} : {c1} <br/>
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#61a0a8;"></span>{a2} : {c2} <br/>
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#d48265;"></span>{a3} : {c3} <br/>
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#91c7ae;"></span>{a4} : {c4}%`
        },
        grid: {
          left: '3%',
          right: '5%',
          containLabel: true
        },
        xAxis: {
          // name: '日期',
          type: 'category',
          boundaryGap: false,
          data: ''
        },
        legend: {},
        yAxis: [
          {
            type: 'value'
          },
          {
            max: 100,
            type: 'value',
            axisLabel: {
              formatter: '{value}.00 %'
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 1,
            end: 100
          }
        ],
        color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae']
      }
    }
  },
  methods: {
    changeDate (val) {
      this.dateValue = val
      this.getDetail()
    },
    changeSearch () {
      this.getDetail()
    },
    coverData (data) {
      let xAxisKey = Object.keys(data)
      if (!xAxisKey.length) {
        this.noChartData = true
        return
      }
      let legendKey = xAxisKey.length > 0 ? Object.keys(data[xAxisKey[0]]) : []
      let legendArr = legendKey.reduce((legend, type) => legend.concat(this.chartLineList[type]), [])

      this.chartDefaultOption.xAxis.data = xAxisKey
      this.chartDefaultOption.legend.data = legendArr
      let series = []
      legendKey.forEach(type => {
        let itemData = {}
        itemData.name = this.chartLineList[type]
        itemData.type = 'line'
        itemData.data = []
        if (type === 'click_rate') {
          itemData.yAxisIndex = 1
          xAxisKey.forEach(val => {
            let item = data[val]
            itemData.data.push((item[type] * 100).toFixed(2))
          })
        } else {
          xAxisKey.forEach(val => {
            let item = data[val]
            itemData.data.push(item[type])
          })
        }
        series.push(itemData)
      })
      this.chartOption = {
        series,
        ...this.chartDefaultOption
      }

      let tableData = []
      for (let key in data) {
        let item = data[key]
        item.date = key
        item.click_rate = item.click_rate * 100 + '%'
        tableData.push(item)
      }
      console.log(tableData)
      this.tableData = tableData
    },
    getDetail () {
      this.noChartData = false
      this.chartOption = {}
      this.chart.showLoading && this.chart.showLoading()
      this.loading = true
      this.formCustom.startTime = this.dateValue[0]
      this.formCustom.endTime = this.dateValue[1]
      getDetail(this.formCustom).then(res => {
        let data = res.data
        if (data.errno === 10000) {
          // 按小时需要重构数据
          let newData
          if (this.formCustom.dateType === 'day') {
            newData = data.data
          } else {
            // 重构
            newData = this.setHourData(data.data)
          }
          this.coverData(newData)

          // console.log(this.chartOption)
          if (this.noChartData) {
            this.chart.clear()
          } else {
            this.chart.setOption(this.chartOption)
          }
          this.loading = false
          this.chart.hideLoading && this.chart.hideLoading()
        } else {
          this.$Modal.warning({
            title: '获取详情失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    setHourData (data) {
      let newData = {}
      for (let day in data) {
        for (let hour in data[day]) {
          newData[day + ' ' + hour] = data[day][hour]
        }
      }
      // console.log(newData)
      return newData
    }

  },
  created () {
    const nearWeek = getWeek(0, 6)
    this.dateValue = [nearWeek.startDate, nearWeek.endDate]
    this.nearWeek = [nearWeek.startDate, nearWeek.endDate]
  },
  mounted () {
    this.$nextTick(() => {
      this.chart = echart.init(this.$refs.echartsBox)
    })
    this.getDetail()
  }
}
</script>
<style lang="less" scope>
  .data-detail-box {
    .content-box {
      padding: 20px;

      .date-picker {
        width: 90%;
      }

      .echarts-box {
        height: 500px;
        margin-top: 10px;
      }
    }
  }
</style>
