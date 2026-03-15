// Problem Description – Asynchronous Worker Pool
//
// You are required to create a worker pool that manages the execution
// of asynchronous tasks.
// The pool should ensure that no more than N tasks are running concurrently,
// while any additional tasks are queued.
// As tasks complete, queued tasks should start automatically.
// Each task must invoke its callback with its result when finished.

class CallbackPool {
  constructor(limit) {
    this.limit = limit;
    this.active = 0;
    this.queue = [];
  }

  run(task, onComplete) {
    this.queue.push({ task, onComplete });
    this._next();
  }

  _next() {
    if (this.active === this.limit) return;

    if (this.queue.length === 0) return;

    const { task, onComplete } = this.queue.shift();
    this.active++;

    task((err, result) => {
      this.active--;

      if (onComplete) {
        onComplete();
      }

      this._next();
    });
  }
}

module.exports = CallbackPool;
