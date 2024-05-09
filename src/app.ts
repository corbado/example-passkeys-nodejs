import express from 'express';
import {config as dotenvConfig} from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes"
import {sequelize} from "../models";

dotenvConfig()

const app = express();
app.use(cookieParser())
app.set('views', './src/views')
app.set('view engine', 'ejs');
const port = 3000;


app.use("/", authRoutes)
function syncDBWithRetry(attemptsLeft: number) {
    sequelize
        .sync({force: true})
        .then(() => {
            console.log("Synced db.");
            app.listen(port, () => {
                console.log(`Server is running on http://localhost:${port}`);
            });
        })
        .catch((err) => {
            console.log("Failed to sync db: " + err.message);
            if (attemptsLeft > 0) {
                console.log(`Retrying in 2 seconds... Attempts left: ${attemptsLeft}`);
                setTimeout(() => syncDBWithRetry(attemptsLeft - 1), 2000);
            } else {
                console.log("Failed to sync db after multiple attempts.");
            }
        });
}

syncDBWithRetry(5); // Retry up to 5 times with 2-second intervals
