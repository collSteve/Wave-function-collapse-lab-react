export enum SetOpConstants {
    AnySet
}

export function unionArrays<T>(array1: T[], array2: T[]): T[] {
    return [...new Set([...array1, ...array2])];
}

export function intersectArrays<T>(array1: T[], array2: T[]): T[] {
    return array1.filter(value => array2.includes(value));
}