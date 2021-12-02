import axios, { AxiosInstance } from 'axios';

import { InjectableService } from '../decorators/common.decorator';

@InjectableService()
export class UtilsService {
  currentTime(): string {
    return new Date().toISOString().slice(0, 19);
  }

  getAxiosInstance(): AxiosInstance {
    const instance = axios.create();

    instance.interceptors.request.use((req) => {
      return req;
    });

    instance.interceptors.response.use((res) => {
      return res;
    });

    return instance;
  }
}
