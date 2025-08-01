/**
 * 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。
 */

export function twoSum(nums:number[],target:number):number[]{
    
    const hash=[]  // 稀疏数组，index代表了期望获取的值，value代表了实际的索引
    for(let i=0;i<nums.length;i++){
     const need = target -nums[i]!
        // 如果hash[need]存在，则返回
        if(hash[need]!==undefined){
           
            
            return [hash[need],i]
        }
         hash[nums[i]!]=i
        
    }
    console.log(hash);
    
    throw new Error('no solution')
}
