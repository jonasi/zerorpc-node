// Open Source Initiative OSI - The MIT License (MIT):Licensing
//
// The MIT License (MIT)
// Copyright (c) 2012 DotCloud Inc (opensource@dotcloud.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var zerorpc = require(".."),
    _ = require("underscore");

var rpcServer = new zerorpc.Server({
    iter: function(from, to, step, reply) {
        for(var i=from; i<to; i+=step) {
            reply(null, i, true);
        }

        reply();
    }
});

rpcServer.bind("tcp://0.0.0.0:4242");

var rpcClient = new zerorpc.Client({ timeout: 5 });
rpcClient.connect("tcp://localhost:4242");

exports.testStreamingMethodWithBufferResets = function(test) {
    test.expect(3000);
    var nextExpected = 1;

    rpcClient.invoke("iter", 1, 1000, 1, function(error, res, more) {
        test.ifError(error);

        if(nextExpected == 1000) {
            test.equal(res, undefined);
            test.equal(more, false);
            rpcServer.close();
            test.done();
        } else {
            test.equal(res, nextExpected);
            test.equal(more, true);
            nextExpected += 1;
        }
    });
};