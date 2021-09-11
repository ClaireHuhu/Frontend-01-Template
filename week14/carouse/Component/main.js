class Carousel {
  constructor() {
    this.root = null
    this.data = null
  }
  render() {
    let children = this.data.map((url) => {
      let element = <img src={url} />
      element.addEventListener('dragstart', (event) => event.preventDefault())
      return element
    })
    this.root = <div class="carousel"> {children} </div>

    let position = 0

    // 在root根节点上添加动作监听
    this.root.addEventListener('mousedown', (event) => {
      let startX = event.clientX

      // 用取余的方法获取位置
      //+ 正数：循环不变，只是向后移动；如 postion%this.data.length => 0 1 2 3
      // 而 (position + 1)%this.data.length => 1 2 3 0
      // 如果是 (position - 1)%this.data.length => -1 0 1 2 3 0 1 2 3
      // 解决的方式 + this.data.length => 实质是只能+正整数，把 - 转换为 + 正整数
      let nextPosition = (position + 1) % this.data.length
      let lastPosition = (position - 1 + this.data.length) % this.data.length

      // 获取初始状态的index，并且移动到中间
      let current = children[position]
      let next = children[nextPosition]
      let last = children[lastPosition]

      current.style.transition = 'ease 0s'
      next.style.transition = 'ease 0s'
      last.style.transition = 'ease 0s'

      current.style.transform = `translateX(${-500 * position}px)`
      next.style.transform = `translateX(${500 - 500 * nextPosition}px)`
      last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`

      // 鼠标移动时，整体移动图片
      let move = (event) => {
        current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`
        next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)`
        last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPosition}px)`
      }
      let mouseup = (event) => {
        let offset = 0

        // 判断鼠标是否移动过半，需要转到下一个图片
        if (event.clientX - startX > 250) {
          offset = 1
        } else if (event.clientX - startX < -250) {
          offset = -1
        }

        current.style.transition = ''
        next.style.transition = ''
        last.style.transition = ''

        current.style.transform = `translateX(${offset * 500 - 500 * position}px)`
        next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`
        last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`

        // 更新postition
        position = (position - offset + this.data.length) % this.data.length

        this.root.removeEventListener('mousemove', move)
        this.root.removeEventListener('mouseup', mouseup)
      }

      this.root.addEventListener('mousemove', move)
      this.root.addEventListener('mouseup', mouseup)
    })

    return this.root
  }
  setAttribute(name, data) {
    this[name] = data
  }
  mountedTo(parent) {
    this.render().mountedTo(parent)
  }
}

class Wrapper {
  constructor(type) {
    this.children = []
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
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
class Text {
  constructor(text) {
    this.children = []
    this.root = document.createTextNode(text)
  }
  mountedTo(parent) {
    parent.appendChild(this.root)
  }
}

function create(Cls, attributes, ...children) {
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

let imgList = [
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg', 
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg', 
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg', 
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
]
let component = <Carousel data={imgList}></Carousel>

component.mountedTo(document.body)
