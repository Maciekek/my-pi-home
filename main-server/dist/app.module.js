"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const cats_module_1 = require("./cats/cats.module");
const temps_module_1 = require("./temps/temps.module");
const node_config_ts_1 = require("node-config-ts");
const users_module_1 = require("./users/users.module");
const locations_module_1 = require("./locations/locations.module");
const esp_module_1 = require("./esp/esp.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const events_module_1 = require("./events/events.module");
const schedule_1 = require("@nestjs/schedule");
const cron_module_1 = require("./modules/cron/cron.module");
console.log(node_config_ts_1.config.dbConfig);
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forRoot(node_config_ts_1.config.dbConfig.url),
            cats_module_1.CatsModule,
            temps_module_1.TempsModule,
            users_module_1.UsersModule,
            locations_module_1.LocationsModule,
            esp_module_1.EspModule,
            dashboard_module_1.DashboardModule,
            events_module_1.EventsModule,
            schedule_1.ScheduleModule.forRoot(),
            cron_module_1.CronModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map