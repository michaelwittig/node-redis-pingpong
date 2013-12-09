var events = require("events"),
	util = require("util"),
	assert = require("assert-plus");

exports.watch = function(client, cfg) {
	"use strict";
	assert.object(client, "client");
	assert.func(client.PING, "client.PING");
	assert.optionalObject(cfg, "cfg");
	cfg = cfg || {};
	assert.optionalNumber(cfg.interval, "cfg.interval");
	assert.optionalNumber(cfg.maxTimespan, "cfg.maxTimespan");
	assert.optionalNumber(cfg.maxMissesBeforeError, "cfg.maxMissesBeforeError");
	assert.optionalNumber(cfg.intervalIncreaseFactorOnMiss, "cfg.intervalIncreaseFactorOnMiss");
	cfg.interval = cfg.interval || 5000;
	assert.ok(cfg.interval > 0, "cfg.interval > 0");
	cfg.maxTimespan = cfg.maxTimespan || 2000;
	assert.ok(cfg.maxTimespan > 0, "cfg.maxTimespan > 0");
	cfg.maxMissesBeforeError = cfg.maxMissesBeforeError || 5;
	assert.ok(cfg.maxMissesBeforeError >= 1, "cfg.maxMissesBeforeError >= 1");
	var misses = 0,
	emitter = new events.EventEmitter(),
	interval = setInterval(function() {
		emitter.emit("ping");
		var begin = (new Date()).getTime(),
		timedout = false,
		timeout = setTimeout(function() {
			timedout = true;
			misses += 1;
			emitter.emit("miss", misses, new Error("Timed out"));
			if (misses >= cfg.maxMissesBeforeError) {
				emitter.emit("error", new Error("redis is unavailable"));
				emitter.stop();
			}
		}, cfg.maxTimespan);
		client.PING(function(err, res) {
			var timespan = (new Date()).getTime() - begin;
			clearTimeout(timeout);
			if (err) {
				misses += 1;
				emitter.emit("miss", misses, err);
				if (misses >= cfg.maxMissesBeforeError) {
					emitter.emit("error", new Error("redis is unavailable"));
					emitter.stop();
				}
			} else {
				if (res === "PONG") {
					if (timedout === false) {
						misses = 0;
						emitter.emit("pong", timespan);
					}
				} else {
					emitter.emit("error", new Error("Received '" + res + "' instead of PONG"));
				}
			}
		});
	}, cfg.interval);
	emitter.stop = function() {
		clearInterval(interval);
		emitter.emit("stop");
	};
	return emitter;
};
