//
// const reverseWord = (str) => {
//     const reverseArr = str.split(" ");
//     const result = [];
//     for (let i = 0;i<reverseArr.length;i++){
//         result.push(reverseArr[i].split("").reverse().join(""));
//     }
//     return result.join(" ");
// };
//
// console.log(reverseWord("Hello world String"));

export default (str) => {
    const reverseArr = str.split(" ");
    return reverseArr.map(item => {
        return item.split("").reverse().join("");
    }).join(" ");
}