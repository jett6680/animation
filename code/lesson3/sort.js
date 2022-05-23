
function sort(arr) {
    if(arr.length < 2){
        return 0;
    }

    let min = 0;
    debugger
    for (let i = arr.length-1;i>0;i--){
        for (let j = 0;j<i;j++){
            let temp = arr[j];
            if(temp > arr[j+1]){
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }

        if(i < arr.length -1){
            const temp = arr[i+1] - arr[i];
            if(temp > min){
                min = temp;
            }
        }

    }
    return Math.max(min,arr[1]-arr[0]);
}

function chooseSort(arr){
    for (let i = 0;i<arr.length;i++){
        let current = arr[i];
        for (let j = i+1;j<arr.length;j++){
            if(current > arr[j]){
                let c = current;
                current = arr[j];
                arr[j] = c;
            }
        }
        arr[i] = current;
    }
    return arr;
}

// console.log(sort([19,13,16,1]));

function oddEventSort(arr) {
    arr.sort((a,b) => a-b);
    let odd = 1;
    let event = 0;
    let result = [];
    arr.forEach(item => {
        if(item % 2 === 0){
            result[event] = item;
            event += 2;
        }else {
            result[odd] = item;
            odd += 2;
        }
    })
    return result;

}

console.log(oddEventSort([5,6,3,7,2,8,9,12]));