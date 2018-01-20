function arrCmp(arr1, arr2) {
    return (arr1.length == arr2.length
    && arr1.every(function(u, i) {
        return u === arr2[i];
    }));
}

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

module.exports = {
    arrCmp: arrCmp,
    toHexString: toHexString
};