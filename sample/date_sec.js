const now = new Date();

const ms = now.getTime();

console.log(now);
console.log(ms);

// sec 까지만 기록하고 ms 단위는 버리기
const sec = Math.floor(ms / 1000) * 1000;
console.log(sec);

console.log(new Date(sec));