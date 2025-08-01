//dp(i,j)=dp(i-1,j)+dp(i,j-1)
export function uniquePaths(m:number,n:number):number{
    // (0,0) => (m-1,n-1) ?
    // (m-1,n-2) => (m-1,n-1) 1
    //uniquePaths(m,n)=uniquePaths(m-1,n)+uniquePaths(m,n-1)
    //uniquePaths(1,1)=1
    const cache=new Map<string,number>()
    const dp=(i:number,j:number):number=>{
        if(i===0||j===0)  return 1
        const key=`${i},${j}`
        const cached=cache.get(key)
        if(cached!==undefined) return cached
        const res=dp(i-1,j)+dp(i,j-1)
        cache.set(key,res)
        return res
    }
    return dp(m-1,n-1)
}
/**
 * 
 * @param grid m*n grid 0:empty 1:obstacle
 * @returns number of unique paths
 */
export function uniquePaths2(grid:number[][]):number{
     const m=grid.length
     const n=grid[0]!.length
     const cache=new Map<string,number>()
     const dp=(i:number,j:number):number=>{
       if(grid[i]![j] === 1) return 0
       if(i===0||j===0)  return 1
       const key=`${i},${j}`
       const cached=cache.get(key)
       if(cached!==undefined) return cached
       const res=dp(i-1,j)+dp(i,j-1)
       cache.set(key,res)
       return res
     }
     return dp(m-1,n-1) 
}