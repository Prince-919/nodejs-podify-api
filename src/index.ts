import express from "express";
import "express-async-errors";
import { config, dbConnect } from "@/config";
import routes from "./routes";
import "./utils/schedule";
import { errorHandler } from "./middlewares";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/api", routes);

app.use(errorHandler);

const serverStart = async () => {
  try {
    await dbConnect();
    const port = config.port || 8000;
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

serverStart();
