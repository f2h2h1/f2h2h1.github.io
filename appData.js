class AppData {
    host = 'http://127.0.0.1:8016';
    articlePath = '/article/';
    sitename = 'blog';
    runningtime = '';
    thirdPartyCode = false;
    updatetime = 1761130605;
    commitid = '1efbf27a8ecf8b807e628ccd0cd3e6364a2486c2';
    buildtime = 1761017814;
    copyright = 'Copyright ©' + new Date().getFullYear() + ' f2h2h1 | All Rights Reserved';
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
