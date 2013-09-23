(function() {
  var __slice = [].slice;

  define(function() {
    var JobQueue, MAX_RUNNING;
    MAX_RUNNING = 3;
    return JobQueue = (function() {
      function JobQueue() {
        this.queue = [];
        this.cursor = 0;
        this.running = 0;
      }

      JobQueue.prototype.enqueue = function() {
        var args, func, wrapper;
        func = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        wrapper = func.bind(this, args);
        this.queue.push(wrapper);
        return this.next();
      };

      JobQueue.prototype.next = function() {
        var func, promise;
        if (this.running < MAX_RUNNING) {
          this.running++;
          func = this.queue[this.cursor];
          this.cursor++;
          console.log(new Date().toString());
          promise = func();
          return promise.then(this.done.bind(this));
        }
      };

      JobQueue.prototype.done = function() {
        this.running--;
        return this.next();
      };

      return JobQueue;

    })();
  });

}).call(this);
