import { Injectable, Logger } from '@nestjs/common';
import { WebClient } from '@slack/web-api';

@Injectable()
export class SlackService  {
    private readonly logger = new Logger(SlackService.name);

    slackApi: WebClient;

    constructor() {
        this.logger.log('SLACK_TOKEN: ' + process.env.SLACK_TOKEN);
        const token = process.env.SLACK_TOKEN;
        this.slackApi = new WebClient(token );

    }

    sendMessage(content) {
        this.slackApi.chat.postMessage({channel: 'powiadomienia', text: content, username: "Backend API" });
    }

}
