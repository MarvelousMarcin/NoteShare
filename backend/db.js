const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.db");

// db.serialize(() => {
//   try {
//     db.run("CREATE TABLE USERS (email TEXT, password TEXT, name TEXT)");
//   } catch (error) {
//     console.log(error);
//   }
// });

// db.serialize(() => {
//   try {
//     db.run(
//       "CREATE TABLE LOGIN_LOGS (login_log_id INTEGER PRIMARY KEY AUTOINCREMENT, user TEXT)"
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = db;
