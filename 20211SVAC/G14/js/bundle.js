(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Atributo = void 0;
var Nodo_1 = require("../../InterpreteXPath/AST/Nodo");
var NodoAST_1 = __importDefault(require("../../InterpreteXPath/AST/NodoAST"));
var Atributo = /** @class */ (function (_super) {
    __extends(Atributo, _super);
    function Atributo(id, valor, fila, columna) {
        var _this = _super.call(this, fila, columna) || this;
        _this.identificador = id;
        _this.valor = valor;
        _this.fila = fila;
        _this.columna = columna;
        return _this;
    }
    Atributo.prototype.obtenerNodos = function () {
        var nodo = new NodoAST_1.default("ATRIBUTO");
        nodo.addHijoSimple(this.identificador);
        nodo.addHijoSimple("=");
        nodo.addHijoSimple(this.valor);
        return [nodo, nodo];
    };
    return Atributo;
}(Nodo_1.Nodo));
exports.Atributo = Atributo;

},{"../../InterpreteXPath/AST/Nodo":11,"../../InterpreteXPath/AST/NodoAST":12}],5:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objeto = void 0;
var Nodo_1 = require("../../InterpreteXPath/AST/Nodo");
var NodoAST_1 = __importDefault(require("../../InterpreteXPath/AST/NodoAST"));
var Objeto = /** @class */ (function (_super) {
    __extends(Objeto, _super);
    function Objeto(id, texto, fila, columna, listaAtributos, listaO, cierre) {
        var _this = _super.call(this, fila, columna) || this;
        _this.identificador = id;
        _this.texto = texto;
        _this.fila = fila;
        _this.columna = columna;
        _this.lista = listaAtributos;
        _this.listaObjetos = listaO;
        _this.cierre = cierre;
        return _this;
    }
    Objeto.prototype.getValor = function () {
        return this.identificador;
    };
    Objeto.prototype.obtenerNodos = function () {
        var cst = new NodoAST_1.default("OBJETO");
        var ast = new NodoAST_1.default("");
        cst.addHijoSimple("<");
        if (this.identificador == "xml") {
            cst.valor = "PROLOG";
            cst.addHijoSimple("xml");
            var atr = this.lista.obtenerNodos()[0];
            cst.addHijo(atr);
            cst.addHijoSimple("?>");
        }
        else {
            cst.addHijoSimple(this.identificador);
            ast.addHijoSimple(this.identificador);
            // console.log(this.lista)
            if (this.lista != null) {
                var atr2 = this.lista.obtenerNodos()[0];
                cst.addHijo(atr2);
                ast.addHijo(atr2);
            }
            if (this.listaObjetos != null) {
                cst.addHijoSimple("> <");
                var obj = this.listaObjetos.obtenerNodos()[0];
                cst.addHijo(obj);
                cst.addHijoSimple("/");
                cst.addHijoSimple(this.identificador);
                cst.addHijoSimple(this.cierre);
            }
            else if (this.texto != "") {
                cst.addHijoSimple(this.texto);
                cst.addHijoSimple("/");
                cst.addHijoSimple(this.identificador);
                cst.addHijoSimple(this.cierre);
            }
            else {
                cst.addHijoSimple("/>");
            }
        }
        return [cst, ast];
    };
    return Objeto;
}(Nodo_1.Nodo));
exports.Objeto = Objeto;

},{"../../InterpreteXPath/AST/Nodo":11,"../../InterpreteXPath/AST/NodoAST":12}],6:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var AscGrammer = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[2,11],$V1=[1,11],$V2=[1,13],$V3=[12,13,14,18,19],$V4=[5,13,16],$V5=[13,16],$V6=[1,31],$V7=[1,30];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"S":3,"START":4,"EOF":5,"PROLOG":6,"RAIZ":7,"open":8,"OBJETO":9,"xml_open":10,"LATRIBUTOS":11,"special_close":12,"identifier":13,"open_close":14,"OBJETOS":15,"slash":16,"CERRAR":17,"text":18,"slash_close":19,"close":20,"ATRIBUTOS":21,"ATRIBUTO":22,"equal":23,"string":24,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"open",10:"xml_open",12:"special_close",13:"identifier",14:"open_close",16:"slash",18:"text",19:"slash_close",20:"close",23:"equal",24:"string"},
productions_: [0,[3,2],[4,2],[7,2],[6,3],[9,7],[9,6],[9,3],[17,1],[17,1],[11,1],[11,0],[21,2],[21,1],[22,3],[15,2],[15,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 this.$ = $$[$0-1]; return this.$; 
break;
case 2:
 $$[$0].unshift($$[$0-1]); this.$ = $$[$0]; 
break;
case 3:
 this.$ = [$$[$0]]; 
break;
case 4:
 this.$ = new Objeto('xml', '', _$[$0-2].first_line, _$[$0-2].first_column, $$[$0-1], []); 
break;
case 5:
 if($$[$0-6] === $$[$0-1]) {
                                                                                            this.$ = new Objeto($$[$0-6], '', _$[$0-6].first_line, _$[$0-6].first_column, $$[$0-5], $$[$0-3], $$[$0]);
                                                                                        } else {
                                                                                            /* error semántico */
                                                                                            this.$ = null;
                                                                                        }
                                                                                    
break;
case 6:
 if($$[$0-5] === $$[$0-1]){
                                                                                            $$[$0-3] = $$[$0-3].replace("<", ""); 
                                                                                            $$[$0-3] = $$[$0-3].replace(">", "");
                                                                                            this.$ = new Objeto($$[$0-5], $$[$0-3], _$[$0-5].first_line, _$[$0-5].first_column, $$[$0-4], null, $$[$0]);
                                                                                        } else {
                                                                                           /* error semántico */
                                                                                            this.$ = null;
                                                                                        }
                                                                                    
break;
case 7:
 this.$ = new Objeto($$[$0-2], '', _$[$0-2].first_line, _$[$0-2].first_column, $$[$0-1], null, $$[$0]); 
break;
case 8: case 9:
this.$ = $$[$0]
break;
case 10:
 this.$ =$$[$0] 
break;
case 11:
 this.$ = null; 
break;
case 12:
  this.$ = new Etiqueta("atributo",0,0,$$[$0-1],$$[$0]);  
break;
case 13:
  this.$ = new Etiqueta("atributo",0,0,null,$$[$0]); 
break;
case 14:
 this.$ = new Atributo($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 15:
   if($$[$0] !== null ){
                                                                                             this.$ = new Etiqueta("objeto",0,0,$$[$0-1],$$[$0]);  
                                                                                        } else { 
                                                                                            this.$ =  new Etiqueta("objeto",0,0,$$[$0-1],null); ; 
                                                                                        }
                                                                                    
break;
case 16:
   if($$[$0] !== null ){
                                                                                           this.$ = new Etiqueta("objeto",0,0,null,$$[$0]); 
                                                                                        } else { 
                                                                                            this.$ = new Etiqueta("objeto",0,0,null,null); ; 
                                                                                        }
                                                                                    
break;
}
},
table: [{3:1,4:2,6:3,10:[1,4]},{1:[3]},{5:[1,5]},{7:6,8:[1,7]},{11:8,12:$V0,13:$V1,21:9,22:10},{1:[2,1]},{5:[2,2]},{9:12,13:$V2},{12:[1,14]},o([12,14,18,19],[2,10],{22:15,13:$V1}),o($V3,[2,13]),{23:[1,16]},{5:[2,3]},o([14,18,19],$V0,{21:9,22:10,11:17,13:$V1}),{8:[2,4]},o($V3,[2,12]),{24:[1,18]},{14:[1,19],18:[1,20],19:[1,21]},o($V3,[2,14]),{9:23,13:$V2,15:22},{16:[1,24]},o($V4,[2,7]),{9:26,13:$V2,16:[1,25]},o($V5,[2,16]),{13:[1,27]},{13:[1,28]},o($V5,[2,15]),{14:$V6,17:29,20:$V7},{14:$V6,17:32,20:$V7},o($V4,[2,6]),o($V4,[2,8]),o($V4,[2,9]),o($V4,[2,5])],
defaultActions: {5:[2,1],6:[2,2],12:[2,3],14:[2,4]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    const { Objeto }    = require('../Expresion/Objeto');
    const { Atributo }  = require('../Expresion/Atributo');
    const { Etiqueta }  = require('../../InterpreteXPath/AST/Etiqueta');
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:/* skip whitespace */
break;
case 2:return 10;
break;
case 3: const re = /[\s\t\n]+/
                                              var aux = yy_.yytext.replace('<', ''); 
                                              aux = aux.replace('>', '');
                                              aux = aux.replace(re, '');
                                              if(aux.length > 0) {
                                                  return 18
                                              } else {
                                                  return 14
                                              }
                                            
break;
case 4:return 12;
break;
case 5:return 19;
break;
case 6:return 20;
break;
case 7:return 8;
break;
case 8:return 16;
break;
case 9:return 23;
break;
case 10:return 24;
break;
case 11:return 13;
break;
case 12:return 5
break;
case 13: 
        console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column);
    
break;
}
},
rules: [/^(?:\s+)/i,/^(?:<!.*?>)/i,/^(?:<\?xml\b)/i,/^(?:>([^<]|\n)*<)/i,/^(?:\?>)/i,/^(?:\/>)/i,/^(?:>)/i,/^(?:<)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:("[^"]*"))/i,/^(?:[a-zA-Zá-úÁ-Úä-üÄ-Ü_][a-zA-Z0-9_\-ñÑá-úÁ-Úä-üÄ-Ü]*)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = AscGrammer;
exports.Parser = AscGrammer.Parser;
exports.parse = function () { return AscGrammer.parse.apply(AscGrammer, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../../InterpreteXPath/AST/Etiqueta":10,"../Expresion/Atributo":4,"../Expresion/Objeto":5,"_process":3,"fs":1,"path":2}],7:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var DescGrammer = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[2,11],$V1=[1,11],$V2=[1,13],$V3=[12,14,18,19],$V4=[2,14],$V5=[5,13,16],$V6=[2,18],$V7=[1,35],$V8=[1,34];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"S":3,"START":4,"EOF":5,"PROLOG":6,"RAIZ":7,"open":8,"OBJETO":9,"xml_open":10,"LATRIBUTOS":11,"special_close":12,"identifier":13,"open_close":14,"OBJETOS":15,"slash":16,"CERRAR":17,"text":18,"slash_close":19,"close":20,"ATRIBUTOS":21,"ATRIBUTO":22,"ATRIBUTOS_P":23,"equal":24,"string":25,"OBJETOS_P":26,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"open",10:"xml_open",12:"special_close",13:"identifier",14:"open_close",16:"slash",18:"text",19:"slash_close",20:"close",24:"equal",25:"string"},
productions_: [0,[3,2],[4,2],[7,2],[6,3],[9,7],[9,6],[9,3],[17,1],[17,1],[11,1],[11,0],[21,2],[23,2],[23,0],[22,3],[15,2],[26,2],[26,0]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 this.$ = $$[$0-1]; return this.$; 
break;
case 2:
 $$[$0].unshift($$[$0-1]); this.$ = $$[$0]; 
break;
case 3:
 this.$ = [$$[$0]]; 
break;
case 4:
 this.$ = new Objeto('xml', '', _$[$0-2].first_line, _$[$0-2].first_column, $$[$0-1], []); 
break;
case 5:
 if($$[$0-6] === $$[$0-1]) {
                                                                                            this.$ = new Objeto($$[$0-6], '', _$[$0-6].first_line, _$[$0-6].first_column, $$[$0-5], $$[$0-3],$$[$0]);
                                                                                        } else {
                                                                                            /* error semántico */
                                                                                            this.$ = null;
                                                                                        }
                                                                                    
break;
case 6:
 if($$[$0-5] === $$[$0-1]){
                                                                                            $$[$0-3] = $$[$0-3].replace("<", ""); 
                                                                                            $$[$0-3] = $$[$0-3].replace(">", "");
                                                                                            this.$ = new Objeto($$[$0-5], $$[$0-3], _$[$0-5].first_line, _$[$0-5].first_column, $$[$0-4], null,$$[$0]);
                                                                                        } else {
                                                                                            /* error semántico */
                                                                                            this.$ = null;
                                                                                        }
                                                                                    
break;
case 7:
 this.$ = new Objeto($$[$0-2], '', _$[$0-2].first_line, _$[$0-2].first_column, $$[$0-1], null,$$[$0]); 
break;
case 8: case 9:
this.$ = $$[$0]
break;
case 10:
 this.$ = $$[$0]; 
break;
case 11: case 14: case 18:
 this.$ = null; 
break;
case 12: case 13:
 this.$ = new Etiqueta("atributo",0,0,$$[$0-1],$$[$0]); 
break;
case 15:
 this.$ = new Atributo($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].first_column); 
break;
case 16:
 if($$[$0-1] !== null ){
                                                                                             this.$ = new Etiqueta("objeto",0,0,$$[$0-1],$$[$0]);
                                                                                        } else { 
                                                                                           this.$ = new Etiqueta("objeto",0,0,$$[$0-1],$$[$0]);
                                                                                        } 
                                                                                    
break;
case 17:
 if($$[$0-1] !== null ){
                                                                                            this.$ = new Etiqueta("objeto",0,0,$$[$0-1],$$[$0]);
                                                                                        } else { 
                                                                                             this.$ = new Etiqueta("objeto",0,0,$$[$0-1],$$[$0]);
                                                                                        }
                                                                                    
break;
}
},
table: [{3:1,4:2,6:3,10:[1,4]},{1:[3]},{5:[1,5]},{7:6,8:[1,7]},{11:8,12:$V0,13:$V1,21:9,22:10},{1:[2,1]},{5:[2,2]},{9:12,13:$V2},{12:[1,14]},o($V3,[2,10]),o($V3,$V4,{23:15,22:16,13:$V1}),{24:[1,17]},{5:[2,3]},o([14,18,19],$V0,{21:9,22:10,11:18,13:$V1}),{8:[2,4]},o($V3,[2,12]),o($V3,$V4,{22:16,23:19,13:$V1}),{25:[1,20]},{14:[1,21],18:[1,22],19:[1,23]},o($V3,[2,13]),o([12,13,14,18,19],[2,15]),{9:25,13:$V2,15:24},{16:[1,26]},o($V5,[2,7]),{16:[1,27]},{9:29,13:$V2,16:$V6,26:28},{13:[1,30]},{13:[1,31]},{16:[2,16]},{9:29,13:$V2,16:$V6,26:32},{14:$V7,17:33,20:$V8},{14:$V7,17:36,20:$V8},{16:[2,17]},o($V5,[2,6]),o($V5,[2,8]),o($V5,[2,9]),o($V5,[2,5])],
defaultActions: {5:[2,1],6:[2,2],12:[2,3],14:[2,4],28:[2,16],32:[2,17]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    const { Objeto }    = require('../Expresion/Objeto');
    const { Atributo }  = require('../Expresion/Atributo');
    const { Etiqueta }  = require('../../InterpreteXPath/AST/Etiqueta');
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:/* skip whitespace */
break;
case 2:return 10;
break;
case 3: const re = /[\s\t\n]+/
                                              var aux = yy_.yytext.replace('<', ''); 
                                              aux = aux.replace('>', '');
                                              aux = aux.replace(re, '');
                                              if(aux.length > 0) {
                                                  return 18
                                              } else {
                                                  return 14
                                              }
                                            
break;
case 4:return 12;
break;
case 5:return 19;
break;
case 6:return 20;
break;
case 7:return 8;
break;
case 8:return 16;
break;
case 9:return 24;
break;
case 10:return 25;
break;
case 11:return 13;
break;
case 12:return 5
break;
case 13: 
        console.error('Este es un error léxico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column);
    
break;
}
},
rules: [/^(?:\s+)/i,/^(?:<!.*?>)/i,/^(?:<\?xml\b)/i,/^(?:>([^<]|\n)*<)/i,/^(?:\?>)/i,/^(?:\/>)/i,/^(?:>)/i,/^(?:<)/i,/^(?:\/)/i,/^(?:=)/i,/^(?:("[^"]*"))/i,/^(?:[a-zA-Zá-úÁ-Úä-üÄ-Ü_][a-zA-Z0-9_\-ñÑá-úÁ-Úä-üÄ-Ü]*)/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = DescGrammer;
exports.Parser = DescGrammer.Parser;
exports.parse = function () { return DescGrammer.parse.apply(DescGrammer, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../../InterpreteXPath/AST/Etiqueta":10,"../Expresion/Atributo":4,"../Expresion/Objeto":5,"_process":3,"fs":1,"path":2}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
var Simbolo = /** @class */ (function () {
    function Simbolo(id, tipo, valor, fila, columna, indice) {
        this.id = id;
        this.fila = fila;
        this.columna = columna;
        this.tipo = tipo;
        this.valor = valor;
        this.entorno = [];
        if ('undefined' === typeof indice) {
            this.indice = '';
        }
        else {
            this.indice = indice.toString();
        }
    }
    Simbolo.prototype.getTipo = function () {
        return this.tipo;
    };
    Simbolo.prototype.getValorImplicito = function () {
        return this.valor;
    };
    return Simbolo;
}());
exports.Simbolo = Simbolo;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoDato = void 0;
var TipoDato;
(function (TipoDato) {
    TipoDato[TipoDato["STRING"] = 0] = "STRING";
    TipoDato[TipoDato["INT"] = 1] = "INT";
    TipoDato[TipoDato["DOUBLE"] = 2] = "DOUBLE";
    TipoDato[TipoDato["BOOL"] = 3] = "BOOL";
    TipoDato[TipoDato["VOID"] = 4] = "VOID";
    TipoDato[TipoDato["STRUCT"] = 5] = "STRUCT";
    TipoDato[TipoDato["ARRAY"] = 6] = "ARRAY";
    TipoDato[TipoDato["ATRIBUTO"] = 7] = "ATRIBUTO";
    TipoDato[TipoDato["ETIQUETA"] = 8] = "ETIQUETA";
})(TipoDato = exports.TipoDato || (exports.TipoDato = {}));

},{}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Etiqueta = void 0;
var Nodo_1 = require("./Nodo");
var NodoAST_1 = __importDefault(require("./NodoAST"));
var Etiqueta = /** @class */ (function (_super) {
    __extends(Etiqueta, _super);
    function Etiqueta(id, fila, columna, etiqueta, valor) {
        var _this = _super.call(this, fila, columna) || this;
        _this.identificador = id;
        _this.fila = fila;
        _this.columna = columna;
        _this.etiqueta = etiqueta;
        _this.valor = valor;
        return _this;
    }
    Etiqueta.prototype.obtenerNodos = function () {
        var nodo;
        if (this.identificador == "atributo") {
            nodo = new NodoAST_1.default("LISTA_ATRIBUTOS");
        }
        else {
            nodo = new NodoAST_1.default("LISTA_OBJETOS");
        }
        if (this.etiqueta != null) {
            var eti = this.etiqueta.obtenerNodos()[0];
            nodo.addHijo(eti);
        }
        if (this.valor != null) {
            nodo.addHijo(this.valor.obtenerNodos()[0]);
        }
        return [nodo, nodo];
    };
    return Etiqueta;
}(Nodo_1.Nodo));
exports.Etiqueta = Etiqueta;

},{"./Nodo":11,"./NodoAST":12}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodo = void 0;
var Nodo = /** @class */ (function () {
    function Nodo(line, column) {
        this.line = line;
        this.column = column;
    }
    return Nodo;
}());
exports.Nodo = Nodo;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodoAST = /** @class */ (function () {
    function NodoAST(valor) {
        this.hijos = new Array();
        this.valor = valor;
    }
    NodoAST.prototype.addHijos = function (hijos) {
        this.hijos = hijos;
    };
    NodoAST.prototype.addHijo = function (hijo) {
        this.hijos.push(hijo);
    };
    NodoAST.prototype.addHijoSimple = function (hijo) {
        this.hijos.push(new NodoAST(hijo));
    };
    NodoAST.prototype.getValor = function () {
        return this.valor;
    };
    NodoAST.prototype.setValor = function (cad) {
        this.valor = cad;
    };
    NodoAST.prototype.getHijos = function () {
        return this.hijos;
    };
    return NodoAST;
}());
exports.default = NodoAST;

},{}],13:[function(require,module,exports){
const { Simbolo } = require("../InterpreteXML/TablaSimbolo/Simbolo");
var scriptXML = require("./scriptXML");

document.getElementById("file").addEventListener("change", add, false);
document
  .getElementById("openBrowser")
  .addEventListener("click", openBrowser, false);
document.getElementById("Download").addEventListener("click", Download, false);
document.getElementById("Clean").addEventListener("click", Clean, false);
document.getElementById("Ejecutar").addEventListener("click", Ejecutar, false);

var editor = CodeMirror(document.getElementById("codemirror"), {
  mode: "xml",
  lineNumbers: true,
  theme: "dracula",
  autoRefresh: true,
});
editor.setSize("100%", "100%");

var xpath = CodeMirror(document.getElementById("xpath"), {
  mode: "text",
  theme: "dracula",
  //autoRefresh: true
});
xpath.setSize("100%", "100%");

var res = CodeMirror(document.getElementById("resultado"), {
  mode: "xml",
  lineNumbers: true,
  theme: "dracula",
  autoRefresh: true,
});
res.setSize("100%", "100%");

var container = document.getElementById("grafoXML");

function openBrowser() {
  let fileinput = document.getElementById("file");
  fileinput.click();
}

function add(evt) {
  let fil = evt.target.files[0];
  if (!fil) {
    return;
  }

  if (fil.type == "text/xml") {
    let cuerpo = "";
    let lector = new FileReader();
    lector.onload = function (evt) {
      cuerpo = evt.target.result;
      editor.getDoc().setValue(cuerpo);
    };

    lector.readAsText(fil);
  } else {
    alert("Por favor seleccione un archivo XML.");
  }
}

function Download() {
  let content = editor.getDoc().getValue();
  let nombre = "archivo.xml"; //nombre del archivo
  let file = new Blob([content], { type: "xml" });

  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, nombre);
  } else {
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function Clean() {
  editor.getDoc().setValue("");
}

function Ejecutar() {
  let objetos = "";
  let contentXML = editor.getDoc().getValue();
  let Tablasimbolos = "";
  if (document.getElementById("aXml").checked) {
    objetos = scriptXML.ParsearAsc(contentXML);
    Tablasimbolos = scriptXML.BuildSimbolTable(objetos[1]);
  } else {
    objetos = scriptXML.ParsearDesc(contentXML);
    Tablasimbolos = scriptXML.BuildSimbolTable(objetos[1]);
  }
  scriptXML.Graficar(objetos);
  MostrarCST(scriptXML.dot);
  MostrarSimbolos(Tablasimbolos);

  if (document.getElementById("aXPath").checked) {
    alert("Y analisis de XPath ascendente");
  } else {
    alert("Analisis de XML descendente");
  }
}

function MostrarCST(DOTstring) {
  var parsedData = vis.network.convertDot(DOTstring);
  var data = {
    nodes: parsedData.nodes,
    edges: parsedData.edges,
  };

  var options = {
    scale: 0.8,
    nodes: {
      shape: "box",
      size: 15,
      font: {
        color: "#282a36",
        face: "helvetica",
      },
      color: "#ffffff",
    },
    edges: {
      smooth: false,
      arrows: {
        to: true,
      },
    },
    layout: {
      //Clasificación
      hierarchical: {
        levelSeparation: 150, // La distancia entre diferentes niveles
        nodeSpacing: 200, // La distancia mínima entre nodos en el eje libre
        treeSpacing: 500, // La distancia entre diferentes árboles
        // dirección
        direction: "UD",
        sortMethod: "directed", // hubsize, directed
      },
    },
  };

  $("#cst-xml").show();
  var network = new vis.Network(container, data, options);
}

var cont = 1;
function MostrarSimbolos(simbolos) {
  $("#simbolTable").show();
  let $cuerpo = document.getElementById("tbodyJS");
  cont = 1;
  $cuerpo.innerHTML = "";

  let $tr = document.createElement("tr");
  // Número
  let $conta = document.createElement("th");
  $conta.textContent = cont;
  $tr.appendChild($conta);
  cont = cont + 1;
  // ID
  let $id = document.createElement("td");
  $id.textContent = "Global";
  $tr.appendChild($id);
  // Valor
  let $valor = document.createElement("td");
  $valor.textContent = "";
  $tr.appendChild($valor);
  // Entorno
  let $Entorno = document.createElement("td");
  $Entorno.textContent = "";
  $tr.appendChild($Entorno);

  $cuerpo.appendChild($tr);
  MostrarFilasTabla(simbolos, $cuerpo);
}

function MostrarFilasTabla(simbolo, cuerpo) {
  simbolo.entorno.forEach((element) => {
    let $tr = document.createElement("tr");
    // Número
    let $conta = document.createElement("th");
    $conta.textContent = cont;
    $tr.appendChild($conta);
    cont = cont + 1;
    // ID
    let $id = document.createElement("td");
    $id.textContent = element.id + element.indice;
    $tr.appendChild($id);
    // Valor
    let $valor = document.createElement("td");
    $valor.textContent = element.getValorImplicito();
    $tr.appendChild($valor);
    // Entorno
    let $Entorno = document.createElement("td");
    $Entorno.textContent = simbolo.id + simbolo.indice;
    $tr.appendChild($Entorno);

    cuerpo.appendChild($tr);
    MostrarFilasTabla(element, cuerpo);
  });
}

},{"../InterpreteXML/TablaSimbolo/Simbolo":8,"./scriptXML":14}],14:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSimbolTable = exports.ParsearDesc = exports.dot = exports.Graficar = exports.ParsearAsc = void 0;
var Simbolo_1 = require("../InterpreteXML/TablaSimbolo/Simbolo");
var TipoDato_1 = require("../InterpreteXML/TablaSimbolo/TipoDato");
var NodoAST_1 = __importDefault(require("../InterpreteXPath/AST/NodoAST"));
var gramaticaAsc = require("../InterpreteXML/GrammerXML/AscGrammer");
var gramaticaDesc = require("../InterpreteXML/GrammerXML/DescGrammer");
var dot = "";
exports.dot = dot;
var c = 0;
function ParsearAsc(entrada) {
    var objetos = gramaticaAsc.parse(entrada);
    //console.log(objetos);
    return objetos;
}
exports.ParsearAsc = ParsearAsc;
function ParsearDesc(entrada) {
    var objetos = gramaticaDesc.parse(entrada);
    //console.log(objetos);
    return objetos;
}
exports.ParsearDesc = ParsearDesc;
function Graficar(datos) {
    var instr = new NodoAST_1.default("INICIO");
    datos.forEach(function (element) {
        instr.addHijo(element.obtenerNodos()[0]);
    });
    var grafo = "";
    grafo = getDot(instr);
}
exports.Graficar = Graficar;
function getDot(raiz) {
    exports.dot = dot = "";
    exports.dot = dot += "digraph {\n";
    exports.dot = dot += 'n0[label="' + raiz.getValor().replace(/\"/g, "") + '"];\n';
    c = 1;
    recorrerAST("n0", raiz);
    exports.dot = dot += "}";
    return dot;
}
function recorrerAST(padre, nPadre) {
    for (var _i = 0, _a = nPadre.getHijos(); _i < _a.length; _i++) {
        var hijo = _a[_i];
        var nombreHijo = "n" + c;
        exports.dot = dot += nombreHijo + '[label="' + hijo.getValor().replace(/\"/g, "") + '"];\n';
        exports.dot = dot += padre + "->" + nombreHijo + ";\n";
        c++;
        recorrerAST(nombreHijo, hijo);
    }
}
function BuildSimbolTable(listado) {
    var global = new Simbolo_1.Simbolo("Global", TipoDato_1.TipoDato.ARRAY, "", 0, 0);
    var root = new Simbolo_1.Simbolo(listado.identificador, TipoDato_1.TipoDato.ETIQUETA, listado.texto, listado.linea, listado.columna);
    global.entorno.push(root);
    buildGlobal(root, listado);
    return global;
}
exports.BuildSimbolTable = BuildSimbolTable;
function buildGlobal(entorno, padre) {
    if (padre.lista != null) {
        getEtiqueta(entorno, padre.lista, TipoDato_1.TipoDato.ATRIBUTO);
    }
    if (padre.listaObjetos != null) {
        getEtiqueta(entorno, padre.listaObjetos, TipoDato_1.TipoDato.ETIQUETA);
    }
}
function getEtiqueta(entorno, padre, tipo) {
    if (padre.etiqueta != null) {
        if (padre.etiqueta.identificador == "objeto" || padre.etiqueta.identificador == "atributo") {
            getEtiqueta(entorno, padre.etiqueta, tipo);
        }
        else {
            if (tipo == TipoDato_1.TipoDato.ATRIBUTO) {
                getValorAtributo(entorno, padre.etiqueta);
            }
            else {
                getValorObjeto(entorno, padre.etiqueta);
            }
        }
    }
    if (padre.valor != null) {
        if (padre.valor.identificador === "objeto" || padre.valor.identificador === "atributo") {
            getEtiqueta(entorno, padre.valor, tipo);
        }
        else {
            if (tipo == TipoDato_1.TipoDato.ATRIBUTO) {
                getValorAtributo(entorno, padre.valor);
            }
            else {
                getValorObjeto(entorno, padre.valor);
            }
        }
    }
}
function getValorAtributo(entorno, padre) {
    var cont = BuscarRepetido(entorno, padre.identificador);
    var root;
    if (cont > 0) {
        root = new Simbolo_1.Simbolo(padre.identificador, TipoDato_1.TipoDato.ATRIBUTO, padre.valor, padre.fila, padre.columna, cont);
    }
    else {
        root = new Simbolo_1.Simbolo(padre.identificador, TipoDato_1.TipoDato.ATRIBUTO, padre.valor, padre.fila, padre.columna);
    }
    entorno.entorno.push(root);
}
function getValorObjeto(entorno, padre) {
    var cont = BuscarRepetido(entorno, padre.identificador);
    var root;
    if (cont > 0) {
        root = new Simbolo_1.Simbolo(padre.identificador, TipoDato_1.TipoDato.ETIQUETA, padre.texto, padre.fila, padre.columna, cont);
    }
    else {
        root = new Simbolo_1.Simbolo(padre.identificador, TipoDato_1.TipoDato.ETIQUETA, padre.texto, padre.fila, padre.columna);
    }
    entorno.entorno.push(root);
    if (padre.lista != null || padre.listaObjetos != null) {
        buildGlobal(root, padre);
    }
}
function BuscarRepetido(entorno, identi) {
    var id = identi;
    var i = 0;
    var aux = 0;
    for (i; i < entorno.entorno.length; i++) {
        if (id === entorno.entorno[i].id) {
            aux++;
        }
    }
    return aux;
}

},{"../InterpreteXML/GrammerXML/AscGrammer":6,"../InterpreteXML/GrammerXML/DescGrammer":7,"../InterpreteXML/TablaSimbolo/Simbolo":8,"../InterpreteXML/TablaSimbolo/TipoDato":9,"../InterpreteXPath/AST/NodoAST":12}]},{},[13]);
