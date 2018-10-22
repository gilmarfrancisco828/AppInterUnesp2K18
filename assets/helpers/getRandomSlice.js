function getRandomSlice(arr, n) {
    if (n > len || n <= 0)
        throw new RangeError("getRandomSlice: tamanho inválido");
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}