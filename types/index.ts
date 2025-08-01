export type AnyFunc = (...args: any) => any;
export namespace boolean{
    export type And<C1 extends boolean,C2 extends boolean>=C1 extends true?C2 extends true?true:false:false;
    export type Or<C1 extends boolean,C2 extends boolean>=C1 extends true?true:C2 extends true?true:false;
    export type Not<C extends boolean>=C extends true?false:true;
}
export namespace number{
    export type NumberLike=number|`${number}`;
    export type Number<N extends NumberLike>=N extends number?N : N extends `${infer num extends number}`? num:never;
    export type IsZero<N extends NumberLike>=N extends 0|'0'|'+0'|'-0'?true:false;
    export type IsOverZero<N extends NumberLike>= IsZero<N> extends true ? false 
    :string.Stringfy<N> extends `-${infer _}`?false:true;
    export type IsLessZero<N extends NumberLike>= IsZero<N> extends true ? false 
    : boolean.Not<IsOverZero<N>>;
  
}

export namespace string{
   
   export type CanStringfy=string|number|boolean|null|undefined|bigint;
   export type Stringfy<T extends CanStringfy> = `${T}`;
   export type Capitalize<S extends string> = S extends `${infer F}${infer Rest}` ? `${Uppercase<F>}${Rest}` : S;
   /**
    * Replace<S, From, To> 将字符串 S 中的 From 替换为 To
    */
   export type Replace<S extends string,From extends string,To extends string>=S extends `${infer L}${From}${infer R}` ? `${L}${To}${R}` : S;
   export type ReplaceAll<S extends string,From extends string,To extends string>=
   S extends `${infer L}${From}${infer R}`
   ?`${L}${To}${ReplaceAll<R,From,To>}` // L 不需要递归，L是前缀，不可能包含 From
   :S
}
export namespace array{
    export type ArrayLike=any[];
    export type IsEmpty<A extends ArrayLike>=A['length'] extends 0?true:false;
    export type GetArray<Len extends number = 0> = GetArrayHelper<Len>;
    type GetArrayHelper<Len extends number = 0 , Result extends ArrayLike = []> = Result['length'] extends Len 
    ? Result
    : GetArrayHelper<Len, [...Result, unknown]>;
   
   
    export type Concat<A1 extends ArrayLike,A2 extends ArrayLike>=[...A1,...A2]

    /**
     * TupleToObject<T> 是用来把一个元组转换成一个 key/value 相同的对象
     */
    export type TupleToObject<T extends common.Readonly<ArrayLike> >= {
        [key in T[number]]: key
    }
    export type TurpleToUnion<T extends ArrayLike>=T[number];
    export type Includes<A extends ArrayLike,U>=A extends [infer F,... infer Rest]
    ?common.Equal<F,U> extends true?
    true:Includes<Rest,U>:false;

    export type Push<A extends ArrayLike,E>=Concat<A,[E]>
    export type Unshift<A extends ArrayLike,E>=Concat<[E],A>
    export type Tail<A extends ArrayLike>=[any,...A][A['length']]
    export type Head<A extends ArrayLike>=A extends [...infer _, infer L]?L:never;
    export type Pop<A extends ArrayLike>=A extends []?[]:A extends [...infer L ,infer _]?L:never;
    export type Shift<A extends ArrayLike>=A extends []?[]:A extends [infer _,... infer L]?L:never;
}
export namespace common{
    export type CheckLeftIsExtendRight<L, R> = L extends R ? true : false; 
    /**
     * Pick<T, K> ,Pick 表示从一个类型 T中选取指定的几个字段（K）组合成一个新的类型
    */
    type Pick<T,K extends keyof T>={[key in K]:T[key]}
   

    /**
     * Length<T> 用来获取元组的长度
     */
    export type Length<T extends any> = T extends { length: number } ? T['length'] : never
    /**
     * 从联合类型 T 中排除 U 的类型成员（即取 T 对于 U 的差集）
     */
    export type Exclude<T,U>=T extends U ? never : T
    export type Awaited<T> = T extends Promise<infer U>?Awaited<U>:T
    /**
     * If<C, T, F> 接收一个条件类型 C ，一个判断为真时的返回类型 T，以及一个判断为假时的返回类型 F。 C 只能是 true 或者 false， T 和 F 可以是任意类型
     */
    export type If<C extends boolean,T,F>=C extends true?T:F
    export type Equal<A,B>=(<T>()=>T extends A ?1:2)extends(<T>()=>T extends B ?1:2)?true:false;
    /**
     * 移除 T 类型中的指定字段 K
     */
    export type Omit<T,K extends keyof any>=Pick<T,Exclude<keyof T,K>>
    /**
     * 强制展开类型T
     */
    export type Expand<T> = T extends infer O 
    ? { [K in keyof O]: O[K] } 
    : never;
     /**
     * Readonly<T,K> 将T中的K字段设置为readonly，K默认为全部字段
     */
     export type Readonly<T,K extends keyof T=keyof T>=Expand <Omit<T,K> & { readonly [key in K]:T[key]}>

     export type DeepReadonly<T>={
       readonly [P in keyof T]:T[P] extends { [key: string]: any } ? DeepReadonly<T[P]>:T[P]
     } 

     /**
      * Chainable 让一个对象可以进行链式调用（提供两个函数 option(key, value) 和 get()：
      * 在 option 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 get 获取最终结果）
      */
     export type Chainable<O>={
        options<K extends string,V>(option:K,value:V):Chainable<Omit<O,K>&{[key in K]:V}> // K 可能是字符串联合类型，故使用 key in K
        get():O
     }
     export type LookUp<U extends {type:string},K extends string>=U extends {type:K}?U:never
}
export namespace func{
    export type Parameters<F extends AnyFunc>=F extends (...args:infer P)=>any?P:never
    export type ReturnType<F extends AnyFunc>=F extends (...args:any)=>infer R?R:never
}
export declare function PromiseAll<P extends any[] >(promisList: readonly [...P]):Promise<{[key in keyof P]:common.Awaited<P[key]>}>


