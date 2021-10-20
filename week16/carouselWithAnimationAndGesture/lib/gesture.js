export function enableGesture(element) {
    let contexts = Object.create(null);
    let MOUSE_SYSBOL = Symbol('mouse');
    
    element.addEventListener('mousedown', event=>{
        contexts[MOUSE_SYSBOL] = Object.create(null)
        start(event, contexts[MOUSE_SYSBOL])
        let mousemove = event => {
            move(event, contexts[MOUSE_SYSBOL])
        }
        let mouseup = event => {
            end(event, contexts[MOUSE_SYSBOL]) 
            element.removeEventListener('mousemove',mousemove)
            element.removeEventListener('mouseup',mouseup)
        }
    
        element.addEventListener('mousemove',mousemove)
        element.addEventListener('mouseup',mouseup)
    })
    
    // 移动端
    element.addEventListener('touchstart', event=>{
        for(let touch of event.changedTouches) {
            contexts[touch.identifier] = Object.create(null)
            start(touch, contexts[touch.identifier])
        }
    })
    
    element.addEventListener('touchmove', event=>{
        for(let touch of event.changedTouches) {
            move(touch, contexts[touch.identifier])
        }
    })
    
    element.addEventListener('touchend', event=>{
        for(let touch of event.changedTouches) {
            end(touch, contexts[touch.identifier])
            delete contexts[touch.identifier]
        }
    })
    
    element.addEventListener('touchcancel', event=>{
        for(let touch of event.changedTouches) {
            cancel(touch, contexts[touch.identifier])
            delete contexts[touch.identifier]
        }
    })
    
    let start = (point, context) => {
        element.dispatchEvent(Object.assign(new CustomEvent('start'),{
            startX: point.clientX,
            startY: point.clientY,
            clientX: point.clientX,
            clientY: point.clientY
        }))
        context.startX = point.clientX;
        context.startY = point.clientY;
        context.moves = [];
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.timeoutHandler = setTimeout(()=>{
            if (context.isPan)
                return;
            
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            console.log('pressstart')
            element.dispatchEvent(new CustomEvent('pressstart'))
        }, 500)
    }
    
    let move = (point, context) => {
        let dx = point.clientX - context.startX,dy = point.clientY - point.clientY;
    
        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            if (context.isPress) {
                console.log('presscancel')
                element.dispatchEvent(new CustomEvent('presscancel'))
            }
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            console.log('panstart')
            element.dispatchEvent(Object.assign(new CustomEvent('panstart'),{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            }))
        }
    
        if (context.isPan) {
            context.moves.push({
                dx,
                dy,
                t: Date.now()
            })
    
            context.moves = context.moves.filter(record => Date.now() - record.t < 300)
            console.log('pan')
            element.dispatchEvent(Object.assign(new CustomEvent('pan'),{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            }))
        }
    }
    
    let end = (point, context) => {
        if (context.isPan) {
            let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
            let record = context.moves[0];
            const speed = Math.sqrt((record.dx - dx) ** 2) + (record.dy - dy) ** 2 / (Date.now() - record.t)
            let isFlick = speed > 2.5
            if (isFlick) {
                console.log('flick')
                element.dispatchEvent(Object.assign(new CustomEvent('flick'),{
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed
                }))
            }
            console.log('panend')
            element.dispatchEvent(Object.assign(new CustomEvent('panend'),{
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                speed,
                isFlick: isFlick
            }))
        }
        if (context.isTap) {
            console.log('tap')
            element.dispatchEvent(new CustomEvent("tap"))
        }
        if (context.isPress) {
            console.log('pressend')
            element.dispatchEvent(new CustomEvent("pressend"))
        }
        clearTimeout(context.timeoutHandler)
    }
    
    let cancel = (point, context) => {
        console.log('canceled')
        element.dispatchEvent(new CustomEvent("cancel"))
        clearTimeout(context.timeoutHandler)
    }
}