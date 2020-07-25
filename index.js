const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

 

// var http = require('http');
// var fs = require('fs'); // 파일 읽기, 쓰기 등 을 할 수 있는 모듈 
// var path = require('path');

http.createServer(function (request, response) {
    if (request.method == 'GET' && request.url == '/') {
        response.writeHead(
            200,
            {
                "Content-Type": "text/html"
            }
        ); // 웹페이지 출력  
        fs.createReadStream("./index.html").pipe(response);
        // 같은 디렉토리에 있는 index.html를 response 함 
    }
    else {
        let file = path.join(require.main.path, request.url);

        fs.exists(file, (exist)=>{ 
            if(exist) 
             fs.createReadStream(file).pipe(response);
        });
        // file이 존재 하지않을때, send404Message(response); 
    } 
}).listen(9000);
