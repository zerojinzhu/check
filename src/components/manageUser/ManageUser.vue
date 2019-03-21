<template>
  <div class="user-info">
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column label="用户名" width="280">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="200">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            @click.native="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native="DeleteUser(scope.$index, scope.row)"
            v-if="role.isSuperAdmin">删除</el-button>
          <el-button
            size="mini"
            type="info"
            @click.native="handleReset(scope.row)"
            v-if="role.isSuperAdmin">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>


  <div style="margin-top: 20px">
    <el-button size="mini" type="primary" @click.native="handleAdd()" >添加用户</el-button>
    <!-- 弹窗 -->
    <el-dialog :title="form.title" :visible.sync="dialogFormVisible"  :append-to-body='true'>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password" >
          <el-input v-model="form.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth" prop="roleName" >
          <el-radio-group v-model="form.roleName">
            <el-radio border label="用户"></el-radio>
            <el-radio border label="管理员"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="form.type=='edit'" @click.native="EditUserInfo('ruleForm')">修改</el-button>
        <el-button type="primary" v-if="form.type=='add'" @click.native="AddUser('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <div class="block" style="float:right;">
      <el-pagination
      :page-sizes="paginations.page_sizes"
      :page-size="paginations.pageSize"
      :layout='paginations.layout'
      :total="paginations.totalRow"
      :current-page.sync="paginations.pageNumber"
      @current-change='handleCurrentChange'
      @size-change='handleSizeChange'>
      </el-pagination>
    </div>
  </div>
</div>

</template>

<script>
import api from "../../services/index.js";
import session from "../session.js";
import validate from "../validate.js";

export default {
  name: "ManageUser",
  data() {
    var check = (rule, value, callback) => {
      if (value == "用户") {
        this.form.roleId = "1000";
        callback();
      } else if (value == "管理员") {
        this.form.roleId = "1001";
        callback();
      } else {
        callback(new Error("请选择权限"));
      }
    };
    return {
      // 用户的信息
      role: {
        isSuperAdmin: false,
        isAdmin: false
      },
      // 表格的信息
      userList: [],
      // 弹窗的信息
      form: {
        title: "",
        username: "",
        password: "",
        roleName: "",
        userId: "",
        roleId: "",
        type: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 需要给分页组件传的信息
      paginations: {
        pageNumber: 1, // 当前位于哪页
        totalRow: 0, // 总数
        pageSize: 20, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      rules: {
        username: [
          {
            min: 2,
            max: 16,
            message: "长度在 2 到 16 个字符",
            trigger: "blur"
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{2,16}$/,
            message: "用户名格式有误",
            trigger: "blur"
          },{
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur"
          },
          { 
          	pattern: /^\w{6,18}$/, 
          	message: "密码格式有误", 
          	trigger: "blur" 
          },
          {
	        required: true,
	        message: "请输入密码",
	        trigger: "blur"
	      }
        ],
        roleName: [
        { 
        	validator: check, 
        	trigger: "blur" 
        },
        {
          required: true,
          message: "请选择权限",
          trigger: "blur"
        }]
      }
    };
  },
  mounted() {
    this.initValue();
    this.getUserInfo();
  },
  methods: {
    // 初始化
    initValue() {
      this.role = validate();
      // console.log(this.role);
    },
    // 获取用户信息userList展示表格内容
    getUserInfo(pageInfo = {}) {
      let { pageNumber, pageSize } = pageInfo;
      api.getUserInfo(
        (err, res) => {
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
            this.userList = res.data.data.userList;
            if (!pageInfo.pageNumber) {
              this.paginations.pageNumber = parseInt(
                res.data.data.pageInfo.pageNumber
              );
              this.paginations.pageSize = parseInt(
                res.data.data.pageInfo.pageSize
              );
              this.paginations.totalRow = parseInt(
                res.data.data.pageInfo.totalRow
              );
            }
          } else {
            this.$message.error("出错了，刷新一下吧");
          }
        },
        { pageNumber, pageSize }
      );
    },
    // 展示添加功能的弹窗
    handleAdd(row) {
      (this.form = {
        title: "添加用户信息",
        username: "",
        password: "",
        roleName: "",
        userId: "",
        roleId: "",
        type: "add"
      }),
      this.dialogFormVisible = true;
      if(this.rules.username.length == 2) {
      	this.rules.username.push({
            required: true,
            message: "请输入用户名",
            trigger: "blur"
        });
      }
      if(this.rules.password.length == 2) {
      	this.rules.password.push({
	        required: true,
	        message: "请输入密码",
	        trigger: "blur"
	    });
      }
    },
    // 添加用户信息
    AddUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            username: this.form.username,
            password: this.form.password,
            roleId: this.form.roleId
          };
          api.addUserInfo((err, res) => {
            if (err) {
              if ( err.response.status === 403 && err.response.data.code==-2) {
                this.$message.error("请登录");
                session.clear();
                this.$router.push({ path: "/login" });
              } else if ( err.response.status === 500) {
                this.$message.error("系统出错，请稍后再试");
              } else if (err.response.status == 403) {
                this.$message.error("该账号没有此操作权限");
              } else if (err.response.status == 400) {
                this.$message.error("参数不合法");
              }
              return;
            }
            if (res.data.code == 200) {
              // console.log(res);
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.getUserInfo(this.paginations);
            } else {
              this.$message.error("出错了，刷新一下吧");
            }
          }, data);
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.paginations.pageNumber = 1;
      this.getUserInfo(this.paginations);
    },
    // 切换页面
    handleCurrentChange(page) {
      this.paginations.pageNumber = page;
      this.getUserInfo(this.paginations);
    },
    // 展示编辑功能的弹窗
    handleEdit(row) {
      this.form = {
        title: "修改用户信息",
        username: row.username,
        password: "",
        roleName: row.roleName,
        userId: row.userId,
        roleId: row.roldId,
        type: "edit"
      };
      this.dialogFormVisible = true;
      if(this.rules.username.length == 3) {
      	this.rules.username.splice(2,1);
      }
      if(this.rules.password.length == 3) {
      	this.rules.password.splice(2,1);
      }
    },
    // 编辑用户信息
    EditUserInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            userId: this.form.userId,
            username: this.form.username,
            password: this.form.password,
            roleId: this.form.roleId
          };
          api.updateUserInfo((err, res) => {
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
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.getUserInfo(this.paginations);
            } else {
              this.$message.error("出错了，刷新一下吧");
            }
          }, data);
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    // 删除某用户
    DeleteUser(index, row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let userId = row.userId;
          api.deleteUserInfo((err, res) => {
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
              this.userList.splice(index, 1);
              this.paginations.totalRow--;
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else if(res.data.code == -1) {
            	this.$message(res.data.msg);

            } else {
              this.$message.error("出错了，刷新一下吧");
            }
          }, userId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 重置密码
    handleReset(row) {
      let userId = row.userId;
      this.$confirm("此操作将重置密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.resetPass((err, res) => {
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
              this.$message({
                type: "success",
                message: "重置成功!"
              });
            } else {
              this.$message.error("出错了，刷新一下吧");
            }
          }, userId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-info {
  margin: 8px;
}
</style>
