
var baseUrl = 'https://weibo.com';

function has_feed_node() {
    return document.body.querySelector('div.WB_frame_c div > div > div > div.WB_feed_detail.clearfix > div.WB_detail > div.WB_from a[node-type=feed_list_item_date]');
}

/**
 * 提取微博内容
 */
function get_page_detail() {

    var dateNode = document.body.querySelector('div.WB_frame_c div > div > div > div.WB_feed_detail.clearfix > div.WB_detail > div.WB_from a[node-type=feed_list_item_date]');
    var contentNode = document.body.querySelector('div.WB_frame_c div > div > div > div.WB_feed_detail.clearfix > div.WB_detail > div.WB_text');
    var fromNode = document.body.querySelector('div.WB_frame_c div > div > div > div > div.WB_feed_detail.clearfix > div.WB_detail > div.WB_from > a[action-type=app_source]');
    var forwardNode = document.body.querySelector('div.WB_feed_handle > div.WB_handle li span[node-type=forward_btn_text] em:last-child');
    var commentNode = document.body.querySelector('div.WB_feed_handle > div.WB_handle li span[node-type=comment_btn_text] em:last-child');
    var likeNode = document.body.querySelector('div.WB_feed_handle > div.WB_handle li span[node-type=like_status] em:last-child');
    var expandANode = document.body.querySelector('div.WB_detail div.WB_feed_expand div.WB_func div.WB_from a[node-type=feed_list_item_date]');

    return {
        date: dateNode ? dateNode.getAttribute('title') : '',
        url: dateNode ? baseUrl + dateNode.getAttribute('href') : '',
        content : contentNode ? contentNode.innerHTML : '',
        expandUrl: expandANode ? baseUrl + expandANode.getAttribute('href') : null,
        from: fromNode ? fromNode.innerText : '',
        forward: forwardNode ? forwardNode.innerText : '',
        comment: commentNode ? commentNode.innerText : '',
        like: likeNode ? likeNode.innerText : ''
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

    console.log('weiboDetail.js finish');

    sendActive(get_page_detail());

    chrome.runtime.sendMessage({
        event: window.site_spider_done_event_id,
        taskId: window.site_spider_task_id
    });
}

window.pageLoaderPid = window.setTimeout( finish, 500 );