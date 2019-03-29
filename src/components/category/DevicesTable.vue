<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="table_filter">
        <span>状态：</span>
          <el-dropdown split-button type="primary" size="mini">
            {{currentStatus}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in statusList" :key="index" :index="index" @click.native="changeStatus(index)">
                {{item}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>下次定检时间：</span>
          <el-date-picker
            v-model="nextCheckDate"
            type="month"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy年MM月"
            size="mini">
          </el-date-picker>
          <el-button type="primary" size="mini" @click="changeTime">筛选</el-button>
          <el-button type="primary" size="mini" @click="reset">重置</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        :data="deviceList"
        style="width: 100%;text-align: left;"
        :height="tableHeight"
        border
        size="mini"
        :row-style="rowClass">
        <el-table-column
          prop="affiliation"
          label="归属"
          width="80">
        </el-table-column>
        <el-table-column
          width="180"
          :render-header="renderSearchHeader"
          prop="deviceName">
          <template slot-scope="scope">{{scope.row.deviceName}}</template>
        </el-table-column>

        <el-table-column
          prop="component"
          label="部件"
          width="100">
        </el-table-column>
        <el-table-column
          prop="item"
          label="项目及标准"
          width="100">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="50">
        </el-table-column>
        <el-table-column
          prop="periodInMonths"
          label="周期(月)"
          width="80">
        </el-table-column>
        <el-table-column
          prop="standardSource"
          label="标准来源"
          width="100">
        </el-table-column>
        <el-table-column
          prop="lastCheckDate"
          label="上次定检时间"
          align='center'
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="workOrderNumber"
          label="工单号"
          width="130">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="60">
        </el-table-column>
        <el-table-column
          prop="nextCheckDate"
          label="下次定检时间"
          align='center'
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="100">
        </el-table-column>
        <el-table-column
          prop="condition"
          label="实际定检状况说明"
          :formatter="formatter"
          width="150">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          :width="opWidth"
          v-if="role.isSuperAdmin||role.isAdmin">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="role.isSuperAdmin"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加设备和分页 -->
      <el-row>
        <el-col :span="8" v-if="role.isSuperAdmin">
            <el-button class="addDeviceBtn" size="mini" type="primary" @click="handleAdd">添加设备</el-button>
        </el-col>
        <el-col :span="16">
          <div class="pagination">
              <el-pagination
              v-if='paginations.totalRow > 0'
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.pageSize"
              :layout="paginations.layout"
              :total="paginations.totalRow"
              :current-page.sync='paginations.pageNumber'
              @current-change='handleCurrentChange'
              @size-change='handleSizeChange'>
              </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.show"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
        style="margin:20px auto 0;">
        <div class="form">
            <el-form ref="form"
              label-position="right"
              :model="form"
              :rules="rules"
              size="mini"
              :label-width="dialog.formLabelWidth">
              <el-form-item label="归属" prop="affiliation" v-if="role.isSuperAdmin">
                <el-input v-model="form.affiliation"></el-input>
              </el-form-item>
              <el-form-item label="设备名称" prop="deviceName" v-if="role.isSuperAdmin">
                <el-input v-model="form.deviceName"></el-input>
              </el-form-item>
              <el-form-item label="部件" prop="component" v-if="role.isSuperAdmin">
                <el-input v-model="form.component"></el-input>
              </el-form-item>
              <el-form-item label="项目及标准" prop="item" v-if="role.isSuperAdmin">
                <el-input v-model="form.item"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type" v-if="role.isSuperAdmin">
                <el-input v-model="form.type"></el-input>
              </el-form-item>
              <el-form-item label="周期(月)" v-if="role.isSuperAdmin">
                <el-input v-model="form.periodInMonths"></el-input>
              </el-form-item>
              <el-form-item label="标准来源" v-if="role.isSuperAdmin">
                <el-input v-model="form.standardSource"></el-input>
              </el-form-item>
              <el-form-item label="上次检查时间">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="选择日期" v-model="form.lastCheckDate" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="工单号">
                <el-input v-model="form.workOrderNumber"></el-input>
              </el-form-item>

              <el-form-item label="备注" v-if="role.isSuperAdmin">
                <el-input type="textarea" v-model="form.remark"></el-input>
              </el-form-item>
              <el-form-item label="实际定检状况说明" v-if="role.isSuperAdmin">
                <el-input type="textarea" v-model="form.condition"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-if="dialog.type=='edit'" @click="onChange()">修改</el-button>
                <el-button type="primary" v-if="dialog.type=='add'" @click="addDevice('form')">确认</el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
            </el-form>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../services/index.js";
import session from "../session.js";
import validate from "../validate.js";

export default {
  name: "Devices",
  props: [
    'categoryId'
  ],
  data() {
    return {
      deviceList: [],
      searchKey: "",
      tableHeight: "",
      updatableTime: {
        beginTime: "",
        endTime: ""
      },
      role: {
        isSuperAdmin: false,
        isAdmin: false
      },
      opWidth: "75px",
      //需要给分页组件传的信息
      paginations: {
        pageNumber: 1, // 当前位于哪页
        totalRow: 0, // 总数
        pageSize: 20, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      //详情弹框信息
      dialog: {
        width: "300px",
        show: false,
        title: "修改设备信息",
        formLabelWidth: "140px",
        type: ""
      },
      form: {
        index: 0,
        deviceId: "",
        affiliation: "",
        deviceName: "",
        component: "",
        item: "",
        type: "",
        periodInMonths: "",
        standardSource: "",
        lastCheckDate: "",
        workOrderNumber: "",
        remark: "",
        condition: ""
      },
      rules: {
        affiliation: [
          { required: true, message: '请填写归属', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请填写设备名称', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '请填写部件', trigger: 'blur' }
        ],
        item: [
          { required: true, message: '请填写项目及标准', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请填写类型', trigger: 'blur' }
        ]
      },
      tableHeight: "",
      currentStatus: "全部",
      statusList: ['全部', '未到期', '未完成', '已超期'],
      nextCheckDate: ''
    };
  },
  watch: {
    "$route" (){
      if((this.$route.params.factoryId != this.factoryId)){
        this.getDevices();
      }
    },
    "categoryId" (){
      this.getDevices();
    }
  },
  methods: {
    // 初始化部分值
    initValue(){
      this.role = validate();
      if(this.role.isSuperAdmin){
        this.opWidth = "150px";
      }
      this.getTime();
    },
    // 获取设备列表deviceList展示表格内容
    getDevices(pageInfo = {}) {
      if(!this.categoryId) {return ;}
      let params = {
        categoryId: this.categoryId,
        pageSize: pageInfo.pageSize,
        pageNumber: pageInfo.pageNumber,
        status: this.currentStatus,
        nextCheckDate: this.nextCheckDate
      };
      if(this.currentStatus=="全部"){params.status = ""}
      api.getDevice((err, res) => {
        if (err) {
          if ( err.response.status === 403 && err.response.data.code==-2) {
            this.$message.error("请登录");
            session.clear();
            this.$router.push({ path: "/login" });
          } else if ( err.response.status === 500) {
            this.$message.error("系统出错，请稍后再试");
          } else if (err.response.status == 403) {
            this.$message.error("该账号没有此操作权限");
          }
          return;
        }
        if (res.data.code == 200) {
          if(res.data.data.deviceList.length==0){
            this.$message.info("暂无数据");
            return ;
          }
          this.deviceList = res.data.data.deviceList;
          if(!pageInfo.pageNumber) {
            this.paginations.pageNumber = res.data.data.pageInfo.pageNumber;
            this.paginations.pageSize = res.data.data.pageInfo.pageSize;
            this.paginations.totalRow = res.data.data.pageInfo.totalRow;
          }
        } else {
          this.$message.error("出错了，刷新一下吧");
        }
      }, params);
    },
    formatter(row, column) {
      return row.condition;
    },
    // 展示编辑框
    handleEdit(index, row) {
      var date = new Date().getTime();
      if(!this.role.isSuperAdmin){
        if(this.updatableTime.beginTime>date||this.updatableTime.endTime<date){
          this.$message.error("现在不是修改时间");
          return ;
        }
      }
      this.form.index = index;
      this.form.deviceId = row.deviceId;
      this.form.affiliation = row.affiliation;
      this.form.deviceName = row.deviceName;
      this.form.component = row.component;
      this.form.item = row.item;
      this.form.type = row.type;
      this.form.periodInMonths = row.periodInMonths;
      this.form.standardSource = row.standardSource;
      this.form.lastCheckDate = row.lastCheckDate;
      this.form.workOrderNumber = row.workOrderNumber;
      this.form.remark = row.remark;
      this.form.condition = row.condition;
      this.dialog.type = 'edit';
      this.dialog.title = '修改设备信息';
      this.dialog.show = true;
    },
    getTime() {
      api.getUpdatedTableTime((err, res) => {
        if (err) {
          if ( err.response.status === 403 && err.response.data.code==-2) {
            this.$message.error("请登录");
            session.clear();
            this.$router.push({ path: "/login" });
          } else if ( err.response.status === 500) {
            this.$message.error("系统出错，请稍后再试");
          } else if (err.response.status == 403) {
            this.$message.error("该账号没有此操作权限");
          }
          return;
        }
        if (res.data.code == 200) {
          this.updatableTime = res.data.data.updatableTime;
        } else {
          this.$message.error("出错了，刷新一下吧");
        }
      });
    },
    // 处理编辑
    onChange() {
      // console.log("data")
      let data = {};
      if(this.role.isSuperAdmin){
        data = {
          deviceId: this.form.deviceId,
          affiliation: this.form.affiliation,
          deviceName: this.form.deviceName,
          component: this.form.component,
          item: this.form.item,
          type: this.form.type,
          periodInMonths: this.form.periodInMonths,
          standardSource: this.form.standardSource,
          lastCheckDate: this.form.lastCheckDate,
          workOrderNumber: this.form.workOrderNumber,
          remark: this.form.remark,
          condition: this.form.condition
        };
      }else if(this.role.isAdmin){
        data = {
          deviceId: this.form.deviceId,
          lastCheckDate: this.form.lastCheckDate,
          workOrderNumber: this.form.workOrderNumber
        };
      }else{
        return ;
      }

      api.updateDevice((err, res) => {
        if (err) {
          if ( err.response.status === 403 && err.response.data.code==-2) {
            this.$message.error("请登录");
            session.clear();
            this.$router.push({ path: "/login" });
          } else if ( err.response.status === 500) {
            this.$message.error(err.response.data.msg);
            // this.$message.error("系统出错，请稍后再试");
          } else if (err.response.status == 403) {
            this.$message.error("该账号没有此操作权限");
          }
          return;
        }
        if (res.data.code == 200) {
          this.getDevices();
          this.$message("修改成功");
          this.dialog.show = false;
        } else {
          this.$message.error(res.data.msg);
        }
      }, data);
    },
    onCancel() {
      this.dialog.show = false;
    },
    // 删除功能
    handleDelete(index, rows) {
      this.$confirm("此操作将永久删除该设备, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let deviceId;
          api.deleteDevice((err, res) => {
            if (err) {
              if ( err.response.status === 403 && err.response.data.code==-2) {
                this.$message.error("请登录");
                session.clear();
                this.$router.push({ path: "/login" });
              } else if ( err.response.status === 500) {
                this.$message.error("系统出错，请稍后再试");
              } else if (err.response.status == 403) {
                this.$message.error("该账号没有此操作权限");
              }
              return;
            }
            if (res.data.code == 200) {
              this.deviceList.splice(index, 1);
              this.paginations.totalRow--;
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message.error("出错了，刷新一下吧");
            }
          }, rows.deviceId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 已超期和未完成添加样式
    rowClass: function(row, index) {
      if (row.row.status) {
        if (row.row.status === "已超期") {
          return { "background-color": "#ff0000", color: "#303133" };
        } else if (row.row.status === "未完成") {
          return { "background-color": "#fbff00" };
        }
      }
      return "";
    },
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.paginations.pageNumber = 1;
      this.getDevices(this.paginations);
    },
    // 切换页面
    handleCurrentChange(page) {
      this.paginations.pageNumber = page;
      this.getDevices(this.paginations);
    },
    // 添加设备弹框
    handleAdd(){
      this.form = {
        index: 0,
        deviceId: "",
        affiliation: "",
        deviceName: "",
        component: "",
        item: "",
        type: "",
        periodInMonths: "",
        standardSource: "",
        lastCheckDate: "",
        workOrderNumber: "",
        remark: "",
        condition: ""
      };
      this.dialog.type = 'add';
      this.dialog.title = '添加设备';
      this.dialog.show = true;
    },
    // 添加设备
    addDevice(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              categoryId: this.categoryId,
              affiliation: this.form.affiliation,
              deviceName: this.form.deviceName,
              component: this.form.component,
              item: this.form.item,
              type: this.form.type,
              periodInMonths: this.form.periodInMonths,
              standardSource: this.form.standardSource,
              lastCheckDate: this.form.lastCheckDate,
              workOrderNumber: this.form.workOrderNumber,
              remark: this.form.remark,
              condition: this.form.condition
            };
            api.addDevice((err, res) => {
              if (err) {
                if ( err.response.status === 403 && err.response.data.code==-2) {
                  this.$message.error("请登录");
                  session.clear();
                  this.$router.push({ path: "/login" });
                } else if ( err.response.status === 500) {
                  this.$message.error(err.response.data.msg);
                  // this.$message.error("系统出错，请稍后再试");
                } else if (err.response.status == 403) {
                  this.$message.error("该账号没有此操作权限");
                } else if (err.response.status == 400) {
                  this.$message.error("参数不合法");
                }
                return;
              }
              if (res.data.code == 200) {
                this.getDevices();
                this.$message("修改成功");
                this.dialog.show = false;
              } else {
                this.$message.error(res.data.msg);
              }
            }, data);
          } else {
            this.$message.error("请填写必填项");
            return false;
          }
        });
    },
    setSize() {
      this.tableHeight = document.body.clientHeight-200;
      if(this.tableHeight<420){
        this.tableHeight = "420px";
      }else{
        this.tableHeight = this.tableHeight + "px";
      }
    },
    // 渲染设备名称表头(搜索)
    renderSearchHeader(h, data) {
        return h("span",[
          h("span", ['设备名称']),
          h("el-button", {
              size: "small",
              class: "el-button--mini is-circle",
              style: "border: none;background:none;",
              on: {
                click: () => { this.showSearchBox() }
              }
          },[
            h("i",{
              class:"el-icon-search"
            })
          ])
        ])
    },
    showSearchBox(){
      this.$prompt('请输入关键字', '搜索设备', {
          confirmButtonText: '搜索',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          api.getDevice((err, res) => {
            if (err) {
              if ( err.response.status === 403 && err.response.data.code==-2) {
                this.$message.error("请登录");
                session.clear();
                this.$router.push({ path: "/login" });
              } else if ( err.response.status === 500) {
                this.$message.error("系统出错，请稍后再试");
              } else if (err.response.status == 403) {
                this.$message.error("该账号没有此操作权限");
              }
              return;
            }
            if (res.data.code == 200) {
              if(res.data.data.deviceList.length==0){
                this.$message.info("暂无数据");
                return ;
              }
              this.deviceList = res.data.data.deviceList;
              this.currentStatus = this.statusList[0];
              this.nextCheckDate = "";
              this.paginations.pageNumber = res.data.data.pageInfo.pageNumber;
              this.paginations.pageSize = res.data.data.pageInfo.pageSize;
              this.paginations.totalRow = res.data.data.pageInfo.totalRow;
            } else {
              this.$message.error("出错了，请重新搜索");
            }
          }, {deviceNameLike: value, categoryId: this.categoryId});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    },
    getTime() {
      api.getUpdatedTableTime((err, res) => {
        if (err) {
          if ( err.response.status === 403 && err.response.data.code==-2) {
            this.$message.error("请登录");
            session.clear();
            this.$router.push({ path: "/login" });
          } else if ( err.response.status === 500) {
            this.$message.error("系统出错，请稍后再试");
          } else if (err.response.status == 403) {
            this.$message.error("该账号没有此操作权限");
          }
          return;
        }
        if (res.data.code == 200) {
          this.updatableTime = {
            beginTime: new Date(res.data.data.updatableTime.beginTime).getTime(),
            endTime: new Date(res.data.data.updatableTime.endTime).getTime()
          }
        } else {
          this.$message.error("出错了，刷新一下吧");
        }
      });
    },
    changeStatus(index){
      this.currentStatus = this.statusList[index];
      this.nextCheckDate = "";
      this.getDevices();
      // this.$emit('getCategory', false, this.currentStatus);
    },
    changeTime(){
      this.currentStatus = this.statusList[0];
      this.getDevices();
    },
    reset(){
      this.currentStatus = this.statusList[0];
      this.nextCheckDate = "";
      this.getDevices();
    }
  },
  mounted() {
    this.initValue();
    this.getDevices();
    window.onresize = () => {
      this.setSize();
    }
  },
  created() {
    this.setSize();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table_container {
  margin: 45px 10px 10px;
}
.table_filter{
  margin: 5px 10px;
}
span{
  font-size: 12px;
}
 /* 表格样式 */
.table_container .el-table {
  font-size: 13px;
}
div.form {
  padding-right: 50px;
}
/* 分页和添加设备按钮 */
.addDeviceBtn{
  text-align: left;
  margin-top: 5px;
}
.pagination {
  text-align: right;
  margin-top: 5px;
}
</style>
