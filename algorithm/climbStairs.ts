/**
 * @param n number of stairs
 * @returns number of ways to climb the stairs
 */
export function climbStairs(n:number):number{
    //dp(n)=dp(n-1)+dp(n-2)
    const dp=[] as number[]
    dp[0]=0
    dp[1]=1
    dp[2]=2
    for(let i=3;i<=n;i++){
        dp[i]=dp[i-1]!+dp[i-2]!
    }
    return dp[n]!
}