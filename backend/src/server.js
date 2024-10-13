import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { setupSocket } from './components/socket.js';
import { signup, login, adminLogin, search } from './components/controllers.js'; 

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: ["https://jamoveo-lea.netlify.app", "http://localhost:3000", "http://localhost:3001"],
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json());
app.use(helmet());
app.use(morgan('combined'));

app.post('/signup', signup);
app.post('/login', login);
app.post('/admin/login', adminLogin);
app.get('/search', search);

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

setupSocket(server);