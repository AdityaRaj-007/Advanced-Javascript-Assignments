// Problem Description – Task Execution with Dependencies
//
// You are given a set of asynchronous tasks where some tasks depend
// on the completion of others.
// Your goal is to execute each task only after all of its dependencies
// have been successfully completed.
// The solution should ensure correct execution order and handle
// dependency relationships properly.
//
// Each task is asynchronous and must invoke a callback when finished.
// Invoke finalCallback after all tasks have completed, or with an error
// if any task fails.

function runWithDependencies(tasks, finalCallback) {
  const results = {};
  const completed = new Set();
  const running = new Set();
  let finished = false;

  function tryRunTasks() {
    if (finished) return;

    for (const task of tasks) {
      if (completed.has(task.id) || running.has(task.id)) continue;

      const { id, deps, run } = task;
      console.log(task);

      const ready = deps.every((dep) => completed.has(dep));
      if (!ready) continue;

      running.add(id);

      run((err, result) => {
        if (finished) return;

        if (err) {
          finished = true;
          return finalCallback(err);
        }

        results[id] = result;
        completed.add(id);

        if (completed.size === tasks.length) {
          finished = true;
          return finalCallback(null, results);
        }

        tryRunTasks();
      });
    }
  }

  tryRunTasks();
}

module.exports = runWithDependencies;
