export enum MonitorType {
  Http = 'http',
  Dns = 'dns',
  Tcp = 'tcp',
  Udp = 'udp',
  Ping = 'ping',
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
