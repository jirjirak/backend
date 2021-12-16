type NodeEnvType = 'development' | 'production' | 'test';

export const NODE_ENV: NodeEnvType = (process.env.NODE_ENV as NodeEnvType) || 'development';

// default is false
export const isSchedulerMode = Boolean(process.env.IS_SCHEDULER_MODE);
export const isControllerMode = Boolean(process.env.IS_CONTROLLER_MODE);
export const isWorkerMode = Boolean(process.env.IS_WORKER_MODE);

export const architecture: 'monolith' | 'microservice' = process.env.ARCHITECTURE as any;

export let isMicroserviceArchitecture = false;
export let isMonolithArchitecture = false;

if (architecture === 'microservice') {
  isMicroserviceArchitecture = true;
} else {
  isMonolithArchitecture = true;
}
