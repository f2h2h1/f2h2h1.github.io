class AppData {
    host = 'http://127.0.0.1:8016';
    articlePath = '/article/';
    sitename = 'blog';
    runningtime = '';
    thirdPartyCode = false;
    updatetime =1760524177;
    commitid ='407cb1f7bd6feafd6ac8735371c35b95f0de8887';
    buildtime = '';
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
