export enum MonitorType {
  Http = 'http',
  Dns = 'dns',
  Tcp = 'tcp',
  Udp = 'udp',
  Ping = 'ping',
}

export enum MonitorUptimeStatus {
  Up = 'up',
  Down = 'down',
  Unknown = 'unknown',
}

export enum MonitorStatus {
  Enabled = 'enabled',
  Disabled = 'disabled',
  Sleep = 'sleep',
  Waiting = 'waiting',
}

export enum DnsQueryType {
  A = 'A',
  AAAA = 'AAAA',
  ANY = 'ANY',
  CNAME = 'CNAME',
  MX = 'MX',
  NS = 'NS',
  PTR = 'PTR',
  SOA = 'SOA',
  SRV = 'SRV',
  TXT = 'TXT',
  CERT = 'CERT',
  DNSKEY = 'DNSKEY',
}

export enum TcpQueryType {
  Connect = 'connect',
  ConnectTimeout = 'connect_timeout',
  Send = 'send',
  SendTimeout = 'send_timeout',
  Receive = 'receive',
  ReceiveTimeout = 'receive_timeout',
  Close = 'close',
  CloseTimeout = 'close_timeout',
}
