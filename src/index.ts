import express, { Express, Request, Response } from "express";

//import { userRouter } from "./routes/index";
//import { db } from "./config/connectionDB";

const app: Express = express();

process.loadEnvFile();

//console.log(process.env.PORT);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use("/api/users", userRouter.router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hola Mundo");
});

//db.then(() => console.log("Connected to MongoDB"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
