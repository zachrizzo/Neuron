const admin = require("firebase-admin");

admin.initializeApp();

// Export functions
exports.user = require("./user");
