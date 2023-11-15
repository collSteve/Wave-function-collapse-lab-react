export function init2DArray<T>(nRows: number, nCols:number, value: T) {
    const array: T[][] = [];
    for (let row = 0; row < nRows; row++) {
        array[row] = [];
        for (let col = 0; col < nCols; col++) {
            array[row][col] = value;
        }
    }
    return array;
}

export function init2DArrayFunctional<T>(nRows: number, nCols:number, callback: (row: number, col: number)=>T) {
    const array: T[][] = [];
    for (let row = 0; row < nRows; row++) {
        array[row] = [];
        for (let col = 0; col < nCols; col++) {
            array[row][col] = callback(row, col);
        }
    }
    return array;
}