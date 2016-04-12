var merge = require('merge');

function promising(client, name){
    return function(req, callback){
        return new Promise(function(resolve, reject){
            client[name](req, function(err, resp){
                if(err){
                    reject(err);
                }else{
                    resolve(resp);
                }
                if(callback){
                    callback(err, resp);
                }
            });
        });
    };
}
function lfirst(str){
    return str.substr(0,1).toLowerCase()+str.substr(1);
}
function wrapperService(host, credentials, Service){
    var client = new Service(host, credentials);
    var ret={};
    Service.service.children.forEach((item,index)=>{
        var name1=lfirst(item.name);
        ret[name1]=promising(client, name1);
    });
    return ret;
}

function wrapperNS(host, credentials, ns){
    var ret={};

    for(var key in ns){
        var val=ns[key];
        if(typeof(val)=='function'){
            if(val.service){

                ret[key]=wrapperService(host, credentials, val);
            }
        }else{
            ret[key]=wrapperNS(host, credentials, val);
        }
    }
    return ret;
}
var util=require('util');
function loadProto(host, credentials, obj, ns){
    ns=wrapperNS(host, credentials, ns);
    merge.recursive(obj, ns);
}

function createClient(grpc, host, credentials){
    function Client(){
    }
    var client=new Client();
    Client.prototype.load=function(path){
        var $ns=grpc.load(path);
        loadProto(host, credentials, client, $ns);
    };
    return client;
}

module.exports=createClient;
