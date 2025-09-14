import express, {Express, Request, Response} from 'express';
import {db} from './config/connectionDB'
import { bookRouter, userRouter, reviewRouter } from './routes';

const app: Express = express();

process.loadEnvFile();


const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || (NODE_ENV === "development" ? 3001 : 3000);
app.use(express.json()); //Content-type: json
app.use(express.urlencoded({extended: true})); //para cuando mando archivos en el host, para que pueda recibirlos

app.use("/api/books", bookRouter.router);
app.use("/api/users", userRouter.router);
app.use("/api/reviews", reviewRouter.router);

app.get('/', (req: Request, res: Response) => {
     res.send(`Holiiii desde ${NODE_ENV} 🚀`);
});

// Conexión DB y levantar servidor
db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Error connecting to DB:", err);
});