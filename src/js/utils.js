var utils = (function () {
  return {
    copy: function (object) {
      return Object.keys(object).reduce(function (prev, curr) {
        prev[curr] = object[curr];
        return prev;
      }, {});
    },
  };
})();
