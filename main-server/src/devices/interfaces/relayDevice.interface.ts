export interface RelayDevice {
  readonly locationId: string;
  readonly ip: string;
  readonly gpio: string;
  readonly type: string;
  readonly name: string;
  readonly state: string;
}
