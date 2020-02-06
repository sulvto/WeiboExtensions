
var baseUrl = 'https://weibo.com';

function has_like_node() {
    return get_like_list_node() != null;
}

function get_repost_list_result(node) {
    var aNode = node.querySelector('div.WB_face > a');
    var picNode = node.querySelector('div.WB_face > a > img');
    return {
        pic: picNode ? picNode.getAttribute('src') : '',
        uid: picNode ? picNode.getAttribute('usercard').split('=')[1]: '',
        name: picNode ? picNode.getAttribute('alt') : '',
        userUrl: aNode ? aNode.getAttribute('href') : ''
    }
}

function get_like_list_node() {
    var listNode = document.body.querySelector('div.WB_feed > div > div > div.WB_feed_repeat[node-type=like_detail] > div > div.WB_attitude_list > div.list_box > div.list_ul');

    return listNode ? listNode.children : null;
}

function get_like_list() {
    var listNodes = get_like_list_node();
    if (listNodes == null) return [];
    var result = []
    for (let index = 0; index < listNodes.length; index++) {
        const node = listNodes[index];
        if (node.getAttribute('list_li')) {
            result[result.length] = get_repost_list_result(node);
        }
    }
    return result;
}

/**
 * 提取微博转发内容
 */
function get_page_like() {

    var countNode = document.body.querySelector('div.WB_feed_handle > div.WB_handle li span[node-type=like_status] em:last-child');
    var list = get_like_list();
    return {
        count: countNode ? countNode.innerText : '',
        list
    }
}

function reload() {
    chrome.runtime.sendMessage({
        call: window.site_spider_call_name,
        params: {
            url: window.location.href
        },
        taskId: window.site_spider_task_id
    });
}

window.attemptedLoads = 0;

function sendActive(data) {
    chrome.runtime.sendMessage({
        event: window.site_spider_active_event_id,
        data: data,
        taskId: window.site_spider_task_id
    });
}

function finish(){
    if((!document || document.readyState !='complete') && window.attemptedLoads<6) {
        window.clearTimeout(window.pageLoaderPid);
        window.pageLoaderPid = window.setTimeout( finish, 1000 );
        window.attemptedLoads++;
        return;
    }

    if (!has_like_node()) {
        sendActive();
        reload();
        return;
    }

    console.log('weiboDetailLike.js finish');

    sendActive(get_page_like());

    chrome.runtime.sendMessage({
        event: window.site_spider_done_event_id,
        taskId: window.site_spider_task_id
    });
}

window.pageLoaderPid = window.setTimeout( finish, 500 );