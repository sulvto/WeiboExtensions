
var baseUrl = 'https://weibo.com';

function has_feed_node() {
    return document.body.querySelector('div.WB_frame_c div > div > div > div.WB_feed_detail.clearfix > div.WB_detail > div.WB_from a[node-type=feed_list_item_date]');
}

function get_comment_list_result(node) {
    var dateNode = node.querySelector('div.list_con > div.WB_func > div.WB_from');
    var contentNode = node.querySelector('div.list_con[node-type=replywrap] > div.WB_text');
    var aNode = node.querySelector('div.WB_face > a');
    var picNode = node.querySelector('div.WB_face > a > img');
    return {
        commentId: node.getAttribute('comment_id') ,
        pic: picNode ? picNode.getAttribute('src') : '',
        uid: picNode ? picNode.getAttribute('usercard').split('=')[1]: '',
        content : contentNode ? contentNode.innerHTML : '',
        date: dateNode ? dateNode.innerText.trim() : '',
        name: picNode ? picNode.getAttribute('alt') : '',
        userUrl: aNode ? aNode.getAttribute('href') : ''
    }
}

function get_comment_list() {
    var listNode = document.body.querySelector('div.WB_feed > div > div > div.WB_feed_repeat[node-type=comment_detail] > div > div.repeat_list > div[node-type=feed_list] > div.list_box > div.list_ul');
    var listNodes = listNode ? listNode.children : [];

    var result = []
    for (let index = 0; index < listNodes.length; index++) {
        const node = listNodes[index];
        if (node.getAttribute('comment_id')) {
            result[result.length] = get_comment_list_result(node);
        }
    }

    return result;
}

/**
 * 提取微博内容
 */
function get_page_detail() {

    var countNode = document.body.querySelector('div.WB_feed_handle > div.WB_handle li span[node-type=comment_btn_text] em:last-child');
    var list = get_comment_list();
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

    if (!has_feed_node()) {
        sendActive();
        reload();
        return;
    }

    console.log('weiboDetailComment.js finish');

    sendActive(get_page_detail());

    chrome.runtime.sendMessage({
        event: window.site_spider_done_event_id,
        taskId: window.site_spider_task_id
    });
}

window.pageLoaderPid = window.setTimeout( finish, 500 );