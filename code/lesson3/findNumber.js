
function findNumber(arr) {
    arr = arr.filter(item => item > 0);
    if(arr.length > 0){
        arr.sort((a,b) => a-b);
        if(arr[0] === 1){
            const len = arr.length-1;
            for (let i = 0;i<len;i++){
                if(arr[i+1]-arr[i] > 1){
                    return arr[i]+1;
                }
            }

            return arr.pop()+1;

        }else {
            return 1;
        }
    }else {
        return 1;
    }
}


function findNumber2(arr){
    arr = arr.filter(item => item > 0);
    if(arr.length > 0){
        const len = arr.length;
        for (let i = 0;i<len;i++){
            let current = arr[i];
            for (let j = i+1;j<len;j++){
                if(current > arr[j]){
                    let c = current;
                    current = arr[j];
                    arr[j] = c;
                }
            }
            arr[i] = current;
            if(i === 0){
                if(arr[i] !== 1){
                    return 1;
                }
            }else {
                if(arr[i] - arr[i-1] > 1){
                    return arr[i-1] +1;
                }
            }
        }

        return arr.pop() +1;

    }else {
        return 1;
    }
}

console.log(findNumber2([1,2,4,5]));
