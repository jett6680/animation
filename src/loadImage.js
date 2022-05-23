'use strict';

var __id = 0;

function _getId() {
    return ++__id;
}

/**
 * 预加载图片函数
 * @param images 图片数组
 * @param callback 图片加载完成的回调函数
 * @param timeout 加载超时的时长
 */
function loadImage(images,callback,timeout) {
    // 加载完成图片的计数器
    var count = 0;
    // 全部图片加载成功的标志位
    var success = true;
    // 超时的timer的id
    var timeoutId = null;
    // 是否超时的标志位
    var isTimeout = false;

    for (var key in images){
        // 如果是原型上的key就跳过
        if(!images.hasOwnProperty(key)){
            continue;
        }

        count++;
        // 期望的格式是{src:xxx}
        var item = images[key];


        if(typeof item === 'string'){
            item = images[key] = {
                src:item
            }
        }
        // 给item设置id和image对象 item = {src:xxx,id:yyy,img:object}
        item.id = "__img__"+key+_getId();
        item.img = window[item.id] = new Image();

        _doLoad(item);
    }

    // 如果计数器为0 则直接调用回调
    if(!count){
        callback(success);
    }
    // 如果设置了加载时长，则设置超时函数计时器
    else if(timeout){
        timeoutId = setTimeout(onTimeout,timeout);
    }

    /**
     * 真正进行图片加载的函数
     * @param item
     * @private
     */
    function _doLoad(item) {
        item.status = 'loading';
        var img = item.img;

        // 定义图片加载成功的回调函数
        img.onload = function () {
            success = success & true;
            item.status = 'loaded';
            _done();
        };
        // 定义图片加载失败的回调函数
        img.onerror = function () {
            success = false;
            item.status = 'error';
            _done();
        };

        // 真正发起http请求去加载图片
        img.src = item.src;
        // 图片结束完的_done方法的执行是在for循环结束完
        function _done() {
            img.onload = img.onerror = null;

            try{
                delete window[item].id;
            }catch (e) {}
            /**
             * 加载完 对计数器作减法，减减
             * 当所有图片都请求完，如果设置了定时器，并且没有超时，则清楚定时器
             * 并且执行回调函数，不然定时器的也会执行
             */
            if(!--count && !isTimeout){
                clearTimeout(timeoutId);
                callback(success);
            }
        }

    }

    // 超时函数
    function onTimeout(){
        isTimeout = true;
        callback(false);
    }

}

module.exports = loadImage;