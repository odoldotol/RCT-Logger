// const now = new Date();
// const YMD_now = now.toISOString().slice(0, 10);
// const Midnight_now = new Date(YMD_now);
// const Midnight_now_ms = Midnight_now.getTime();
// const KOR_Midnight_now_ms = Midnight_now_ms - (3600000 * 9);
// const KOR_Midnight_now = new Date(KOR_Midnight_now_ms);
// const KOR_Midnight_now_locale = KOR_Midnight_now.toLocaleString("en-GB", { timeZone: "Asia/Seoul" });
// const KOR_Midnight_now_ms_next = KOR_Midnight_now_ms + 86400000;
// const KOR_Midnight_now_next = new Date(KOR_Midnight_now_ms_next);
// const KOR_Midnight_now_locale_next = KOR_Midnight_now_next.toLocaleString("en-GB", { timeZone: "Asia/Seoul" });

// console.log(now);
// console.log(YMD_now);
// console.log(Midnight_now);
// console.log(Midnight_now_ms);
// console.log(KOR_Midnight_now_ms);
// console.log(KOR_Midnight_now);
// console.log(KOR_Midnight_now_locale);
// console.log(KOR_Midnight_now_ms_next);
// console.log(KOR_Midnight_now_next);
// console.log(KOR_Midnight_now_locale_next);

// console.log(Number.MAX_SAFE_INTEGER);

// console.log(1738800000000 / 86400000);
// console.log(1738800000000 % 86400000);

// const nowMs = now.getTime()
// const midNightMs = nowMs - (nowMs % 86400000);
// console.log(midNightMs);
// console.log(new Date(midNightMs));

// if (nowMs > midNightMs + 3600000 * 15) {
//   console.log("next day");
//   console.log(new Date(midNightMs + 3600000 * 15));
// } else {
//   console.log("today");
//   console.log(new Date(midNightMs - 3600000 * 9));
// }

// console.log(new Date(1738800000000 - (3600000 * 9)).toISOString());
// console.log(new Date(1738800000000 - (3600000 * 9)).toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" }));
// console.log(new Date(1738800000000 - (3600000 * 9)).toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" }));

// console.log(new Date(1738800000000 + 86400000));



// console.log(new Date().toLocaleString("en-GB", { timeZone: "Asia/Seoul" }));
// console.log(new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" }).split("/").reverse().join("_"));
// console.log(new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Seoul" }));



// UTC

// 한국 기준 자정 ms 구해서 기록해두고 맵에 날짜파일명 만들고 푸시

// 다음부터는 ms 비교해서 날짜가 다른지 확인해서 다르면 새로운 파일명 만들고 푸시

const dayMs = 1000 * 60 * 60 * 24; // 86400000
const hourMs = 1000 * 60 * 60; // 3600000
const korOffsetMs = -9 * hourMs; // 32400000

const getUTCMidnightMs = (ms = new Date().getTime()) => {
  return ms - (ms % dayMs);
};

const getKORMidnightMs = (ms = new Date().getTime()) => {
  const mid1 = getUTCMidnightMs(ms) + korOffsetMs;
  const mid2 = mid1 + dayMs;
  if (mid2 > ms) {
    return mid1;
  } else {
    return mid2
  }
};

console.log(getKORMidnightMs(getUTCMidnightMs()));
console.log(new Date(getKORMidnightMs(getUTCMidnightMs()-1)).toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" }).split("/").reverse().join("_"));
console.log(new Date(getKORMidnightMs(getUTCMidnightMs())).toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" }).split("/").reverse().join("_"));
console.log(new Date(getKORMidnightMs(getUTCMidnightMs()-1)).getTime() == new Date(getKORMidnightMs(getUTCMidnightMs())).getTime());

console.log(new Date(
  new Date(getKORMidnightMs(getUTCMidnightMs()))
  .toLocaleDateString("en-GB", { timeZone: "Asia/Seoul" })
  .split("/")
  .reverse()
  .join("_")
  //
  .replace(/_/g, "-")
).getTime() + korOffsetMs);