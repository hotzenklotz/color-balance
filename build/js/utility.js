(function() {
  define([], function() {
    var Utility;
    return Utility = {
      memoize: function(func, key) {
        var memo;
        memo = {};
        return function() {
          if (memo.hasOwnProperty(key)) {
            return memo[key];
          } else {
            return memo[key] = func.apply(this, arguments);
          }
        };
      },
      clamp: function(min, max, value) {
        return Math.min(max, Math.max(min, value));
      }
    };
  });

}).call(this);
