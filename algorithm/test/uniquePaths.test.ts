import {uniquePaths,uniquePaths2} from '../../algorithm/uniquePaths';
test('uniquePaths',()=>{
    expect(uniquePaths(3,7)).toBe(28)
})
test('uniquePaths',()=>{
    expect(uniquePaths(3,2)).toBe(3)
})

test('uniquePaths',()=>{
    expect(uniquePaths2([
        [0,0,0],
        [0,1,0],
        [0,0,0]
      ])).toEqual(2)
})