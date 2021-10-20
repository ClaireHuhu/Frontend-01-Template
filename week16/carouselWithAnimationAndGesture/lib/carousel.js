import {create, Wrapper, Text} from './createElements.js'
import { Timeline, Animation } from "./animation"
import {ease} from "./cubicBezier";

export class Carousel {
    constructor() {
      this.root = null
      this.data = null
    }
    render() {
      this.timeline = new Timeline;
      this.timeline.start();

      let children = this.data.map((url,currentPosition) => {
        let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length;
        let nextPosition = (currentPosition + 1) % this.data.length;

        let offset = 0;

        let onStart = () => {
          this.timeline.pause();
          clearTimeout(nextPicStopHandler);
          let currentElement = children[currentPosition];

          let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1])

          offset = currentTransformValue + 500 * currentPosition
        }

        let onPan = (event) => {
          let lastElement = children[lastPosition];
          let currentElement = children[currentPosition]
          let nextElement = children[nextPosition]

          let dx = event.clientX - event.startX;

          let  currentTransformValue = - 500 * currentPosition + offset  + dx;
          let  lastTransformValue = - 500 - 500 * lastPosition + offset + dx;
          let  nextTransformValue = 500 - 500 * nextPosition + offset + dx;

          lastElement.style.transform = `translateX(${lastTransformValue}px)`;
          currentElement.style.transform = `translateX(${currentTransformValue}px)`;
          nextElement.style.transform = `translateX(${nextTransformValue}px)`;
        }

        let onPanend = (event)=>{

          let direction = 0;
          let dx = event.clientX - event.startX;

          if(dx + offset > 250 || dx > 0 && event.flick){  // ** 处理flick的情况
              direction = 1;
          }else if(dx + offset < - 250 || dx < 0 && event.flick){
              direction = -1;
          }

          this.timeline.reset();
          this.timeline.start();

          let lastElement = children[lastPosition];
          let currentElement = children[currentPosition];
          let nextElement = children[nextPosition];

          
          let lastTransformValue  = {
              start:- 500 - 500 * lastPosition + offset + dx,
              end: - 500 - 500 * lastPosition + direction * 500
          }
          let currentTransformValue = {
              start:- 500 * currentPosition + offset  + dx,
              end:- 500 * currentPosition  + direction * 500//终止位置要到500 * x的正确位置
          }
          let nextTransformValue = {
              start:500 - 500 * nextPosition + offset + dx,
              end: 500 - 500 * nextPosition + direction * 500
          }

          let lastAnimation = new Animation(lastElement.style, 'transform', lastTransformValue.start, lastTransformValue.end, 500, 0, ease, v=>`translateX(${v}px)`);
          let currentAnimation = new Animation(currentElement.style, 'transform', currentTransformValue.start, currentTransformValue.end, 500, 0, ease, v=>`translateX(${v}px)`);
          let nextAnimation = new Animation(nextElement.style, 'transform', nextTransformValue.start, nextTransformValue.end, 500, 0, ease, v=>`translateX(${v}px)`);

          this.timeline.add(currentAnimation)
          this.timeline.add(nextAnimation)
          this.timeline.add(lastAnimation)

          position = (position - direction + this.data.length) % this.data.length;

          //继续播放下一张
          nextPicStopHandler = setTimeout(nextPic,3000);
      }        

        let element = <img src={url} onStart={onStart} onPan={onPan} onPanend={onPanend} enableGesture={true}/> 
        element.addEventListener('dragstart', (event) => event.preventDefault())
        return element
      })
      this.root = <div class="carousel"> {children} </div>
  
      let position = 0
      let nextPicStopHandler = null;
      // 做动画，setTimeout来执行一次滑动，滑动中有两个动画

      let nextPic = () => {
        let nextPosition = (position + 1) % this.data.length;

        let current = children[position]
        let next = children[nextPosition]

        let currentAnimation = new Animation(current.style, 'transform',  - 100 * position, -100 - 100 * position, 500, 0, ease, v=>`translateX(${5 * v}px)`)
        let nextAnimation = new Animation(next.style, 'transform',  100 - 100 * nextPosition, - 100 * nextPosition, 500, 0, ease, v=>`translateX(${5 * v}px)`)
        
        this.timeline.add(currentAnimation);
        this.timeline.add(nextAnimation);
        position = nextPosition;
        nextPicStopHandler = setTimeout(nextPic, 3000)
      }
      nextPicStopHandler = setTimeout(nextPic, 3000)
  
      return this.root
    }
    setAttribute(name, data) {
      this[name] = data
    }
    mountedTo(parent) {
      this.render().mountedTo(parent)
    }
  }