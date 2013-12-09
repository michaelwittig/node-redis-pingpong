var assert = require("assert-plus"),
	redis = require("redis-mock"),
	pingpong = require("../index");

describe("redis", function () {
	"use strict";
	describe("watch", function () {
		it("should work with working redis", function (done) {
			var client = redis.createClient(6379, "localhost", {enable_offline_queue: false});
			client.on("error", function(err) {
				console.log("client error", err);
			});
			client.once("ready", function() {
				console.log("ready");
				var watcher = pingpong.watch(client, {interval: 1000, maxTimespan: 100, maxMissesBeforeError: 3}), i = 0;
				watcher.on("ping", function() {
					console.log("ping");
				});
				watcher.on("miss", function(misses, err) {
					console.log("miss", misses, err);
				});
				watcher.once("stop", function () {
					done();
				});
				watcher.on("pong", function (timespan) {
					console.log("pong", timespan);
					i += 1;
					if (i > 5) {
						watcher.stop();
					}
				});
			});
		});
	});
});
