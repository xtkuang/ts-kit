import { twoSum } from "../twoSum";
test("twoSum",()=>{
    expect(twoSum([2,7,11,15],9)).toEqual([0,1])
})
test("twoSum",()=>{
    expect(twoSum([3,2,4],6)).toEqual([1,2])
})
test("twoSum",()=>{
    expect(twoSum([3,3],6)).toEqual([0,1])
})