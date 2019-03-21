import instance from './instance.js'

function login(fn, username, password) {
  instance.post('/login', {
      username,
      password
    })
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}

function logout(fn) {
  instance.post('/logout')
    .then(function (res) {
      fn(false, res);
    }).catch(function (err) {
      fn(err);
    });
}

export {
  login,
  logout
}