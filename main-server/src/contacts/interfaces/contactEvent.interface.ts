export interface ContactEvent {
  readonly locationId: string;
  readonly sensorId: string;
  readonly name?: string;
  readonly isOpen: boolean;
  readonly date: string;
}
