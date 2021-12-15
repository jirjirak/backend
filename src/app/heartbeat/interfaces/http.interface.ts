export interface HttpTiming {
  startAt: number | undefined;
  endAt: number | undefined;
  dnsLookupAt: number | undefined;
  tcpConnectionAt: number | undefined;
  tlsHandshakeAt: number | undefined;
  firstByteAt: number | undefined;
}
