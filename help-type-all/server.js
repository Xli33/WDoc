'use strict';

const http = require('http');
const url = require('url');
const qs = require('querystring');

const path = './src/';

/*const test = require(path + 'test'),
			account = require(path + 'account'),
			province = require(path + 'province'),
			bandarea = require(path + 'bandarea'),
			group = require(path + 'group'),
			scaffold = require(path + 'scaffold'),
			test = require(path + 'test');*/
// console.log(path);
http.createServer((request, response)=>{		
		let query = qs.parse(url.parse(request.url).query);
		console.log(query);
		response.setHeader('Content-Type','application/json;charset=utf-8'),
    response.setHeader('Access-Control-Allow-Origin',"*"),
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
    response.setHeader("Access-Control-Allow-Methods","POST,GET");
		let code = query.code,target = {};
		if(!code){
			response.end('请传参数！！！！(*￣rǒ￣)ヾ(｡｀Д´｡)');
			return;
		}
    code == 'grid' && (target = require(path + 'test'));
    code == 'ACCOUNT' && (target = require(path + 'account'));
    code == 'PROVINCE' && (target = require(path + 'province'));
    code == 'BANDAREA' && (target = require(path + 'bandarea'));
    code == 'GROUP' && (target = require(path + 'group'));
    code == 'scaffold' && (target = require(path + 'scaffold'));
    code == 'test' && (target = require(path + 'test'));
    code == 'CITY' && (target = require(path + 'city'));
    code == 'COUNTRY' && (target = require(path + 'country'));
    response.write(JSON.stringify(target)),
    response.end();
}).listen(8888,()=>{
	console.log('running now!');
	// console.log(1);
});  
console.log('Server running at http://127.0.0.1:8888/');