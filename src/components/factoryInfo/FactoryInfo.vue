<template>
   <div class="factory-info">
    <el-table :data="factoryList" style="width: 100%" border>
    <el-table-column label="电厂单位全名" width="300">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.factoryFullName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="电厂单位简称" width="300">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.factoryShortName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="role.isSuperAdmin">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="warning"
          @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click.native="DeleteFactory(scope.$index, scope.row)" >删除</el-button>
		  <el-button
    	 	size="mini" 
    	 	type="primary"
    	 	icon="el-icon-upload2"
    	 	title="导入数据"
    	 	@click.native="handleUpload(scope.$index, scope.row)"
    	 	slot="reference"
    	 	circle></el-button>
    	 <el-button
    	    size="mini"
    	    type="primary"
    	    icon="el-icon-download"
    	    title="导出数据"
    	    @click.native="exportTable(scope.$index, scope.row)"
    	    circle></el-button>
      </template>
    </el-table-column>
  </el-table>
    <!-- 导入文件表单 -->
	<form id="uploadform" style="display:none;">
    	<input name="importFile" type="file" accept=".xlsx" ref="importFile" v-on:change="confirmUpload()"></input>
    	<input name="factoryId" :value='this.upload.CurrentfactoryId'></input>
	</form>
  	<div style="margin-top: 10px">
    	<el-button size="mini" type="primary" @click.native="handleAdd()" v-if="role.isSuperAdmin">添加电厂单位信息</el-button>
    </div>
    <!-- 弹窗 -->
    <el-dialog
    	:title="form.title"
    	:visible.sync="dialogFormVisible"
    	:append-to-body='true'>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="电厂单位全名" :label-width="formLabelWidth" prop="factoryFullName">
          <el-input v-model="form.factoryFullName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电厂单位简称" :label-width="formLabelWidth" prop="factoryShortName">
          <el-input v-model="form.factoryShortName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
         <el-button type="primary" v-if="form.type=='edit'" @click.native="EditFactoryInfo('ruleForm')">修改</el-button>
        <el-button type="primary" v-if="form.type=='add'" @click.native="AddFactory('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <div class="block" style="float:right;">
      <el-pagination
      :page-sizes="paginations.page_sizes"
      :page-size="paginations.pageSize"
      :layout="paginations.layout"
      :total="paginations.totalRow"
      :current-page.sync='paginations.pageNumber'
      @current-change='handleCurrentChange'
      @size-change='handleSizeChange'>
      </el-pagination>
    </div>

</div>
</template>

<script>
import api from "../../services/index.js";
import session from "../session.js";
import validate from "../validate.js";

export default {
  name: "FactoryInfo",
  data() {
    return {
      // 用户的信息
      role: {
        isSuperAdmin: false,
        isAdmin: false
      },
      // 表格的信息
      factoryList: [],
      // 弹窗的信息
      form: {
        title: "",
        factoryId: "",
        factoryFullName: "",
        factoryShortName: "",
        type: ""
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      // 上传文件所需的参数
      upload: {
      	CurrentfactoryId: ""
      },
      // 需要给分页组件传的信息
      paginations: {
        pageNumber: 1, // 当前位于哪页
        totalRow: 0, // 总数
        pageSize: 10, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      rules: {
        factoryFullName: [
          { min: 2, max: 32, message: "长度在 2 到 32 个字符", trigger: "blur" },
          {trigger: "blur" ,required: true, message: "请填写电厂单位全名"}
        ],
        factoryShortName: [
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
          {trigger: "blur" ,required: true, message: "请填写电厂单位简称"}
        ]
      }
    };
  },
  mounted() {
    this.initValue();
    this.getFactoryInfo();
  },
  methods: {
    // 初始化
    initValue() {
      this.role = validate();
    },
    // 获取电厂单位信息factoryList展示表格内容
    getFactoryInfo(pageInfo = {}) {
      let { pageNumber, pageSize } = pageInfo;
      api.getFactory((err, res) => {
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
          this.factoryList = res.data.data.factoryList;
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
      },  { pageNumber, pageSize });
    },
    // 展示添加功能的弹窗
    handleAdd() {
      (this.form = {
        title: "添加电厂单位信息",
        factoryId: "",
        factoryFullName: "",
        factoryShortName: "",
        type: "add"
      }),
      this.dialogFormVisible = true;
    },
    // 添加电厂单位信息
    AddFactory(formName) {
      this.$refs[formName].validate(valid => {
        let factoryFullName = this.form.factoryFullName;
        let factoryShortName = this.form.factoryShortName;
        if (valid) {
          if (this.role.isSuperAdmin) {
            api.addFactory(
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
                  } else if (err.response.status == 400) {
                    this.$message.error("参数不合法");
                  }
                  return;
                }
                if (res.data.code == 200) {
                  this.$message({
                    showClose: true,
                    message: "添加成功",
                    type: "success"
                  });
                  this.dialogFormVisible = false;
                  this.getFactoryInfo();
                } else {
                  this.$message.error("出错了，刷新一下吧");
                }
              },
              factoryFullName,
              factoryShortName
            );
          } else {
            this.$message.error("请填写必填项");
            return false;
          }
        } else {
          this.$message({
            message: "该账号没有此操作权限",
            type: "warning"
          });
        }
      });
    },
    // 每页多少条切换
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.paginations.pageNumber = 1;
      this.getFactoryInfo(this.paginations);
    },
    // 切换页面
    handleCurrentChange(page) {
      this.paginations.pageNumber = page;
      this.getFactoryInfo(this.paginations);
    },
    // 展示编辑功能的弹窗
    handleEdit(index, row) {
      this.form = {
        title: "修改该电厂单位信息",
        factoryId: row.factoryId,
        factoryFullName: row.factoryFullName,
        factoryShortName: row.factoryShortName,
        type: "edit"
      };
      this.dialogFormVisible = true;
    },
    // 编辑电厂单位信息
    EditFactoryInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let factoryId = this.form.factoryId;
          let factoryFullName = this.form.factoryFullName;
          let factoryShortName = this.form.factoryShortName;
          api.updateFactory(
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
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.dialogFormVisible = false;
                this.getFactoryInfo(this.paginations);
              } else {
                this.$message.error("出错了，刷新一下吧");
              }
            },
            factoryId,
            factoryFullName,
            factoryShortName
          );
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    // 删除某电厂单位
    DeleteFactory(index, row) {
      this.$confirm("此操作将永久删除该电厂单位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let factoryId = row.factoryId;
          api.deleteFactory((err, res) => {
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
              this.factoryList.splice(index, 1);
              this.paginations.totalRow--;
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            } else {
              this.$message.error("出错了，刷新一下吧");
            }
          }, factoryId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 打开上传文件的弹出框
    handleUpload(index, row) {
      this.upload.CurrentfactoryId = row.factoryId;
      this.$refs.importFile.click();
    },
    // 确认导入列表
    confirmUpload() {
    	this.$confirm('此操作将上传 '+this.$refs.importFile.files[0].name+' , 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.info('该过程耗时较长，请耐心等待');
          this.importTable();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消上传'
          });  
          this.$refs.importFile.value = null;        
        });
    },
    // 导入报表至后台
    importTable() {
      let fd = new FormData(document.getElementById("uploadform"));
      // fd.append("file", this.upload.importFile);
      // fd.append("factoryId", this.upload.CurrentfactoryId);
      // console.log(fd.get('importFile'));
      api.importTable((err, res) => {
          if (err) {
            if (err.response.status === 403 && err.response.data.code==-2) {
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
              message: "文件上传成功！",
              type: "success"
            });
            this.visible = false;
          } else {
            this.$message.error("出错了，刷新一下吧");
          }
        },fd);
    },
    // 导出报表
    exportTable(index, row) {
      let factoryId = row.factoryId;
      this.$message.info('导出表格需要一定时间，请耐心等待');
      api
        .reportDevice((err, res) => {
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
              message: "导出成功!"
            });
          } else {
            this.$message.error("出错了，刷新一下吧");
          }
        }, factoryId)
        .then(res => {
          // 处理返回的文件流
          //创建一个blob对象,file的一种
          let blob = new Blob([res.data]);
          const fileName = "报表";
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName + ".xlsx";
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(link.href); // 释放URL 对象
          document.body.removeChild(link);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.factory-info {
  margin: 8px;
}
</style>
