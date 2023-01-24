import * as dotenv from 'dotenv';
import * as fs from 'fs';
import {Logger} from "@nestjs/common";

export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);

  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string) {
    this.logger.log(filePath);

    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
