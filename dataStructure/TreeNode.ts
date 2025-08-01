class TreeNode {
    val: any;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val?: any, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val===undefined ? 0 : val);
        this.left = (left===undefined ? null : left);
        this.right = (right===undefined ? null : right);
    }
   
    
}
class Tree{

    static createTree(list:any[]):TreeNode{
        const root=new TreeNode(list[0])
        
        return root
    }
    // D: 根节点 L: 左子树 R: 右子树
    static DLR_Tranverse(node:TreeNode|null,callback:(node:TreeNode)=>void){
        if(!node) return null
        callback(node)
        Tree.DLR_Tranverse(node.left,callback)
        Tree.DLR_Tranverse(node.right,callback)
    }
}