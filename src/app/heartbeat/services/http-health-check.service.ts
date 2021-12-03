import { Logger } from '@nestjs/common';
import { lookup } from 'dns';
import { InjectableService } from '../../../common/decorators/common.decorator';
import { Monitor } from '../../monitor/entity/monitor.entity';
import { Queues } from '../../queue/queue.module';
import { QueueService } from '../../queue/services/queue.service';
import { HttpTiming, HttpHealthCheckResult } from '../interfaces/http.interface';
import * as http from 'http';
import * as https from 'https';
import { EventService } from '../../event/services/event.service';

@InjectableService()
export class HttpHealthCheckService {
  logger = new Logger();

  constructor(private queueService: QueueService, private eventService: EventService) {}

  private getDuration(t1: number, t2: number): number {
    return t2 - t1;
  }

  private http(
    params: https.RequestOptions,
  ): Promise<{ body?: any; timings: HttpTiming; error?: Error; statusCode?: number }> {
    const timings: HttpTiming = {
      startAt: +new Date(),
      dnsLookupAt: undefined,
      tcpConnectionAt: undefined,
      tlsHandshakeAt: undefined,
      firstByteAt: undefined,
      endAt: undefined,
    };

    return new Promise((resolve) => {
      const req = https.request({ ...params, lookup, ...{ maxRedirects: 5 } }, (res) => {
        const chunks = [];

        res.once('readable', () => {
          timings.firstByteAt = +new Date();
        });

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('error', (error) => {
          return resolve({ error, timings });
        });

        res.on('end', function () {
          timings.endAt = +new Date();
          const body = Buffer.concat(chunks).toString('utf8');

          return resolve({ body, timings, statusCode: this.statusCode });
        });
      });

      req.on('error', (error) => {
        resolve({ error, timings });
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

        // socket.on('ready', () => {});
      });

      req.setTimeout(params.timeout || 15 * 1000, function () {
        this.abort();
      });

      // req.on('timeout', () => {});

      req.end();
    });
  }

  private async sendHttpRequest(monitor: Monitor, triggeredAt: Date): Promise<void> {
    const { body, timings, error, statusCode } = await this.http({
      hostname: 'api.doctop.com',
      path: '/ali',
      method: 'get',
    });

    const { dnsLookupAt, endAt, firstByteAt, startAt, tcpConnectionAt, tlsHandshakeAt } = timings;

    const dnsLookup: number = dnsLookupAt !== undefined ? this.getDuration(startAt, dnsLookupAt) : undefined;
    const tcpConnection = this.getDuration(dnsLookupAt || startAt, tcpConnectionAt);
    const tlsHandshake = tlsHandshakeAt !== undefined ? this.getDuration(tcpConnectionAt, tlsHandshakeAt) : undefined;
    const firstByte = this.getDuration(tlsHandshakeAt || tcpConnectionAt, firstByteAt);
    const contentTransfer = this.getDuration(firstByteAt, endAt);
    const total = this.getDuration(startAt, endAt);

    const data: HttpHealthCheckResult = {
      triggeredAt,
      monitor,
      body,
      statusCode,
      error,
      timing: {
        startAt,
        endAt,
        dnsLookup,
        tcpConnection,
        tlsHandshake,
        firstByte,
        contentTransfer,
        total,
      },
    };

    await this.queueService.sendEvent(Queues.Events, data);
  }

  async healthCheck(monitors: Monitor[], jobTriggeredAt: Date): Promise<void> {
    for (const monitor of monitors) {
      this.sendHttpRequest(monitor, jobTriggeredAt);
    }
  }

  async saveHttpHealthCheckResult(data: HttpHealthCheckResult): Promise<boolean> {
    const { body, statusCode, timing, monitor, triggeredAt } = data;

    try {
      await this.eventService.saveEvent([
        {
          resBody: body,
          statusCode,
          monitor,
          triggeredAt,
          // dnsLookupAt: dnsLookup,
          // tcpConnectionAt: tcpConnection,
          // tlsHandshakeAt: tlsHandshake,
          // firstByteAt: firstByte,
          // contentTransferAt: contentTransfer,
        },
      ]);
      return true;
    } catch (error) {
      return false;
    }
  }
}
