const functions = require("firebase-functions");
const admin = require("firebase-admin");
d;

exports.checkUserVisitAndUpdate = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (change, context) => {
    const userDataBefore = change.before.data();
    const userDataAfter = change.after.data();

    const lastVisitBefore = new Date(userDataBefore.lastVisit);
    const lastVisitAfter = new Date(userDataAfter.lastVisit);

    // Assume updates only happen if there's a significant visit (e.g., more than a few minutes)
    // This avoids triggering on every minor document update
    if (lastVisitAfter - lastVisitBefore < 1000 * 60 * 5) {
      console.log("Visit update is too minor, skipping.");
      return null;
    }

    // Your existing logic for calculating time differences
    const calculateTimeDifferenceInHours = (startDate, endDate) => {
      const msInHour = 1000 * 60 * 60;
      return (endDate.getTime() - startDate.getTime()) / msInHour;
    };

    let updatesNeeded = false;
    const updatedData = {};

    // Check for message refill
    const lastMessageRefill = new Date(userDataAfter.lastMessageRefill);
    const diffInHoursMessages = calculateTimeDifferenceInHours(
      lastMessageRefill,
      new Date()
    );
    if (diffInHoursMessages > 24) {
      updatedData.numberOfMessages = 50;
      updatedData.lastMessageRefill = new Date().toISOString();
      updatesNeeded = true;
    }

    // Check for heart refill (using whichever date field is accurate for your use case)
    const lastHeartRefill = new Date(
      userDataAfter.heartsLastRefill || userDataAfter.lastHeartRefill
    ); // Adjust based on your field
    const diffInHoursHearts = calculateTimeDifferenceInHours(
      lastHeartRefill,
      new Date()
    );

    if (diffInHoursHearts > 24) {
      updatedData.hearts = 10;
      updatedData.heartsLastRefill = new Date().toISOString(); // Adjust based on your field
      updatesNeeded = true;
    }

    // Streak update logic
    const now = new Date();
    const lastVisitDate = userDataAfter.lastVisit
      ? new Date(userDataAfter.lastVisit)
      : null;
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const twoDaysInMs = oneDayInMs * 2;
    let newStreak = userDataAfter.streak || 0;

    // Check if the user has visited within the last 48 hours but more than 24 hours
    if (
      lastVisitDate &&
      now - lastVisitDate < twoDaysInMs &&
      now - lastVisitDate > oneDayInMs
    ) {
      // Increment streak
      newStreak++;
      updatedData.streak = newStreak;
      updatesNeeded = true;
    } else if (now - lastVisitDate >= twoDaysInMs) {
      // Reset streak if it's been more than 48 hours
      updatedData.streak = 1;
      updatesNeeded = true;
    }

    // If updates are needed based on the checks above, update the Firestore document
    if (updatesNeeded) {
      console.log(
        `Updating user ${context.params.userId} with data:`,
        updatedData
      );
      await admin
        .firestore()
        .collection("users")
        .doc(context.params.userId)
        .update(updatedData);
      console.log("User updated successfully");
    }

    return null;
  });
