<template>
   <div class="update-time">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>管理员修改设备信息时间</span>
      </div>
      <el-form ref="form" :model="timeForm" label-width="80px">
        <el-form-item label="起始时间">
          <el-col :span="11">
            <el-date-picker
            type="date" placeholder="起始日期"
            v-model="timeForm.beginDay"
            value-format="yyyy-MM-dd"
            format="yyyy年MM月dd日"
            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="11">
            <el-time-picker
            type="fixed-time" placeholder="起始时间"
            v-model="timeForm.beginTime"
            value-format="HH:mm"
            format="HH:mm"
            style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-col :span="11">
            <el-date-picker
            type="date" placeholder="结束日期"
            v-model="timeForm.endDay"
            value-format="yyyy-MM-dd"
            format="yyyy年MM月dd日"
            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="11">
            <el-time-picker
            type="fixed-time" placeholder="结束时间"
            v-model="timeForm.endTime"
            value-format="HH:mm"
            format="HH:mm"
            style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onChangeTime">修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import api from '../../services/index.js';
import session from '../session.js';

export default {
  name: 'UpdateTime',
  data () {
    return {
      timeForm: {
        beginDay: '',
        beginTime: '',
        endDay: '',
        endTime: ''
      }
    }
  },
  methods: {
    onChangeTime(){
      let beginTime = this.timeForm.beginDay + " " +  this.timeForm.beginTime;
      let endTime =  this.timeForm.endDay + " " +  this.timeForm.endTime;
      api.updateUpdatedTableTime((err, res) => {
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
        else if (res.data.code == 200) {
          this.$message("修改成功");
        } else {
          this.$message.error("出错了，刷新一下吧");
        }
      }, beginTime, endTime);
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
          } else if (err.response.status === 403) {
            this.$message.error("该账号没有此操作权限");
          }
          return;
        }
        if (res.data.code == 200) {
          this.timeForm.beginDay = res.data.data.updatableTime.beginTime.substr(0,10);
          this.timeForm.beginTime = res.data.data.updatableTime.beginTime.substr(11,5);
          this.timeForm.endDay = res.data.data.updatableTime.endTime.substr(0,10),
          this.timeForm.endTime = res.data.data.updatableTime.endTime.substr(11,5);
        } else {
          this.$message.error("出错了，刷新一下吧");
        }
      });
    }
  },
  mounted() {
    this.getTime();
  },
}
</script>

<style scoped>
.box-card {
  width: 500px;
  margin: 40px auto;
}
.el-col{
  margin-right: 10px;
}
</style>
