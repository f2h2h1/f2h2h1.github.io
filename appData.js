import { Application } from './index.js';

var appData = {
    // host: 'https://f2h2h1.github.io',
    // articlePath: '/article/',
    // sitename: 'f2h2h1\'s blog',
    host: 'http://localhost:8016',
    articlePath: '/article/',
    sitename: 'blog',
    runningtime: Application.RT_NODEJS,
    thirdPartyCode: false,
};

if (typeof window != "undefined" && Object.prototype.toString.call(window) == "[object Window]") { // browser
    appData.runningtime = Application.RT_BROWSER;
} else {
    appData.runningtime = Application.RT_NODEJS;
}

export { appData };
