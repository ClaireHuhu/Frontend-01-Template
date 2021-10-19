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

      let children = this.data.map((url) => {
        let element = <img src={url}/> 
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