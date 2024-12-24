import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { errorLogger } from './app/src/shared/logger';
import { LogsRoutes } from './app/src/module/logs/logs.routes';
import router from './app/src/routes';

const app: Application = express();

// Serve static files like CSS
app.use(express.static(path.join(__dirname, '../public'))); // Adjusted path

// Parsers
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

app.get('/todos', async (req: Request, res: Response): Promise<any> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  // const response = await fetch('http://ts-docker-container:5000/api/v1/users');
  const todos = await response.json();
  return res.status(200).json(todos);
});

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`
   <html>
      <head>
        <title>Docker Logs Viewer</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Welcome to the Docker Logs binding erroLogger page!</h1>
        <p>Go to <a href="/logs/errors">Error Logs</a> or <a href="/logs/successes">Success Logs</a>.</p>
      </body>
    </html>
  `);
});

app.get('/error', (req: Request, res: Response) => {
  throw new Error('This is a forced error!');
});

//Logger Routes
app.use('/logs', LogsRoutes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err);
  errorLogger.error(err);

  res.status(500).send(`
    <html>
      <head>
        <title>Error</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Something went wrong</h1>
        <p>${err.message}</p>
        <a href="/">Back to Home</a>
      </body>
    </html>
  `);
});

// Not Found handler
app.use((req: Request, res: Response) => {
  res.status(404).send(`
    <html>
      <head>
        <title>Page Not Found</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <a href="/">Back to Home</a>
      </body>
    </html>
  `);
});

export default app;
