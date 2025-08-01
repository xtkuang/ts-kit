export function minPathSum(grid:number[][]):number{
    // d(i,j)=grid[i][j]+min(d(i-1,j),d(i,j-1))
    const cache=new Map<string,number>()
    const dp = (i:number,j:number):number=>{
        if(i===0&&j===0) return grid[0]![0]!
        const key=`${i},${j}`
        const cached=cache.get(key)
        if(cached!==undefined) return cached
        if(i===0){
            const res=dp(0,j-1)+grid[0]![j]!
            cache.set(key,res)
            return  res
        }
        if(j===0) {
            const res=dp(i-1,0)+grid[i]![0]!
            cache.set(key,res)
            return  res
        }
        const res=Math.min(dp(i-1,j),dp(i,j-1))+grid[i]![j]!
        cache.set(key,res)
        return res
    }
    return dp(grid.length-1,grid[0]!.length-1)
}