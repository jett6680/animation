export default (arr) => {
    arr.sort((a,b) => a-b);

    let min = Number.MAX_SAFE_INTEGER;
    let result = [];
    let i = 0,temp = [];
    while (i<arr.length){
        temp.push(arr[i]);
        let j = i+1;
        while (j<=arr.length){
            if(arr[j] === arr[i]){
                temp.push(arr[j]);
            }else {
                if(min > temp.length){
                    min = temp.length;
                }
                result.push([].concat(temp));
                temp.length = 0;
                i = j-1;
                break;
            }
            j++;
        }
        i++;
    }
    return result.every(val => val.length % min === 0);
}

