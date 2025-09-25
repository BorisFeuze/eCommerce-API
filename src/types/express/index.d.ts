declare global {
  namespace Express {
    export interface Request {
      sanitQuery?: { owner: string };
    }
  }
}
export {};
