import { type ErrorRequestHandler } from 'express';
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

const errorHandler: ErrorRequestHandler = async (error, request, response, next) => {
  try {
    // console.log(process.cwd());
    const logDir = join(process.cwd(), 'log-file');
    await mkdir(logDir, { recursive: true });

    const now = new Date();
    const timestamp = now.toISOString();
    const dateString = timestamp.split('T')[0];

    // console.log(dateString);
    const logFilePath = join(logDir, `${dateString}-error.log`);

    const logEntry = `[${timestamp}] - Error: ${error.message} - Stack: ${error.stack}\n`;

    await appendFile(logFilePath, logEntry, 'utf8');
  } catch (logError) {
    if (process.env.NOVE_ENV !== 'production') {
      if (logError instanceof Error) {
        console.log(`\\x1b[31m${error.stack}\\x1b[0m]`);
      } else {
        console.log(`\\x1b[31m${error}\\x1b[0m]`);
      }
    }
  } finally {
    //response.status(error.cause || 500).json({ message: error.message });
    if (error instanceof Error) {
      if (error.cause) {
        const cause = error.cause as { status: number };
        response.status(cause.status).json({ message: error.message });
      } else {
        response.status(500).json({ message: error.message });
      }
      return;
    }
    response.status(500).json({ message: 'Internal server error' });
  }
};
export default errorHandler;
