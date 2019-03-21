import instance from './instance.js'

function addUserInfo(fn, data) {
  instance.post('/super_admin/user_info/add', data)
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
function getUserInfo(fn, params) {
  instance.get('/super_admin/user_info/get', {
      params: params
    })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
function updateUserInfo(fn, data) {
  instance.post('/user/user_info/update', data)
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
function deleteUserInfo(fn, userId) {
  instance.post('/super_admin/user_info/delete', {
      userId
    })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
function resetPass(fn, userId) {
  instance.post('/super_admin/user_info/reset_pass', {
      userId
    })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}

export {
  addUserInfo,
  getUserInfo,
  updateUserInfo,
  deleteUserInfo,
  resetPass
}
