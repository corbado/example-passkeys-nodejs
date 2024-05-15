import express from 'express';
import cookieParser from "cookie-parser";
import authRoutes from "./routes"

const app = express();
app.use(cookieParser())
app.set('views', './src/views')
app.set('view engine', 'ejs');
const port = 3000;

app.use("/", authRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});