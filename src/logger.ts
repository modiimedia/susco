class Logger {
  logEnabled: boolean;

  constructor(enabled: boolean) {
    this.logEnabled = enabled;
  }

  log(msg: any) {
    if (this.logEnabled) {
      console.log(msg);
    }
  }

  error(msg: any) {
    if (this.logEnabled) {
      console.error(msg);
    }
  }
}

export default Logger;
