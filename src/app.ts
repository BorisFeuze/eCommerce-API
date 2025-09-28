import '#db';
import cors from 'cors';
import express from 'express';
import { userRouter, productRouter, categoryRouter, orderRouter } from '#routers';
import { errorHandler } from '#middleware';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // Middleware logic

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL, // for use with credentials, origin(s) need to be specified
    credentials: true // sends and receives secure cookies
  })
);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/categories', categoryRouter);
app.use('*splat', (request, response) => {
  throw new Error('Not found', { cause: { status: 404 } });
});

app.use(errorHandler);

app.listen(port, () => console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`));
