import instance from './instance.js'

// 添加电厂设备检修信息(添加表中的一行)
function addDevice(fn, data) {
  instance.post('/super_admin/device/add', data)
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
// 获取电厂设备检修信息(获取整张表)
function getDevice(fn, params) {
  instance.get('/user/device/get', {
    params: params
  })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
// 更新电厂设备检修信息(修改表中一行)
function updateDevice(fn, data) {
  instance.post('/admin/device/update', data)
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err, res);
    });
}
// 删除电厂设备检修信息(删除表中一行)
function deleteDevice(fn, deviceId) {
  instance.post('/super_admin/device/delete', {
    deviceId
  })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
// 导出设备表
function reportAllDevice(fn) {
  return instance({
    method: "get",
    url: '/user/device/report',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: 'arraybuffer'
  })
}

export {
  addDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  reportAllDevice
}
