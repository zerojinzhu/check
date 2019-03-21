<template>
  <div>
    <el-row class="menu_page">
      <el-col>
        <el-menu
          mode="vertical"
          theme="dark"
          class="el-menu-vertical-demo"
          :default-active="activeItem"
          :collapse=false
          background-color="#324057"
          text-color="#fff"
          active-text-color="#42b983">
          <template>
            <el-submenu index="factory">
              <template slot="title">
                <span slot="title">单位</span>
              </template>
              <router-link v-for="(item) in factoryList" :to="getFactoryPath(item.factoryId)"  :key="item.factoryId">
                <el-menu-item :index="item.factoryId.toString()">
                  <span slot="title">{{item.factoryShortName}}</span>
                </el-menu-item>
              </router-link>
            </el-submenu>
            <router-link to="/userinfo">
              <el-menu-item index="userinfo">
                <span slot="title">个人信息</span>
              </el-menu-item>
            </router-link>
            <router-link to="/manageuser">
              <el-menu-item index="manageuser" v-if="role.isSuperAdmin">
                <span slot="title">管理用户</span>
              </el-menu-item>
            </router-link>
            <router-link to="/factoryinfo">
              <el-menu-item index="factoryinfo" v-if="role.isSuperAdmin">
                <span slot="title">电厂单位信息</span>
              </el-menu-item>
            </router-link>
            <router-link to="/updatetime" v-if="role.isSuperAdmin">
              <el-menu-item index="updatetime">
                <span slot="title">更新信息时间</span>
              </el-menu-item>
            </router-link>
            <el-menu-item index="export" @click.native="exportTable">
              <span slot="title">导出报表</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../../services/index.js';
import validate from "../validate.js";
import session from '../session.js';
let forbid = false;
export default {
  name: 'leftmenu',
  data () {
    return {
      factoryList: [],
      activeItem: "factory",
      role: {
        isSuperAdmin: false,
        isAdmin: false
      }
    }
  },
  watch: {
    "$route" (){
      if(this.$route.params.factoryId){
        this.activeItem = this.$route.params.factoryId;
      }else{
        let str = this.$route.path;
        var pa = /^\/(\S*)/i;
        this.activeItem = str.match(pa)[1];
      }
    }
  },
  methods:{
    initValue(){
      this.role = validate();
    },
    getFactoryPath(factoryId){
      return "/factory/" + factoryId;
    },
    showFactory(){
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
        if(res.data.code == 200){
          // 加入没有工厂id则默认为第一个
          if(!this.$route.params.factoryId) {
            this.$route.params.factoryId = res.data.data.factoryList[0].factoryId;
          }
          this.factoryList = res.data.data.factoryList;
        }else{
           this.$message.error('出错了，刷新一下吧');
        }
      });
    },
    exportTable(){
      if(forbid) { this.$message.info('报表正在导出，请耐心等待'); return; }
      forbid = true;
      setTimeout(() => {
        forbid = false;
      }, 5000);
      this.$message.info('导出报表需要一定时间，请耐心等待');
      api.reportAllDevice().then(res => { // 处理返回的文件流
          const blob = new Blob([res.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
          const fileName = '报表';
          const elink = document.createElement("a");
          elink.download = fileName + ".xlsx";
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
      })
    }
  },
  mounted() {
    this.showFactory();
    this.initValue();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .menu_page{
    position: fixed;
    top:71px;
    left:0;
    min-height: 100%;
    background-color: #324057;
    z-index: 99;
  }
  .fa-margin{
    margin-right:5px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
    min-height: 400px;
  }
  .el-menu-vertical-demo{
    width:35px;
  }
  .el-submenu .el-menu-item{
    min-width:180px;
  }
  .menu_page a:-webkit-any-link{
    text-decoration: none;
  }
</style>
