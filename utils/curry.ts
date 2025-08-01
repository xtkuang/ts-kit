import type { AnyFunc, array } from "~types/index";
type Equal<A, B> = 
  (<T>() => T extends A ? 1 : 2) extends 
  (<T>() => T extends B ? 1 : 2) ? true : false;
const _ =Symbol('x')
export type x = typeof _ & {}
type List<A = any> = ReadonlyArray<A>
type Cast<A extends any,B extends any>=A extends B?A:B
type Gaps<A extends array.ArrayLike>= { [P in keyof A]?: A[P] | x; }
type _SplitParams<P extends List, PSplit extends List[] = [], PRest extends List = Tail<P>> = {
    0: P extends [...infer A, ...PRest]
       ? _SplitParams<Tail<P>, [...PSplit, A], Tail<PRest>>
       : never
    1: PSplit
    2: P[number][][]
}[
    number extends Length<P>
    ? 2
    : P extends []
      ? 1
      : 0
]
// 返回一个元组：P中对应位置是一个具体参数，则删除L2对应位置参数
// P中对应位置是一个 _ 则保留L2对应位置参数
// 所有P未提供的参数，都保留
// 1. 
type Gapsof<P extends array.ArrayLike,F extends array.ArrayLike>= {
    [p in keyof P]: P[p] extends x ? F[p] : P[p];
} & {
    [P in keyof F]?: F[P];
};
interface Curried<Fn extends AnyFunc>{
    (...args:Parameters<Fn>):ReturnType<Fn>;
    (...args:Gaps<Parameters<Fn>>):Curried<(...args:)=>ReturnType<Fn>>;
}
type Concat<A extends any[],B extends any[]>= [...A,...B];
type vIndex=number;
type OriginIndex=number;
class CurryArgMap{
    private map = new Map<vIndex,OriginIndex>();
    private argMap = new Map<OriginIndex,any>();
    private length:number;
    constructor(length:number){
        this.length=length;
    }
    isReady(){
        return this.argMap.size===this.length;
    }
    values(){
        return Array.from(this.argMap.values());
    }
    set(vIndex:number,arg:any){
        const originIndex=this.map.get(vIndex);
        // 插入参数，如果是第一次插入 _ 则记录其索引
       if(arg===_ && !originIndex){
            this.map.set(vIndex,this.map.size);
       }
       if(arg!==_){
            this.argMap.set(originIndex??this.map.size,arg);
       }

    }
}
// 函数柯里化 
function curry<Fn extends AnyFunc>(fn:Fn){
    const argsMap=new CurryArgMap(fn.length);
    
  return function curried(...args:Gaps<Parameters<Fn>>){
   if(argsMap.isReady()){
    return fn(...argsMap.values());
   }else{
    for(let i=0;i<args.length;i++){
        argsMap.set(i,args[i]);
    }
    return curried;
   }
  }as Curried<Fn>;
}
let test=curry((a:number,b:number)=>a+b);
let b=test(1);
// [_,_,_,_,_]

let kk:[1,1] extends [1]?true:false;