<template>
  <div class="add-box">
    <my-header :title="title"></my-header>
    <div class="page-common edit-page">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <el-steps :active="current" class="step-box">
        <el-step title="基本信息"></el-step>
        <el-step title="配置信息"></el-step>
        <el-step title="投放排期"></el-step>
        <el-step title="设备定向"></el-step>
        <el-step title="确认发送"></el-step>
      </el-steps>
      <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="140" class="form-box">
        <!--基本信息-->
        <div class="first" v-if="current === 1">
          <FormItem label="推广名称" prop="title">
            <Input v-model.trim="formData.title"/>
          </FormItem>
          <FormItem label="投放类型" prop="put_type">
            <Select v-model="formData.put_type" style="width:100%">
              <Option v-for="item in put_type_list" :key="item.value" :value="item.value">{{item.title}}</Option>
            </Select>
          </FormItem>
          <FormItem label="投放终端" prop="terminal">
            <RadioGroup v-model="formData.terminal" @on-change="changeTerminal">
              <Radio label="tv">TV</Radio>
              <Radio label="bx">冰箱</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="推送方式" prop="popul_id">
            <RadioGroup v-model="formData.popul_id">
              <Radio :label="1">即时消息</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="广告位" prop="ad_id">
            <Select v-model="formData.ad_id" style="width:100%" @on-change="getCreativeList" :label-in-value="true">
              <Option v-for="item in adList" :key="item.ad_id" :value="item.ad_id">{{item.ad_title}}</Option>
            </Select>
          </FormItem>
          <FormItem label="创意模板" prop="creative_module_id">
            <Select v-model="formData.creative_module_id" style="width:calc(100% - 74px)" placeholder="请先选择广告位"
                    @on-change="creativeModelChange">
              <Option v-for="item in creativeList" :key="item.creative_module_id" :value="item.creative_module_id">
                {{item.title}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input v-model="formData.remark" placeholder="非必填项"></Input>
          </FormItem>
        </div>
        <!--配置信息-->
        <div class="second" v-else-if="current === 2" :key="secondRender">
          <!--          <FormItem label="标题" :prop="modelData.material.is_req_title === '1' ? 'creative.title' : ''">-->
          <!--            <Input v-model.trim="formData.creative.title"-->
          <!--                   :placeholder="'最大' + (modelData.material.max_char_title || '&#45;&#45;') + '字符'"-->
          <!--                   :maxlength="modelData.material.max_char_title * 1" show-word-limit/>-->
          <!--          </FormItem>-->
          <!--          <FormItem label="内容" :prop="modelData.material.is_req_content === '1' ? 'creative.content' : ''">-->
          <!--            <Input class="textarea" type="textarea" v-model.trim="formData.creative.content" :rows="4"-->
          <!--                   :placeholder="'最大' + modelData.material.max_char_content + '字符'"-->
          <!--                   :maxlength="modelData.material.max_char_content * 1" show-word-limit/>-->
          <!--          </FormItem>-->
          <span v-for="(item, index) in customFormCustom" :key="index">
            <!--      字符串      -->
            <FormItem :label="item.name" v-if="item.type === 'string'" :prop="item.identification">
              <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                <span class="help-icon">
                  <Icon type="md-help-circle"/>
                </span>
              </Tooltip>
              <Input v-model.trim="formData.creative.custom_fields[item.identification]" :disabled="item.locked"/>
            </FormItem>
            <!--      数字      -->
            <FormItem :label="item.name" v-else-if="item.type === 'numeric'" :prop="item.identification">
              <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                <span class="help-icon">
                  <Icon type="md-help-circle"/>
                </span>
              </Tooltip>
              <Input v-model.trim="formData.creative.custom_fields[item.identification]" :disabled="item.locked"/>
            </FormItem>
            <!--      单选      -->
            <FormItem :label="item.name" v-else-if="item.type === 'single_choice'" :prop="item.identification">
              <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                <span class="help-icon">
                  <Icon type="md-help-circle"/>
                </span>
              </Tooltip>
              <Select v-model="formData.creative.custom_fields[item.identification]">
                <Option v-for="(li, i) in item.subCustom.option" :value="li.key"
                        :key="li.key + i">{{ li.value }}</Option>
              </Select>
            </FormItem>
            <!--      多选      -->
            <FormItem :label="item.name" v-else-if="item.type === 'multiple_choice'" :prop="item.identification">
              <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                <span class="help-icon">
                  <Icon type="md-help-circle"/>
                </span>
              </Tooltip>
              <Select v-model="formData.creative.custom_fields[item.identification]" multiple>
                <Option v-for="(li, i) in item.subCustom.option" :value="li.key"
                        :key="li.key + i">{{ li.value }}</Option>
              </Select>
            </FormItem>
            <!--      日期时间      -->
            <FormItem :label="item.name" v-else-if="item.type === 'datetime'" :prop="item.identification">
              <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                <span class="help-icon">
                  <Icon type="md-help-circle"/>
                </span>
              </Tooltip>
              <!-- 单位，day 天；时 hour；分 minute；秒 second -->
              <DatePicker v-model="formData.creative.custom_fields[item.identification]" type="date"
                          placement="bottom-end"
                          style="width: 200px" v-if="item.subCustom.datetime === 'day'"></DatePicker>
              <DatePicker v-model="formData.creative.custom_fields[item.identification]" type="datetime"
                          placement="bottom-end"
                          style="width: 200px" format="yyyy-MM-dd HH" v-else-if="item.subCustom.datetime === 'hour'"
                          class="date-hour"></DatePicker>
              <DatePicker v-model="formData.creative.custom_fields[item.identification]" type="datetime"
                          placement="bottom-end"
                          style="width: 200px" format="yyyy-MM-dd HH:mm"
                          v-else-if="item.subCustom.datetime === 'minute'"></DatePicker>
              <DatePicker v-model="formData.creative.custom_fields[item.identification]" type="datetime"
                          placement="bottom-end"
                          style="width: 200px" v-else-if="item.subCustom.datetime === 'second'"></DatePicker>
              <DatePicker v-model="formData.creative.custom_fields[item.identification]" type="datetime"
                          placement="bottom-end"
                          style="width: 200px" v-else></DatePicker>

            </FormItem>
            <!--      图片      -->
            <FormItem :label="item.name" v-else-if="item.type === 'img'" :prop="item.identification">
              <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                <span class="help-icon">
                  <Icon type="md-help-circle"/>
                </span>
              </Tooltip>
              <Upload
                :action="uploadUrl + '/uploadFdfs'"
                :format="item.suffix && JSON.parse(item.suffix)"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :show-upload-list="false"
                name="uploadfile"
                style="display: inline-block">
                <img style="width: 140px;cursor:pointer;" :src="formData.creative.custom_fields[item.identification]"
                     v-if="formData.creative.custom_fields[item.identification]"/>
                <div
                  style="width: 80px;height:80px;line-height: 80px;color: rgba(0,0,0,0.3); background-color: rgba(200,200,200,0.1);cursor: pointer;text-align: center;position: relative;"
                  v-else>
                  <Icon type="md-add" size="45" v-if="!uploadSpinShow"/>
                  <Spin fix v-else></Spin>
                </div>
              </Upload>
              <div style="float: right;width: 220px;">
                <span v-if="item.suffix">{{ item.suffix }}</span>
                <span v-if="item.width && item.height">{{ item.width }}*{{ item.height }}</span>
                <span v-if="item.condition && item.size">{{ item.condition === 'lte' ? '小于等于' : '大于等于' }}{{ item.size }}M</span>
              </div>
            </FormItem>
            <!--      视频      -->
            <FormItem :label="item.name" v-else-if="item.type === 'video'" :prop="item.identification">
              <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                <span class="help-icon">
                  <Icon type="md-help-circle"/>
                </span>
              </Tooltip>
              <Upload
                :action="uploadUrl + '/uploadFdfs'"
                :format="item.suffix && JSON.parse(item.suffix)"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :show-upload-list="false"
                name="uploadfile"
                style="display: inline-block">
                <img style="width: 140px;cursor:pointer;" :src="formData.creative.custom_fields[item.identification]"
                     v-if="formData.creative.custom_fields[item.identification]"/>
                <div
                  style="width: 80px;height:80px;line-height: 80px;color: rgba(0,0,0,0.3); background-color: rgba(200,200,200,0.1);cursor: pointer;text-align: center;position: relative;"
                  v-else>
                  <Icon type="md-add" size="45" v-if="!uploadSpinShow"/>
                  <Spin fix v-else></Spin>
                </div>
              </Upload>
              <div style="float: right;width: 220px;">
                <span v-if="item.suffix">{{ item.suffix }}</span>
                <span v-if="item.width && item.height">{{ item.width }}*{{ item.height }}</span>
                <span v-if="item.condition && item.size">{{ item.condition === 'lte' ? '小于等于' : '大于等于' }}{{ item.size }}M</span>
              </div>
            </FormItem>
            <!--      跳转      -->
            <div v-else-if="item.type === 'jump'">
              <FormItem :label="item.name" :prop="item.identification + '_openType'">
                <Tooltip :content="item.help" placement="top-start" v-if="item.help">
                  <span class="help-icon">
                    <Icon type="md-help-circle"/>
                  </span>
                </Tooltip>
                <Select v-model="formData.creative.custom_fields[item.identification].openType"
                        @on-change="initSubJump(formData.creative.custom_fields[item.identification].openType, false, item)">
                  <Option v-for="(li, i) in turnList.list" :value="li.value"
                          :key="li.value + i">{{ li.description }}</Option>
                </Select>
              </FormItem>
              <!-- 二级 -->
              <div
                v-if="subJump[item.identification] && subJump[item.identification].formType === 'select' && subJump[item.identification].list.length">
                <FormItem :label="subJump[item.identification].list[0].name"
                          :prop="item.identification + '_openSubType'">
                  <Select v-model="formData.creative.custom_fields[item.identification].openSubType"
                          @on-change="initThirdJump(formData.creative.custom_fields[item.identification].openSubType, false, item)">
                    <Option v-for="(li, i) in subJump[item.identification].list" :value="li.value" :key="li.value + i">{{ li.description }}</Option>
                  </Select>
                </FormItem>
              </div>
              <div
                v-else-if="subJump[item.identification] && subJump[item.identification].formType === 'input' && subJump[item.identification].list.length">
                <FormItem :label="item.name" v-for="(li, i) in subJump[item.identification].list" :key="li.key + i"
                          :prop="item.identification + '_openSubType'">
                  <Input v-model="formData.creative.custom_fields[item.identification].openSubType"></Input>
                </FormItem>
              </div>
              <div
                v-else-if="subJump[item.identification] && subJump[item.identification].formType === 'text' && subJump[item.identification].list.length">
                <FormItem :label="li.name" v-for="(li, i) in subJump[item.identification].list" :key="li.key + i"
                          :prop="item.identification + '_openSubType'">
                  <Input v-model="formData.creative.custom_fields[item.identification].openSubType"
                         type="textarea"></Input>
                </FormItem>
              </div>
              <!-- 三级 -->
              <div
                v-if="thirdJump[item.identification] && thirdJump[item.identification].formType === 'select' && thirdJump[item.identification].list.length">
                <FormItem :label="thirdJump[item.identification].list[0].name"
                          :prop="item.identification + '_' + thirdJump[item.identification].list[0].key">
                  <Select
                    v-model="formData.creative.custom_fields[item.identification][thirdJump[item.identification].list[0].key]">
                    <Option v-for="(li, i) in thirdJump[item.identification].list" :value="li.value"
                            :key="li.value + i">{{ li.description }}</Option>
                  </Select>
                </FormItem>
              </div>
              <div
                v-else-if="thirdJump[item.identification] && thirdJump[item.identification].formType === 'input' && thirdJump[item.identification].list.length">
                <FormItem :label="li.name"
                          :prop="formData.creative.custom_fields[item.identification].openType !== 'custom' ? item.identification + '_' + li.key : ''"
                          v-for="(li, i) in thirdJump[item.identification].list" :key="li.key + i" :id="li.key">
                  <Input v-model="formData.creative.custom_fields[item.identification][li.key]"></Input>
                </FormItem>
              </div>
            </div>
          </span>
          <!--          <FormItem label="是否抢焦点">-->
          <!--            <RadioGroup v-model="formData.creative.is_focus">-->
          <!--              <Radio label="1">是</Radio>-->
          <!--              <Radio label="0">否</Radio>-->
          <!--            </RadioGroup>-->
          <!--          </FormItem>-->
          <!--          <FormItem label="跳转类型" prop="creative.jump.openType" ref="openType">-->
          <!--            <Select v-model="formData.creative.jump.openType" @on-change="initSubJump">-->
          <!--              <Option v-for="(item, index) in turnList.list" :value="item.value" :key="item.value + index">{{ item.description }}</Option>-->
          <!--            </Select>-->
          <!--          </FormItem>-->
          <!--          &lt;!&ndash; 二级 &ndash;&gt;-->
          <!--          <div v-if="subJump.formType === 'select' && subJump.list.length">-->
          <!--            <FormItem :label="subJump.list[0].name" prop="creative.jump.openSubType">-->
          <!--              <Select v-model="formData.creative.jump.openSubType" @on-change="initThirdJump">-->
          <!--                <Option v-for="(item, index) in subJump.list" :value="item.value" :key="item.value + index">{{ item.description }}</Option>-->
          <!--              </Select>-->
          <!--            </FormItem>-->
          <!--          </div>-->
          <!--          <div v-else-if="subJump.formType === 'input' && subJump.list.length">-->
          <!--            <FormItem :label="item.name" prop="creative.jump.openSubType" v-for="(item, index) in subJump.list" :key="item.key + index">-->
          <!--              <Input v-model="formData.creative.jump.openSubType"></Input>-->
          <!--            </FormItem>-->
          <!--          </div>-->
          <!--          <div v-else-if="subJump.formType === 'text' && subJump.list.length">-->
          <!--            <FormItem :label="item.name" prop="creative.jump.openSubType" v-for="(item, index) in subJump.list" :key="item.key + index">-->
          <!--              <Input v-model="formData.creative.jump.openSubType" type="textarea"></Input>-->
          <!--            </FormItem>-->
          <!--          </div>-->
          <!--          &lt;!&ndash; 三级 &ndash;&gt;-->
          <!--          <div v-if="thirdJump.formType === 'select' && thirdJump.list.length">-->
          <!--            <FormItem :label="thirdJump.list[0].name" :prop="thirdJump.key">-->
          <!--              <Select v-model="formData.creative.jump[thirdJump.key]">-->
          <!--                <Option v-for="(item, index) in thirdJump.list" :value="item.value" :key="item.value + index">{{ item.description }}</Option>-->
          <!--              </Select>-->
          <!--            </FormItem>-->
          <!--          </div>-->
          <!--          <div v-else-if="thirdJump.formType === 'input' && thirdJump.list.length">-->
          <!--            <FormItem :label="item.name" :prop="item.required ? item.key : ''" v-for="(item, index) in thirdJump.list" :key="item.key + index" :id="item.key">-->
          <!--              <Input v-model="formData.creative.jump[item.key]"></Input>-->
          <!--            </FormItem>-->
          <!--          </div>-->
          <!--          <FormItem label="消息优先级" prop="creative.message_level">-->
          <!--            <Select v-model="formData.creative.message_level" style="width:100%">-->
          <!--              <Option value="1">低</Option>-->
          <!--              <Option value="300">中</Option>-->
          <!--              <Option value="500">高</Option>-->
          <!--              <Option value="999">超级</Option>-->
          <!--            </Select>-->
          <!--          </FormItem>-->
          <!--          <FormItem label="展示条件" prop="creative.show_scene">-->
          <!--            <Select v-model="formData.creative.show_scene" style="width:100%">-->
          <!--              <Option value="1">桌面</Option>-->
          <!--              <Option value="2">全局</Option>-->
          <!--            </Select>-->
          <!--          </FormItem>-->
        </div>
        <!--投放排期-->
        <div class="third" v-else-if="current === 3">
          <Row>
            <Col span="14" style="min-width: 270px;">
              <FormItem label="发送时间" prop="send_type" :label-width="140" style="height: 40px">
                <RadioGroup v-model="formData.send_type" @on-change="sendTypeChange">
                  <Radio :label="1">立即</Radio>
                  <Radio :label="2">定时</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="8" style="min-width: 180px;">
              <FormItem label="" prop="set_time" :label-width="0">
                <DatePicker :editable="false" class="setTime" :value="formData.set_time" type="datetime"
                            format="yyyy-MM-dd HH:mm" :options="setTimeOption" v-if="formData.send_type === 2"
                            @on-change="setTimeChange"></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <FormItem label="消息展示有效期至" prop="valid_time" :label-width="140">
            <DatePicker :editable="false" :value="formData.valid_time" type="datetime" format="yyyy-MM-dd HH:mm"
                        style="width: 200px" :options="validTimeOption" @on-change="validTimeChange"></DatePicker>
          </FormItem>
        </div>
        <!--设备定向-->
        <div class="last" v-else-if="current === 4">
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
                    :on-success="uploadFileSuccess"
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
        <!--确认发送-->
        <div class="end" v-else-if="current === 5">
          <FormItem label="预览" prop="macs" :label-width="100">
            <Input class="textarea" type="textarea" v-model.trim="formData.macs" :rows="4"
                   placeholder="请输入MAC地址，多个MAC之间用英文逗号分隔，5分钟内有效"/>
          </FormItem>
          <Button type="primary" @click="preview" v-if="current !== 1" class="preview">发送
          </Button>
          <p style="padding-left: 120px;line-height: 30px;margin-bottom: 10px;" v-if="msg_id !== ''">预览消息发送成功，消息ID：{{
            msg_id }}</p>
          <Row type="flex" align="top" class="row">
            <Col span="5">
              <span class="themeTitle">基本信息</span>
            </Col>
            <Col span="18">
              <FormItem label="推广名称">
                <p>{{ formData.title }}</p>
              </FormItem>
              <FormItem label="投放类型">
                <p v-if="formData.put_type === 'business'">商广</p>
                <p v-else-if="formData.put_type === 'internal'">内推</p>
                <p v-else>--</p>
              </FormItem>
              <FormItem label="投放终端">
                <p v-if="formData.terminal === 'tv'">TV</p>
                <p v-else-if="formData.terminal === 'bx'">冰箱</p>
                <p v-else>--</p>
              </FormItem>
              <FormItem label="推送方式">
                <p v-if="(formData.popul_id * 1) === 1">即时消息</p>
                <p v-else>--</p>
              </FormItem>
              <FormItem label="广告位">
                <p>{{ formData.ad_title }}</p>
              </FormItem>
              <FormItem label="创意模板">
                <p>{{ modelData.title }}</p>
              </FormItem>
              <FormItem label="备注">
                <p>{{ formData.remark }}</p>
              </FormItem>
            </Col>
          </Row>

          <Row type="flex" align="top" class="row">
            <Col span="5">
              <span class="themeTitle">配置创意</span>
            </Col>
            <Col span="18">
              <span v-for="(item, index) in customFormCustom" :key="index">
                <!--      字符串      -->
                <FormItem :label="item.name" v-if="item.type === 'string'">
                  <p>{{ formData.creative.custom_fields[item.identification] }}</p>
                </FormItem>
                <!--      数字      -->
                <FormItem :label="item.name" v-else-if="item.type === 'numeric'">
                  <p>{{ formData.creative.custom_fields[item.identification] }}</p>
                </FormItem>
                <!--      单选      -->
                <FormItem :label="item.name" v-else-if="item.type === 'single_choice'">
                  <p>{{ custom_fields_name[item.identification] && custom_fields_name[item.identification].toString() }}</p>
                </FormItem>
                <!--      多选      -->
                <FormItem :label="item.name" v-if="item.type === 'multiple_choice'">
                  <p>{{ custom_fields_name[item.identification] && custom_fields_name[item.identification].toString() }}</p>
                </FormItem>
                <!--      日期时间      -->
                <FormItem :label="item.name" v-else-if="item.type === 'datetime'">
                <!-- 单位，day 天；时 hour；分 minute；秒 second -->
                  <p>{{ custom_fields_name[item.identification] }}</p>
                </FormItem>
                <!--      图片      -->
                <FormItem :label="item.name" v-else-if="item.type === 'img'">
                  <img style="width: 140px;cursor:pointer;" :src="formData.creative.custom_fields[item.identification]"
                       v-if="formData.creative.custom_fields[item.identification]"/>
                </FormItem>
                <!--      视频      -->
                <FormItem :label="item.name" v-else-if="item.type === 'video'">
                  <video style="width: 140px;cursor:pointer;"
                         :src="formData.creative.custom_fields[item.identification]"
                         v-if="formData.creative.custom_fields[item.identification]"></video>
                </FormItem>
                <!--      跳转      -->
                <div v-else-if="item.type === 'jump'">
                  <FormItem :label="item.name">
                    <span v-for="(li, i) in custom_fields_name[item.identification]" :key="i" v-if="li !== ''"
                          class="break-all">
                      <span v-if="i !== 'openTypeName'">-</span>
                      <span>{{ li }}</span>
                    </span>
                  </FormItem>

                </div>
              </span>
            </Col>
          </Row>
          <Row type="flex" align="top" class="row">
            <Col span="5">
              <span class="themeTitle">投放排期</span>
            </Col>
            <Col span="18">
              <FormItem label="发送时间">
                <p>
                  <span v-if="formData.send_type === 1">立即</span>
                  <span v-else-if="formData.send_type === 2">定时 &nbsp;&nbsp; {{ formData.set_time }}</span>
                </p>
              </FormItem>
              <FormItem label="消息展示有效期至">
                <p>{{ formData.valid_time }}</p>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" align="top" class="row">
            <Col span="5">
              <span class="themeTitle">设备定向</span>
            </Col>
            <Col span="18">
              <FormItem label="全部设备"
                        v-if="formData.device_orientation && formData.device_orientation.orientation_type === 'all_device'">
              </FormItem>
              <FormItem label="指定设备"
                        v-else-if="formData.device_orientation && formData.device_orientation.orientation_type === 'sub_device'">
                <span>{{formData.device_orientation.filename}}</span>
              </FormItem>
              <FormItem label="设备分组"
                        v-else-if="formData.device_orientation && formData.device_orientation.orientation_type === 'device_group'">
                <p v-for="group in groupNameList" :key="group.group_id">{{ group.group_name }}</p>
              </FormItem>
            </Col>
          </Row>
        </div>
        <FormItem>
          <Button type="primary" @click="pre" v-if="current !== 1" class="page-main-btn common-margin-right-10">上一步
          </Button>
          <Button type="primary" @click="next" :loading="current === 5 && isAchieve" class="page-main-btn">{{current
            !== 5 ? '下一步' : '确认发送'}}
          </Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import { creativeList, creativeDetail, creTurnList } from '@/api/resource-data'
import { reqadList, reqStrategyGroup } from '@/api/ad-push-list'
import { msgPreview, msgStore, msgInfo } from '@/api/msg-list'
import { deepcopy } from '@/libs/deepcopy'
import { formatDate } from '@/libs/date'
import { resetTime, deepClone } from '@/libs/util'
import './index.less'

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
  terminal: 'tv',
  ad_id: '',
  put_type: 'internal',
  popul_id: 1,
  creative: {
    custom_fields: {}
  },
  remark: '',
  device_orientation: {
    orientation_type: '',
    url: '',
    filename: '',
    front_content: []
  },
  creative_module_id: '',
  send_type: 1,
  set_time: '',
  valid_time: '',
  macs: ''
}
export default {
  name: 'editpage',
  data () {
    return {
      spinShow: true,
      uploadUrl: 'http://api.scloud.gome.inc/uploadfile',
      title: '',
      current: 1,
      formData: {},
      adList: [],
      put_type_list,
      device_orientation_list,
      creativeList: [],
      ruleValidate: {
        title: [{ required: true, message: '推广名称不能为空' }],
        put_type: [{ required: true, message: '投放类型不能为空', trigger: 'change' }],
        terminal: [{ required: true, message: '投放终端不能为空', trigger: 'change' }],
        remark: [
          {
            validator: (rule, val, callback) => {
              callback()
            }
          }
        ],
        creative_module_id: [{ required: true, message: '请选择创意', trigger: 'change' }],
        ad_id: [{ required: true, message: '请选择广告位', trigger: 'change' }],
        'device_orientation.orientation_type': [{ required: true, message: '定向类型不能为空', trigger: 'change' }],
        'device_orientation.url': [{ required: true, message: '请上传文件' }],
        'device_orientation.front_content': [{
          validator: (rule, value, callback) => {
            value && value.length ? callback() : callback('定向类型数据不能为空')
          }
        }],
        'creative.title': [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        'creative.content': [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        'creative.material': [{ required: true, message: '请上传图片', trigger: 'change' }],
        'creative.message_level': [
          {
            validator: (rule, val, callback) => {
              if (!this.formData.creative.message_level) {
                callback(new Error('请选择消息优先级'))
              } else {
                callback()
              }
            }
          }
        ],
        'creative.show_scene': [
          {
            validator: (rule, val, callback) => {
              if (!this.formData.creative.show_scene) {
                callback(new Error('请选择展示条件'))
              } else {
                callback()
              }
            }
          }
        ],
        set_time: [
          {
            validator: (rule, val, callback) => {
              if (!this.formData.set_time && this.formData.send_type === 2) {
                callback(new Error('请设置时间'))
              } else {
                callback()
              }
            },
            trigger: 'none'
          },
          {
            validator: (rule, val, callback) => {
              let nowTime = new Date().getTime()
              let sendTime = new Date(val).getTime()
              if (sendTime - nowTime < 5 * 60 * 1000 && this.formData.send_type === 2) {
                callback(new Error('设置时间要比当前时间晚至少5分钟'))
              } else {
                callback()
              }
            },
            trigger: 'none'
          }
        ],
        valid_time: [
          {
            validator: (rule, val, callback) => {
              if (!this.formData.valid_time) {
                callback(new Error('请设置时间'))
              } else {
                callback()
              }
            },
            trigger: 'none'
          },
          {
            validator: (rule, val, callback) => {
              let nowTime = new Date().getTime()
              let sendTime = new Date(this.formData.set_time).getTime()
              let setTime = new Date(val).getTime()
              if (this.formData.send_type === 1 && nowTime > setTime) {
                callback(new Error('有效时间不能晚于当前时间'))
              } else if (this.formData.send_type === 2 && sendTime > setTime) {
                callback(new Error('有效时间不能晚于定时时间'))
              } else {
                callback()
              }
            },
            trigger: 'none'
          }
        ]
      },
      indeterminateGroup: {},
      checkAllGroup: {},
      groupList: {},
      groupTitle: [],
      isAchieve: false,
      uploadSpinShow: false,
      validTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      setTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      msg_id: '',
      modelData: {},
      turnList: {},
      subJump: {},
      thirdJump: {},
      pageType: '',
      id: '',
      groupNameList: [],
      secondRender: false,
      customFormCustom: [],
      // 第一次编辑或者复制
      firstCopy: true,
      // 自定义字段翻译
      custom_fields_name: {}
    }
  },
  mounted () {
    creTurnList().then(res => {
      if (res.data.errno === 10000) {
        this.turnList = res.data.data
        let href = window.location.href
        if (~href.indexOf('msg_add')) {
          this.title = '新建消息'
          this.formData = deepcopy(formData)
          this.getAdList()
          this.spinShow = false
          this.pageType = 'msg_add'
        } else {
          if (~href.indexOf('msg_edit')) {
            this.title = '编辑消息'
            this.pageType = 'msg_edit'
          } else if (~href.indexOf('msg_copy')) {
            this.title = '复制消息'
            this.pageType = 'msg_copy'
          }
          this.id = href.split('#')[1]
          this.getDetail(this.id)
        }
      } else {
        throw res.data.errmsg
      }
    })
  },
  methods: {
    async getDetail (id) {
      try {
        const res = await msgInfo({ id })
        if (res.data.errno === 10000) {
          this.formData = {
            ...deepcopy(formData),
            ...res.data.data,
            device_orientation: { ...formData.device_orientation, ...res.data.data.device_orientation }
          }
          this.getAdList()
          // 回显定时
          if (this.formData.send_type === 2) {
            this.formData.set_time = formatDate(this.formData.set_time, true)
          } else {
            this.formData.set_time = ''
          }
          this.formData.valid_time = formatDate(this.formData.valid_time, true)
          // 回显分组
          if (this.formData.device_orientation.orientation_type === 'device_group') {
            this.getGroupList(true)
            // 保存的数字数组到后台详情变成 字符串，手动转数字
            this.formData.device_orientation.front_content = this.formData.device_orientation.front_content.map(item => {
              return item * 1
            })
          }
        } else {
          throw res.data.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    changeTerminal () {
      this.formData.ad_id = ''
      this.formData.creative_module_id = ''
      this.formData.device_orientation.front_content = []
      this.getAdList()
    },
    async getAdList () {
      try {
        const res = await reqadList({ terminal: this.formData.terminal, ad_space_type: 2 })
        if (res.errno === 10000) {
          this.adList = res.data.data
          this.formData.ad_id && this.getCreativeList('', true)
        } else {
          throw res.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getCreativeList (val, flag) {
      this.creativeList = []
      if (!flag) {
        this.formData.creative_module_id = ''
      }
      if (val) {
        this.formData.ad_title = val.label
      }
      try {
        const res = await creativeList({ ad_id: this.formData.ad_id, status: 1, all: true, material_type: 'msg' })
        if (res.data.errno === 10000) {
          this.creativeList = res.data.data.data
          this.spinShow = false
        } else {
          throw res.data.errmsg
        }
      } catch (e) {
        this.$Message.error(e)
      }
    },
    async getCreativeModel () {
      try {
        if (this.formData.creative_module_id) {
          const res = await creativeDetail({ creative_module_id: this.formData.creative_module_id })
          if (res.data.errno === 10000) {
            if (res.data.data.status !== 1) {
              this.formData.creative_module_id = ''
              console.log('对应模板已下线')
            } else {
              // key值可以刷新当前组件
              this.secondRender = !this.secondRender
              this.modelData = res.data.data
              // console.log(this.modelData)
              // 自定义字段
              if (this.modelData.custom_fields) {
                this.customFormCustom = this.modelData.custom_fields

                // 添加校验规则
                this.setCustomRule()
                let setSuffixArr = false
                if (this.customFormCustom && this.customFormCustom.length) {
                  for (let i = 0; i < this.customFormCustom.length; i++) {
                    let item = this.customFormCustom[i]

                    // 如果是跳转， 则添加两个字段
                    if (item.type === 'jump') {
                      // 如果是编辑或者复制，则回显跳转

                      if ((this.pageType === 'msg_edit' || this.pageType === 'msg_copy') && this.firstCopy) {
                        // 回显跳转类型
                        this.initSubJump(this.formData.creative.custom_fields[item.identification].openType, true, item)
                        if (this.formData.creative.custom_fields[item.identification].openType !== 'none') {
                          this.initThirdJump(this.formData.creative.custom_fields[item.identification].openSubType, true, item)
                        }
                      } else {
                        this.formData.creative.custom_fields[item.identification] = {
                          openType: '',
                          openSubType: ''
                        }
                        this.subJump[item.identification] = {}
                        this.thirdJump[item.identification] = {}
                      }
                    }

                    // 使用第一个图片/视频的设置格式
                    if ((item.type === 'img' || item.type === 'video') && !setSuffixArr) {
                      this.suffixArr = item.subCustom.suffix
                      setSuffixArr = true
                    }

                    // 设置默认值
                    if (item.subCustom && (item.subCustom.default || item.subCustom.default * 1 === 0) && (!this.firstCopy || this.pageType === 'msg_add')) {
                      this.formData.creative.custom_fields[item.identification] = item.subCustom.default
                    }
                    // 如果是日期，转成 标准时间格式
                    if (item.type === 'datetime') {
                      this.formData.creative.custom_fields[item.identification] = resetTime(this.formData.creative.custom_fields[item.identification])
                    }
                  }
                }
              }
            }
            this.firstCopy = false
          } else {
            throw res.data.errmsg
          }
        }
      } catch (e) {
        throw e
      }
    },
    async saveAdd () {
      this.isAchieve = true
      try {
        // 遍历 customFormCustom 将 日期转成时间戳
        if (this.customFormCustom && this.customFormCustom.length) {
          for (let i = 0; i < this.customFormCustom.length; i++) {
            let item = this.customFormCustom[i]
            if (item.type === 'datetime') {
              // console.log(this.formData.creative.custom_fields[item.identification])
              this.formData.creative.custom_fields[item.identification] = parseInt((new Date(this.formData.creative.custom_fields[item.identification]).getTime()) / 1000)
            }
          }
        }
        const newParams = deepcopy(this.formData)
        delete newParams.macs
        this.pageType === 'msg_copy' && (delete newParams.id)
        // console.log(newParams)
        msgStore(newParams).then(res => {
          if (res.data.errno === 10000) {
            // 跳转列表页面
            this.$router.replace('/view/msg_management/msg_list')
            this.$Message.success('保存成功！')
          } else {
            this.$Message.error(res.data.errmsg)
            this.isAchieve = false
          }
        })
      } catch (e) {
        this.isAchieve = false
        throw e
      }
    },
    uploadFileSuccess (response, file, fileList) {
      if (response.errno === 10000) {
        this.formData.device_orientation.url = response.data.fileUrl
        this.formData.device_orientation.filename = file.name
        this.formData = { ...this.formData }
      } else this.$Message.error(response.errmsg)
    },
    formatFail () {
      this.$Message.error('只能上传txt哟')
    },
    changeDirection () {
      // 如果是设备分组则加载列表并清空url和filename，清空front_content
      if (this.formData.device_orientation && this.formData.device_orientation.orientation_type === 'device_group') {
        this.getGroupList(true)
        this.formData.device_orientation.url = this.formData.device_orientation.filename = ''
      } else {
        this.formData.device_orientation.front_content = []
      }
    },
    next () {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.current !== 5) {
            if (this.current === 4) {
              this.changeDirection()
              if (this.formData.device_orientation.front_content.length) {
                this.groupNameList = []
                let count = 0
                let groupTitle = Object.keys(this.groupList)
                for (let i = 0; i < groupTitle.length; i++) {
                  let title = groupTitle[i]
                  let group = this.groupList[title]
                  for (let j = 0; j < group.length; j++) {
                    if (this.formData.device_orientation.front_content.length === count) {
                      this.current++
                      return
                    }
                    let item = group[j]
                    if (~this.formData.device_orientation.front_content.indexOf(item.group_id)) {
                      this.groupNameList.push(item)
                      count++
                    }
                  }
                }
              }
              // 自定义对象
              let custom_fields = this.formData.creative.custom_fields
              // 自定义对象翻译
              let custom_fields_name = {}
              if (this.customFormCustom && this.customFormCustom.length) {
                for (let i = 0; i < this.customFormCustom.length; i++) {
                  let item = this.customFormCustom[i]
                  let identification = item.identification
                  let list
                  // 单选
                  if (item.type === 'single_choice') {
                    list = item.subCustom.option
                    custom_fields_name[identification] = []
                    for (let i = 0; i < list.length; i++) {
                      let li = list[i]
                      if (custom_fields[identification] === li.key) {
                        custom_fields_name[identification].push(li.value)
                        break
                      }
                    }
                  } else if (item.type === 'multiple_choice') {
                    // 多选
                    list = item.subCustom.option
                    custom_fields_name[identification] = []
                    for (let i = 0; i < list.length; i++) {
                      let li = list[i]
                      if (~custom_fields[identification].indexOf(li.key)) {
                        custom_fields_name[identification].push(li.value)
                      }
                    }
                  } else if (item.type === 'datetime') {
                    // 时间
                    custom_fields_name[identification] = resetTime(new Date(custom_fields[identification]).getTime() / 1000)
                  } else if (item.type === 'jump') {
                    // 跳转
                    custom_fields_name[identification] = {}
                    // 一级
                    list = this.turnList
                    for (let i = 0; i < list.list.length; i++) {
                      let li = list.list[i]
                      if (li.value === custom_fields[identification].openType) {
                        custom_fields_name[identification].openTypeName = li.description
                        break
                      }
                    }
                    // 二级
                    if (custom_fields[identification].openType !== 'none') {
                      console.log(this.subJump[identification], 'sub')

                      if (this.subJump[identification].formType === 'select') {
                        // 如果二级是select 遍历
                        let subList = this.subJump[identification].list
                        for (let i = 0; i < subList.length; i++) {
                          let li = subList[i]
                          if (li.value === custom_fields[identification].openSubType) {
                            custom_fields_name[identification].openSubTypeName = li.description
                            break
                          }
                        }
                      } else {
                        // 如果二级是input/text
                        custom_fields_name[identification].openSubTypeName = custom_fields[identification].openSubType
                      }
                      // 三级
                      let jumps = deepClone(custom_fields[identification])
                      delete jumps.openType
                      delete jumps.openSubType
                      custom_fields_name[identification] = Object.assign(custom_fields_name[identification], jumps)
                    }

                    console.log(custom_fields_name[identification])
                  }
                }
              }

              this.custom_fields_name = custom_fields_name
            }
            this.current++
          }
          // 调用保存接口
          else {
            this.saveAdd()
            console.log('保存', this.formData)
          }
        } else {
          this.$Message.error('请将信息填写完整!')
        }
      })
    },
    pre () {
      if (this.current !== 0) {
        this.current--
        this.$nextTick(() => {
          this.$refs.formData.validate()
        })
      }
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
        this.formData.device_orientation.front_content.push(...this.filterGroup(this.groupList[item]).concat())
      } else {
        // 找到组内元素，逐个删除
        this.filterGroup(this.groupList[item]).forEach(val => {
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
    filterGroup (list) {
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
    beforeUpload (file) {
      let img = file
      let type = img.name.split('.')[1]
      if (type && ~this.suffixArr.indexOf(type.toLowerCase())) {
        this.uploadSpinShow = true
      } else {
        this.$Modal.warning({
          title: '上传失败',
          content: `原因：只能上传${this.suffixArr}格式`
        })
        return false
      }
    },
    uploadSuccess (res, file, fileList) {
      let type = ''
      if (res.errno === 10000) {
        this.formData.creative.material = res.data.fileUrl
        // todo 暂时只能上传一张图片或一个视频，因图片或视频自定义后不感知位置，所以遍历customFormCustom，找到对应字段传入图片地址
        for (let i = 0; i < this.customFormCustom.length; i++) {
          let item = this.customFormCustom[i]
          if (item.type === 'img' || item.type === 'video') {
            this.formData.creative.custom_fields[item.identification] = this.formData.creative.material
            break
          }

          if (item.type === 'img') {
            type = '图片'
          } else {
            type = '视频'
          }
        }
        this.$Message.success(`${type}上传成功！`)
        this.$forceUpdate()
      } else {
        this.$Modal.warning({
          title: '上传失败',
          content: `原因：${res.errmsg}`
        })
      }
      this.uploadSpinShow = false
    },
    setTimeChange (value) {
      this.formData.set_time = value
      this.$refs.formData.validateField('set_time')
    },
    validTimeChange (value) {
      this.formData.valid_time = value
      this.$refs.formData.validateField('valid_time')
    },
    preview () {
      let data = this.formData
      // console.log(this.formData)
      msgPreview(data).then(res => {
        const data = res.data
        if (data.errno === 10000) {
          this.msg_id = data.data.msg_id
        } else {
          this.$Modal.warning({
            title: '预览失败',
            content: `原因：${data.errmsg}`
          })
        }
      })
    },
    initSubJump (value, flag, item) {
      if (value) {
        let openType = value
        for (let i = 0; i < this.turnList.list.length; i++) {
          let li = this.turnList.list[i]
          if (openType === li.value) {
            // && item.list.length
            this.subJump[item.identification] = li
            break
          }
        }
        if (!flag) {
          this.formData.creative.custom_fields[item.identification].openSubType = ''
          if (this.thirdJump[item.identification] && this.thirdJump[item.identification].list) {
            this.thirdJump[item.identification].list.forEach((li, index) => {
              delete this.formData.creative.custom_fields[item.identification][li.key]
            })
          }
          this.thirdJump[item.identification] = {}
        }
      }
      this.$forceUpdate()
    },
    initThirdJump (value, flag, item) {
      if (value) {
        if (!flag && this.thirdJump[item.identification] && this.thirdJump[item.identification].list && this.thirdJump[item.identification].list.length) {
          let openType = this.formData.creative.custom_fields[item.identification].openType
          let openSubType = this.formData.creative.custom_fields[item.identification].openSubType
          this.formData.creative.custom_fields[item.identification] = {
            openType,
            openSubType
          }
          this.thirdJump[item.identification].list.forEach((li, index) => {
            this.formData.creative.custom_fields[item.identification][li.key] = ''
          })
        }
        let subOpenType = value
        for (let i = 0; i < this.subJump[item.identification].list.length; i++) {
          let li = this.subJump[item.identification].list[i]
          if (subOpenType === li.value) {
            this.thirdJump[item.identification] = li
            break
          }
        }
        console.log(this.formData.creative.custom_fields[item.identification])
        this.setThirdRule(item)
      }
      this.$forceUpdate()
    },
    sendTypeChange (value) {
      if (value === 1) {
        this.formData.set_time = ''
        this.$nextTick(() => {
          this.$refs.formData.validateField('set_time')
        })
      }
    },
    creativeModelChange () {
      this.formData.creative.custom_fields = {}
      this.subJump = {}
      this.thirdJump = {}
    },
    setCustomRule () {
      let $vm = this
      // ruleValidate
      for (let i = 0; i < $vm.customFormCustom.length; i++) {
        let item = $vm.customFormCustom[i]
        switch (item.type) {
          case 'string': {
            let rule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification] || ''
                    if (!item.required && value === '') {
                      callback()
                    } else if (item.required && value === '') {
                      callback('请输入' + item.name)
                    }

                    if (item.subCustom && item.subCustom.long_min && item.subCustom.long_min !== '' && item.subCustom.long_max && item.subCustom.long_max !== '') {
                      if (value.length < item.subCustom.long_min || value.length > item.subCustom.long_max) {
                        callback(`字符长度错误，限${item.subCustom.long_min}-${item.subCustom.long_max}字符`)
                      } else {
                        callback()
                      }
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'blur'
              }
            ]
            $vm.ruleValidate[item.identification] = rule
            break
          }
          case 'numeric': {
            let rule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification]
                    value = (value * 1 === 0 || value) ? value : ''
                    if (!item.required && value === '') {
                      callback()
                    } else if (item.required && value === '') {
                      callback('请输入' + item.name)
                    }

                    if (item.subCustom && item.subCustom.long_min && item.subCustom.long_min !== '' && item.subCustom.long_max && item.subCustom.long_max !== '') {
                      if (value < item.subCustom.long_min || value > item.subCustom.long_max) {
                        callback(`范围错误，限${item.subCustom.long_min}-${item.subCustom.long_max}`)
                      } else {
                        callback()
                      }
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'blur'
              }
            ]
            $vm.ruleValidate[item.identification] = rule
            break
          }
          case 'single_choice': {
            let rule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请选择' + item.name)
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'change'
              }
            ]
            $vm.ruleValidate[item.identification] = rule
            break
          }
          case 'multiple_choice': {
            let rule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请选择' + item.name)
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'change'
              }
            ]
            $vm.ruleValidate[item.identification] = rule
            break
          }
          case 'datetime': {
            let rule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请选择' + item.name)
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'change'
              }
            ]
            $vm.ruleValidate[item.identification] = rule
            break
          }
          case 'img': {
            let rule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请上传' + item.name)
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'change'
              }
            ]
            $vm.ruleValidate[item.identification] = rule
            break
          }
          case 'video': {
            let rule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification]
                    if (item.required && !value) {
                      callback('请上传' + item.name)
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'change'
              }
            ]
            $vm.ruleValidate[item.identification] = rule
            break
          }
          case 'jump': {
            let openTypeRule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification].openType

                    if (item.required && !value) {
                      callback('请选择' + item.name)
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'change'
              }
            ]

            let openSubTypeRule = [
              {
                validator: (rule, val, callback) => {
                  if ($vm.current !== 2) {
                    callback()
                  } else {
                    let value = $vm.formData.creative.custom_fields[item.identification].openSubType

                    if (!value) {
                      callback('请选择类型/参数')
                    } else {
                      callback()
                    }
                  }
                },
                trigger: 'change'
              }
            ]

            // console.log(this.thirdJump)
            $vm.ruleValidate[item.identification + '_openType'] = openTypeRule
            $vm.ruleValidate[item.identification + '_openSubType'] = openSubTypeRule
            this.setThirdRule(item)
            break
          }
        }
      }
      // console.log($vm.customFormCustom, $vm.ruleValidate)
    },
    setThirdRule (item) {
      let $vm = this
      if ($vm.thirdJump[item.identification] && $vm.thirdJump[item.identification].list) {
        let list = $vm.thirdJump[item.identification].list
        if (list && list.length) {
          for (let i = 0; i < list.length; i++) {
            let li = list[i]
            let rule
            switch (li.key) {
              // openEpId:视频id不能为空
              case 'openEpId': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('视频id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // openEqId:专辑id不能为空
              case 'openEqId': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('专辑id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // openSpecialId: 专题id不能为空
              case 'openSpecialId': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('专题id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // openGameId:游戏id不能为空
              case 'openGameId': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('游戏id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // openAppId: 应用id不能为空
              case 'openAppId': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('应用id不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // openAppName:应用名称不能为空
              case 'openAppName': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('应用名称不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // openAppPackage:应用包名不能为空
              case 'openAppPackage': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('应用包名不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // openParam:第三方跳转参数不能为空
              case 'openParam': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('第三方跳转参数不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // keyword:关键词不能为空
              case 'keyword': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('关键词不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
              // resourceId:资源ID不能为空
              case 'resourceId': {
                rule = [
                  {
                    validator: (rule, value, callback) => {
                      if ($vm.current !== 2) {
                        callback()
                      } else {
                        let val = $vm.formData.creative.custom_fields[item.identification][li.key]
                        if (!val) {
                          callback('资源ID不能为空')
                        } else {
                          callback()
                        }
                      }
                    }
                  }
                ]
                break
              }
            }
            this.ruleValidate[`${item.identification}_${li.key}`] = rule
          }
        }
      }
    }
  },
  watch: {
    'formData.creative_module_id' (newV, oldV) {
      if (newV !== oldV) {
        this.getCreativeModel()
      }
    }
  }

  //
}
</script>

<style scoped lang="less">
  .step-box {
    padding: 0 50px;
  }

  .form-box {
    padding-top: 40px;
  }

  .end {
    position: relative;

    .preview {
      position: absolute;
      top: 0;
      right: -100px;
    }
  }

  .edit-page {
    position: relative;
    width: 600px;
  }

  .mr10 {
    margin-right: 10px;
  }
</style>
