import express, { type Request,type Response} from 'express';
import 'dotenv/config'
const app = express();
//app config
app.use(express.json());

app.get('/health',(req:Request,res:Response)=>{
res.send('Ok');
})
const PORT = process.env.PORT|| 5000;

//listening the app
app.listen(PORT,()=>{
  console.log(`server is running on ${PORT} | http://localhost:${PORT}`)
})