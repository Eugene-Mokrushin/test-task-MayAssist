import express from "express"
import { postRespons } from "../controllers/ServiceDesk.js"

const router = express.Router()
router.post('/new_issue', postRespons)

export default router