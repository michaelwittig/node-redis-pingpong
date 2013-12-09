var assert = require("assert-plus"),
	pingpong = require("../index");

var client = {
	"PING": function(cb) {
		"use strict";
		cb(undefined, "PONG");
	}
};

describe("API", function () {
	"use strict";
	describe("watch", function () {
		it("should work with defaults without options", function (done) {
			pingpong.watch(client).once("ping", function () {
				done();
			});
		});
		it("should work with empty options", function (done) {
			pingpong.watch(client, {}).once("ping", function () {
				done();
			});
		});
		it("should work with interval", function (done) {
			pingpong.watch(client, {interval: 1000}).once("ping", function () {
				done();
			});
		});
		it("should work with maxTimespan", function (done) {
			pingpong.watch(client, {maxTimespan: 1000}).once("ping", function () {
				done();
			});
		});
		it("should work with maxMissesBeforeError", function (done) {
			pingpong.watch(client, {maxMissesBeforeError: 1}).once("ping", function () {
				done();
			});
		});
	});
});
