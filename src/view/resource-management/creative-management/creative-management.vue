<template>
  <div class="creative-management-box">
    <content-header title="创意模板管理">
      <template slot="btn">
        <Button type="primary" @click="toPage">新建模板</Button>
      </template>
    </content-header>
    <div class="search-box">
      <Form ref="formCustom" :model="formCustom" :label-width="80" @submit.native.prevent>
        <Row>
          <Col span="5">
            <FormItem label="名称" :label-width="60">
              <Input type="text" v-model="formCustom.title"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="素材类型">
              <Select v-model="formCustom.material_type">
                <Option value="-1">全部</Option>
                <Option value="img">图片</Option>
                <Option value="video">视频</Option>
                <Option value="msg">消息</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem label="状态" :label-width="60">
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
          <div style="padding: 2px 0;">
            <span>
              <Button type="text" class="c-2D8CF0 operate-btn-common border-right" @click="setUpOrDown(row, 1)"
                      v-if="row.status === 0 || row.status === 2">上线</Button>
              <Button type="text" class="c-E85151 operate-btn-common border-right" @click="setUpOrDown(row, 2)" v-else>下线</Button>
            </span>
            <span v-if="row.status === 0">
              <Poptip trigger="hover" placement="left">
                <Button type="text" class="operate-btn-common c-2D8CF0">更多</Button>
                <div slot="content" class="button-more" ref="popTip">
                  <Button type="text" class="operate-btn-common c-2D8CF0 border-right"
                          @click="getDetail(row.creative_module_id)">查看</Button>
                  <Button type="text" class="operate-btn-common c-2D8CF0 border-right"
                          @click="editCreative(row.creative_module_id)">编辑</Button>
                  <Button type="text" class="operate-btn-common c-2D8CF0" @click="deleteModal(row)">删除</Button>
                </div>
              </Poptip>
            </span>
            <span v-else>
              <Button type="text" class="operate-btn-common c-2D8CF0"
                      @click="getDetail(row.creative_module_id)">查看</Button>
            </span>

          </div>

        </template>
        <template slot-scope="{ row, index }" slot="status">
          <span :class="row.status === 1 ? 'c-30AC52' : ''">{{ row.statusName }}</span>
        </template>
        <template slot-scope="{ row, index }" slot="material_type">
          <span v-if="row.material_type === 'img'">图片</span>
          <span v-else-if="row.material_type === 'video'">视频</span>
          <span v-else-if="row.material_type === 'msg'">消息</span>
          <span v-else>--</span>
        </template>

      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :page-size="pageInfo.page_size" :total="pageInfo.total" :current="pageInfo.current"
                @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <Modal
      :title="creativeDetail.title"
      v-model="creativeShow"
      :footer-hide=true
      :styles="{top: '20px'}"
      :width="800"
      class="creative-detail-box">
      <Form :model="creativeDetail" :label-width="110" @submit.native.prevent label-position="left" class="form-box">
        <Row type="flex" align="top" class="row">
          <Col span="24">
            <FormItem label="模板ID">
              <p>{{ creativeDetail.creative_module_id }}</p>
            </FormItem>
            <FormItem label="说明">
              <p>{{ creativeDetail.description }}</p>
            </FormItem>
            <FormItem label="素材类型">
              <p>{{ creativeDetail.materialName }}</p>
            </FormItem>
            <div v-if="creativeDetail.material_type === 'img'">
              <FormItem label="图片格式">
                <p>{{ creativeDetail.material.suffix }}</p>
              </FormItem>
              <FormItem label="图片尺寸">
                <p>{{ creativeDetail.material.width }} * {{ creativeDetail.material.height }}</p>
              </FormItem>
              <FormItem label="图片大小">
                <p>{{ creativeDetail.conditionName }}{{ creativeDetail.material.size }}M</p>
              </FormItem>
              <FormItem label="是否预下载">
                <p v-if="creativeDetail.pre_download === false">否</p>
                <p v-else-if="creativeDetail.pre_download === true">是，投放前{{ creativeDetail.days }}天预下载</p>
              </FormItem>
            </div>
            <div v-else-if="creativeDetail.material_type === 'video'">
              <FormItem label="视频格式">
                <p>{{ creativeDetail.material.suffix }}</p>
              </FormItem>
              <FormItem label="视频限制">
                <p>{{ creativeDetail.material.restrict }}</p>
              </FormItem>
              <FormItem label="视频大小">
                <p>{{ creativeDetail.conditionName }}{{ creativeDetail.material.size }}M</p>
              </FormItem>
              <FormItem label="视频时长">
                <p>{{ creativeDetail.material.video_duration }}秒</p>
              </FormItem>
              <FormItem label="音频格式">
                <p>{{ creativeDetail.material.voice_type }}</p>
              </FormItem>
              <FormItem label="是否预下载">
                <p v-if="creativeDetail.pre_download === false">否</p>
                <p v-else-if="creativeDetail.pre_download === true">是，投放前{{ creativeDetail.days }}天预下载</p>
              </FormItem>
            </div>
            <div v-else-if="creativeDetail.material_type === 'msg'">
<!--              <FormItem label="标题">-->
<!--                <p>-->
<!--                  <span v-if="creativeDetail.material.is_req_title === '0'">非必填</span>-->
<!--                  <span v-else-if="creativeDetail.material.is_req_title === '1'">必填</span>-->
<!--                  <span style="margin-left: 10px;">最多{{ creativeDetail.material.max_char_title }}字符</span>-->
<!--                </p>-->
<!--              </FormItem>-->
<!--              <FormItem label="详情">-->
<!--                <p>-->
<!--                  <span v-if="creativeDetail.material.is_req_content === '0'">非必填</span>-->
<!--                  <span v-else-if="creativeDetail.material.is_req_content === '1'">必填</span>-->
<!--                  <span style="margin-left: 10px;">最多{{ creativeDetail.material.max_char_content }}字符</span>-->
<!--                </p>-->
<!--              </FormItem>-->
<!--              <FormItem label="图片">-->
<!--                <p>-->
<!--                  <span v-if="creativeDetail.material.is_req_image === '0'">非必填</span>-->
<!--                  <span v-else-if="creativeDetail.material.is_req_image === '1'">必填</span>-->
<!--                </p>-->
<!--              </FormItem>-->
<!--              <FormItem label="图片格式">-->
<!--                <p>{{ creativeDetail.material.suffix }}</p>-->
<!--              </FormItem>-->
<!--              <FormItem label="图片尺寸">-->
<!--                <p>{{ creativeDetail.material.width }} * {{ creativeDetail.material.height }}</p>-->
<!--              </FormItem>-->
<!--              <FormItem label="图片大小">-->
<!--                <p>{{ creativeDetail.conditionName }}{{ creativeDetail.material.size }}M</p>-->
<!--              </FormItem>-->
            </div>
            <FormItem label="上传示例">
              <img style="width: 140px;" :src="creativeDetail.example_img"/>
            </FormItem>

            <FormItem label="自定义字段">
              <Table stripe :columns="customTable" :data="customData" style="margin-top: 20px" >
                <template slot-scope="{ row, index }" slot="operate">
                  <Button type="text" class="operate-btn-common c-2D8CF0 border-right" @click="customDetail(index)">查看
                  </Button>
                </template>
                <template slot-scope="{ row, index }" slot="required">
                  <span v-if="row.required">是</span>
                  <span v-else>否</span>
                </template>
                <template slot-scope="{ row, index }" slot="default">
                  <span>{{ row.subCustom && (row.subCustom.default || row.subCustom.default * 1 === 0) ? row.subCustom.default : '无'}}</span>

                </template>
                <template slot-scope="{ row, index }" slot="type">
                  <span v-if="row.type === 'string'">字符串</span>
                  <span v-else-if="row.type === 'numeric'">数字</span>
                  <span v-else-if="row.type === 'single_choice'">单选</span>
                  <span v-else-if="row.type === 'multiple_choice'">多选</span>
                  <span v-else-if="row.type === 'datetime'">日期时间</span>
                  <span v-else-if="row.type === 'img'">图片</span>
                  <span v-else-if="row.type === 'video'">视频</span>
                  <span v-else-if="row.type === 'jump'">跳转</span>
                  <span v-else>--</span>
                </template>
              </Table>
            </FormItem>


            <FormItem label="关联广告位">
              <p v-for="(ad, index) in ads" :key="index">
                <span style="margin-right: 10px">{{ ad.identification }}</span>
                <span style="margin-right: 10px">{{ ad.terminalName }}</span>
                <span style="margin-right: 10px">{{ ad.title }}</span>
              </p>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Modal>

    <Modal title="删除确认" v-model="deleteShow" :styles="{top: '20px'}" @on-ok="deleteCreative" :loading="deleteLoading">
      <div>
        是否删除 {{ creativeDetail.title }}?
      </div>
    </Modal>

    <Modal
      title="查看字段"
      v-model="customShow"
      :styles="{top: '20px'}"
      :footer-hide="true"
    >
      <Form ref="customFormValidate" :model="customFormCustom" :label-width="80"
            label-position="left" class="form-box">
        <Row>
          <FormItem label="姓名">
            <Input v-model.trim="customFormCustom.name" disabled></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="标识">
            <Input v-model.trim="customFormCustom.identification" disabled></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="类型">
            <Select v-model="customFormCustom.type" disabled>
              <Option v-for="item in customTypeList" :value="item.type" :key="item.type">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="">
              <Checkbox v-model="customFormCustom.required" disabled>必填</Checkbox>
            </FormItem>
          </Col>

        </Row>
        <Row>
          <FormItem label="帮助">
            <Input type="textarea" :rows="4" v-model="customFormCustom.help" disabled></Input>
          </FormItem>
        </Row>

        <!-- 根据不同类型显示不同的设置项 -->
        <!--    字符串    -->
        <div v-if="customType === 'string'">
          <Row>
            <FormItem label="默认值">
              <Input v-model.trim="subCustom.default" placeholder="字段默认值" disabled></Input>
            </FormItem>
            <FormItem label="">
              <Checkbox v-model="customFormCustom.locked" disabled>锁定（预置值，不可改）</Checkbox>
            </FormItem>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="长度" prop="isNumber">
                <Input v-model.trim="subCustom.long_min" disabled></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 5px">
              <FormItem label="到" :label-width="20" prop="isNumber">
                <Input v-model.trim="subCustom.long_max" disabled></Input>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="字符" :label-width="40">
              </FormItem>
            </Col>
          </Row>
        </div>
        <!--    数字    -->
        <div v-else-if="customType === 'numeric'">
          <Row>
            <FormItem label="默认值">
              <Input v-model.trim="subCustom.default" placeholder="字段默认值" disabled></Input>
            </FormItem>
            <FormItem label="">
              <Checkbox v-model="customFormCustom.locked" disabled>锁定（预置值，不可改）</Checkbox>
            </FormItem>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="范围" prop="isNumber">
                <Input v-model.trim="subCustom.long_min" disabled></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 5px">
              <FormItem label="到" :label-width="20" prop="isNumber">
                <Input v-model.trim="subCustom.long_max" disabled></Input>
              </FormItem>
            </Col>
          </Row>
        </div>
        <!--    单选    -->
        <div v-else-if="customType === 'single_choice'">
          <Row v-for="(item, index) in singleChoiceList" :key="index">
            <Col span="10">
              <FormItem :label='"选项"+(index + 1)'>
                <Input v-model="item.value" placeholder="选项名称" disabled></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 5px">
              <FormItem label="" :label-width="20">
                <Input v-model="item.key" placeholder="value" disabled></Input>
              </FormItem>
            </Col>
          </Row>
        </div>
        <!--    多选    -->
        <div v-else-if="customType === 'multiple_choice'">
          <Row v-for="(item, index) in multipleChoiceList" :key="index">
            <Col span="10">
              <FormItem :label='"选项"+(index + 1)'>
                <Input v-model="item.value" placeholder="选项名称" disabled></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 5px">
              <FormItem label="" :label-width="20">
                <Input v-model="item.key" placeholder="value" disabled></Input>
              </FormItem>
            </Col>
          </Row>
        </div>
        <!--    日期时间    -->
        <div v-else-if="customType === 'datetime'">
          <FormItem label="最小时间">
            <Select v-model="subCustom.datetime" disabled>
              <Option v-for="item in datetimeList" :value="item.key" :key="item.key">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <!--    图片    -->
        <div v-else-if="customType === 'img'">
          <FormItem label="图片格式">
            <CheckboxGroup v-model="subCustom.suffix">
              <Checkbox v-for="item in imgSuffixList" :label="item.key" :key="item.key" disabled>{{item.name}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Row>
            <Col span="10">
              <FormItem label="图片尺寸">
                <Input v-model="subCustom.width" disabled></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 10px">
              <FormItem label="x" :label-width="15">
                <Input v-model="subCustom.height" disabled></Input>
              </FormItem>
            </Col>
            <Col span="4" style="padding-left: 5px">
              <FormItem label="px" :label-width="40">
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="图片大小">
                <Select v-model="subCustom.condition" disabled>
                  <Option v-for="item in imgConditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="" :label-width="20">
                <Input v-model="subCustom.size" placeholder="请输入,例:4" disabled></Input>
              </FormItem>
            </Col>
            <Col span="4" style="padding-left: 5px">
              <FormItem label="M" :label-width="40">
              </FormItem>
            </Col>
          </Row>
        </div>
        <!--    视频    -->
        <div v-else-if="customType === 'video'">
          <FormItem label="视频格式">
            <CheckboxGroup v-model="subCustom.suffix">
              <Checkbox v-for="item in videoSuffixList" :label="item.key" :key="item.key" disabled>{{item.name}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Row>
            <Col span="10">
              <FormItem label="分辨率">
                <Input v-model="subCustom.width" disabled></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 10px">
              <FormItem label="x" :label-width="15">
                <Input v-model="subCustom.height" disabled></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="视频大小">
                <Select v-model="subCustom.condition" disabled>
                  <Option v-for="item in videoConditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="" :label-width="20">
                <Input v-model="subCustom.size" placeholder="请输入,例:4" disabled></Input>
              </FormItem>
            </Col>
            <Col span="4" style="padding-left: 5px">
              <FormItem label="M" :label-width="40">
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="视频时长">
                <Select v-model="subCustom.video_duration" disabled>
                  <Option v-for="item in videoDurationList" :value="item.key" :key="item.key">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="秒" style="padding-left: 5px" :label-width="20">
              </FormItem>
            </Col>
          </Row>

        </div>
        <div v-else>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import './index.less'
  import {
    creativeList,
    creativeUpOrDown,
    creativeDetail,
    creativeDelete,
    getCustomList
  } from '@/api/resource-data'

  import {setSerialNum} from '@/libs/util'
  import ContentHeader from '_c/ContentHeader'

  export default {
    name: 'creative-management',
    components: {
      ContentHeader
    },
    data() {
      return {
        loading: true,
        spinShow: true,
        formCustom: {
          title: '',
          status: '',
          material_type: ''
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
            title: '说明',
            key: 'description',
            align: 'center',
            tooltip: true,
            minWidth: 120
          },
          {
            title: '素材类型',
            slot: 'material_type',
            align: 'center',
            tooltip: true,
            width: 140
          },
          {
            title: '状态',
            slot: 'status',
            align: 'center',
            tooltip: true,
            width: 100
          },
          {
            title: '操作人',
            key: 'operator',
            align: 'center',
            tooltip: true,
            width: 140
          },
          {
            title: '操作',
            slot: 'operate',
            align: 'center',
            width: 200
          }
        ],
        table_data: [],
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
        materialTypeList: [
          {
            name: '图片',
            key: 'img'
          },
          {
            name: '视频',
            key: 'video'
          },
          {
            name: '消息',
            key: 'msg'
          }
        ],
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
        pageInfo: {},
        searchInfo: {},
        creativeShow: false,
        creativeDetail: {
          material: ''
        },
        ads: [],
        deleteShow: false,
        deleteId: 0,
        deleteLoading: false,
        // 查看字段
        customFormCustom: {},
        customTypeList: [],
        // 单选参数列表
        singleChoiceList: [],
        // 多选参数列表
        multipleChoiceList: [],
        datetimeList: [
          // day 天；时 hour；分 minute；秒 second；
          {
            name: '天',
            key: 'day'
          },
          {
            name: '时',
            key: 'hour'
          },
          {
            name: '分',
            key: 'minute'
          },
          {
            name: '秒',
            key: 'second'
          }
        ],
        imgSuffixList: [
          {
            name: 'jpg',
            key: 'jpg'
          },
          {
            name: 'png',
            key: 'png'
          },
          {
            name: 'gif',
            key: 'gif'
          },
          {
            name: 'jpeg',
            key: 'jpeg'
          },
          {
            name: 'bmp',
            key: 'bmp'
          },
          {
            name: 'webp',
            key: 'webp'
          }
        ],
        // lte 小于等于，gte 大于等于
        imgConditionList: [
          {
            name: '小于等于',
            key: 'lte'
          },
          {
            name: '大于等于',
            key: 'gte'
          }
        ],
        videoConditionList: [
          {
            name: '小于等于',
            key: 'lte'
          },
          {
            name: '大于等于',
            key: 'gte'
          }
        ],
        videoDurationList: [
          {
            name: '15秒',
            key: '15'
          },
          {
            name: '30秒',
            key: '30'
          },
          {
            name: '45秒',
            key: '45'
          },
          {
            name: '60秒',
            key: '60'
          }
        ],
        videoSuffixList: [
          {
            name: 'mp4',
            key: 'mp4'
          },
          {
            name: 'mkv',
            key: 'mkv'
          },
          {
            name: 'avi',
            key: 'avi'
          },
          {
            name: 'rm',
            key: 'rm'
          },
          {
            name: 'vob',
            key: 'vob'
          }
        ],
        videoVoiceTypeList: [
          {
            name: 'aac',
            key: 'aac'
          },
          {
            name: 'mp3',
            key: 'mp3'
          },
          {
            name: 'wav',
            key: 'wav'
          },
          {
            name: 'wmv',
            key: 'wmv'
          },
          {
            name: 'cda',
            key: 'cda'
          }
        ],
        // 自定义表格数据
        customTable: [
          {
            title: '名称',
            align: 'center',
            key: 'name',
            tooltip: true
          },
          {
            title: '标识',
            align: 'center',
            key: 'identification',
            tooltip: true
          },
          {
            title: '类型',
            align: 'center',
            slot: 'type',
            tooltip: true
          },
          {
            title: '必填',
            align: 'center',
            slot: 'required',
            tooltip: true
          },
          {
            title: '默认值',
            align: 'center',
            slot: 'default' ,
            tooltip: true
          },
          {
            title: '操作',
            align: 'center',
            slot: 'operate'
          }
        ],
        customData: [],
        customType: '',
        customShow: false,
        subCustom: {}
      }
    },
    methods: {
      toPage() {
        this.$router.push({
          path: '/view/resource_management/creative_add'
        })
      },
      handleSubmit() {
        this.searchInfo.title = this.formCustom.title
        this.searchInfo.status = this.formCustom.status === '' || this.formCustom.status === undefined ? -1 : this.formCustom.status
        this.searchInfo.material_type = this.formCustom.material_type === '-1' ? '' : this.formCustom.material_type
        this.changePage(1)
      },
      changePage(p) {
        this.loading = true
        let params = this.searchInfo
        params.page = p
        creativeList(params).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.loading = false
            this.pageInfo.total = data.data.total
            this.pageInfo.page_size = data.data.page_size
            this.pageInfo.current = data.data.page
            let creativeList = this.setStatusName(data.data.data)
            if (creativeList.length) {
              this.table_data = setSerialNum(creativeList, this.pageInfo)
            } else {
              this.table_data = []
            }
          } else {
            this.$Modal.warning({
              title: '创意模板位列表获取失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      },
      setStatusName(li) {
        let list = li
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          for (let k = 0; k < this.statusList.length; k++) {
            let status = this.statusList[k]
            if (item.status === status.id) {
              item.statusName = status.name
            }
          }
        }
        return list
      },
      setUpOrDown(row, status) {
        let data = {
          creative_module_id: row.creative_module_id,
          status
        }
        creativeUpOrDown(data).then(res => {
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
      getDetail(creative_module_id) {
        this.creativeShow = true
        this.spinShow = true
        this.creativeDetail = {
          material: ''
        }
        let params = {
          creative_module_id
        }
        creativeDetail(params).then(res => {
          const data = res.data
          if (data.errno === 10000) {
            this.spinShow = false
            console.log(data.data)
            this.creativeDetail = data.data
            this.creativeDetail.materialName = '--'
            this.creativeDetail.conditionName = '--'
            this.ads = this.setTerminalName(data.data.ads)
            let materialType = this.creativeDetail.material_type
            let conditionType = this.creativeDetail.material.condition
            for (let i = 0; i < this.materialTypeList.length; i++) {
              let material = this.materialTypeList[i]
              if (material.key === materialType) {
                this.creativeDetail.materialName = material.name
                break
              }
            }

            for (let i = 0; i < this.conditionList.length; i++) {
              let condition = this.conditionList[i]
              if (condition.key === conditionType) {
                this.creativeDetail.conditionName = condition.name
                break
              }
            }

            // 自定义字段
            this.customData = this.creativeDetail.custom_fields
            // console.log(this.creativeDetail)
          } else {
            this.$Modal.warning({
              title: '查看失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      },
      setTerminalName(ads) {
        if (ads.length) {
          let newAds = ads
          for (let i = 0; i < newAds.length; i++) {
            let ad = newAds[i]
            if (ad.terminal === 'tv') {
              ad.terminalName = 'TV'
            } else if (ad.terminal === 'fridge') {
              ad.terminalName = '冰箱'
            }
          }
          return newAds
        }
      },
      editCreative(id) {
        this.$router.push({
          path: `/view/resource_management/creative_edit#${id}`
        })
      },
      deleteModal(creative) {
        console.log(creative)
        this.deleteShow = true
        this.creativeDetail.title = creative.title
        this.deleteId = creative.creative_module_id
        this.deleteLoading = true
      },
      deleteCreative() {
        // this.deleteLoading = true
        let data = {
          creative_module_id: this.deleteId
        }
        creativeDelete(data).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.$Message.success('删除成功')
            this.deleteShow = false
            this.changePage(this.pageInfo.current)
          } else {
            this.$Modal.warning({
              title: '删除失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      },
      customDetail(index) {
        this.customShow = true
        let custom = Object.assign({}, this.customData[index])
        this.customFormCustom = custom
        this.subCustom = custom.subCustom
        this.customType = custom.type
        // 单选或者多选需要把创建的选项列表放入子对象中
        if (this.customType === 'single_choice') {
          this.singleChoiceList = this.subCustom.option
        } else if (this.customType === 'multiple_choice') {
          this.multipleChoiceList = this.subCustom.option
        }
      },
      // 自定义类型列表
      customList() {
        getCustomList().then(res => {
          let data = res.data
          if (data.errno === 10000) {
            this.customTypeList = data.data
          } else {
            this.$Modal.warning({
              title: '自定义列表获取失败',
              content: `原因：${data.errmsg}`
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
    },
    mounted() {
      this.changePage(1)
      this.customList()
    }
  }
</script>
