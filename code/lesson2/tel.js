function tel(str) {
    const e = ['',1,'abc','def','ghi','jkl','mno','pqrs','yuv','wxyz'];
    return str.split('').map(num => e[num]).reduce((total,current) => {
        const cns = current.split("");
        return matchFunc(total,cns);
    },[]);
}

function matchFunc(arr1,arr2) {
    if(arr1.length === 0){
        return arr2;
    }
    const result = [];
    arr1.forEach(i => {
        arr2.forEach(j => {
            result.push(i+j);
        })
    })
    return result;
}

export default tel;
