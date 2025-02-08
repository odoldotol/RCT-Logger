const net = require('net');
const fs = require('fs');

const socketPath = '/tmp/my_socket.sock';

// 기존 소켓 파일이 있으면 삭제 (재시작 시 충돌 방지)
if (fs.existsSync(socketPath)) {
  console.log('기존 소켓 파일을 삭제합니다:', socketPath);
  fs.unlinkSync(socketPath);
}

const server = net.createServer((socket) => {
  console.log('클라이언트가 연결되었습니다.');

  // 클라이언트로부터 데이터 수신 (Buffer 형태)
  socket.on('data', (data) => {
    console.log('서버가 받은 데이터:', data);
    // 필요한 경우 데이터를 처리하거나 에코(echo)할 수 있습니다.
    // 예: socket.write(data);
  });

  socket.on('end', () => {
    console.log('클라이언트 연결 종료');
  });

});

server.listen(socketPath, () => {
  console.log('서버가 소켓을 열었습니다:', socketPath);
});

setTimeout(() => {
  server.close(() => { // 기존 연결 전부 끝나야 실행됨, .sock 파일 삭제
    console.log('서버가 소켓을 닫았습니다.');
  });
}, 10000); // 10초 후 서버 종료
