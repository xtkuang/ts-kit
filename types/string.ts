export namespace string{
    export type CanStringfy=string|number|boolean|null|undefined|bigint;
    export type Stringfy<T extends CanStringfy> = `${T}`;
 }