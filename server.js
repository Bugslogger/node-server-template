require("dotenv").config(); // always keep this line at top else it will throw error
require("./utils/load.events/load.process.events")();
const app = require("./app");
const db = require("./models/db.connect");

db.connection
  .sync()
  .then(() => {
    console.log("\x1b[32m%s\x1b[0m", "DB Synced!");
  })
  .catch((err) => {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
    console.log(
      "\x1b[1m\x1b[37m\x1b[41m%s\x1b[0m",
      "Failed to sync db: " + err.message
    );
  });


app.listen(process.env.PORT || 4000, () => {
  console.log(`Node Environment: ${process.env.NODE_ENV}.`);
  console.log(`Server is running on port ${process.env.PORT}.`);
});
