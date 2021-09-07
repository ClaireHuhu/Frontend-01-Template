class MyComponent {
    constructor(config){
        this.children = [];
    }

    setAttribute(name, value) { //attribute
        console.log(name,value);
    }

    appendChild(child){
        this.children.push(child);
    }
    
    render(){   //{this.slot} 括号里面的内容,作为create的第三个参数传入 
    //  create("article", null, create("header", null, "I'm a header"), this.slot, create("footer", null, "I'm a footer"));
        return <article>
            <header>I'm a header</header>
            {this.slot}                        
            <footer>I'm a footer</footer>
        </article>
    }

    mountedTo(parent){
        this.slot = <div></div>
        for(let child of this.children){
            this.slot.appendChild(child)
        }
        this.render().mountedTo(parent)
    }
}

class Wrapper {
    constructor(type) {
        this.children = [];
        this.root = document.createElement(type);
    }
    set class(value) {
        console.log('class value',value)
    }
    setAttribute(name,value) {
        console.log(name,value);
    }
    appendChild(child) {
        this.children.push(child);
    }
    mountedTo(ele) {
        ele.appendChild(this.root)
        for(let child of this.children) {   
            child.mountedTo(this.root);
        }
    }
}
class Text {    
    constructor(text){
        this.children = [];
        this.root = document.createTextNode(text);
    }
    mountedTo(parent){
        parent.appendChild(this.root);
    }
}

function create(Cls, attributes, ...children) {
    let o;
    if(typeof Cls === 'string') {
        o = new Wrapper(Cls)
    } else {
        o = new Cls({timer:{}})
    }

  for(let name in attributes) {
    //    o[name] = attributes[name];  // property 和 attribute 统一
    o.setAttribute(name,attributes[name]); // property  和 attribute 分开
   }

   for(let child of children) {
       if(typeof child === 'string') {
           child = new Text(child)
       }
       o.appendChild(child)
   }

  return o
}

let component = (
  <MyComponent id="a" class="test">
    <MyComponent class="b"></MyComponent>
    <MyComponent class="b"></MyComponent>
    <div>test{new Wrapper('span')}</div>
  </MyComponent>
)

component.mountedTo(document.body)

console.log('>',component)
