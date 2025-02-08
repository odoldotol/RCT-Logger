const net = require('net');

const socketPath = '/tmp/my_socket.sock';

console.log('클라이언트가 서버에 연결을 시도합니다.');
const client = net.createConnection(socketPath, () => {
  console.log('클라이언트가 서버에 연결되었습니다.');

  // 예를 들어, Uint8Array를 만들어서 전송 (직렬화 없이 raw 바이너리 전송)
  const data = new Uint8Array([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, /* ... 최대 250 바이트 등 원하는 데이터 */]);
  client.write(data, (err) => {
    if (err) {
      console.error('데이터 전송 중 에러 발생:', err);
    } else {
      console.log('데이터 전송 완료');
    }
  });
});

console.log('클라이언트가 서버로부터 데이터를 받습니다.');

client.on('error', (err) => {
  console.error('에러 발생:', err);
});

client.on('data', (data) => {
  console.log('클라이언트가 받은 데이터:', data);
  // 데이터 수신 후 연결 종료 (필요에 따라 유지 가능)
  client.end();
});

client.on('end', () => {
  console.log('서버와의 연결이 종료되었습니다.');
});


client.destroySoon(); // 연결 종료 요청
client.destroy(); // 연결 종료
client.end(); // 연결 종료
client.cork(); // 쓰기 버퍼링 시작
client.uncork(); // 쓰기 버퍼링 종료
client.pause(); // 데이터 수신 중지
client.resume(); // 데이터 수신 재개