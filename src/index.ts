import express from "express";
import { config, dbConnect } from "@/config";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

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
