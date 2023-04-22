/**
 * 深拷贝
 * @param obj
 */
const deepCopy = function (obj){
    if (obj){
        return JSON.parse(JSON.stringify(obj))
    }

    return obj;

}

export default deepCopy;