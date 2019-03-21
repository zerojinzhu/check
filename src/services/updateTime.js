import instance from './instance.js'

// 4.6获取 检修信息可更新 时间
function getUpdatedTableTime(fn){
  instance.get('/user/updatable_time/get')
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}

// 更新 检修信息可更新时间
function updateUpdatedTableTime(fn, beginTime, endTime) {
  instance.post('/super_admin/updatable_time/update', {
    beginTime,
    endTime
  })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}

export {
  getUpdatedTableTime,
  updateUpdatedTableTime
}