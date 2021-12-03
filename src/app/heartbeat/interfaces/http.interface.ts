import { Monitor } from '../../monitor/entity/monitor.entity';

export interface HttpTiming {
  startAt: number | undefined;
  endAt: number | undefined;
  dnsLookupAt: number | undefined;
  tcpConnectionAt: number | undefined;
  tlsHandshakeAt: number | undefined;
  firstByteAt: number | undefined;
}

export interface HttpHealthCheckResult {
  monitor: Monitor;
  statusCode: number;
  triggeredAt: Date;
  timing: any | HttpTiming;
  body: any;
  error: any;
  // headers: any;
}
