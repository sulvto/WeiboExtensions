

var baseUrl = 'https://weibo.com';

/**
 * 提取关注人基本信息
 * @param {Document} node 
 */
function get_node_result(node) {
    if (!node) return null;
    var nameNode = node.querySelector('[node-type=screen_name]');
    var introNode = node.querySelector('.member_wrap > .mod_info > .W_autocut.text');
    var picNode = node.querySelector('.member_wrap > .mod_pic > p.pic_box > a > img');
    var fromNode = node.querySelector('.member_wrap > .mod_info > .info_from > a.S_link2');
    var usercard = picNode ? picNode.getAttribute('usercard') : '=';
    return {
        name: nameNode ? nameNode.getAttribute('title') : '',
        url: nameNode ? baseUrl + nameNode.getAttribute('href') : '',
        intro : introNode ? introNode.innerText : '',
        pic: picNode ? picNode.getAttribute('src') : '',
        from: fromNode ? fromNode.innerText : '',
        uid: usercard ? usercard.split('=')[1] : ''
    }
}


function has_myfollow_node() {
    return get_myfollow_node() != null;
}

function get_myfollow_node() {
    var ulNode = document.body.querySelector('#Pl_Official_RelationMyfollow__95 > div > div > div > div.member_box > ul');
    if (ulNode) {
        return ulNode.children
    } else {
        return null;
    }
}

function get_page_myfollow() {
    // follow nodes
    var nodes = get_myfollow_node();

    
    var results = [];
    for (var index = 0; index < nodes.length; index++) {
        results[index] = get_node_result(nodes[index])
    }

    console.log('weiboMyfollow.js get_page_myfollow', results);
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
        call: 'spider.myfollow',
        params: {
            url: window.location.href
        },
        taskId: window.site_spider_task_id
    });
}

window.attemptedLoads = 0;


function sendActive(data) {
    chrome.runtime.sendMessage({
        event: 'spider.active',
        data: data,
        taskId: window.site_spider_task_id
    });
}

function sendNextPageCall() {
    chrome.runtime.sendMessage({
        call: 'spider.myfollow',
        params: {
            url: get_next_page_url()
        },
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

    if (!has_myfollow_node()) {
        sendActive();
        reload();
        return;
    }

    console.log('weiboMyfollow.js finish');

    sendActive(get_page_myfollow());

    // if (has_next_page()) {
        // sendNextPageCall();
    // } else {
        chrome.runtime.sendMessage({
            event: 'spider.done',
            taskId: window.site_spider_task_id
        });
    // }
}

window.pageLoaderPid = window.setTimeout( finish, 500 );