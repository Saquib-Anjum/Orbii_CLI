import express, { type Request,type Response} from 'express';
import {fromNodeHeaders, toNodeHandler } from "better-auth/node";
import cors from 'cors'
import 'dotenv/config'
import {auth} from './lib/auth.js'
const app = express();
 app.all("/api/auth/*splat", toNodeHandler(auth));// For ExpressJS v5 
//app config
app.use(express.json());
// Configure CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.get('/health',(req:Request,res:Response)=>{
res.send('Ok');
})
//me
app.get("/api/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});
const PORT = process.env.PORT|| 5000;

//listening the app
app.listen(PORT,()=>{
  console.log(`server is running on ${PORT} | http://localhost:${PORT}`)
})