const findSyncIdx = (arr: (0 | 1)[]) => {
  let equal: 0 | 1 = 1;
  let lowLength = 28;
  let highLength = 2;

  const init = () => {
    equal = 1;
    lowLength = 28;
    highLength = 2;
  };

  for (let i = 0; i < arr.length; i++) {

    if (arr[i] === equal) {

      if (equal === 0) {
        lowLength--;
      } else if (lowLength === 0) {
        if (highLength === 0) {
          return i-31;
        }
        highLength--;
      }

      if (lowLength !== 0) {
        equal = 0;
      } else {
        equal = 1;
      }

    } else {
      init();
    }
  }
};

/**
 * 좌우 대칭인지? 예시
 */
function isSymmetric(buffer: Buffer) {
  let pointerInc = 0;
  let pointerDec = buffer.length - 1;
  while (pointerInc < pointerDec) {
    if (buffer[pointerInc++] !== buffer[pointerDec--]) {
      return false;
    }
  }
  return true;
}