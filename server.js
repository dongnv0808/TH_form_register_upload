const http = require('http');
const fs = require('fs');
const qs = require('qs');
const formidable = require('formidable');

let users = [];
let  server = http.createServer((req, res) => {
    if(req.method === 'GET'){
        fs.readFile('./views/register.html', (err, data) => {
            if(err){
                res.writeHead(404, {'Content-Type':'text/html'});
                return res.end('404 not found');
            }else{
                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(data);
                return res.end();
            }
        })
    }else{
        let form = new formidable.IncomingForm();
        form.uploadDir = "upload/";
        form.parse(req, (err, fields, files) => {
            let userInfo = {
                name: fields.name,
                email: fields.email,
                password: fields.password,
            };
            
            if(err){
                console.error(err.message);
                return res.end(err.message);
            }
            
            let tmpPath = files.avatar.filepath;
            let newPath = form.uploadDir + files.avatar.originalFilename;
            userInfo.avatar = newPath;
            fs.rename(tmpPath, newPath, (err) => {
                if(err) throw err;
                let fileType = files.avatar.mimetype;
                let mimeType = ['image/jpeg', 'image/jpg', 'image/png'];
                if(mimeType.indexOf(fileType) === -1){
                    res.writeHead(200, {'Content-Type':'text/html'});
                    return res.end('The file is not in the correct format: png, jpeg, jpg');
                }
                users.push(userInfo);
                console.log(users);
                return res.end('Register succes!');
            })
        })
    }
})

server.listen(8080, () => {
    console.log('Server is running localhost:8080');
})