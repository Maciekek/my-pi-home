/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    dbConfig: DbConfig
  }
  interface DbConfig {
    url: string
  }
  export const config: Config
  export type Config = IConfig
}
