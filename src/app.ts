import express, { Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/connectDB.js';
import authRoutes from './Routers/authRoutes.js';
import Animal  from './Routers/animalRoutes.js';
// import { seedHotels } from './helper/addData.js';
// import  Booking  from './routes/booking.routes.js';

dotenv.config();


const app = express();

// webhook route should be before bodyParser middleware
// app.use("/api/Booking/stripe", Booking);




app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {

    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));


connectDb();
// Routes

app.use('/api/auth', authRoutes);
app.use('/api', Animal);










app.get('/', (req: Request, res: Response) => {
    // seedHotels();   //  add this line to seed data hotels 
    res.json({ message: 'API is running...' });
    // res.send('API is running...');
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
