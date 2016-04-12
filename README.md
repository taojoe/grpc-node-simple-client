# grpc-node-simple-client

=====================================

封装nodejs 下的grpc，使用promise方式

```javascript
var client=require('grpc-node-simple-client')(grpc, 'localhost:3001', grpc.credentials.createInsecure());
client.load(PATH);

var {package_name:{DemoService}}=client;

var result=await DemoService.test({aa:1});
```

