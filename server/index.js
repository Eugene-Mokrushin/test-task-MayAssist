import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import dotenv from "dotenv"
import sdRouter from "./routes/ServiceDesk.js"

dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(cors())

app.use("/api/sd", sdRouter)

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server port: ${PORT}`))