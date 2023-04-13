class AppData {
    host = 'http://127.0.0.1:8016';
    articlePath = '/article/';
    sitename = 'blog';
    runningtime = '';
    thirdPartyCode = false;
    static RT_BROWSER = 'browser';
    static RT_NODEJS = 'nodejs';
	constructor() {
		if (typeof window != "undefined" && Object.prototype.toString.call(window) == "[object Window]") { // browser
			this.runningtime = this.constructor.RT_BROWSER;
		} else {
			this.runningtime = this.constructor.RT_NODEJS;
		}
	}
}

export { AppData };
