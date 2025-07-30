export class DLinkNode<K,V>{
    key:K;
    value:V;
    prev:DLinkNode<K,V>|null;
    next:DLinkNode<K,V>|null;
    constructor(key:K,value:V,prev:DLinkNode<K,V>|null=null,next:DLinkNode<K,V>|null=null){
        this.key=key;
        this.value=value;
        this.prev=prev;
        this.next=next;
    }
}