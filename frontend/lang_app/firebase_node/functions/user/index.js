const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

// Optional: es6-promise-pool for handling concurrency, if needed
const PromisePool = require("es6-promise-pool").default;
const MAX_CONCURRENT = 3; // Adjust based on your concurrency needs

admin.initializeApp();

exports.everyThreeMinutesUserRefill = onSchedule("*/3 * * * *", async (context) => {
  logger.log("Starting user refill every 3 minutes...");

  const usersRef = admin.firestore().collection("users");
  const now = new Date();

  const usersSnapshot = await usersRef.get();
  let updateUserPromises = [];

  usersSnapshot.forEach((doc) => {
    const user = doc.data();
    // Since this function runs every 3 minutes, you might want to adjust the logic
    // for when to refill hearts and messages. For simplicity, this example will
    // just add a fixed amount every time it runs, without specific conditions.

    const updatesNeeded = {
      // Increment numberOfMessages and hearts by a fixed amount
      // Or set a new value based on your logic
      numberOfMessages: (user.numberOfMessages || 0) + 5, // Example increment
      hearts: (user.hearts || 0) + 1, // Example increment
      // Update last refill timestamps
      lastMessageRefill: now.toISOString(),
      heartsLastRefill: now.toISOString(),
    };

    // Always update since we're doing this every 3 minutes regardless of previous values
    updateUserPromises.push(doc.ref.update(updatesNeeded));
  });

  // Use a promise pool to limit the number of concurrent Firestore updates
  const promisePool = new PromisePool(
    () => updateUserPromises.shift(),
    MAX_CONCURRENT
  );
  await promisePool.start();

  logger.log("User refill completed.");
});
