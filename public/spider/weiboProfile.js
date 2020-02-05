

var baseUrl = 'https://weibo.com';

/**
 * 提取微博列表内容
 * @param {Document} node 
 */
function get_node_result(node) {
    if (!node) return null;
    var dateNode = node.querySelector('div.WB_detail div.WB_from [node-type=feed_list_item_date]');
    var expandANode = node.querySelector('div.WB_detail div.WB_feed_expand div.WB_func div.WB_from a[node-type=feed_list_item_date]');
    var contentNode = node.querySelector('div.WB_detail div.WB_text[node-type=feed_list_content]');
    var fromNode = node.querySelector('div.WB_detail div.WB_from [action-type=app_source]');
    var forwardNode = node.querySelector('div.WB_feed_handle > div.WB_handle li span[node-type=forward_btn_text] em:last-child');
    var commentNode = node.querySelector('div.WB_feed_handle > div.WB_handle li span[node-type=comment_btn_text] em:last-child');
    var likeNode = node.querySelector('div.WB_feed_handle > div.WB_handle li span[node-type=like_status] em:last-child');
    return {
        date: dateNode ? dateNode.getAttribute('title') : '',
        url: dateNode ? baseUrl + dateNode.getAttribute('href') : '',
        feedContent : contentNode ? contentNode.innerHTML : '',
        expandUrl: expandANode ? baseUrl + expandANode.getAttribute('href') : null,
        from: fromNode ? fromNode.innerText : '',
        forward: forwardNode ? forwardNode.innerText : '',
        comment: commentNode ? commentNode.innerText : '',
        like: likeNode ? likeNode.innerText : ''
    }
}


function has_feed_node() {
    return get_feed_node() != null;
}

function get_feed_node() {
    var ulNode = document.body.querySelector('div.WB_feed[node-type=feed_list]');
    if (ulNode) {
        return ulNode.children
    } else {
        return null;
    }
}

function get_page_feed() {
    // feel nodes
    var nodes = get_feed_node();

    
    var results = [];
    for (var index = 0; index < nodes.length; index++) {
        let node = nodes[index];
        if (node.hasAttribute('action-type') && !node.querySelector('div.WB_cardtitle_b')) {
            results[results.length] = get_node_result(node)
        }
    }

    console.log('weiboTarget.js get_page_feed', results);
    return results.filter(function(item) { return item != null });
}


function next_page_node() {
    return document.body.querySelector('#Pl_Official_RelationMyfollow__95 > div > div > div > div.WB_cardpage.S_line1 > div > a.page.next.S_txt1.S_line1[href]')
}

function get_next_page_url() {
    var node = next_page_node();
    return baseUrl + node.getAttribute('href');
}

function has_next_page() {
    return next_page_node();
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

    console.log('weiboProfile.js finish');

    sendActive(get_page_feed());

    if (has_next_page()) {
        // TODO: ??
        chrome.runtime.sendMessage({
            call: 'spider.follow',
            params: {
                url: get_next_page_url()
            },
            taskId: window.site_spider_task_id
        });
    } else {
        chrome.runtime.sendMessage({
            event: window.site_spider_done_event_id,
            taskId: window.site_spider_task_id
        });
    }
}

window.pageLoaderPid = window.setTimeout( finish, 500 );