import dotenv from "dotenv";
dotenv.config();
import express from "express"
import cors from "cors"
import aiRoutes from "./routes/ai.routes.js"
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json())
app.use("/api/ai", aiRoutes)
app.use(errorHandler)

app.get("/", (req, res)=>{
    res.json({message: "Toolzz AI API is running"});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`SERVER running on port ${PORT}`);
});