import instance from './instance.js'

function getCategory(fn, factoryId){
  instance.get('/user/category/get', {
      params: {
        factoryId
      }
    })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}

function updateCategory(fn, categoryId, categoryName){
  instance.post('/super_admin/category/update', {
    categoryId,
    categoryName
  })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}

export {
  getCategory,
  updateCategory
}
