// Problem Description – Hedged Request
//
// You have a Primary async source and a Secondary backup.
// Start the Primary immediately. If it is slow, start the Secondary.
//
// Return the first successful result and ignore the rest.
// Only fail if both fail, and ensure the callback runs once.
//
// Requirements:
// - Start Primary immediately.
// - Start Secondary after timeoutMs if needed.
// - First success wins.
// - Callback must be called exactly once.
function hedgedRequest(primary, secondary, timeoutMs, onComplete) {
  let failed = 0;
  let completed = false;

  function handleRequest(err, result) {
    if (completed) return;

    if (!err) {
      completed = true;
      return onComplete(null, result);
    }

    failed++;

    if (failed == 2) {
      completed = true;
      onComplete(err);
    }
  }

  primary(handleRequest);

  setTimeout(() => {
    if (!completed) {
      secondary(handleRequest);
    }
  }, timeoutMs);
}

module.exports = hedgedRequest;
