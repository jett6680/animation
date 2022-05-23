
function maxArea(array) {

    const regexp = /1{2,}/g;
    let res = [];
    array = array.map(item => {
        const str = item.join("");
        let r = regexp.exec(str);
        const tmp = [];
        while (r) {
            tmp.push([r.index,r.index+r[0].length-1]);
            r = regexp.exec(str);
        }
        return tmp;
    })

    console.log(array)

    let maxRect = (arr,result,n = 1) => {
        const top = arr.pop();
        const next = arr.pop() || [];
        n++;
        let tt;
        let nn;
        let width = 1;
        let maxWidth = 1;
        let start;
        let end;

        // 对取出来的两行做遍历比对并且查找，找出所有的交叉点 并找到最大的交叉点
        // 最大交叉点的起始位置赋值给start 和 end 最大交叉点的宽度赋值给 max width
        for (let i = 0;i<top.length;i++){
            tt = top[i];
            for (let j = 0;j<next.length;j++){
                nn = next[j];
                width = Math.min(tt[1],nn[1]) - Math.max(tt[0],nn[0]);
                if(width > maxWidth-1){
                    maxWidth = width;
                    start = Math.max(tt[0],nn[0]);
                    end = Math.min(tt[1],nn[1]);
                }
            }
        }

        // 没有交叉点
        if(start === undefined && end === undefined){
            if(n < 3){
                return false;
            }else {
                width = top[0][1]-top[0][0]+1;
                if(width > 1){
                    result.push((n-1)*width);
                }
            }
        }else {
            // 找到交叉点
            arr.push([[start,end]]);
            maxRect(arr,result,n++);
        }

    };

    while (array.length > 1){
        maxRect([].concat(array),res,1);
        array.pop();
    }

    return res;
}

const mr = [
    [0,0,1,1,1],
    [0,0,0,1,1],
    [1,1,0,1,0],
    [1,1,1,1,1]
]

maxArea(mr);
