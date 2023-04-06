import fs from "fs"
import fetch from "node-fetch"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"


dotenv.config()

export const postRespons = async (req, res) => {
    try {
        const { token, text } = req.body
        const { chat_id } = jwt.verify(token, process.env.JWT_SECRET)
        const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id,
                text,
                reply_markup: {
                    remove_keyboard: true
                }
            })
        })
        res.status(response.status)
    } catch (error) {
        const currentDate = new Date();
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`
        fs.appendFile('./logs/sdLog.txt', error + ' ' + formattedDate + '\n', (err) => {
            if (error) throw error;
            console.log('Log written to the file');
        });
        res.status(500).json({ message: error })
    }
}