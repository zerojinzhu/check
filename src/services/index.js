// import api from './a.js';
// export default api;

// 4.2.1 用户信息
import {
  login,
  logout
} from './login.js'

// 4.2.2 获取用户信息
import {
  addUserInfo,
  getUserInfo,
  updateUserInfo,
  deleteUserInfo,
  resetPass
} from "./userInfo.js";

// 4.3 电厂单位信息
import {
  addFactory,
  getFactory,
  updateFactory,
  deleteFactory,
  reportDevice,
  importTable
} from "./factoryInfo.js";

// 4.4 电厂设备类别信息
import {
  getCategory,
  updateCategory
} from "./category.js";

// 4.5 电厂设备检修信息
import {
  addDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  reportAllDevice
} from "./device.js";

// 4.6 电厂设备检修信息可更新时间设置
import {
  getUpdatedTableTime,
  updateUpdatedTableTime
} from "./updateTime.js";



export default {
  login,
  logout,

  addUserInfo,
  getUserInfo,
  updateUserInfo,
  deleteUserInfo,
  resetPass,

  addFactory,
  getFactory,
  updateFactory,
  deleteFactory,
  reportDevice,
  importTable,

  getCategory,
  updateCategory,

  addDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  reportAllDevice,

  getUpdatedTableTime,
  updateUpdatedTableTime
}
