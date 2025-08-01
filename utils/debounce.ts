import type { AnyFunc } from "~types/index";
type DebounceOptions = {
    /** 先调用，后等待 */
  leading?: boolean;
  /** 先等待，后调用 */
  trailing?: boolean;
};
interface DebucedFn<Fn extends AnyFunc>{
    cancel(): void;
    flush(): void;
    (this:ThisParameterType<Fn>,...args:Parameters<Fn>): void;
}
function debunce<Fn extends AnyFunc>(fn: Fn,wait: number=0, options: DebounceOptions = {
    leading: false,
    trailing: true,
}):DebucedFn<Fn>{
    let timerId:NodeJS.Timeout|null=null;
    const DebucedFn:DebucedFn<Fn>=function(this,...args){
        if(timerId) return
        timerId=setTimeout(()=>{
            fn.apply(this,args);
            timerId=null;
            console.timeEnd('test');
        },wait);        
    }
    DebucedFn.cancel=function(){
        
    }
    DebucedFn.flush=function(){

    }
    return DebucedFn;
}
function test(){
    console.log('test');
}
console.time('test');
const debunced=debunce(test,2000);
debunced();
