const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");
const app = express();

const docs = require("./storage/documentation.json");
const errs = require("./storage/errors.json");
const description = require("./storage/description.json");
const docsRu = require("./storage/documentation_ru.json");
const errsRu = require("./storage/errors_ru.json");
const descriptionRu = require("./storage/description_ru.json");

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const standartTTL = 86400;
const usersCache = new NodeCache({stdTTL: standartTTL, checkperiod: 3600, useClones: false});
const resourcesCache = new NodeCache({stdTTL: standartTTL, checkperiod: 3600, useClones: false});

const secretkey = 'upd';
// const documentation = JSON.parse(docs);

var usersBase = [
    {
        id: 0,
        nickname: 'admin',
        email: 'admin@thishosting.com',
        avatar: null,
        password: 'admin_super123',
    },
    {
        id: 1,
        nickname: 'kostya',
        email: 'kostya@thishosting.com',
        avatar: null,
        password: 'kostya_super123',
    },
    {
        id: 2,
        nickname: 'pupok',
        email: 'pupok@thishosting.com',
        avatar: null,
        password: 'pupok_super123',
    },
    {
        id: 3,
        nickname: 'gad23',
        email: 'gad23@thishosting.com',
        avatar: null,
        password: 'gad23_super123',
    },
    {
        id: 4,
        nickname: 'sshakndr',
        email: 'sshakndr@thishosting.com',
        avatar: null,
        password: 'sshakndr_super123',
    },
    {
        id: 5,
        nickname: 'bobik',
        email: 'bobik@thishosting.com',
        avatar: null,
        password: 'bobik_super123',
    },
    {
        id: 6,
        nickname: 'hot_stuff_dasha',
        email: 'hot_stuff_dasha@thishosting.com',
        avatar: null,
        password: 'hot_stuff_dasha_super123',
    },
    {
        id: 7,
        nickname: 'spice',
        email: 'spice@thishosting.com',
        avatar: null,
        password: 'spice_super123',
    },
    {
        id: 8,
        nickname: 'ulick',
        email: 'ulick@thishosting.com',
        avatar: null,
        password: 'ulick_super123',
    },
    {
        id: 9,
        nickname: 'pupa20021',
        email: 'pupa20021@thishosting.com',
        avatar: null,
        password: 'pupa20021_super123',
    },
    {
        id: 10,
        nickname: 'sergeikrutoi',
        email: 'sergeikrutoi@thishosting.com',
        avatar: null,
        password: 'sergeikrutoi_super123',
    },
];
var resourcesBase = [
    {
        id: 0,
        authorname: 'admin',
        authorid: 0,
        name: 'qwerty',
        data: 'hello world',
        color: '#C74375'
    },
    {
        id: 1,
        authorname: 'admin',
        authorid: 0,
        name: 'message',
        data: 'hi mark',
        color: '#C74375'
    },
    {
        id: 2,
        authorname: 'kostya',
        authorid: 1,
        name: 'cow',
        data: 'meow meow',
        color: '#C74375'
    },
    {
        id: 3,
        authorname: 'kostya',
        authorid: 1,
        name: 'normal_cow',
        data: 'moooo',
        color: '#C74375'
    },
    {
        id: 4,
        authorname: 'spice',
        authorid: 7,
        name: 'cs:go',
        data: 'aimbot low price',
        color: '#C74375'
    },
    {
        id: 5,
        authorname: 'spice',
        authorid: 7,
        name: 'overwatch',
        data: 'mercy is so cool',
        color: '#C74375'
    },
    {
        id: 6,
        authorname: 'spice',
        authorid: 7,
        name: 'titanfall 2',
        data: 'idk bad game',
        color: '#C74375'
    },
    {
        id: 7,
        authorname: 'sshakndr',
        authorid: 4,
        name: 'upd one love',
        data: 'so boring',
        color: '#C74375'
    },
    {
        id: 8,
        authorname: 'admin',
        authorid: 0,
        name: 'info',
        data: 'i will ban everybody who dont like upd',
        color: '#C74375'
    },
    {
        id: 9,
        authorname: 'sshakndr',
        authorid: 4,
        name: 'status update',
        data: 'i dont care',
        color: '#C74375'
    },
    {
        id: 10,
        authorname: 'sergeikrutoi',
        authorid: 10,
        name: 'gods',
        data: 'AHAHAHAHAH',
        color: '#C74375'
    },
    
];

function getAddr(req){
    let addr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let auth = req.headers['authorization'] || null;
    return addr+auth;
}

function getUsers(req){
    let addr = getAddr(req);
    let users = usersCache.get(addr);
    if (users !== undefined) {
        return users;
    } else {
        usersCache.set(addr, usersBase);
        users = usersCache.get(addr);
        return users;
    }
} 

function getResources(req){
    let addr = getAddr(req);
    let resources = resourcesCache.get(addr);
    if (resources !== undefined) {
        return resources;
    } else {
        resourcesCache.set(addr, resourcesBase);
        resources = resourcesCache.get(addr);
        return resources;
    }
} 

app.set('view engine', 'ejs');

app.get("/", function(request, response){
    response.render("index",{
        documentation: docsRu,
        apiErrors: errsRu,
        description: descriptionRu
    });
});

app.get("/en", function(request, response){
    response.render("index",{
        documentation: docs,
        apiErrors: errs,
        description: description
    });
});

app.post("/api/register", function(request,response){
    try{
        let users = getUsers(request);
        let {nickname,password,email} = request.body;
        if (users.filter((user)=>{return user.nickname==nickname}).length != 0) response.status(201).send("This nickname is already taken");
        else {
            let user = {
                id: users[users.length-1].id + 1,
                nickname: nickname,
                email: email,
                avatar: null,
                password: password,
            }
            users.push(user);
            response.status(201).json({id:user.id,nickname,email,avatar:null});
        }
    }
    catch (e){
        console.log(e)
        response.status(400).send("Bad Request");
        return;
    } 
});

app.post("/api/login", function(request,response){
    let users = getUsers(request);
    let {nickname, password} = request.body;
    if(!nickname || !password) response.status(400).send("Bad Request");
    else {
        let user = users.filter(u=>{return u.nickname==nickname})[0];
        if(!user) response.status(404).send("User Not Found");
        else {
            if (user.password == password) response.json({id:user.id,token: jwt.sign({id:user.id,nickname},secretkey)});
            else response.send("Incorrect password");
        }
    }
});

app.get("/api/users", function(request,response){
    let users = getUsers(request);
    let {page, pagination} = request.query;
    if ((page && !/^\d+$/.test(page)) || (pagination && !/^\d+$/.test(pagination))) response.status(400).send("Bad Request");
    else {
        let resUsers = structuredClone(users);
        resUsers.forEach(u=>{delete u.password});
        let p = page? page-1 : 0;
        let num = pagination? Number(pagination) : 10;
        response.json(resUsers.slice(p*num,page?(p*num+num):resUsers.length));
    }
});

app.get("/api/users/:id", function(request,response){
    let users = getUsers(request);
    let id = request.params.id;
    if ((id && !/^\d+$/.test(id))) response.status(400).send("Bad Request");
    else {
        let user = users.filter(u=>{return u.id==id})[0];
        if(!user) response.status(404).send("User Not Found");
        else response.json(user);
    }
});

app.put("/api/users/:id", function(request,response){
    let users = getUsers(request);
    let id = request.params.id;
    let user = request.body;
    if (!/^\d+$/.test(id) || !user) response.status(400).send("Bad Request");
    else {
        let cunt = 0;
        for(let i=0;i<users.length;i++){
            if (users[i].id == id) {
                users[i] = {id:users[i].id, nickname: user.nickname, email: user.email, password:user.password, avatar: user.avatar};
                cunt++;
            }
        }
        if(cunt==0) response.status(404).send("User Not Found");
        else response.json(user);
    }
});

app.delete("/api/users/:id",function(request,response){
    let users = getUsers(request);
    let id = request.params.id;
    if (!/^\d+$/.test(id)) response.status(400).send("Bad Request");
    else response.status(204).send("User Deleted");
});

app.get("/api/resources", function(request,response){
    let resources = getResources(request);
    let {page} = request.query;
    if (page && !/^\d+$/.test(page)) {
        response.status(400).send("Bad Request");
    } else {
        p = page? page-1 : 0;
        let resres = resources.slice(p*10,page?p*10+10:resources.length);
        response.json(resres);
    }
});

app.get("/api/resources/:id", function(request,response){
    let resources = getResources(request);
    let id = request.params.id;
    if (/^\d+$/.test(id)) {
        let resourse = resources.filter(r=>{return r.id == id})[0];
        if (!resourse) response.status(404).send("Resource Not Found");
        else response.json(resourse);
    } else {
        response.status(400).send("Bad Request");
    }
});

app.post("/api/resources",function(request,response){
    let resources = getResources(request);
    let {authorid, name, data, color} = request.body;
    if (authorid === undefined || !name || !data || !color || !/^\d+$/.test(authorid.toString()) || !/#[a-f0-9]{6}\b/gi.test(color)) response.status(400).send("Bad Request");
    else {
        let newres = {
            id: resources[resources.length-1].id + 1,
            authorid: authorid,
            authorname: 'admin',
            name: name,
            data: data,
            color: color
        }
        resources.push(newres);
        response.json(newres);
    }
});

app.put("/api/resources",function(request,response){
    let resources = getResources(request);
    let {id, name, data, color} = request.body;
    if (id === undefined || !/^\d+$/.test(id) || (color && !/#[a-f0-9]{6}\b/gi.test(color))) response.status(400).send("Bad Request");
    else {
        let count = 0;
        resources.forEach(r=>{
            if (r.id == id){
                r.name = name? name : r.name;
                r.data = data? data : r.data;
                r.color = color? color : r.color;
                count++;
            }
        });
        if(count==0) response.status(404).send("Resource Not Found")
        else response.send("Resource Updated");
    }
});

app.delete("/api/resources", function(request,response){
    let resources = getResources(request);
    let {id} = request.body;
    if (id === undefined || !/^\d+$/.test(id)) response.status(400).send("Bad Request");
    else {
        let ress = resources.filter(r=>{return r.id !== id});
        if (ress.length == resources.length) response.status(404).send("Resource Not Found");
        else{
            resourcesCache.set(getAddr(request), ress);
            response.status(204).send("Resource Deleted");
        }
    }
});

app.listen(3000);