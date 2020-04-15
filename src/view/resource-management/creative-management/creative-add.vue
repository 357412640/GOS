<template>
  <div class="creative-ad-box">
    <content-header :title="title"></content-header>
    <Form ref="formValidate" :model="formCustom" :label-width="80" @submit.native.prevent label-position="left"
          :rules="ruleValidate" class="form-box">
      <Row>
        <Col span="10">
          <FormItem label="名称" prop="title">
            <Input v-model="formCustom.title"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10">
          <FormItem label="说明" prop="description">
            <Input v-model="formCustom.description" placeholder="非必填项"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="10">
          <FormItem label="素材类型" prop="material_type">
            <Select v-model="formCustom.material_type" @on-change="typeChange">
              <Option v-for="item in materialTypeList" :value="item.key" :key="item.key">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <div v-if="formCustom.material_type === 'img'" :key="canRander">
        <!-- 图片 -->
        <Row type="flex" align="top">
          <Col span="10">
            <FormItem label="图片格式" prop="imgSuffix">
              <CheckboxGroup v-model="imgMaterial.suffixArr">
                <Checkbox :label="item.key" v-for="item in imgSuffixList" :key="item.key">
                  <span>{{ item.name }}</span>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row class="input-left-20">
          <Col span="5">
            <FormItem label="图片尺寸" prop="imgWidth">
              <Input v-model="imgMaterial.width"></Input>
              <span class="input-unit">px</span>
            </FormItem>
          </Col>
          <Col span="1">
            <p style="text-align: center;line-height: 32px">
              <Icon type="ios-close" size="24"/>
            </p>
          </Col>
          <Col span="4">
            <FormItem prop="imgHeight" :label-width="0">
              <Input v-model="imgMaterial.height"></Input>
              <span class="input-unit">px</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="图片大小" prop="imgCondition">
              <Select v-model="imgMaterial.condition">
                <Option v-for="item in videoConditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5" class="input-left-20">
            <FormItem prop="imgSize" :label-width="10">
              <Input v-model="imgMaterial.size" placeholder="请输入数字"></Input>
              <span class="input-unit">M</span>
            </FormItem>
          </Col>
          <Col span="10">
            <p style="line-height: 32px;color: #868E9E;font-size: 12px;">（最大可上传50M）</p>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="是否预下载" prop="pre_download">
              <RadioGroup v-model="formCustom.pre_download" @on-change="preDownloadChange">
                <Radio label='0'>
                  <span>否</span>
                </Radio>
                <Radio label='1'>
                  <span>是</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem prop="days" :label-width="10">
              <Input v-model="formCustom.days" placeholder="投放前预下载天数" :disabled="preDownloadFlag"></Input>
            </FormItem>
          </Col>
        </Row>
      </div>
      <!-- 视频 -->
      <div v-else-if="formCustom.material_type === 'video'" :key="canRander">
        <Row>
          <Col span="10">
            <FormItem label="视频格式" prop="videoSuffix">
              <CheckboxGroup v-model="videoMaterial.suffixArr">
                <Checkbox :label="item.key" v-for="item in videoSuffixList" :key="item.key">
                  <span>{{ item.name }}</span>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10">
            <FormItem label="视频限制" prop="videoRestrict">
              <Input v-model="videoMaterial.restrict"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="视频大小" prop="videoCondition">
              <Select v-model="videoMaterial.condition">
                <Option v-for="item in videoConditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5" class="input-left-20">
            <FormItem prop="videoSize" :label-width="10">
              <Input v-model="videoMaterial.size" placeholder="请输入数字"></Input>
              <span class="input-unit">M</span>
            </FormItem>
          </Col>
          <Col span="10">
            <p style="line-height: 32px;color: #868E9E;font-size: 12px;">（最大可上传50M）</p>
          </Col>
        </Row>
        <Row>
          <Col span="10">
            <FormItem label="视频时长" prop="videoDuration">
              <Select v-model="videoMaterial.video_duration">
                <Option v-for="item in videoDurationList" :value="item.key" :key="item.key">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="10">
            <FormItem label="音频格式" prop="videoVoiceType">
              <CheckboxGroup v-model="videoMaterial.voice_typeArr">
                <Checkbox :label="item.key" v-for="item in videoVoiceTypeList" :key="item.key">
                  <span>{{ item.name }}</span>
                </Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="是否预下载" prop="pre_download">
              <RadioGroup v-model="formCustom.pre_download" @on-change="preDownloadChange">
                <Radio label='0'>
                  <span>否</span>
                </Radio>
                <Radio label='1'>
                  <span>是</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem prop="days" :label-width="10">
              <Input v-model="formCustom.days" placeholder="投放前预下载天数" :disabled="preDownloadFlag"></Input>
            </FormItem>
          </Col>
        </Row>
      </div>
      <!-- 消息 -->
      <!--      <div v-else-if="formCustom.material_type === 'msg'" :key="canRander">-->
      <!--        <Row>-->
      <!--          <Col span="3">-->
      <!--            <FormItem label="标题" prop="msgTitle">-->
      <!--              <RadioGroup v-model="msgMaterial.is_req_title">-->
      <!--                <Radio label='0'>-->
      <!--                  <span>非必填</span>-->
      <!--                </Radio>-->
      <!--                <Radio label='1'>-->
      <!--                  <span>必填</span>-->
      <!--                </Radio>-->
      <!--              </RadioGroup>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--          <Col span="1">-->
      <!--            <p style="line-height: 32px;text-align: center;">最多</p>-->
      <!--          </Col>-->
      <!--          <Col span="2">-->
      <!--            <FormItem prop="msgMaxTitle" :label-width="0">-->
      <!--              <Input v-model.trim="msgMaterial.max_char_title" placeholder="请输入数字"></Input>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--          <Col span="1">-->
      <!--            <p style="line-height: 32px;text-align: center;">字符</p>-->
      <!--          </Col>-->
      <!--        </Row>-->
      <!--        <Row>-->
      <!--          <Col span="3">-->
      <!--            <FormItem label="详情" prop="msgContent">-->
      <!--              <RadioGroup v-model.trim="msgMaterial.is_req_content">-->
      <!--                <Radio label='0'>-->
      <!--                  <span>非必填</span>-->
      <!--                </Radio>-->
      <!--                <Radio label='1'>-->
      <!--                  <span>必填</span>-->
      <!--                </Radio>-->
      <!--              </RadioGroup>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--          <Col span="1">-->
      <!--            <p style="line-height: 32px;text-align: center;">最多</p>-->
      <!--          </Col>-->
      <!--          <Col span="2">-->
      <!--            <FormItem prop="msgMaxContent" :label-width="0">-->
      <!--              <Input v-model.trim="msgMaterial.max_char_content" placeholder="请输入数字"></Input>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--          <Col span="1">-->
      <!--            <p style="line-height: 32px;text-align: center;">字符</p>-->
      <!--          </Col>-->
      <!--        </Row>-->
      <!--        <Row>-->
      <!--          <Col span="10">-->
      <!--            <FormItem label="图片" prop="msgImg">-->
      <!--              <RadioGroup v-model="msgMaterial.is_req_image">-->
      <!--                <Radio label='0'>-->
      <!--                  <span>非必填</span>-->
      <!--                </Radio>-->
      <!--                <Radio label='1'>-->
      <!--                  <span>必填</span>-->
      <!--                </Radio>-->
      <!--              </RadioGroup>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--        </Row>-->
      <!--        <Row type="flex" align="top">-->
      <!--          <Col span="10">-->
      <!--            <FormItem label="图片格式" prop="imgSuffix">-->
      <!--              <CheckboxGroup v-model="msgMaterial.suffixArr">-->
      <!--                <Checkbox :label="item.key" v-for="item in imgSuffixList" :key="item.key">-->
      <!--                  <span>{{ item.name }}</span>-->
      <!--                </Checkbox>-->
      <!--              </CheckboxGroup>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--        </Row>-->
      <!--        <Row class="input-left-20">-->
      <!--          <Col span="5">-->
      <!--            <FormItem label="图片尺寸" prop="imgWidth">-->
      <!--              <Input v-model="msgMaterial.width"></Input>-->
      <!--              <span class="input-unit">px</span>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--          <Col span="1">-->
      <!--            <p style="text-align: center;line-height: 32px">-->
      <!--              <Icon type="ios-close" size="24"/>-->
      <!--            </p>-->
      <!--          </Col>-->
      <!--          <Col span="4">-->
      <!--            <FormItem prop="imgHeight" :label-width="0">-->
      <!--              <Input v-model="msgMaterial.height"></Input>-->
      <!--              <span class="input-unit">px</span>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--        </Row>-->
      <!--        <Row>-->
      <!--          <Col span="5">-->
      <!--            <FormItem label="图片大小" prop="imgCondition">-->
      <!--              <Select v-model="msgMaterial.condition">-->
      <!--                <Option v-for="item in videoConditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>-->
      <!--              </Select>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--          <Col span="5" class="input-left-20">-->
      <!--            <FormItem prop="imgSize" :label-width="10">-->
      <!--              <Input v-model="msgMaterial.size" placeholder="请输入数字"></Input>-->
      <!--              <span class="input-unit">M</span>-->
      <!--            </FormItem>-->
      <!--          </Col>-->
      <!--          <Col span="10">-->
      <!--            <p style="line-height: 32px;color: #868E9E;font-size: 12px;">（最大可上传50M）</p>-->
      <!--          </Col>-->
      <!--        </Row>-->
      <!--      </div>-->

      <Row>
        <Col span="10">
          <FormItem label="示例" prop="example_img">
            <Upload
              :action="uploadUrl + '/uploadFdfs'"
              :format="['png','jpg','jpeg','gif','bmp']"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess"
              :show-upload-list="false"
              name="uploadfile">
              <img style="width: 140px;cursor:pointer;" :src="formCustom.example_img" v-if="formCustom.example_img"/>
              <div
                style="width: 80px;height:80px;line-height: 80px;color: rgba(0,0,0,0.3); background-color: rgba(200,200,200,0.1);cursor: pointer;text-align: center;position: relative;"
                v-else>
                <Icon type="md-add" size="45" v-if="!uploadSpinShow"/>
                <Spin fix v-else></Spin>
              </div>
            </Upload>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="自定义字段">
            <Button type="primary" @click="addCustom" ghost>+ 新建字段</Button>
            <Table stripe :columns="customTable" :data="customData" style="margin-top: 20px">
              <template slot-scope="{ row, index }" slot="operate">
                <Button type="text" class="operate-btn-common c-2D8CF0 border-right" @click="customEdit(index)">编辑
                </Button>
                <Button type="text" class="operate-btn-common c-2D8CF0 border-right" @click="customDelete(index)">删除
                </Button>
              </template>
              <template slot-scope="{ row, index }" slot="required">
                <span v-if="row.required">是</span>
                <span v-else>否</span>
              </template>
              <template slot-scope="{ row, index }" slot="default">
                <span>{{(row.subCustom.default || row.subCustom.default * 1 === 0) ? row.subCustom.default : '无'}}</span>
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
    <span v-if="customShow">
      <Modal
        :title="customTitle"
        v-model="customShow"
        :styles="{top: '20px'}"
        @on-cancel="customCancel">
      <div slot="footer">
        <Button size="large" @click="customCancel">取消</Button>
        <Button type="primary" size="large" @click="customSave">保存</Button>
      </div>
      <Form ref="customFormValidate" :model="customFormCustom" :label-width="80" @submit.native.prevent
            label-position="left" :key="123"
            :rules="customRuleValidate" class="form-box">
        <Row>
          <FormItem label="名称" prop="name">
            <Input v-model.trim="customFormCustom.name"></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="标识" prop="identification">
            <Input v-model.trim="customFormCustom.identification"></Input>
          </FormItem>
        </Row>
        <Row>
          <FormItem label="类型" prop="type">
            <Select v-model="customFormCustom.type" @on-change="customTypeChange">
              <Option v-for="item in customTypeList" :value="item.type" :key="item.type">{{item.name}}</Option>
            </Select>
          </FormItem>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="">
              <Checkbox v-model="customFormCustom.required">必填</Checkbox>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label="帮助">
            <Input type="textarea" :rows="4" v-model="customFormCustom.help"></Input>
          </FormItem>
        </Row>

        <!-- 根据不同类型显示不同的设置项 -->
        <!--    字符串    -->
        <div v-if="customType === 'string'">
          <Row>
            <FormItem label="默认值">
              <Input v-model.trim="subCustom.default" placeholder="字段默认值"></Input>
            </FormItem>
            <FormItem label="">
              <Checkbox v-model="customFormCustom.locked">锁定（预置值，不可改）</Checkbox>
            </FormItem>
          </Row>
          <Row>
            <Col span="11">
              <FormItem label="长度" prop="numberMin">
                <Input v-model.trim="subCustom.long_min" @on-blur="blurMin"></Input>
              </FormItem>
            </Col>
            <Col span="9" style="padding-left: 5px">
              <FormItem label="到" :label-width="20" prop="numberMax">
                <Input v-model.trim="subCustom.long_max" @on-blur="blurMax"></Input>
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
            <FormItem label="默认值" prop="isNumber">
              <Input v-model.trim="subCustom.default" placeholder="字段默认值"></Input>
            </FormItem>
            <FormItem label="">
              <Checkbox v-model="customFormCustom.locked">锁定（预置值，不可改）</Checkbox>
            </FormItem>
          </Row>
          <Row>
            <Col span="11">
              <FormItem label="范围" prop="numberMin">
                <Input v-model.trim="subCustom.long_min" @on-blur="blurMin"></Input>
              </FormItem>
            </Col>
            <Col span="9" style="padding-left: 5px">
              <FormItem label="到" :label-width="20" prop="numberMax">
                <Input v-model.trim="subCustom.long_max" @on-blur="blurMax"></Input>
              </FormItem>
            </Col>
          </Row>
        </div>
        <!--    单选    -->
        <div v-else-if="customType === 'single_choice'">
          <Row v-for="(item, index) in customFormCustom.singleChoiceList" :key="index">
            <Col span="10">
              <FormItem :label='"选项"+(index + 1)'
                        :prop="'singleChoiceList.' + index + '.value'"
                        :rules="{ validator: (rule, value, callback) => {singleValue(rule, value, callback)}, trigger: 'blur'}">
                <Input v-model.trim="item.value" placeholder="选项名称"></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 5px">
              <FormItem label="" :label-width="20"
                        :prop="'singleChoiceList.' + index + '.key'"
                        :rules="{ validator: (rule, value, callback) => {singleKey(rule, value, callback, index)}, trigger: 'blur'}">
                <Input v-model.trim="item.key" placeholder="value"></Input>
              </FormItem>
            </Col>
            <Col span="4">
              <Icon type="ios-trash-outline" @click="deleteSingle(index)"
                    style="line-height: 32px;margin-left: 10px;color: #ed4014;font-size: 20px;cursor:pointer;"/>
            </Col>
          </Row>
          <FormItem label="">
            <Button type="primary" ghost @click="addSingle">+ 添加选项</Button>
          </FormItem>
        </div>
        <!--    多选    -->
        <div v-else-if="customType === 'multiple_choice'">
          <Row v-for="(item, index) in customFormCustom.multipleChoiceList" :key="index">
            <Col span="10">
              <FormItem :label='"选项"+(index + 1)'
                        :prop="'multipleChoiceList.' + index + '.value'"
                        :rules="{ validator: (rule, value, callback) => {multipleValue(rule, value, callback)}, trigger: 'blur'}">
                <Input v-model.trim="item.value" placeholder="选项名称"></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 5px">
              <FormItem label="" :label-width="20"
                        :prop="'multipleChoiceList.' + index + '.key'"
                        :rules="{ validator: (rule, value, callback) => {multipleKey(rule, value, callback, index)}, trigger: 'blur'}">
                <Input v-model.trim="item.key" placeholder="value"></Input>
              </FormItem>
            </Col>
            <Col span="4">
              <Icon type="ios-trash-outline" @click="deleteMultiple(index)"
                    style="line-height: 32px;margin-left: 10px;color: #ed4014;font-size: 20px;cursor:pointer;"/>
            </Col>
          </Row>
          <FormItem label="">
            <Button type="primary" ghost @click="addMultiple">+ 添加选项</Button>
          </FormItem>
        </div>
        <!--    日期时间    -->
        <div v-else-if="customType === 'datetime'">
          <FormItem label="最小时间">
            <Select v-model="subCustom.datetime">
              <Option v-for="item in datetimeList" :value="item.key" :key="item.key">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </div>
        <!--    图片    -->
        <div v-else-if="customType === 'img'">
          <FormItem label="图片格式">
            <CheckboxGroup v-model="subCustom.suffix">
              <Checkbox v-for="item in imgSuffixList" :label="item.key" :key="item.key">{{item.name}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Row>
            <Col span="10">
              <FormItem label="图片尺寸">
                <Input v-model="subCustom.width"></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 10px">
              <FormItem label="x" :label-width="15">
                <Input v-model="subCustom.height"></Input>
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
                <Select v-model="subCustom.condition">
                  <Option v-for="item in imgConditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="" :label-width="20">
                <Input v-model="subCustom.size" placeholder="请输入,例:4"></Input>
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
              <Checkbox v-for="item in videoSuffixList" :label="item.key" :key="item.key">{{item.name}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Row>
            <Col span="10">
              <FormItem label="分辨率">
                <Input v-model="subCustom.width"></Input>
              </FormItem>
            </Col>
            <Col span="10" style="padding-left: 10px">
              <FormItem label="x" :label-width="15">
                <Input v-model="subCustom.height"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem label="视频大小">
                <Select v-model="subCustom.condition">
                  <Option v-for="item in videoConditionList" :value="item.key" :key="item.key">{{ item.name }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem label="" :label-width="20">
                <Input v-model="subCustom.size" placeholder="请输入,例:4"></Input>
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
                <Select v-model="subCustom.video_duration">
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
    </span>
  </div>
</template>

<script>
import './index.less'
import { creativeSave, creativeDetail, getCustomList } from '@/api/resource-data'
import ContentHeader from '_c/ContentHeader'
import { deepClone } from '@/libs/util'

export default {
  name: 'creative-add',
  components: {
    ContentHeader
  },
  data () {
    return {
      title: '新建模板',
      uploadSpinShow: false,
      uploadUrl: 'http://api.scloud.gome.inc/uploadfile',
      formCustom: {
        title: '',
        material_type: 'img',
        material: {
          width: '',
          height: '',
          size: '',
          video_duration: '',
          condition: '',
          suffix: '',
          restrict: '',
          voice_type: ''
        },
        pre_download: '0',
        example_img: ''
      },
      canRander: false,
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
        material_type: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.material_type) {
                callback(new Error('请选择素材类型'))
              } else {
                callback()
              }
            }
          }
        ],
        imgSuffix: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'img') {
                if (!this.imgMaterial.suffixArr.length) {
                  callback(new Error('请选择图片格式'))
                } else {
                  callback()
                }
              }
              // else if (this.formCustom.material_type === 'msg') {
              //   if (!this.msgMaterial.suffixArr.length) {
              //     callback(new Error('请选择图片格式'))
              //   } else {
              //     callback()
              //   }
              // }
              else {
                callback()
              }
            }
          }
        ],
        imgWidth: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'img') {
                if (!this.imgMaterial.width.trim()) {
                  callback(new Error('图片宽不能为空'))
                } else if (!/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([1-9]*[1-9][0-9]*))$/.test(this.imgMaterial.width)) {
                  callback(new Error('请输入大于0的数字'))
                } else {
                  callback()
                }
              }
              // else if (this.formCustom.material_type === 'msg') {
              //   if (!this.msgMaterial.width.trim()) {
              //     callback(new Error('图片宽不能为空'))
              //   } else if (!/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([1-9]*[1-9][0-9]*))$/.test(this.msgMaterial.width)) {
              //     callback(new Error('请输入大于0的数字'))
              //   } else {
              //     callback()
              //   }
              // }
              else {
                callback()
              }
            }
          }
        ],
        imgHeight: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'img') {
                if (!this.imgMaterial.height.trim()) {
                  callback(new Error('图片高不能为空'))
                } else if (!(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([1-9]*[1-9][0-9]*))$/).test(this.imgMaterial.height)) {
                  callback(new Error('请输入大于0的数字'))
                } else {
                  callback()
                }
              }
              // else if (this.formCustom.material_type === 'msg') {
              //   if (!this.msgMaterial.height.trim()) {
              //     callback(new Error('图片高不能为空'))
              //   } else if (!(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([1-9]*[1-9][0-9]*))$/).test(this.msgMaterial.height)) {
              //     callback(new Error('请输入大于0的数字'))
              //   } else {
              //     callback()
              //   }
              // }
              else {
                callback()
              }
            }
          }
        ],
        imgCondition: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'img') {
                if (!this.imgMaterial.condition) {
                  callback(new Error('请选择图片大小'))
                } else {
                  callback()
                }
              }
              // else if (this.formCustom.material_type === 'msg') {
              //   if (!this.msgMaterial.condition) {
              //     callback(new Error('请选择图片大小'))
              //   } else {
              //     callback()
              //   }
              // }
              else {
                callback()
              }
            }
          }
        ],
        imgSize: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'img') {
                if (!this.imgMaterial.size.trim()) {
                  callback(new Error('图片大小不能为空'))
                } else if (/^[5][1-9]|[6-9]\d{1}|\d{3,}$/.test(this.imgMaterial.size)) {
                  callback(new Error('文件大小不能超过50M'))
                } else {
                  callback()
                }
              }
              // else if (this.formCustom.material_type === 'msg') {
              //   if (!this.msgMaterial.size.trim()) {
              //     callback(new Error('图片大小不能为空'))
              //   } else if (/^[5][1-9]|[6-9]\d{1}|\d{3,}$/.test(this.msgMaterial.size)) {
              //     callback(new Error('文件大小不能超过50M'))
              //   } else {
              //     callback()
              //   }
              // }
              else {
                callback()
              }
            }
          }
        ],
        videoSuffix: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'video') {
                if (!this.videoMaterial.suffixArr.length) {
                  callback(new Error('请选择视频格式'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        videoRestrict: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'video') {
                if (!this.videoMaterial.restrict.trim()) {
                  callback(new Error('视频限制不能为空'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        videoCondition: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'video') {
                if (!this.videoMaterial.condition) {
                  callback(new Error('请选择视频大小'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        videoSize: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'video') {
                if (!this.videoMaterial.size) {
                  callback(new Error('视频大小不能为空'))
                } else if (/^[5][1-9]|[6-9]\d{1}|\d{3,}$/.test(this.videoMaterial.size)) {
                  callback(new Error('文件大小不能超过50M'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        videoDuration: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'video') {
                if (!this.videoMaterial.video_duration) {
                  callback(new Error('请选择视频时长'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        videoVoiceType: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.material_type === 'video') {
                if (!this.videoMaterial.voice_typeArr.length) {
                  callback(new Error('请选择音频类型'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        pre_download: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.pre_download) {
                callback(new Error('请选择是否预下载'))
              } else {
                callback()
              }
            }
          }
        ],
        days: [
          {
            validator: (rule, val, callback) => {
              if (this.formCustom.pre_download === '1') {
                if (!this.formCustom.days) {
                  callback(new Error('预下载天数不能为空'))
                } else if (!(/^[0-9]*[1-9][0-9]*$/.test(this.formCustom.days))) {
                  callback(new Error('请输入正整数'))
                } else if (this.formCustom.days > 10) {
                  callback(new Error('请输入不大于10的正整数'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            }
          }
        ],
        example_img: [
          {
            validator: (rule, val, callback) => {
              if (!this.formCustom.example_img.trim()) {
                callback(new Error('请上传示例'))
              } else {
                callback()
              }
            }
          }
        ]
        // msgMaxTitle: [
        //   {
        //     validator: (rule, val, callback) => {
        //       if (!/^[1-9]([0-9])*$/.test(this.msgMaterial.max_char_title)) {
        //         callback(new Error('请输入正整数'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // ],
        // msgMaxContent: [
        //   {
        //     validator: (rule, val, callback) => {
        //       if (!/^[1-9]([0-9])*$/.test(this.msgMaterial.max_char_content)) {
        //         callback(new Error('请输入正整数'))
        //       } else {
        //         callback()
        //       }
        //     }
        //   }
        // ]

      },
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
      imgMaterial: {
        width: '', // 宽
        height: '', // 高
        size: '', // 大小，单位 M
        condition: '', // lte 小于等于，gte 大于等于
        suffix: '', // 图片格式字符串
        suffixArr: [] // 图片格式，jpg、png、gif、jpeg、bmp
      },
      videoMaterial: {
        width: '', // 宽
        height: '', // 高
        size: '', // 大小，单位 M
        video_duration: '', // 视频时长，单位 s
        condition: '', // lte 小于等于，gte 大于等于
        suffix: '', // 视频格式字符串
        suffixArr: [], // 视频格式，mp4、mkv、avi、rm、vob
        restrict: '', // 限定说明
        voice_type: '', // 音频格式字符串
        voice_typeArr: [] // 音频格式，aac、mp3、wav、wmv、cda
      },
      // msgMaterial: {
      //   is_req_title: '0', // 标题必填（0 否 1 是）
      //   max_char_title: '', // 标题最多字符数
      //   is_req_content: '0', // 详情必填（0 否 1 是）
      //   max_char_content: '', // 详情最多字符数
      //   is_req_image: '0', // 图片必传（0 否 1 是）
      //   width: '', // 宽
      //   height: '', // 高
      //   size: '', // 大小，单位 M
      //   condition: '', // lte 小于等于，gte 大于等于
      //   suffix: '', // 图片格式，jpg、png、gif、jpeg、bmp
      //   suffixArr: []
      // },
      preDownloadFlag: true,
      // 自定义表格数据
      customTable: [
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '标识',
          align: 'center',
          key: 'identification'
        },
        {
          title: '类型',
          align: 'center',
          slot: 'type'
        },
        {
          title: '必填',
          align: 'center',
          slot: 'required'
        },
        {
          title: '默认值',
          align: 'center',
          slot: 'default'
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operate'
        }
      ],
      customData: [],
      customTitle: '新建自定义字段',
      // 自定义字段弹窗
      customShow: false,
      // 自定义字段校验
      customRuleValidate: {
        name: [
          {
            validator: (rule, val, callback) => {
              if (!this.customFormCustom.name) {
                callback(new Error('名称不能为空'))
              } else {
                callback()
              }
            }
          }
        ],
        identification: [
          {
            validator: (rule, val, callback) => {
              console.log(this.customData)
              if (!this.customFormCustom.identification) {
                callback(new Error('标识不能为空'))
              } else {
                // 1如果是 编辑页 并且 标识与编辑相同，则不校验
                if (this.customPage === 'edit' && this.customFormCustom.identification === this.identificationValue) {
                  callback()
                } else {
                  let flag = false
                  // 标识不能重复
                  let usedArr =
                      // 创意
                      ['id', 'title', 'creative_module_id', 'material', 'material_verify', 'material_preview', 'jump',
                        // 消息
                        'put_type', 'terminal', 'ad_id', 'creative_module_id', 'popul_id', 'remark', 'send_type', 'set_time', 'valid_time',
                        'creative', 'device_orientation']
                  if (~usedArr.indexOf(this.customFormCustom.identification)) {
                    callback(new Error('标识已被固定字段占用，请修改'))
                  } else {
                    for (let i = 0; i < this.customData.length; i++) {
                      let custom = this.customData[i]
                      if (custom.identification === this.customFormCustom.identification) {
                        flag = true
                      }
                    }
                    if (flag) {
                      callback(new Error('标识已被使用'))
                    } else {
                      callback()
                    }
                  }
                }
              }
            }
          }
        ],
        type: [
          {
            validator: (rule, val, callback) => {
              if (!this.customFormCustom.type) {
                callback(new Error('类型不能为空'))
              } else {
                callback()
              }
            }
          }
        ],
        numberMin: [
          {
            validator: (rule, val, callback) => {
              let value = this.subCustom.long_min
              let otherValue = this.subCustom.long_max
              if (otherValue && !value) {
                callback(new Error('请填写完整'))
              } else if (this.customFormCustom.type === 'numeric') {
                if (!value) {
                  callback()
                } else if ((/^(\-|\+)?\d+(\.\d+)?$/).test(value)) {
                  if (value && otherValue && value > otherValue) {
                    callback(new Error('范围错误'))
                  } else {
                    callback()
                  }
                } else {
                  callback(new Error('请输入数字'))
                }
              } else {
                if (!value) {
                  callback()
                } else if (/^(0|[1-9][0-9]*)$/.test(value)) {
                  if (value && otherValue && value > otherValue) {
                    callback(new Error('范围错误'))
                  } else {
                    callback()
                  }
                } else {
                  callback(new Error('请输入不小于0的整数'))
                }
              }
            },
            trigger: 'blur'
          }
        ],
        numberMax: [
          {
            validator: (rule, val, callback) => {
              let value = this.subCustom.long_max
              let otherValue = this.subCustom.long_min
              if (otherValue && !value) {
                callback(new Error('请填写完整'))
              } else if (this.customFormCustom.type === 'numeric') {
              //
                if (!value) {
                  callback()
                } else if ((/^(\-|\+)?\d+(\.\d+)?$/).test(value)) {
                  if (value && otherValue && value < otherValue) {
                    callback(new Error('范围错误'))
                  } else {
                    callback()
                  }
                } else {
                  callback(new Error('请输入数字'))
                }
              } else {
                if (!value) {
                  callback()
                } else if (/^(0|[1-9][0-9]*)$/.test(value)) {
                  if (value && otherValue && value < otherValue) {
                    callback(new Error('范围错误'))
                  } else {
                    callback()
                  }
                } else {
                  callback(new Error('请输入不小于0的整数'))
                }
              }
            },
            trigger: 'blur'
          }
        ],
        isNumber: [
          {
            validator: (rule, val, callback) => {
              let value = this.subCustom.default
              if (this.customFormCustom.type === 'numeric') {
                if (!value) {
                  callback()
                } else if ((/^(\-|\+)?\d+(\.\d+)?$/).test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入数字'))
                }
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      customFormCustom: {
        name: '',
        identification: '',
        type: '',
        required: false,
        locked: false,
        help: '',
        // 单选参数列表
        singleChoiceList: [
          {
            key: '',
            value: ''
          }
        ],
        // 多选参数列表
        multipleChoiceList: [
          {
            key: '',
            value: ''
          }
        ]
      },
      // 根据类型不同，需填写的字段不同
      subCustom: {},
      customTypeList: [],
      customType: '',
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
      customEditIndex: -1,
      isCustomEdited: false,
      identificationValue: '',
      customPage: ''
    }
  },
  methods: {
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
        this.$forceUpdate()
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
      this.$refs[name].validate((valid) => {
        if (valid) {
          let data = this.formCustom
          if (data.material_type === 'img') {
            this.imgMaterial.suffix = this.imgMaterial.suffixArr.join(',')
            data.material = this.imgMaterial
          } else if (data.material_type === 'video') {
            this.videoMaterial.suffix = this.videoMaterial.suffixArr.join(',')
            this.videoMaterial.voice_type = this.videoMaterial.voice_typeArr.join(',')
            data.material = this.videoMaterial
          } else if (data.material_type === 'msg') {
            // this.msgMaterial.suffix = this.msgMaterial.suffixArr.join(',')
            // data.material = this.msgMaterial
          }
          data.material = JSON.stringify(data.material)

          // 自定义字段
          data.custom_fields = JSON.stringify(this.customData)

          creativeSave(data).then(res => {
            let data = res.data
            if (data.errno === 10000) {
              this.$Message.success('保存成功')
              this.$router.push({
                path: '/view/resource_management/creative_module_management'
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
    preDownloadChange () {
      if (this.formCustom.pre_download && this.formCustom.pre_download === '1') {
        this.preDownloadFlag = false
      } else {
        this.formCustom.days = ''
        this.preDownloadFlag = true
      }
    },
    checkRule (propName) {
      this.$refs['formValidate'].validateField(propName)
    },
    typeChange (type) {
      let formCustom = deepClone(this.formCustom)
      this.$refs['formValidate'].resetFields()
      this.formCustom = formCustom
      if (type === 'img') {
        this.imgMaterial = {
          width: '', // 宽
          height: '', // 高
          size: '', // 大小，单位 M
          condition: '', // lte 小于等于，gte 大于等于
          suffix: '', // 图片格式字符串
          suffixArr: [] // 图片格式，jpg、png、gif、jpeg、bmp
        }
      } else if (type === 'video') {
        this.videoMaterial = {
          width: '', // 宽
          height: '', // 高
          size: '', // 大小，单位 M
          video_duration: '', // 视频时长，单位 s
          condition: '', // lte 小于等于，gte 大于等于
          suffix: '', // 视频格式字符串
          suffixArr: [], // 视频格式，mp4、mkv、avi、rm、vob
          restrict: '', // 限定说明
          voice_type: '', // 音频格式字符串
          voice_typeArr: [] // 音频格式，aac、mp3、wav、wmv、cda
        }
      } else if (type === 'msg') {
        // this.msgMaterial = {
        //   is_req_title: '0', // 标题必填（0 否 1 是）
        //   max_char_title: '', // 标题最多字符数
        //   is_req_content: '0', // 详情必填（0 否 1 是）
        //   max_char_content: '', // 详情最多字符数
        //   is_req_image: '0', // 图片必传（0 否 1 是）
        //   width: '', // 宽
        //   height: '', // 高
        //   size: '', // 大小，单位 M
        //   condition: '', // lte 小于等于，gte 大于等于
        //   suffix: '', // 图片格式，jpg、png、gif、jpeg、bmp
        //   suffixArr: []
        // }
      }
    },
    // 自定义字段 新建
    addCustom () {
      this.customShow = true
      this.customTitle = '新建自定义字段'
      this.customPage = ''
      this.customEditIndex = -1
      this.isCustomEdited = false
    },
    // 自定义字段 编辑
    customEdit (index) {
      this.customPage = 'edit'
      this.customEditIndex = index
      this.isCustomEdited = true
      this.customShow = true
      this.customTitle = '编辑自定义字段'
      let custom = deepClone(this.customData[index])
      this.customFormCustom = custom
      this.subCustom = custom.subCustom
      this.customType = custom.type
      this.identificationValue = custom.identification
      // 单选或者多选需要把创建的选项列表放入子对象中
      if (this.customType === 'single_choice') {
        this.customFormCustom.singleChoiceList = this.subCustom.option
      } else if (this.customType === 'multiple_choice') {
        this.customFormCustom.multipleChoiceList = this.subCustom.option
      }
    },
    // 自定义字段 删除
    customDelete (index) {
      this.$Modal.warning({
        title: '删除确认',
        content: '确认删除该字段？',
        onOk: () => {
          this.customData.splice(index, 1)
        }
      })
    },
    customList () {
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
    // 自定义类型修改时，动态修改需要填的内容
    customTypeChange (type) {
      this.customType = type
      this.subCustom = {}
      // 单选参数列表
      this.customFormCustom.singleChoiceList = [
        {
          key: '',
          value: ''
        }
      ]
      // 多选参数列表
      this.customFormCustom.multipleChoiceList = [
        {
          key: '',
          value: ''
        }
      ]
    },
    addSingle () {
      if (this.customFormCustom.singleChoiceList.length < 20) {
        this.customFormCustom.singleChoiceList.push({
          key: '',
          value: ''
        })
      } else {
        this.$Message.warning('最多添加20个')
      }
    },
    deleteSingle (index) {
      this.customFormCustom.singleChoiceList.splice(index, 1)
    },

    addMultiple () {
      if (this.customFormCustom.multipleChoiceList.length < 20) {
        this.customFormCustom.multipleChoiceList.push({
          key: '',
          value: ''
        })
      } else {
        this.$Message.warning('最多添加20个')
      }
    },
    deleteMultiple (index) {
      this.customFormCustom.multipleChoiceList.splice(index, 1)
    },
    // 保存一条自定义字段
    customSave () {
      this.$refs['customFormValidate'].validate((valid) => {
        if (valid) {
          // 单选或者多选需要把创建的选项列表放入子对象中
          if (this.customType === 'single_choice') {
            if (!this.customFormCustom.singleChoiceList.length) {
              this.$Message.warning('选项不能为空')
              return false
            }
            this.subCustom.option = this.customFormCustom.singleChoiceList
          } else if (this.customType === 'multiple_choice') {
            if (!this.customFormCustom.multipleChoiceList.length) {
              this.$Message.warning('选项不能为空')
              return false
            }
            this.subCustom.option = this.customFormCustom.multipleChoiceList
          }

          // 当字段含默认值且不为空时，选择锁定才能生效；
          // 当字段含默认值，但为空时，选择锁定也不能生效
          if (!(this.subCustom.default || this.subCustom.default * 1 === 0)) {
            this.customFormCustom.locked = false
          }

          // 将 subCustom 中的字段添加到 customFormCustom 中
          this.customFormCustom.subCustom = this.subCustom
          // 将 customFormCustom push 到 customData 中
          let custom = Object.assign({}, this.customFormCustom)
          // 如果是编辑 删除原有自定义字段
          if (this.isCustomEdited) {
            this.customData.splice(this.customEditIndex, 1, custom)
            this.isCustomEdited = false
          } else {
            this.customData.push(custom)
          }
          this.resetCustom()
          this.customShow = false
        }
      })
    },
    // 取消
    customCancel () {
      this.resetCustom()
      this.customShow = false
    },
    // 重置自定义弹窗
    resetCustom () {
      this.customFormCustom = {
        name: '',
        identification: '',
        type: '',
        required: false,
        locked: false,
        help: '',
        singleChoiceList: [],
        multipleChoiceList: []
      }
      this.subCustom = {}
      // 单选参数列表
      this.customFormCustom.singleChoiceList.push({
        key: '',
        value: ''
      })
      // 多选参数列表
      this.customFormCustom.multipleChoiceList.push({
        key: '',
        value: ''
      })
      this.customType = ''
    },
    singleValue (rule, value, callback) {
      if (!value) {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    },
    singleKey (rule, value, callback, index) {
      if (!value) {
        callback(new Error('value不能为空'))
      } else {
        let flag = false
        let current = -1
        for (let i = 0; i < this.customFormCustom.singleChoiceList.length; i++) {
          let item = this.customFormCustom.singleChoiceList[i]
          if (i !== index && value === item.key) {
            flag = true
            current = i
          }
        }
        if (flag) {
          callback(`value不能与 ${current + 1}选项相同`)
        } else {
          callback()
        }
      }
    },
    multipleValue (rule, value, callback) {
      if (!value) {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    },
    multipleKey (rule, value, callback, index) {
      if (!value) {
        callback(new Error('value不能为空'))
      } else {
        let flag = false
        let current = -1
        for (let i = 0; i < this.customFormCustom.multipleChoiceList.length; i++) {
          let item = this.customFormCustom.multipleChoiceList[i]
          if (i !== index && value === item.key) {
            flag = true
            current = i
          }
        }
        if (flag) {
          callback(`value不能与 ${current + 1}选项相同`)
        } else {
          callback()
        }
      }
    },
    blurMin () {
      this.$refs['customFormValidate'].validateField('numberMax')
    },
    blurMax () {
      this.$refs['customFormValidate'].validateField('numberMin')
    }

  },
  mounted () {
    // 获取自定义类型列表
    this.customList()

    let path = this.$route.path
    let hash = this.$route.hash
    if (~path.indexOf('creative_edit')) {
      this.title = '编辑模板'
      if (hash) {
        let creative_module_id = hash.slice(1)
        let params = {
          creative_module_id
        }
        creativeDetail(params).then(res => {
          let data = res.data
          if (data.errno === 10000) {
            if (data.data.material_type === 'img') {
              this.imgMaterial = data.data.material
            } else if (data.data.material_type === 'video') {
              this.videoMaterial = data.data.material
            } else if (data.data.material_type === 'msg') {
              // this.msgMaterial = data.data.material
            }
            if (data.data.pre_download) {
              data.data.pre_download = '1'
              this.preDownloadFlag = false
            } else {
              data.data.pre_download = '0'
            }
            this.formCustom = data.data
            this.customData = this.formCustom.custom_fields || []
          } else {
            this.$Modal.warning({
              title: '创意模板获取失败',
              content: `原因：${data.errmsg}`
            })
          }
        })
      } else {
        this.$router.replace({
          path: '/view/resource_management/creative_add'
        })
      }
    } else {
      this.title = '新建模板'
    }
  }
}
</script>
