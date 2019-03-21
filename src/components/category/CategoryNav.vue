<template>
    <div class="device-nav"
      :style="{'width':this.win_size.width+'px'}">
        <span>{{factoryList[0].factoryFullName}}</span>
        <span>/ </span>
        <el-dropdown split-button type="primary" size="mini">
          {{currentCategory.categoryName}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in categoryList" :key="item.categoryId" :index="index" @click.native="changeCategory(index)">
              {{item.categoryName}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="btnRight" v-if="role.isSuperAdmin">
          <el-row>
            <el-button size="mini" type="primary" icon="el-icon-edit" title="修改类别名称"  @click.native="updateCategoryName" circle></el-button>
          </el-row>
        </div>
    </div>
</template>

<script>
import api from "../../services/index.js";
import validate from "../validate.js";
import session from '../session.js';

export default {
  name: "CategoryNav",
  data() {
    return {
      activeIndex: "1",
      factoryList: [{}],
      categoryList: [],
      currentCategory: {index: 0},
      win_size: {
        height: ''
      },
      factoryId: "",
      role: {
        isSuperAdmin: true
      },
      visible: false,
      // 所上传的文件
      fileList: []
    };
  },
  methods: {
    initValue(){
      this.factoryId = this.$route.params.factoryId;
      this.role = validate();
    },
    // 获取类别列表categoryList
    showCategory() {
      // let factoryId = this.$route.params.factoryId;
      api.getCategory((err, res) => {
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
          if(res.data.data.factoryList.length==0){
            this.$router.push({path: "/blank"});
            return ;
          }
          this.factoryList = res.data.data.factoryList;
          this.categoryList = res.data.data.factoryList[0].categoryList;
          this.currentCategory = this.categoryList[0];
          this.currentCategory.index = 0;
          this.factoryId = res.data.data.factoryList[0].factoryId;
          this.$emit('getCategory', this.currentCategory.categoryId);
        } else {
          this.$message.error("出错了，刷新一下吧");
        }
      }, this.factoryId);
    },
    // 改变当前类别
    changeCategory(index){
      this.currentCategory = this.categoryList[index];
      this.currentCategory.index = index;
      this.$emit('getCategory', this.currentCategory.categoryId);
    },
    // 设置宽度
    setSize() {
      this.win_size = {
          width:document.body.clientWidth-250
      }
    },
    // 修改类别名称
    updateCategoryName(){
      this.$prompt('请输入类别名称', '修改类别名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          api.updateCategory((err, res) => {
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
              this.currentCategory.categoryName = value;
              this.categoryList[this.currentCategory.index].categoryName = value;
              this.$message('提交成功');
            } else {
              this.$message.error("出错了，刷新一下吧");
            }
          }, this.currentCategory.categoryId, value);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    }
  },
  mounted() {
    this.initValue();
    this.showCategory();
    window.onresize = () => {
      this.setSize();
    }
  },
  created() {
      this.setSize();
  },
  watch: {
    '$route' (){
      if(this.$route.params.factoryId != this.factoryId){
        this.factoryId = this.$route.params.factoryId;
        this.showCategory();
        console.log(this.factoryId);
      }
    }
  }
};
</script>

<style scoped>
.device-nav{
  position: fixed;
  top: 71px;
  left: 183px;
  width: 100%;
  line-height: 40px;
  padding: 0 20px;
  border-bottom: solid 1px #e6e6e6;
  background-color: white;
  z-index: 99;
}
.el-menu-demo {
  padding: 0 10px;
}
.el-menu--horizontal > .el-menu-item {
  height: 50px;
  line-height: 50px;
}
span{
  font-size: 12px;
}
a:-webkit-any-link {
  text-decoration: none;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
div.rightBtn{
  display: inline-block;
}
.btnRight{
  float: right;
  margin-right: 0 !important;
}

</style>

