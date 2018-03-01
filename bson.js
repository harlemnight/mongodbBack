//高级聚合查询
db.operation_log.aggregate(
{
  "$match" : {
    				"module" : 
    				{ "$in" : ["04","02"] }	
  			 }
},
{
  "$project" : {
    			 "module" : 1,
    			 "time"	: 1	,
    			 "giz" : "$giz2"
  				}
},
{	
  "$group":
  			{
  			  "_id" : "$module",
  			  "count" : { "$sum" : 1 },
  			  "total_time" : { "$sum" : "$time" }
  			}
},
{
  "$sort" : 
  			{
  			  "count" : -1
  			}
},
{
	"$limit": 5
}
)

//打开游标
var cursor = db.operation_log.find({"_id":"45f93c8c33b8423ea8640fa9571e4703"});

//增加字段
db.operation_log.update({}, {$set: {txt:""}}, {multi: 1})
//删除字段
db.operation_log.update({},{$unset:{txt:''}}, {multi: 1})


//更新字段的类型
db.operation_log.find({}).forEach(function(x){
  x.time=NumberLong(x.time);
 // db.operation_log.save(x);
 db.operation_log.update({"_id":x._id},{"$set":{"value":NumberLong(x.time)}});
});


// *** 3T Software Labs, Studio 3T: MapReduce Job ****


//mapreduce 过程
// Variable for map
var __3tsoftwarelabs_map = function () {

    // Enter the JavaScript for the map function here
    // You can access the current document as 'this'
    //
    // Available functions: assert(), BinData(), DBPointer(), DBRef(), doassert(), emit(), gc()
    //                      HexData(), hex_md5(), isNumber(), isObject(), ISODate(), isString()
    //                      Map(), MD5(), NumberInt(), NumberLong(), ObjectId(), print()
    //                      printjson(), printjsononeline(), sleep(), Timestamp(), tojson()
    //                      tojsononeline(), tojsonObject(), UUID(), version()
    //
    // Available properties: args, MaxKey, MinKey

    emit(this.module, this.time);
};

// Variable for reduce
var __3tsoftwarelabs_reduce = function (key, values) {

    // Enter the JavaScript for the reduce function here
    // 'values' is a list of objects as emit()'ed by the map() function
    // Make sure the object your return is of the same type as the ones emit()'ed
    //
    // Available functions: assert(), BinData(), DBPointer(), DBRef(), doassert(), emit(), gc()
    //                      HexData(), hex_md5(), isNumber(), isObject(), ISODate(), isString()
    //                      Map(), MD5(), NumberInt(), NumberLong(), ObjectId(), print()
    //                      printjson(), printjsononeline(), sleep(), Timestamp(), tojson()
    //                      tojsononeline(), tojsonObject(), UUID(), version()
    //
    // Available properties: args, MaxKey, MinKey

    var reducedValue = Array.sum(values);

    return reducedValue;
};

db.runCommand({ 
    mapReduce: "operation_log",
    map: __3tsoftwarelabs_map,
    reduce: __3tsoftwarelabs_reduce,
    out: { "reduce" : "bxb" , "sharded" : false , "nonAtomic" : false},
    query: {},
    sort: {  },
    inputDB: "LogMgr",
 });


//循环插入
for ( i = 0 ; i < 1000000 ; i++ ) {
  db.users.insert(
    {
    "i" : i,
    "username" : "jeff"+i,
    "createAt" : new Date()
    }
  ) ;
}


//执行计划
db.users.find().explain("executionStats")
//执行计划
db.users.find({ 
    "username" : "jeff101"
}).explain("executionStats")

//创建索引  backgroud true 是后台处理
db.users.ensureIndex({"username" : 1,"age" : 1 },{ "background" , true })

//副本级索引建立
//关闭副本 以独立服务器启动建立索引 然后重复 直到全部副本建立完
//主节点 1.于最后在后台backgroud 建立索引
//       2.类似副本关闭 独立启动 建立 

//获取集合的索引信息
db.users.getIndexes() 

db.currentOp()

//kill session
db.killOp(var opid)

//系统分析器 类似于oracle 审计 会记录所有操作
//一般不开启 0 关闭  1级 2级 所有类型操作
//slowms 值即使 setprofilinglevel =0 关闭也会记录耗时slowms设定值的操作哦
db.setProfilingLevel(2);

//查询集合统计信息
db.users.stats(1024*1024)

//数据库级的
db.stats()



//设置权限 类似于oracle 的用户
#security:
#    authorization: enabled

//
show dbs
//3.0 以后不再支持addUser new is follow
////创建用户必须切换到要建立用户的数据库下面
/////如管理员账户 
///
///
use admin

db.createUser(
   {
     user: "root",
     pwd: "gigi117zyd",
     roles: ["root"]
   }
)

use education;
db.createUser(
   {
     user: "education",
     pwd: "gigi117zyd2",
     roles: ["dbOwner"]
   }
)

