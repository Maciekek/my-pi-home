import { Controller, Get, Param, Post } from '@nestjs/common';
import { AlarmService, AlarmStatus } from './alarm.service';

@Controller('/alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Get(':locationId')
  async getStatus(@Param('locationId') locationId: string): Promise<AlarmStatus> {
    return this.alarmService.getStatus(locationId);
  }

  @Post(':locationId/arm')
  async arm(@Param('locationId') locationId: string): Promise<AlarmStatus> {
    return this.alarmService.arm(locationId);
  }

  @Post(':locationId/disarm')
  async disarm(@Param('locationId') locationId: string): Promise<AlarmStatus> {
    return this.alarmService.disarm(locationId);
  }

  @Post(':locationId/resume')
  async resumeSchedule(@Param('locationId') locationId: string): Promise<AlarmStatus> {
    return this.alarmService.resumeSchedule(locationId);
  }
}
