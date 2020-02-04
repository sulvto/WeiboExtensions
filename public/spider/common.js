/**
 * open url
 * @param {string} url 
 */
function spiderLoad(url, spiderFile) {
    
    chrome.tabs.create({
        url: url,
        selected: false
    }, function (tab) {
        spiderLoadCallback_({
            spiderTab : tab
        }, spiderFile);
    });
}


/**
 * Inject the spider code into the newly opened page.
 * @param task The task of new tab.
 * @private
 */
function spiderLoadCallback_(task, injectFile) {
    var spiderTab = task.spiderTab;

    if (!spiderTab || !spiderTab.id) {
        console.error(!spiderTab || !spiderTab.id);
    } else {
        chrome.tabs.executeScript(spiderTab.id, {
            code: 'window.site_spider_task_id="' + task.id + '"'
        });
    
        chrome.tabs.executeScript(spiderTab.id, {
            file: injectFile
        });
    }
}
