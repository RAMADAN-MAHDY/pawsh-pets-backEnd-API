import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/connectDB.js';
import authRoutes from './Routers/authRoutes.js';
import Animal from './Routers/animalRoutes.js';
import categoryRoutes from './Routers/categoryRoutes.js';
import productRoutes from './Routers/productRoutes.js';
import favoriteRoutes from './Routers/favoriteRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import { seedHotels } from './helper/addData.js';
// import  Booking  from './routes/booking.routes.js';
dotenv.config();
const app = express();
// webhook route should be before bodyParser middleware
// app.use("/api/Booking/stripe", Booking);
app.use(bodyParser.json());
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000", "https://58a07fc147ce.ngrok-free.app"],
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
// Serve static image files
app.use('/images', express.static(path.join(__dirname, '..', 'iamges')));
connectDb();
// Routes
app.use('/api/auth', authRoutes);
app.use('/api', Animal);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', favoriteRoutes);
app.get('/', (req, res) => {
    // seedHotels();   //  add this line to seed data hotels 
    // seedProducts(); // Uncomment to seed products and categories
    // seedCategories();
    // seedProducts();
    // deleteProducts(); // Uncomment to delete all products
    res.json({ message: 'API is running...' });
    // res.send('API is running...');
});
// Global error handler (should be after routes)
app.use(errorHandler);
export default app;
