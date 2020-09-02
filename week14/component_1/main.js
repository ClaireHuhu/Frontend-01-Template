/************************  1.0  ******************************/
// function create() {
//     console.log(arguments);// ["div",{id:'a'}] 小写div
// }

// let component = <div id = 'a'></div>

/*************************  2.0  *****************************/

// function create() {
//     console.log(arguments);// [f Div(),{id:'a'}] 大写Div
// }

// class Div{   // class需要写在compont前面，不然出入create的是undefined
// }

// let component = <Div id = 'a'/>

// console.log(component)

/**************************m 3.0  *****************************/
// function create(Cls, attributes) {  // 根据上面的分析，得到传入的参数
//    let o = new Cls;

//    for(let name in attributes) {
//     //    o[name] = attributes[name];  // property 和 attribute 统一
//     o.setAttribute(name,attributes[name]); // property  和 attribute 分开
//    }
//    return o;
// }

// class Div{ 
//     constructor(){

//     }
//     set class(value) {
//         console.log('class value',value)
//     }
//     setAttribute(name,value) {
//         console.log(name,value);
//     }
// }

// let component = <Div id = 'a' class='test'/>

// console.log(component)

/*************************** 4.0 *************************** */

// class Child {

// }
// class Parent {

// }
// function create(Cls, attributes) { // 当有嵌套时，Child 先调用create，返回值，作为Parent调用时的第三个参数传入
//     console.log(arguments)
//     let o = new Cls();
//     return o;
// }

// let component = <Parent id='a' class='test' >
//     <Child class='b'> </Child>
//     <Child class='b'> </Child>
//     </Parent>

// console.log(component)

// // 0: ƒ Parent()
// // 1: {id: "a", class: "test"}
// // 2: Child {}
// // 3: Child {}

/*************************** 5.0 ****************************** */
// class Child {
//     set class(v) { // property
//         console.log('Parent::class',v)
//     }
//     setAttribute(name,value) { // attribute
//         console.log(name,value);
//     }
//     appendChild(child) {  // child
//         console.log('Parent::appendChild',child)
//     }
// }
// class Parent {
//     set class(v) { // property
//         console.log('Parent::class',v)
//     }
//     setAttribute(name,value) { // attribute
//         console.log(name,value);
//     }
//     appendChild(child) {  // child
//         console.log('Parent::appendChild',child)
//     }
// }
// function create(Cls, attributes, children) { // 当有嵌套时，Child 先调用create，返回值，作为Parent调用时的第三个参数传入
//     let o = new Cls();
//     for(let name in attributes) {
//         o.setAttribute(name, attributes[name])
//     }
//     for(let child in children) {
//         o.appendChild(child)
//     }
//     return o;
// }

// let component = <Parent id='a' class='test' >
//     <Child class='b'> </Child>
//     <Child class='b'> </Child>
//     </Parent>

// console.log(component)

// /*************************** 6.0 ***********************************/
// class Div {
//     constructor(){
//         this.children = [];
//         this.root = document.createElement('div');
//     }
//     set class(v) { // property
//         console.log('Parent::class',v)
//     }
//     setAttribute(name,value) { // attribute
//         console.log(name,value);
//     }
//     appendChild(child) {  // child
//        this.children.push(child);
//     }
//     mountedTo (parent) {
//         parent.appendChild(this.root);
//         for(let child of this.children) {   // 处理嵌套元素的挂载
//             child.mountedTo(this.root);
//         }
//     }
// }

// function create(Cls, attributes, ...children) { 
//     let o = new Cls();
//     for(let name in attributes) {
//         o.setAttribute(name, attributes[name])
//     }
//     for(let child of children) {
//         o.appendChild(child)
//     }
//     return o;
// }

// let component = <Div id='a' class='test' >
//     <Div class='b'></Div>
//     <Div class='b'></Div>
//     </Div>

// component.mountedTo(document.body)  // 挂载元素

// console.log(component)

/********************** 7.0 ************************/

function create(Cls, attributes, ...children){
    
    let o;

    if(typeof Cls === "string") {   // 处理<div>这样的情况
        o = new Wrapper(Cls);
    } else {
        o = new Cls({
            timer: {}
        });
    }

    for(let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }

    for(let child of children) {
        if(typeof child === "string") {
            child = new Text(child);
        }

        o.appendChild(child);
    }

    return o;
}

class Text {    // 处理嵌套为字符串的情况 <div>这样的这样的</div>
    constructor(text){
        this.children = [];
        this.root = document.createTextNode(text);
    }
    mountTo(parent){
        parent.appendChild(this.root);
    }
}

class Wrapper{
    constructor(type){
        this.children = [];
        this.root = document.createElement(type);
    }

    setAttribute(name, value) { //attribute
        this.root.setAttribute(name, value);
    }

    appendChild(child){
        this.children.push(child);

    }

    mountTo(parent){
        parent.appendChild(this.root);

        for(let child of this.children){
            child.mountTo(this.root);
        }
    }

}

class MyComponent {
    constructor(config){
        this.children = [];
    }

    setAttribute(name, value) { //attribute
        this.root.setAttribute(name, value);
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

    mountTo(parent){
        this.slot = <div></div>
        for(let child of this.children){
            this.slot.appendChild(child)
        }
        this.render().mountTo(parent)
    }
}

let component = <MyComponent>
    <div>text text text</div>
</MyComponent>
// create(MyComponent, null, create("div", null, "text text text"));
component.mountTo(document.body);

console.log(component);