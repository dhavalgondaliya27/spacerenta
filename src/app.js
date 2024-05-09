import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import compression from 'compression';
import { googlePassport } from './controllers/user.controller.js';
const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.options('*', cors());

app.use(
  session({
    secret: 'airbnb',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/', (req, res) => {
  res.send('Airbnb is running');
});


app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
app.use(compression());

googlePassport(passport);



//user routes import
import UserRouter from './routes/user.route.js';
app.use('/api/v1', UserRouter);
import PropertyRouter from './routes/properties.route.js';
app.use('/api/v2', PropertyRouter);
import userprofileRouter from './routes/userprofile.route.js';
app.use('/api/v3',userprofileRouter)

export { app };
