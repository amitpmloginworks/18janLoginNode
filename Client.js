
//LoginNode:Hello~RunCMD~Continue
//LoginNode:Hello~RunCMD~Continue
//LoginNode:Hello~RunCMD~Continue
//LoginNode:Hello~RunCMD~Continue
//LoginNode:Hello~SaveBatchFile~Continue
//LoginNode:Hello~PortEnable~
//LoginNode:Hello~PortDisable~
//LoginNode:Hello~Auth~
//LoginNode:Hello~ClientVersion~2.0.0.0
//LoginNode:Hello~IIS~
//LoginNode:Hello~IISStart~<WebsiteName>
//LoginNode:Hello~IISStop~
//LoginNode:Hello~IISRestart~
//LoginNode:Hello~StartIISsite~
//LoginNode:Hello~StopIISsite~
//LoginNode:Hello~StartIISAppPoolsite~
//LoginNode:Hello~StopIISAppPoolsite~
//LoginNode:Hello~RecycleIISAppPoolsite~
//LoginNode:Hello~ServerInfo~
//LoginNode:Hello~Message~
//LoginNode:Hello~RunCMD~Stop
//LoginNode:Hello~RunCMD~exit
//LoginNode:Hello~RunCMD~ExitC
//LoginNode:Hello~RunCMD~Continue
//LoginNode:Hello~Restart~
//LoginNode:Hello~GetProcesses~
//LoginNode:Hello~Firewall~
//LoginNode:Hello~FirewallEnable~
//LoginNode:Hello~FirewallDisable~
//LoginNode:Hello~PortEnable~
//LoginNode:Hello~PortDisable~
//LoginNode:Hello~Services~
//LoginNode:Hello~ServicesStart~
//LoginNode:Hello~ServicesStop~
//LoginNode:Hello~BatchFile~
//LoginNode:Hello~ReadBatchFile~
//LoginNode:Hello~SaveBatchFile~
//LoginNode:Hello~DeleteBatchFile~


//var CryptoJS = require('crypto-js');

var crypto = require('crypto');
var net = require('net');
// var http = require('http');
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
function encrypt(text, key) {
  
  var alg = 'des-ede-cbc';
  var key = new Buffer(key, 'utf-8');
  var iv = new Buffer('QUJDREVGR0g=', 'base64');    //This is from c# cipher iv

  var cipher = crypto.createCipheriv(alg, key, iv);
  var encoded = cipher.update(text, 'ascii', 'base64');
  encoded += cipher.final('base64');

  return encoded;
}

function decrypt(encryptedText, key) {
  var alg = 'des-ede-cbc';
  var key = new Buffer(key, 'utf-8');
  var iv = new Buffer('QUJDREVGR0g=', 'base64');    //This is from c# cipher iv

  var encrypted = new Buffer(encryptedText, 'base64');
  var decipher = crypto.createDecipheriv(alg, key, iv);
  var decoded = decipher.update(encrypted, 'binary', 'ascii');
  decoded += decipher.final('ascii');

  return decoded;
}

var text = 'LoginNode:Hello~ServerInfo~';
var securityKey = '1223345656677889';
var encryptedText = encrypt(text, securityKey);
var decryptedText = decrypt(encryptedText, securityKey);

console.log('encrypted text:', encryptedText);
console.log('decrypted text:', decryptedText);
encryptedText = "Android~"+encryptedText;
//=========================TCP communication==============================//
// var client = net.connect(2345,'127.0.0.1',function(){
//   console.log('connected to server!');
//   client.write("hello");
// }); 

//var net = require('net');
var decryptedText1
function getmyport (data){

// var HOST = '10.0.0.183'; 
// var PORT = '8200';
var PORT=data.Port
var HOST=data.Host
console.log('1');
var client = new net.Socket();
client.connect(PORT, HOST, function() {
console.log('2');
console.log('CONNECTED TO: ' + HOST + ':' + PORT);
client.write(encryptedText);
console.log('3');
client.on('data', function (data) {
 // var buf = Buffer.from(data,'base64').toString('ascii');
 // console.log(data);
  // console.log(typeof(data));
  // console.log("Enter to string", data);
  console.log('4');
   console.log("buff",data.toString('utf8'));
  //var dd = data.toString('utf8');
   decryptedText1 = decrypt(data.toString('utf8'), securityKey);
   io.emit('getconnectivity',{status:decryptedText1})
  console.log(decryptedText1)
  client.end();
  });

});
  socket_port=PORT
try_other_port = function() {

  if (socket_port !== 80) {
    if (typeof console !== "undefined" && console !== null) {
      console.log("Trying other port, instead of port " + socket_port + ", attempting port 80");
    }
    socket_port = 80;
    client.options.port = socket_port;
    client.options.transports = ['htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling'];
    return socket.client();
  } else {
    return typeof console !== "undefined" && console !== null ? console.log("No other ports to try.") : void 0;
  }
};
client.on('connect_failed', function() {
  if (typeof console !== "undefined" && console !== null) {
    console.log("Connect failed (port " + socket_port + ")");
  }
  return try_other_port();
});
client.on('error', function() {
  if (typeof console !== "undefined" && console !== null) {
    console.log("Socket.io reported a generic error");
  }
  return try_other_port();
});
client.on('unauthorized', (reason) => {
    console.log('Unauthorized:', reason);

    error = reason.message;

    client.disconnect();
  });
}

io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    io.emit('users-changed', {user: socket.nickname, event: 'left'});
  });
 
  socket.on('Serverdata',(data)=>{
console.log('data'+data.Port+''+data.Host)
getmyport(data)

  });
 
  
  socket.on('add-message', (message) => {
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});   
  
  });
});
 
var port = process.env.PORT || 3002;
 
http.listen(port, function(){
   console.log('listening to http://localhost:' + port);
});
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end('Hello World changed!');
//   // client.on('uncaughtException', function (err) {
//   //   console.log(err);
//   // })

// }).listen(process.env.PORT||8200);  













