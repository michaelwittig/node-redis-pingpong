[![Build Status](https://secure.travis-ci.org/michaelwittig/node-redis-pingpong.png)](http://travis-ci.org/michaelwittig/node-redis-pingpong)
[![NPM version](https://badge.fury.io/js/cinovo-redis-pingpong.png)](http://badge.fury.io/js/cinovo-redis-pingpong)

# cinovo-redis-pingpong

cinovo-redis-pingpong sends PING commands to [Redis](http://redis.io) using [redis](https://npmjs.org/package/redis) to check if the connection is alive by receiving a PONG within a certain time span.

## Getting started

### At first you must install and require the module.

    npm install cinovo-redis-pingpong

### Next you must require the module

`````javascript
var pingpong = require("cinovo-redis-pingpong");
`````

### Then you can watch a redis client

`````javascript
var client = require("redis").createClient(6379, "localhost");
...
pingpong.watch(client, {"interval": 5000, "maxTimespan": 2000, "maxMissesBeforeError": 5});
pingpong.on("error", function(err) {
	console.log("redis is not available");
});
...
pingpong.stop();
`````

### Done

Now your redis client is watched.

## API

### watch(client, cfg)

Watch a redis `client`.

* `client`: Instance of redid.createClient()...
* `cfg`: Object (optional)
	* `interval`: Number - Milli seconds between two PINGs (optional, default: 5000)
	* `maxTimespan`: Number - Milli seconds we wait for a PONG after the PING (optional, default: 2000)
	* `maxMissesBeforeError`: Number - If we counted $maxMissesBeforeError misses an error is emitted (optional, default: 5)

### stop()

Stop the watcher.

### Events

#### ping()

Is fired when the PING command is send.

#### pong(timespan)

Is fired when the PONG response arrived.

* `timespan`: Number - Time between PING and PONG in milli seconds

#### miss(misses, error)

Is fired if redis was missed.

* `misses`: Number . Number of misses so far
* `error`: Error that caused the miss

#### error(err)

Is fired when redis is no longer available.

* `error`: Error

#### stop()

If the watches was stopped.
