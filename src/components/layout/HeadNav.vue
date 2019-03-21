<template>
    <header class="head-nav" id='header_container'>
        <el-row style="margin:0 10px;">
            <el-col :span="16" class='logo-container'>
                <img src="../../assets/logo-white1.jpg" height="200" class='logo' alt="">
                <span class='title'>中国南方电网</span>
            </el-col>
            <el-col :span="6" class="username-container">
			    <el-dropdown trigger="click">
			      <span class="el-dropdown-link username">
			        {{role.username}}<i class="el-icon-arrow-down el-icon--right"></i>
			      </span>
			      <el-dropdown-menu slot="dropdown">
			      	<el-dropdown-item @click.native="getInfo()">个人信息</el-dropdown-item>
			        <el-dropdown-item @click.native="logout()">用户注销</el-dropdown-item>
			      </el-dropdown-menu>
			    </el-dropdown>
		 	</el-col>
        </el-row>
    </header>
</template>

<script>
import api from '../../services/index.js';
import session from '../../components/session.js';

    export default {
      name: 'HeadNav',
      data(){
        return{
            userinfo:'',
            role: {
            	username: '',
            }

        }
      },
      created(){
      	this.role.username = session.get("username");
      },
      methods:{
      	getInfo() {
            this.$router.push({name: 'UserInfo'});
      	},
      	logout() {
      		this.$confirm('此操作将注销用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.logout((err, res) => {
                    if (err || res.status !== 200) {
                        this.$message.error("出错了，刷新一下吧");
                        return;
                    }else if (res.data.code == 200) {
                        this.$router.push({name: 'login'});
                        session.clear();
                    } else {
                        this.$message.error("出错了，刷新一下吧");
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消注销'
                });
            });
      	}
      }
    }
</script>

<style scoped>
    .logo-container {
        line-height: 60px;
        min-width: 400px;
    }
    .logo-container .logo {
        height: 50px;
        /* width: 50px; */
        margin-right: 5px;
        vertical-align: middle;
        display: inline-block;
    }
    .logo-container .title{
        vertical-align: middle;
        font-size: 22px;
        font-family: cursive;
        letter-spacing: 3px;
    }
    .username-container {
        float: right;
        width: 250px;
        margin-top: 18px;
    }
    .username-container .username {
    	height: 50px;
        width: 50px;
        font-size: 18px;
        color: #F3F4F6;
    }
   .head-nav {
        width: 100%;
        height: 60px;
        min-width:600px;
        padding: 5px;
        background: #324057;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 100;
        color: #FFF;
        border-bottom: 1px solid #1F2D3D;
    }
    .head-nav .logout {
        vertical-align: middle;
        cursor: pointer;
    }


</style>
