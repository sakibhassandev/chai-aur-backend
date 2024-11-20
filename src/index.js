import "dotenv/config";
import connectDB from "./db/connect-database.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB CONNECTION ERROR: ", err);
  });
