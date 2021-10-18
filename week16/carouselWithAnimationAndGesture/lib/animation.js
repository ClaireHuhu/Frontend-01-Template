export class Timeline {
    constructor() {
        this.animations = [];
        this.requestId = null; // 记录id
        this.state = "inited";
        this.tick = () => {
            let t = Date.now() - this.startTime; // 获得当前时刻
            let animations = this.animations.filter(animation => !animation.finished) // 筛选出没有完结的animation
    
            for (let animation of animations) {
                let {object, property, template, start, end, timingFunction, duration, delay, addTime} = animation
                let progression = timingFunction((t - delay - addTime)/duration);  // 0- 1 之间的数
    
                if(t > duration + delay + addTime) { // 已经结束的动画，强制设置progresson为1，finished为true
                    progression = 1;
                    animation.finished = true;
                } 
    
                let value = animation.valueFromProgression(progression);  // value 就是根据progression 算出来的当前值
    
                object[property] = template(value)  // 通过timingFunction获当前位置，当前位置作为修改属性值的入参
            }
    
            if(animations.length) { // 还有没有执行的动画时，才执行，优化性能
                this.requestId = requestAnimationFrame(this.tick)
            }
        }
    }
    add (animation, addTime) {
        this.animations.push(animation)
        animation.finished = false;
        if(this.state == 'playing') {
            animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime
        } else {
            animation.addTime = addTime !== void 0 ? addTime : 0
        }
    }
    start () {
        if (this.state !== 'inited') {
            return;
        }
        this.state = 'playing'
        this.startTime = Date.now();
        this.tick()
    }
    pause () {
        if (this.state !== 'playing') {
            return;
        }
        this.state = 'paused'
        this.pauseTime = Date.now();
        if(this.requestId != null) {
            cancelAnimationFrame(this.requestId)
        }
    }
    resume () {
        if (this.state !== 'paused') {
            return;
        }
        this.state = 'playing'
        this.startTime = this.startTime + (Date.now() - this.pauseTime); // 本来的startTime，暂停，相当于startTime推迟了暂停的时间
        this.tick()
    }
    restart () {
        if (this.state === "playing") {
            this.pause();
        }
        this.animations = [];
        this.requestID = null;
        this.state = "inited";
        this.startTime = Date.now();
        this.pauseTime = null;
        this.tick();
    }
}

export class Animation {
    constructor(object, property, template,start, end, duration, delay, timingFunction) {
        this.object = object; // style对象
        this.property = property; // 修改的style 属性名
        this.template = template;  // 修改style属性值的模板函数（传入值，修改属性值）
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction 
    }
    valueFromProgression(progression) {
        return this.start + progression * (this.end - this.start)
    }
}

export class ColorAnimation {
    constructor(object, property, template,start, end, duration, delay, timingFunction) {
        this.object = object; // style对象
        this.property = property; // 修改的style 属性名
        this.template = template || (v=>`rgba(${v.r},${v.g},${v.b},${v.a})`);  // 修改style属性值的模板函数（传入值，修改属性值）
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay || 0;
        this.timingFunction = timingFunction 
    }
    valueFromProgression(progression) {
        return {
            r: this.start.r + progression * (this.end.r - this.start.r),
            g: this.start.g + progression * (this.end.g - this.start.g),
            b: this.start.b + progression * (this.end.b - this.start.b),
            a: this.start.a + progression * (this.end.a - this.start.a)
        }
    }
}

/*
用法：

let animation1 = new Animation(object, prototype, start, end, duration, delay, timingFunction)
let animation2 = new Animation(object, prototype, start, end, duration, delay, timingFunction)

let timeline = new Timeline;
timeline.add(animation1);
timeline.add(animation2);

timeline.start();
timeline.pause();
timeline.resume();
timeline.stop();

*/