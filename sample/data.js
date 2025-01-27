const data0 = "100000000000000000000000000000111011011000010000010010011110111001000110011000011011100110011111011000000000000010011111111111101100000000000000001111111111111000100000000000011101111111111111";

// console.log(data0.length);

const data1 = "100000000000000000000000000000111011011000010000010010011110111001000110011000011011100110011111011000000000000010011111111111101100000000000000001111111111111000100000000000011101111111111111";

// console.log(data1 === data0);

const data2 = "100000000000000000000000000000111011011000010000010010011110111001000110011000011011100110011111011000000000000010011111111111101100000000000000001111111111111000100000000000011101111111111111";

// console.log(data2 === data0);

const sync = data0.slice(0, 32);
const d0 = data0.slice(32, 64).split('');
const d1 = data0.slice(64, 96).split('');
const d2 = data0.slice(96, 128).split('');
const d3 = data0.slice(128, 160).split('');
const d4 = data0.slice(160, 192).split('');

d0.splice(3, 0, " ");
d1.splice(3, 0, " ");
d2.splice(3, 0, " ");
d3.splice(3, 0, " ");
d4.splice(3, 0, " ");

d0.splice(8, 0, " ");
d1.splice(8, 0, " ");
d2.splice(8, 0, " ");
d3.splice(8, 0, " ");
d4.splice(8, 0, " ");

d0.splice(13, 0, " ");
d1.splice(13, 0, " ");
d2.splice(13, 0, " ");
d3.splice(13, 0, " ");
d4.splice(13, 0, " ");

d0.splice(18, 0, " ");
d1.splice(18, 0, " ");
d2.splice(18, 0, " ");
d3.splice(18, 0, " ");
d4.splice(18, 0, " ");

d0.splice(20, 0, " ");
d1.splice(20, 0, " ");
d2.splice(20, 0, " ");
d3.splice(20, 0, " ");
d4.splice(20, 0, " ");

d0.splice(36, 0, " ");
d1.splice(36, 0, " ");
d2.splice(36, 0, " ");
d3.splice(36, 0, " ");
d4.splice(36, 0, " ");

console.log("\ntransmitter");
console.log("sync  ", sync);
console.log(" w1   ", d0.join(''));
console.log(" w2   ", d1.join(''));
console.log(" w3   ", d2.join(''));
console.log(" w4   ", d3.join(''));
console.log(" w5   ", d4.join(''));


const data3 = "10000000000000000000000000000011101000000000000001011111111111100100011000000001101110011111111101100000000000001001111111111110110000000000000000111111111111100010000000000001110111111111111110000000000000010111111111111111"

const receivedSync = data3.slice(0, 32);
const rd0 = data3.slice(32, 64).split('');
const rd1 = data3.slice(64, 96).split('');
const rd2 = data3.slice(96, 128).split('');
const rd3 = data3.slice(128, 160).split('');
const rd4 = data3.slice(160, 192).split('');
const rd5 = data3.slice(192, 224).split('');

rd0.splice(3, 0, " ");
rd1.splice(3, 0, " ");
rd2.splice(3, 0, " ");
rd3.splice(3, 0, " ");
rd4.splice(3, 0, " ");
rd5.splice(3, 0, " ");

rd0.splice(8, 0, " ");
rd1.splice(8, 0, " ");
rd2.splice(8, 0, " ");
rd3.splice(8, 0, " ");
rd4.splice(8, 0, " ");
rd5.splice(8, 0, " ");

rd0.splice(13, 0, " ");
rd1.splice(13, 0, " ");
rd2.splice(13, 0, " ");
rd3.splice(13, 0, " ");
rd4.splice(13, 0, " ");
rd5.splice(13, 0, " ");

rd0.splice(18, 0, " ");
rd1.splice(18, 0, " ");
rd2.splice(18, 0, " ");
rd3.splice(18, 0, " ");
rd4.splice(18, 0, " ");
rd5.splice(18, 0, " ");

rd0.splice(20, 0, " ");
rd1.splice(20, 0, " ");
rd2.splice(20, 0, " ");
rd3.splice(20, 0, " ");
rd4.splice(20, 0, " ");
rd5.splice(20, 0, " ");

rd0.splice(36, 0, " ");
rd1.splice(36, 0, " ");
rd2.splice(36, 0, " ");
rd3.splice(36, 0, " ");
rd4.splice(36, 0, " ");
rd5.splice(36, 0, " ");

console.log("\nreceiver");
console.log("sync  ", receivedSync);
console.log(" w1   ", rd0.join(''));
console.log(" w2   ", rd1.join(''));
console.log(" w3   ", rd2.join(''));
console.log(" w4   ", rd3.join(''));
console.log(" w5   ", rd4.join(''));
console.log(" w6   ", rd5.join(''));

