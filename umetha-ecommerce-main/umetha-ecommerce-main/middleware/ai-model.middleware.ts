import { AI_MODEL_CONFIG } from "../config/ai-models";

export const aiModelMiddleware = (req: any, res: any, next: any) => {
  req.aiModel = {
    ...AI_MODEL_CONFIG,
    timestamp: new Date().toISOString(),
  };
  next();
};
