import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json())

app.get('/health', (req, res) => {
    return res.json({ status: 'ok', service: 'Vessel API Backend' });
});

app.listen(PORT, () => {
    console.log(`🚀 API Backend rodando em http://localhost:${PORT}`);
})