import { Application } from './index.js';

var appData = {
    URLprefix: 'https://f2h2h1.github.io/article/',
    // URLprefix: 'http://127.0.0.1:9012/article/',
    sitename: 'f2h2h1\'s blog',
    runningtime: Application.RT_NODEJS,
};

if (typeof window != "undefined" && Object.prototype.toString.call(window) == "[object Window]") { // browser
    appData.runningtime = Application.RT_BROWSER;
} else {
    appData.runningtime = Application.RT_NODEJS;
}

export { appData };
