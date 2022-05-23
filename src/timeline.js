'use strict';
var DEFAULT_INTERVAL = 1000 / 60;

var STATE_INITIAL = 0;
var STATE_START = 1;
var STATE_STOP = 2;

/**
 * raf
 */
var requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);
        }
})();

var cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        }
})();

/**
 * 异步任务执行时间轴
 * @constructor
 */
function Timeline() {
    this.animationHandler = null;
    this.state = STATE_INITIAL;
}

/**
 * 接口类 时间轴上每一次回调执行的函数
 * @param time 从动画开始到当前执行的时间
 */
Timeline.prototype.onenterframe = function (time) {

};

/**
 * 动画开始
 * @param interval 每一次回调的间隔时间
 */
Timeline.prototype.start = function (interval) {
    if (this.state === STATE_START) {
        return;
    }
    this.state = STATE_START;
    this.interval = interval || DEFAULT_INTERVAL;
    // 开始执行动画
    startTimeline(this, +new Date());
};

/**
 * 停止动画
 */
Timeline.prototype.stop = function () {
    if(this.state !== STATE_START){
        return;
    }
    this.state = STATE_STOP;

    // 如果动画开始过,记录动画开始到当前执行的时间
    if(this.startTime){
        this.dur = +new Date() - this.startTime;
    }
    // 清楚当前执行的raf
    cancelAnimationFrame(this.animationHandler);

};

/**
 * 重新开始动画
 */
Timeline.prototype.restart = function () {
    if(this.state === STATE_START){
        return;
    }

    if(!this.dur || !this.interval){
        return;
    }

    this.state = STATE_START;
    // 无缝开始动画
    startTimeline(this,+new Date() - this.dur);
};

/**
 * 时间轴动画启动函数
 * @param timeline 时间轴实例
 * @param startTime 动画开始的时间戳
 */
function startTimeline(timeline, startTime) {
    // 记录上一次回调的时间戳
    var lastTick = +new Date();
    timeline.startTime = startTime;
    nextTick.interval = timeline.interval;

    nextTick();

    /**
     * 每一帧执行的函数
     */
    function nextTick() {
        var now = +new Date();
        timeline.animationHandler = requestAnimationFrame(nextTick);
        if(now - lastTick >= timeline.interval){
            // 执行回调，并传入动画开始到现在得执行时间
            timeline.onenterframe(now - startTime);
            lastTick = now;
        }
    }
}

module.exports = Timeline;