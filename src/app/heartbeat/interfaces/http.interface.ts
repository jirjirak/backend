export interface HttpTiming {
  startAt: number;
  dnsLookupAt: number;
  tcpConnectionAt: number;
  tlsHandshakeAt: number;
  firstByteAt: number;
  endAt: number;
}
