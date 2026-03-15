// Problem Description – Async Initialization Gate
//
// You are required to design a mechanism for APIs that depend on an
// asynchronous initialization step.
// Any calls made before initialization completes should be queued and
// executed only after the initialization finishes.
// Calls made after initialization should execute immediately.
//
// The initialization task and API functions must invoke callbacks when
// they complete.
class GuardedAPI {
  constructor() {
    this.initialized = false;
    this.queue = [];
  }

  init(initTask) {
    initTask(() => {
      this.initialized = true;
      this._flush();
    });
  }

  call(apiFn, onComplete) {
    if (!this.initialized) {
      this.queue.push({ apiFn, onComplete });
    } else {
      apiFn(onComplete);
    }
  }

  _flush() {
    while (this.queue.length > 0) {
      const { apiFn, onComplete } = this.queue.shift();
      apiFn(onComplete);
    }
  }
}

module.exports = GuardedAPI;
