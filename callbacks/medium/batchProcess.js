// Problem Description – Ordered Parallel Batcher
//
// You need to process many items in parallel, but with a fixed
// concurrency limit to avoid resource exhaustion.
//
// Tasks should start as soon as a slot is free, and the final
// results must preserve the original input order.
//
// Requirements:
// - Run at most `limit` workers in parallel.
// - Preserve the original order of results.
// - Start new work as soon as one finishes.
// - Stop and return an error if any task fails.

function batchProcess(items, limit, worker, onComplete) {
  const result = new Array(items.length);
  let processed = 0;
  let index = 0;
  let completed = 0;
  let errorOccurred = false;

  if (items.length === 0) return onComplete(null, result);

  function launchNext() {
    if (errorOccurred) return;

    while (processed < limit && index < items.length) {
      const curIdx = index++;
      processed++;

      worker(items[curIdx], (err, value) => {
        processed--;
        if (errorOccurred) return;

        if (err) {
          errorOccurred = true;
          return onComplete(err);
        }

        result[curIdx] = value;
        completed++;

        if (completed === items.length) {
          return onComplete(null, result);
        }

        launchNext();
      });
    }
  }

  launchNext();
}

module.exports = batchProcess;
