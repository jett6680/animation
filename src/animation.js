'use strict';
var loadImage = require("./loadImage");
var Timeline = require("./timeline");

// 初始状态
var STATE_INITIAL = 0;
// 开始状态
var STATE_START = 1;
// 停止状态
var STATE_STOP = 2;

// 同步任务
var TASK_SYNC = 0;
// 异步任务
var TASK_ASYNC = 1;

function _global_next(callback) {
    callback || callback();
}

/**
 * 动画库构造函数
 * @constructor
 */
function Animation() {
    this.taskQueue = [];
    this.index = 0;
    this.state = STATE_INITIAL;
    this.timeline = new Timeline();
}

/**
 * 添加一个同步任务，预加载图片
 * @param imageList 图片路径列表 数组
 */
Animation.prototype.loadImage = function (imageList) {
    var taskFn = function (next) {
        loadImage(imageList, next);
    };
    // 生命加载图片的任务类型
    var type = TASK_SYNC;
    return this._add(taskFn, type);
};

/**
 * 开始执行任务
 * @param interval 执行任务的间隔
 */
Animation.prototype.start = function (interval) {
    if (this.state === STATE_START) {
        return this;
    }
    // 如果当前执行队列为空 则返回
    if (this.taskQueue.length === 0) {
        return this;
    }

    this.state = STATE_START;

    this.interval = interval;

    // 执行任务
    this._runTask();

    return this;
};

/**
 * 添加一个异步定时任务，通过定时改变图片背景位置，实现帧动画
 * @param ele dom对象
 * @param positions 背景位置数组
 * @param imageUrl 图片地址
 */
Animation.prototype.changePosition = function (ele, positions, imageUrl) {
    var len = positions.length;
    var taskFn;
    var type;

    if (len) {
        var self = this;
        taskFn = function (next, time) {
            if (imageUrl) {
                ele.style.backgroundImage = "url(" + imageUrl + ")";
            }
            // 获取当前执行到哪个背景图了获取对应的定位信息
            var index = Math.min(time / self.interval | 0, len - 1);
            var position = positions[index].split(" ");
            ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
            // 当执行完positions里面的背景图的信息，则执行下一个任务
            if (index === len - 1) {
                next();
            }
        };
        type = TASK_ASYNC;
    } else {
        taskFn = _global_next;
        type = TASK_SYNC;
    }
    this._add(taskFn, type);
};

/**
 * 添加一个异步定时任务，通过定时改变背景图片地址，实现帧动画
 * @param ele dom(Image对象)
 * @param imgList 图片地址数组
 */
Animation.prototype.changeSrc = function (ele, imgList) {
    var len = imgList.length;
    var taskFn;
    var type;

    if (len) {
        var self = this;
        taskFn = function (next, time) {
            // 获取当前执行到哪个背景图了获取对应的定位信息
            var index = Math.min(time / self.interval | 0, len - 1);
            ele.src = imgList[index];
            // 当执行完positions里面的背景图的信息，则执行下一个任务
            if (index === len - 1) {
                next();
            }
        };
        type = TASK_ASYNC;
    } else {
        taskFn = _global_next;
        type = TASK_SYNC;
    }
    this._add(taskFn, type);
};

/**
 * 高级用法，添加一个异步定时执行的任务，
 * 该任务自定义动画每帧执行的任务函数
 * @param taskFn 每帧执行的任务函数
 */
Animation.prototype.enterFrame = function (taskFn) {
    return this._add(taskFn, TASK_ASYNC);
};

/**
 * 执行一个同步任务
 * @param callback
 * @returns {Animation}
 */
Animation.prototype.then = function (callback) {
    var taskFn = function (next) {
        callback();
        next();
    };

    var type = TASK_SYNC;

    return this._add(taskFn, type);
};

/**
 * 添加一个同步任务，任务是回退到上一个任务
 * @param times 重复次数
 */
Animation.prototype.repeat = function (times) {
    var self = this;
    var taskFn = function () {
        if (typeof times === 'undefined') {
            self.index--;
            self._runTask();
            return;
        }
        if (times) {
            times--;
            self.index--;
            self._runTask();
        } else {
            self._next();
        }
    };

    var type = TASK_SYNC;

    return this._add(taskFn, type);
};

/**
 * 设置执行完当前任务到下一个任务的等待时间
 * @param time
 */
Animation.prototype.wait = function (time) {
    if (this.taskQueue && this.taskQueue.length > 0) {
        this.taskQueue[this.taskQueue.length - 1].wait = time;
    }
    return this;
};

/**
 * 暂停异步任务
 */
Animation.prototype.pause = function () {
    if(this.state !== STATE_START){
        return this;
    }

    this.state = STATE_STOP;
    this.timeline.stop();
    return this;
};

/**
 * 重新启动
 */
Animation.prototype.restart = function(){
    if(this.state !== STATE_STOP){
        return this;
    }
    this.state = STATE_START;
    this.timeline.restart();
    return this;
};

/**
 * 释放资源
 */
Animation.prototype.dispose = function () {

    if(this.state !== STATE_INITIAL){
        this.state = STATE_INITIAL;
        this.timeline.stop();
        this.timeline = null;
        this.taskQueue.length = 0;
    }

    return this;
};

/**
 * 将任务添加到任务队列
 * @param fn 执行的任务(函数)
 * @param type 类型
 * @private
 */
Animation.prototype._add = function (fn, t) {
    this.taskQueue.push({
        taskFn: fn,
        type: t
    });

    return this;
};

/**
 * 执行任务
 * @private
 */
Animation.prototype._runTask = function () {
    // 如果任务队列为空或者状态不等于开始状态，则返回
    if (this.taskQueue.length === 0 || this.state !== STATE_START) {
        return;
    }
    // 如果任务执行完 则释放资源
    if (this.index === this.taskQueue.length) {
        this.dispose();
        return;
    }

    // 获取一个任务
    var task = this.taskQueue[this.index];
    // 如果是同步任务
    if (task.type === TASK_SYNC) {
        this._syncTask(task);
    } else {
        this._asyncTask(task);
    }
};

/**
 * 执行同步任务
 * @param task 任务 {taskFn:function,type:xxx}
 * @private
 */
Animation.prototype._syncTask = function (task) {
    var self = this;

    var next = function () {
        // 切换到下一个任务
        self._next();
    };

    var taskFn = task.taskFn;
    taskFn(next);
};

/**
 * 执行异步任务
 * @param task 任务 {taskFn:function,type:xxx}
 * @private
 */
Animation.prototype._asyncTask = function (task) {
    var self = this;

    function onterFrame(time) {
        var taskFn = task.taskFn;

        var next = function () {
            // 停止当前任务
            self.timeline.stop();
            // 开启下一个任务
            self._next();
        };

        taskFn(next, time);
    }

    this.timeline.onenterframe = onterFrame;
    this.timeline.start(this.interval);
};

/**
 * 切换到写一个任务 如果当前任务需要等待，则延迟执行
 * @private
 */
Animation.prototype._next = function (task) {
    this.index++;
    var self = this;
    (task && task.wait) ? setTimeout(function () {
        self._runTask();
    }, task.wait) : this._runTask();
};
