export default function line(arr) {

    arr[2] += (arr[2] > arr[0] ? -1 : 1);
    arr[3] += (arr[3] > arr[1] ? -1 : 1);
    arr[4] += (arr[4] > arr[6] ? -1 : 1);
    arr[5] += (arr[5] > arr[7] ? -1 : 1);


}