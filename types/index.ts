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
}
export namespace array{
    export type ArrayLike=any[];
    export type IsEmpty<A extends ArrayLike>=A['length'] extends 0?true:false;
    export type GetArray<Len extends number = 0> = GetArrayHelper<Len>;
    type GetArrayHelper<Len extends number = 0 , Result extends ArrayLike = []> = Result['length'] extends Len 
    ? Result
    : GetArrayHelper<Len, [...Result, unknown]>;
    
}
export namespace common{
    export type CheckLeftIsExtendRight<L, R> = L extends R ? true : false; 
}
