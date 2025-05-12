import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routers/auth.route';
import userRouter from './routers/user.route';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/test', (req, res) => {
    res.send('Helllo from server side');
})

app.use('/api/auth', router)
app.use('/api', userRouter)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

