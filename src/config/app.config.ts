type NodeEnvType = 'development' | 'production' | 'test';

export const NODE_ENV: NodeEnvType = (process.env.NODE_ENV as NodeEnvType) || 'development';
