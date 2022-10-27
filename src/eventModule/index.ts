class EventEmitter<T> {

    #events: {[K in keyof T] : Array<<K extends keyof T, U extends T[K]>(U) => void>}

    constructor() {
       this.#events = {} as {[K in keyof T] : Array<<K extends keyof T, U extends T[K]>(U) => void>}
    }

    emit<K extends keyof T, U extends T[K]>(eventName: K, payload: U){
        if(!this.#events[eventName]){
            throw new Error("Event not found");
        }

        this.#events[eventName].forEach((callback) => {
            callback(payload);
        })
    }


    on<K extends keyof T, U extends T[K]>( eventName: K, callback: (U) => void ) {
        if( !this.#events[eventName] ){
            this.#events[eventName] = [] as {[K in keyof T]: Array<<K extends keyof T, U extends T[K]>(U: any) => void>}[K] ;
        }
        this.#events[eventName].push(callback);
    }


    removeListener<K extends keyof T, U extends T[K]>( eventName: K, callbackToRemove: (U) => void ) {
        if(!this.#events[eventName]){
            throw new Error("Event not found");
        }

        this.#events[eventName] = this.#events[eventName].filter((callback) => callback !== callbackToRemove)
    }

}

const test = new EventEmitter<{first: string, second: { prop: string}}>();

const testFunc = (data) => console.log(data)

test.on('first', testFunc )

test.on('second', (data: {prop: string}) => console.log(data.prop))

// test.removeListener('first', testFunc);

test.emit('first', 'Hello')

test.emit('second', {prop: 'World'})

//выдаст ошибку
// test.on('third', testFunc)
//
// test.emit('third', '!!!!')