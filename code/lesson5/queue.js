class MyQueue {
    constructor(k) {
        this.list = new Array(k);
        this.max = k;
        // 队列首部指针
        this.front = 0;
        // 队列尾部指针
        this.rear = 0;
    }

    // 向队列插入一个元素  如果成功 则返回true
    enQueue(value){
        if(this.isFull()){
            return false;
        }

        this.list[this.rear] = value;
        this.rear = (this.rear+1) % this.max;
        return true;
    }

    // 向队列删除一个元素 如果成功删除 则返回true
    deQueue(){
        if(this.isEmpty()){
            return false;
        }
        const v = this.list[this.front];
        this.list[this.front] = null;
        this.front = (this.front+1) % this.max;
        return v;
    }

    // 检查队列是否是空的
    isEmpty(){
        return this.front === this.rear && !this.list[this.front];
    }

    // 检查队列是否是满的
    isFull(){
        return this.front === this.rear && !!this.list[this.front];
    }

    // 获取队首元素
    Front(){
        return this.list[this.front];
    }

    // 获取队尾元素
    Rear(){
        const rear = (this.rear-1) < 0 ? (this.max-1) : this.rear;
        return this.list[rear];
    }
}

const myQueue = new MyQueue(4);
myQueue.enQueue(1)
myQueue.enQueue(2)
myQueue.enQueue(3)
myQueue.enQueue(4)
console.log(myQueue.isFull());
console.log(myQueue.Front());
console.log(myQueue.Rear());

