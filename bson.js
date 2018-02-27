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


var cursor = db.operation_log.find({"_id":"45f93c8c33b8423ea8640fa9571e4703"});


db.operation_log.update({}, {$set: {txt:""}}, {multi: 1})

db.operation_log.update({},{$unset:{txt:''}}, {multi: 1})

db.operation_log.find({}).forEach(function(x){
  x.time=NumberLong(x.time);
 // db.operation_log.save(x);
 db.operation_log.update({"_id":x._id},{"$set":{"value":NumberLong(x.time)}});
});


// *** 3T Software Labs, Studio 3T: MapReduce Job ****

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
