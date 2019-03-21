<template>
  <div class="user-info">
    <el-card shadow="always">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button style="float: right;" size="mini" type="danger"  @click.native="dialogFormVisible = true">修改密码</el-button>
        <!-- 修改密码的弹窗 -->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :append-to-body='true'>
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm.pass" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click.native="updatePass('ruleForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '../../services/index.js';
import session from '../session.js';

export default {
  name: 'UserInfo',
  data () {
    var validatePass = (rule, value, callback) => {
      if(this.ruleForm.pass == '') {
        callback();
      }else {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
      
    };
    return {
      dialogFormVisible: false,
      ruleForm: {
          pass: '',
          checkPass: ''
      },
      rules: {
          pass: [
            { min: 6, max: 18, message: '长度在 6 到 18 个字符',trigger: 'blur'},
            { pattern: /^\w{6,18}$/, message: '密码格式有误',trigger: 'blur'}
          ],
          checkPass: [
            { validator: validatePass, trigger: 'blur' }
          ],
      },
      form: {
          username: '',
          userId: '',
          roleName: ''
      }
    }
  },
  mounted() {
      this.form = {
        username: session.get("username"),
        userId: session.get("userId"),
        roleName: session.get("roleName")
      };
  },
  methods: {
      updatePass(formName) {
        if(this.ruleForm.pass == '' && this.ruleForm.checkPass == '') {
          this.dialogFormVisible = false;
        }else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data = {
                userId: this.form.userId,
                password: this.ruleForm.checkPass
              }
              api.updateUserInfo((err, res) => {
                if (err) {
                  if ( err.response.status === 403 && err.response.data.code==-2) {
                    this.$message.error("请登录");
                    session.clear();
                    this.$router.push({ path: "/login" });
                  } else if ( err.response.status === 500) {
                    this.$message.error("系统出错，请稍后再试");
                  } else if (err.response.status === 403) {
                    this.$message.error("该账号没有此操作权限");
                  }
                  return;
                }
                if (res.data.code == 200) {
                  this.$message("修改成功");
                  this.dialogFormVisible = false;
                } else {
                  this.$message.error("出错了，刷新一下吧");
                }
              },data);
            } else {
              this.$message.error("请填写必填项");
              return false;
            }
          });
        }
        
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-info {
  width: 500px;
  margin: 80px auto;
}
</style>
