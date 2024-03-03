const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

// Optional: es6-promise-pool for handling concurrency, if needed
const PromisePool = require("es6-promise-pool").default;
const MAX_CONCURRENT = 3; // Adjust based on your concurrency needs

exports.dailyUserRefill = onSchedule("0 0 * * *", async (context) => {
  logger.log("Starting daily user refill at midnight...");

  const usersRef = admin.firestore().collection("users");
  const now = new Date();

  const usersSnapshot = await usersRef.get();
  let updateUserPromises = [];

  usersSnapshot.forEach((doc) => {
    const user = doc.data();
    const lastMessageRefill = new Date(user.lastMessageRefill);
    const lastHeartRefill = new Date(user.heartsLastRefill);
    let updatesNeeded = {};
    let shouldUpdate = false;

    // Refill messages if more than 24 hours have passed since the last refill
    if (now - lastMessageRefill >= 24 * 60 * 60 * 1000) {
      updatesNeeded.numberOfMessages = 50;
      updatesNeeded.lastMessageRefill = now.toISOString();
      shouldUpdate = true;
    }

    // Refill hearts if more than 24 hours have passed since the last refill
    if (now - lastHeartRefill >= 24 * 60 * 60 * 1000) {
      updatesNeeded.hearts = 10;
      updatesNeeded.heartsLastRefill = now.toISOString();
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      updateUserPromises.push(doc.ref.update(updatesNeeded));
    }
  });

  // Use a promise pool to limit the number of concurrent Firestore updates
  const promisePool = new PromisePool(
    () => updateUserPromises.shift(),
    MAX_CONCURRENT
  );
  await promisePool.start();

  logger.log("Daily user refill completed at midnight.");
});
