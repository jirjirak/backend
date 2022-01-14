type NodeEnvType = 'development' | 'production' | 'test';

export const NODE_ENV: NodeEnvType = (process.env.NODE_ENV as NodeEnvType) || 'development';
export const PORT = +process.env.PORT || 3000;
export const SECRETE_KEY = process.env.SECRETE_KEY || 'secret';

// default is false
export let isSchedulerMode = Boolean(process.env.IS_SCHEDULER_MODE);
export let isControllerMode = Boolean(process.env.IS_CONTROLLER_MODE);
export let isWorkerMode = Boolean(process.env.IS_WORKER_MODE);

export const architecture: 'monolith' | 'microservice' = (process.env.ARCHITECTURE as any) || 'monolith';

export let isMicroserviceArchitecture = false;
export let isMonolithArchitecture = false;

if (architecture === 'microservice') {
  isMicroserviceArchitecture = true;
} else {
  isMonolithArchitecture = true;
  isWorkerMode = true;
  isControllerMode = true;
  isSchedulerMode = true;
}
