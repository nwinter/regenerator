/**
 * Copyright (c) 2013, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// nwinter: I had to tear this up so it'd more efficiently fit within Aether.
// Something more elegant will do if this works out.

var assert = require("assert");
var path = require("path");
//var fs = require("fs");
var transform = require("./lib/visit").transform;
var guessTabWidth = require("./lib/util").guessTabWidth;
var recast = require("recast");
//var esprimaHarmony = require("esprima");
var genFunExp = /\bfunction\s*\*/;

//assert.ok(
//  /harmony/.test(esprimaHarmony.version),
//  "Bad esprima version: " + esprimaHarmony.version
//);

function regenerator(source, esprima) {
  if (!genFunExp.test(source)) {
    return source; // Shortcut: no generators to transform.
  }

  var recastOptions = {
    tabWidth: guessTabWidth(source),
    // Use the harmony branch of Esprima that installs with regenerator
    // instead of the master branch that recast provides.
    esprima: esprima
  };

  var ast = recast.parse(source, recastOptions);
  var es5 = recast.print(transform(ast), recastOptions);
  return es5;
}

// To modify an AST directly, call require("regenerator").transform(ast).
regenerator.transform = transform;

//regenerator.runtime = {
//  dev: path.join(__dirname, "runtime", "dev.js"),
//  min: path.join(__dirname, "runtime", "min.js")
//};

// To transform a string of ES6 code, call require("regenerator")(source);
module.exports = regenerator;
