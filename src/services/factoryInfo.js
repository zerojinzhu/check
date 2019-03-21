import instance from './instance.js'

function addFactory(fn, factoryFullName, factoryShortName) {
  instance.post('/super_admin/factory/add', {
      factoryFullName,
      factoryShortName
    })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
function getFactory(fn, params) {
  instance.get('/user/factory/get',{
    params: params
  })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
function updateFactory(fn, factoryId, factoryFullName, factoryShortName) {
  instance.post('/super_admin/factory/update', {
      factoryId,
      factoryFullName,
      factoryShortName
    })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
function deleteFactory(fn, factoryId) {
  instance.post('/super_admin/factory/delete', {
      factoryId
    })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}

function reportDevice(fn, factoryId) {
  return instance({
    method: "get",
    url: '/super_admin/factory/device/export',
    params: {
      factoryId
    },
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    responseType: 'arraybuffer'
  })
}

function importTable(fn,data) {
	instance.post('/super_admin/factory/device/import', data)
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}
export {
  addFactory,
  getFactory,
  updateFactory,
  deleteFactory,
  reportDevice,
  importTable
}
