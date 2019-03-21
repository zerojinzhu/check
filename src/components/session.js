export	default	{
  set: function (key, value) {
    sessionStorage.setItem(key, value);
  },
  get: function (key) {
    var value = sessionStorage.getItem(key);
    return value;
  },
  delete: function (key) {
    sessionStorage.removeItem(key);
  },
  clear: function () {
    sessionStorage.clear();
  }
}