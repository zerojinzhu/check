<template>
  <div class="hello">
    <img src="../../assets/login.jpg" alt="">
    <h1>{{ msg }}</h1>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-row>
            <el-button type="primary" @click.native="Login('ruleForm')">登录</el-button>
            <el-button type="danger" @click.native="Reset('ruleForm')" style="float:right;">重置</el-button>
          </el-row>
        </el-form>
  </div>
</template>

<script>
import api from '../../services/index.js'
import session from '../../components/session.js'

export default {
  name: 'Login',
  data () {
    return {
      msg: '欢迎使用定检计划管理平台',
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在 2 到 16 个字符',trigger: 'blur'},
            { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]{2,16}$/, message: '用户名格式有误',trigger: 'blur'}
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符',trigger: 'blur'},
            { pattern: /^\w{6,18}$/, message: '密码格式有误',trigger: 'blur'}
          ]
      },
      ip:''
    };
  },
  methods: {
    Login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //用户登录接口
          let username = this.ruleForm.username;
          let password = this.ruleForm.password;
          api.login((err, res) => {
            if (err || res.status !== 200) {
              this.$message.error("出错了，刷新一下吧");
              return;
            }
            if (res.data.code == 403) {
              this.$message.error("该账号没有此操作权限");
            } else if (res.data.code == 200) {
              session.set('userId',res.data.data.userInfo.userId);
              session.set('username',res.data.data.userInfo.username);
              session.set('roleName',res.data.data.userInfo.roleName);
              session.set('roleId',res.data.data.userInfo.roleId);
              this.$router.push({name: 'factory'});
            } else {
              this.$message.error("出错了，刷新一下吧");
            }
          },username,password)
        } else {
          this.$message({
          message: '请输入正确的用户名密码',
          type: 'dager'
        });
          return false;
        }
      });
    },
    Reset(formName) {
      this.$refs[formName].resetFields();
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img{
    position:absolute;
    left:0px;
    top:0px;
    width:100%;
    height:100%;
    z-Index:-1;
}
h1{
  margin-top: 50px;
  color: white;
  text-align: center;
}
.form{
  width: 200px;
  padding: 38px;
  margin: auto;
  background-color: white;
  border-radius: 5px;
}
</style>
