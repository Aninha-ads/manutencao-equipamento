const net = require('node:net');
const http = require('node:http');
const inbox = [];
net.createServer((socket) => {
  const reply = (text) => socket.write(text + '\r\n');
  let buffer = '';
  let message = null;
  let recipient = '';
  reply('220 localhost SMTP de teste');
  socket.on('error', () => socket.destroy());
  socket.on('data', (chunk) => {
    buffer += chunk.toString('utf8');
    let end;
    while ((end = buffer.indexOf('\r\n')) >= 0) {
      const line = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      if (message !== null) {
        if (line === '.') {
          const raw = message.join('\r\n');
          const separator = raw.indexOf('\r\n\r\n');
          const headers = raw.slice(0, separator);
          let body = raw.slice(separator + 4);
          if (/Content-Transfer-Encoding: base64/i.test(headers)) {
            body = Buffer.from(body, 'base64').toString('utf8');
          } else if (/Content-Transfer-Encoding: quoted-printable/i.test(headers)) {
            const bytes = body.replace(/=\r\n/g, '').replace(/=([\da-f]{2})/gi,
              (_, hex) => String.fromCharCode(parseInt(hex, 16)));
            body = Buffer.from(bytes, 'latin1').toString('utf8');
          }
          inbox.unshift('Para: ' + recipient + '\n\n' + body);
          inbox.length = Math.min(inbox.length, 20);
          message = null;
          reply('250 Mensagem recebida');
        } else {
          message.push(line.startsWith('..') ? line.slice(1) : line);
        }
      } else if (/^EHLO\b/i.test(line)) {
        reply('250-localhost\r\n250 AUTH PLAIN');
      } else if (/^AUTH PLAIN$/i.test(line)) {
        reply('334 ');
      } else if (/^AUTH PLAIN /i.test(line) || /^[A-Za-z0-9+/]+=*$/.test(line) && !/^(NOOP|RSET)$/i.test(line)) {
        if (line === 'QUIT') {
          socket.end('221 Encerrando\r\n');
        } else if (line === 'DATA') {
          message = [];
          reply('354 Termine com um ponto em uma linha');
        } else {
          reply('235 Autenticacao de teste');
        }
      } else if (/^RCPT TO:/i.test(line)) {
        recipient = line.slice(8).trim();
        reply('250 OK');
      } else {
        reply('250 OK');
      }
    }
  });
}).listen(2525, '127.0.0.1', () => console.log('SMTP local na porta 2525'));

http.createServer((request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(inbox.length
    ? inbox.join('\n\n----------------------------------------\n\n')
    : 'Nenhuma mensagem recebida. Atualize a pagina apos o cadastro.');
}).listen(2526, '127.0.0.1', () => console.log('Caixa de entrada em http://127.0.0.1:2526'));

