// PromiseA+ https://promisesaplus.com/
// 2.1 A promise must be in one of three states: pending, fulfilled, or rejected.
enum PromiseStates{
    PENDING,
    FULFILLED,
    REJECTED
}
// 1.1 “promise” is an object or function with a then method whose behavior conforms to this specification.
// 1.2 “thenable” is an object or function that defines a then method.
interface Thenable<T>{
    then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | null,
        onRejected?: ((reason: any) => TResult2 | Thenable<TResult2>) | null
    ): Thenable<TResult1 | TResult2>;
}
interface ThenCallback<T> {
    onFulfilled?: ((value: T) => any)|null;
    onRejected?: ((reason: any) => any)|null;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
}
class MPromise<T=unknown> implements Thenable<T>{
    private state:PromiseStates=PromiseStates.PENDING //当前状态，一经确认永不修改
    private value:T|undefined=undefined // 返回value，一经确认永不修改
    private reason:any=undefined    //拒绝原因，一经确认永不修改
    private thenlist:ThenCallback<T>[]=[] // then回调列表
    constructor(executor:(resolve:(value?:any)=>void,reject:(reason?:any)=>void)=>void){
        try{
          executor(this._resolve,this._reject)
        }catch(err){
            this._reject(err)
        }
    }
    /**
     * 
     * @param reason 拒绝原因
     * 拒绝当前Promise，修改状态后立刻调用then链
     */
    private _reject=(reason:any):void=>{
        if(this.state!==PromiseStates.PENDING) return
        this.state= PromiseStates.REJECTED
        this.reason=reason
        //callback
        this._handleCallback()

    }
    /**
     * 
     * @param value 
     * 
     */
   private _resolve=(value:T|Thenable<T>):void=>{
        //2.3.1 同一对象拒绝，避免内存泄漏
        if(value===this) {
            this._reject(new TypeError('Chaining cycle detected for promise'));
            return;
        }
        // 非Pending态不可resolve
        if(this.state!==PromiseStates.PENDING) return
       
        // 2.3.2 如果是Promise则采用其状态
        if(value instanceof MPromise){
            if(value.state===PromiseStates.PENDING){
                value.then(
                    (resolvedValue: any) => this._resolve(resolvedValue),
                    (rejectedReason: any) => this._reject(rejectedReason)
                );
            }else if(value.state===PromiseStates.FULFILLED){
                this._resolveFulfilled(value.value as T)
            }else{
                this._reject(value.reason)
            }
            return; 
        }else 
        // 2.3.2 Otherwise, if x is an object or function,
        if(value!==null&&value instanceof Object&& 'then' in value){
            let then:any    // 2.3.2.1 Let then be x.then
            // 2.3.2.2 If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
            try { 
                then = (value as any).then;
            } catch(err) {
                this._reject(err);
                return;
            }
            // 2.3.3.3 If then is a function
            if(typeof then === 'function'){
                let called=false // 2.3.3.3.3  the first call takes precedence, and any further calls are ignored.
                try{
                    // call it with x as this, first argument resolvePromise, and second argument rejectPromise
                    then.call(value,
                        (y:any)=>{  //2.3.3.3.1 If/when resolvePromise is called with a value y, run [[Resolve]](promise, y). 
                            if(called) return
                            called=true
                            this._resolve(y)
                        },
                        (r:any)=>{  //2.3.3.3.2 If/when rejectPromise is called with a reason r, reject promise with r.
                            if(called) return
                            called=true
                            this._reject(r)
                        }
                    )
                }catch(err){     // 2.3.3.3.4 If calling then throws an exception e
                    this._reject(err)
                }
            }else{// 2.3.3.4 If then is not a function, fulfill promise with x.

                this._resolveFulfilled(value as T)
            }
            return; 
        }else{ // 2.3.4 If x is not an object or function, fulfill promise with x.
            this._resolveFulfilled(value)
        }
    }
    /**
     *  修改状态，立即调用thenList
     */
    private _resolveFulfilled = (value: T): void => {
        this.state = PromiseStates.FULFILLED;
        this.value = value;
        this._handleCallback();
    }
    private _handleCallback(){
        if(this.state===PromiseStates.PENDING) return
        while(this.thenlist.length > 0) {
            const callback = this.thenlist.shift()!; 
            queueMicrotask(()=>{// 放入微任务
                try {
                    if(this.state === PromiseStates.FULFILLED) {
                        //2.2.1.1  If onFulfilled is not a function, it must be ignored.
                        if(callback.onFulfilled && typeof callback.onFulfilled === 'function') {
                            const result = callback.onFulfilled(this.value!);
                            callback.resolve(result);
                        } else {
                            callback.resolve(this.value);
                        }
                    } else if(this.state === PromiseStates.REJECTED) {
                        // 2.2.1.2 If onRejected is not a function, it must be ignored.
                        if(callback.onRejected && typeof callback.onRejected === 'function') {
                            const result = callback.onRejected(this.reason);
                            callback.resolve(result); // catch后变成resolved
                        } else {
                            callback.reject(this.reason);
                        }
                    }
                } catch(err) {
                    callback.reject(err);
                }
            })
        }
    }
    // 2.2.1 Both onFulfilled and onRejected are optional arguments:
    then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T) => TResult1 | Thenable<TResult1>)|null, 
        onRejected?: ((reason: any) => TResult2 | Thenable<TResult2>) 
    ):MPromise<TResult1|TResult2>{
        return new MPromise<TResult1|TResult2>((resolve,reject)=>{
            const callback:ThenCallback<T>={
                onFulfilled,
                onRejected,
                resolve,
                reject
            }
            if(this.state === PromiseStates.PENDING){
                this.thenlist.push(callback)
            }else{
                this.thenlist.push(callback)
                this._handleCallback()
            }
        })
    }
    catch<U>(onRejected:(reason: any) => U | Thenable<U>){
        return this.then(null,onRejected)
    }
    finally(onFinally?:(()=>void)|null){
        if(typeof onFinally !=='function') return
       return this.then(()=>{onFinally()},()=>{onFinally()})

    }
    static resolve<T>(promiseLike:T|Thenable<T>):MPromise<T>{
        return new MPromise(resolve=>resolve(promiseLike))
    }
    static reject<T=never>(reason:any):MPromise<T>{
        return new MPromise((_,reject)=>{
            reject(reason)
        })
    }
    static all<T=unknown>(iter:Iterable<T>):MPromise<Awaited<T>[]>{
        return new MPromise((resolve,reject)=>{
            const arr=Array.from(iter)
            if(arr.length===0) return resolve([])
            let compeleted=0
            let resList:T[]=[]
            for(let i=0;i<arr.length;i++){
                if(compeleted===arr.length){
                    resolve(resList)
                }
                MPromise.resolve(arr[i]).then((res)=>{
                    resList[i]=res
                    if(++compeleted===arr.length){
                        resolve(resList)
                    }
                },(reason)=>reject(reason))
            }
        })
    }
    static race<T=unknown>(iter:Iterable<T>):MPromise<Awaited<T>>{
        return new MPromise((resolve,reject)=>{
            const arr=Array.from(iter)
            if(arr.length===0) return resolve([])
            for(let i=0;i<arr.length;i++){
                MPromise.resolve(arr[i]).then(resolve,reject)
            }
        })
    }
    static allSettled<T=unknown>(iter:Iterable<T>):MPromise<AllSettled<Awaited<T>>[]>{
        return new MPromise((resolve,reject)=>{
            const arr=Array.from(iter)
            if(arr.length===0) return resolve([])
            let compeleted=0
            let resList:AllSettled<T>[]=[]
            for(let i=0;i<arr.length;i++){
               MPromise.resolve(arr[i])
               .then(
                (value)=>{
                    resList[i]=({
                        status:PromiseStates.FULFILLED,
                        value
                    })
                    if(++compeleted===arr.length){
                        resolve(resList)
                    }

               },
                (reason)=>{
                    resList[i]=({
                        status:PromiseStates.REJECTED,
                        reason
                    })
                    if(++compeleted===arr.length){
                        resolve(resList)
                    }
                })
            }
        })
    }
}
type AllSettled<T>={
    status:PromiseStates.FULFILLED
    value:T
}|{
    status:PromiseStates.REJECTED
    reason:any
}
MPromise.resolve(1).then(res=>res+1).then(res=>res*2).then(res=>console.log(res))
export { MPromise };

 