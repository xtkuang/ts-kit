import type { AnyFunc } from "~types/index";

interface cache<K=any,V=any>{
    get(k:K):V|null
    put(k:K,v:V):void
    has(k:K):boolean
}
interface memories<Fn extends AnyFunc>{
    (this:ThisParameterType<Fn>,...args:Parameters<Fn>):ReturnType<Fn>;
    cache:cache;
}

class LRUCache<K=any,V=any> implements cache<K,V>{
    private map:Map<K,{value:V,timeStamp:number}>=new Map();
    capacity:number
    maxAge:number
    constructor({capacity=10,maxAge=60*1000}){
        this.capacity=capacity;
        this.maxAge=maxAge;
    }
    get(k:K){
        const v=this.map.get(k)
        if(!v) return null;
        this.map.delete(k);
        if(Date.now()-v.timeStamp>this.maxAge) return null
        this.map.set(k,v);
        return v.value;
    }
    put(k:K,v:V){
       if(this.map.has(k)){
        this.map.delete(k);
       }
       this.map.set(k,{value:v,timeStamp:Date.now()});
       if(this.map.size>this.capacity){
        // map.keys 返回一个迭代器，其元素顺序为插入顺序，此处取第一个元素即为最老的元素
           const oldestKey=this.map.keys().next().value;
           this.map.delete(oldestKey!);
       }
    }
    has(k:K){   
        return this.map.has(k);
    }   
}
/**
 * 
 * @param fn 需要记忆化的函数
 * @param resolver 用于生成key的函数，如果不提供则使用第一个参数作为key
 * @returns 记忆化后的函数,可以通过 cache 属性访问缓存
 * @example
 * const fib={
 *  fibonacci(n:number):number{
 *      if(n<=1) return n;
 *      return this.fibonacci(n-1)+this.fibonacci(n-2);
 *  }
 * }
 * const memoziedFibonacci=memories(fib.fibonacci,(n:number)=>n);
 * memoziedFibonacci.cache=new LRUCache({capacity:3});
 * fib.fibonacci=memoziedFibonacci;
 * console.time('memoziedFibonacci');
 * console.log(fib.fibonacci(10000));
 * console.timeEnd('memoziedFibonacci');
 */
function memories<Fn extends AnyFunc>(fn:Fn,resolver:AnyFunc|null=null):memories<Fn>{
    if(!(fn instanceof Function)) throw new Error('fn must be a function');
    if(!(resolver instanceof Function)) throw new Error('resolver must be a function');
    const cache:cache=new LRUCache({capacity:3});
    const memozied:memories<Fn>=function(this,...args:Parameters<Fn>){
        const key=resolver?resolver.call(this,...args):args[0];
        if(cache.has(key)){
            return cache.get(key);
        }else{
            const res=fn.call(this,...args);
            cache.put(key,res);
            return res;
        }
     
    }
    memozied.cache=cache;   
    return memozied;
}
export default memories;

// test
const fib={
    fibonacci(n:number):number{
        if(n<=1) return n;
        return this.fibonacci(n-1)+this.fibonacci(n-2);
    }
}
const memoziedFibonacci=memories(fib.fibonacci,(n:number)=>n);
memoziedFibonacci.cache=new LRUCache({capacity:3});
fib.fibonacci=memoziedFibonacci;
console.time('memoziedFibonacci');
console.log(fib.fibonacci(10000));
console.timeEnd('memoziedFibonacci');