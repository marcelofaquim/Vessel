import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { bookingRoutes } from './routes/booking.routes';
import { userRoutes } from './routes/user.routes';
import { propertyRoutes } from './routes/property.routes';
import { authRoutes } from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json())
app.use('/auth', authRoutes)

//Rotas da API
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);
app.use('/properties', propertyRoutes);

app.get('/health', (req, res) => {
    return res.json({ status: 'ok', service: 'Vessel API Backend' });
});

app.listen(PORT, () => {
    console.log(`🚀 API Backend rodando em http://localhost:${PORT}`);
})