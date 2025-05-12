import express from 'express';
import cors from 'cors';
import router from './routers/auth.route';

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/test', (req, res) => {
    res.send('Helllo from server side');
})

app.use('/api/auth', router)

export default app;