[![Build Status](https://secure.travis-ci.org/cinovo/node-redis-pingpong.png)](http://travis-ci.org/cinovo/node-redis-pingpong)
[![NPM version](https://badge.fury.io/js/cinovo-redis-pingpong.png)](http://badge.fury.io/js/cinovo-redis-pingpong)

# cinovo-redis-pingpong

cinovo-redis-pingpong sends PING commands to [Redis](http://redis.io) using [redis](https://npmjs.org/package/redis) to check if the connection is alive by receiving a PONG within a certain time span.

## Getting started

### At first you must install and require the logger.

    npm install cinovo-redis-pingpong

### Next you must require the module

`````javascript
var pingpong = require("cinovo-redis-pingpong");
`````

### Watch a redis client

`````javascript
pingpong.watch(client, {"interval": 5000, "maxTimespan": 2000, "maxMissesBeforeError": 5});
pingpong.on("error", function(err) {
	console.log("redis is not available");
});
...
pingpong.stop();
`````

### Done

Now your redis client is watched.
