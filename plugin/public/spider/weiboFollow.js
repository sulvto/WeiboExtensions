

var baseUrl = 'https://weibo.com';

/**
 * 提取关注人基本信息
 * @param {Document} node 
 */
function get_node_result(node) {
    if (!node) return null;
    var nameNode = node.querySelector('.follow_item .mod_pic > a');
    var introNode = node.querySelector('.follow_item .mod_info > .info_intro span');
    var picNode = node.querySelector('.follow_item .mod_pic > a > img');
    var fromNode = node.querySelector('.follow_item .mod_info > .info_from a[class=from]');
    var usercard = picNode ? picNode.getAttribute('usercard') : '=';

    return {
        name: nameNode ? nameNode.getAttribute('title') : '',
        url: nameNode ? baseUrl + nameNode.getAttribute('href') : '',
        intro : introNode ? introNode.innerText : '',
        pic: picNode ? picNode.getAttribute('src') : '',
        from: fromNode ? fromNode.innerText : '',
        uid: usercard ? usercard.match('id=([^\&]+)\&')[1] : ''
    }
}

function has_follow_node() {
    return get_follow_list_node() != null;
}

function get_follow_list_node() {
    var ulNode = document.body.querySelector('div.follow_box > div.follow_inner > ul.follow_list');
    if (ulNode) {
        return ulNode.children
    } else {
        return null;
    }
}

function get_page_follow() {
    // follow nodes
    var nodes = get_follow_list_node();

    
    var results = [];
    for (var index = 0; index < nodes.length; index++) {
        results[index] = get_node_result(nodes[index])
    }

    console.log('weiboMyfollow.js get_page_follow', results);
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
    // TODO: ??
    return false;
}


function reload() {
    chrome.runtime.sendMessage({
        call: 'spider.follow',
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

    if (!has_follow_node()) {
        sendActive();
        reload();
        return;
    }

    console.log('weiboFollow.js finish');

    sendActive(get_page_follow());

    if (has_next_page()) {
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