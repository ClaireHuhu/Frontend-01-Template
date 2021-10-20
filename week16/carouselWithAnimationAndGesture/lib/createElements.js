import { enableGesture } from "./gesture";
export class Wrapper {
    constructor(type) {
      this.children = []
      this.root = document.createElement(type)
    }
    setAttribute(name, value) {
      this.root.setAttribute(name, value)

      if (name.match(/^on([\s\S]+)$/)) {
        let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
        this.addEventListener(eventName, value)
      }

      if (name === 'enableGesture') {
        enableGesture(this.root)
      }
    }
    appendChild(child) {
      this.children.push(child)
    }
    mountedTo(ele) {
      ele.appendChild(this.root)
      for (let child of this.children) {
        child.mountedTo(this.root)
      }
    }
    addEventListener() {
      this.root.addEventListener(...arguments)
    }
    removeEventListener() {
      this.root.removeEventListener(...arguments)
    }
    get style() {
      return this.root.style
    }
  }
export  class Text {
    constructor(text) {
      this.children = []
      this.root = document.createTextNode(text)
    }
    mountedTo(parent) {
      parent.appendChild(this.root)
    }
  }
  
export  function create(Cls, attributes, ...children) {
    let o
    if (typeof Cls === 'string') {
      o = new Wrapper(Cls)
    } else {
      o = new Cls()
    }
  
    for (let name in attributes) {
      o.setAttribute(name, attributes[name])
    }
  
    let visit = (children) => {
      for (let child of children) {
        if (child instanceof Array) {
          visit(child)
          continue
        }
        if (typeof child === 'string') {
          child = new Text(child)
        }
        o.appendChild(child)
      }
    }
    visit(children)
  
    return o
  }