const scriptProperties = PropertiesService.getScriptProperties();

const SLACK_WEBHOOK_URL = scriptProperties.getProperty("SLACK_WEBHOOK_URL");
const GMAIL_SEARCH_QUERY = scriptProperties.getProperty("GMAIL_SEARCH_QUERY");

interface IResult {
  subject: string;
  body: string;
}

interface IAttachment {
  color: string;
  title: string;
  text: string;
}

class Notifier {
  results: Array<IResult> = [];
  oneMinuteAgo: Date;

  constructor() {
    this.oneMinuteAgo = this.calcOneMinuteAgo();
  }

  run() {
    this.fetchResults();
    if (this.results.length === 0) {
      Logger.log("no results, skip");
      return;
    }
    Logger.log(`will send to slack: ${this.results.length}`);
    this.sendToSlack();
  }

  private calcOneMinuteAgo(): Date {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes() - 1
    );
  }

  private isTarget(message: GoogleAppsScript.Gmail.GmailMessage): boolean {
    const time = message.getDate().getTime();
    return this.withinOneMinute(time);
  }

  private withinOneMinute(time: number): boolean {
    return time > this.oneMinuteAgo.getTime();
  }

  private fetchResults() {
    const threads = GmailApp.search(GMAIL_SEARCH_QUERY, 0, 10);
    const messages = threads.reduce(
      (result, thread) => result.concat(thread.getMessages()),
      new Array<GoogleAppsScript.Gmail.GmailMessage>()
    );
    messages.forEach(message => {
      if (!this.isTarget(message)) {
        return;
      }
      this.results.push({
        subject: message.getSubject(),
        body: message.getPlainBody()
      });
    });
  }

  private buildPayload(): string {
    let attachments: Array<IAttachment> = [];
    this.results.forEach(result => {
      attachments.push({
        color: "good",
        title: result.subject,
        text: result.body
      });
    });
    return JSON.stringify({
      attachments: attachments
    });
  }

  private sendToSlack() {
    UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
      method: "post",
      payload: this.buildPayload()
    });
  }
}

function main() {
  new Notifier().run();
}
