function pageLoaded() {
    document.getElementById("siteSpiderGo").addEventListener("click", clickGo);
    document.getElementById("viewsPage").addEventListener("click", clickViewsPage);
    chrome.extension.getBackgroundPage().popupLoaded(document);
}

function clickGo() {
    chrome.extension.getBackgroundPage().popupGo();
    window.close();
}
  
function clickViewsPage() {
    chrome.extension.getBackgroundPage().showViewsPage();
}

window.addEventListener("load",pageLoaded);

