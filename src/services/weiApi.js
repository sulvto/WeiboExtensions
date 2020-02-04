/** * 微博接口 */
import HttpRequest from '@beancommons/http';

/**
 * 获取微博粉丝数据
 * @param {string} uid 
 * @param {number} page 
 */
export function fansRaw(uid, page) {
    const params = {
        pids: 'Pl_Official_RelationFans__90',
        cfs: 600,
        relate: 'fans',
        t: 1,
        f: 1,
        type: '', 
        Pl_Official_RelationFans__90_page: page,
        ajaxpagelet: 1,
        ajaxpagelet_v6: 1,
        __ref: `/${uid}/fans?cfs=600&relate=fans&t=1&f=1&type=&Pl_Official_RelationFans__90_page=2#Pl_Official_RelationFans__90`,
        _t: 'FM_158069158320159'
    }

    return HttpRequest({
        baseURL: `https://weibo.com/${uid}/fans`,
        url: '/getUser',
        params
    });
}