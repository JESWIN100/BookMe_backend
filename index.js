import express from 'express';
import path from 'path';
import connectDB from './config/db.js';
import apiRouter from './routes/index.js';
import logger from 'morgan'
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cookieParser())
connectDB();


app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
   
  }));



app.use(logger('dev'));
app.get('/', (req, res) => {
    res.send("hlo world")
});




app.use('/api', apiRouter);
// 404 handler for undefined routes
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint does not exist' });
});


// Set up the server to listen on a port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});