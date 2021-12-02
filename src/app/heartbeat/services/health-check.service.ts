import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';

import { InjectableService } from '../../../common/decorators/common.decorator';
import { UtilsService } from '../../../common/service/utils.service';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { Queues } from '../../queue/queue.module';
import { QueueService } from '../../queue/services/queue.service';
import * as http from 'http';
import * as https from 'https';
import { HttpTiming } from '../interfaces/http.interface';
import { lookup } from 'lookup-dns-cache';

@InjectableService()
export class HealthCheckService {
  logger = new Logger();
  axios: AxiosInstance;

  constructor(private utilsService: UtilsService, private queueService: QueueService) {
    this.axios = this.utilsService.getAxiosInstance();
  }

  private http(params: https.RequestOptions): Promise<{ body?: any; timings: HttpTiming; error?: Error }> {
    return new Promise((resolve, reject) => {
      /**
       *
       */

      const timings: HttpTiming = {
        startAt: +new Date(),
        dnsLookupAt: undefined,
        tcpConnectionAt: undefined,
        tlsHandshakeAt: undefined,
        firstByteAt: undefined,
        endAt: undefined,
      };

      const req = https.request({ ...params, lookup, ...{ maxRedirects: 20 } }, (res) => {
        const chunks = [];

        res.once('readable', () => {
          timings.firstByteAt = +new Date();
        });

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('error', (error) => {
          return reject({ error, timings });
        });

        res.on('end', () => {
          timings.endAt = +new Date();
          const body = Buffer.concat(chunks).toString('utf8');

          return resolve({ body, timings });
        });
      });

      req.on('socket', (socket) => {
        socket.on('lookup', () => {
          timings.dnsLookupAt = +new Date();
        });

        socket.on('connect', () => {
          timings.tcpConnectionAt = +new Date();
        });

        socket.on('secureConnect', () => {
          timings.tlsHandshakeAt = +new Date();
        });

        // socket.on('ready', () => {
        //   timings.tlsHandshakeAt = +new Date();
        // });
      });

      req.end();
    });
  }

  private getDuration(t1: number, t2: number): number {
    return t2 - t1;
  }

  private async sendHttpRequest(monitor: Monitor, triggeredAt: string): Promise<void> {
    const { body, timings } = await this.http({ hostname: 'api.doctop.com', method: 'get' });

    const { dnsLookupAt, endAt, firstByteAt, startAt, tcpConnectionAt, tlsHandshakeAt } = timings;

    const dnsLookup = dnsLookupAt !== undefined ? this.getDuration(startAt, dnsLookupAt) : undefined;
    const tcpConnection = this.getDuration(dnsLookupAt || startAt, tcpConnectionAt);
    const tlsHandshake = tlsHandshakeAt !== undefined ? this.getDuration(tcpConnectionAt, tlsHandshakeAt) : undefined;
    const firstByte = this.getDuration(tlsHandshakeAt || tcpConnectionAt, firstByteAt);
    const contentTransfer = this.getDuration(firstByteAt, endAt);
    const total = this.getDuration(startAt, endAt);

    console.log(body);

    const data = {
      triggeredAt,
      monitor,
      body,
      dnsLookup,
      tcpConnection,
      tlsHandshake,
      firstByte,
      contentTransfer,
      total,
    };

    await this.queueService.sendEvent(Queues.Events, data);
  }

  async httpHealthCheck(monitors: Monitor[]): Promise<void> {
    console.log(monitors.map((m) => m.friendlyName));

    const jobTriggeredAt = this.utilsService.currentTime();

    for (const monitor of monitors) {
      this.sendHttpRequest(monitor, jobTriggeredAt);
    }
  }
}
