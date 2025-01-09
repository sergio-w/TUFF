(function (Module) {
  function SendMessage(e, i, n) {
    if (void 0 === n)
      Module.ccall("SendMessage", null, ["string", "string"], [e, i]);
    else if ("string" == typeof n)
      Module.ccall(
        "SendMessageString",
        null,
        ["string", "string", "string"],
        [e, i, n]
      );
    else {
      if ("number" != typeof n)
        throw (
          "" + n + " is does not have a type which is supported by SendMessage."
        );
      Module.ccall(
        "SendMessageFloat",
        null,
        ["string", "string", "number"],
        [e, i, n]
      );
    }
  }
  function staticAlloc(e) {
    assert(!staticSealed);
    var i = STATICTOP;
    return (STATICTOP = (STATICTOP + e + 15) & -16), i;
  }
  function dynamicAlloc(e) {
    var i, n, t;
    return (
      assert(DYNAMICTOP_PTR),
      (i = HEAP32[DYNAMICTOP_PTR >> 2]),
      (n = (i + e + 15) & -16),
      (HEAP32[DYNAMICTOP_PTR >> 2] = n),
      n >= TOTAL_MEMORY && ((t = enlargeMemory()), !t)
        ? ((HEAP32[DYNAMICTOP_PTR >> 2] = i), 0)
        : i
    );
  }
  function alignMemory(e, i) {
    i || (i = STACK_ALIGN);
    var n = (e = Math.ceil(e / i) * i);
    return n;
  }
  function getNativeTypeSize(e) {
    switch (e) {
      case "i1":
      case "i8":
        return 1;
      case "i16":
        return 2;
      case "i32":
        return 4;
      case "i64":
        return 8;
      case "float":
        return 4;
      case "double":
        return 8;
      default:
        if ("*" === e[e.length - 1]) return 4;
        if ("i" === e[0]) {
          var i = parseInt(e.substr(1));
          return assert(i % 8 === 0), i / 8;
        }
        return 0;
    }
  }
  function warnOnce(e) {
    warnOnce.shown || (warnOnce.shown = {}),
      warnOnce.shown[e] || ((warnOnce.shown[e] = 1), Module.printErr(e));
  }
  function addFunction(e) {
    for (var i = 0; i < functionPointers.length; i++)
      if (!functionPointers[i]) return (functionPointers[i] = e), 1 + i;
    throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.";
  }
  function getFuncWrapper(e, i) {
    if (e) {
      assert(i), funcWrappers[i] || (funcWrappers[i] = {});
      var n = funcWrappers[i];
      return (
        n[e] ||
          (1 === i.length
            ? (n[e] = function t() {
                return dynCall(i, e);
              })
            : 2 === i.length
            ? (n[e] = function r(n) {
                return dynCall(i, e, [n]);
              })
            : (n[e] = function _() {
                return dynCall(i, e, Array.prototype.slice.call(arguments));
              })),
        n[e]
      );
    }
  }
  function makeBigInt(e, i, n) {
    return n
      ? +(e >>> 0) + 4294967296 * +(i >>> 0)
      : +(e >>> 0) + 4294967296 * +(0 | i);
  }
  function dynCall(e, i, n) {
    return n && n.length
      ? Module["dynCall_" + e].apply(null, [i].concat(n))
      : Module["dynCall_" + e].call(null, i);
  }
  function assert(e, i) {
    e || abort("Assertion failed: " + i);
  }
  function getCFunc(e) {
    var i = Module["_" + e];
    return (
      assert(
        i,
        "Cannot call unknown function " + e + ", make sure it is exported"
      ),
      i
    );
  }
  function ccall(e, i, n, t, r) {
    var _,
      o,
      l,
      u = getCFunc(e),
      a = [],
      s = 0;
    if (t)
      for (_ = 0; _ < t.length; _++)
        (o = toC[n[_]]),
          o ? (0 === s && (s = stackSave()), (a[_] = o(t[_]))) : (a[_] = t[_]);
    return (
      (l = u.apply(null, a)),
      "string" === i && (l = Pointer_stringify(l)),
      0 !== s && stackRestore(s),
      l
    );
  }
  function cwrap(e, i, n) {
    var t, r, _;
    return (
      (n = n || []),
      (t = getCFunc(e)),
      (r = n.every(function (e) {
        return "number" === e;
      })),
      (_ = "string" !== i),
      _ && r
        ? t
        : function () {
            return ccall(e, i, n, arguments);
          }
    );
  }
  function setValue(e, i, n, t) {
    switch (
      ((n = n || "i8"), "*" === n.charAt(n.length - 1) && (n = "i32"), n)
    ) {
      case "i1":
        HEAP8[e >> 0] = i;
        break;
      case "i8":
        HEAP8[e >> 0] = i;
        break;
      case "i16":
        HEAP16[e >> 1] = i;
        break;
      case "i32":
        HEAP32[e >> 2] = i;
        break;
      case "i64":
        (tempI64 = [
          i >>> 0,
          ((tempDouble = i),
          +Math_abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (0 |
                  Math_min(
                    +Math_floor(tempDouble / 4294967296),
                    4294967295
                  )) >>>
                0
              : ~~+Math_ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
          (HEAP32[e >> 2] = tempI64[0]),
          (HEAP32[(e + 4) >> 2] = tempI64[1]);
        break;
      case "float":
        HEAPF32[e >> 2] = i;
        break;
      case "double":
        HEAPF64[e >> 3] = i;
        break;
      default:
        abort("invalid type for setValue: " + n);
    }
  }
  function allocate(e, i, n, t) {
    var r, _, o, l, u, a, s, c, f, d;
    if (
      ("number" == typeof e ? ((r = !0), (_ = e)) : ((r = !1), (_ = e.length)),
      (o = "string" == typeof i ? i : null),
      (l =
        n == ALLOC_NONE
          ? t
          : [
              "function" == typeof _malloc ? _malloc : staticAlloc,
              stackAlloc,
              staticAlloc,
              dynamicAlloc,
            ][void 0 === n ? ALLOC_STATIC : n](Math.max(_, o ? 1 : i.length))),
      r)
    ) {
      for (t = l, assert(0 == (3 & l)), u = l + (_ & ~3); u > t; t += 4)
        HEAP32[t >> 2] = 0;
      u = l + _;
      while (u > t) HEAP8[t++ >> 0] = 0;
      return l;
    }
    if ("i8" === o)
      return (
        e.subarray || e.slice
          ? HEAPU8.set(e, l)
          : HEAPU8.set(new Uint8Array(e), l),
        l
      );
    a = 0;
    while (_ > a)
      (d = e[a]),
        (s = o || i[a]),
        0 !== s
          ? ("i64" == s && (s = "i32"),
            setValue(l + a, d, s),
            f !== s && ((c = getNativeTypeSize(s)), (f = s)),
            (a += c))
          : a++;
    return l;
  }
  function Pointer_stringify(e, i) {
    var n, t, r, _, o, l;
    if (0 === i || !e) return "";
    (n = 0), (r = 0);
    while (1) {
      if (((t = HEAPU8[(e + r) >> 0]), (n |= t), 0 == t && !i)) break;
      if ((r++, i && r == i)) break;
    }
    if ((i || (i = r), (_ = ""), 128 > n)) {
      o = 1024;
      while (i > 0)
        (l = String.fromCharCode.apply(
          String,
          HEAPU8.subarray(e, e + Math.min(i, o))
        )),
          (_ = _ ? _ + l : l),
          (e += o),
          (i -= o);
      return _;
    }
    return UTF8ToString(e);
  }
  function UTF8ArrayToString(e, i) {
    var n,
      t,
      r,
      _,
      o,
      l,
      u,
      a,
      s = i;
    while (e[s]) ++s;
    if (s - i > 16 && e.subarray && UTF8Decoder)
      return UTF8Decoder.decode(e.subarray(i, s));
    u = "";
    while (1) {
      if (((n = e[i++]), !n)) return u;
      128 & n
        ? ((t = 63 & e[i++]),
          192 != (224 & n)
            ? ((r = 63 & e[i++]),
              224 == (240 & n)
                ? (n = ((15 & n) << 12) | (t << 6) | r)
                : ((_ = 63 & e[i++]),
                  240 == (248 & n)
                    ? (n = ((7 & n) << 18) | (t << 12) | (r << 6) | _)
                    : ((o = 63 & e[i++]),
                      248 == (252 & n)
                        ? (n =
                            ((3 & n) << 24) |
                            (t << 18) |
                            (r << 12) |
                            (_ << 6) |
                            o)
                        : ((l = 63 & e[i++]),
                          (n =
                            ((1 & n) << 30) |
                            (t << 24) |
                            (r << 18) |
                            (_ << 12) |
                            (o << 6) |
                            l)))),
              65536 > n
                ? (u += String.fromCharCode(n))
                : ((a = n - 65536),
                  (u += String.fromCharCode(
                    55296 | (a >> 10),
                    56320 | (1023 & a)
                  ))))
            : (u += String.fromCharCode(((31 & n) << 6) | t)))
        : (u += String.fromCharCode(n));
    }
  }
  function UTF8ToString(e) {
    return UTF8ArrayToString(HEAPU8, e);
  }
  function stringToUTF8Array(e, i, n, t) {
    var r, _, o, l;
    if (!(t > 0)) return 0;
    for (r = n, _ = n + t - 1, o = 0; o < e.length; ++o)
      if (
        ((l = e.charCodeAt(o)),
        l >= 55296 &&
          57343 >= l &&
          (l = (65536 + ((1023 & l) << 10)) | (1023 & e.charCodeAt(++o))),
        127 >= l)
      ) {
        if (n >= _) break;
        i[n++] = l;
      } else if (2047 >= l) {
        if (n + 1 >= _) break;
        (i[n++] = 192 | (l >> 6)), (i[n++] = 128 | (63 & l));
      } else if (65535 >= l) {
        if (n + 2 >= _) break;
        (i[n++] = 224 | (l >> 12)),
          (i[n++] = 128 | ((l >> 6) & 63)),
          (i[n++] = 128 | (63 & l));
      } else if (2097151 >= l) {
        if (n + 3 >= _) break;
        (i[n++] = 240 | (l >> 18)),
          (i[n++] = 128 | ((l >> 12) & 63)),
          (i[n++] = 128 | ((l >> 6) & 63)),
          (i[n++] = 128 | (63 & l));
      } else if (67108863 >= l) {
        if (n + 4 >= _) break;
        (i[n++] = 248 | (l >> 24)),
          (i[n++] = 128 | ((l >> 18) & 63)),
          (i[n++] = 128 | ((l >> 12) & 63)),
          (i[n++] = 128 | ((l >> 6) & 63)),
          (i[n++] = 128 | (63 & l));
      } else {
        if (n + 5 >= _) break;
        (i[n++] = 252 | (l >> 30)),
          (i[n++] = 128 | ((l >> 24) & 63)),
          (i[n++] = 128 | ((l >> 18) & 63)),
          (i[n++] = 128 | ((l >> 12) & 63)),
          (i[n++] = 128 | ((l >> 6) & 63)),
          (i[n++] = 128 | (63 & l));
      }
    return (i[n] = 0), n - r;
  }
  function stringToUTF8(e, i, n) {
    return stringToUTF8Array(e, HEAPU8, i, n);
  }
  function lengthBytesUTF8(e) {
    var i,
      n,
      t = 0;
    for (i = 0; i < e.length; ++i)
      (n = e.charCodeAt(i)),
        n >= 55296 &&
          57343 >= n &&
          (n = (65536 + ((1023 & n) << 10)) | (1023 & e.charCodeAt(++i))),
        127 >= n
          ? ++t
          : (t +=
              2047 >= n
                ? 2
                : 65535 >= n
                ? 3
                : 2097151 >= n
                ? 4
                : 67108863 >= n
                ? 5
                : 6);
    return t;
  }
  function allocateUTF8(e) {
    var i = lengthBytesUTF8(e) + 1,
      n = _malloc(i);
    return n && stringToUTF8Array(e, HEAP8, n, i), n;
  }
  function allocateUTF8OnStack(e) {
    var i = lengthBytesUTF8(e) + 1,
      n = stackAlloc(i);
    return stringToUTF8Array(e, HEAP8, n, i), n;
  }
  function demangle(e) {
    return e;
  }
  function demangleAll(e) {
    var i = /__Z[\w\d_]+/g;
    return e.replace(i, function (e) {
      var i = demangle(e);
      return e === i ? e : e + " [" + i + "]";
    });
  }
  function jsStackTrace() {
    var e = new Error();
    if (!e.stack) {
      try {
        throw new Error(0);
      } catch (i) {
        e = i;
      }
      if (!e.stack) return "(no stack trace available)";
    }
    return e.stack.toString();
  }
  function stackTrace() {
    var e = jsStackTrace();
    return (
      Module["extraStackTrace"] && (e += "\n" + Module["extraStackTrace"]()),
      demangleAll(e)
    );
  }
  function alignUp(e, i) {
    return e % i > 0 && (e += i - (e % i)), e;
  }
  function updateGlobalBuffer(e) {
    Module["buffer"] = buffer = e;
  }
  function updateGlobalBufferViews() {
    (Module["HEAP8"] = HEAP8 = new Int8Array(buffer)),
      (Module["HEAP16"] = HEAP16 = new Int16Array(buffer)),
      (Module["HEAP32"] = HEAP32 = new Int32Array(buffer)),
      (Module["HEAPU8"] = HEAPU8 = new Uint8Array(buffer)),
      (Module["HEAPU16"] = HEAPU16 = new Uint16Array(buffer)),
      (Module["HEAPU32"] = HEAPU32 = new Uint32Array(buffer)),
      (Module["HEAPF32"] = HEAPF32 = new Float32Array(buffer)),
      (Module["HEAPF64"] = HEAPF64 = new Float64Array(buffer));
  }
  function abortOnCannotGrowMemory() {
    abort(
      "Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " +
        TOTAL_MEMORY +
        ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 "
    );
  }
  function enlargeMemory() {
    var e,
      i,
      n = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE,
      t = 2147483648 - n;
    if (HEAP32[DYNAMICTOP_PTR >> 2] > t) return !1;
    (e = TOTAL_MEMORY),
      (TOTAL_MEMORY = Math.max(TOTAL_MEMORY, MIN_TOTAL_MEMORY));
    while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR >> 2])
      TOTAL_MEMORY =
        536870912 >= TOTAL_MEMORY
          ? alignUp(2 * TOTAL_MEMORY, n)
          : Math.min(alignUp((3 * TOTAL_MEMORY + 2147483648) / 4, n), t);
    return (
      (i = Module["reallocBuffer"](TOTAL_MEMORY)),
      i && i.byteLength == TOTAL_MEMORY
        ? (updateGlobalBuffer(i), updateGlobalBufferViews(), !0)
        : ((TOTAL_MEMORY = e), !1)
    );
  }
  function getTotalMemory() {
    return TOTAL_MEMORY;
  }
  function callRuntimeCallbacks(e) {
    var i, n;
    while (e.length > 0)
      (i = e.shift()),
        "function" != typeof i
          ? ((n = i.func),
            "number" == typeof n
              ? void 0 === i.arg
                ? Module["dynCall_v"](n)
                : Module["dynCall_vi"](n, i.arg)
              : n(void 0 === i.arg ? null : i.arg))
          : i();
  }
  function preRun() {
    if (Module["preRun"]) {
      "function" == typeof Module["preRun"] &&
        (Module["preRun"] = [Module["preRun"]]);
      while (Module["preRun"].length) addOnPreRun(Module["preRun"].shift());
    }
    callRuntimeCallbacks(__ATPRERUN__);
  }
  function ensureInitRuntime() {
    runtimeInitialized ||
      ((runtimeInitialized = !0), callRuntimeCallbacks(__ATINIT__));
  }
  function preMain() {
    callRuntimeCallbacks(__ATMAIN__);
  }
  function exitRuntime() {
    callRuntimeCallbacks(__ATEXIT__), (runtimeExited = !0);
  }
  function postRun() {
    if (Module["postRun"]) {
      "function" == typeof Module["postRun"] &&
        (Module["postRun"] = [Module["postRun"]]);
      while (Module["postRun"].length) addOnPostRun(Module["postRun"].shift());
    }
    callRuntimeCallbacks(__ATPOSTRUN__);
  }
  function addOnPreRun(e) {
    __ATPRERUN__.unshift(e);
  }
  function addOnPostRun(e) {
    __ATPOSTRUN__.unshift(e);
  }
  function writeArrayToMemory(e, i) {
    HEAP8.set(e, i);
  }
  function writeAsciiToMemory(e, i, n) {
    for (var t = 0; t < e.length; ++t) HEAP8[i++ >> 0] = e.charCodeAt(t);
    n || (HEAP8[i >> 0] = 0);
  }
  function getUniqueRunDependency(e) {
    return e;
  }
  function addRunDependency(e) {
    runDependencies++,
      Module["monitorRunDependencies"] &&
        Module["monitorRunDependencies"](runDependencies);
  }
  function removeRunDependency(e) {
    if (
      (runDependencies--,
      Module["monitorRunDependencies"] &&
        Module["monitorRunDependencies"](runDependencies),
      0 == runDependencies &&
        (null !== runDependencyWatcher &&
          (clearInterval(runDependencyWatcher), (runDependencyWatcher = null)),
        dependenciesFulfilled))
    ) {
      var i = dependenciesFulfilled;
      (dependenciesFulfilled = null), i();
    }
  }
  function isDataURI(e) {
    return String.prototype.startsWith
      ? e.startsWith(dataURIPrefix)
      : 0 === e.indexOf(dataURIPrefix);
  }
  function integrateWasmJS() {
    function e(e) {
      var i,
        n,
        t = Module["buffer"];
      e.byteLength < t.byteLength &&
        Module["printErr"](
          "the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here"
        ),
        (i = new Int8Array(t)),
        (n = new Int8Array(e)),
        n.set(i),
        updateGlobalBuffer(e),
        updateGlobalBufferViews();
    }
    function i(e) {
      return e;
    }
    function n() {
      try {
        if (Module["wasmBinary"]) return new Uint8Array(Module["wasmBinary"]);
        if (Module["readBinary"]) return Module["readBinary"](f);
        throw "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";
      } catch (e) {
        abort(e);
      }
    }
    function t() {
      return Module["wasmBinary"] ||
        (!ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) ||
        "function" != typeof fetch
        ? new Promise(function (e, i) {
            e(n());
          })
        : fetch(f, { credentials: "same-origin" })
            .then(function (e) {
              if (!e["ok"])
                throw "failed to load wasm binary file at '" + f + "'";
              return e["arrayBuffer"]();
            })
            ["catch"](function () {
              return n();
            });
    }
    function r(i, n, r) {
      function _(i, n) {
        (l = i.exports),
          l.memory && e(l.memory),
          (Module["asm"] = l),
          (Module["usingWasm"] = !0),
          removeRunDependency("wasm-instantiate");
      }
      function u(e) {
        _(e["instance"], e["module"]);
      }
      function a(e) {
        t()
          .then(function (e) {
            return WebAssembly.instantiate(e, o);
          })
          .then(e)
          ["catch"](function (e) {
            Module["printErr"]("failed to asynchronously prepare wasm: " + e),
              abort(e);
          });
      }
      if ("object" != typeof WebAssembly)
        return Module["printErr"]("no native wasm support detected"), !1;
      if (!(Module["wasmMemory"] instanceof WebAssembly.Memory))
        return Module["printErr"]("no native wasm Memory in use"), !1;
      if (
        ((n["memory"] = Module["wasmMemory"]),
        (o["global"] = { NaN: NaN, Infinity: 1 / 0 }),
        (o["global.Math"] = Math),
        (o["env"] = n),
        addRunDependency("wasm-instantiate"),
        Module["instantiateWasm"])
      )
        try {
          return Module["instantiateWasm"](o, _);
        } catch (s) {
          return (
            Module["printErr"](
              "Module.instantiateWasm callback failed with error: " + s
            ),
            !1
          );
        }
      return (
        Module["wasmBinary"] ||
        "function" != typeof WebAssembly.instantiateStreaming ||
        isDataURI(f) ||
        "function" != typeof fetch
          ? a(u)
          : WebAssembly.instantiateStreaming(
              fetch(f, { credentials: "same-origin" }),
              o
            )
              .then(u)
              ["catch"](function (e) {
                Module["printErr"]("wasm streaming compile failed: " + e),
                  Module["printErr"](
                    "falling back to ArrayBuffer instantiation"
                  ),
                  a(u);
              }),
        {}
      );
    }
    var _,
      o,
      l,
      u,
      a,
      s,
      c = "build.wast",
      f = "build.wasm",
      d = "build.temp.asm.js";
    "function" == typeof Module["locateFile"] &&
      (isDataURI(c) || (c = Module["locateFile"](c)),
      isDataURI(f) || (f = Module["locateFile"](f)),
      isDataURI(d) || (d = Module["locateFile"](d))),
      (_ = 64 * 1024),
      (o = {
        global: null,
        env: null,
        asm2wasm: {
          "f64-rem": function (e, i) {
            return e % i;
          },
          debugger: function () {
            debugger;
          },
        },
        parent: Module,
      }),
      (l = null),
      (Module["asmPreload"] = Module["asm"]),
      (u = Module["reallocBuffer"]),
      (a = function (e) {
        var i,
          n,
          t,
          r = Module["usingWasm"] ? WASM_PAGE_SIZE : ASMJS_PAGE_SIZE;
        if (
          ((e = alignUp(e, r)),
          (i = Module["buffer"]),
          (n = i.byteLength),
          Module["usingWasm"])
        )
          try {
            return (
              (t = Module["wasmMemory"].grow((e - n) / _)),
              t !== (0 | -1)
                ? (Module["buffer"] = Module["wasmMemory"].buffer)
                : null
            );
          } catch (o) {
            return null;
          }
      }),
      (Module["reallocBuffer"] = function (e) {
        return "asmjs" === s ? u(e) : a(e);
      }),
      (s = ""),
      (Module["asm"] = function (e, n, t) {
        var _, o, l;
        return (
          (n = i(n)),
          n["table"] ||
            ((_ = Module["wasmTableSize"]),
            void 0 === _ && (_ = 1024),
            (o = Module["wasmMaxTableSize"]),
            "object" == typeof WebAssembly &&
            "function" == typeof WebAssembly.Table
              ? void 0 !== o
                ? (n["table"] = new WebAssembly.Table({
                    initial: _,
                    maximum: o,
                    element: "anyfunc",
                  }))
                : (n["table"] = new WebAssembly.Table({
                    initial: _,
                    element: "anyfunc",
                  }))
              : (n["table"] = new Array(_)),
            (Module["wasmTable"] = n["table"])),
          n["memoryBase"] || (n["memoryBase"] = Module["STATIC_BASE"]),
          n["tableBase"] || (n["tableBase"] = 0),
          (l = r(e, n, t)),
          l ||
            abort(
              "no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods"
            ),
          l
        );
      });
  }
  function _emscripten_asm_const_iii(e, i, n) {
    return ASM_CONSTS[e](i, n);
  }
  function _GetSharedPath() {
    Module["printErr"]("missing function: GetSharedPath"), abort(-1);
  }
  function _IsIPodMusicPlaying() {
    Module["printErr"]("missing function: IsIPodMusicPlaying"), abort(-1);
  }
  function _JS_Cursor_SetImage(e, i) {
    var n,
      t = "";
    for (n = 0; i > n; n++) t += String.fromCharCode(HEAPU8[e + n]);
    Module.canvas.style.cursor =
      "url(data:image/cur;base64," + btoa(t) + "),default";
  }
  function _JS_Cursor_SetShow(e) {
    Module.canvas.style.cursor = e ? "default" : "none";
  }
  function _JS_Eval_ClearTimeout(e) {
    window.clearTimeout(e);
  }
  function _JS_Eval_EvalJS(ptr) {
    var str = Pointer_stringify(ptr);
    try {
      eval(str);
    } catch (exception) {
      console.error(exception);
    }
  }
  function _JS_Eval_OpenURL(e) {
    var i = Pointer_stringify(e);
    console.warn("tried to redirect to url: " + i)
  }
  function _JS_Eval_SetTimeout(e, i, n) {
    function t() {
      getFuncWrapper(e, "vi")(i);
    }
    return (Module["noExitRuntime"] = !0), Browser.safeSetTimeout(t, n);
  }
  function _JS_FileSystem_SetSyncInterval(e) {
    Module.indexedDB &&
      (fs.syncIntervalID = window.setInterval(function () {
        fs.sync(!0);
      }, e));
  }
  function _JS_FileSystem_Sync() {
    Module.indexedDB && fs.sync(!1);
  }
  function _JS_Log_StackTrace(e, i) {
    var n = stackTrace();
    return e && stringToUTF8(n, e, i), lengthBytesUTF8(n);
  }
  function _JS_Sound_Create_Channel(e, i) {
    if (0 != WEBAudio.audioWebEnabled) {
      var n = {
        gain: WEBAudio.audioContext.createGain(),
        panner: WEBAudio.audioContext.createPanner(),
        threeD: !1,
        playBuffer: function (n, t, r) {
          this.source.buffer = t;
          var _ = this;
          (this.source.onended = function () {
            e && dynCall("vi", e, [i]), _.setup();
          }),
            this.source.start(n, r);
        },
        setup: function () {
          (this.source = WEBAudio.audioContext.createBufferSource()),
            this.setupPanning();
        },
        setupPanning: function () {
          this.threeD
            ? (this.source.disconnect(),
              this.source.connect(this.panner),
              this.panner.connect(this.gain))
            : (this.panner.disconnect(), this.source.connect(this.gain));
        },
      };
      return (
        (n.panner.rolloffFactor = 0),
        n.gain.connect(WEBAudio.audioContext.destination),
        n.setup(),
        WEBAudio.audioInstances.push(n) - 1
      );
    }
  }
  function _JS_Sound_GetLength(e) {
    var i, n;
    return 0 == WEBAudio.audioWebEnabled
      ? 0
      : ((i = WEBAudio.audioInstances[e]),
        (n = 44100 / i.buffer.sampleRate),
        i.buffer.length * n);
  }
  function _JS_Sound_GetLoadState(e) {
    if (0 == WEBAudio.audioWebEnabled) return 2;
    var i = WEBAudio.audioInstances[e];
    return i.error ? 2 : i.buffer ? 0 : 1;
  }
  function _JS_Sound_Init() {
    var e, i;
    try {
      (window.AudioContext = window.AudioContext || window.webkitAudioContext),
        (WEBAudio.audioContext = new AudioContext()),
        (e = function () {
          "suspended" === WEBAudio.audioContext.state
            ? WEBAudio.audioContext.resume()
            : clearInterval(i);
        }),
        (i = setInterval(e, 400)),
        (WEBAudio.audioWebEnabled = 1);
    } catch (n) {
      alert("Web Audio API is not supported in this browser");
    }
  }
  function _JS_Sound_Load(e, i) {
    var n, t;
    return 0 == WEBAudio.audioWebEnabled
      ? 0
      : ((n = { buffer: null, error: !1 }),
        (t = WEBAudio.audioInstances.push(n) - 1),
        WEBAudio.audioContext.decodeAudioData(
          HEAPU8.buffer.slice(e, e + i),
          function (e) {
            n.buffer = e;
          },
          function () {
            (n.error = !0), console.log("Decode error.");
          }
        ),
        t);
  }
  function _JS_Sound_Load_PCM(e, i, n, t) {
    var r, _, o, l, u, a;
    if (0 == WEBAudio.audioWebEnabled) return 0;
    for (
      r = { buffer: WEBAudio.audioContext.createBuffer(e, i, n), error: !1 },
        _ = 0;
      e > _;
      _++
    )
      (o = (t >> 2) + i * _),
        (l = r.buffer),
        (u =
          l["copyToChannel"] ||
          function (e, i, n) {
            var t = e.subarray(0, Math.min(e.length, this.length - (0 | n)));
            this.getChannelData(0 | i).set(t, 0 | n);
          }),
        u.apply(l, [HEAPF32.subarray(o, o + i), _, 0]);
    return (a = WEBAudio.audioInstances.push(r) - 1), a;
  }
  function _JS_Sound_Play(e, i, n, t) {
    var r, _;
    if ((_JS_Sound_Stop(i, 0), 0 != WEBAudio.audioWebEnabled))
      if (
        ((r = WEBAudio.audioInstances[e]),
        (_ = WEBAudio.audioInstances[i]),
        r.buffer)
      )
        try {
          _.playBuffer(WEBAudio.audioContext.currentTime + t, r.buffer, n);
        } catch (o) {
          console.error("playBuffer error. Exception: " + o);
        }
      else console.log("Trying to play sound which is not loaded.");
  }
  function _JS_Sound_ReleaseInstance(e) {
    WEBAudio.audioInstances[e] = null;
  }
  function _JS_Sound_Set3D(e, i) {
    var n = WEBAudio.audioInstances[e];
    n.threeD != i && ((n.threeD = i), n.setupPanning());
  }
  function _JS_Sound_SetListenerOrientation(e, i, n, t, r, _) {
    0 != WEBAudio.audioWebEnabled &&
      (WEBAudio.audioContext.listener.forwardX
        ? (WEBAudio.audioContext.listener.forwardX.setValueAtTime(
            -e,
            WEBAudio.audioContext.currentTime
          ),
          WEBAudio.audioContext.listener.forwardY.setValueAtTime(
            -i,
            WEBAudio.audioContext.currentTime
          ),
          WEBAudio.audioContext.listener.forwardZ.setValueAtTime(
            -n,
            WEBAudio.audioContext.currentTime
          ),
          WEBAudio.audioContext.listener.upX.setValueAtTime(
            t,
            WEBAudio.audioContext.currentTime
          ),
          WEBAudio.audioContext.listener.upY.setValueAtTime(
            r,
            WEBAudio.audioContext.currentTime
          ),
          WEBAudio.audioContext.listener.upZ.setValueAtTime(
            _,
            WEBAudio.audioContext.currentTime
          ))
        : WEBAudio.audioContext.listener.setOrientation(-e, -i, -n, t, r, _));
  }
  function _JS_Sound_SetListenerPosition(e, i, n) {
    0 != WEBAudio.audioWebEnabled &&
      (WEBAudio.audioContext.listener.positionX
        ? (WEBAudio.audioContext.listener.positionX.setValueAtTime(
            e,
            WEBAudio.audioContext.currentTime
          ),
          WEBAudio.audioContext.listener.positionY.setValueAtTime(
            i,
            WEBAudio.audioContext.currentTime
          ),
          WEBAudio.audioContext.listener.positionZ.setValueAtTime(
            n,
            WEBAudio.audioContext.currentTime
          ))
        : WEBAudio.audioContext.listener.setPosition(e, i, n));
  }
  function _JS_Sound_SetLoop(e, i) {
    0 != WEBAudio.audioWebEnabled &&
      (WEBAudio.audioInstances[e].source.loop = i);
  }
  function _JS_Sound_SetLoopPoints(e, i, n) {
    if (0 != WEBAudio.audioWebEnabled) {
      var t = WEBAudio.audioInstances[e];
      (t.source.loopStart = i), (t.source.loopEnd = n);
    }
  }
  function _JS_Sound_SetPitch(e, i) {
    0 != WEBAudio.audioWebEnabled &&
      WEBAudio.audioInstances[e].source.playbackRate.setValueAtTime(
        i,
        WEBAudio.audioContext.currentTime
      );
  }
  function _JS_Sound_SetPosition(e, i, n, t) {
    0 != WEBAudio.audioWebEnabled &&
      WEBAudio.audioInstances[e].panner.setPosition(i, n, t);
  }
  function _JS_Sound_SetVolume(e, i) {
    0 != WEBAudio.audioWebEnabled &&
      WEBAudio.audioInstances[e].gain.gain.setValueAtTime(
        i,
        WEBAudio.audioContext.currentTime
      );
  }
  function _JS_Sound_Stop(e, i) {
    if (0 != WEBAudio.audioWebEnabled) {
      var n = WEBAudio.audioInstances[e];
      if (n.source.buffer) {
        try {
          n.source.stop(WEBAudio.audioContext.currentTime + i);
        } catch (t) {
          n.source.disconnect();
        }
        0 == i && ((n.source.onended = function () {}), n.setup());
      }
    }
  }
  function _JS_SystemInfo_GetBrowserName(e, i) {
    var n = UnityLoader.SystemInfo.browser;
    return e && stringToUTF8(n, e, i), lengthBytesUTF8(n);
  }
  function _JS_SystemInfo_GetBrowserVersionString(e, i) {
    var n = UnityLoader.SystemInfo.browserVersion;
    return e && stringToUTF8(n, e, i), lengthBytesUTF8(n);
  }
  function _JS_SystemInfo_GetCurrentCanvasHeight() {
    return Module["canvas"].clientHeight;
  }
  function _JS_SystemInfo_GetCurrentCanvasWidth() {
    return Module["canvas"].clientWidth;
  }
  function _JS_SystemInfo_GetDocumentURL(e, i) {
    return e && stringToUTF8(document.URL, e, i), lengthBytesUTF8(document.URL);
  }
  function _JS_SystemInfo_GetGPUInfo(e, i) {
    var n = UnityLoader.SystemInfo.gpu;
    return e && stringToUTF8(n, e, i), lengthBytesUTF8(n);
  }
  function _JS_SystemInfo_GetHeight() {
    return UnityLoader.SystemInfo.height;
  }
  function _JS_SystemInfo_GetLanguage(e, i) {
    var n = UnityLoader.SystemInfo.language;
    return e && stringToUTF8(n, e, i), lengthBytesUTF8(n);
  }
  function _JS_SystemInfo_GetMemory() {
    return TOTAL_MEMORY / (1024 * 1024);
  }
  function _JS_SystemInfo_GetOS(e, i) {
    var n = UnityLoader.SystemInfo.os + " " + UnityLoader.SystemInfo.osVersion;
    return e && stringToUTF8(n, e, i), lengthBytesUTF8(n);
  }
  function _JS_SystemInfo_GetStreamingAssetsURL(e, i) {
    var n = Module.streamingAssetsUrl();
    return e && stringToUTF8(n, e, i), lengthBytesUTF8(n);
  }
  function _JS_SystemInfo_GetWidth() {
    return UnityLoader.SystemInfo.width;
  }
  function _JS_SystemInfo_HasCursorLock() {
    return UnityLoader.SystemInfo.hasCursorLock;
  }
  function _JS_SystemInfo_HasFullscreen() {
    return UnityLoader.SystemInfo.hasFullscreen;
  }
  function _JS_SystemInfo_HasWebGL() {
    return UnityLoader.SystemInfo.hasWebGL;
  }
  function _JS_SystemInfo_IsMobile() {
    return UnityLoader.SystemInfo.mobile;
  }
  function _JS_WebGL_InitContextAttributes(e) {
    return (
      (HEAP32[e >> 2] = 1),
      (HEAP32[(e + 4) >> 2] = 1),
      (HEAP32[(e + 8) >> 2] = 1),
      (HEAP32[(e + 12) >> 2] = 0),
      (HEAP32[(e + 16) >> 2] =
        Module.webglContextAttributes.premultipliedAlpha),
      (HEAP32[(e + 20) >> 2] =
        Module.webglContextAttributes.preserveDrawingBuffer),
      (HEAP32[(e + 24) >> 2] = 0),
      (HEAP32[(e + 28) >> 2] = 0),
      (HEAP32[(e + 32) >> 2] = 1),
      (HEAP32[(e + 36) >> 2] = 0),
      (HEAP32[(e + 40) >> 2] = 1),
      (HEAP32[(e + 44) >> 2] = 0),
      0
    );
  }
  function _JS_WebRequest_Abort(e) {
    wr.requestInstances[e].abort();
  }
  function _JS_WebRequest_Create(e, i) {
    try {
      var method = Pointer_stringify(i);
      var old_url = Pointer_stringify(e);
      var url = old_url.replace('https://game-cdn.poki.com/','') 
      console.warn("Creating WebRequest with URL:", url, "and Method:", method);
      var xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.responseType = "arraybuffer";
      wr.requestInstances[wr.nextRequestId] = xhr;
      return wr.nextRequestId++;
    } catch (err) {
      console.error("Error creating WebRequest:", err);
    }
  }
  function _JS_WebRequest_GetResponseHeaders(e, i, n) {
    var t = wr.requestInstances[e].getAllResponseHeaders();
    return i && stringToUTF8(t, i, n), lengthBytesUTF8(t);
  }
  function _JS_WebRequest_Release(e) {
    var i = wr.requestInstances[e];
    (i.onload = null),
      (i.onerror = null),
      (i.ontimeout = null),
      (i.onabort = null),
      delete i,
      (wr.requestInstances[e] = null);
  }
  function _JS_WebRequest_Send(e, i, n) {
    var t = wr.requestInstances[e];
    try {
      console.warn("Sending WebRequest Instance:", e);
      
      if (n > 0) {
        const byteData = HEAPU8.subarray(i, i + n);
        const decodedData = new TextDecoder().decode(byteData);
        console.warn("Decoded Data Sent:", decodedData);
        t.send(byteData);
      } else {
        console.warn("Sending WebRequest with no data.");
        t.send();
      }

      console.warn("Request URL (if accessible):", t.responseURL || t._url);
    } catch (r) {
      console.error(r.name + ": " + r.message);
    }
  }
  
  function _JS_WebRequest_SetProgressHandler(e, i, n) {
    var t = wr.requestInstances[e];
    t.onprogress = function r(e) {
      n && e.lengthComputable && dynCall("viii", n, [i, e.loaded, e.total]);
    };
  }
  function _JS_WebRequest_SetRequestHeader(e, i, n) {
    try {
      var headerName = Pointer_stringify(i);
      var headerValue = Pointer_stringify(n);
      console.warn(`Setting Request Header: ${headerName} = ${headerValue}`);
      wr.requestInstances[e].setRequestHeader(headerName, headerValue);
    } catch (err) {
      console.error("Error setting request header:", err);
    }
  }
  function _JS_WebRequest_SetResponseHandler(e, i, n) {
    function t(e, t) {
      var _, o;
      n &&
        ((_ = lengthBytesUTF8(e) + 1),
        (o = _malloc(_)),
        stringToUTF8(e, o, _),
        dynCall("viiiiii", n, [i, r.status, 0, 0, o, t]),
        _free(o));
    }
    var r = wr.requestInstances[e];
    (r.onload = function _(e) {
      var t, _, o;
      n &&
        ((t = 0),
        (_ = new Uint8Array(r.response)),
        0 != _.length
          ? ((o = _malloc(_.length)),
            HEAPU8.set(_, o),
            dynCall("viiiiii", n, [i, r.status, o, _.length, 0, t]))
          : dynCall("viiiiii", n, [i, r.status, 0, 0, 0, t]));
    }),
      (r.onerror = function o(e) {
        var i = 2;
        t("Unknown error.", i);
      }),
      (r.ontimeout = function l(e) {
        var i = 14;
        t("Connection timed out.", i);
      }),
      (r.onabort = function u(e) {
        var i = 17;
        t("Aborted.", i);
      });
  }
  function _JS_WebRequest_SetTimeout(e, i) {
    wr.requestInstances[e].timeout = i;
  }
  function _RegisterUnityIPodCallbackListener() {
    Module["printErr"]("missing function: RegisterUnityIPodCallbackListener"),
      abort(-1);
  }
  function ___setErrNo(e) {
    return (
      Module["___errno_location"] &&
        (HEAP32[Module["___errno_location"]() >> 2] = e),
      e
    );
  }
  function _emscripten_set_main_loop_timing(e, i) {
    function n(e) {
      (e.data === r || e.data.target === r) &&
        (e.stopPropagation(), t.shift()());
    }
    var t, r;
    return (
      (Browser.mainLoop.timingMode = e),
      (Browser.mainLoop.timingValue = i),
      Browser.mainLoop.func
        ? (0 == e
            ? ((Browser.mainLoop.scheduler = function _() {
                var e =
                  0 |
                  Math.max(
                    0,
                    Browser.mainLoop.tickStartTime + i - _emscripten_get_now()
                  );
                setTimeout(Browser.mainLoop.runner, e);
              }),
              (Browser.mainLoop.method = "timeout"))
            : 1 == e
            ? ((Browser.mainLoop.scheduler = function o() {
                Browser.requestAnimationFrame(Browser.mainLoop.runner);
              }),
              (Browser.mainLoop.method = "rAF"))
            : 2 == e &&
              ("undefined" == typeof setImmediate &&
                ((t = []),
                (r = "setimmediate"),
                addEventListener("message", n, !0),
                (setImmediate = function l(e) {
                  t.push(e),
                    ENVIRONMENT_IS_WORKER
                      ? (void 0 === Module["setImmediates"] &&
                          (Module["setImmediates"] = []),
                        Module["setImmediates"].push(e),
                        postMessage({ target: r }))
                      : postMessage(r, "*");
                })),
              (Browser.mainLoop.scheduler = function u() {
                setImmediate(Browser.mainLoop.runner);
              }),
              (Browser.mainLoop.method = "immediate")),
          0)
        : 1
    );
  }
  function _emscripten_get_now() {
    abort();
  }
  function _emscripten_set_main_loop(e, i, n, t, r) {
    var _, o;
    if (
      ((Module["noExitRuntime"] = !0),
      assert(
        !Browser.mainLoop.func,
        "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
      ),
      (Browser.mainLoop.func = e),
      (Browser.mainLoop.arg = t),
      (_ =
        "undefined" != typeof t
          ? function () {
              Module["dynCall_vi"](e, t);
            }
          : function () {
              Module["dynCall_v"](e);
            }),
      (o = Browser.mainLoop.currentlyRunningMainloop),
      (Browser.mainLoop.runner = function l() {
        var e, i, n, t;
        if (!ABORT) {
          if (Browser.mainLoop.queue.length > 0) {
            if (
              ((e = Date.now()),
              (i = Browser.mainLoop.queue.shift()),
              i.func(i.arg),
              Browser.mainLoop.remainingBlockers &&
                ((n = Browser.mainLoop.remainingBlockers),
                (t = n % 1 == 0 ? n - 1 : Math.floor(n)),
                i.counted
                  ? (Browser.mainLoop.remainingBlockers = t)
                  : ((t += 0.5),
                    (Browser.mainLoop.remainingBlockers = (8 * n + t) / 9))),
              console.log(
                'main loop blocker "' +
                  i.name +
                  '" took ' +
                  (Date.now() - e) +
                  " ms"
              ),
              Browser.mainLoop.updateStatus(),
              o < Browser.mainLoop.currentlyRunningMainloop)
            )
              return;
            return setTimeout(Browser.mainLoop.runner, 0), void 0;
          }
          if (!(o < Browser.mainLoop.currentlyRunningMainloop)) {
            if (
              ((Browser.mainLoop.currentFrameNumber =
                (Browser.mainLoop.currentFrameNumber + 1) | 0),
              1 == Browser.mainLoop.timingMode &&
                Browser.mainLoop.timingValue > 1 &&
                Browser.mainLoop.currentFrameNumber %
                  Browser.mainLoop.timingValue !=
                  0)
            )
              return Browser.mainLoop.scheduler(), void 0;
            0 == Browser.mainLoop.timingMode &&
              (Browser.mainLoop.tickStartTime = _emscripten_get_now()),
              "timeout" === Browser.mainLoop.method &&
                Module.ctx &&
                (Module.printErr(
                  "Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!"
                ),
                (Browser.mainLoop.method = "")),
              Browser.mainLoop.runIter(_),
              o < Browser.mainLoop.currentlyRunningMainloop ||
                ("object" == typeof SDL &&
                  SDL.audio &&
                  SDL.audio.queueNewAudioData &&
                  SDL.audio.queueNewAudioData(),
                Browser.mainLoop.scheduler());
          }
        }
      }),
      r ||
        (i && i > 0
          ? _emscripten_set_main_loop_timing(0, 1e3 / i)
          : _emscripten_set_main_loop_timing(1, 1),
        Browser.mainLoop.scheduler()),
      n)
    )
      throw "SimulateInfiniteLoop";
  }
  function ___buildEnvironment(e) {
    var i,
      n,
      t,
      r,
      _,
      o,
      l,
      u,
      a = 64,
      s = 1024;
    ___buildEnvironment.called
      ? ((n = HEAP32[_environ >> 2]), (i = HEAP32[n >> 2]))
      : ((___buildEnvironment.called = !0),
        (ENV["USER"] = ENV["LOGNAME"] = "web_user"),
        (ENV["PATH"] = "/"),
        (ENV["PWD"] = "/"),
        (ENV["HOME"] = "/home/web_user"),
        (ENV["LANG"] = "C.UTF-8"),
        (ENV["_"] = Module["thisProgram"]),
        (i = staticAlloc(s)),
        (n = staticAlloc(4 * a)),
        (HEAP32[n >> 2] = i),
        (HEAP32[_environ >> 2] = n)),
      (t = []),
      (r = 0);
    for (_ in e)
      "string" == typeof e[_] &&
        ((o = _ + "=" + e[_]), t.push(o), (r += o.length));
    if (r > s) throw new Error("Environment size exceeded TOTAL_ENV_SIZE!");
    for (l = 4, u = 0; u < t.length; u++)
      (o = t[u]),
        writeAsciiToMemory(o, i),
        (HEAP32[(n + u * l) >> 2] = i),
        (i += o.length + 1);
    HEAP32[(n + t.length * l) >> 2] = 0;
  }
  function _getenv(e) {
    return 0 === e
      ? 0
      : ((e = Pointer_stringify(e)),
        ENV.hasOwnProperty(e)
          ? (_getenv.ret && _free(_getenv.ret),
            (_getenv.ret = allocateUTF8(ENV[e])),
            _getenv.ret)
          : 0);
  }
  function _putenv(e) {
    var i, n, t;
    return 0 === e
      ? (___setErrNo(ERRNO_CODES.EINVAL), -1)
      : ((e = Pointer_stringify(e)),
        (i = e.indexOf("=")),
        "" === e || e.indexOf("=") === -1
          ? (___setErrNo(ERRNO_CODES.EINVAL), -1)
          : ((n = e.slice(0, i)),
            (t = e.slice(i + 1)),
            (n in ENV && ENV[n] === t) ||
              ((ENV[n] = t), ___buildEnvironment(ENV)),
            0));
  }
  function _SDL_RWFromConstMem(e, i) {
    var n = SDL.rwops.length;
    return SDL.rwops.push({ bytes: e, count: i }), n;
  }
  function _TTF_FontHeight(e) {
    var i = SDL.fonts[e];
    return i.size;
  }
  function _TTF_SizeText(e, i, n, t) {
    var r = SDL.fonts[e];
    return (
      n && (HEAP32[n >> 2] = SDL.estimateTextWidth(r, Pointer_stringify(i))),
      t && (HEAP32[t >> 2] = r.size),
      0
    );
  }
  function _TTF_RenderText_Solid(e, i, n) {
    var t, r, _, o, l, u;
    return (
      (i = Pointer_stringify(i) || " "),
      (t = SDL.fonts[e]),
      (r = SDL.estimateTextWidth(t, i)),
      (_ = t.size),
      (n = SDL.loadColorToCSSRGB(n)),
      (o = SDL.makeFontString(_, t.name)),
      (l = SDL.makeSurface(r, _, 0, !1, "text:" + i)),
      (u = SDL.surfaces[l]),
      u.ctx.save(),
      (u.ctx.fillStyle = n),
      (u.ctx.font = o),
      (u.ctx.textBaseline = "bottom"),
      u.ctx.fillText(i, 0, 0 | _),
      u.ctx.restore(),
      l
    );
  }
  function _Mix_HaltMusic() {
    var e = SDL.music.audio;
    return (
      e && ((e.src = e.src), (e.currentPosition = 0), e.pause()),
      (SDL.music.audio = null),
      SDL.hookMusicFinished && Module["dynCall_v"](SDL.hookMusicFinished),
      0
    );
  }
  function _Mix_PlayMusic(e, i) {
    var n, t;
    return (
      SDL.music.audio &&
        (SDL.music.audio.paused ||
          Module.printErr("Music is already playing. " + SDL.music.source),
        SDL.music.audio.pause()),
      (n = SDL.audios[e]),
      n.webAudio
        ? ((t = {}),
          (t.resource = n),
          (t.paused = !1),
          (t.currentPosition = 0),
          (t.play = function () {
            SDL.playWebAudio(this);
          }),
          (t.pause = function () {
            SDL.pauseWebAudio(this);
          }))
        : n.audio && (t = n.audio),
      (t["onended"] = function () {
        SDL.music.audio == this && _Mix_HaltMusic();
      }),
      (t.loop = 0 != i),
      (t.volume = SDL.music.volume),
      (SDL.music.audio = t),
      t.play(),
      0
    );
  }
  function _Mix_FreeChunk(e) {
    SDL.audios[e] = null;
  }
  function _Mix_LoadWAV_RW(e, i) {
    function n(e) {
      (_.decodedBuffer = e),
        _.onDecodeComplete.forEach(function (e) {
          e();
        }),
        (_.onDecodeComplete = void 0);
    }
    var t,
      r,
      _,
      o,
      l,
      u,
      a,
      s,
      c,
      f,
      d = SDL.rwops[e];
    if (void 0 === d) return 0;
    if (((t = ""), void 0 !== d.filename)) {
      if (
        ((t = PATH.resolve(d.filename)), (l = Module["preloadedAudios"][t]), !l)
      ) {
        null === l &&
          Module.printErr(
            "Trying to reuse preloaded audio, but freePreloadedMediaOnUse is set!"
          ),
          Module.noAudioDecoding ||
            warnOnce("Cannot find preloaded audio " + t);
        try {
          o = FS.readFile(t);
        } catch (p) {
          return Module.printErr("Couldn't find file for: " + t), 0;
        }
      }
      Module["freePreloadedMediaOnUse"] &&
        (Module["preloadedAudios"][t] = null),
        (r = l);
    } else {
      if (void 0 === d.bytes) return 0;
      o = SDL.webAudioAvailable()
        ? HEAPU8.buffer.slice(d.bytes, d.bytes + d.count)
        : HEAPU8.subarray(d.bytes, d.bytes + d.count);
    }
    return (
      (u = o ? o.buffer || o : o),
      (a =
        void 0 === Module["SDL_canPlayWithWebAudio"] ||
        Module["SDL_canPlayWithWebAudio"](t, u)),
      void 0 !== o && SDL.webAudioAvailable() && a
        ? ((r = void 0),
          (_ = {}),
          (_.onDecodeComplete = []),
          SDL.audioContext["decodeAudioData"](u, n))
        : void 0 === r &&
          o &&
          ((s = new Blob([o], { type: d.mimetype })),
          (c = URL.createObjectURL(s)),
          (r = new Audio()),
          (r.src = c),
          (r.mozAudioChannelType = "content")),
      (f = SDL.audios.length),
      SDL.audios.push({ source: t, audio: r, webAudio: _ }),
      f
    );
  }
  function _Mix_PlayChannel(e, i, n) {
    var t,
      r,
      _,
      o = SDL.audios[i];
    if (!o) return -1;
    if (!o.audio && !o.webAudio) return -1;
    if (e == -1) {
      for (t = SDL.channelMinimumNumber; t < SDL.numChannels; t++)
        if (!SDL.channels[t].audio) {
          e = t;
          break;
        }
      if (e == -1)
        return (
          Module.printErr("All " + SDL.numChannels + " channels in use!"), -1
        );
    }
    return (
      (r = SDL.channels[e]),
      o.webAudio
        ? ((_ = {}),
          (_.resource = o),
          (_.paused = !1),
          (_.currentPosition = 0),
          (_.play = function () {
            SDL.playWebAudio(this);
          }),
          (_.pause = function () {
            SDL.pauseWebAudio(this);
          }))
        : ((_ = o.audio.cloneNode(!0)),
          (_.numChannels = o.audio.numChannels),
          (_.frequency = o.audio.frequency)),
      (_["onended"] = function l() {
        r.audio == this && ((r.audio.paused = !0), (r.audio = null)),
          SDL.channelFinished && getFuncWrapper(SDL.channelFinished, "vi")(e);
      }),
      (r.audio = _),
      (_.loop = 0 != n),
      (_.volume = r.volume),
      _.play(),
      e
    );
  }
  function _SDL_PauseAudio(e) {
    SDL.audio &&
      (e
        ? void 0 !== SDL.audio.timer &&
          (clearTimeout(SDL.audio.timer),
          (SDL.audio.numAudioTimersPending = 0),
          (SDL.audio.timer = void 0))
        : SDL.audio.timer ||
          ((SDL.audio.numAudioTimersPending = 1),
          (SDL.audio.timer = Browser.safeSetTimeout(SDL.audio.caller, 1))),
      (SDL.audio.paused = e));
  }
  function _SDL_CloseAudio() {
    SDL.audio &&
      (_SDL_PauseAudio(1),
      _free(SDL.audio.buffer),
      (SDL.audio = null),
      SDL.allocateChannels(0));
  }
  function _SDL_LockSurface(e) {
    var i,
      n,
      t,
      r = SDL.surfaces[e];
    if ((r.locked++, r.locked > 1)) return 0;
    if (
      (r.buffer ||
        ((r.buffer = _malloc(r.width * r.height * 4)),
        (HEAP32[(e + 20) >> 2] = r.buffer)),
      (HEAP32[(e + 20) >> 2] = r.buffer),
      e == SDL.screen && Module.screenIsReadOnly && r.image)
    )
      return 0;
    if (SDL.defaults.discardOnLock) {
      if (
        (r.image || (r.image = r.ctx.createImageData(r.width, r.height)),
        !SDL.defaults.opaqueFrontBuffer)
      )
        return;
    } else r.image = r.ctx.getImageData(0, 0, r.width, r.height);
    if (e == SDL.screen && SDL.defaults.opaqueFrontBuffer)
      for (i = r.image.data, n = i.length, t = 0; n / 4 > t; t++)
        i[4 * t + 3] = 255;
    if (SDL.defaults.copyOnLock && !SDL.defaults.discardOnLock) {
      if (r.isFlagSet(2097152))
        throw (
          "CopyOnLock is not supported for SDL_LockSurface with SDL_HWPALETTE flag set" +
          new Error().stack
        );
      HEAPU8.set(r.image.data, r.buffer);
    }
    return 0;
  }
  function _SDL_FreeRW(e) {
    SDL.rwops[e] = null;
    while (SDL.rwops.length > 0 && null === SDL.rwops[SDL.rwops.length - 1])
      SDL.rwops.pop();
  }
  function _IMG_Load_RW(e, i) {
    var n, t, r, _, o, l, u, a, s, c, f, d, p, m, y;
    try {
      if (
        ((n = function () {
          t && i && _SDL_FreeRW(e);
        }),
        (t = SDL.rwops[e]),
        void 0 === t)
      )
        return 0;
      if (((r = t.filename), void 0 === r))
        return (
          warnOnce(
            "Only file names that have been preloaded are supported for IMG_Load_RW. Consider using STB_IMAGE=1 if you want synchronous image decoding (see settings.js), or package files with --use-preload-plugins"
          ),
          0
        );
      if (!_) {
        if (((r = PATH.resolve(r)), (_ = Module["preloadedImages"][r]), !_))
          return (
            null === _ &&
              Module.printErr(
                "Trying to reuse preloaded image, but freePreloadedMediaOnUse is set!"
              ),
            warnOnce("Cannot find preloaded image " + r),
            warnOnce(
              "Cannot find preloaded image " +
                r +
                ". Consider using STB_IMAGE=1 if you want synchronous image decoding (see settings.js), or package files with --use-preload-plugins"
            ),
            0
          );
        Module["freePreloadedMediaOnUse"] &&
          (Module["preloadedImages"][r] = null);
      }
      if (
        ((o = SDL.makeSurface(_.width, _.height, 0, !1, "load:" + r)),
        (l = SDL.surfaces[o]),
        (l.ctx.globalCompositeOperation = "copy"),
        _.rawData)
      ) {
        if (((u = l.ctx.getImageData(0, 0, l.width, l.height)), 4 == _.bpp))
          u.data.set(HEAPU8.subarray(_.data, _.data + _.size));
        else if (3 == _.bpp)
          for (a = _.size / 3, s = u.data, c = _.data, f = 0, d = 0; a > d; d++)
            (s[f++] = HEAPU8[c++ >> 0]),
              (s[f++] = HEAPU8[c++ >> 0]),
              (s[f++] = HEAPU8[c++ >> 0]),
              (s[f++] = 255);
        else if (2 == _.bpp)
          for (a = _.size, s = u.data, c = _.data, f = 0, d = 0; a > d; d++)
            (p = HEAPU8[c++ >> 0]),
              (m = HEAPU8[c++ >> 0]),
              (s[f++] = p),
              (s[f++] = p),
              (s[f++] = p),
              (s[f++] = m);
        else {
          if (1 != _.bpp)
            return Module.printErr("cannot handle bpp " + _.bpp), 0;
          for (a = _.size, s = u.data, c = _.data, f = 0, d = 0; a > d; d++)
            (y = HEAPU8[c++ >> 0]),
              (s[f++] = y),
              (s[f++] = y),
              (s[f++] = y),
              (s[f++] = 255);
        }
        l.ctx.putImageData(u, 0, 0);
      } else
        l.ctx.drawImage(_, 0, 0, _.width, _.height, 0, 0, _.width, _.height);
      return (
        (l.ctx.globalCompositeOperation = "source-over"),
        _SDL_LockSurface(o),
        l.locked--,
        SDL.GL && (l.canvas = l.ctx = null),
        o
      );
    } finally {
      n();
    }
  }
  function _SDL_RWFromFile(e, i) {
    var n = SDL.rwops.length,
      t = Pointer_stringify(e);
    return SDL.rwops.push({ filename: t, mimetype: Browser.getMimetype(t) }), n;
  }
  function _IMG_Load(e) {
    var i = _SDL_RWFromFile(e),
      n = _IMG_Load_RW(i, 1);
    return n;
  }
  function _SDL_UpperBlitScaled(e, i, n, t) {
    return SDL.blitSurface(e, i, n, t, !0);
  }
  function _SDL_UpperBlit(e, i, n, t) {
    return SDL.blitSurface(e, i, n, t, !1);
  }
  function _SDL_GetTicks() {
    return (Date.now() - SDL.startTime) | 0;
  }
  function _SDL_GL_SwapBuffers() {
    Browser.doSwapBuffers && Browser.doSwapBuffers();
  }
  function ___cxa_allocate_exception(e) {
    return _malloc(e);
  }
  function __ZSt18uncaught_exceptionv() {
    return !!__ZSt18uncaught_exceptionv.uncaught_exception;
  }
  function ___cxa_begin_catch(e) {
    var i = EXCEPTIONS.infos[e];
    return (
      i &&
        !i.caught &&
        ((i.caught = !0), __ZSt18uncaught_exceptionv.uncaught_exception--),
      i && (i.rethrown = !1),
      EXCEPTIONS.caught.push(e),
      EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(e)),
      e
    );
  }
  function ___cxa_free_exception(e) {
    try {
      return _free(e);
    } catch (i) {}
  }
  function ___cxa_end_catch() {
    Module["setThrew"](0);
    var e = EXCEPTIONS.caught.pop();
    e && (EXCEPTIONS.decRef(EXCEPTIONS.deAdjust(e)), (EXCEPTIONS.last = 0));
  }
  function ___cxa_find_matching_catch_2() {
    return ___cxa_find_matching_catch.apply(null, arguments);
  }
  function ___cxa_find_matching_catch_3() {
    return ___cxa_find_matching_catch.apply(null, arguments);
  }
  function ___cxa_find_matching_catch_4() {
    return ___cxa_find_matching_catch.apply(null, arguments);
  }
  function ___cxa_pure_virtual() {
    throw ((ABORT = !0), "Pure virtual function called!");
  }
  function ___cxa_rethrow() {
    var e = EXCEPTIONS.caught.pop();
    throw (
      (EXCEPTIONS.infos[e].rethrown ||
        (EXCEPTIONS.caught.push(e), (EXCEPTIONS.infos[e].rethrown = !0)),
      (EXCEPTIONS.last = e),
      e)
    );
  }
  function ___resumeException(e) {
    throw (EXCEPTIONS.last || (EXCEPTIONS.last = e), e);
  }
  function ___cxa_find_matching_catch() {
    var e,
      i,
      n,
      t,
      r,
      _ = EXCEPTIONS.last;
    if (!_) return 0 | (setTempRet0(0), 0);
    if (((e = EXCEPTIONS.infos[_]), (i = e.type), !i))
      return 0 | (setTempRet0(0), _);
    for (
      n = Array.prototype.slice.call(arguments),
        t = Module["___cxa_is_pointer_type"](i),
        ___cxa_find_matching_catch.buffer ||
          (___cxa_find_matching_catch.buffer = _malloc(4)),
        HEAP32[___cxa_find_matching_catch.buffer >> 2] = _,
        _ = ___cxa_find_matching_catch.buffer,
        r = 0;
      r < n.length;
      r++
    )
      if (n[r] && Module["___cxa_can_catch"](n[r], i, _))
        return (
          (_ = HEAP32[_ >> 2]), (e.adjusted = _), 0 | (setTempRet0(n[r]), _)
        );
    return (_ = HEAP32[_ >> 2]), 0 | (setTempRet0(i), _);
  }
  function ___cxa_throw(e, i, n) {
    throw (
      ((EXCEPTIONS.infos[e] = {
        ptr: e,
        adjusted: e,
        type: i,
        destructor: n,
        refcount: 0,
        caught: !1,
        rethrown: !1,
      }),
      (EXCEPTIONS.last = e),
      "uncaught_exception" in __ZSt18uncaught_exceptionv
        ? __ZSt18uncaught_exceptionv.uncaught_exception++
        : (__ZSt18uncaught_exceptionv.uncaught_exception = 1),
      e)
    );
  }
  function ___gxx_personality_v0() {}
  function ___lock() {}
  function ___map_file(e, i) {
    return ___setErrNo(ERRNO_CODES.EPERM), -1;
  }
  function ___syscall10(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr();
      return FS.unlink(n), 0;
    } catch (t) {
      return (
        ("undefined" != typeof FS && t instanceof FS.ErrnoError) || abort(t),
        -t.errno
      );
    }
  }
  function ___syscall122(e, i) {
    function n(e, i) {
      var n = r[e];
      writeAsciiToMemory(i, t + n);
    }
    var t, r;
    SYSCALLS.varargs = i;
    try {
      return (
        (t = SYSCALLS.get()),
        t
          ? ((r = {
              sysname: 0,
              nodename: 65,
              domainname: 325,
              machine: 260,
              version: 195,
              release: 130,
              __size__: 390,
            }),
            n("sysname", "Emscripten"),
            n("nodename", "emscripten"),
            n("release", "1.0"),
            n("version", "#1"),
            n("machine", "x86-JS"),
            0)
          : -ERRNO_CODES.EFAULT
      );
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall140(e, i) {
    var n, t, r, _, o, l;
    SYSCALLS.varargs = i;
    try {
      return (
        (n = SYSCALLS.getStreamFromFD()),
        (t = SYSCALLS.get()),
        (r = SYSCALLS.get()),
        (_ = SYSCALLS.get()),
        (o = SYSCALLS.get()),
        (l = r),
        FS.llseek(n, l, o),
        (HEAP32[_ >> 2] = n.position),
        n.getdents && 0 === l && 0 === o && (n.getdents = null),
        0
      );
    } catch (u) {
      return (
        ("undefined" != typeof FS && u instanceof FS.ErrnoError) || abort(u),
        -u.errno
      );
    }
  }
  function ___syscall142(e, i) {
    function n(e, i, n, t) {
      return 32 > e ? i & t : n & t;
    }
    var t, r, _, o, l, u, a, s, c, f, d, p, m, y, g, v, L, S, E, b, h, M, A, C;
    SYSCALLS.varargs = i;
    try {
      for (
        t = SYSCALLS.get(),
          r = SYSCALLS.get(),
          _ = SYSCALLS.get(),
          o = SYSCALLS.get(),
          l = SYSCALLS.get(),
          assert(64 >= t, "nfds must be less than or equal to 64"),
          assert(!o, "exceptfds not supported"),
          u = 0,
          a = r ? HEAP32[r >> 2] : 0,
          s = r ? HEAP32[(r + 4) >> 2] : 0,
          c = _ ? HEAP32[_ >> 2] : 0,
          f = _ ? HEAP32[(_ + 4) >> 2] : 0,
          d = o ? HEAP32[o >> 2] : 0,
          p = o ? HEAP32[(o + 4) >> 2] : 0,
          m = 0,
          y = 0,
          g = 0,
          v = 0,
          L = 0,
          S = 0,
          E =
            (r ? HEAP32[r >> 2] : 0) |
            (_ ? HEAP32[_ >> 2] : 0) |
            (o ? HEAP32[o >> 2] : 0),
          b =
            (r ? HEAP32[(r + 4) >> 2] : 0) |
            (_ ? HEAP32[(_ + 4) >> 2] : 0) |
            (o ? HEAP32[(o + 4) >> 2] : 0),
          h = 0;
        t > h;
        h++
      )
        if (((M = 1 << h % 32), n(h, E, b, M))) {
          if (((A = FS.getStream(h)), !A))
            throw new FS.ErrnoError(ERRNO_CODES.EBADF);
          (C = SYSCALLS.DEFAULT_POLLMASK),
            A.stream_ops.poll && (C = A.stream_ops.poll(A)),
            1 & C && n(h, a, s, M) && (32 > h ? (m |= M) : (y |= M), u++),
            4 & C && n(h, c, f, M) && (32 > h ? (g |= M) : (v |= M), u++),
            2 & C && n(h, d, p, M) && (32 > h ? (L |= M) : (S |= M), u++);
        }
      return (
        r && ((HEAP32[r >> 2] = m), (HEAP32[(r + 4) >> 2] = y)),
        _ && ((HEAP32[_ >> 2] = g), (HEAP32[(_ + 4) >> 2] = v)),
        o && ((HEAP32[o >> 2] = L), (HEAP32[(o + 4) >> 2] = S)),
        u
      );
    } catch (G) {
      return (
        ("undefined" != typeof FS && G instanceof FS.ErrnoError) || abort(G),
        -G.errno
      );
    }
  }
  function ___syscall145(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStreamFromFD(),
        t = SYSCALLS.get(),
        r = SYSCALLS.get();
      return SYSCALLS.doReadv(n, t, r);
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall146(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStreamFromFD(),
        t = SYSCALLS.get(),
        r = SYSCALLS.get();
      return SYSCALLS.doWritev(n, t, r);
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall15(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.get();
      return FS.chmod(n, t), 0;
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall183(e, i) {
    var n, t, r, _;
    SYSCALLS.varargs = i;
    try {
      return (
        (n = SYSCALLS.get()),
        (t = SYSCALLS.get()),
        0 === t
          ? -ERRNO_CODES.EINVAL
          : ((r = FS.cwd()),
            (_ = lengthBytesUTF8(r)),
            _ + 1 > t ? -ERRNO_CODES.ERANGE : (stringToUTF8(r, n, t), n))
      );
    } catch (o) {
      return (
        ("undefined" != typeof FS && o instanceof FS.ErrnoError) || abort(o),
        -o.errno
      );
    }
  }
  function ___syscall192(e, i) {
    var n, t, r, _, o, l, u, a, s, c;
    SYSCALLS.varargs = i;
    try {
      if (
        ((n = SYSCALLS.get()),
        (t = SYSCALLS.get()),
        (r = SYSCALLS.get()),
        (_ = SYSCALLS.get()),
        (o = SYSCALLS.get()),
        (l = SYSCALLS.get()),
        (l <<= 12),
        (a = !1),
        o === -1)
      ) {
        if (((u = _memalign(PAGE_SIZE, t)), !u)) return -ERRNO_CODES.ENOMEM;
        _memset(u, 0, t), (a = !0);
      } else {
        if (((s = FS.getStream(o)), !s)) return -ERRNO_CODES.EBADF;
        (c = FS.mmap(s, HEAPU8, n, t, l, r, _)), (u = c.ptr), (a = c.allocated);
      }
      return (
        (SYSCALLS.mappings[u] = {
          malloc: u,
          len: t,
          allocated: a,
          fd: o,
          flags: _,
        }),
        u
      );
    } catch (f) {
      return (
        ("undefined" != typeof FS && f instanceof FS.ErrnoError) || abort(f),
        -f.errno
      );
    }
  }
  function ___syscall193(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.getZero(),
        r = SYSCALLS.get64();
      return FS.truncate(n, r), 0;
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall194(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.get(),
        t = SYSCALLS.getZero(),
        r = SYSCALLS.get64();
      return FS.ftruncate(n, r), 0;
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall195(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.get();
      return SYSCALLS.doStat(FS.stat, n, t);
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall196(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.get();
      return SYSCALLS.doStat(FS.lstat, n, t);
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall197(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStreamFromFD(),
        t = SYSCALLS.get();
      return SYSCALLS.doStat(FS.stat, n.path, t);
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall202(e, i) {
    SYSCALLS.varargs = i;
    try {
      return 0;
    } catch (n) {
      return (
        ("undefined" != typeof FS && n instanceof FS.ErrnoError) || abort(n),
        -n.errno
      );
    }
  }
  function ___syscall199() {
    return ___syscall202.apply(null, arguments);
  }
  function ___syscall220(e, i) {
    var n, t, r, _, o, l, u, a;
    SYSCALLS.varargs = i;
    try {
      (n = SYSCALLS.getStreamFromFD()),
        (t = SYSCALLS.get()),
        (r = SYSCALLS.get()),
        n.getdents || (n.getdents = FS.readdir(n.path)),
        (_ = 0);
      while (n.getdents.length > 0 && r >= _ + 268)
        (u = n.getdents.pop()),
          "." === u[0]
            ? ((o = 1), (l = 4))
            : ((a = FS.lookupNode(n.node, u)),
              (o = a.id),
              (l = FS.isChrdev(a.mode)
                ? 2
                : FS.isDir(a.mode)
                ? 4
                : FS.isLink(a.mode)
                ? 10
                : 8)),
          (HEAP32[(t + _) >> 2] = o),
          (HEAP32[(t + _ + 4) >> 2] = n.position),
          (HEAP16[(t + _ + 8) >> 1] = 268),
          (HEAP8[(t + _ + 10) >> 0] = l),
          stringToUTF8(u, t + _ + 11, 256),
          (_ += 268);
      return _;
    } catch (s) {
      return (
        ("undefined" != typeof FS && s instanceof FS.ErrnoError) || abort(s),
        -s.errno
      );
    }
  }
  function ___syscall221(e, i) {
    var n, t, r, _, o;
    SYSCALLS.varargs = i;
    try {
      switch (((n = SYSCALLS.getStreamFromFD()), (t = SYSCALLS.get()), t)) {
        case 0:
          return (
            (r = SYSCALLS.get()),
            0 > r
              ? -ERRNO_CODES.EINVAL
              : ((_ = FS.open(n.path, n.flags, 0, r)), _.fd)
          );
        case 1:
        case 2:
          return 0;
        case 3:
          return n.flags;
        case 4:
          return (r = SYSCALLS.get()), (n.flags |= r), 0;
        case 12:
        case 12:
          return (r = SYSCALLS.get()), (o = 0), (HEAP16[(r + o) >> 1] = 2), 0;
        case 13:
        case 14:
        case 13:
        case 14:
          return 0;
        case 16:
        case 8:
          return -ERRNO_CODES.EINVAL;
        case 9:
          return ___setErrNo(ERRNO_CODES.EINVAL), -1;
        default:
          return -ERRNO_CODES.EINVAL;
      }
    } catch (l) {
      return (
        ("undefined" != typeof FS && l instanceof FS.ErrnoError) || abort(l),
        -l.errno
      );
    }
  }
  function ___syscall268(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.get(),
        r = SYSCALLS.get();
      return (
        assert(64 === t),
        (HEAP32[(r + 4) >> 2] = 4096),
        (HEAP32[(r + 40) >> 2] = 4096),
        (HEAP32[(r + 8) >> 2] = 1e6),
        (HEAP32[(r + 12) >> 2] = 5e5),
        (HEAP32[(r + 16) >> 2] = 5e5),
        (HEAP32[(r + 20) >> 2] = FS.nextInode),
        (HEAP32[(r + 24) >> 2] = 1e6),
        (HEAP32[(r + 28) >> 2] = 42),
        (HEAP32[(r + 44) >> 2] = 2),
        (HEAP32[(r + 36) >> 2] = 255),
        0
      );
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall3(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStreamFromFD(),
        t = SYSCALLS.get(),
        r = SYSCALLS.get();
      return FS.read(n, HEAP8, t, r);
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall33(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.get();
      return SYSCALLS.doAccess(n, t);
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall38(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.getStr();
      return FS.rename(n, t), 0;
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall39(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.get();
      return SYSCALLS.doMkdir(n, t);
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall4(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStreamFromFD(),
        t = SYSCALLS.get(),
        r = SYSCALLS.get();
      return FS.write(n, HEAP8, t, r);
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall40(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr();
      return FS.rmdir(n), 0;
    } catch (t) {
      return (
        ("undefined" != typeof FS && t instanceof FS.ErrnoError) || abort(t),
        -t.errno
      );
    }
  }
  function ___syscall41(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStreamFromFD();
      return FS.open(n.path, n.flags, 0).fd;
    } catch (t) {
      return (
        ("undefined" != typeof FS && t instanceof FS.ErrnoError) || abort(t),
        -t.errno
      );
    }
  }
  function ___syscall42(e, i) {
    var n, t;
    SYSCALLS.varargs = i;
    try {
      if (((n = SYSCALLS.get()), 0 == n))
        throw new FS.ErrnoError(ERRNO_CODES.EFAULT);
      return (
        (t = PIPEFS.createPipe()),
        (HEAP32[n >> 2] = t.readable_fd),
        (HEAP32[(n + 4) >> 2] = t.writable_fd),
        0
      );
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall5(e, i) {
    var n, t, r, _;
    SYSCALLS.varargs = i;
    try {
      return (
        (n = SYSCALLS.getStr()),
        (t = SYSCALLS.get()),
        (r = SYSCALLS.get()),
        (_ = FS.open(n, t, r)),
        _.fd
      );
    } catch (o) {
      return (
        ("undefined" != typeof FS && o instanceof FS.ErrnoError) || abort(o),
        -o.errno
      );
    }
  }
  function ___syscall54(e, i) {
    var n, t, r;
    SYSCALLS.varargs = i;
    try {
      switch (((n = SYSCALLS.getStreamFromFD()), (t = SYSCALLS.get()), t)) {
        case 21509:
        case 21505:
          return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508:
          return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
        case 21519:
          return n.tty
            ? ((r = SYSCALLS.get()), (HEAP32[r >> 2] = 0), 0)
            : -ERRNO_CODES.ENOTTY;
        case 21520:
          return n.tty ? -ERRNO_CODES.EINVAL : -ERRNO_CODES.ENOTTY;
        case 21531:
          return (r = SYSCALLS.get()), FS.ioctl(n, t, r);
        case 21523:
          return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
        default:
          abort("bad ioctl syscall " + t);
      }
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall6(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStreamFromFD();
      return FS.close(n), 0;
    } catch (t) {
      return (
        ("undefined" != typeof FS && t instanceof FS.ErrnoError) || abort(t),
        -t.errno
      );
    }
  }
  function ___syscall77(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.get(),
        t = SYSCALLS.get();
      return (
        _memset(t, 0, 136),
        (HEAP32[t >> 2] = 1),
        (HEAP32[(t + 4) >> 2] = 2),
        (HEAP32[(t + 8) >> 2] = 3),
        (HEAP32[(t + 12) >> 2] = 4),
        0
      );
    } catch (r) {
      return (
        ("undefined" != typeof FS && r instanceof FS.ErrnoError) || abort(r),
        -r.errno
      );
    }
  }
  function ___syscall85(e, i) {
    SYSCALLS.varargs = i;
    try {
      var n = SYSCALLS.getStr(),
        t = SYSCALLS.get(),
        r = SYSCALLS.get();
      return SYSCALLS.doReadlink(n, t, r);
    } catch (_) {
      return (
        ("undefined" != typeof FS && _ instanceof FS.ErrnoError) || abort(_),
        -_.errno
      );
    }
  }
  function ___syscall91(e, i) {
    var n, t, r, _;
    SYSCALLS.varargs = i;
    try {
      return (
        (n = SYSCALLS.get()),
        (t = SYSCALLS.get()),
        (r = SYSCALLS.mappings[n]),
        r
          ? (t === r.len &&
              ((_ = FS.getStream(r.fd)),
              SYSCALLS.doMsync(n, _, t, r.flags),
              FS.munmap(_),
              (SYSCALLS.mappings[n] = null),
              r.allocated && _free(r.malloc)),
            0)
          : 0
      );
    } catch (o) {
      return (
        ("undefined" != typeof FS && o instanceof FS.ErrnoError) || abort(o),
        -o.errno
      );
    }
  }
  function ___unlock() {}
  function _abort() {
    Module["abort"]();
  }
  function _atexit(e, i) {
    __ATEXIT__.unshift({ func: e, arg: i });
  }
  function _clock() {
    return (
      void 0 === _clock.start && (_clock.start = Date.now()),
      ((Date.now() - _clock.start) * (1e6 / 1e3)) | 0
    );
  }
  function _emscripten_get_now_res() {
    return ENVIRONMENT_IS_NODE
      ? 1
      : "undefined" != typeof dateNow ||
        ((ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
          self["performance"] &&
          self["performance"]["now"])
      ? 1e3
      : 1e3 * 1e3;
  }
  function _emscripten_get_now_is_monotonic() {
    return (
      ENVIRONMENT_IS_NODE ||
      "undefined" != typeof dateNow ||
      ((ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
        self["performance"] &&
        self["performance"]["now"])
    );
  }
  function _clock_getres(e, i) {
    var n;
    if (0 === e) n = 1e3 * 1e3;
    else {
      if (1 !== e || !_emscripten_get_now_is_monotonic())
        return ___setErrNo(ERRNO_CODES.EINVAL), -1;
      n = _emscripten_get_now_res();
    }
    return (HEAP32[i >> 2] = (n / 1e9) | 0), (HEAP32[(i + 4) >> 2] = n), 0;
  }
  function _clock_gettime(e, i) {
    var n;
    if (0 === e) n = Date.now();
    else {
      if (1 !== e || !_emscripten_get_now_is_monotonic())
        return ___setErrNo(ERRNO_CODES.EINVAL), -1;
      n = _emscripten_get_now();
    }
    return (
      (HEAP32[i >> 2] = (n / 1e3) | 0),
      (HEAP32[(i + 4) >> 2] = ((n % 1e3) * 1e3 * 1e3) | 0),
      0
    );
  }
  function _difftime(e, i) {
    return e - i;
  }
  function _dlclose(e) {
    if (DLFCN.loadedLibs[e]) {
      var i = DLFCN.loadedLibs[e];
      return (
        0 == --i.refcount &&
          (i.module.cleanups &&
            i.module.cleanups.forEach(function (e) {
              e();
            }),
          delete DLFCN.loadedLibNames[i.name],
          delete DLFCN.loadedLibs[e]),
        0
      );
    }
    return (DLFCN.errorMsg = "Tried to dlclose() unopened handle: " + e), 1;
  }
  function _dlopen(e, i) {
    var n, t, r, _, o, l, u, a, s, c, f;
    if (
      (abort(
        "To use dlopen, you need to use Emscripten's linking support, see https://github.com/kripken/emscripten/wiki/Linking"
      ),
      (n = []),
      0 === e)
    )
      e = "__self__";
    else if (
      ((t = Pointer_stringify(e)),
      (r = function (e) {
        var i = FS.findObject(e);
        return i && !i.isFolder && !i.isDevice;
      }),
      r(t))
    )
      e = t;
    else {
      ENV["LD_LIBRARY_PATH"] && (n = ENV["LD_LIBRARY_PATH"].split(":"));
      for (_ in n)
        if (((o = PATH.join2(n[_], t)), r(o))) {
          e = o;
          break;
        }
    }
    if (DLFCN.loadedLibNames[e])
      return (l = DLFCN.loadedLibNames[e]), DLFCN.loadedLibs[l].refcount++, l;
    if ("__self__" === e) (l = -1), (u = Module), (a = {});
    else {
      if (((s = FS.findObject(e)), !s || s.isFolder || s.isDevice))
        return (DLFCN.errorMsg = "Could not find dynamic lib: " + e), 0;
      FS.forceLoadFile(s);
      try {
        (c = FS.readFile(e, { encoding: "binary" })),
          c instanceof Uint8Array || (c = new Uint8Array(c)),
          (u = loadWebAssemblyModule(c));
      } catch (d) {
        return (
          (DLFCN.errorMsg = "Could not evaluate dynamic lib: " + e + "\n" + d),
          0
        );
      }
      l = 1;
      for (f in DLFCN.loadedLibs) DLFCN.loadedLibs.hasOwnProperty(f) && l++;
      if (256 & i)
        for (_ in u) u.hasOwnProperty(_) && "_" == _[0] && (Module[_] = u[_]);
      a = {};
    }
    return (
      (DLFCN.loadedLibs[l] = {
        refcount: 1,
        name: e,
        module: u,
        cached_functions: a,
      }),
      (DLFCN.loadedLibNames[e] = l),
      l
    );
  }
  function _dlsym(e, i) {
    var n, t;
    return (
      (i = Pointer_stringify(i)),
      DLFCN.loadedLibs[e]
        ? ((n = DLFCN.loadedLibs[e]),
          (i = "_" + i),
          n.cached_functions.hasOwnProperty(i)
            ? n.cached_functions[i]
            : n.module.hasOwnProperty(i)
            ? ((t = n.module[i]),
              "function" == typeof t &&
                ((t = addFunction(t)), (n.cached_functions = t)),
              t)
            : ((DLFCN.errorMsg =
                'Tried to lookup unknown symbol "' +
                i +
                '" in dynamic lib: ' +
                n.name),
              0))
        : ((DLFCN.errorMsg = "Tried to dlsym() from an unopened handle: " + e),
          0)
    );
  }
  function _emscripten_exit_fullscreen() {
    if ("undefined" == typeof JSEvents.fullscreenEnabled()) return -1;
    if (
      (JSEvents.removeDeferredCalls(JSEvents.requestFullscreen),
      document.exitFullscreen)
    )
      document.exitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else {
      if (!document.webkitExitFullscreen) return -1;
      document.webkitExitFullscreen();
    }
    return (
      __currentFullscreenStrategy.canvasResizedCallback &&
        Module["dynCall_iiii"](
          __currentFullscreenStrategy.canvasResizedCallback,
          37,
          0,
          __currentFullscreenStrategy.canvasResizedCallbackUserData
        ),
      0
    );
  }
  function _emscripten_exit_pointerlock() {
    if (
      (JSEvents.removeDeferredCalls(JSEvents.requestPointerLock),
      document.exitPointerLock)
    )
      document.exitPointerLock();
    else if (document.msExitPointerLock) document.msExitPointerLock();
    else if (document.mozExitPointerLock) document.mozExitPointerLock();
    else {
      if (!document.webkitExitPointerLock) return -1;
      document.webkitExitPointerLock();
    }
    return 0;
  }
  function _emscripten_get_fullscreen_status(e) {
    return "undefined" == typeof JSEvents.fullscreenEnabled()
      ? -1
      : (JSEvents.fillFullscreenChangeEventData(e), 0);
  }
  function __emscripten_sample_gamepad_data() {
    JSEvents.numGamepadsConnected &&
      ((Browser.mainLoop.currentFrameNumber ===
        JSEvents.lastGamepadStateFrame &&
        Browser.mainLoop.currentFrameNumber) ||
        ((JSEvents.lastGamepadState = navigator.getGamepads
          ? navigator.getGamepads()
          : navigator.webkitGetGamepads
          ? navigator.webkitGetGamepads
          : null),
        (JSEvents.lastGamepadStateFrame =
          Browser.mainLoop.currentFrameNumber)));
  }
  function _emscripten_get_gamepad_status(e, i) {
    return (
      __emscripten_sample_gamepad_data(),
      JSEvents.lastGamepadState
        ? 0 > e || e >= JSEvents.lastGamepadState.length
          ? -5
          : JSEvents.lastGamepadState[e]
          ? (JSEvents.fillGamepadEventData(i, JSEvents.lastGamepadState[e]), 0)
          : -7
        : -1
    );
  }
  function _emscripten_get_main_loop_timing(e, i) {
    e && (HEAP32[e >> 2] = Browser.mainLoop.timingMode),
      i && (HEAP32[i >> 2] = Browser.mainLoop.timingValue);
  }
  function _emscripten_get_num_gamepads() {
    return JSEvents.numGamepadsConnected
      ? (__emscripten_sample_gamepad_data(),
        JSEvents.lastGamepadState ? JSEvents.lastGamepadState.length : -1)
      : 0;
  }
  function _emscripten_glActiveTexture(e) {
    GLctx["activeTexture"](e);
  }
  function _emscripten_glAttachShader(e, i) {
    GLctx.attachShader(GL.programs[e], GL.shaders[i]);
  }
  function _emscripten_glBindAttribLocation(e, i, n) {
    (n = Pointer_stringify(n)), GLctx.bindAttribLocation(GL.programs[e], i, n);
  }
  function _emscripten_glBindBuffer(e, i) {
    var n = i ? GL.buffers[i] : null;
    35051 == e
      ? (GLctx.currentPixelPackBufferBinding = i)
      : 35052 == e && (GLctx.currentPixelUnpackBufferBinding = i),
      GLctx.bindBuffer(e, n);
  }
  function _emscripten_glBindFramebuffer(e, i) {
    GLctx.bindFramebuffer(e, i ? GL.framebuffers[i] : null);
  }
  function _emscripten_glBindProgramARB() {
    Module["printErr"]("missing function: emscripten_glBindProgramARB"),
      abort(-1);
  }
  function _emscripten_glBindRenderbuffer(e, i) {
    GLctx.bindRenderbuffer(e, i ? GL.renderbuffers[i] : null);
  }
  function _emscripten_glBindTexture(e, i) {
    GLctx.bindTexture(e, i ? GL.textures[i] : null);
  }
  function _emscripten_glBindVertexArray(e) {
    GLctx["bindVertexArray"](GL.vaos[e]);
  }
  function _emscripten_glBlendColor(e, i, n, t) {
    GLctx["blendColor"](e, i, n, t);
  }
  function _emscripten_glBlendEquation(e) {
    GLctx["blendEquation"](e);
  }
  function _emscripten_glBlendEquationSeparate(e, i) {
    GLctx["blendEquationSeparate"](e, i);
  }
  function _emscripten_glBlendFunc(e, i) {
    GLctx["blendFunc"](e, i);
  }
  function _emscripten_glBlendFuncSeparate(e, i, n, t) {
    GLctx["blendFuncSeparate"](e, i, n, t);
  }
  function _emscripten_glBufferData(e, i, n, t) {
    if (n) {
      if (GL.currentContext.supportsWebGL2EntryPoints)
        return GLctx.bufferData(e, HEAPU8, t, n, i), void 0;
      GLctx.bufferData(e, HEAPU8.subarray(n, n + i), t);
    } else GLctx.bufferData(e, i, t);
  }
  function _emscripten_glBufferSubData(e, i, n, t) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.bufferSubData(e, i, HEAPU8, t, n), void 0)
      : (GLctx.bufferSubData(e, i, HEAPU8.subarray(t, t + n)), void 0);
  }
  function _emscripten_glCheckFramebufferStatus(e) {
    return GLctx["checkFramebufferStatus"](e);
  }
  function _emscripten_glClear(e) {
    GLctx["clear"](e);
  }
  function _emscripten_glClearColor(e, i, n, t) {
    GLctx["clearColor"](e, i, n, t);
  }
  function _emscripten_glClearDepth(e) {
    GLctx["clearDepth"](e);
  }
  function _emscripten_glClearDepthf(e) {
    GLctx["clearDepth"](e);
  }
  function _emscripten_glClearStencil(e) {
    GLctx["clearStencil"](e);
  }
  function _emscripten_glClientActiveTexture() {
    Module["printErr"]("missing function: emscripten_glClientActiveTexture"),
      abort(-1);
  }
  function _emscripten_glColorMask(e, i, n, t) {
    GLctx.colorMask(!!e, !!i, !!n, !!t);
  }
  function _emscripten_glColorPointer() {
    Module["printErr"]("missing function: emscripten_glColorPointer"),
      abort(-1);
  }
  function _emscripten_glCompileShader(e) {
    GLctx.compileShader(GL.shaders[e]);
  }
  function _emscripten_glCompressedTexImage2D(e, i, n, t, r, _, o, l) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx["compressedTexImage2D"](e, i, n, t, r, _, HEAPU8, l, o), void 0)
      : (GLctx["compressedTexImage2D"](
          e,
          i,
          n,
          t,
          r,
          _,
          l ? HEAPU8.subarray(l, l + o) : null
        ),
        void 0);
  }
  function _emscripten_glCompressedTexSubImage2D(e, i, n, t, r, _, o, l, u) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx["compressedTexSubImage2D"](e, i, n, t, r, _, o, HEAPU8, u, l),
        void 0)
      : (GLctx["compressedTexSubImage2D"](
          e,
          i,
          n,
          t,
          r,
          _,
          o,
          u ? HEAPU8.subarray(u, u + l) : null
        ),
        void 0);
  }
  function _emscripten_glCopyTexImage2D(e, i, n, t, r, _, o, l) {
    GLctx["copyTexImage2D"](e, i, n, t, r, _, o, l);
  }
  function _emscripten_glCopyTexSubImage2D(e, i, n, t, r, _, o, l) {
    GLctx["copyTexSubImage2D"](e, i, n, t, r, _, o, l);
  }
  function _emscripten_glCreateProgram() {
    var e = GL.getNewId(GL.programs),
      i = GLctx.createProgram();
    return (i.name = e), (GL.programs[e] = i), e;
  }
  function _emscripten_glCreateShader(e) {
    var i = GL.getNewId(GL.shaders);
    return (GL.shaders[i] = GLctx.createShader(e)), i;
  }
  function _emscripten_glCullFace(e) {
    GLctx["cullFace"](e);
  }
  function _emscripten_glDeleteBuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.buffers[t]),
        r &&
          (GLctx.deleteBuffer(r),
          (r.name = 0),
          (GL.buffers[t] = null),
          t == GL.currArrayBuffer && (GL.currArrayBuffer = 0),
          t == GL.currElementArrayBuffer && (GL.currElementArrayBuffer = 0));
  }
  function _emscripten_glDeleteFramebuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; ++n)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.framebuffers[t]),
        r &&
          (GLctx.deleteFramebuffer(r),
          (r.name = 0),
          (GL.framebuffers[t] = null));
  }
  function _emscripten_glDeleteObjectARB() {
    Module["printErr"]("missing function: emscripten_glDeleteObjectARB"),
      abort(-1);
  }
  function _emscripten_glDeleteProgram(e) {
    if (e) {
      var i = GL.programs[e];
      if (!i) return GL.recordError(1281), void 0;
      GLctx.deleteProgram(i),
        (i.name = 0),
        (GL.programs[e] = null),
        (GL.programInfos[e] = null);
    }
  }
  function _emscripten_glDeleteRenderbuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.renderbuffers[t]),
        r &&
          (GLctx.deleteRenderbuffer(r),
          (r.name = 0),
          (GL.renderbuffers[t] = null));
  }
  function _emscripten_glDeleteShader(e) {
    if (e) {
      var i = GL.shaders[e];
      if (!i) return GL.recordError(1281), void 0;
      GLctx.deleteShader(i), (GL.shaders[e] = null);
    }
  }
  function _emscripten_glDeleteTextures(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.textures[t]),
        r && (GLctx.deleteTexture(r), (r.name = 0), (GL.textures[t] = null));
  }
  function _emscripten_glDeleteVertexArrays(e, i) {
    var n, t;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        GLctx["deleteVertexArray"](GL.vaos[t]),
        (GL.vaos[t] = null);
  }
  function _emscripten_glDepthFunc(e) {
    GLctx["depthFunc"](e);
  }
  function _emscripten_glDepthMask(e) {
    GLctx.depthMask(!!e);
  }
  function _emscripten_glDepthRange(e, i) {
    GLctx["depthRange"](e, i);
  }
  function _emscripten_glDepthRangef(e, i) {
    GLctx["depthRange"](e, i);
  }
  function _emscripten_glDetachShader(e, i) {
    GLctx.detachShader(GL.programs[e], GL.shaders[i]);
  }
  function _emscripten_glDisable(e) {
    GLctx["disable"](e);
  }
  function _emscripten_glDisableVertexAttribArray(e) {
    GLctx.disableVertexAttribArray(e);
  }
  function _emscripten_glDrawArrays(e, i, n) {
    GLctx.drawArrays(e, i, n);
  }
  function _emscripten_glDrawArraysInstanced(e, i, n, t) {
    GLctx["drawArraysInstanced"](e, i, n, t);
  }
  function _emscripten_glDrawBuffers(e, i) {
    var n,
      t = GL.tempFixedLengthArray[e];
    for (n = 0; e > n; n++) t[n] = HEAP32[(i + 4 * n) >> 2];
    GLctx["drawBuffers"](t);
  }
  function _emscripten_glDrawElements(e, i, n, t) {
    GLctx.drawElements(e, i, n, t);
  }
  function _emscripten_glDrawElementsInstanced(e, i, n, t, r) {
    GLctx["drawElementsInstanced"](e, i, n, t, r);
  }
  function _emscripten_glDrawRangeElements(e, i, n, t, r, _) {
    _emscripten_glDrawElements(e, t, r, _), GLctx.drawElements(e, t, r, _);
  }
  function _emscripten_glEnable(e) {
    GLctx["enable"](e);
  }
  function _emscripten_glEnableClientState() {
    Module["printErr"]("missing function: emscripten_glEnableClientState"),
      abort(-1);
  }
  function _emscripten_glEnableVertexAttribArray(e) {
    GLctx.enableVertexAttribArray(e);
  }
  function _emscripten_glFinish() {
    GLctx["finish"]();
  }
  function _emscripten_glFlush() {
    GLctx["flush"]();
  }
  function _emscripten_glFramebufferRenderbuffer(e, i, n, t) {
    GLctx.framebufferRenderbuffer(e, i, n, GL.renderbuffers[t]);
  }
  function _emscripten_glFramebufferTexture2D(e, i, n, t, r) {
    GLctx.framebufferTexture2D(e, i, n, GL.textures[t], r);
  }
  function _emscripten_glFrontFace(e) {
    GLctx["frontFace"](e);
  }
  function _emscripten_glFrustum() {
    Module["printErr"]("missing function: emscripten_glFrustum"), abort(-1);
  }
  function _emscripten_glGenBuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx.createBuffer()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.buffers)),
        (t.name = r),
        (GL.buffers[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _emscripten_glGenFramebuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; ++n) {
      if (((t = GLctx.createFramebuffer()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.framebuffers)),
        (t.name = r),
        (GL.framebuffers[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _emscripten_glGenRenderbuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx.createRenderbuffer()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.renderbuffers)),
        (t.name = r),
        (GL.renderbuffers[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _emscripten_glGenTextures(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx.createTexture()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.textures)),
        (t.name = r),
        (GL.textures[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _emscripten_glGenVertexArrays(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx["createVertexArray"]()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.vaos)),
        (t.name = r),
        (GL.vaos[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _emscripten_glGenerateMipmap(e) {
    GLctx["generateMipmap"](e);
  }
  function _emscripten_glGetActiveAttrib(e, i, n, t, r, _, o) {
    var l, u;
    (e = GL.programs[e]),
      (l = GLctx.getActiveAttrib(e, i)),
      l &&
        (n > 0 && o
          ? ((u = stringToUTF8(l.name, o, n)), t && (HEAP32[t >> 2] = u))
          : t && (HEAP32[t >> 2] = 0),
        r && (HEAP32[r >> 2] = l.size),
        _ && (HEAP32[_ >> 2] = l.type));
  }
  function _emscripten_glGetActiveUniform(e, i, n, t, r, _, o) {
    var l, u;
    (e = GL.programs[e]),
      (l = GLctx.getActiveUniform(e, i)),
      l &&
        (n > 0 && o
          ? ((u = stringToUTF8(l.name, o, n)), t && (HEAP32[t >> 2] = u))
          : t && (HEAP32[t >> 2] = 0),
        r && (HEAP32[r >> 2] = l.size),
        _ && (HEAP32[_ >> 2] = l.type));
  }
  function _emscripten_glGetAttachedShaders(e, i, n, t) {
    var r,
      _,
      o = GLctx.getAttachedShaders(GL.programs[e]),
      l = o.length;
    for (l > i && (l = i), HEAP32[n >> 2] = l, r = 0; l > r; ++r)
      (_ = GL.shaders.indexOf(o[r])), (HEAP32[(t + 4 * r) >> 2] = _);
  }
  function _emscripten_glGetAttribLocation(e, i) {
    return (
      (e = GL.programs[e]),
      (i = Pointer_stringify(i)),
      GLctx.getAttribLocation(e, i)
    );
  }
  function emscriptenWebGLGet(e, i, n) {
    var t, r, _, o, l;
    if (!i) return GL.recordError(1281), void 0;
    switch (((t = void 0), e)) {
      case 36346:
        t = 1;
        break;
      case 36344:
        return (
          "Integer" !== n && "Integer64" !== n && GL.recordError(1280), void 0
        );
      case 34814:
      case 36345:
        t = 0;
        break;
      case 34466:
        (r = GLctx.getParameter(34467)), (t = r.length);
        break;
      case 33309:
        if (GLctx.canvas.GLctxObject.version < 2)
          return GL.recordError(1282), void 0;
        (_ = GLctx.getSupportedExtensions()), (t = 2 * _.length);
        break;
      case 33307:
      case 33308:
        if (GLctx.canvas.GLctxObject.version < 2)
          return GL.recordError(1280), void 0;
        t = 33307 == e ? 3 : 0;
    }
    if (void 0 === t)
      switch (((o = GLctx.getParameter(e)), typeof o)) {
        case "number":
          t = o;
          break;
        case "boolean":
          t = o ? 1 : 0;
          break;
        case "string":
          return GL.recordError(1280), void 0;
        case "object":
          if (null === o)
            switch (e) {
              case 34964:
              case 35725:
              case 34965:
              case 36006:
              case 36007:
              case 32873:
              case 34229:
              case 35097:
              case 36389:
              case 34068:
                t = 0;
                break;
              default:
                return GL.recordError(1280), void 0;
            }
          else {
            if (
              o instanceof Float32Array ||
              o instanceof Uint32Array ||
              o instanceof Int32Array ||
              o instanceof Array
            ) {
              for (l = 0; l < o.length; ++l)
                switch (n) {
                  case "Integer":
                    HEAP32[(i + 4 * l) >> 2] = o[l];
                    break;
                  case "Float":
                    HEAPF32[(i + 4 * l) >> 2] = o[l];
                    break;
                  case "Boolean":
                    HEAP8[(i + l) >> 0] = o[l] ? 1 : 0;
                    break;
                  default:
                    throw "internal glGet error, bad type: " + n;
                }
              return;
            }
            if (
              !(
                o instanceof WebGLBuffer ||
                o instanceof WebGLProgram ||
                o instanceof WebGLFramebuffer ||
                o instanceof WebGLRenderbuffer ||
                o instanceof WebGLQuery ||
                o instanceof WebGLSampler ||
                o instanceof WebGLSync ||
                o instanceof WebGLTransformFeedback ||
                o instanceof WebGLVertexArrayObject ||
                o instanceof WebGLTexture
              )
            )
              return GL.recordError(1280), void 0;
            t = 0 | o.name;
          }
          break;
        default:
          return GL.recordError(1280), void 0;
      }
    switch (n) {
      case "Integer64":
        (tempI64 = [
          t >>> 0,
          ((tempDouble = t),
          +Math_abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (0 |
                  Math_min(
                    +Math_floor(tempDouble / 4294967296),
                    4294967295
                  )) >>>
                0
              : ~~+Math_ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
          (HEAP32[i >> 2] = tempI64[0]),
          (HEAP32[(i + 4) >> 2] = tempI64[1]);
        break;
      case "Integer":
        HEAP32[i >> 2] = t;
        break;
      case "Float":
        HEAPF32[i >> 2] = t;
        break;
      case "Boolean":
        HEAP8[i >> 0] = t ? 1 : 0;
        break;
      default:
        throw "internal glGet error, bad type: " + n;
    }
  }
  function _emscripten_glGetBooleanv(e, i) {
    emscriptenWebGLGet(e, i, "Boolean");
  }
  function _emscripten_glGetBufferParameteriv(e, i, n) {
    return n
      ? ((HEAP32[n >> 2] = GLctx.getBufferParameter(e, i)), void 0)
      : (GL.recordError(1281), void 0);
  }
  function _emscripten_glGetError() {
    if (GL.lastError) {
      var e = GL.lastError;
      return (GL.lastError = 0), e;
    }
    return GLctx.getError();
  }
  function _emscripten_glGetFloatv(e, i) {
    emscriptenWebGLGet(e, i, "Float");
  }
  function _emscripten_glGetFramebufferAttachmentParameteriv(e, i, n, t) {
    var r = GLctx.getFramebufferAttachmentParameter(e, i, n);
    HEAP32[t >> 2] = r;
  }
  function _emscripten_glGetInfoLogARB() {
    Module["printErr"]("missing function: emscripten_glGetInfoLogARB"),
      abort(-1);
  }
  function _emscripten_glGetIntegerv(e, i) {
    emscriptenWebGLGet(e, i, "Integer");
  }
  function _emscripten_glGetObjectParameterivARB() {
    Module["printErr"](
      "missing function: emscripten_glGetObjectParameterivARB"
    ),
      abort(-1);
  }
  function _emscripten_glGetPointerv() {
    Module["printErr"]("missing function: emscripten_glGetPointerv"), abort(-1);
  }
  function _emscripten_glGetProgramInfoLog(e, i, n, t) {
    var r,
      _ = GLctx.getProgramInfoLog(GL.programs[e]);
    null === _ && (_ = "(unknown error)"),
      i > 0 && t
        ? ((r = stringToUTF8(_, t, i)), n && (HEAP32[n >> 2] = r))
        : n && (HEAP32[n >> 2] = 0);
  }
  function _emscripten_glGetProgramiv(e, i, n) {
    var t, r, _, o, l, u, a;
    if (!n) return GL.recordError(1281), void 0;
    if (e >= GL.counter) return GL.recordError(1281), void 0;
    if (((t = GL.programInfos[e]), !t)) return GL.recordError(1282), void 0;
    if (35716 == i)
      (r = GLctx.getProgramInfoLog(GL.programs[e])),
        null === r && (r = "(unknown error)"),
        (HEAP32[n >> 2] = r.length + 1);
    else if (35719 == i) HEAP32[n >> 2] = t.maxUniformLength;
    else if (35722 == i) {
      if (t.maxAttributeLength == -1)
        for (
          e = GL.programs[e],
            _ = GLctx.getProgramParameter(e, GLctx.ACTIVE_ATTRIBUTES),
            t.maxAttributeLength = 0,
            o = 0;
          _ > o;
          ++o
        )
          (l = GLctx.getActiveAttrib(e, o)),
            (t.maxAttributeLength = Math.max(
              t.maxAttributeLength,
              l.name.length + 1
            ));
      HEAP32[n >> 2] = t.maxAttributeLength;
    } else if (35381 == i) {
      if (t.maxUniformBlockNameLength == -1)
        for (
          e = GL.programs[e],
            u = GLctx.getProgramParameter(e, GLctx.ACTIVE_UNIFORM_BLOCKS),
            t.maxUniformBlockNameLength = 0,
            o = 0;
          u > o;
          ++o
        )
          (a = GLctx.getActiveUniformBlockName(e, o)),
            (t.maxUniformBlockNameLength = Math.max(
              t.maxUniformBlockNameLength,
              a.length + 1
            ));
      HEAP32[n >> 2] = t.maxUniformBlockNameLength;
    } else HEAP32[n >> 2] = GLctx.getProgramParameter(GL.programs[e], i);
  }
  function _emscripten_glGetRenderbufferParameteriv(e, i, n) {
    return n
      ? ((HEAP32[n >> 2] = GLctx.getRenderbufferParameter(e, i)), void 0)
      : (GL.recordError(1281), void 0);
  }
  function _emscripten_glGetShaderInfoLog(e, i, n, t) {
    var r,
      _ = GLctx.getShaderInfoLog(GL.shaders[e]);
    null === _ && (_ = "(unknown error)"),
      i > 0 && t
        ? ((r = stringToUTF8(_, t, i)), n && (HEAP32[n >> 2] = r))
        : n && (HEAP32[n >> 2] = 0);
  }
  function _emscripten_glGetShaderPrecisionFormat(e, i, n, t) {
    var r = GLctx.getShaderPrecisionFormat(e, i);
    (HEAP32[n >> 2] = r.rangeMin),
      (HEAP32[(n + 4) >> 2] = r.rangeMax),
      (HEAP32[t >> 2] = r.precision);
  }
  function _emscripten_glGetShaderSource(e, i, n, t) {
    var r,
      _ = GLctx.getShaderSource(GL.shaders[e]);
    _ &&
      (i > 0 && t
        ? ((r = stringToUTF8(_, t, i)), n && (HEAP32[n >> 2] = r))
        : n && (HEAP32[n >> 2] = 0));
  }
  function _emscripten_glGetShaderiv(e, i, n) {
    var t, r, _;
    return n
      ? (35716 == i
          ? ((t = GLctx.getShaderInfoLog(GL.shaders[e])),
            null === t && (t = "(unknown error)"),
            (HEAP32[n >> 2] = t.length + 1))
          : 35720 == i
          ? ((r = GLctx.getShaderSource(GL.shaders[e])),
            (_ = null === r || 0 == r.length ? 0 : r.length + 1),
            (HEAP32[n >> 2] = _))
          : (HEAP32[n >> 2] = GLctx.getShaderParameter(GL.shaders[e], i)),
        void 0)
      : (GL.recordError(1281), void 0);
  }
  function _emscripten_glGetString(e) {
    var i, n, t, r, _, o, l, u;
    if (GL.stringCache[e]) return GL.stringCache[e];
    switch (e) {
      case 7936:
      case 7937:
      case 37445:
      case 37446:
        i = allocate(
          intArrayFromString(GLctx.getParameter(e)),
          "i8",
          ALLOC_NORMAL
        );
        break;
      case 7938:
        (n = GLctx.getParameter(GLctx.VERSION)),
          (n =
            GLctx.canvas.GLctxObject.version >= 2
              ? "OpenGL ES 3.0 (" + n + ")"
              : "OpenGL ES 2.0 (" + n + ")"),
          (i = allocate(intArrayFromString(n), "i8", ALLOC_NORMAL));
        break;
      case 7939:
        for (
          t = GLctx.getSupportedExtensions(), r = [], _ = 0;
          _ < t.length;
          ++_
        )
          r.push(t[_]), r.push("GL_" + t[_]);
        i = allocate(intArrayFromString(r.join(" ")), "i8", ALLOC_NORMAL);
        break;
      case 35724:
        (o = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION)),
          (l = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/),
          (u = o.match(l)),
          null !== u &&
            (3 == u[1].length && (u[1] = u[1] + "0"),
            (o = "OpenGL ES GLSL ES " + u[1] + " (" + o + ")")),
          (i = allocate(intArrayFromString(o), "i8", ALLOC_NORMAL));
        break;
      default:
        return GL.recordError(1280), 0;
    }
    return (GL.stringCache[e] = i), i;
  }
  function _emscripten_glGetTexParameterfv(e, i, n) {
    return n
      ? ((HEAPF32[n >> 2] = GLctx.getTexParameter(e, i)), void 0)
      : (GL.recordError(1281), void 0);
  }
  function _emscripten_glGetTexParameteriv(e, i, n) {
    return n
      ? ((HEAP32[n >> 2] = GLctx.getTexParameter(e, i)), void 0)
      : (GL.recordError(1281), void 0);
  }
  function _emscripten_glGetUniformLocation(e, i) {
    var n, t, r, _, o, l;
    if (
      ((i = Pointer_stringify(i)), (n = 0), i.indexOf("]", i.length - 1) !== -1)
    ) {
      if (
        ((t = i.lastIndexOf("[")),
        (r = i.slice(t + 1, -1)),
        r.length > 0 && ((n = parseInt(r)), 0 > n))
      )
        return -1;
      i = i.slice(0, t);
    }
    return (
      (_ = GL.programInfos[e]),
      _ ? ((o = _.uniforms), (l = o[i]), l && n < l[0] ? l[1] + n : -1) : -1
    );
  }
  function emscriptenWebGLGetUniform(e, i, n, t) {
    var r, _;
    if (!n) return GL.recordError(1281), void 0;
    if (
      ((r = GLctx.getUniform(GL.programs[e], GL.uniforms[i])),
      "number" == typeof r || "boolean" == typeof r)
    )
      switch (t) {
        case "Integer":
          HEAP32[n >> 2] = r;
          break;
        case "Float":
          HEAPF32[n >> 2] = r;
          break;
        default:
          throw "internal emscriptenWebGLGetUniform() error, bad type: " + t;
      }
    else
      for (_ = 0; _ < r.length; _++)
        switch (t) {
          case "Integer":
            HEAP32[(n + 4 * _) >> 2] = r[_];
            break;
          case "Float":
            HEAPF32[(n + 4 * _) >> 2] = r[_];
            break;
          default:
            throw "internal emscriptenWebGLGetUniform() error, bad type: " + t;
        }
  }
  function _emscripten_glGetUniformfv(e, i, n) {
    emscriptenWebGLGetUniform(e, i, n, "Float");
  }
  function _emscripten_glGetUniformiv(e, i, n) {
    emscriptenWebGLGetUniform(e, i, n, "Integer");
  }
  function _emscripten_glGetVertexAttribPointerv(e, i, n) {
    return n
      ? ((HEAP32[n >> 2] = GLctx.getVertexAttribOffset(e, i)), void 0)
      : (GL.recordError(1281), void 0);
  }
  function emscriptenWebGLGetVertexAttrib(e, i, n, t) {
    var r, _;
    if (!n) return GL.recordError(1281), void 0;
    if (((r = GLctx.getVertexAttrib(e, i)), 34975 == i))
      HEAP32[n >> 2] = r["name"];
    else if ("number" == typeof r || "boolean" == typeof r)
      switch (t) {
        case "Integer":
          HEAP32[n >> 2] = r;
          break;
        case "Float":
          HEAPF32[n >> 2] = r;
          break;
        case "FloatToInteger":
          HEAP32[n >> 2] = Math.fround(r);
          break;
        default:
          throw (
            "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + t
          );
      }
    else
      for (_ = 0; _ < r.length; _++)
        switch (t) {
          case "Integer":
            HEAP32[(n + 4 * _) >> 2] = r[_];
            break;
          case "Float":
            HEAPF32[(n + 4 * _) >> 2] = r[_];
            break;
          case "FloatToInteger":
            HEAP32[(n + 4 * _) >> 2] = Math.fround(r[_]);
            break;
          default:
            throw (
              "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + t
            );
        }
  }
  function _emscripten_glGetVertexAttribfv(e, i, n) {
    emscriptenWebGLGetVertexAttrib(e, i, n, "Float");
  }
  function _emscripten_glGetVertexAttribiv(e, i, n) {
    emscriptenWebGLGetVertexAttrib(e, i, n, "FloatToInteger");
  }
  function _emscripten_glHint(e, i) {
    GLctx["hint"](e, i);
  }
  function _emscripten_glIsBuffer(e) {
    var i = GL.buffers[e];
    return i ? GLctx.isBuffer(i) : 0;
  }
  function _emscripten_glIsEnabled(e) {
    return GLctx["isEnabled"](e);
  }
  function _emscripten_glIsFramebuffer(e) {
    var i = GL.framebuffers[e];
    return i ? GLctx.isFramebuffer(i) : 0;
  }
  function _emscripten_glIsProgram(e) {
    return (e = GL.programs[e]), e ? GLctx.isProgram(e) : 0;
  }
  function _emscripten_glIsRenderbuffer(e) {
    var i = GL.renderbuffers[e];
    return i ? GLctx.isRenderbuffer(i) : 0;
  }
  function _emscripten_glIsShader(e) {
    var i = GL.shaders[e];
    return i ? GLctx.isShader(i) : 0;
  }
  function _emscripten_glIsTexture(e) {
    var e = GL.textures[e];
    return e ? GLctx.isTexture(e) : 0;
  }
  function _emscripten_glIsVertexArray(e) {
    var i = GL.vaos[e];
    return i ? GLctx["isVertexArray"](i) : 0;
  }
  function _emscripten_glLineWidth(e) {
    GLctx["lineWidth"](e);
  }
  function _emscripten_glLinkProgram(e) {
    GLctx.linkProgram(GL.programs[e]),
      (GL.programInfos[e] = null),
      GL.populateUniformTable(e);
  }
  function _emscripten_glLoadIdentity() {
    throw "Legacy GL function (glLoadIdentity) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.";
  }
  function _emscripten_glLoadMatrixf() {
    Module["printErr"]("missing function: emscripten_glLoadMatrixf"), abort(-1);
  }
  function _emscripten_glMatrixMode() {
    throw "Legacy GL function (glMatrixMode) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.";
  }
  function _emscripten_glNormalPointer() {
    Module["printErr"]("missing function: emscripten_glNormalPointer"),
      abort(-1);
  }
  function _emscripten_glPixelStorei(e, i) {
    3333 == e ? (GL.packAlignment = i) : 3317 == e && (GL.unpackAlignment = i),
      GLctx.pixelStorei(e, i);
  }
  function _emscripten_glPolygonOffset(e, i) {
    GLctx["polygonOffset"](e, i);
  }
  function emscriptenWebGLComputeImageSize(e, i, n, t) {
    function r(e, i) {
      return Math.floor((e + i - 1) / i) * i;
    }
    var _ = e * n,
      o = r(_, t);
    return 0 >= i ? 0 : (i - 1) * o + _;
  }
  function emscriptenWebGLGetTexPixelData(e, i, n, t, r, _) {
    var o, l, u;
    switch (i) {
      case 6406:
      case 6409:
      case 6402:
      case 6403:
      case 36244:
        l = 1;
        break;
      case 6410:
      case 33319:
      case 33320:
        l = 2;
        break;
      case 6407:
      case 35904:
      case 36248:
        l = 3;
        break;
      case 6408:
      case 35906:
      case 36249:
        l = 4;
        break;
      default:
        return GL.recordError(1280), null;
    }
    switch (e) {
      case 5121:
      case 5120:
        o = 1 * l;
        break;
      case 5123:
      case 36193:
      case 5131:
      case 5122:
        o = 2 * l;
        break;
      case 5125:
      case 5126:
      case 5124:
        o = 4 * l;
        break;
      case 34042:
      case 35902:
      case 33640:
      case 35899:
      case 34042:
        o = 4;
        break;
      case 33635:
      case 32819:
      case 32820:
        o = 2;
        break;
      default:
        return GL.recordError(1280), null;
    }
    switch (
      ((u = emscriptenWebGLComputeImageSize(n, t, o, GL.unpackAlignment)), e)
    ) {
      case 5120:
        return HEAP8.subarray(r, r + u);
      case 5121:
        return HEAPU8.subarray(r, r + u);
      case 5122:
        return HEAP16.subarray(r >> 1, (r + u) >> 1);
      case 5124:
        return HEAP32.subarray(r >> 2, (r + u) >> 2);
      case 5126:
        return HEAPF32.subarray(r >> 2, (r + u) >> 2);
      case 5125:
      case 34042:
      case 35902:
      case 33640:
      case 35899:
      case 34042:
        return HEAPU32.subarray(r >> 2, (r + u) >> 2);
      case 5123:
      case 33635:
      case 32819:
      case 32820:
      case 36193:
      case 5131:
        return HEAPU16.subarray(r >> 1, (r + u) >> 1);
      default:
        return GL.recordError(1280), null;
    }
  }
  function emscriptenWebGLGetHeapForType(e) {
    switch (e) {
      case 5120:
        return HEAP8;
      case 5121:
        return HEAPU8;
      case 5122:
        return HEAP16;
      case 5123:
      case 33635:
      case 32819:
      case 32820:
      case 36193:
      case 5131:
        return HEAPU16;
      case 5124:
        return HEAP32;
      case 5125:
      case 34042:
      case 35902:
      case 33640:
      case 35899:
      case 34042:
        return HEAPU32;
      case 5126:
        return HEAPF32;
      default:
        return null;
    }
  }
  function emscriptenWebGLGetShiftForType(e) {
    switch (e) {
      case 5120:
      case 5121:
        return 0;
      case 5122:
      case 5123:
      case 33635:
      case 32819:
      case 32820:
      case 36193:
      case 5131:
        return 1;
      case 5124:
      case 5126:
      case 5125:
      case 34042:
      case 35902:
      case 33640:
      case 35899:
      case 34042:
        return 2;
      default:
        return 0;
    }
  }
  function _emscripten_glReadPixels(e, i, n, t, r, _, o) {
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.currentPixelPackBufferBinding
          ? GLctx.readPixels(e, i, n, t, r, _, o)
          : GLctx.readPixels(
              e,
              i,
              n,
              t,
              r,
              _,
              emscriptenWebGLGetHeapForType(_),
              o >> emscriptenWebGLGetShiftForType(_)
            ),
        void 0
      );
    var l = emscriptenWebGLGetTexPixelData(_, r, n, t, o, r);
    return l
      ? (GLctx.readPixels(e, i, n, t, r, _, l), void 0)
      : (GL.recordError(1280), void 0);
  }
  function _emscripten_glReleaseShaderCompiler() {}
  function _emscripten_glRenderbufferStorage(e, i, n, t) {
    GLctx["renderbufferStorage"](e, i, n, t);
  }
  function _emscripten_glRotatef() {
    Module["printErr"]("missing function: emscripten_glRotatef"), abort(-1);
  }
  function _emscripten_glSampleCoverage(e, i) {
    GLctx.sampleCoverage(e, !!i);
  }
  function _emscripten_glScissor(e, i, n, t) {
    GLctx["scissor"](e, i, n, t);
  }
  function _emscripten_glShaderBinary() {
    GL.recordError(1280);
  }
  function _emscripten_glShaderSource(e, i, n, t) {
    var r = GL.getSource(e, i, n, t);
    GLctx.shaderSource(GL.shaders[e], r);
  }
  function _emscripten_glStencilFunc(e, i, n) {
    GLctx["stencilFunc"](e, i, n);
  }
  function _emscripten_glStencilFuncSeparate(e, i, n, t) {
    GLctx["stencilFuncSeparate"](e, i, n, t);
  }
  function _emscripten_glStencilMask(e) {
    GLctx["stencilMask"](e);
  }
  function _emscripten_glStencilMaskSeparate(e, i) {
    GLctx["stencilMaskSeparate"](e, i);
  }
  function _emscripten_glStencilOp(e, i, n) {
    GLctx["stencilOp"](e, i, n);
  }
  function _emscripten_glStencilOpSeparate(e, i, n, t) {
    GLctx["stencilOpSeparate"](e, i, n, t);
  }
  function _emscripten_glTexCoordPointer() {
    Module["printErr"]("missing function: emscripten_glTexCoordPointer"),
      abort(-1);
  }
  function _emscripten_glTexImage2D(e, i, n, t, r, _, o, l, u) {
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.currentPixelUnpackBufferBinding
          ? GLctx.texImage2D(e, i, n, t, r, _, o, l, u)
          : 0 != u
          ? GLctx.texImage2D(
              e,
              i,
              n,
              t,
              r,
              _,
              o,
              l,
              emscriptenWebGLGetHeapForType(l),
              u >> emscriptenWebGLGetShiftForType(l)
            )
          : GLctx.texImage2D(e, i, n, t, r, _, o, l, null),
        void 0
      );
    var a = null;
    u && (a = emscriptenWebGLGetTexPixelData(l, o, t, r, u, n)),
      GLctx.texImage2D(e, i, n, t, r, _, o, l, a);
  }
  function _emscripten_glTexParameterf(e, i, n) {
    GLctx["texParameterf"](e, i, n);
  }
  function _emscripten_glTexParameterfv(e, i, n) {
    var t = HEAPF32[n >> 2];
    GLctx.texParameterf(e, i, t);
  }
  function _emscripten_glTexParameteri(e, i, n) {
    GLctx["texParameteri"](e, i, n);
  }
  function _emscripten_glTexParameteriv(e, i, n) {
    var t = HEAP32[n >> 2];
    GLctx.texParameteri(e, i, t);
  }
  function _emscripten_glTexSubImage2D(e, i, n, t, r, _, o, l, u) {
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.currentPixelUnpackBufferBinding
          ? GLctx.texSubImage2D(e, i, n, t, r, _, o, l, u)
          : 0 != u
          ? GLctx.texSubImage2D(
              e,
              i,
              n,
              t,
              r,
              _,
              o,
              l,
              emscriptenWebGLGetHeapForType(l),
              u >> emscriptenWebGLGetShiftForType(l)
            )
          : GLctx.texSubImage2D(e, i, n, t, r, _, o, l, null),
        void 0
      );
    var a = null;
    u && (a = emscriptenWebGLGetTexPixelData(l, o, r, _, u, 0)),
      GLctx.texSubImage2D(e, i, n, t, r, _, o, l, a);
  }
  function _emscripten_glUniform1f(e, i) {
    GLctx.uniform1f(GL.uniforms[e], i);
  }
  function _emscripten_glUniform1fv(e, i, n) {
    var t, r;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return GLctx.uniform1fv(GL.uniforms[e], HEAPF32, n >> 2, i), void 0;
    if (i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (t = GL.miniTempBufferViews[i - 1], r = 0; i > r; ++r)
        t[r] = HEAPF32[(n + 4 * r) >> 2];
    else t = HEAPF32.subarray(n >> 2, (n + 4 * i) >> 2);
    GLctx.uniform1fv(GL.uniforms[e], t);
  }
  function _emscripten_glUniform1i(e, i) {
    GLctx.uniform1i(GL.uniforms[e], i);
  }
  function _emscripten_glUniform1iv(e, i, n) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.uniform1iv(GL.uniforms[e], HEAP32, n >> 2, i), void 0)
      : (GLctx.uniform1iv(
          GL.uniforms[e],
          HEAP32.subarray(n >> 2, (n + 4 * i) >> 2)
        ),
        void 0);
  }
  function _emscripten_glUniform2f(e, i, n) {
    GLctx.uniform2f(GL.uniforms[e], i, n);
  }
  function _emscripten_glUniform2fv(e, i, n) {
    var t, r;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return GLctx.uniform2fv(GL.uniforms[e], HEAPF32, n >> 2, 2 * i), void 0;
    if (2 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (t = GL.miniTempBufferViews[2 * i - 1], r = 0; 2 * i > r; r += 2)
        (t[r] = HEAPF32[(n + 4 * r) >> 2]),
          (t[r + 1] = HEAPF32[(n + (4 * r + 4)) >> 2]);
    else t = HEAPF32.subarray(n >> 2, (n + 8 * i) >> 2);
    GLctx.uniform2fv(GL.uniforms[e], t);
  }
  function _emscripten_glUniform2i(e, i, n) {
    GLctx.uniform2i(GL.uniforms[e], i, n);
  }
  function _emscripten_glUniform2iv(e, i, n) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.uniform2iv(GL.uniforms[e], HEAP32, n >> 2, 2 * i), void 0)
      : (GLctx.uniform2iv(
          GL.uniforms[e],
          HEAP32.subarray(n >> 2, (n + 8 * i) >> 2)
        ),
        void 0);
  }
  function _emscripten_glUniform3f(e, i, n, t) {
    GLctx.uniform3f(GL.uniforms[e], i, n, t);
  }
  function _emscripten_glUniform3fv(e, i, n) {
    var t, r;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return GLctx.uniform3fv(GL.uniforms[e], HEAPF32, n >> 2, 3 * i), void 0;
    if (3 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (t = GL.miniTempBufferViews[3 * i - 1], r = 0; 3 * i > r; r += 3)
        (t[r] = HEAPF32[(n + 4 * r) >> 2]),
          (t[r + 1] = HEAPF32[(n + (4 * r + 4)) >> 2]),
          (t[r + 2] = HEAPF32[(n + (4 * r + 8)) >> 2]);
    else t = HEAPF32.subarray(n >> 2, (n + 12 * i) >> 2);
    GLctx.uniform3fv(GL.uniforms[e], t);
  }
  function _emscripten_glUniform3i(e, i, n, t) {
    GLctx.uniform3i(GL.uniforms[e], i, n, t);
  }
  function _emscripten_glUniform3iv(e, i, n) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.uniform3iv(GL.uniforms[e], HEAP32, n >> 2, 3 * i), void 0)
      : (GLctx.uniform3iv(
          GL.uniforms[e],
          HEAP32.subarray(n >> 2, (n + 12 * i) >> 2)
        ),
        void 0);
  }
  function _emscripten_glUniform4f(e, i, n, t, r) {
    GLctx.uniform4f(GL.uniforms[e], i, n, t, r);
  }
  function _emscripten_glUniform4fv(e, i, n) {
    var t, r;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return GLctx.uniform4fv(GL.uniforms[e], HEAPF32, n >> 2, 4 * i), void 0;
    if (4 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (t = GL.miniTempBufferViews[4 * i - 1], r = 0; 4 * i > r; r += 4)
        (t[r] = HEAPF32[(n + 4 * r) >> 2]),
          (t[r + 1] = HEAPF32[(n + (4 * r + 4)) >> 2]),
          (t[r + 2] = HEAPF32[(n + (4 * r + 8)) >> 2]),
          (t[r + 3] = HEAPF32[(n + (4 * r + 12)) >> 2]);
    else t = HEAPF32.subarray(n >> 2, (n + 16 * i) >> 2);
    GLctx.uniform4fv(GL.uniforms[e], t);
  }
  function _emscripten_glUniform4i(e, i, n, t, r) {
    GLctx.uniform4i(GL.uniforms[e], i, n, t, r);
  }
  function _emscripten_glUniform4iv(e, i, n) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.uniform4iv(GL.uniforms[e], HEAP32, n >> 2, 4 * i), void 0)
      : (GLctx.uniform4iv(
          GL.uniforms[e],
          HEAP32.subarray(n >> 2, (n + 16 * i) >> 2)
        ),
        void 0);
  }
  function _emscripten_glUniformMatrix2fv(e, i, n, t) {
    var r, _;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.uniformMatrix2fv(GL.uniforms[e], !!n, HEAPF32, t >> 2, 4 * i),
        void 0
      );
    if (4 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (r = GL.miniTempBufferViews[4 * i - 1], _ = 0; 4 * i > _; _ += 4)
        (r[_] = HEAPF32[(t + 4 * _) >> 2]),
          (r[_ + 1] = HEAPF32[(t + (4 * _ + 4)) >> 2]),
          (r[_ + 2] = HEAPF32[(t + (4 * _ + 8)) >> 2]),
          (r[_ + 3] = HEAPF32[(t + (4 * _ + 12)) >> 2]);
    else r = HEAPF32.subarray(t >> 2, (t + 16 * i) >> 2);
    GLctx.uniformMatrix2fv(GL.uniforms[e], !!n, r);
  }
  function _emscripten_glUniformMatrix3fv(e, i, n, t) {
    var r, _;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.uniformMatrix3fv(GL.uniforms[e], !!n, HEAPF32, t >> 2, 9 * i),
        void 0
      );
    if (9 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (r = GL.miniTempBufferViews[9 * i - 1], _ = 0; 9 * i > _; _ += 9)
        (r[_] = HEAPF32[(t + 4 * _) >> 2]),
          (r[_ + 1] = HEAPF32[(t + (4 * _ + 4)) >> 2]),
          (r[_ + 2] = HEAPF32[(t + (4 * _ + 8)) >> 2]),
          (r[_ + 3] = HEAPF32[(t + (4 * _ + 12)) >> 2]),
          (r[_ + 4] = HEAPF32[(t + (4 * _ + 16)) >> 2]),
          (r[_ + 5] = HEAPF32[(t + (4 * _ + 20)) >> 2]),
          (r[_ + 6] = HEAPF32[(t + (4 * _ + 24)) >> 2]),
          (r[_ + 7] = HEAPF32[(t + (4 * _ + 28)) >> 2]),
          (r[_ + 8] = HEAPF32[(t + (4 * _ + 32)) >> 2]);
    else r = HEAPF32.subarray(t >> 2, (t + 36 * i) >> 2);
    GLctx.uniformMatrix3fv(GL.uniforms[e], !!n, r);
  }
  function _emscripten_glUniformMatrix4fv(e, i, n, t) {
    var r, _;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.uniformMatrix4fv(GL.uniforms[e], !!n, HEAPF32, t >> 2, 16 * i),
        void 0
      );
    if (16 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (r = GL.miniTempBufferViews[16 * i - 1], _ = 0; 16 * i > _; _ += 16)
        (r[_] = HEAPF32[(t + 4 * _) >> 2]),
          (r[_ + 1] = HEAPF32[(t + (4 * _ + 4)) >> 2]),
          (r[_ + 2] = HEAPF32[(t + (4 * _ + 8)) >> 2]),
          (r[_ + 3] = HEAPF32[(t + (4 * _ + 12)) >> 2]),
          (r[_ + 4] = HEAPF32[(t + (4 * _ + 16)) >> 2]),
          (r[_ + 5] = HEAPF32[(t + (4 * _ + 20)) >> 2]),
          (r[_ + 6] = HEAPF32[(t + (4 * _ + 24)) >> 2]),
          (r[_ + 7] = HEAPF32[(t + (4 * _ + 28)) >> 2]),
          (r[_ + 8] = HEAPF32[(t + (4 * _ + 32)) >> 2]),
          (r[_ + 9] = HEAPF32[(t + (4 * _ + 36)) >> 2]),
          (r[_ + 10] = HEAPF32[(t + (4 * _ + 40)) >> 2]),
          (r[_ + 11] = HEAPF32[(t + (4 * _ + 44)) >> 2]),
          (r[_ + 12] = HEAPF32[(t + (4 * _ + 48)) >> 2]),
          (r[_ + 13] = HEAPF32[(t + (4 * _ + 52)) >> 2]),
          (r[_ + 14] = HEAPF32[(t + (4 * _ + 56)) >> 2]),
          (r[_ + 15] = HEAPF32[(t + (4 * _ + 60)) >> 2]);
    else r = HEAPF32.subarray(t >> 2, (t + 64 * i) >> 2);
    GLctx.uniformMatrix4fv(GL.uniforms[e], !!n, r);
  }
  function _emscripten_glUseProgram(e) {
    GLctx.useProgram(e ? GL.programs[e] : null);
  }
  function _emscripten_glValidateProgram(e) {
    GLctx.validateProgram(GL.programs[e]);
  }
  function _emscripten_glVertexAttrib1f(e, i) {
    GLctx["vertexAttrib1f"](e, i);
  }
  function _emscripten_glVertexAttrib1fv(e, i) {
    GLctx.vertexAttrib1f(e, HEAPF32[i >> 2]);
  }
  function _emscripten_glVertexAttrib2f(e, i, n) {
    GLctx["vertexAttrib2f"](e, i, n);
  }
  function _emscripten_glVertexAttrib2fv(e, i) {
    GLctx.vertexAttrib2f(e, HEAPF32[i >> 2], HEAPF32[(i + 4) >> 2]);
  }
  function _emscripten_glVertexAttrib3f(e, i, n, t) {
    GLctx["vertexAttrib3f"](e, i, n, t);
  }
  function _emscripten_glVertexAttrib3fv(e, i) {
    GLctx.vertexAttrib3f(
      e,
      HEAPF32[i >> 2],
      HEAPF32[(i + 4) >> 2],
      HEAPF32[(i + 8) >> 2]
    );
  }
  function _emscripten_glVertexAttrib4f(e, i, n, t, r) {
    GLctx["vertexAttrib4f"](e, i, n, t, r);
  }
  function _emscripten_glVertexAttrib4fv(e, i) {
    GLctx.vertexAttrib4f(
      e,
      HEAPF32[i >> 2],
      HEAPF32[(i + 4) >> 2],
      HEAPF32[(i + 8) >> 2],
      HEAPF32[(i + 12) >> 2]
    );
  }
  function _emscripten_glVertexAttribDivisor(e, i) {
    GLctx["vertexAttribDivisor"](e, i);
  }
  function _emscripten_glVertexAttribPointer(e, i, n, t, r, _) {
    GLctx.vertexAttribPointer(e, i, n, !!t, r, _);
  }
  function _emscripten_glVertexPointer() {
    throw "Legacy GL function (glVertexPointer) called. If you want legacy GL emulation, you need to compile with -s LEGACY_GL_EMULATION=1 to enable legacy GL emulation.";
  }
  function _emscripten_glViewport(e, i, n, t) {
    GLctx["viewport"](e, i, n, t);
  }
  function _emscripten_is_webgl_context_lost(e) {
    return Module["ctx"] ? Module["ctx"].isContextLost() : !0;
  }
  function _longjmp(e, i) {
    throw (Module["setThrew"](e, i || 1), "longjmp");
  }
  function _emscripten_longjmp(e, i) {
    _longjmp(e, i);
  }
  function __setLetterbox(e, i, n) {
    JSEvents.isInternetExplorer()
      ? ((e.style.marginLeft = e.style.marginRight = n + "px"),
        (e.style.marginTop = e.style.marginBottom = i + "px"))
      : ((e.style.paddingLeft = e.style.paddingRight = n + "px"),
        (e.style.paddingTop = e.style.paddingBottom = i + "px"));
  }
  function _emscripten_do_request_fullscreen(e, i) {
    if ("undefined" == typeof JSEvents.fullscreenEnabled()) return -1;
    if (!JSEvents.fullscreenEnabled()) return -3;
    if ((e || (e = "#canvas"), (e = JSEvents.findEventTarget(e)), !e))
      return -4;
    if (
      !(
        e.requestFullscreen ||
        e.msRequestFullscreen ||
        e.mozRequestFullScreen ||
        e.mozRequestFullscreen ||
        e.webkitRequestFullscreen
      )
    )
      return -3;
    var n = JSEvents.canPerformEventHandlerRequests();
    return n
      ? JSEvents.requestFullscreen(e, i)
      : i.deferUntilInEventHandler
      ? (JSEvents.deferCall(JSEvents.requestFullscreen, 1, [e, i]), 1)
      : -2;
  }
  function _emscripten_request_fullscreen(e, i) {
    var n = {};
    return (
      (n.scaleMode = 0),
      (n.canvasResolutionScaleMode = 0),
      (n.filteringMode = 0),
      (n.deferUntilInEventHandler = i),
      _emscripten_do_request_fullscreen(e, n)
    );
  }
  function _emscripten_request_pointerlock(e, i) {
    if ((e || (e = "#canvas"), (e = JSEvents.findEventTarget(e)), !e))
      return -4;
    if (
      !(
        e.requestPointerLock ||
        e.mozRequestPointerLock ||
        e.webkitRequestPointerLock ||
        e.msRequestPointerLock
      )
    )
      return -1;
    var n = JSEvents.canPerformEventHandlerRequests();
    return n
      ? JSEvents.requestPointerLock(e)
      : i
      ? (JSEvents.deferCall(JSEvents.requestPointerLock, 2, [e]), 1)
      : -2;
  }
  function _emscripten_set_blur_callback(e, i, n, t) {
    return JSEvents.registerFocusEventCallback(e, i, n, t, 12, "blur"), 0;
  }
  function _emscripten_set_canvas_size(e, i) {
    Browser.setCanvasSize(e, i);
  }
  function _emscripten_set_devicemotion_callback(e, i, n) {
    return (
      JSEvents.registerDeviceMotionEventCallback(
        window,
        e,
        i,
        n,
        17,
        "devicemotion"
      ),
      0
    );
  }
  function _emscripten_set_deviceorientation_callback(e, i, n) {
    return (
      JSEvents.registerDeviceOrientationEventCallback(
        window,
        e,
        i,
        n,
        16,
        "deviceorientation"
      ),
      0
    );
  }
  function _emscripten_set_focus_callback(e, i, n, t) {
    return JSEvents.registerFocusEventCallback(e, i, n, t, 13, "focus"), 0;
  }
  function _emscripten_set_fullscreenchange_callback(e, i, n, t) {
    if ("undefined" == typeof JSEvents.fullscreenEnabled()) return -1;
    if (e) {
      if (((e = JSEvents.findEventTarget(e)), !e)) return -4;
    } else e = document;
    return (
      JSEvents.registerFullscreenChangeEventCallback(
        e,
        i,
        n,
        t,
        19,
        "fullscreenchange"
      ),
      JSEvents.registerFullscreenChangeEventCallback(
        e,
        i,
        n,
        t,
        19,
        "mozfullscreenchange"
      ),
      JSEvents.registerFullscreenChangeEventCallback(
        e,
        i,
        n,
        t,
        19,
        "webkitfullscreenchange"
      ),
      JSEvents.registerFullscreenChangeEventCallback(
        e,
        i,
        n,
        t,
        19,
        "msfullscreenchange"
      ),
      0
    );
  }
  function _emscripten_set_keydown_callback(e, i, n, t) {
    return JSEvents.registerKeyEventCallback(e, i, n, t, 2, "keydown"), 0;
  }
  function _emscripten_set_keypress_callback(e, i, n, t) {
    return JSEvents.registerKeyEventCallback(e, i, n, t, 1, "keypress"), 0;
  }
  function _emscripten_set_keyup_callback(e, i, n, t) {
    return JSEvents.registerKeyEventCallback(e, i, n, t, 3, "keyup"), 0;
  }
  function _emscripten_set_mousedown_callback(e, i, n, t) {
    return JSEvents.registerMouseEventCallback(e, i, n, t, 5, "mousedown"), 0;
  }
  function _emscripten_set_mousemove_callback(e, i, n, t) {
    return JSEvents.registerMouseEventCallback(e, i, n, t, 8, "mousemove"), 0;
  }
  function _emscripten_set_mouseup_callback(e, i, n, t) {
    return JSEvents.registerMouseEventCallback(e, i, n, t, 6, "mouseup"), 0;
  }
  function _emscripten_set_touchcancel_callback(e, i, n, t) {
    return (
      JSEvents.registerTouchEventCallback(e, i, n, t, 25, "touchcancel"), 0
    );
  }
  function _emscripten_set_touchend_callback(e, i, n, t) {
    return JSEvents.registerTouchEventCallback(e, i, n, t, 23, "touchend"), 0;
  }
  function _emscripten_set_touchmove_callback(e, i, n, t) {
    return JSEvents.registerTouchEventCallback(e, i, n, t, 24, "touchmove"), 0;
  }
  function _emscripten_set_touchstart_callback(e, i, n, t) {
    return JSEvents.registerTouchEventCallback(e, i, n, t, 22, "touchstart"), 0;
  }
  function _emscripten_set_wheel_callback(e, i, n, t) {
    return (
      (e = JSEvents.findEventTarget(e)),
      "undefined" != typeof e.onwheel
        ? (JSEvents.registerWheelEventCallback(e, i, n, t, 9, "wheel"), 0)
        : "undefined" != typeof e.onmousewheel
        ? (JSEvents.registerWheelEventCallback(e, i, n, t, 9, "mousewheel"), 0)
        : -1
    );
  }
  function _emscripten_webgl_create_context(e, i) {
    var n,
      t,
      r = {};
    return (
      (r["alpha"] = !!HEAP32[i >> 2]),
      (r["depth"] = !!HEAP32[(i + 4) >> 2]),
      (r["stencil"] = !!HEAP32[(i + 8) >> 2]),
      (r["antialias"] = !!HEAP32[(i + 12) >> 2]),
      (r["premultipliedAlpha"] = !!HEAP32[(i + 16) >> 2]),
      (r["preserveDrawingBuffer"] = !!HEAP32[(i + 20) >> 2]),
      (r["preferLowPowerToHighPerformance"] = !!HEAP32[(i + 24) >> 2]),
      (r["failIfMajorPerformanceCaveat"] = !!HEAP32[(i + 28) >> 2]),
      (r["majorVersion"] = HEAP32[(i + 32) >> 2]),
      (r["minorVersion"] = HEAP32[(i + 36) >> 2]),
      (r["explicitSwapControl"] = HEAP32[(i + 44) >> 2]),
      (e = Pointer_stringify(e)),
      (n =
        (e && "#canvas" !== e) || !Module["canvas"]
          ? GL.offscreenCanvases[e] || JSEvents.findEventTarget(e)
          : Module["canvas"].id
          ? GL.offscreenCanvases[Module["canvas"].id] ||
            JSEvents.findEventTarget(Module["canvas"].id)
          : Module["canvas"]),
      n
        ? r["explicitSwapControl"]
          ? (console.error(
              "emscripten_webgl_create_context failed: explicitSwapControl is not supported, please rebuild with -s OFFSCREENCANVAS_SUPPORT=1 to enable targeting the experimental OffscreenCanvas specification!"
            ),
            0)
          : ((t = GL.createContext(n, r)), t)
        : 0
    );
  }
  function _emscripten_webgl_destroy_context(e) {
    GL.deleteContext(e);
  }
  function _emscripten_webgl_enable_extension(e, i) {
    var n,
      t = GL.getContext(e),
      r = Pointer_stringify(i);
    return (
      0 == r.indexOf("GL_") && (r = r.substr(3)),
      (n = t.GLctx.getExtension(r)),
      n ? 1 : 0
    );
  }
  function _emscripten_webgl_get_current_context() {
    return GL.currentContext ? GL.currentContext.handle : 0;
  }
  function _emscripten_webgl_make_context_current(e) {
    var i = GL.makeContextCurrent(e);
    return i ? 0 : -5;
  }
  function __exit(e) {
    Module["exit"](e);
  }
  function _exit(e) {
    __exit(e);
  }
  function _flock(e, i) {
    return 0;
  }
  function _getpwuid(e) {
    return 0;
  }
  function _gettimeofday(e) {
    var i = Date.now();
    return (
      (HEAP32[e >> 2] = (i / 1e3) | 0),
      (HEAP32[(e + 4) >> 2] = ((i % 1e3) * 1e3) | 0),
      0
    );
  }
  function _glActiveTexture(e) {
    GLctx["activeTexture"](e);
  }
  function _glAttachShader(e, i) {
    GLctx.attachShader(GL.programs[e], GL.shaders[i]);
  }
  function _glBeginQuery(e, i) {
    GLctx["beginQuery"](e, i ? GL.queries[i] : null);
  }
  function _glBeginTransformFeedback(e) {
    GLctx["beginTransformFeedback"](e);
  }
  function _glBindAttribLocation(e, i, n) {
    (n = Pointer_stringify(n)), GLctx.bindAttribLocation(GL.programs[e], i, n);
  }
  function _glBindBuffer(e, i) {
    var n = i ? GL.buffers[i] : null;
    35051 == e
      ? (GLctx.currentPixelPackBufferBinding = i)
      : 35052 == e && (GLctx.currentPixelUnpackBufferBinding = i),
      GLctx.bindBuffer(e, n);
  }
  function _glBindBufferBase(e, i, n) {
    var t = n ? GL.buffers[n] : null;
    GLctx["bindBufferBase"](e, i, t);
  }
  function _glBindFramebuffer(e, i) {
    GLctx.bindFramebuffer(e, i ? GL.framebuffers[i] : null);
  }
  function _glBindRenderbuffer(e, i) {
    GLctx.bindRenderbuffer(e, i ? GL.renderbuffers[i] : null);
  }
  function _glBindSampler(e, i) {
    GLctx["bindSampler"](e, i ? GL.samplers[i] : null);
  }
  function _glBindTexture(e, i) {
    GLctx.bindTexture(e, i ? GL.textures[i] : null);
  }
  function _glBindTransformFeedback(e, i) {
    var n = i ? GL.transformFeedbacks[i] : null;
    return i && !n
      ? (GL.recordError(1282), void 0)
      : (GLctx["bindTransformFeedback"](e, n), void 0);
  }
  function _glBindVertexArray(e) {
    GLctx["bindVertexArray"](GL.vaos[e]);
  }
  function _glBlendEquation(e) {
    GLctx["blendEquation"](e);
  }
  function _glBlendEquationSeparate(e, i) {
    GLctx["blendEquationSeparate"](e, i);
  }
  function _glBlendFuncSeparate(e, i, n, t) {
    GLctx["blendFuncSeparate"](e, i, n, t);
  }
  function _glBlitFramebuffer(e, i, n, t, r, _, o, l, u, a) {
    GLctx["blitFramebuffer"](e, i, n, t, r, _, o, l, u, a);
  }
  function _glBufferData(e, i, n, t) {
    if (n) {
      if (GL.currentContext.supportsWebGL2EntryPoints)
        return GLctx.bufferData(e, HEAPU8, t, n, i), void 0;
      GLctx.bufferData(e, HEAPU8.subarray(n, n + i), t);
    } else GLctx.bufferData(e, i, t);
  }
  function _glBufferSubData(e, i, n, t) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.bufferSubData(e, i, HEAPU8, t, n), void 0)
      : (GLctx.bufferSubData(e, i, HEAPU8.subarray(t, t + n)), void 0);
  }
  function _glCheckFramebufferStatus(e) {
    return GLctx["checkFramebufferStatus"](e);
  }
  function _glClear(e) {
    GLctx["clear"](e);
  }
  function _glClearColor(e, i, n, t) {
    GLctx["clearColor"](e, i, n, t);
  }
  function _glClearDepthf(e) {
    GLctx["clearDepth"](e);
  }
  function _glClearStencil(e) {
    GLctx["clearStencil"](e);
  }
  function _glClientWaitSync(e, i, n, t) {
    (n >>>= 0), (t >>>= 0);
    var r = 4294967295 == n && 4294967295 == t ? -1 : makeBigInt(n, t, !0);
    return GLctx.clientWaitSync(GL.syncs[e], i, r);
  }
  function _glColorMask(e, i, n, t) {
    GLctx.colorMask(!!e, !!i, !!n, !!t);
  }
  function _glCompileShader(e) {
    GLctx.compileShader(GL.shaders[e]);
  }
  function _glCompressedTexImage2D(e, i, n, t, r, _, o, l) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx["compressedTexImage2D"](e, i, n, t, r, _, HEAPU8, l, o), void 0)
      : (GLctx["compressedTexImage2D"](
          e,
          i,
          n,
          t,
          r,
          _,
          l ? HEAPU8.subarray(l, l + o) : null
        ),
        void 0);
  }
  function _glCompressedTexSubImage2D(e, i, n, t, r, _, o, l, u) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx["compressedTexSubImage2D"](e, i, n, t, r, _, o, HEAPU8, u, l),
        void 0)
      : (GLctx["compressedTexSubImage2D"](
          e,
          i,
          n,
          t,
          r,
          _,
          o,
          u ? HEAPU8.subarray(u, u + l) : null
        ),
        void 0);
  }
  function _glCompressedTexSubImage3D(e, i, n, t, r, _, o, l, u, a, s) {
    GL.currentContext.supportsWebGL2EntryPoints
      ? GLctx["compressedTexSubImage3D"](
          e,
          i,
          n,
          t,
          r,
          _,
          o,
          l,
          u,
          HEAPU8,
          s,
          a
        )
      : GLctx["compressedTexSubImage3D"](
          e,
          i,
          n,
          t,
          r,
          _,
          o,
          l,
          u,
          s ? HEAPU8.subarray(s, s + a) : null
        );
  }
  function _glCopyBufferSubData(e, i, n, t, r) {
    GLctx["copyBufferSubData"](e, i, n, t, r);
  }
  function _glCopyTexImage2D(e, i, n, t, r, _, o, l) {
    GLctx["copyTexImage2D"](e, i, n, t, r, _, o, l);
  }
  function _glCopyTexSubImage2D(e, i, n, t, r, _, o, l) {
    GLctx["copyTexSubImage2D"](e, i, n, t, r, _, o, l);
  }
  function _glCreateProgram() {
    var e = GL.getNewId(GL.programs),
      i = GLctx.createProgram();
    return (i.name = e), (GL.programs[e] = i), e;
  }
  function _glCreateShader(e) {
    var i = GL.getNewId(GL.shaders);
    return (GL.shaders[i] = GLctx.createShader(e)), i;
  }
  function _glCullFace(e) {
    GLctx["cullFace"](e);
  }
  function _glDeleteBuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.buffers[t]),
        r &&
          (GLctx.deleteBuffer(r),
          (r.name = 0),
          (GL.buffers[t] = null),
          t == GL.currArrayBuffer && (GL.currArrayBuffer = 0),
          t == GL.currElementArrayBuffer && (GL.currElementArrayBuffer = 0));
  }
  function _glDeleteFramebuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; ++n)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.framebuffers[t]),
        r &&
          (GLctx.deleteFramebuffer(r),
          (r.name = 0),
          (GL.framebuffers[t] = null));
  }
  function _glDeleteProgram(e) {
    if (e) {
      var i = GL.programs[e];
      if (!i) return GL.recordError(1281), void 0;
      GLctx.deleteProgram(i),
        (i.name = 0),
        (GL.programs[e] = null),
        (GL.programInfos[e] = null);
    }
  }
  function _glDeleteQueries(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.queries[t]),
        r && (GLctx["deleteQuery"](r), (GL.queries[t] = null));
  }
  function _glDeleteRenderbuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.renderbuffers[t]),
        r &&
          (GLctx.deleteRenderbuffer(r),
          (r.name = 0),
          (GL.renderbuffers[t] = null));
  }
  function _glDeleteSamplers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.samplers[t]),
        r && (GLctx["deleteSampler"](r), (r.name = 0), (GL.samplers[t] = null));
  }
  function _glDeleteShader(e) {
    if (e) {
      var i = GL.shaders[e];
      if (!i) return GL.recordError(1281), void 0;
      GLctx.deleteShader(i), (GL.shaders[e] = null);
    }
  }
  function _glDeleteSync(e) {
    if (e) {
      var i = GL.syncs[e];
      if (!i) return GL.recordError(1281), void 0;
      GLctx.deleteSync(i), (i.name = 0), (GL.syncs[e] = null);
    }
  }
  function _glDeleteTextures(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.textures[t]),
        r && (GLctx.deleteTexture(r), (r.name = 0), (GL.textures[t] = null));
  }
  function _glDeleteTransformFeedbacks(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        (r = GL.transformFeedbacks[t]),
        r &&
          (GLctx["deleteTransformFeedback"](r),
          (r.name = 0),
          (GL.transformFeedbacks[t] = null));
  }
  function _glDeleteVertexArrays(e, i) {
    var n, t;
    for (n = 0; e > n; n++)
      (t = HEAP32[(i + 4 * n) >> 2]),
        GLctx["deleteVertexArray"](GL.vaos[t]),
        (GL.vaos[t] = null);
  }
  function _glDepthFunc(e) {
    GLctx["depthFunc"](e);
  }
  function _glDepthMask(e) {
    GLctx.depthMask(!!e);
  }
  function _glDetachShader(e, i) {
    GLctx.detachShader(GL.programs[e], GL.shaders[i]);
  }
  function _glDisable(e) {
    GLctx["disable"](e);
  }
  function _glDisableVertexAttribArray(e) {
    GLctx.disableVertexAttribArray(e);
  }
  function _glDrawArrays(e, i, n) {
    GLctx.drawArrays(e, i, n);
  }
  function _glDrawArraysInstanced(e, i, n, t) {
    GLctx["drawArraysInstanced"](e, i, n, t);
  }
  function _glDrawBuffers(e, i) {
    var n,
      t = GL.tempFixedLengthArray[e];
    for (n = 0; e > n; n++) t[n] = HEAP32[(i + 4 * n) >> 2];
    GLctx["drawBuffers"](t);
  }
  function _glDrawElements(e, i, n, t) {
    GLctx.drawElements(e, i, n, t);
  }
  function _glDrawElementsInstanced(e, i, n, t, r) {
    GLctx["drawElementsInstanced"](e, i, n, t, r);
  }
  function _glEnable(e) {
    GLctx["enable"](e);
  }
  function _glEnableVertexAttribArray(e) {
    GLctx.enableVertexAttribArray(e);
  }
  function _glEndQuery(e) {
    GLctx["endQuery"](e);
  }
  function _glEndTransformFeedback() {
    GLctx["endTransformFeedback"]();
  }
  function _glFenceSync(e, i) {
    var n,
      t = GLctx.fenceSync(e, i);
    return t
      ? ((n = GL.getNewId(GL.syncs)), (t.name = n), (GL.syncs[n] = t), n)
      : 0;
  }
  function _glFinish() {
    GLctx["finish"]();
  }
  function _glFlush() {
    GLctx["flush"]();
  }
  function emscriptenWebGLGetBufferBinding(e) {
    switch (e) {
      case 34962:
        e = 34964;
        break;
      case 34963:
        e = 34965;
        break;
      case 35051:
        e = 35053;
        break;
      case 35052:
        e = 35055;
        break;
      case 35982:
        e = 35983;
        break;
      case 36662:
        e = 36662;
        break;
      case 36663:
        e = 36663;
        break;
      case 35345:
        e = 35368;
    }
    var i = GLctx.getParameter(e);
    return i ? 0 | i.name : 0;
  }
  function emscriptenWebGLValidateMapBufferTarget(e) {
    switch (e) {
      case 34962:
      case 34963:
      case 36662:
      case 36663:
      case 35051:
      case 35052:
      case 35882:
      case 35982:
      case 35345:
        return !0;
      default:
        return !1;
    }
  }
  function _glFlushMappedBufferRange(e, i, n) {
    if (!emscriptenWebGLValidateMapBufferTarget(e))
      return (
        GL.recordError(1280),
        Module.printErr("GL_INVALID_ENUM in glFlushMappedBufferRange"),
        void 0
      );
    var t = GL.mappedBuffers[emscriptenWebGLGetBufferBinding(e)];
    return t
      ? 16 & t.access
        ? 0 > i || 0 > n || i + n > t.length
          ? (GL.recordError(1281),
            Module.printError("invalid range in glFlushMappedBufferRange"),
            void 0)
          : (GLctx.bufferSubData(
              e,
              t.offset,
              HEAPU8.subarray(t.mem + i, t.mem + i + n)
            ),
            void 0)
        : (GL.recordError(1282),
          Module.printError(
            "buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange"
          ),
          void 0)
      : (GL.recordError(1282),
        Module.printError(
          "buffer was never mapped in glFlushMappedBufferRange"
        ),
        void 0);
  }
  function _glFramebufferRenderbuffer(e, i, n, t) {
    GLctx.framebufferRenderbuffer(e, i, n, GL.renderbuffers[t]);
  }
  function _glFramebufferTexture2D(e, i, n, t, r) {
    GLctx.framebufferTexture2D(e, i, n, GL.textures[t], r);
  }
  function _glFramebufferTextureLayer(e, i, n, t, r) {
    GLctx.framebufferTextureLayer(e, i, GL.textures[n], t, r);
  }
  function _glFrontFace(e) {
    GLctx["frontFace"](e);
  }
  function _glGenBuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx.createBuffer()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.buffers)),
        (t.name = r),
        (GL.buffers[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _glGenFramebuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; ++n) {
      if (((t = GLctx.createFramebuffer()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.framebuffers)),
        (t.name = r),
        (GL.framebuffers[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _glGenQueries(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx["createQuery"]()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.queries)),
        (t.name = r),
        (GL.queries[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _glGenRenderbuffers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx.createRenderbuffer()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.renderbuffers)),
        (t.name = r),
        (GL.renderbuffers[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _glGenSamplers(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx["createSampler"]()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.samplers)),
        (t.name = r),
        (GL.samplers[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _glGenTextures(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx.createTexture()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.textures)),
        (t.name = r),
        (GL.textures[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _glGenTransformFeedbacks(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx["createTransformFeedback"]()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.transformFeedbacks)),
        (t.name = r),
        (GL.transformFeedbacks[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _glGenVertexArrays(e, i) {
    var n, t, r;
    for (n = 0; e > n; n++) {
      if (((t = GLctx["createVertexArray"]()), !t)) {
        GL.recordError(1282);
        while (e > n) HEAP32[(i + 4 * n++) >> 2] = 0;
        return;
      }
      (r = GL.getNewId(GL.vaos)),
        (t.name = r),
        (GL.vaos[r] = t),
        (HEAP32[(i + 4 * n) >> 2] = r);
    }
  }
  function _glGenerateMipmap(e) {
    GLctx["generateMipmap"](e);
  }
  function _glGetActiveAttrib(e, i, n, t, r, _, o) {
    var l, u;
    (e = GL.programs[e]),
      (l = GLctx.getActiveAttrib(e, i)),
      l &&
        (n > 0 && o
          ? ((u = stringToUTF8(l.name, o, n)), t && (HEAP32[t >> 2] = u))
          : t && (HEAP32[t >> 2] = 0),
        r && (HEAP32[r >> 2] = l.size),
        _ && (HEAP32[_ >> 2] = l.type));
  }
  function _glGetActiveUniform(e, i, n, t, r, _, o) {
    var l, u;
    (e = GL.programs[e]),
      (l = GLctx.getActiveUniform(e, i)),
      l &&
        (n > 0 && o
          ? ((u = stringToUTF8(l.name, o, n)), t && (HEAP32[t >> 2] = u))
          : t && (HEAP32[t >> 2] = 0),
        r && (HEAP32[r >> 2] = l.size),
        _ && (HEAP32[_ >> 2] = l.type));
  }
  function _glGetActiveUniformBlockName(e, i, n, t, r) {
    var _, o;
    (e = GL.programs[e]),
      (_ = GLctx["getActiveUniformBlockName"](e, i)),
      _ &&
        (r && n > 0
          ? ((o = stringToUTF8(_, r, n)), t && (HEAP32[t >> 2] = o))
          : t && (HEAP32[t >> 2] = 0));
  }
  function _glGetActiveUniformBlockiv(e, i, n, t) {
    var r, _, o;
    if (!t) return GL.recordError(1281), void 0;
    switch (((e = GL.programs[e]), n)) {
      case 35393:
        return (
          (r = GLctx["getActiveUniformBlockName"](e, i)),
          (HEAP32[t >> 2] = r.length + 1),
          void 0
        );
      default:
        if (((_ = GLctx["getActiveUniformBlockParameter"](e, i, n)), !_))
          return;
        if ("number" == typeof _) HEAP32[t >> 2] = _;
        else for (o = 0; o < _.length; o++) HEAP32[(t + 4 * o) >> 2] = _[o];
    }
  }
  function _glGetActiveUniformsiv(e, i, n, t, r) {
    var _, o, l, u;
    if (!r) return GL.recordError(1281), void 0;
    if (i > 0 && 0 == n) return GL.recordError(1281), void 0;
    for (e = GL.programs[e], _ = [], o = 0; i > o; o++)
      _.push(HEAP32[(n + 4 * o) >> 2]);
    if (((l = GLctx["getActiveUniforms"](e, _, t)), l))
      for (u = l.length, o = 0; u > o; o++) HEAP32[(r + 4 * o) >> 2] = l[o];
  }
  function _glGetAttribLocation(e, i) {
    return (
      (e = GL.programs[e]),
      (i = Pointer_stringify(i)),
      GLctx.getAttribLocation(e, i)
    );
  }
  function _glGetError() {
    if (GL.lastError) {
      var e = GL.lastError;
      return (GL.lastError = 0), e;
    }
    return GLctx.getError();
  }
  function _glGetFramebufferAttachmentParameteriv(e, i, n, t) {
    var r = GLctx.getFramebufferAttachmentParameter(e, i, n);
    HEAP32[t >> 2] = r;
  }
  function emscriptenWebGLGetIndexed(e, i, n, t) {
    var r, _;
    if (!n) return GL.recordError(1281), void 0;
    switch (((r = GLctx["getIndexedParameter"](e, i)), typeof r)) {
      case "boolean":
        _ = r ? 1 : 0;
        break;
      case "number":
        _ = r;
        break;
      case "object":
        if (null === r)
          switch (e) {
            case 35983:
            case 35368:
              _ = 0;
              break;
            default:
              return GL.recordError(1280), void 0;
          }
        else {
          if (!(r instanceof WebGLBuffer)) return GL.recordError(1280), void 0;
          _ = 0 | r.name;
        }
        break;
      default:
        return GL.recordError(1280), void 0;
    }
    switch (t) {
      case "Integer64":
        (tempI64 = [
          _ >>> 0,
          ((tempDouble = _),
          +Math_abs(tempDouble) >= 1
            ? tempDouble > 0
              ? (0 |
                  Math_min(
                    +Math_floor(tempDouble / 4294967296),
                    4294967295
                  )) >>>
                0
              : ~~+Math_ceil(
                  (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                ) >>> 0
            : 0),
        ]),
          (HEAP32[n >> 2] = tempI64[0]),
          (HEAP32[(n + 4) >> 2] = tempI64[1]);
        break;
      case "Integer":
        HEAP32[n >> 2] = _;
        break;
      case "Float":
        HEAPF32[n >> 2] = _;
        break;
      case "Boolean":
        HEAP8[n >> 0] = _ ? 1 : 0;
        break;
      default:
        throw "internal emscriptenWebGLGetIndexed() error, bad type: " + t;
    }
  }
  function _glGetIntegeri_v(e, i, n) {
    emscriptenWebGLGetIndexed(e, i, n, "Integer");
  }
  function _glGetIntegerv(e, i) {
    emscriptenWebGLGet(e, i, "Integer");
  }
  function _glGetProgramBinary(e, i, n, t, r) {
    GL.recordError(1282);
  }
  function _glGetProgramInfoLog(e, i, n, t) {
    var r,
      _ = GLctx.getProgramInfoLog(GL.programs[e]);
    null === _ && (_ = "(unknown error)"),
      i > 0 && t
        ? ((r = stringToUTF8(_, t, i)), n && (HEAP32[n >> 2] = r))
        : n && (HEAP32[n >> 2] = 0);
  }
  function _glGetProgramiv(e, i, n) {
    var t, r, _, o, l, u, a;
    if (!n) return GL.recordError(1281), void 0;
    if (e >= GL.counter) return GL.recordError(1281), void 0;
    if (((t = GL.programInfos[e]), !t)) return GL.recordError(1282), void 0;
    if (35716 == i)
      (r = GLctx.getProgramInfoLog(GL.programs[e])),
        null === r && (r = "(unknown error)"),
        (HEAP32[n >> 2] = r.length + 1);
    else if (35719 == i) HEAP32[n >> 2] = t.maxUniformLength;
    else if (35722 == i) {
      if (t.maxAttributeLength == -1)
        for (
          e = GL.programs[e],
            _ = GLctx.getProgramParameter(e, GLctx.ACTIVE_ATTRIBUTES),
            t.maxAttributeLength = 0,
            o = 0;
          _ > o;
          ++o
        )
          (l = GLctx.getActiveAttrib(e, o)),
            (t.maxAttributeLength = Math.max(
              t.maxAttributeLength,
              l.name.length + 1
            ));
      HEAP32[n >> 2] = t.maxAttributeLength;
    } else if (35381 == i) {
      if (t.maxUniformBlockNameLength == -1)
        for (
          e = GL.programs[e],
            u = GLctx.getProgramParameter(e, GLctx.ACTIVE_UNIFORM_BLOCKS),
            t.maxUniformBlockNameLength = 0,
            o = 0;
          u > o;
          ++o
        )
          (a = GLctx.getActiveUniformBlockName(e, o)),
            (t.maxUniformBlockNameLength = Math.max(
              t.maxUniformBlockNameLength,
              a.length + 1
            ));
      HEAP32[n >> 2] = t.maxUniformBlockNameLength;
    } else HEAP32[n >> 2] = GLctx.getProgramParameter(GL.programs[e], i);
  }
  function _glGetRenderbufferParameteriv(e, i, n) {
    return n
      ? ((HEAP32[n >> 2] = GLctx.getRenderbufferParameter(e, i)), void 0)
      : (GL.recordError(1281), void 0);
  }
  function _glGetShaderInfoLog(e, i, n, t) {
    var r,
      _ = GLctx.getShaderInfoLog(GL.shaders[e]);
    null === _ && (_ = "(unknown error)"),
      i > 0 && t
        ? ((r = stringToUTF8(_, t, i)), n && (HEAP32[n >> 2] = r))
        : n && (HEAP32[n >> 2] = 0);
  }
  function _glGetShaderPrecisionFormat(e, i, n, t) {
    var r = GLctx.getShaderPrecisionFormat(e, i);
    (HEAP32[n >> 2] = r.rangeMin),
      (HEAP32[(n + 4) >> 2] = r.rangeMax),
      (HEAP32[t >> 2] = r.precision);
  }
  function _glGetShaderSource(e, i, n, t) {
    var r,
      _ = GLctx.getShaderSource(GL.shaders[e]);
    _ &&
      (i > 0 && t
        ? ((r = stringToUTF8(_, t, i)), n && (HEAP32[n >> 2] = r))
        : n && (HEAP32[n >> 2] = 0));
  }
  function _glGetShaderiv(e, i, n) {
    var t, r, _;
    return n
      ? (35716 == i
          ? ((t = GLctx.getShaderInfoLog(GL.shaders[e])),
            null === t && (t = "(unknown error)"),
            (HEAP32[n >> 2] = t.length + 1))
          : 35720 == i
          ? ((r = GLctx.getShaderSource(GL.shaders[e])),
            (_ = null === r || 0 == r.length ? 0 : r.length + 1),
            (HEAP32[n >> 2] = _))
          : (HEAP32[n >> 2] = GLctx.getShaderParameter(GL.shaders[e], i)),
        void 0)
      : (GL.recordError(1281), void 0);
  }
  function _glGetString(e) {
    var i, n, t, r, _, o, l, u;
    if (GL.stringCache[e]) return GL.stringCache[e];
    switch (e) {
      case 7936:
      case 7937:
      case 37445:
      case 37446:
        i = allocate(
          intArrayFromString(GLctx.getParameter(e)),
          "i8",
          ALLOC_NORMAL
        );
        break;
      case 7938:
        (n = GLctx.getParameter(GLctx.VERSION)),
          (n =
            GLctx.canvas.GLctxObject.version >= 2
              ? "OpenGL ES 3.0 (" + n + ")"
              : "OpenGL ES 2.0 (" + n + ")"),
          (i = allocate(intArrayFromString(n), "i8", ALLOC_NORMAL));
        break;
      case 7939:
        for (
          t = GLctx.getSupportedExtensions(), r = [], _ = 0;
          _ < t.length;
          ++_
        )
          r.push(t[_]), r.push("GL_" + t[_]);
        i = allocate(intArrayFromString(r.join(" ")), "i8", ALLOC_NORMAL);
        break;
      case 35724:
        (o = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION)),
          (l = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/),
          (u = o.match(l)),
          null !== u &&
            (3 == u[1].length && (u[1] = u[1] + "0"),
            (o = "OpenGL ES GLSL ES " + u[1] + " (" + o + ")")),
          (i = allocate(intArrayFromString(o), "i8", ALLOC_NORMAL));
        break;
      default:
        return GL.recordError(1280), 0;
    }
    return (GL.stringCache[e] = i), i;
  }
  function _glGetStringi(e, i) {
    var n, t, r, _;
    if (GLctx.canvas.GLctxObject.version < 2) return GL.recordError(1282), 0;
    if (((n = GL.stringiCache[e]), n))
      return 0 > i || i >= n.length ? (GL.recordError(1281), 0) : n[i];
    switch (e) {
      case 7939:
        for (
          t = GLctx.getSupportedExtensions(), r = [], _ = 0;
          _ < t.length;
          ++_
        )
          r.push(allocate(intArrayFromString(t[_]), "i8", ALLOC_NORMAL)),
            r.push(
              allocate(intArrayFromString("GL_" + t[_]), "i8", ALLOC_NORMAL)
            );
        return (
          (n = GL.stringiCache[e] = r),
          0 > i || i >= n.length ? (GL.recordError(1281), 0) : n[i]
        );
      default:
        return GL.recordError(1280), 0;
    }
  }
  function _glGetTexParameteriv(e, i, n) {
    return n
      ? ((HEAP32[n >> 2] = GLctx.getTexParameter(e, i)), void 0)
      : (GL.recordError(1281), void 0);
  }
  function _glGetUniformBlockIndex(e, i) {
    return (
      (e = GL.programs[e]),
      (i = Pointer_stringify(i)),
      GLctx["getUniformBlockIndex"](e, i)
    );
  }
  function _glGetUniformIndices(e, i, n, t) {
    var r, _, o, l;
    if (!t) return GL.recordError(1281), void 0;
    if (i > 0 && (0 == n || 0 == t)) return GL.recordError(1281), void 0;
    for (e = GL.programs[e], r = [], _ = 0; i > _; _++)
      r.push(Pointer_stringify(HEAP32[(n + 4 * _) >> 2]));
    if (((o = GLctx["getUniformIndices"](e, r)), o))
      for (l = o.length, _ = 0; l > _; _++) HEAP32[(t + 4 * _) >> 2] = o[_];
  }
  function _glGetUniformLocation(e, i) {
    var n, t, r, _, o, l;
    if (
      ((i = Pointer_stringify(i)), (n = 0), i.indexOf("]", i.length - 1) !== -1)
    ) {
      if (
        ((t = i.lastIndexOf("[")),
        (r = i.slice(t + 1, -1)),
        r.length > 0 && ((n = parseInt(r)), 0 > n))
      )
        return -1;
      i = i.slice(0, t);
    }
    return (
      (_ = GL.programInfos[e]),
      _ ? ((o = _.uniforms), (l = o[i]), l && n < l[0] ? l[1] + n : -1) : -1
    );
  }
  function _glGetUniformiv(e, i, n) {
    emscriptenWebGLGetUniform(e, i, n, "Integer");
  }
  function _glGetVertexAttribiv(e, i, n) {
    emscriptenWebGLGetVertexAttrib(e, i, n, "FloatToInteger");
  }
  function _glInvalidateFramebuffer(e, i, n) {
    var t,
      r = GL.tempFixedLengthArray[i];
    for (t = 0; i > t; t++) r[t] = HEAP32[(n + 4 * t) >> 2];
    GLctx["invalidateFramebuffer"](e, r);
  }
  function _glIsEnabled(e) {
    return GLctx["isEnabled"](e);
  }
  function _glIsVertexArray(e) {
    var i = GL.vaos[e];
    return i ? GLctx["isVertexArray"](i) : 0;
  }
  function _glLinkProgram(e) {
    GLctx.linkProgram(GL.programs[e]),
      (GL.programInfos[e] = null),
      GL.populateUniformTable(e);
  }
  function _glMapBufferRange(e, i, n, t) {
    if (26 != t && 10 != t)
      return (
        Module.printErr(
          "glMapBufferRange is only supported when access is MAP_WRITE|INVALIDATE_BUFFER"
        ),
        0
      );
    if (!emscriptenWebGLValidateMapBufferTarget(e))
      return (
        GL.recordError(1280),
        Module.printErr("GL_INVALID_ENUM in glMapBufferRange"),
        0
      );
    var r = _malloc(n);
    return r
      ? ((GL.mappedBuffers[emscriptenWebGLGetBufferBinding(e)] = {
          offset: i,
          length: n,
          mem: r,
          access: t,
        }),
        r)
      : 0;
  }
  function _glPixelStorei(e, i) {
    3333 == e ? (GL.packAlignment = i) : 3317 == e && (GL.unpackAlignment = i),
      GLctx.pixelStorei(e, i);
  }
  function _glPolygonOffset(e, i) {
    GLctx["polygonOffset"](e, i);
  }
  function _glProgramBinary(e, i, n, t) {
    GL.recordError(1280);
  }
  function _glProgramParameteri(e, i, n) {
    GL.recordError(1280);
  }
  function _glReadBuffer(e) {
    GLctx["readBuffer"](e);
  }
  function _glReadPixels(e, i, n, t, r, _, o) {
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.currentPixelPackBufferBinding
          ? GLctx.readPixels(e, i, n, t, r, _, o)
          : GLctx.readPixels(
              e,
              i,
              n,
              t,
              r,
              _,
              emscriptenWebGLGetHeapForType(_),
              o >> emscriptenWebGLGetShiftForType(_)
            ),
        void 0
      );
    var l = emscriptenWebGLGetTexPixelData(_, r, n, t, o, r);
    return l
      ? (GLctx.readPixels(e, i, n, t, r, _, l), void 0)
      : (GL.recordError(1280), void 0);
  }
  function _glRenderbufferStorage(e, i, n, t) {
    GLctx["renderbufferStorage"](e, i, n, t);
  }
  function _glRenderbufferStorageMultisample(e, i, n, t, r) {
    GLctx["renderbufferStorageMultisample"](e, i, n, t, r);
  }
  function _glSamplerParameteri(e, i, n) {
    GLctx["samplerParameteri"](e ? GL.samplers[e] : null, i, n);
  }
  function _glScissor(e, i, n, t) {
    GLctx["scissor"](e, i, n, t);
  }
  function _glShaderSource(e, i, n, t) {
    var r = GL.getSource(e, i, n, t);
    GLctx.shaderSource(GL.shaders[e], r);
  }
  function _glStencilFuncSeparate(e, i, n, t) {
    GLctx["stencilFuncSeparate"](e, i, n, t);
  }
  function _glStencilMask(e) {
    GLctx["stencilMask"](e);
  }
  function _glStencilOpSeparate(e, i, n, t) {
    GLctx["stencilOpSeparate"](e, i, n, t);
  }
  function _glTexImage2D(e, i, n, t, r, _, o, l, u) {
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.currentPixelUnpackBufferBinding
          ? GLctx.texImage2D(e, i, n, t, r, _, o, l, u)
          : 0 != u
          ? GLctx.texImage2D(
              e,
              i,
              n,
              t,
              r,
              _,
              o,
              l,
              emscriptenWebGLGetHeapForType(l),
              u >> emscriptenWebGLGetShiftForType(l)
            )
          : GLctx.texImage2D(e, i, n, t, r, _, o, l, null),
        void 0
      );
    var a = null;
    u && (a = emscriptenWebGLGetTexPixelData(l, o, t, r, u, n)),
      GLctx.texImage2D(e, i, n, t, r, _, o, l, a);
  }
  function _glTexImage3D(e, i, n, t, r, _, o, l, u, a) {
    GLctx.currentPixelUnpackBufferBinding
      ? GLctx["texImage3D"](e, i, n, t, r, _, o, l, u, a)
      : 0 != a
      ? GLctx["texImage3D"](
          e,
          i,
          n,
          t,
          r,
          _,
          o,
          l,
          u,
          emscriptenWebGLGetHeapForType(u),
          a >> emscriptenWebGLGetShiftForType(u)
        )
      : GLctx["texImage3D"](e, i, n, t, r, _, o, l, u, null);
  }
  function _glTexParameterf(e, i, n) {
    GLctx["texParameterf"](e, i, n);
  }
  function _glTexParameteri(e, i, n) {
    GLctx["texParameteri"](e, i, n);
  }
  function _glTexParameteriv(e, i, n) {
    var t = HEAP32[n >> 2];
    GLctx.texParameteri(e, i, t);
  }
  function _glTexStorage2D(e, i, n, t, r) {
    GLctx["texStorage2D"](e, i, n, t, r);
  }
  function _glTexStorage3D(e, i, n, t, r, _) {
    GLctx["texStorage3D"](e, i, n, t, r, _);
  }
  function _glTexSubImage2D(e, i, n, t, r, _, o, l, u) {
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.currentPixelUnpackBufferBinding
          ? GLctx.texSubImage2D(e, i, n, t, r, _, o, l, u)
          : 0 != u
          ? GLctx.texSubImage2D(
              e,
              i,
              n,
              t,
              r,
              _,
              o,
              l,
              emscriptenWebGLGetHeapForType(l),
              u >> emscriptenWebGLGetShiftForType(l)
            )
          : GLctx.texSubImage2D(e, i, n, t, r, _, o, l, null),
        void 0
      );
    var a = null;
    u && (a = emscriptenWebGLGetTexPixelData(l, o, r, _, u, 0)),
      GLctx.texSubImage2D(e, i, n, t, r, _, o, l, a);
  }
  function _glTexSubImage3D(e, i, n, t, r, _, o, l, u, a, s) {
    GLctx.currentPixelUnpackBufferBinding
      ? GLctx["texSubImage3D"](e, i, n, t, r, _, o, l, u, a, s)
      : 0 != s
      ? GLctx["texSubImage3D"](
          e,
          i,
          n,
          t,
          r,
          _,
          o,
          l,
          u,
          a,
          emscriptenWebGLGetHeapForType(a),
          s >> emscriptenWebGLGetShiftForType(a)
        )
      : GLctx["texSubImage3D"](e, i, n, t, r, _, o, l, u, a, null);
  }
  function _glTransformFeedbackVaryings(e, i, n, t) {
    var r, _;
    for (e = GL.programs[e], r = [], _ = 0; i > _; _++)
      r.push(Pointer_stringify(HEAP32[(n + 4 * _) >> 2]));
    GLctx["transformFeedbackVaryings"](e, r, t);
  }
  function _glUniform1fv(e, i, n) {
    var t, r;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return GLctx.uniform1fv(GL.uniforms[e], HEAPF32, n >> 2, i), void 0;
    if (i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (t = GL.miniTempBufferViews[i - 1], r = 0; i > r; ++r)
        t[r] = HEAPF32[(n + 4 * r) >> 2];
    else t = HEAPF32.subarray(n >> 2, (n + 4 * i) >> 2);
    GLctx.uniform1fv(GL.uniforms[e], t);
  }
  function _glUniform1i(e, i) {
    GLctx.uniform1i(GL.uniforms[e], i);
  }
  function _glUniform1iv(e, i, n) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.uniform1iv(GL.uniforms[e], HEAP32, n >> 2, i), void 0)
      : (GLctx.uniform1iv(
          GL.uniforms[e],
          HEAP32.subarray(n >> 2, (n + 4 * i) >> 2)
        ),
        void 0);
  }
  function _glUniform1uiv(e, i, n) {
    GL.currentContext.supportsWebGL2EntryPoints
      ? GLctx.uniform1uiv(GL.uniforms[e], HEAPU32, n >> 2, i)
      : GLctx.uniform1uiv(
          GL.uniforms[e],
          HEAPU32.subarray(n >> 2, (n + 4 * i) >> 2)
        );
  }
  function _glUniform2fv(e, i, n) {
    var t, r;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return GLctx.uniform2fv(GL.uniforms[e], HEAPF32, n >> 2, 2 * i), void 0;
    if (2 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (t = GL.miniTempBufferViews[2 * i - 1], r = 0; 2 * i > r; r += 2)
        (t[r] = HEAPF32[(n + 4 * r) >> 2]),
          (t[r + 1] = HEAPF32[(n + (4 * r + 4)) >> 2]);
    else t = HEAPF32.subarray(n >> 2, (n + 8 * i) >> 2);
    GLctx.uniform2fv(GL.uniforms[e], t);
  }
  function _glUniform2iv(e, i, n) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.uniform2iv(GL.uniforms[e], HEAP32, n >> 2, 2 * i), void 0)
      : (GLctx.uniform2iv(
          GL.uniforms[e],
          HEAP32.subarray(n >> 2, (n + 8 * i) >> 2)
        ),
        void 0);
  }
  function _glUniform2uiv(e, i, n) {
    GL.currentContext.supportsWebGL2EntryPoints
      ? GLctx.uniform2uiv(GL.uniforms[e], HEAPU32, n >> 2, 2 * i)
      : GLctx.uniform2uiv(
          GL.uniforms[e],
          HEAPU32.subarray(n >> 2, (n + 8 * i) >> 2)
        );
  }
  function _glUniform3fv(e, i, n) {
    var t, r;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return GLctx.uniform3fv(GL.uniforms[e], HEAPF32, n >> 2, 3 * i), void 0;
    if (3 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (t = GL.miniTempBufferViews[3 * i - 1], r = 0; 3 * i > r; r += 3)
        (t[r] = HEAPF32[(n + 4 * r) >> 2]),
          (t[r + 1] = HEAPF32[(n + (4 * r + 4)) >> 2]),
          (t[r + 2] = HEAPF32[(n + (4 * r + 8)) >> 2]);
    else t = HEAPF32.subarray(n >> 2, (n + 12 * i) >> 2);
    GLctx.uniform3fv(GL.uniforms[e], t);
  }
  function _glUniform3iv(e, i, n) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.uniform3iv(GL.uniforms[e], HEAP32, n >> 2, 3 * i), void 0)
      : (GLctx.uniform3iv(
          GL.uniforms[e],
          HEAP32.subarray(n >> 2, (n + 12 * i) >> 2)
        ),
        void 0);
  }
  function _glUniform3uiv(e, i, n) {
    GL.currentContext.supportsWebGL2EntryPoints
      ? GLctx.uniform3uiv(GL.uniforms[e], HEAPU32, n >> 2, 3 * i)
      : GLctx.uniform3uiv(
          GL.uniforms[e],
          HEAPU32.subarray(n >> 2, (n + 12 * i) >> 2)
        );
  }
  function _glUniform4fv(e, i, n) {
    var t, r;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return GLctx.uniform4fv(GL.uniforms[e], HEAPF32, n >> 2, 4 * i), void 0;
    if (4 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (t = GL.miniTempBufferViews[4 * i - 1], r = 0; 4 * i > r; r += 4)
        (t[r] = HEAPF32[(n + 4 * r) >> 2]),
          (t[r + 1] = HEAPF32[(n + (4 * r + 4)) >> 2]),
          (t[r + 2] = HEAPF32[(n + (4 * r + 8)) >> 2]),
          (t[r + 3] = HEAPF32[(n + (4 * r + 12)) >> 2]);
    else t = HEAPF32.subarray(n >> 2, (n + 16 * i) >> 2);
    GLctx.uniform4fv(GL.uniforms[e], t);
  }
  function _glUniform4iv(e, i, n) {
    return GL.currentContext.supportsWebGL2EntryPoints
      ? (GLctx.uniform4iv(GL.uniforms[e], HEAP32, n >> 2, 4 * i), void 0)
      : (GLctx.uniform4iv(
          GL.uniforms[e],
          HEAP32.subarray(n >> 2, (n + 16 * i) >> 2)
        ),
        void 0);
  }
  function _glUniform4uiv(e, i, n) {
    GL.currentContext.supportsWebGL2EntryPoints
      ? GLctx.uniform4uiv(GL.uniforms[e], HEAPU32, n >> 2, 4 * i)
      : GLctx.uniform4uiv(
          GL.uniforms[e],
          HEAPU32.subarray(n >> 2, (n + 16 * i) >> 2)
        );
  }
  function _glUniformBlockBinding(e, i, n) {
    (e = GL.programs[e]), GLctx["uniformBlockBinding"](e, i, n);
  }
  function _glUniformMatrix3fv(e, i, n, t) {
    var r, _;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.uniformMatrix3fv(GL.uniforms[e], !!n, HEAPF32, t >> 2, 9 * i),
        void 0
      );
    if (9 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (r = GL.miniTempBufferViews[9 * i - 1], _ = 0; 9 * i > _; _ += 9)
        (r[_] = HEAPF32[(t + 4 * _) >> 2]),
          (r[_ + 1] = HEAPF32[(t + (4 * _ + 4)) >> 2]),
          (r[_ + 2] = HEAPF32[(t + (4 * _ + 8)) >> 2]),
          (r[_ + 3] = HEAPF32[(t + (4 * _ + 12)) >> 2]),
          (r[_ + 4] = HEAPF32[(t + (4 * _ + 16)) >> 2]),
          (r[_ + 5] = HEAPF32[(t + (4 * _ + 20)) >> 2]),
          (r[_ + 6] = HEAPF32[(t + (4 * _ + 24)) >> 2]),
          (r[_ + 7] = HEAPF32[(t + (4 * _ + 28)) >> 2]),
          (r[_ + 8] = HEAPF32[(t + (4 * _ + 32)) >> 2]);
    else r = HEAPF32.subarray(t >> 2, (t + 36 * i) >> 2);
    GLctx.uniformMatrix3fv(GL.uniforms[e], !!n, r);
  }
  function _glUniformMatrix4fv(e, i, n, t) {
    var r, _;
    if (GL.currentContext.supportsWebGL2EntryPoints)
      return (
        GLctx.uniformMatrix4fv(GL.uniforms[e], !!n, HEAPF32, t >> 2, 16 * i),
        void 0
      );
    if (16 * i <= GL.MINI_TEMP_BUFFER_SIZE)
      for (r = GL.miniTempBufferViews[16 * i - 1], _ = 0; 16 * i > _; _ += 16)
        (r[_] = HEAPF32[(t + 4 * _) >> 2]),
          (r[_ + 1] = HEAPF32[(t + (4 * _ + 4)) >> 2]),
          (r[_ + 2] = HEAPF32[(t + (4 * _ + 8)) >> 2]),
          (r[_ + 3] = HEAPF32[(t + (4 * _ + 12)) >> 2]),
          (r[_ + 4] = HEAPF32[(t + (4 * _ + 16)) >> 2]),
          (r[_ + 5] = HEAPF32[(t + (4 * _ + 20)) >> 2]),
          (r[_ + 6] = HEAPF32[(t + (4 * _ + 24)) >> 2]),
          (r[_ + 7] = HEAPF32[(t + (4 * _ + 28)) >> 2]),
          (r[_ + 8] = HEAPF32[(t + (4 * _ + 32)) >> 2]),
          (r[_ + 9] = HEAPF32[(t + (4 * _ + 36)) >> 2]),
          (r[_ + 10] = HEAPF32[(t + (4 * _ + 40)) >> 2]),
          (r[_ + 11] = HEAPF32[(t + (4 * _ + 44)) >> 2]),
          (r[_ + 12] = HEAPF32[(t + (4 * _ + 48)) >> 2]),
          (r[_ + 13] = HEAPF32[(t + (4 * _ + 52)) >> 2]),
          (r[_ + 14] = HEAPF32[(t + (4 * _ + 56)) >> 2]),
          (r[_ + 15] = HEAPF32[(t + (4 * _ + 60)) >> 2]);
    else r = HEAPF32.subarray(t >> 2, (t + 64 * i) >> 2);
    GLctx.uniformMatrix4fv(GL.uniforms[e], !!n, r);
  }
  function _glUnmapBuffer(e) {
    var i, n;
    return emscriptenWebGLValidateMapBufferTarget(e)
      ? ((i = emscriptenWebGLGetBufferBinding(e)),
        (n = GL.mappedBuffers[i]),
        n
          ? ((GL.mappedBuffers[i] = null),
            16 & n.access ||
              (GL.currentContext.supportsWebGL2EntryPoints
                ? GLctx.bufferSubData(e, n.offset, HEAPU8, n.mem, n.length)
                : GLctx.bufferSubData(
                    e,
                    n.offset,
                    HEAPU8.subarray(n.mem, n.mem + n.length)
                  )),
            _free(n.mem),
            1)
          : (GL.recordError(1282),
            Module.printError("buffer was never mapped in glUnmapBuffer"),
            0))
      : (GL.recordError(1280),
        Module.printErr("GL_INVALID_ENUM in glUnmapBuffer"),
        0);
  }
  function _glUseProgram(e) {
    GLctx.useProgram(e ? GL.programs[e] : null);
  }
  function _glValidateProgram(e) {
    GLctx.validateProgram(GL.programs[e]);
  }
  function _glVertexAttrib4f(e, i, n, t, r) {
    GLctx["vertexAttrib4f"](e, i, n, t, r);
  }
  function _glVertexAttrib4fv(e, i) {
    GLctx.vertexAttrib4f(
      e,
      HEAPF32[i >> 2],
      HEAPF32[(i + 4) >> 2],
      HEAPF32[(i + 8) >> 2],
      HEAPF32[(i + 12) >> 2]
    );
  }
  function _glVertexAttribIPointer(e, i, n, t, r) {
    var _ = GL.currentContext.clientBuffers[e];
    return GL.currArrayBuffer
      ? ((_.clientside = !1), GLctx.vertexAttribIPointer(e, i, n, t, r), void 0)
      : ((_.size = i),
        (_.type = n),
        (_.normalized = !1),
        (_.stride = t),
        (_.ptr = r),
        (_.clientside = !0),
        void 0);
  }
  function _glVertexAttribPointer(e, i, n, t, r, _) {
    GLctx.vertexAttribPointer(e, i, n, !!t, r, _);
  }
  function _glViewport(e, i, n, t) {
    GLctx["viewport"](e, i, n, t);
  }
  function _gmtime_r(e, i) {
    var n,
      t,
      r = new Date(1e3 * HEAP32[e >> 2]);
    return (
      (HEAP32[i >> 2] = r.getUTCSeconds()),
      (HEAP32[(i + 4) >> 2] = r.getUTCMinutes()),
      (HEAP32[(i + 8) >> 2] = r.getUTCHours()),
      (HEAP32[(i + 12) >> 2] = r.getUTCDate()),
      (HEAP32[(i + 16) >> 2] = r.getUTCMonth()),
      (HEAP32[(i + 20) >> 2] = r.getUTCFullYear() - 1900),
      (HEAP32[(i + 24) >> 2] = r.getUTCDay()),
      (HEAP32[(i + 36) >> 2] = 0),
      (HEAP32[(i + 32) >> 2] = 0),
      (n = Date.UTC(r.getUTCFullYear(), 0, 1, 0, 0, 0, 0)),
      (t = ((r.getTime() - n) / (1e3 * 60 * 60 * 24)) | 0),
      (HEAP32[(i + 28) >> 2] = t),
      (HEAP32[(i + 40) >> 2] = ___tm_timezone),
      i
    );
  }
  function _gmtime(e) {
    return _gmtime_r(e, ___tm_current);
  }
  function _llvm_cttz_i32(e) {
    e = 0 | e;
    var i = 0;
    return (
      (i = 0 | HEAP8[(cttz_i8 + (255 & e)) >> 0]),
      8 > (0 | i)
        ? 0 | i
        : ((i = 0 | HEAP8[(cttz_i8 + ((e >> 8) & 255)) >> 0]),
          8 > (0 | i)
            ? (i + 8) | 0
            : ((i = 0 | HEAP8[(cttz_i8 + ((e >> 16) & 255)) >> 0]),
              8 > (0 | i)
                ? (i + 16) | 0
                : ((0 | HEAP8[(cttz_i8 + (e >>> 24)) >> 0]) + 24) | 0))
    );
  }
  function _llvm_eh_typeid_for(e) {
    return e;
  }
  function _llvm_exp2_f32(e) {
    return Math.pow(2, e);
  }
  function _llvm_exp2_f64() {
    return _llvm_exp2_f32.apply(null, arguments);
  }
  function _llvm_trap() {
    abort("trap!");
  }
  function _tzset() {
    function e(e) {
      var i = e.toTimeString().match(/\(([A-Za-z ]+)\)$/);
      return i ? i[1] : "GMT";
    }
    var i, n, t, r, _, o;
    _tzset.called ||
      ((_tzset.called = !0),
      (HEAP32[_timezone >> 2] = 60 * new Date().getTimezoneOffset()),
      (i = new Date(2e3, 0, 1)),
      (n = new Date(2e3, 6, 1)),
      (HEAP32[_daylight >> 2] = Number(
        i.getTimezoneOffset() != n.getTimezoneOffset()
      )),
      (t = e(i)),
      (r = e(n)),
      (_ = allocate(intArrayFromString(t), "i8", ALLOC_NORMAL)),
      (o = allocate(intArrayFromString(r), "i8", ALLOC_NORMAL)),
      n.getTimezoneOffset() < i.getTimezoneOffset()
        ? ((HEAP32[_tzname >> 2] = _), (HEAP32[(_tzname + 4) >> 2] = o))
        : ((HEAP32[_tzname >> 2] = o), (HEAP32[(_tzname + 4) >> 2] = _)));
  }
  function _localtime_r(e, i) {
    var n, t, r, _, o, l, u;
    return (
      _tzset(),
      (n = new Date(1e3 * HEAP32[e >> 2])),
      (HEAP32[i >> 2] = n.getSeconds()),
      (HEAP32[(i + 4) >> 2] = n.getMinutes()),
      (HEAP32[(i + 8) >> 2] = n.getHours()),
      (HEAP32[(i + 12) >> 2] = n.getDate()),
      (HEAP32[(i + 16) >> 2] = n.getMonth()),
      (HEAP32[(i + 20) >> 2] = n.getFullYear() - 1900),
      (HEAP32[(i + 24) >> 2] = n.getDay()),
      (t = new Date(n.getFullYear(), 0, 1)),
      (r = ((n.getTime() - t.getTime()) / (1e3 * 60 * 60 * 24)) | 0),
      (HEAP32[(i + 28) >> 2] = r),
      (HEAP32[(i + 36) >> 2] = -(60 * n.getTimezoneOffset())),
      (_ = new Date(2e3, 6, 1).getTimezoneOffset()),
      (o = t.getTimezoneOffset()),
      (l = 0 | (_ != o && n.getTimezoneOffset() == Math.min(o, _))),
      (HEAP32[(i + 32) >> 2] = l),
      (u = HEAP32[(_tzname + (l ? 4 : 0)) >> 2]),
      (HEAP32[(i + 40) >> 2] = u),
      i
    );
  }
  function _localtime(e) {
    return _localtime_r(e, ___tm_current);
  }
  function _emscripten_memcpy_big(e, i, n) {
    return HEAPU8.set(HEAPU8.subarray(i, i + n), e), e;
  }
  function _mktime(e) {
    var i, n, t, r, _, o, l, u, a, s;
    return (
      _tzset(),
      (i = new Date(
        HEAP32[(e + 20) >> 2] + 1900,
        HEAP32[(e + 16) >> 2],
        HEAP32[(e + 12) >> 2],
        HEAP32[(e + 8) >> 2],
        HEAP32[(e + 4) >> 2],
        HEAP32[e >> 2],
        0
      )),
      (n = HEAP32[(e + 32) >> 2]),
      (t = i.getTimezoneOffset()),
      (r = new Date(i.getFullYear(), 0, 1)),
      (_ = new Date(2e3, 6, 1).getTimezoneOffset()),
      (o = r.getTimezoneOffset()),
      (l = Math.min(o, _)),
      0 > n
        ? (HEAP32[(e + 32) >> 2] = Number(_ != o && l == t))
        : n > 0 != (l == t) &&
          ((u = Math.max(o, _)),
          (a = n > 0 ? l : u),
          i.setTime(i.getTime() + 6e4 * (a - t))),
      (HEAP32[(e + 24) >> 2] = i.getDay()),
      (s = ((i.getTime() - r.getTime()) / (1e3 * 60 * 60 * 24)) | 0),
      (HEAP32[(e + 28) >> 2] = s),
      (i.getTime() / 1e3) | 0
    );
  }
  function _pthread_attr_destroy(e) {
    return 0;
  }
  function _pthread_attr_init(e) {
    return 0;
  }
  function _pthread_cond_destroy() {
    return 0;
  }
  function _pthread_cond_init() {
    return 0;
  }
  function _pthread_cond_signal() {
    return 0;
  }
  function _pthread_cond_timedwait() {
    return 0;
  }
  function _pthread_cond_wait() {
    return 0;
  }
  function _pthread_create() {
    return 11;
  }
  function _pthread_detach() {}
  function _pthread_getspecific(e) {
    return PTHREAD_SPECIFIC[e] || 0;
  }
  function _pthread_key_create(e, i) {
    return 0 == e
      ? ERRNO_CODES.EINVAL
      : ((HEAP32[e >> 2] = PTHREAD_SPECIFIC_NEXT_KEY),
        (PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY] = 0),
        PTHREAD_SPECIFIC_NEXT_KEY++,
        0);
  }
  function _pthread_key_delete(e) {
    return e in PTHREAD_SPECIFIC
      ? (delete PTHREAD_SPECIFIC[e], 0)
      : ERRNO_CODES.EINVAL;
  }
  function _pthread_mutex_destroy() {}
  function _pthread_mutex_init() {}
  function _pthread_mutexattr_destroy() {}
  function _pthread_mutexattr_init() {}
  function _pthread_mutexattr_settype() {}
  function _pthread_once(e, i) {
    _pthread_once.seen || (_pthread_once.seen = {}),
      e in _pthread_once.seen ||
        (Module["dynCall_v"](i), (_pthread_once.seen[e] = 1));
  }
  function _pthread_rwlock_init() {
    return 0;
  }
  function _pthread_rwlock_rdlock() {
    return 0;
  }
  function _pthread_rwlock_unlock() {
    return 0;
  }
  function _pthread_rwlock_wrlock() {
    return 0;
  }
  function _pthread_setspecific(e, i) {
    return e in PTHREAD_SPECIFIC
      ? ((PTHREAD_SPECIFIC[e] = i), 0)
      : ERRNO_CODES.EINVAL;
  }
  function _sched_yield() {
    return 0;
  }
  function _setenv(e, i, n) {
    var t, r;
    return 0 === e
      ? (___setErrNo(ERRNO_CODES.EINVAL), -1)
      : ((t = Pointer_stringify(e)),
        (r = Pointer_stringify(i)),
        "" === t || t.indexOf("=") !== -1
          ? (___setErrNo(ERRNO_CODES.EINVAL), -1)
          : ENV.hasOwnProperty(t) && !n
          ? 0
          : ((ENV[t] = r), ___buildEnvironment(ENV), 0));
  }
  function _sigaction(e, i, n) {
    return 0;
  }
  function _sigemptyset(e) {
    return (HEAP32[e >> 2] = 0), 0;
  }
  function __isLeapYear(e) {
    return e % 4 === 0 && (e % 100 !== 0 || e % 400 === 0);
  }
  function __arraySum(e, i) {
    var n,
      t = 0;
    for (n = 0; i >= n; t += e[n++]);
    return t;
  }
  function __addDays(e, i) {
    var n,
      t,
      r,
      _ = new Date(e.getTime());
    while (i > 0) {
      if (
        ((n = __isLeapYear(_.getFullYear())),
        (t = _.getMonth()),
        (r = (n ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[t]),
        !(i > r - _.getDate()))
      )
        return _.setDate(_.getDate() + i), _;
      (i -= r - _.getDate() + 1),
        _.setDate(1),
        11 > t
          ? _.setMonth(t + 1)
          : (_.setMonth(0), _.setFullYear(_.getFullYear() + 1));
    }
    return _;
  }
  function _strftime(e, i, n, t) {
    function r(e, i, n) {
      var t = "number" == typeof e ? e.toString() : e || "";
      while (t.length < i) t = n[0] + t;
      return t;
    }
    function _(e, i) {
      return r(e, i, "0");
    }
    function o(e, i) {
      function n(e) {
        return 0 > e ? -1 : e > 0 ? 1 : 0;
      }
      var t;
      return (
        0 === (t = n(e.getFullYear() - i.getFullYear())) &&
          0 === (t = n(e.getMonth() - i.getMonth())) &&
          (t = n(e.getDate() - i.getDate())),
        t
      );
    }
    function l(e) {
      switch (e.getDay()) {
        case 0:
          return new Date(e.getFullYear() - 1, 11, 29);
        case 1:
          return e;
        case 2:
          return new Date(e.getFullYear(), 0, 3);
        case 3:
          return new Date(e.getFullYear(), 0, 2);
        case 4:
          return new Date(e.getFullYear(), 0, 1);
        case 5:
          return new Date(e.getFullYear() - 1, 11, 31);
        case 6:
          return new Date(e.getFullYear() - 1, 11, 30);
      }
    }
    function u(e) {
      var i = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday),
        n = new Date(i.getFullYear(), 0, 4),
        t = new Date(i.getFullYear() + 1, 0, 4),
        r = l(n),
        _ = l(t);
      return o(r, i) <= 0
        ? o(_, i) <= 0
          ? i.getFullYear() + 1
          : i.getFullYear()
        : i.getFullYear() - 1;
    }
    var a,
      s,
      c,
      f,
      d,
      p = HEAP32[(t + 40) >> 2],
      m = {
        tm_sec: HEAP32[t >> 2],
        tm_min: HEAP32[(t + 4) >> 2],
        tm_hour: HEAP32[(t + 8) >> 2],
        tm_mday: HEAP32[(t + 12) >> 2],
        tm_mon: HEAP32[(t + 16) >> 2],
        tm_year: HEAP32[(t + 20) >> 2],
        tm_wday: HEAP32[(t + 24) >> 2],
        tm_yday: HEAP32[(t + 28) >> 2],
        tm_isdst: HEAP32[(t + 32) >> 2],
        tm_gmtoff: HEAP32[(t + 36) >> 2],
        tm_zone: p ? Pointer_stringify(p) : "",
      },
      y = Pointer_stringify(n),
      g = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
      };
    for (a in g) y = y.replace(new RegExp(a, "g"), g[a]);
    (s = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]),
      (c = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]),
      (f = {
        "%a": function (e) {
          return s[e.tm_wday].substring(0, 3);
        },
        "%A": function (e) {
          return s[e.tm_wday];
        },
        "%b": function (e) {
          return c[e.tm_mon].substring(0, 3);
        },
        "%B": function (e) {
          return c[e.tm_mon];
        },
        "%C": function (e) {
          var i = e.tm_year + 1900;
          return _((i / 100) | 0, 2);
        },
        "%d": function (e) {
          return _(e.tm_mday, 2);
        },
        "%e": function (e) {
          return r(e.tm_mday, 2, " ");
        },
        "%g": function (e) {
          return u(e).toString().substring(2);
        },
        "%G": function (e) {
          return u(e);
        },
        "%H": function (e) {
          return _(e.tm_hour, 2);
        },
        "%I": function (e) {
          var i = e.tm_hour;
          return 0 == i ? (i = 12) : i > 12 && (i -= 12), _(i, 2);
        },
        "%j": function (e) {
          return _(
            e.tm_mday +
              __arraySum(
                __isLeapYear(e.tm_year + 1900)
                  ? __MONTH_DAYS_LEAP
                  : __MONTH_DAYS_REGULAR,
                e.tm_mon - 1
              ),
            3
          );
        },
        "%m": function (e) {
          return _(e.tm_mon + 1, 2);
        },
        "%M": function (e) {
          return _(e.tm_min, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (e) {
          return e.tm_hour >= 0 && e.tm_hour < 12 ? "AM" : "PM";
        },
        "%S": function (e) {
          return _(e.tm_sec, 2);
        },
        "%t": function () {
          return "	";
        },
        "%u": function (e) {
          var i = new Date(
            e.tm_year + 1900,
            e.tm_mon + 1,
            e.tm_mday,
            0,
            0,
            0,
            0
          );
          return i.getDay() || 7;
        },
        "%U": function (e) {
          var i,
            n,
            t,
            r = new Date(e.tm_year + 1900, 0, 1),
            l = 0 === r.getDay() ? r : __addDays(r, 7 - r.getDay()),
            u = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
          return o(l, u) < 0
            ? ((i =
                __arraySum(
                  __isLeapYear(u.getFullYear())
                    ? __MONTH_DAYS_LEAP
                    : __MONTH_DAYS_REGULAR,
                  u.getMonth() - 1
                ) - 31),
              (n = 31 - l.getDate()),
              (t = n + i + u.getDate()),
              _(Math.ceil(t / 7), 2))
            : 0 === o(l, r)
            ? "01"
            : "00";
        },
        "%V": function (e) {
          var i,
            n = new Date(e.tm_year + 1900, 0, 4),
            t = new Date(e.tm_year + 1901, 0, 4),
            r = l(n),
            u = l(t),
            a = __addDays(new Date(e.tm_year + 1900, 0, 1), e.tm_yday);
          return o(a, r) < 0
            ? "53"
            : o(u, a) <= 0
            ? "01"
            : ((i =
                r.getFullYear() < e.tm_year + 1900
                  ? e.tm_yday + 32 - r.getDate()
                  : e.tm_yday + 1 - r.getDate()),
              _(Math.ceil(i / 7), 2));
        },
        "%w": function (e) {
          var i = new Date(
            e.tm_year + 1900,
            e.tm_mon + 1,
            e.tm_mday,
            0,
            0,
            0,
            0
          );
          return i.getDay();
        },
        "%W": function (e) {
          var i,
            n,
            t,
            r = new Date(e.tm_year, 0, 1),
            l =
              1 === r.getDay()
                ? r
                : __addDays(r, 0 === r.getDay() ? 1 : 7 - r.getDay() + 1),
            u = new Date(e.tm_year + 1900, e.tm_mon, e.tm_mday);
          return o(l, u) < 0
            ? ((i =
                __arraySum(
                  __isLeapYear(u.getFullYear())
                    ? __MONTH_DAYS_LEAP
                    : __MONTH_DAYS_REGULAR,
                  u.getMonth() - 1
                ) - 31),
              (n = 31 - l.getDate()),
              (t = n + i + u.getDate()),
              _(Math.ceil(t / 7), 2))
            : 0 === o(l, r)
            ? "01"
            : "00";
        },
        "%y": function (e) {
          return (e.tm_year + 1900).toString().substring(2);
        },
        "%Y": function (e) {
          return e.tm_year + 1900;
        },
        "%z": function (e) {
          var i = e.tm_gmtoff,
            n = i >= 0;
          return (
            (i = Math.abs(i) / 60),
            (i = (i / 60) * 100 + (i % 60)),
            (n ? "+" : "-") + String("0000" + i).slice(-4)
          );
        },
        "%Z": function (e) {
          return e.tm_zone;
        },
        "%%": function () {
          return "%";
        },
      });
    for (a in f)
      y.indexOf(a) >= 0 && (y = y.replace(new RegExp(a, "g"), f[a](m)));
    return (
      (d = intArrayFromString(y, !1)),
      d.length > i ? 0 : (writeArrayToMemory(d, e), d.length - 1)
    );
  }
  function _sysconf(e) {
    switch (e) {
      case 30:
        return PAGE_SIZE;
      case 85:
        var i = 2 * 1024 * 1024 * 1024 - 65536;
        return i / PAGE_SIZE;
      case 132:
      case 133:
      case 12:
      case 137:
      case 138:
      case 15:
      case 235:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 149:
      case 13:
      case 10:
      case 236:
      case 153:
      case 9:
      case 21:
      case 22:
      case 159:
      case 154:
      case 14:
      case 77:
      case 78:
      case 139:
      case 80:
      case 81:
      case 82:
      case 68:
      case 67:
      case 164:
      case 11:
      case 29:
      case 47:
      case 48:
      case 95:
      case 52:
      case 51:
      case 46:
        return 200809;
      case 79:
        return 0;
      case 27:
      case 246:
      case 127:
      case 128:
      case 23:
      case 24:
      case 160:
      case 161:
      case 181:
      case 182:
      case 242:
      case 183:
      case 184:
      case 243:
      case 244:
      case 245:
      case 165:
      case 178:
      case 179:
      case 49:
      case 50:
      case 168:
      case 169:
      case 175:
      case 170:
      case 171:
      case 172:
      case 97:
      case 76:
      case 32:
      case 173:
      case 35:
        return -1;
      case 176:
      case 177:
      case 7:
      case 155:
      case 8:
      case 157:
      case 125:
      case 126:
      case 92:
      case 93:
      case 129:
      case 130:
      case 131:
      case 94:
      case 91:
        return 1;
      case 74:
      case 60:
      case 69:
      case 70:
      case 4:
        return 1024;
      case 31:
      case 42:
      case 72:
        return 32;
      case 87:
      case 26:
      case 33:
        return 2147483647;
      case 34:
      case 1:
        return 47839;
      case 38:
      case 36:
        return 99;
      case 43:
      case 37:
        return 2048;
      case 0:
        return 2097152;
      case 3:
        return 65536;
      case 28:
        return 32768;
      case 44:
        return 32767;
      case 75:
        return 16384;
      case 39:
        return 1e3;
      case 89:
        return 700;
      case 71:
        return 256;
      case 40:
        return 255;
      case 2:
        return 100;
      case 180:
        return 64;
      case 25:
        return 20;
      case 5:
        return 16;
      case 6:
        return 6;
      case 73:
        return 4;
      case 84:
        return "object" == typeof navigator
          ? navigator["hardwareConcurrency"] || 1
          : 1;
    }
    return ___setErrNo(ERRNO_CODES.EINVAL), -1;
  }
  function _time(e) {
    var i = (Date.now() / 1e3) | 0;
    return e && (HEAP32[e >> 2] = i), i;
  }
  function _unsetenv(e) {
    return 0 === e
      ? (___setErrNo(ERRNO_CODES.EINVAL), -1)
      : ((e = Pointer_stringify(e)),
        "" === e || e.indexOf("=") !== -1
          ? (___setErrNo(ERRNO_CODES.EINVAL), -1)
          : (ENV.hasOwnProperty(e) && (delete ENV[e], ___buildEnvironment(ENV)),
            0));
  }
  function _utime(e, i) {
    var n, t;
    i ? ((t = 4), (n = HEAP32[(i + t) >> 2]), (n *= 1e3)) : (n = Date.now()),
      (e = Pointer_stringify(e));
    try {
      return FS.utime(e, n, n), 0;
    } catch (r) {
      return FS.handleFSError(r), -1;
    }
  }
  function intArrayFromString(e, i, n) {
    var t = n > 0 ? n : lengthBytesUTF8(e) + 1,
      r = new Array(t),
      _ = stringToUTF8Array(e, r, 0, r.length);
    return i && (r.length = _), r;
  }
  function invoke_d(e) {
    try {
      return Module["dynCall_d"](e);
    } catch (i) {
      if ("number" != typeof i && "longjmp" !== i) throw i;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_di(e, i) {
    try {
      return Module["dynCall_di"](e, i);
    } catch (n) {
      if ("number" != typeof n && "longjmp" !== n) throw n;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_diddi(e, i, n, t, r) {
    try {
      return Module["dynCall_diddi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_didi(e, i, n, t) {
    try {
      return Module["dynCall_didi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_didii(e, i, n, t, r) {
    try {
      return Module["dynCall_didii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_didiii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_didiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_difi(e, i, n, t) {
    try {
      return Module["dynCall_difi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_dii(e, i, n) {
    try {
      return Module["dynCall_dii"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_diiddi(e, i, n, t, r, _) {
    try {
      return Module["dynCall_diiddi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_diidi(e, i, n, t, r) {
    try {
      return Module["dynCall_diidi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_diii(e, i, n, t) {
    try {
      return Module["dynCall_diii"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_diiii(e, i, n, t, r) {
    try {
      return Module["dynCall_diiii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_diiiii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_diiiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_diji(e, i, n, t, r) {
    try {
      return Module["dynCall_diji"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_f(e) {
    try {
      return Module["dynCall_f"](e);
    } catch (i) {
      if ("number" != typeof i && "longjmp" !== i) throw i;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_ff(e, i) {
    try {
      return Module["dynCall_ff"](e, i);
    } catch (n) {
      if ("number" != typeof n && "longjmp" !== n) throw n;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fff(e, i, n) {
    try {
      return Module["dynCall_fff"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fi(e, i) {
    try {
      return Module["dynCall_fi"](e, i);
    } catch (n) {
      if ("number" != typeof n && "longjmp" !== n) throw n;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fidi(e, i, n, t) {
    try {
      return Module["dynCall_fidi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fif(e, i, n) {
    try {
      return Module["dynCall_fif"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiff(e, i, n, t) {
    try {
      return Module["dynCall_fiff"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fifffffi(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_fifffffi"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiffffi(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_fiffffi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiffffii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_fiffffii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fifffi(e, i, n, t, r, _) {
    try {
      return Module["dynCall_fifffi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fifffii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_fifffii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fifffiiii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_fifffiiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiffi(e, i, n, t, r) {
    try {
      return Module["dynCall_fiffi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiffifffi(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_fiffifffi"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiffii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_fiffii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fifi(e, i, n, t) {
    try {
      return Module["dynCall_fifi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fifii(e, i, n, t, r) {
    try {
      return Module["dynCall_fifii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fifiii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_fifiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fii(e, i, n) {
    try {
      return Module["dynCall_fii"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiif(e, i, n, t) {
    try {
      return Module["dynCall_fiif"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiffffii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_fiiffffii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiffffiiiii(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      return Module["dynCall_fiiffffiiiii"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiffffiiiiii(e, i, n, t, r, _, o, l, u, a, s, c, f) {
    try {
      return Module["dynCall_fiiffffiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f
      );
    } catch (d) {
      if ("number" != typeof d && "longjmp" !== d) throw d;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiifffiii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_fiifffiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiffi(e, i, n, t, r, _) {
    try {
      return Module["dynCall_fiiffi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiifi(e, i, n, t, r) {
    try {
      return Module["dynCall_fiifi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiii(e, i, n, t) {
    try {
      return Module["dynCall_fiii"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiifi(e, i, n, t, r, _) {
    try {
      return Module["dynCall_fiiifi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiifii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_fiiifii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiii(e, i, n, t, r) {
    try {
      return Module["dynCall_fiiii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiiif(e, i, n, t, r, _) {
    try {
      return Module["dynCall_fiiiif"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiiii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_fiiiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiiiiifiiiiiif(e, i, n, t, r, _, o, l, u, a, s, c, f, d, p) {
    try {
      return Module["dynCall_fiiiiiifiiiiiif"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p
      );
    } catch (m) {
      if ("number" != typeof m && "longjmp" !== m) throw m;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiiiiiiiifiiiif(e, i, n, t, r, _, o, l, u, a, s, c, f, d, p) {
    try {
      return Module["dynCall_fiiiiiiiifiiiif"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p
      );
    } catch (m) {
      if ("number" != typeof m && "longjmp" !== m) throw m;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_fiji(e, i, n, t, r) {
    try {
      return Module["dynCall_fiji"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_i(e) {
    try {
      return Module["dynCall_i"](e);
    } catch (i) {
      if ("number" != typeof i && "longjmp" !== i) throw i;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_ii(e, i) {
    try {
      return Module["dynCall_ii"](e, i);
    } catch (n) {
      if ("number" != typeof n && "longjmp" !== n) throw n;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiddi(e, i, n, t, r) {
    try {
      return Module["dynCall_iiddi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iidi(e, i, n, t) {
    try {
      return Module["dynCall_iidi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iidii(e, i, n, t, r) {
    try {
      return Module["dynCall_iidii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iidiii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iidiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iif(e, i, n) {
    try {
      return Module["dynCall_iif"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iifff(e, i, n, t, r) {
    try {
      return Module["dynCall_iifff"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiffffi(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiffffi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iifffi(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iifffi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iifffii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iifffii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiffi(e, i, n, t, r) {
    try {
      return Module["dynCall_iiffi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiffifii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiffifii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiffii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iiffii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiffiii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiffiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiffiiii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiffiiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iifi(e, i, n, t) {
    try {
      return Module["dynCall_iifi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iififii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iififii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iifii(e, i, n, t, r) {
    try {
      return Module["dynCall_iifii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iifiii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iifiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iifiiifiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iifiiifiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iifiiii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iifiiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iii(e, i, n) {
    try {
      return Module["dynCall_iii"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiid(e, i, n, t) {
    try {
      return Module["dynCall_iiid"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiidi(e, i, n, t, r) {
    try {
      return Module["dynCall_iiidi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiidii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iiidii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiidiii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiidiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiif(e, i, n, t) {
    try {
      return Module["dynCall_iiif"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiifffi(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiifffi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiifffii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiifffii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiffi(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iiiffi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiffii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiiffii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiffiii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiiffiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiifi(e, i, n, t, r) {
    try {
      return Module["dynCall_iiifi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiififii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiififii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiififiii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiififiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiifii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iiifii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiifiifii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiifiifii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiifiifiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiifiifiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiifiii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiifiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiifiiii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiifiiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiii(e, i, n, t) {
    try {
      return Module["dynCall_iiii"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiffi(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiiiffi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiffii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiiiffii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiifi(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iiiifi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiififiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiiififiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiififiiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      return Module["dynCall_iiiififiiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiifii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiiifii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiifiifiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      return Module["dynCall_iiiifiifiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiifiii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiiifiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiifiiii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiiifiiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiifiiiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiiifiiiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiii(e, i, n, t, r) {
    try {
      return Module["dynCall_iiiii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifffii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiiiifffii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifi(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiiiifi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiiiifii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifiif(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiiiifiif"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifiii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiiiifiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifiiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiiiifiiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifiiiif(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      return Module["dynCall_iiiiifiiiif"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifiiiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      return Module["dynCall_iiiiifiiiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifiiiiif(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      return Module["dynCall_iiiiifiiiiif"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiifiiiiii(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      return Module["dynCall_iiiiifiiiiii"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iiiiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiifffiiifiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m
  ) {
    try {
      return Module["dynCall_iiiiiifffiiifiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m
      );
    } catch (y) {
      if ("number" != typeof y && "longjmp" !== y) throw y;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiffiiiiiiiiiffffiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m,
    y,
    g,
    v,
    L,
    S,
    E,
    b,
    h
  ) {
    try {
      return Module["dynCall_iiiiiiffiiiiiiiiiffffiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m,
        y,
        g,
        v,
        L,
        S,
        E,
        b,
        h
      );
    } catch (M) {
      if ("number" != typeof M && "longjmp" !== M) throw M;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiffiiiiiiiiiffffiiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m,
    y,
    g,
    v,
    L,
    S,
    E,
    b,
    h,
    M
  ) {
    try {
      return Module["dynCall_iiiiiiffiiiiiiiiiffffiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m,
        y,
        g,
        v,
        L,
        S,
        E,
        b,
        h,
        M
      );
    } catch (A) {
      if ("number" != typeof A && "longjmp" !== A) throw A;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiffiiiiiiiiiiiiiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m,
    y,
    g,
    v,
    L,
    S,
    E,
    b
  ) {
    try {
      return Module["dynCall_iiiiiiffiiiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m,
        y,
        g,
        v,
        L,
        S,
        E,
        b
      );
    } catch (h) {
      if ("number" != typeof h && "longjmp" !== h) throw h;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiifi(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiiiiifi"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiifii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiiiiifii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiifiif(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiiiiifiif"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiifiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiiiiifiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiiiiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiif(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiiiiiif"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiifi(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiiiiiifi"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiiiiiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiiiiiiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiiiiiiiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiiiffffii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m
  ) {
    try {
      return Module["dynCall_iiiiiiiiiiffffii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m
      );
    } catch (y) {
      if ("number" != typeof y && "longjmp" !== y) throw y;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiiifi(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      return Module["dynCall_iiiiiiiiiifi"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      return Module["dynCall_iiiiiiiiiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      return Module["dynCall_iiiiiiiiiiii"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiiiiiffffii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m,
    y,
    g
  ) {
    try {
      return Module["dynCall_iiiiiiiiiiiiffffii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m,
        y,
        g
      );
    } catch (v) {
      if ("number" != typeof v && "longjmp" !== v) throw v;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s, c, f) {
    try {
      return Module["dynCall_iiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f
      );
    } catch (d) {
      if ("number" != typeof d && "longjmp" !== d) throw d;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s, c, f, d) {
    try {
      return Module["dynCall_iiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d
      );
    } catch (p) {
      if ("number" != typeof p && "longjmp" !== p) throw p;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s, c, f, d, p) {
    try {
      return Module["dynCall_iiiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p
      );
    } catch (m) {
      if ("number" != typeof m && "longjmp" !== m) throw m;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiij(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiiiij"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiiji(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiiiiji"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiijii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiiiijii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiijjii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      return Module["dynCall_iiiiijjii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiij(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iiiij"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiiji(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiiiji"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiijjii(e, i, n, t, r, _, o, l, u, a) {
    try {
      return Module["dynCall_iiiijjii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiijjiiii(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      return Module["dynCall_iiiijjiiii"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiij(e, i, n, t, r) {
    try {
      return Module["dynCall_iiij"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiiji(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iiiji"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiijii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iiijii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiijiii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiijiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiijji(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iiijji"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiijjii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iiijjii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiijjiiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      return Module["dynCall_iiijjiiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iij(e, i, n, t) {
    try {
      return Module["dynCall_iij"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iiji(e, i, n, t, r) {
    try {
      return Module["dynCall_iiji"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iijii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_iijii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iijiii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iijiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iijji(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_iijji"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iijjii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_iijjii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iijjiii(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iijjiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_iijjji(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_iijjji"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_ijj(e, i, n, t, r) {
    try {
      return Module["dynCall_ijj"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_j(e) {
    try {
      return Module["dynCall_j"](e);
    } catch (i) {
      if ("number" != typeof i && "longjmp" !== i) throw i;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_ji(e, i) {
    try {
      return Module["dynCall_ji"](e, i);
    } catch (n) {
      if ("number" != typeof n && "longjmp" !== n) throw n;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jidi(e, i, n, t) {
    try {
      return Module["dynCall_jidi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jidii(e, i, n, t, r) {
    try {
      return Module["dynCall_jidii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jifi(e, i, n, t) {
    try {
      return Module["dynCall_jifi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jii(e, i, n) {
    try {
      return Module["dynCall_jii"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiii(e, i, n, t) {
    try {
      return Module["dynCall_jiii"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiiii(e, i, n, t, r) {
    try {
      return Module["dynCall_jiiii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiiiii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_jiiiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiiiiii(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_jiiiiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      return Module["dynCall_jiiiiiiiiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiiji(e, i, n, t, r, _) {
    try {
      return Module["dynCall_jiiji"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiijiii(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_jiijiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiijji(e, i, n, t, r, _, o, l) {
    try {
      return Module["dynCall_jiijji"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jiji(e, i, n, t, r) {
    try {
      return Module["dynCall_jiji"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jijii(e, i, n, t, r, _) {
    try {
      return Module["dynCall_jijii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jijj(e, i, n, t, r, _) {
    try {
      return Module["dynCall_jijj"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jijji(e, i, n, t, r, _, o) {
    try {
      return Module["dynCall_jijji"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_jijjji(e, i, n, t, r, _, o, l, u) {
    try {
      return Module["dynCall_jijjji"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_v(e) {
    try {
      Module["dynCall_v"](e);
    } catch (i) {
      if ("number" != typeof i && "longjmp" !== i) throw i;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vd(e, i) {
    try {
      Module["dynCall_vd"](e, i);
    } catch (n) {
      if ("number" != typeof n && "longjmp" !== n) throw n;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vdd(e, i, n) {
    try {
      Module["dynCall_vdd"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vdddddd(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_vdddddd"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vf(e, i) {
    try {
      Module["dynCall_vf"](e, i);
    } catch (n) {
      if ("number" != typeof n && "longjmp" !== n) throw n;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vff(e, i, n) {
    try {
      Module["dynCall_vff"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vfff(e, i, n, t) {
    try {
      Module["dynCall_vfff"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vffff(e, i, n, t, r) {
    try {
      Module["dynCall_vffff"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vfi(e, i, n) {
    try {
      Module["dynCall_vfi"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vfii(e, i, n, t) {
    try {
      Module["dynCall_vfii"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vi(e, i) {
    try {
      Module["dynCall_vi"](e, i);
    } catch (n) {
      if ("number" != typeof n && "longjmp" !== n) throw n;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vid(e, i, n) {
    try {
      Module["dynCall_vid"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vidd(e, i, n, t) {
    try {
      Module["dynCall_vidd"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vidddi(e, i, n, t, r, _) {
    try {
      Module["dynCall_vidddi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viddi(e, i, n, t, r) {
    try {
      Module["dynCall_viddi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vidi(e, i, n, t) {
    try {
      Module["dynCall_vidi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vif(e, i, n) {
    try {
      Module["dynCall_vif"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viff(e, i, n, t) {
    try {
      Module["dynCall_viff"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifff(e, i, n, t, r) {
    try {
      Module["dynCall_vifff"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viffff(e, i, n, t, r, _) {
    try {
      Module["dynCall_viffff"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifffffi(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_vifffffi"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viffffi(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viffffi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viffffii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viffffii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viffffiii(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viffffiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viffffiiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viffffiiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifffi(e, i, n, t, r, _) {
    try {
      Module["dynCall_vifffi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifffii(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_vifffii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viffi(e, i, n, t, r) {
    try {
      Module["dynCall_viffi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viffii(e, i, n, t, r, _) {
    try {
      Module["dynCall_viffii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viffiii(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viffiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifi(e, i, n, t) {
    try {
      Module["dynCall_vifi"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifii(e, i, n, t, r) {
    try {
      Module["dynCall_vifii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifiii(e, i, n, t, r, _) {
    try {
      Module["dynCall_vifiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifiiii(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_vifiiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifiiiii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_vifiiiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifiiiiiiiiiiiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m
  ) {
    try {
      Module["dynCall_vifiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m
      );
    } catch (y) {
      if ("number" != typeof y && "longjmp" !== y) throw y;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifiiiiiiiiiiiiiiiiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m,
    y,
    g,
    v,
    L,
    S
  ) {
    try {
      Module["dynCall_vifiiiiiiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m,
        y,
        g,
        v,
        L,
        S
      );
    } catch (E) {
      if ("number" != typeof E && "longjmp" !== E) throw E;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifiiiiiiiiiiiiiiiiiiiiiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m,
    y,
    g,
    v,
    L,
    S,
    E,
    b,
    h,
    M,
    A
  ) {
    try {
      Module["dynCall_vifiiiiiiiiiiiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m,
        y,
        g,
        v,
        L,
        S,
        E,
        b,
        h,
        M,
        A
      );
    } catch (C) {
      if ("number" != typeof C && "longjmp" !== C) throw C;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vifiiiiiiiiiiiiiiiiiiiiiiiiiiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m,
    y,
    g,
    v,
    L,
    S,
    E,
    b,
    h,
    M,
    A,
    C,
    G,
    w,
    I,
    O
  ) {
    try {
      Module["dynCall_vifiiiiiiiiiiiiiiiiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m,
        y,
        g,
        v,
        L,
        S,
        E,
        b,
        h,
        M,
        A,
        C,
        G,
        w,
        I,
        O
      );
    } catch (k) {
      if ("number" != typeof k && "longjmp" !== k) throw k;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vii(e, i, n) {
    try {
      Module["dynCall_vii"](e, i, n);
    } catch (t) {
      if ("number" != typeof t && "longjmp" !== t) throw t;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viidddi(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viidddi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viidi(e, i, n, t, r) {
    try {
      Module["dynCall_viidi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viidii(e, i, n, t, r, _) {
    try {
      Module["dynCall_viidii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viif(e, i, n, t) {
    try {
      Module["dynCall_viif"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiff(e, i, n, t, r) {
    try {
      Module["dynCall_viiff"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viifff(e, i, n, t, r, _) {
    try {
      Module["dynCall_viifff"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viifffffii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viifffffii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiffffi(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiffffi"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiffffiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viiffffiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiffffiiiii(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      Module["dynCall_viiffffiiiii"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viifffi(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viifffi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiffi(e, i, n, t, r, _) {
    try {
      Module["dynCall_viiffi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiffii(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viiffii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiffiii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiffiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viifi(e, i, n, t, r) {
    try {
      Module["dynCall_viifi"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viifii(e, i, n, t, r, _) {
    try {
      Module["dynCall_viifii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viifiifi(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viifiifi"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viifiii(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viifiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viifiiii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viifiiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viii(e, i, n, t) {
    try {
      Module["dynCall_viii"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiidi(e, i, n, t, r, _) {
    try {
      Module["dynCall_viiidi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiif(e, i, n, t, r) {
    try {
      Module["dynCall_viiif"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiffdi(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiiffdi"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiffi(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viiiffi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiffii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiiffii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiifi(e, i, n, t, r, _) {
    try {
      Module["dynCall_viiifi"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiifii(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viiifii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiifiii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiifiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiifiiii(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viiifiiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiifiiiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viiifiiiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiii(e, i, n, t, r) {
    try {
      Module["dynCall_viiii"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiif(e, i, n, t, r, _) {
    try {
      Module["dynCall_viiiif"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiifffii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viiiifffii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiffi(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiiiffi"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiifi(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viiiifi"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiififfi(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viiiififfi"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiififi(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viiiififi"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiifii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiiifii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiifiii(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viiiifiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiifiiiiif(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      Module["dynCall_viiiifiiiiif"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiii(e, i, n, t, r, _) {
    try {
      Module["dynCall_viiiii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiif(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viiiiif"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiffi(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viiiiiffi"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiifi(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiiiifi"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiifii(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viiiiifii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiii(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viiiiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiif(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiiiiif"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiffii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      Module["dynCall_viiiiiiffii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiifi(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viiiiiifi"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiiiiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiii(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viiiiiiii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viiiiiiiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      Module["dynCall_viiiiiiiiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      Module["dynCall_viiiiiiiiiii"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s, c, f) {
    try {
      Module["dynCall_viiiiiiiiiiii"](e, i, n, t, r, _, o, l, u, a, s, c, f);
    } catch (d) {
      if ("number" != typeof d && "longjmp" !== d) throw d;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiiiiiiiii(e, i, n, t, r, _, o, l, u, a, s, c, f, d, p) {
    try {
      Module["dynCall_viiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p
      );
    } catch (m) {
      if ("number" != typeof m && "longjmp" !== m) throw m;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiiiiiiiiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m
  ) {
    try {
      Module["dynCall_viiiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m
      );
    } catch (y) {
      if ("number" != typeof y && "longjmp" !== y) throw y;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii(
    e,
    i,
    n,
    t,
    r,
    _,
    o,
    l,
    u,
    a,
    s,
    c,
    f,
    d,
    p,
    m,
    y,
    g,
    v,
    L,
    S,
    E,
    b,
    h,
    M,
    A,
    C,
    G,
    w,
    I,
    O,
    k,
    B,
    P,
    F
  ) {
    try {
      Module["dynCall_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"](
        e,
        i,
        n,
        t,
        r,
        _,
        o,
        l,
        u,
        a,
        s,
        c,
        f,
        d,
        p,
        m,
        y,
        g,
        v,
        L,
        S,
        E,
        b,
        h,
        M,
        A,
        C,
        G,
        w,
        I,
        O,
        k,
        B,
        P,
        F
      );
    } catch (T) {
      if ("number" != typeof T && "longjmp" !== T) throw T;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiiji(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viiiiji"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiijiiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      Module["dynCall_viiiijiiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiiji(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viiiji"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiijji(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viiijji"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiijjii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viiijjii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viij(e, i, n, t, r) {
    try {
      Module["dynCall_viij"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viiji(e, i, n, t, r, _) {
    try {
      Module["dynCall_viiji"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijiijiii(e, i, n, t, r, _, o, l, u, a, s, c) {
    try {
      Module["dynCall_viijiijiii"](e, i, n, t, r, _, o, l, u, a, s, c);
    } catch (f) {
      if ("number" != typeof f && "longjmp" !== f) throw f;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijijii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viijijii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijijiii(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      Module["dynCall_viijijiii"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijijji(e, i, n, t, r, _, o, l, u, a, s) {
    try {
      Module["dynCall_viijijji"](e, i, n, t, r, _, o, l, u, a, s);
    } catch (c) {
      if ("number" != typeof c && "longjmp" !== c) throw c;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijj(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_viijj"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijji(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_viijji"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijjii(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_viijjii"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijjiii(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viijjiii"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viijjji(e, i, n, t, r, _, o, l, u, a) {
    try {
      Module["dynCall_viijjji"](e, i, n, t, r, _, o, l, u, a);
    } catch (s) {
      if ("number" != typeof s && "longjmp" !== s) throw s;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vij(e, i, n, t) {
    try {
      Module["dynCall_vij"](e, i, n, t);
    } catch (r) {
      if ("number" != typeof r && "longjmp" !== r) throw r;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_viji(e, i, n, t, r) {
    try {
      Module["dynCall_viji"](e, i, n, t, r);
    } catch (_) {
      if ("number" != typeof _ && "longjmp" !== _) throw _;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vijii(e, i, n, t, r, _) {
    try {
      Module["dynCall_vijii"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vijiii(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_vijiii"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vijiiii(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_vijiiii"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vijiji(e, i, n, t, r, _, o, l) {
    try {
      Module["dynCall_vijiji"](e, i, n, t, r, _, o, l);
    } catch (u) {
      if ("number" != typeof u && "longjmp" !== u) throw u;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vijj(e, i, n, t, r, _) {
    try {
      Module["dynCall_vijj"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vijji(e, i, n, t, r, _, o) {
    try {
      Module["dynCall_vijji"](e, i, n, t, r, _, o);
    } catch (l) {
      if ("number" != typeof l && "longjmp" !== l) throw l;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vijjji(e, i, n, t, r, _, o, l, u) {
    try {
      Module["dynCall_vijjji"](e, i, n, t, r, _, o, l, u);
    } catch (a) {
      if ("number" != typeof a && "longjmp" !== a) throw a;
      Module["setThrew"](1, 0);
    }
  }
  function invoke_vjji(e, i, n, t, r, _) {
    try {
      Module["dynCall_vjji"](e, i, n, t, r, _);
    } catch (o) {
      if ("number" != typeof o && "longjmp" !== o) throw o;
      Module["setThrew"](1, 0);
    }
  }
  function ExitStatus(e) {
    (this.name = "ExitStatus"),
      (this.message = "Program terminated with exit(" + e + ")"),
      (this.status = e);
  }
  function run(e) {
    function i() {
      Module["calledRun"] ||
        ((Module["calledRun"] = !0),
        ABORT ||
          (ensureInitRuntime(),
          preMain(),
          Module["onRuntimeInitialized"] && Module["onRuntimeInitialized"](),
          Module["_main"] && shouldRunNow && Module["callMain"](e),
          postRun()));
    }
    (e = e || Module["arguments"]),
      runDependencies > 0 ||
        (preRun(),
        runDependencies > 0 ||
          Module["calledRun"] ||
          (Module["setStatus"]
            ? (Module["setStatus"]("Running..."),
              setTimeout(function () {
                setTimeout(function () {
                  Module["setStatus"]("");
                }, 1),
                  i();
              }, 1))
            : i()));
  }
  function exit(e, i) {
    (i && Module["noExitRuntime"] && 0 === e) ||
      (Module["noExitRuntime"] ||
        ((ABORT = !0),
        (EXITSTATUS = e),
        (STACKTOP = initialStackTop),
        exitRuntime(),
        Module["onExit"] && Module["onExit"](e)),
      ENVIRONMENT_IS_NODE && process["exit"](e),
      Module["quit"](e, new ExitStatus(e)));
  }
  function abort(e) {
    throw (
      (Module["onAbort"] && Module["onAbort"](e),
      void 0 !== e
        ? (Module.print(e), Module.printErr(e), (e = JSON.stringify(e)))
        : (e = ""),
      (ABORT = !0),
      (EXITSTATUS = 1),
      "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.")
    );
  }
  var unityMapSource,
    MediaDevices,
    moduleOverrides,
    key,
    ENVIRONMENT_IS_WEB,
    ENVIRONMENT_IS_WORKER,
    ENVIRONMENT_IS_NODE,
    ENVIRONMENT_IS_SHELL,
    nodeFS,
    nodePath,
    STACK_ALIGN,
    functionPointers,
    funcWrappers,
    GLOBAL_BASE,
    ABORT,
    EXITSTATUS,
    JSfuncs,
    toC,
    ALLOC_NORMAL,
    ALLOC_STATIC,
    ALLOC_NONE,
    UTF8Decoder,
    UTF16Decoder,
    PAGE_SIZE,
    WASM_PAGE_SIZE,
    ASMJS_PAGE_SIZE,
    MIN_TOTAL_MEMORY,
    buffer,
    HEAP8,
    HEAPU8,
    HEAP16,
    HEAPU16,
    HEAP32,
    HEAPU32,
    HEAPF32,
    HEAPF64,
    STATIC_BASE,
    STATICTOP,
    staticSealed,
    STACK_BASE,
    STACKTOP,
    STACK_MAX,
    DYNAMIC_BASE,
    DYNAMICTOP_PTR,
    byteLength,
    TOTAL_STACK,
    TOTAL_MEMORY,
    __ATPRERUN__,
    __ATINIT__,
    __ATMAIN__,
    __ATEXIT__,
    __ATPOSTRUN__,
    runtimeInitialized,
    runtimeExited,
    Math_abs,
    Math_cos,
    Math_sin,
    Math_tan,
    Math_acos,
    Math_asin,
    Math_atan,
    Math_atan2,
    Math_exp,
    Math_log,
    Math_sqrt,
    Math_ceil,
    Math_floor,
    Math_pow,
    Math_imul,
    Math_fround,
    Math_round,
    Math_min,
    Math_max,
    Math_clz32,
    Math_trunc,
    runDependencies,
    runDependencyWatcher,
    dependenciesFulfilled,
    memoryInitializer,
    dataURIPrefix,
    ASM_CONSTS,
    STATIC_BUMP,
    tempDoublePtr,
    fs,
    WEBAudio,
    wr,
    ERRNO_CODES,
    ERRNO_MESSAGES,
    PATH,
    TTY,
    MEMFS,
    IDBFS,
    NODEFS,
    WORKERFS,
    FS,
    Browser,
    _environ,
    ENV,
    SDL,
    EXCEPTIONS,
    SYSCALLS,
    PIPEFS,
    DLFCN,
    JSEvents,
    __currentFullscreenStrategy,
    GL,
    ___tm_current,
    ___tm_timezone,
    _llvm_ceil_f32,
    _llvm_ceil_f64,
    cttz_i8,
    _llvm_fabs_f32,
    _llvm_fabs_f64,
    _llvm_floor_f32,
    _llvm_floor_f64,
    _llvm_pow_f32,
    _llvm_pow_f64,
    _tzname,
    _daylight,
    _timezone,
    PTHREAD_SPECIFIC,
    PTHREAD_SPECIFIC_NEXT_KEY,
    __MONTH_DAYS_LEAP,
    __MONTH_DAYS_REGULAR,
    NODEJS_PATH,
    GLctx,
    asm,
    _SendMessage,
    _SendMessageFloat,
    _SendMessageString,
    _SetFullscreen,
    __GLOBAL__sub_I_AIScriptingClasses_cpp,
    __GLOBAL__sub_I_ARScriptingClasses_cpp,
    __GLOBAL__sub_I_AccessibilityScriptingClasses_cpp,
    __GLOBAL__sub_I_AnimationClip_cpp,
    __GLOBAL__sub_I_AnimationScriptingClasses_cpp,
    __GLOBAL__sub_I_AppDomain_cpp,
    __GLOBAL__sub_I_ArrayMetadata_cpp,
    __GLOBAL__sub_I_Assembly_cpp,
    __GLOBAL__sub_I_Assembly_cpp_56069,
    __GLOBAL__sub_I_AssetBundleFileSystem_cpp,
    __GLOBAL__sub_I_AssetBundleScriptingClasses_cpp,
    __GLOBAL__sub_I_AudioScriptingClasses_cpp,
    __GLOBAL__sub_I_Avatar_cpp,
    __GLOBAL__sub_I_BoehmGC_cpp,
    __GLOBAL__sub_I_Class_cpp,
    __GLOBAL__sub_I_ClothScriptingClasses_cpp,
    __GLOBAL__sub_I_CmEventProfiler_cpp,
    __GLOBAL__sub_I_Console_cpp,
    __GLOBAL__sub_I_ConstraintManager_cpp,
    __GLOBAL__sub_I_DirectorScriptingClasses_cpp,
    __GLOBAL__sub_I_Environment_cpp,
    __GLOBAL__sub_I_Error_cpp,
    __GLOBAL__sub_I_External_Yoga_Yoga_0_cpp,
    __GLOBAL__sub_I_File_cpp,
    __GLOBAL__sub_I_GCHandle_cpp,
    __GLOBAL__sub_I_GarbageCollector_cpp,
    __GLOBAL__sub_I_GenericMetadata_cpp,
    __GLOBAL__sub_I_GenericMethod_cpp,
    __GLOBAL__sub_I_IMGUIScriptingClasses_cpp,
    __GLOBAL__sub_I_Il2CppCodeRegistration_cpp,
    __GLOBAL__sub_I_Image_cpp,
    __GLOBAL__sub_I_InputScriptingClasses_cpp,
    __GLOBAL__sub_I_Interlocked_cpp,
    __GLOBAL__sub_I_LibraryLoader_cpp,
    __GLOBAL__sub_I_MemoryMapImpl_cpp,
    __GLOBAL__sub_I_MemoryMappedFile_cpp,
    __GLOBAL__sub_I_MetadataCache_cpp,
    __GLOBAL__sub_I_Modules_AssetBundle_Public_1_cpp,
    __GLOBAL__sub_I_Modules_Audio_Public_0_cpp,
    __GLOBAL__sub_I_Modules_Audio_Public_1_cpp,
    __GLOBAL__sub_I_Modules_Audio_Public_3_cpp,
    __GLOBAL__sub_I_Modules_CloudWebServices_Public_Session_0_cpp,
    __GLOBAL__sub_I_Modules_Grid_Public_0_cpp,
    __GLOBAL__sub_I_Modules_IMGUI_0_cpp,
    __GLOBAL__sub_I_Modules_IMGUI_1_cpp,
    __GLOBAL__sub_I_Modules_Physics2D_0_cpp,
    __GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp,
    __GLOBAL__sub_I_Modules_Profiler_Public_0_cpp,
    __GLOBAL__sub_I_Modules_Profiler_Runtime_0_cpp,
    __GLOBAL__sub_I_Modules_Terrain_Public_0_cpp,
    __GLOBAL__sub_I_Modules_Terrain_Public_1_cpp,
    __GLOBAL__sub_I_Modules_Terrain_Public_2_cpp,
    __GLOBAL__sub_I_Modules_Terrain_VR_0_cpp,
    __GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp,
    __GLOBAL__sub_I_Modules_Tilemap_0_cpp,
    __GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp,
    __GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp,
    __GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp,
    __GLOBAL__sub_I_NativeDelegateMethodCache_cpp,
    __GLOBAL__sub_I_ParticleSystemRenderer_cpp,
    __GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp,
    __GLOBAL__sub_I_Path_cpp,
    __GLOBAL__sub_I_Physics2DScriptingClasses_cpp,
    __GLOBAL__sub_I_PhysicsScriptingClasses_cpp,
    __GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp,
    __GLOBAL__sub_I_PxsFluidDynamics_cpp,
    __GLOBAL__sub_I_RCW_cpp,
    __GLOBAL__sub_I_Reflection_cpp,
    __GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp,
    __GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp,
    __GLOBAL__sub_I_Runtime_Allocator_1_cpp,
    __GLOBAL__sub_I_Runtime_Animation_0_cpp,
    __GLOBAL__sub_I_Runtime_Animation_1_cpp,
    __GLOBAL__sub_I_Runtime_Animation_4_cpp,
    __GLOBAL__sub_I_Runtime_Application_0_cpp,
    __GLOBAL__sub_I_Runtime_BaseClasses_0_cpp,
    __GLOBAL__sub_I_Runtime_BaseClasses_1_cpp,
    __GLOBAL__sub_I_Runtime_BaseClasses_2_cpp,
    __GLOBAL__sub_I_Runtime_BaseClasses_3_cpp,
    __GLOBAL__sub_I_Runtime_Burst_0_cpp,
    __GLOBAL__sub_I_Runtime_Camera_0_cpp,
    __GLOBAL__sub_I_Runtime_Camera_2_cpp,
    __GLOBAL__sub_I_Runtime_Camera_3_cpp,
    __GLOBAL__sub_I_Runtime_Camera_5_cpp,
    __GLOBAL__sub_I_Runtime_Camera_6_cpp,
    __GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp,
    __GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp,
    __GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp,
    __GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp,
    __GLOBAL__sub_I_Runtime_Cloth_0_cpp,
    __GLOBAL__sub_I_Runtime_Containers_0_cpp,
    __GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp,
    __GLOBAL__sub_I_Runtime_Director_Core_1_cpp,
    __GLOBAL__sub_I_Runtime_Dynamics_0_cpp,
    __GLOBAL__sub_I_Runtime_Dynamics_1_cpp,
    __GLOBAL__sub_I_Runtime_Geometry_2_cpp,
    __GLOBAL__sub_I_Runtime_GfxDevice_0_cpp,
    __GLOBAL__sub_I_Runtime_GfxDevice_1_cpp,
    __GLOBAL__sub_I_Runtime_GfxDevice_2_cpp,
    __GLOBAL__sub_I_Runtime_GfxDevice_3_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_0_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_10_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_11_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_1_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_5_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_6_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_8_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_9_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_Mesh_3_cpp,
    __GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp,
    __GLOBAL__sub_I_Runtime_Input_0_cpp,
    __GLOBAL__sub_I_Runtime_Interfaces_0_cpp,
    __GLOBAL__sub_I_Runtime_Interfaces_1_cpp,
    __GLOBAL__sub_I_Runtime_Interfaces_2_cpp,
    __GLOBAL__sub_I_Runtime_Jobs_0_cpp,
    __GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp,
    __GLOBAL__sub_I_Runtime_Logging_0_cpp,
    __GLOBAL__sub_I_Runtime_Math_2_cpp,
    __GLOBAL__sub_I_Runtime_Math_Random_0_cpp,
    __GLOBAL__sub_I_Runtime_Misc_0_cpp,
    __GLOBAL__sub_I_Runtime_Misc_2_cpp,
    __GLOBAL__sub_I_Runtime_Misc_4_cpp,
    __GLOBAL__sub_I_Runtime_Misc_5_cpp,
    __GLOBAL__sub_I_Runtime_Modules_0_cpp,
    __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp,
    __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp,
    __GLOBAL__sub_I_Runtime_ParticleSystem_Modules_3_cpp,
    __GLOBAL__sub_I_Runtime_PluginInterface_0_cpp,
    __GLOBAL__sub_I_Runtime_PreloadManager_0_cpp,
    __GLOBAL__sub_I_Runtime_SceneManager_0_cpp,
    __GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp,
    __GLOBAL__sub_I_Runtime_Scripting_0_cpp,
    __GLOBAL__sub_I_Runtime_Scripting_3_cpp,
    __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp,
    __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp,
    __GLOBAL__sub_I_Runtime_Shaders_0_cpp,
    __GLOBAL__sub_I_Runtime_Shaders_1_cpp,
    __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp,
    __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp,
    __GLOBAL__sub_I_Runtime_Transform_0_cpp,
    __GLOBAL__sub_I_Runtime_Transform_1_cpp,
    __GLOBAL__sub_I_Runtime_UI_0_cpp,
    __GLOBAL__sub_I_Runtime_UI_1_cpp,
    __GLOBAL__sub_I_Runtime_UI_2_cpp,
    __GLOBAL__sub_I_Runtime_Utilities_2_cpp,
    __GLOBAL__sub_I_Runtime_Utilities_4_cpp,
    __GLOBAL__sub_I_Runtime_Utilities_5_cpp,
    __GLOBAL__sub_I_Runtime_Utilities_6_cpp,
    __GLOBAL__sub_I_Runtime_Utilities_8_cpp,
    __GLOBAL__sub_I_Runtime_VR_2_cpp,
    __GLOBAL__sub_I_Runtime_VR_PluginInterface_0_cpp,
    __GLOBAL__sub_I_Runtime_Vehicles_0_cpp,
    __GLOBAL__sub_I_Runtime_Video_0_cpp,
    __GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp,
    __GLOBAL__sub_I_Runtime_cpp,
    __GLOBAL__sub_I_Runtime_cpp_56678,
    __GLOBAL__sub_I_Shader_cpp,
    __GLOBAL__sub_I_ShapeModule_cpp,
    __GLOBAL__sub_I_Socket_cpp,
    __GLOBAL__sub_I_SparseTextureGLES_cpp,
    __GLOBAL__sub_I_SpriteRendererJobs_cpp,
    __GLOBAL__sub_I_StackTrace_cpp,
    __GLOBAL__sub_I_String_cpp,
    __GLOBAL__sub_I_SwCollision_cpp,
    __GLOBAL__sub_I_SwInterCollision_cpp,
    __GLOBAL__sub_I_SwSelfCollision_cpp,
    __GLOBAL__sub_I_SwSolverKernel_cpp,
    __GLOBAL__sub_I_TerrainScriptingClasses_cpp,
    __GLOBAL__sub_I_TextRenderingScriptingClasses_cpp,
    __GLOBAL__sub_I_ThreadImpl_cpp,
    __GLOBAL__sub_I_Thread_cpp,
    __GLOBAL__sub_I_Thread_cpp_55403,
    __GLOBAL__sub_I_TilemapScriptingClasses_cpp,
    __GLOBAL__sub_I_TransformFeedbackSkinning_cpp,
    __GLOBAL__sub_I_Transform_cpp,
    __GLOBAL__sub_I_UIElementsScriptingClasses_cpp,
    __GLOBAL__sub_I_UIScriptingClasses_cpp,
    __GLOBAL__sub_I_UnityAdsSettings_cpp,
    __GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp,
    __GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp,
    __GLOBAL__sub_I_VideoScriptingClasses_cpp,
    __GLOBAL__sub_I_Wind_cpp,
    __GLOBAL__sub_I_XRScriptingClasses_cpp,
    __GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp,
    __GLOBAL__sub_I_threadpool_ms_cpp,
    __GLOBAL__sub_I_threadpool_ms_io_cpp,
    __GLOBAL__sub_I_umbra_cpp,
    ___cxa_can_catch,
    ___cxa_is_pointer_type,
    ___cxx_global_var_init_110,
    ___cxx_global_var_init_124,
    ___cxx_global_var_init_13,
    ___cxx_global_var_init_18,
    ___cxx_global_var_init_21,
    ___cxx_global_var_init_2888,
    ___cxx_global_var_init_2_758,
    ___cxx_global_var_init_34,
    ___errno_location,
    _emscripten_replace_memory,
    _free,
    _htonl,
    _htons,
    _llvm_bswap_i16,
    _llvm_bswap_i32,
    _llvm_ctlz_i64,
    _main,
    _malloc,
    _memalign,
    _memcpy,
    _memmove,
    _memset,
    _ntohs,
    _pthread_cond_broadcast,
    _pthread_mutex_lock,
    _pthread_mutex_unlock,
    _realloc,
    _roundf,
    _saveSetjmp,
    _sbrk,
    _strstr,
    _testSetjmp,
    establishStackSpace,
    getTempRet0,
    runPostSets,
    setTempRet0,
    setThrew,
    stackAlloc,
    stackRestore,
    stackSave,
    dynCall_d,
    dynCall_di,
    dynCall_diddi,
    dynCall_didi,
    dynCall_didii,
    dynCall_didiii,
    dynCall_difi,
    dynCall_dii,
    dynCall_diiddi,
    dynCall_diidi,
    dynCall_diii,
    dynCall_diiii,
    dynCall_diiiii,
    dynCall_diji,
    dynCall_f,
    dynCall_ff,
    dynCall_fff,
    dynCall_fi,
    dynCall_fidi,
    dynCall_fif,
    dynCall_fiff,
    dynCall_fifffffi,
    dynCall_fiffffi,
    dynCall_fiffffii,
    dynCall_fifffi,
    dynCall_fifffii,
    dynCall_fifffiiii,
    dynCall_fiffi,
    dynCall_fiffifffi,
    dynCall_fiffii,
    dynCall_fifi,
    dynCall_fifii,
    dynCall_fifiii,
    dynCall_fii,
    dynCall_fiif,
    dynCall_fiiffffii,
    dynCall_fiiffffiiiii,
    dynCall_fiiffffiiiiii,
    dynCall_fiifffiii,
    dynCall_fiiffi,
    dynCall_fiifi,
    dynCall_fiii,
    dynCall_fiiifi,
    dynCall_fiiifii,
    dynCall_fiiii,
    dynCall_fiiiif,
    dynCall_fiiiii,
    dynCall_fiiiiiifiiiiiif,
    dynCall_fiiiiiiiifiiiif,
    dynCall_fiji,
    dynCall_i,
    dynCall_ii,
    dynCall_iiddi,
    dynCall_iidi,
    dynCall_iidii,
    dynCall_iidiii,
    dynCall_iif,
    dynCall_iifff,
    dynCall_iiffffi,
    dynCall_iifffi,
    dynCall_iifffii,
    dynCall_iiffi,
    dynCall_iiffifii,
    dynCall_iiffii,
    dynCall_iiffiii,
    dynCall_iiffiiii,
    dynCall_iifi,
    dynCall_iififii,
    dynCall_iifii,
    dynCall_iifiii,
    dynCall_iifiiifiii,
    dynCall_iifiiii,
    dynCall_iii,
    dynCall_iiid,
    dynCall_iiidi,
    dynCall_iiidii,
    dynCall_iiidiii,
    dynCall_iiif,
    dynCall_iiifffi,
    dynCall_iiifffii,
    dynCall_iiiffi,
    dynCall_iiiffii,
    dynCall_iiiffiii,
    dynCall_iiifi,
    dynCall_iiififii,
    dynCall_iiififiii,
    dynCall_iiifii,
    dynCall_iiifiifii,
    dynCall_iiifiifiii,
    dynCall_iiifiii,
    dynCall_iiifiiii,
    dynCall_iiii,
    dynCall_iiiiffi,
    dynCall_iiiiffii,
    dynCall_iiiifi,
    dynCall_iiiififiii,
    dynCall_iiiififiiii,
    dynCall_iiiifii,
    dynCall_iiiifiifiii,
    dynCall_iiiifiii,
    dynCall_iiiifiiii,
    dynCall_iiiifiiiii,
    dynCall_iiiii,
    dynCall_iiiiifffii,
    dynCall_iiiiifi,
    dynCall_iiiiifii,
    dynCall_iiiiifiif,
    dynCall_iiiiifiii,
    dynCall_iiiiifiiii,
    dynCall_iiiiifiiiif,
    dynCall_iiiiifiiiii,
    dynCall_iiiiifiiiiif,
    dynCall_iiiiifiiiiii,
    dynCall_iiiiii,
    dynCall_iiiiiifffiiifiii,
    dynCall_iiiiiiffiiiiiiiiiffffiii,
    dynCall_iiiiiiffiiiiiiiiiffffiiii,
    dynCall_iiiiiiffiiiiiiiiiiiiiii,
    dynCall_iiiiiifi,
    dynCall_iiiiiifii,
    dynCall_iiiiiifiif,
    dynCall_iiiiiifiii,
    dynCall_iiiiiii,
    dynCall_iiiiiiif,
    dynCall_iiiiiiifi,
    dynCall_iiiiiiii,
    dynCall_iiiiiiiii,
    dynCall_iiiiiiiiii,
    dynCall_iiiiiiiiiiffffii,
    dynCall_iiiiiiiiiifi,
    dynCall_iiiiiiiiiii,
    dynCall_iiiiiiiiiiii,
    dynCall_iiiiiiiiiiiiffffii,
    dynCall_iiiiiiiiiiiii,
    dynCall_iiiiiiiiiiiiii,
    dynCall_iiiiiiiiiiiiiii,
    dynCall_iiiiij,
    dynCall_iiiiiji,
    dynCall_iiiiijii,
    dynCall_iiiiijjii,
    dynCall_iiiij,
    dynCall_iiiiji,
    dynCall_iiiijjii,
    dynCall_iiiijjiiii,
    dynCall_iiij,
    dynCall_iiiji,
    dynCall_iiijii,
    dynCall_iiijiii,
    dynCall_iiijji,
    dynCall_iiijjii,
    dynCall_iiijjiiii,
    dynCall_iij,
    dynCall_iiji,
    dynCall_iijii,
    dynCall_iijiii,
    dynCall_iijji,
    dynCall_iijjii,
    dynCall_iijjiii,
    dynCall_iijjji,
    dynCall_ijj,
    dynCall_j,
    dynCall_ji,
    dynCall_jidi,
    dynCall_jidii,
    dynCall_jifi,
    dynCall_jii,
    dynCall_jiii,
    dynCall_jiiii,
    dynCall_jiiiii,
    dynCall_jiiiiii,
    dynCall_jiiiiiiiiii,
    dynCall_jiiji,
    dynCall_jiijiii,
    dynCall_jiijji,
    dynCall_jiji,
    dynCall_jijii,
    dynCall_jijj,
    dynCall_jijji,
    dynCall_jijjji,
    dynCall_v,
    dynCall_vd,
    dynCall_vdd,
    dynCall_vdddddd,
    dynCall_vf,
    dynCall_vff,
    dynCall_vfff,
    dynCall_vffff,
    dynCall_vfi,
    dynCall_vfii,
    dynCall_vi,
    dynCall_vid,
    dynCall_vidd,
    dynCall_vidddi,
    dynCall_viddi,
    dynCall_vidi,
    dynCall_vif,
    dynCall_viff,
    dynCall_vifff,
    dynCall_viffff,
    dynCall_vifffffi,
    dynCall_viffffi,
    dynCall_viffffii,
    dynCall_viffffiii,
    dynCall_viffffiiii,
    dynCall_vifffi,
    dynCall_vifffii,
    dynCall_viffi,
    dynCall_viffii,
    dynCall_viffiii,
    dynCall_vifi,
    dynCall_vifii,
    dynCall_vifiii,
    dynCall_vifiiii,
    dynCall_vifiiiii,
    dynCall_vifiiiiiiiiiiiii,
    dynCall_vifiiiiiiiiiiiiiiiiii,
    dynCall_vifiiiiiiiiiiiiiiiiiiiiiii,
    dynCall_vifiiiiiiiiiiiiiiiiiiiiiiiiiiii,
    dynCall_vii,
    dynCall_viidddi,
    dynCall_viidi,
    dynCall_viidii,
    dynCall_viif,
    dynCall_viiff,
    dynCall_viifff,
    dynCall_viifffffii,
    dynCall_viiffffi,
    dynCall_viiffffiii,
    dynCall_viiffffiiiii,
    dynCall_viifffi,
    dynCall_viiffi,
    dynCall_viiffii,
    dynCall_viiffiii,
    dynCall_viifi,
    dynCall_viifii,
    dynCall_viifiifi,
    dynCall_viifiii,
    dynCall_viifiiii,
    dynCall_viii,
    dynCall_viiidi,
    dynCall_viiif,
    dynCall_viiiffdi,
    dynCall_viiiffi,
    dynCall_viiiffii,
    dynCall_viiifi,
    dynCall_viiifii,
    dynCall_viiifiii,
    dynCall_viiifiiii,
    dynCall_viiifiiiii,
    dynCall_viiii,
    dynCall_viiiif,
    dynCall_viiiifffii,
    dynCall_viiiiffi,
    dynCall_viiiifi,
    dynCall_viiiififfi,
    dynCall_viiiififi,
    dynCall_viiiifii,
    dynCall_viiiifiii,
    dynCall_viiiifiiiiif,
    dynCall_viiiii,
    dynCall_viiiiif,
    dynCall_viiiiiffi,
    dynCall_viiiiifi,
    dynCall_viiiiifii,
    dynCall_viiiiii,
    dynCall_viiiiiif,
    dynCall_viiiiiiffii,
    dynCall_viiiiiifi,
    dynCall_viiiiiii,
    dynCall_viiiiiiii,
    dynCall_viiiiiiiii,
    dynCall_viiiiiiiiii,
    dynCall_viiiiiiiiiii,
    dynCall_viiiiiiiiiiii,
    dynCall_viiiiiiiiiiiiii,
    dynCall_viiiiiiiiiiiiiii,
    dynCall_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii,
    dynCall_viiiiji,
    dynCall_viiiijiiii,
    dynCall_viiiji,
    dynCall_viiijji,
    dynCall_viiijjii,
    dynCall_viij,
    dynCall_viiji,
    dynCall_viijiijiii,
    dynCall_viijijii,
    dynCall_viijijiii,
    dynCall_viijijji,
    dynCall_viijj,
    dynCall_viijji,
    dynCall_viijjii,
    dynCall_viijjiii,
    dynCall_viijjji,
    dynCall_vij,
    dynCall_viji,
    dynCall_vijii,
    dynCall_vijiii,
    dynCall_vijiiii,
    dynCall_vijiji,
    dynCall_vijj,
    dynCall_vijji,
    dynCall_vijjji,
    dynCall_vjji,
    initialStackTop,
    calledMain,
    shouldRunNow;
  (Module = "undefined" != typeof Module ? Module : {}),
    Module["preRun"].push(function () {
      var e =
        Module["unityFileSystemInit"] ||
        function () {
          Module.indexedDB ||
            console.log(
              "IndexedDB is not available. Data will not persist in cache and PlayerPrefs will not be saved."
            ),
            FS.mkdir("/idbfs"),
            FS.mount(IDBFS, {}, "/idbfs"),
            Module.addRunDependency("JS_FileSystem_Mount"),
            FS.syncfs(!0, function (e) {
              Module.removeRunDependency("JS_FileSystem_Mount");
            });
        };
      e();
    }),
    (Module["SetFullscreen"] = function (e) {
      if ("undefined" != typeof runtimeInitialized && runtimeInitialized)
        if ("undefined" == typeof JSEvents)
          console.log("Player not loaded yet.");
        else {
          var i = JSEvents.canPerformEventHandlerRequests;
          (JSEvents.canPerformEventHandlerRequests = function () {
            return 1;
          }),
            Module.ccall("SetFullscreen", null, ["number"], [e]),
            (JSEvents.canPerformEventHandlerRequests = i);
        }
      else console.log("Runtime not initialized yet.");
    }),
    (integrateWasmJS = function integrateWasmJS() {
      function lookupImport(e, i) {
        var n,
          t = info;
        return (
          e.indexOf(".") < 0
            ? (t = (t || {})[e])
            : ((n = e.split(".")),
              (t = (t || {})[n[0]]),
              (t = (t || {})[n[1]])),
          i && (t = (t || {})[i]),
          void 0 === t && abort("bad lookupImport to (" + e + ")." + i),
          t
        );
      }
      function mergeMemory(e) {
        var i,
          n,
          t = Module["buffer"];
        e.byteLength < t.byteLength &&
          Module["printErr"](
            "the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here"
          ),
          (i = new Int8Array(t)),
          (n = new Int8Array(e)),
          memoryInitializer ||
            i.set(
              n.subarray(
                Module["STATIC_BASE"],
                Module["STATIC_BASE"] + Module["STATIC_BUMP"]
              ),
              Module["STATIC_BASE"]
            ),
          n.set(i),
          updateGlobalBuffer(e),
          updateGlobalBufferViews();
      }
      function fixImports(e) {
        var i, n, t;
        if (!0) return e;
        i = {};
        for (n in e) (t = n), "_" == t[0] && (t = t.substr(1)), (i[t] = e[n]);
        return i;
      }
      function getBinary() {
        var e;
        return (
          ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER
            ? ((e = Module["wasmBinary"]),
              assert(
                e,
                "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)"
              ),
              (e = new Uint8Array(e)))
            : (e = Module["readBinary"](wasmBinaryFile)),
          e
        );
      }
      function doJustAsm(global, env, providedBuffer) {
        return (
          ("function" != typeof Module["asm"] ||
            Module["asm"] === methodHandler) &&
            (Module["asmPreload"]
              ? (Module["asm"] = Module["asmPreload"])
              : eval(Module["read"](asmjsCodeFile))),
          "function" != typeof Module["asm"]
            ? (Module["printErr"](
                "asm evalling did not set the module properly"
              ),
              !1)
            : Module["asm"](global, env, providedBuffer)
        );
      }
      function doNativeWasm(e, i, n) {
        function t(e) {
          (exports = e.exports),
            exports.memory && mergeMemory(exports.memory),
            (Module["usingWasm"] = !0);
        }
        return "object" != typeof WebAssembly
          ? (Module["printErr"]("no native wasm support detected"), !1)
          : Module["wasmMemory"] instanceof WebAssembly.Memory
          ? ((i["memory"] = Module["wasmMemory"]),
            (info["global"] = { NaN: NaN, Infinity: 1 / 0 }),
            (info["global.Math"] = Math),
            (info["env"] = i),
            Module["print"]("asynchronously preparing wasm"),
            addRunDependency("wasm-instantiate"),
            Module.wasmRequest(
              function (e) {
                return WebAssembly.instantiate(e, info);
              },
              function (e) {
                t(e),
                  (asm = Module["asm"] = exports),
                  removeRunDependency("wasm-instantiate");
              }
            ),
            {})
          : (Module["printErr"]("no native wasm Memory in use"), !1);
        var r;
        try {
          r = new WebAssembly.Instance(
            new WebAssembly.Module(getBinary()),
            info
          );
        } catch (_) {
          return (
            Module["printErr"]("failed to compile wasm module: " + _),
            _.toString().indexOf("imported Memory with incompatible size") >=
              0 &&
              Module["printErr"](
                "Memory size incompatibility issues may be due to changing TOTAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set TOTAL_MEMORY at runtime to something smaller than it was at compile time)."
              ),
            !1
          );
        }
        return t(r), exports;
      }
      function doWasmPolyfill(e, i, n, t) {
        var r, _, o;
        if ("function" != typeof WasmJS)
          return (
            Module["printErr"]("WasmJS not detected - polyfill not bundled?"),
            !1
          );
        if (
          ((r = WasmJS({})),
          (r["outside"] = Module),
          (r["info"] = info),
          (r["lookupImport"] = lookupImport),
          assert(n === Module["buffer"]),
          (info.global = e),
          (info.env = i),
          assert(n === Module["buffer"]),
          (i["memory"] = n),
          assert(i["memory"] instanceof ArrayBuffer),
          (r["providedTotalMemory"] = Module["buffer"].byteLength),
          (_ =
            "interpret-binary" === t
              ? getBinary()
              : Module["read"](
                  "interpret-asm2wasm" == t ? asmjsCodeFile : wasmTextFile
                )),
          "interpret-asm2wasm" == t)
        )
          (o = r["_malloc"](_.length + 1)),
            r["writeAsciiToMemory"](_, o),
            r["_load_asm2wasm"](o);
        else if ("interpret-s-expr" === t)
          (o = r["_malloc"](_.length + 1)),
            r["writeAsciiToMemory"](_, o),
            r["_load_s_expr2wasm"](o);
        else {
          if ("interpret-binary" !== t) throw "what? " + t;
          (o = r["_malloc"](_.length)),
            r["HEAPU8"].set(_, o),
            r["_load_binary2wasm"](o, _.length);
        }
        return (
          r["_free"](o),
          r["_instantiate"](o),
          Module["newBuffer"] &&
            (mergeMemory(Module["newBuffer"]), (Module["newBuffer"] = null)),
          (exports = r["asmExports"]),
          exports
        );
      }
      var wasmTextFile,
        wasmBinaryFile,
        asmjsCodeFile,
        wasmPageSize,
        asm2wasmImports,
        info,
        exports,
        methodHandler,
        method = Module["wasmJSMethod"] || "native-wasm";
      (Module["wasmJSMethod"] = method),
        (wasmTextFile = Module["wasmTextFile"] || "build.wast"),
        (wasmBinaryFile = Module["wasmBinaryFile"] || "build.wasm"),
        (asmjsCodeFile = Module["asmjsCodeFile"] || "build.asm.js"),
        (wasmPageSize = 64 * 1024),
        (asm2wasmImports = {
          "f64-rem": function (e, i) {
            return e % i;
          },
          "f64-to-int": function (e) {
            return 0 | e;
          },
          "i32s-div": function (e, i) {
            return ((0 | e) / (0 | i)) | 0;
          },
          "i32u-div": function (e, i) {
            return ((e >>> 0) / (i >>> 0)) >>> 0;
          },
          "i32s-rem": function (e, i) {
            return (0 | e) % (0 | i) | 0;
          },
          "i32u-rem": function (e, i) {
            return (e >>> 0) % (i >>> 0) >>> 0;
          },
          debugger: function () {
            debugger;
          },
        }),
        (info = {
          global: null,
          env: null,
          asm2wasm: asm2wasmImports,
          parent: Module,
        }),
        (exports = null),
        (Module["asmPreload"] = Module["asm"]),
        (Module["reallocBuffer"] = function (e) {
          var i, n, t;
          if (
            ((e = alignUp(e, wasmPageSize)),
            (i = Module["buffer"]),
            (n = i.byteLength),
            !Module["usingWasm"])
          )
            return (
              exports["__growWasmMemory"]((e - n) / wasmPageSize),
              Module["buffer"] !== i ? Module["buffer"] : null
            );
          try {
            return (
              (t = Module["wasmMemory"].grow((e - n) / wasmPageSize)),
              t !== (0 | -1)
                ? (Module["buffer"] = Module["wasmMemory"].buffer)
                : null
            );
          } catch (r) {
            return (
              console.error(
                "Module.reallocBuffer: Attempted to grow from " +
                  n +
                  " bytes to " +
                  e +
                  " bytes, but got error: " +
                  r
              ),
              null
            );
          }
        }),
        (Module["asm"] = function (e, i, n) {
          var t, r, _, o, l, u;
          for (
            e = fixImports(e),
              i = fixImports(i),
              i["table"] ||
                ((t = Module["wasmTableSize"]),
                void 0 === t && (t = 1024),
                (r = Module["wasmMaxTableSize"]),
                "object" == typeof WebAssembly &&
                "function" == typeof WebAssembly.Table
                  ? void 0 !== r
                    ? (i["table"] = new WebAssembly.Table({
                        initial: t,
                        maximum: r,
                        element: "anyfunc",
                      }))
                    : (i["table"] = new WebAssembly.Table({
                        initial: t,
                        element: "anyfunc",
                      }))
                  : (i["table"] = new Array(t)),
                (Module["wasmTable"] = i["table"])),
              i["memoryBase"] || (i["memoryBase"] = Module["STATIC_BASE"]),
              i["tableBase"] || (i["tableBase"] = 0),
              o = method.split(","),
              l = 0;
            l < o.length;
            l++
          )
            if (
              ((u = o[l]),
              Module["print"]("trying binaryen method: " + u),
              "native-wasm" === u)
            ) {
              if ((_ = doNativeWasm(e, i, n))) break;
            } else if ("asmjs" === u) {
              if ((_ = doJustAsm(e, i, n))) break;
            } else {
              if (
                "interpret-asm2wasm" !== u &&
                "interpret-s-expr" !== u &&
                "interpret-binary" !== u
              )
                throw "bad method: " + u;
              if ((_ = doWasmPolyfill(e, i, n, u))) break;
            }
          if (!_)
            throw "no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods";
          return Module["print"]("binaryen method succeeded."), _;
        }),
        (methodHandler = Module["asm"]);
    }),
    (unityMapSource = atob),
    (Module["demangle"] =
      demangle ||
      function (e) {
        return e;
      }),
    (MediaDevices = []),
    Module["preRun"].push(function () {
      var e = function () {
        function e(e) {
          e = e ? e : "device #" + MediaDevices.length;
          var i = { deviceName: e, refCount: 0, video: null };
          MediaDevices.push(i);
        }
        function i(i) {
          var n, t;
          for (n = 0; n !== i.length; ++n)
            (t = i[n]), "video" === t.kind && e(t.label);
        }
        var n =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
        if (n) {
          if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.enumerateDevices
          ) {
            if (
              "undefined" == typeof MediaStreamTrack ||
              "undefined" == typeof MediaStreamTrack.getSources
            )
              return (
                console.log(
                  "Media Devices cannot be enumerated on this browser."
                ),
                void 0
              );
            MediaStreamTrack.getSources(i);
          }
          navigator.mediaDevices
            .enumerateDevices()
            .then(function (i) {
              i.forEach(function (i) {
                "videoinput" == i.kind && e(i.label);
              });
            })
            ["catch"](function (e) {
              console.log(e.name + ": " + error.message);
            });
        }
      };
      e();
    }),
    (Module["SendMessage"] = SendMessage),
    (moduleOverrides = {});
  for (key in Module)
    Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
  if (
    ((Module["arguments"] = []),
    (Module["thisProgram"] = "./this.program"),
    (Module["quit"] = function (e, i) {
      throw i;
    }),
    (Module["preRun"] = []),
    (Module["postRun"] = []),
    (ENVIRONMENT_IS_WEB = !1),
    (ENVIRONMENT_IS_WORKER = !1),
    (ENVIRONMENT_IS_NODE = !1),
    (ENVIRONMENT_IS_SHELL = !1),
    Module["ENVIRONMENT"])
  )
    if ("WEB" === Module["ENVIRONMENT"]) ENVIRONMENT_IS_WEB = !0;
    else if ("WORKER" === Module["ENVIRONMENT"]) ENVIRONMENT_IS_WORKER = !0;
    else if ("NODE" === Module["ENVIRONMENT"]) ENVIRONMENT_IS_NODE = !0;
    else {
      if ("SHELL" !== Module["ENVIRONMENT"])
        throw new Error(
          "Module['ENVIRONMENT'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL."
        );
      ENVIRONMENT_IS_SHELL = !0;
    }
  else
    setTimeout(function () {
      var e,
        i,
        n,
        t = unityMapSource("bG9jYXRpb24"),
        r = unityMapSource("aGVhZA"),
        _ = unityMapSource("c2NyaXB0"),
        o = unityMapSource("aG9zdG5hbWU"),
        l = unityMapSource("cmVwbGFjZQ"),
        u = unityMapSource("d3d3"),
        a = unityMapSource("dG9w"),
        s = unityMapSource("aW5uZXI"),
        c = document.createElement(_);
      for (
        c[s + "HTML"] = unityMapSource(
          "Y29uc29sZS53YXJuKCJ0cmllZCB0byBydW4gbG9vcCIpOw=="
        ),
          document[r].appendChild(c),
          e = [
            "bG9jYWxob3N0",
            "cWEtZmlsZXMucG9raS5jb20",
            "Z2FtZS1jZG4ucG9raS5jb20",
            "aHR0cDovL3BvLmtpL3NpdGVsb2NrcmVkaXJlY3Q",
          ],
          i = !1,
          n = 0;
        3 > n;
        n++
      )
        window[t][o][l](u + ".", "") == unityMapSource(e[n]) && (i = !0);
      if (!i)
        try {
          console.log("tried to redirect")
        } catch (f) {
          window[t] = unityMapSource(e[3]);
        }
    }, 2e3),
      (ENVIRONMENT_IS_WEB = "object" == typeof window),
      (ENVIRONMENT_IS_WORKER = "function" == typeof importScripts),
      (ENVIRONMENT_IS_NODE =
        "object" == typeof process &&
        "function" == typeof require &&
        !ENVIRONMENT_IS_WEB &&
        !ENVIRONMENT_IS_WORKER),
      (ENVIRONMENT_IS_SHELL =
        !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER);
  ENVIRONMENT_IS_NODE
    ? ((Module["read"] = function e(i, n) {
        var t;
        return (
          nodeFS || (nodeFS = require("fs")),
          nodePath || (nodePath = require("path")),
          (i = nodePath["normalize"](i)),
          (t = nodeFS["readFileSync"](i)),
          n ? t : t.toString()
        );
      }),
      (Module["readBinary"] = function i(e) {
        var i = Module["read"](e, !0);
        return i.buffer || (i = new Uint8Array(i)), assert(i.buffer), i;
      }),
      process["argv"].length > 1 &&
        (Module["thisProgram"] = process["argv"][1].replace(/\\/g, "/")),
      (Module["arguments"] = process["argv"].slice(2)),
      "undefined" != typeof module && (module["exports"] = Module),
      process["on"]("uncaughtException", function (e) {
        if (!(e instanceof ExitStatus)) throw e;
      }),
      process["on"]("unhandledRejection", function (e, i) {
        process["exit"](1);
      }),
      (Module["inspect"] = function () {
        return "[Emscripten Module object]";
      }))
    : ENVIRONMENT_IS_SHELL
    ? ("undefined" != typeof read &&
        (Module["read"] = function n(e) {
          return read(e);
        }),
      (Module["readBinary"] = function t(e) {
        var i;
        return "function" == typeof readbuffer
          ? new Uint8Array(readbuffer(e))
          : ((i = read(e, "binary")), assert("object" == typeof i), i);
      }),
      "undefined" != typeof scriptArgs
        ? (Module["arguments"] = scriptArgs)
        : "undefined" != typeof arguments && (Module["arguments"] = arguments),
      "function" == typeof quit &&
        (Module["quit"] = function (e, i) {
          quit(e);
        }))
    : (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
      ((Module["read"] = function r(e) {
        var i = new XMLHttpRequest();
        console.error(i)
        return i.open("GET", e, !1), i.send(null), i.responseText;
      }),
      ENVIRONMENT_IS_WORKER &&
        (Module["readBinary"] = function _(e) {
          var i = new XMLHttpRequest();
          return (
            i.open("GET", e, !1),
            (i.responseType = "arraybuffer"),
            i.send(null),
            new Uint8Array(i.response)
          );
        }),
      (Module["readAsync"] = function o(e, i, n) {
        var t = new XMLHttpRequest();
        t.open("GET", e, !0),
          (t.responseType = "arraybuffer"),
          (t.onload = function r() {
            return 200 == t.status || (0 == t.status && t.response)
              ? (i(t.response), void 0)
              : (n(), void 0);
          }),
          (t.onerror = n),
          t.send(null);
      }),
      "undefined" != typeof arguments && (Module["arguments"] = arguments),
      (Module["setWindowTitle"] = function (e) {
        document.title = e;
      })),
    (Module["print"] =
      "undefined" != typeof console
        ? console.log
        : "undefined" != typeof print
        ? print
        : null),
    (Module["printErr"] =
      "undefined" != typeof printErr
        ? printErr
        : ("undefined" != typeof console && console.warn) || Module["print"]),
    (Module.print = Module["print"]),
    (Module.printErr = Module["printErr"]);
  for (key in moduleOverrides)
    moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
  (moduleOverrides = void 0),
    (STACK_ALIGN = 16),
    (functionPointers = new Array(0)),
    (funcWrappers = {}),
    (GLOBAL_BASE = 1024),
    (ABORT = 0),
    (EXITSTATUS = 0),
    (JSfuncs = {
      stackSave: function () {
        stackSave();
      },
      stackRestore: function () {
        stackRestore();
      },
      arrayToC: function (e) {
        var i = stackAlloc(e.length);
        return writeArrayToMemory(e, i), i;
      },
      stringToC: function (e) {
        var i,
          n = 0;
        return (
          null !== e &&
            void 0 !== e &&
            0 !== e &&
            ((i = (e.length << 2) + 1),
            (n = stackAlloc(i)),
            stringToUTF8(e, n, i)),
          n
        );
      },
    }),
    (toC = { string: JSfuncs["stringToC"], array: JSfuncs["arrayToC"] }),
    (ALLOC_NORMAL = 0),
    (ALLOC_STATIC = 2),
    (ALLOC_NONE = 4),
    (UTF8Decoder =
      "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0),
    (UTF16Decoder =
      "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0),
    (PAGE_SIZE = 16384),
    (WASM_PAGE_SIZE = 65536),
    (ASMJS_PAGE_SIZE = 16777216),
    (MIN_TOTAL_MEMORY = 16777216),
    (STATIC_BASE =
      STATICTOP =
      STACK_BASE =
      STACKTOP =
      STACK_MAX =
      DYNAMIC_BASE =
      DYNAMICTOP_PTR =
        0),
    (staticSealed = !1),
    Module["reallocBuffer"] ||
      (Module["reallocBuffer"] = function (e) {
        var i, n, t, r;
        try {
          ArrayBuffer.transfer
            ? (i = ArrayBuffer.transfer(buffer, e))
            : ((n = HEAP8),
              (i = new ArrayBuffer(e)),
              (t = new Int8Array(i)),
              t.set(n));
        } catch (_) {
          return !1;
        }
        return (r = _emscripten_replace_memory(i)), r ? i : !1;
      });
  try {
    (byteLength = Function.prototype.call.bind(
      Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get
    )),
      byteLength(new ArrayBuffer(4));
  } catch (e) {
    byteLength = function (e) {
      return e.byteLength;
    };
  }
  if (
    ((TOTAL_STACK = Module["TOTAL_STACK"] || 5242880),
    (TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 402653184),
    TOTAL_STACK > TOTAL_MEMORY &&
      Module.printErr(
        "TOTAL_MEMORY should be larger than TOTAL_STACK, was " +
          TOTAL_MEMORY +
          "! (TOTAL_STACK=" +
          TOTAL_STACK +
          ")"
      ),
    Module["buffer"]
      ? (buffer = Module["buffer"])
      : ("object" == typeof WebAssembly &&
        "function" == typeof WebAssembly.Memory
          ? ((Module["wasmMemory"] = new WebAssembly.Memory({
              initial: TOTAL_MEMORY / WASM_PAGE_SIZE,
            })),
            (buffer = Module["wasmMemory"].buffer))
          : (buffer = new ArrayBuffer(TOTAL_MEMORY)),
        (Module["buffer"] = buffer)),
    updateGlobalBufferViews(),
    (HEAP32[0] = 1668509029),
    (HEAP16[1] = 25459),
    115 !== HEAPU8[2] || 99 !== HEAPU8[3])
  )
    throw "Runtime error: expected the system to be little-endian!";
  if (
    ((__ATPRERUN__ = []),
    (__ATINIT__ = []),
    (__ATMAIN__ = []),
    (__ATEXIT__ = []),
    (__ATPOSTRUN__ = []),
    (runtimeInitialized = !1),
    (runtimeExited = !1),
    (Math_abs = Math.abs),
    (Math_cos = Math.cos),
    (Math_sin = Math.sin),
    (Math_tan = Math.tan),
    (Math_acos = Math.acos),
    (Math_asin = Math.asin),
    (Math_atan = Math.atan),
    (Math_atan2 = Math.atan2),
    (Math_exp = Math.exp),
    (Math_log = Math.log),
    (Math_sqrt = Math.sqrt),
    (Math_ceil = Math.ceil),
    (Math_floor = Math.floor),
    (Math_pow = Math.pow),
    (Math_imul = Math.imul),
    (Math_fround = Math.fround),
    (Math_round = Math.round),
    (Math_min = Math.min),
    (Math_max = Math.max),
    (Math_clz32 = Math.clz32),
    (Math_trunc = Math.trunc),
    (runDependencies = 0),
    (runDependencyWatcher = null),
    (dependenciesFulfilled = null),
    (Module["preloadedImages"] = {}),
    (Module["preloadedAudios"] = {}),
    (memoryInitializer = null),
    (dataURIPrefix = "data:application/octet-stream;base64,"),
    integrateWasmJS(),
    (ASM_CONSTS = [
      function (e, i) {
        Module.printErr(
          "bad name in getProcAddress: " +
            [Pointer_stringify(e), Pointer_stringify(i)]
        );
      },
    ]),
    (STATIC_BASE = GLOBAL_BASE),
    (STATICTOP = STATIC_BASE + 3250192),
    __ATINIT__.push(
      {
        func: function () {
          __GLOBAL__sub_I_AccessibilityScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_AIScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_AnimationScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Animation_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Animation_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Animation_4_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_AnimationClip_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Avatar_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_ConstraintManager_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_ARScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_AssetBundleScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_AssetBundle_Public_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_AudioScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Audio_Public_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Audio_Public_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Audio_Public_3_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Video_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_ClothScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Cloth_0_cpp();
        },
      },
      {
        func: function () {
          ___cxx_global_var_init_13();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_SwCollision_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_SwInterCollision_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_SwSelfCollision_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_SwSolverKernel_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_CloudWebServices_Public_Session_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_SpriteRendererJobs_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp();
        },
      },
      {
        func: function () {
          ___cxx_global_var_init_2_758();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Allocator_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Application_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_BaseClasses_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_BaseClasses_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_BaseClasses_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_BaseClasses_3_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Burst_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_3_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_5_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_6_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp();
        },
      },
      {
        func: function () {
          ___cxx_global_var_init_21();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Containers_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Director_Core_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Geometry_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_1_cpp();
        },
      },
      {
        func: function () {
          ___cxx_global_var_init_34();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_5_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_6_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_8_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_9_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_10_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_11_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_Mesh_3_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Input_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Interfaces_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Interfaces_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Interfaces_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Jobs_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Logging_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Math_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Math_Random_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Misc_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Misc_2_cpp();
        },
      },
      {
        func: function () {
          ___cxx_global_var_init_124();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Misc_4_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Misc_5_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_PreloadManager_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_SceneManager_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Shaders_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Shaders_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Transform_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Transform_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Utilities_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Utilities_4_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Utilities_5_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Utilities_6_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Utilities_8_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_AssetBundleFileSystem_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Modules_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Profiler_Public_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Profiler_Runtime_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_GfxDevice_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_GfxDevice_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_GfxDevice_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_GfxDevice_3_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_PluginInterface_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Scripting_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Scripting_3_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Shader_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Transform_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_SparseTextureGLES_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_TransformFeedbackSkinning_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_DirectorScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Grid_Public_0_cpp();
        },
      },
      {
        func: function () {
          ___cxx_global_var_init_2888();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_IMGUIScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_IMGUI_0_cpp();
        },
      },
      {
        func: function () {
          ___cxx_global_var_init_18();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_IMGUI_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_InputScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_ParticleSystem_Modules_3_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_ParticleSystemRenderer_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_ShapeModule_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Physics2DScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Physics2D_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_PhysicsScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Dynamics_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Dynamics_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_PxsFluidDynamics_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_CmEventProfiler_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_TerrainScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          ___cxx_global_var_init_110();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Terrain_Public_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Terrain_Public_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Terrain_Public_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Terrain_VR_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_TextRenderingScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_TilemapScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Tilemap_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_UIElementsScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_External_Yoga_Yoga_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_UIScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_UI_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_UI_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_UI_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_umbra_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_UnityAdsSettings_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_Vehicles_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_VideoScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_VR_2_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_VR_PluginInterface_0_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Wind_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_XRScriptingClasses_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Class_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_MetadataCache_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_threadpool_ms_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_File_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Reflection_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Thread_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_ArrayMetadata_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Assembly_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_threadpool_ms_io_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_RCW_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Image_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_GenericMetadata_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Socket_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_GCHandle_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_GarbageCollector_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_StackTrace_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_BoehmGC_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_AppDomain_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Console_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Thread_cpp_55403();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_LibraryLoader_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_ThreadImpl_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_GenericMethod_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_MemoryMapImpl_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_String_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Interlocked_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Assembly_cpp_56069();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_MemoryMappedFile_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Runtime_cpp_56678();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Environment_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_NativeDelegateMethodCache_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Error_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Path_cpp();
        },
      },
      {
        func: function () {
          __GLOBAL__sub_I_Il2CppCodeRegistration_cpp();
        },
      }
    ),
    (STATIC_BUMP = 3250192),
    (Module["STATIC_BASE"] = STATIC_BASE),
    (Module["STATIC_BUMP"] = STATIC_BUMP),
    (tempDoublePtr = STATICTOP),
    (STATICTOP += 16),
    (fs = {
      numPendingSync: 0,
      syncIntervalID: 0,
      syncInProgress: !1,
      sync: function (e) {
        if (e) {
          if (0 == fs.numPendingSync) return;
        } else if (fs.syncInProgress) return fs.numPendingSync++, void 0;
        (fs.syncInProgress = !0),
          FS.syncfs(!1, function (e) {
            fs.syncInProgress = !1;
          }),
          (fs.numPendingSync = 0);
      },
    }),
    (WEBAudio = { audioInstances: [], audioContext: {}, audioWebEnabled: 0 }),
    (wr = { requestInstances: {}, nextRequestId: 1 }),
    (ERRNO_CODES = {
      EPERM: 1,
      ENOENT: 2,
      ESRCH: 3,
      EINTR: 4,
      EIO: 5,
      ENXIO: 6,
      E2BIG: 7,
      ENOEXEC: 8,
      EBADF: 9,
      ECHILD: 10,
      EAGAIN: 11,
      EWOULDBLOCK: 11,
      ENOMEM: 12,
      EACCES: 13,
      EFAULT: 14,
      ENOTBLK: 15,
      EBUSY: 16,
      EEXIST: 17,
      EXDEV: 18,
      ENODEV: 19,
      ENOTDIR: 20,
      EISDIR: 21,
      EINVAL: 22,
      ENFILE: 23,
      EMFILE: 24,
      ENOTTY: 25,
      ETXTBSY: 26,
      EFBIG: 27,
      ENOSPC: 28,
      ESPIPE: 29,
      EROFS: 30,
      EMLINK: 31,
      EPIPE: 32,
      EDOM: 33,
      ERANGE: 34,
      ENOMSG: 42,
      EIDRM: 43,
      ECHRNG: 44,
      EL2NSYNC: 45,
      EL3HLT: 46,
      EL3RST: 47,
      ELNRNG: 48,
      EUNATCH: 49,
      ENOCSI: 50,
      EL2HLT: 51,
      EDEADLK: 35,
      ENOLCK: 37,
      EBADE: 52,
      EBADR: 53,
      EXFULL: 54,
      ENOANO: 55,
      EBADRQC: 56,
      EBADSLT: 57,
      EDEADLOCK: 35,
      EBFONT: 59,
      ENOSTR: 60,
      ENODATA: 61,
      ETIME: 62,
      ENOSR: 63,
      ENONET: 64,
      ENOPKG: 65,
      EREMOTE: 66,
      ENOLINK: 67,
      EADV: 68,
      ESRMNT: 69,
      ECOMM: 70,
      EPROTO: 71,
      EMULTIHOP: 72,
      EDOTDOT: 73,
      EBADMSG: 74,
      ENOTUNIQ: 76,
      EBADFD: 77,
      EREMCHG: 78,
      ELIBACC: 79,
      ELIBBAD: 80,
      ELIBSCN: 81,
      ELIBMAX: 82,
      ELIBEXEC: 83,
      ENOSYS: 38,
      ENOTEMPTY: 39,
      ENAMETOOLONG: 36,
      ELOOP: 40,
      EOPNOTSUPP: 95,
      EPFNOSUPPORT: 96,
      ECONNRESET: 104,
      ENOBUFS: 105,
      EAFNOSUPPORT: 97,
      EPROTOTYPE: 91,
      ENOTSOCK: 88,
      ENOPROTOOPT: 92,
      ESHUTDOWN: 108,
      ECONNREFUSED: 111,
      EADDRINUSE: 98,
      ECONNABORTED: 103,
      ENETUNREACH: 101,
      ENETDOWN: 100,
      ETIMEDOUT: 110,
      EHOSTDOWN: 112,
      EHOSTUNREACH: 113,
      EINPROGRESS: 115,
      EALREADY: 114,
      EDESTADDRREQ: 89,
      EMSGSIZE: 90,
      EPROTONOSUPPORT: 93,
      ESOCKTNOSUPPORT: 94,
      EADDRNOTAVAIL: 99,
      ENETRESET: 102,
      EISCONN: 106,
      ENOTCONN: 107,
      ETOOMANYREFS: 109,
      EUSERS: 87,
      EDQUOT: 122,
      ESTALE: 116,
      ENOTSUP: 95,
      ENOMEDIUM: 123,
      EILSEQ: 84,
      EOVERFLOW: 75,
      ECANCELED: 125,
      ENOTRECOVERABLE: 131,
      EOWNERDEAD: 130,
      ESTRPIPE: 86,
    }),
    (ERRNO_MESSAGES = {
      0: "Success",
      1: "Not super-user",
      2: "No such file or directory",
      3: "No such process",
      4: "Interrupted system call",
      5: "I/O error",
      6: "No such device or address",
      7: "Arg list too long",
      8: "Exec format error",
      9: "Bad file number",
      10: "No children",
      11: "No more processes",
      12: "Not enough core",
      13: "Permission denied",
      14: "Bad address",
      15: "Block device required",
      16: "Mount device busy",
      17: "File exists",
      18: "Cross-device link",
      19: "No such device",
      20: "Not a directory",
      21: "Is a directory",
      22: "Invalid argument",
      23: "Too many open files in system",
      24: "Too many open files",
      25: "Not a typewriter",
      26: "Text file busy",
      27: "File too large",
      28: "No space left on device",
      29: "Illegal seek",
      30: "Read only file system",
      31: "Too many links",
      32: "Broken pipe",
      33: "Math arg out of domain of func",
      34: "Math result not representable",
      35: "File locking deadlock error",
      36: "File or path name too long",
      37: "No record locks available",
      38: "Function not implemented",
      39: "Directory not empty",
      40: "Too many symbolic links",
      42: "No message of desired type",
      43: "Identifier removed",
      44: "Channel number out of range",
      45: "Level 2 not synchronized",
      46: "Level 3 halted",
      47: "Level 3 reset",
      48: "Link number out of range",
      49: "Protocol driver not attached",
      50: "No CSI structure available",
      51: "Level 2 halted",
      52: "Invalid exchange",
      53: "Invalid request descriptor",
      54: "Exchange full",
      55: "No anode",
      56: "Invalid request code",
      57: "Invalid slot",
      59: "Bad font file fmt",
      60: "Device not a stream",
      61: "No data (for no delay io)",
      62: "Timer expired",
      63: "Out of streams resources",
      64: "Machine is not on the network",
      65: "Package not installed",
      66: "The object is remote",
      67: "The link has been severed",
      68: "Advertise error",
      69: "Srmount error",
      70: "Communication error on send",
      71: "Protocol error",
      72: "Multihop attempted",
      73: "Cross mount point (not really error)",
      74: "Trying to read unreadable message",
      75: "Value too large for defined data type",
      76: "Given log. name not unique",
      77: "f.d. invalid for this operation",
      78: "Remote address changed",
      79: "Can   access a needed shared lib",
      80: "Accessing a corrupted shared lib",
      81: ".lib section in a.out corrupted",
      82: "Attempting to link in too many libs",
      83: "Attempting to exec a shared library",
      84: "Illegal byte sequence",
      86: "Streams pipe error",
      87: "Too many users",
      88: "Socket operation on non-socket",
      89: "Destination address required",
      90: "Message too long",
      91: "Protocol wrong type for socket",
      92: "Protocol not available",
      93: "Unknown protocol",
      94: "Socket type not supported",
      95: "Not supported",
      96: "Protocol family not supported",
      97: "Address family not supported by protocol family",
      98: "Address already in use",
      99: "Address not available",
      100: "Network interface is not configured",
      101: "Network is unreachable",
      102: "Connection reset by network",
      103: "Connection aborted",
      104: "Connection reset by peer",
      105: "No buffer space available",
      106: "Socket is already connected",
      107: "Socket is not connected",
      108: "Can't send after socket shutdown",
      109: "Too many references",
      110: "Connection timed out",
      111: "Connection refused",
      112: "Host is down",
      113: "Host is unreachable",
      114: "Socket already connected",
      115: "Connection already in progress",
      116: "Stale file handle",
      122: "Quota exceeded",
      123: "No medium (in tape drive)",
      125: "Operation canceled",
      130: "Previous owner died",
      131: "State not recoverable",
    }),
    (PATH = {
      splitPath: function (e) {
        var i = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return i.exec(e).slice(1);
      },
      normalizeArray: function (e, i) {
        var n,
          t,
          r = 0;
        for (n = e.length - 1; n >= 0; n--)
          (t = e[n]),
            "." === t
              ? e.splice(n, 1)
              : ".." === t
              ? (e.splice(n, 1), r++)
              : r && (e.splice(n, 1), r--);
        if (i) for (; r; r--) e.unshift("..");
        return e;
      },
      normalize: function (e) {
        var i = "/" === e.charAt(0),
          n = "/" === e.substr(-1);
        return (
          (e = PATH.normalizeArray(
            e.split("/").filter(function (e) {
              return !!e;
            }),
            !i
          ).join("/")),
          e || i || (e = "."),
          e && n && (e += "/"),
          (i ? "/" : "") + e
        );
      },
      dirname: function (e) {
        var i = PATH.splitPath(e),
          n = i[0],
          t = i[1];
        return n || t ? (t && (t = t.substr(0, t.length - 1)), n + t) : ".";
      },
      basename: function (e) {
        if ("/" === e) return "/";
        var i = e.lastIndexOf("/");
        return i === -1 ? e : e.substr(i + 1);
      },
      extname: function (e) {
        return PATH.splitPath(e)[3];
      },
      join: function () {
        var e = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(e.join("/"));
      },
      join2: function (e, i) {
        return PATH.normalize(e + "/" + i);
      },
      resolve: function () {
        var e,
          i,
          n = "",
          t = !1;
        for (e = arguments.length - 1; e >= -1 && !t; e--) {
          if (((i = e >= 0 ? arguments[e] : FS.cwd()), "string" != typeof i))
            throw new TypeError("Arguments to path.resolve must be strings");
          if (!i) return "";
          (n = i + "/" + n), (t = "/" === i.charAt(0));
        }
        return (
          (n = PATH.normalizeArray(
            n.split("/").filter(function (e) {
              return !!e;
            }),
            !t
          ).join("/")),
          (t ? "/" : "") + n || "."
        );
      },
      relative: function (e, i) {
        function n(e) {
          for (var i, n = 0; n < e.length; n++) if ("" !== e[n]) break;
          for (i = e.length - 1; i >= 0; i--) if ("" !== e[i]) break;
          return n > i ? [] : e.slice(n, i - n + 1);
        }
        var t, r, _, o, l, u;
        for (
          e = PATH.resolve(e).substr(1),
            i = PATH.resolve(i).substr(1),
            t = n(e.split("/")),
            r = n(i.split("/")),
            _ = Math.min(t.length, r.length),
            o = _,
            l = 0;
          _ > l;
          l++
        )
          if (t[l] !== r[l]) {
            o = l;
            break;
          }
        for (u = [], l = o; l < t.length; l++) u.push("..");
        return (u = u.concat(r.slice(o))), u.join("/");
      },
    }),
    (TTY = {
      ttys: [],
      init: function () {},
      shutdown: function () {},
      register: function (e, i) {
        (TTY.ttys[e] = { input: [], output: [], ops: i }),
          FS.registerDevice(e, TTY.stream_ops);
      },
      stream_ops: {
        open: function (e) {
          var i = TTY.ttys[e.node.rdev];
          if (!i) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          (e.tty = i), (e.seekable = !1);
        },
        close: function (e) {
          e.tty.ops.flush(e.tty);
        },
        flush: function (e) {
          e.tty.ops.flush(e.tty);
        },
        read: function (e, i, n, t, r) {
          var _, o, l;
          if (!e.tty || !e.tty.ops.get_char)
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          for (_ = 0, o = 0; t > o; o++) {
            try {
              l = e.tty.ops.get_char(e.tty);
            } catch (u) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (void 0 === l && 0 === _)
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            if (null === l || void 0 === l) break;
            _++, (i[n + o] = l);
          }
          return _ && (e.node.timestamp = Date.now()), _;
        },
        write: function (e, i, n, t, r) {
          if (!e.tty || !e.tty.ops.put_char)
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          for (var _ = 0; t > _; _++)
            try {
              e.tty.ops.put_char(e.tty, i[n + _]);
            } catch (o) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          return t && (e.node.timestamp = Date.now()), _;
        },
      },
      default_tty_ops: {
        get_char: function (e) {
          var i, n, t, r, _, o, l;
          if (!e.input.length) {
            if (((i = null), ENVIRONMENT_IS_NODE)) {
              if (
                ((n = 256),
                (t = new Buffer(n)),
                (r = 0),
                (_ = "win32" != process.platform),
                (o = process.stdin.fd),
                _)
              ) {
                l = !1;
                try {
                  (o = fs.openSync("/dev/stdin", "r")), (l = !0);
                } catch (u) {}
              }
              try {
                r = fs.readSync(o, t, 0, n, null);
              } catch (u) {
                if (u.toString().indexOf("EOF") == -1) throw u;
                r = 0;
              }
              l && fs.closeSync(o),
                (i = r > 0 ? t.slice(0, r).toString("utf-8") : null);
            } else
              "undefined" != typeof window && "function" == typeof window.prompt
                ? ((i = window.prompt("Input: ")), null !== i && (i += "\n"))
                : "function" == typeof readline &&
                  ((i = readline()), null !== i && (i += "\n"));
            if (!i) return null;
            e.input = intArrayFromString(i, !0);
          }
          return e.input.shift();
        },
        put_char: function (e, i) {
          null === i || 10 === i
            ? (Module["print"](UTF8ArrayToString(e.output, 0)), (e.output = []))
            : 0 != i && e.output.push(i);
        },
        flush: function (e) {
          e.output &&
            e.output.length > 0 &&
            (Module["print"](UTF8ArrayToString(e.output, 0)), (e.output = []));
        },
      },
      default_tty1_ops: {
        put_char: function (e, i) {
          null === i || 10 === i
            ? (Module["printErr"](UTF8ArrayToString(e.output, 0)),
              (e.output = []))
            : 0 != i && e.output.push(i);
        },
        flush: function (e) {
          e.output &&
            e.output.length > 0 &&
            (Module["printErr"](UTF8ArrayToString(e.output, 0)),
            (e.output = []));
        },
      },
    }),
    (MEMFS = {
      ops_table: null,
      mount: function (e) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0);
      },
      createNode: function (e, i, n, t) {
        if (FS.isBlkdev(n) || FS.isFIFO(n))
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        MEMFS.ops_table ||
          (MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink,
              },
              stream: { llseek: MEMFS.stream_ops.llseek },
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync,
              },
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink,
              },
              stream: {},
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
              },
              stream: FS.chrdev_stream_ops,
            },
          });
        var r = FS.createNode(e, i, n, t);
        return (
          FS.isDir(r.mode)
            ? ((r.node_ops = MEMFS.ops_table.dir.node),
              (r.stream_ops = MEMFS.ops_table.dir.stream),
              (r.contents = {}))
            : FS.isFile(r.mode)
            ? ((r.node_ops = MEMFS.ops_table.file.node),
              (r.stream_ops = MEMFS.ops_table.file.stream),
              (r.usedBytes = 0),
              (r.contents = null))
            : FS.isLink(r.mode)
            ? ((r.node_ops = MEMFS.ops_table.link.node),
              (r.stream_ops = MEMFS.ops_table.link.stream))
            : FS.isChrdev(r.mode) &&
              ((r.node_ops = MEMFS.ops_table.chrdev.node),
              (r.stream_ops = MEMFS.ops_table.chrdev.stream)),
          (r.timestamp = Date.now()),
          e && (e.contents[i] = r),
          r
        );
      },
      getFileDataAsRegularArray: function (e) {
        var i, n;
        if (e.contents && e.contents.subarray) {
          for (i = [], n = 0; n < e.usedBytes; ++n) i.push(e.contents[n]);
          return i;
        }
        return e.contents;
      },
      getFileDataAsTypedArray: function (e) {
        return e.contents
          ? e.contents.subarray
            ? e.contents.subarray(0, e.usedBytes)
            : new Uint8Array(e.contents)
          : new Uint8Array();
      },
      expandFileStorage: function (e, i) {
        var n, t, r;
        if (
          (e.contents &&
            e.contents.subarray &&
            i > e.contents.length &&
            ((e.contents = MEMFS.getFileDataAsRegularArray(e)),
            (e.usedBytes = e.contents.length)),
          !e.contents || e.contents.subarray)
        ) {
          if (((n = e.contents ? e.contents.length : 0), n >= i)) return;
          return (
            (t = 1024 * 1024),
            (i = Math.max(i, (n * (t > n ? 2 : 1.125)) | 0)),
            0 != n && (i = Math.max(i, 256)),
            (r = e.contents),
            (e.contents = new Uint8Array(i)),
            e.usedBytes > 0 && e.contents.set(r.subarray(0, e.usedBytes), 0),
            void 0
          );
        }
        !e.contents && i > 0 && (e.contents = []);
        while (e.contents.length < i) e.contents.push(0);
      },
      resizeFileStorage: function (e, i) {
        if (e.usedBytes != i) {
          if (0 == i) return (e.contents = null), (e.usedBytes = 0), void 0;
          if (!e.contents || e.contents.subarray) {
            var n = e.contents;
            return (
              (e.contents = new Uint8Array(new ArrayBuffer(i))),
              n && e.contents.set(n.subarray(0, Math.min(i, e.usedBytes))),
              (e.usedBytes = i),
              void 0
            );
          }
          if ((e.contents || (e.contents = []), e.contents.length > i))
            e.contents.length = i;
          else while (e.contents.length < i) e.contents.push(0);
          e.usedBytes = i;
        }
      },
      node_ops: {
        getattr: function (e) {
          var i = {};
          return (
            (i.dev = FS.isChrdev(e.mode) ? e.id : 1),
            (i.ino = e.id),
            (i.mode = e.mode),
            (i.nlink = 1),
            (i.uid = 0),
            (i.gid = 0),
            (i.rdev = e.rdev),
            FS.isDir(e.mode)
              ? (i.size = 4096)
              : FS.isFile(e.mode)
              ? (i.size = e.usedBytes)
              : FS.isLink(e.mode)
              ? (i.size = e.link.length)
              : (i.size = 0),
            (i.atime = new Date(e.timestamp)),
            (i.mtime = new Date(e.timestamp)),
            (i.ctime = new Date(e.timestamp)),
            (i.blksize = 4096),
            (i.blocks = Math.ceil(i.size / i.blksize)),
            i
          );
        },
        setattr: function (e, i) {
          void 0 !== i.mode && (e.mode = i.mode),
            void 0 !== i.timestamp && (e.timestamp = i.timestamp),
            void 0 !== i.size && MEMFS.resizeFileStorage(e, i.size);
        },
        lookup: function (e, i) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },
        mknod: function (e, i, n, t) {
          return MEMFS.createNode(e, i, n, t);
        },
        rename: function (e, i, n) {
          var t, r;
          if (FS.isDir(e.mode)) {
            try {
              t = FS.lookupNode(i, n);
            } catch (_) {}
            if (t)
              for (r in t.contents)
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete e.parent.contents[e.name],
            (e.name = n),
            (i.contents[n] = e),
            (e.parent = i);
        },
        unlink: function (e, i) {
          delete e.contents[i];
        },
        rmdir: function (e, i) {
          var n,
            t = FS.lookupNode(e, i);
          for (n in t.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          delete e.contents[i];
        },
        readdir: function (e) {
          var i,
            n = [".", ".."];
          for (i in e.contents) e.contents.hasOwnProperty(i) && n.push(i);
          return n;
        },
        symlink: function (e, i, n) {
          var t = MEMFS.createNode(e, i, 511 | 40960, 0);
          return (t.link = n), t;
        },
        readlink: function (e) {
          if (!FS.isLink(e.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          return e.link;
        },
      },
      stream_ops: {
        read: function (e, i, n, t, r) {
          var _,
            o,
            l = e.node.contents;
          if (r >= e.node.usedBytes) return 0;
          if (
            ((_ = Math.min(e.node.usedBytes - r, t)),
            assert(_ >= 0),
            _ > 8 && l.subarray)
          )
            i.set(l.subarray(r, r + _), n);
          else for (o = 0; _ > o; o++) i[n + o] = l[r + o];
          return _;
        },
        write: function (e, i, n, t, r, _) {
          var o, l;
          if (!t) return 0;
          if (
            ((o = e.node),
            (o.timestamp = Date.now()),
            i.subarray && (!o.contents || o.contents.subarray))
          ) {
            if (_)
              return (o.contents = i.subarray(n, n + t)), (o.usedBytes = t), t;
            if (0 === o.usedBytes && 0 === r)
              return (
                (o.contents = new Uint8Array(i.subarray(n, n + t))),
                (o.usedBytes = t),
                t
              );
            if (r + t <= o.usedBytes)
              return o.contents.set(i.subarray(n, n + t), r), t;
          }
          if (
            (MEMFS.expandFileStorage(o, r + t),
            o.contents.subarray && i.subarray)
          )
            o.contents.set(i.subarray(n, n + t), r);
          else for (l = 0; t > l; l++) o.contents[r + l] = i[n + l];
          return (o.usedBytes = Math.max(o.usedBytes, r + t)), t;
        },
        llseek: function (e, i, n) {
          var t = i;
          if (
            (1 === n
              ? (t += e.position)
              : 2 === n && FS.isFile(e.node.mode) && (t += e.node.usedBytes),
            0 > t)
          )
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          return t;
        },
        allocate: function (e, i, n) {
          MEMFS.expandFileStorage(e.node, i + n),
            (e.node.usedBytes = Math.max(e.node.usedBytes, i + n));
        },
        mmap: function (e, i, n, t, r, _, o) {
          var l, u, a;
          if (!FS.isFile(e.node.mode))
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          if (
            ((a = e.node.contents),
            2 & o || (a.buffer !== i && a.buffer !== i.buffer))
          ) {
            if (
              ((r > 0 || r + t < e.node.usedBytes) &&
                (a = a.subarray
                  ? a.subarray(r, r + t)
                  : Array.prototype.slice.call(a, r, r + t)),
              (u = !0),
              (l = _malloc(t)),
              !l)
            )
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            i.set(a, l);
          } else (u = !1), (l = a.byteOffset);
          return { ptr: l, allocated: u };
        },
        msync: function (e, i, n, t, r) {
          if (!FS.isFile(e.node.mode))
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          if (2 & r) return 0;
          var _ = MEMFS.stream_ops.write(e, i, 0, t, n, !1);
          return 0;
        },
      },
    }),
    (IDBFS = {
      dbs: {},
      indexedDB: function () {
        if ("undefined" != typeof indexedDB) return indexedDB;
        var e = null;
        return (
          "object" == typeof window &&
            (e =
              window.indexedDB ||
              window.mozIndexedDB ||
              window.webkitIndexedDB ||
              window.msIndexedDB),
          assert(e, "IDBFS used, but indexedDB not supported"),
          e
        );
      },
      DB_VERSION: 21,
      DB_STORE_NAME: "FILE_DATA",
      mount: function (e) {
        return MEMFS.mount.apply(null, arguments);
      },
      syncfs: function (e, i, n) {
        IDBFS.getLocalSet(e, function (t, r) {
          return t
            ? n(t)
            : (IDBFS.getRemoteSet(e, function (e, t) {
                var _, o;
                return e
                  ? n(e)
                  : ((_ = i ? t : r),
                    (o = i ? r : t),
                    IDBFS.reconcile(_, o, n),
                    void 0);
              }),
              void 0);
        });
      },
      getDB: function (e, i) {
        var n,
          t = IDBFS.dbs[e];
        if (t) return i(null, t);
        try {
          n = IDBFS.indexedDB().open(e, IDBFS.DB_VERSION);
        } catch (r) {
          return i(r);
        }
        return n
          ? ((n.onupgradeneeded = function (e) {
              var i,
                n = e.target.result,
                t = e.target.transaction;
              (i = n.objectStoreNames.contains(IDBFS.DB_STORE_NAME)
                ? t.objectStore(IDBFS.DB_STORE_NAME)
                : n.createObjectStore(IDBFS.DB_STORE_NAME)),
                i.indexNames.contains("timestamp") ||
                  i.createIndex("timestamp", "timestamp", { unique: !1 });
            }),
            (n.onsuccess = function () {
              (t = n.result), (IDBFS.dbs[e] = t), i(null, t);
            }),
            (n.onerror = function (e) {
              i(this.error), e.preventDefault();
            }),
            void 0)
          : i("Unable to connect to IndexedDB");
      },
      getLocalSet: function (e, i) {
        function n(e) {
          return "." !== e && ".." !== e;
        }
        function t(e) {
          return function (i) {
            return PATH.join2(e, i);
          };
        }
        var r,
          _,
          o = {},
          l = FS.readdir(e.mountpoint).filter(n).map(t(e.mountpoint));
        while (l.length) {
          r = l.pop();
          try {
            _ = FS.stat(r);
          } catch (u) {
            return i(u);
          }
          FS.isDir(_.mode) &&
            l.push.apply(l, FS.readdir(r).filter(n).map(t(r))),
            (o[r] = { timestamp: _.mtime });
        }
        return i(null, { type: "local", entries: o });
      },
      getRemoteSet: function (e, i) {
        var n = {};
        IDBFS.getDB(e.mountpoint, function (e, t) {
          var r, _, o;
          if (e) return i(e);
          try {
            (r = t.transaction([IDBFS.DB_STORE_NAME], "readonly")),
              (r.onerror = function (e) {
                i(this.error), e.preventDefault();
              }),
              (_ = r.objectStore(IDBFS.DB_STORE_NAME)),
              (o = _.index("timestamp")),
              (o.openKeyCursor().onsuccess = function (e) {
                var r = e.target.result;
                return r
                  ? ((n[r.primaryKey] = { timestamp: r.key }),
                    r["continue"](),
                    void 0)
                  : i(null, { type: "remote", db: t, entries: n });
              });
          } catch (l) {
            return i(l);
          }
        });
      },
      loadLocalEntry: function (e, i) {
        var n, t, r;
        try {
          (r = FS.lookupPath(e)), (t = r.node), (n = FS.stat(e));
        } catch (_) {
          return i(_);
        }
        return FS.isDir(n.mode)
          ? i(null, { timestamp: n.mtime, mode: n.mode })
          : FS.isFile(n.mode)
          ? ((t.contents = MEMFS.getFileDataAsTypedArray(t)),
            i(null, { timestamp: n.mtime, mode: n.mode, contents: t.contents }))
          : i(new Error("node type not supported"));
      },
      storeLocalEntry: function (e, i, n) {
        try {
          if (FS.isDir(i.mode)) FS.mkdir(e, i.mode);
          else {
            if (!FS.isFile(i.mode))
              return n(new Error("node type not supported"));
            FS.writeFile(e, i.contents, { canOwn: !0 });
          }
          FS.chmod(e, i.mode), FS.utime(e, i.timestamp, i.timestamp);
        } catch (t) {
          return n(t);
        }
        n(null);
      },
      removeLocalEntry: function (e, i) {
        var n, t;
        try {
          (n = FS.lookupPath(e)),
            (t = FS.stat(e)),
            FS.isDir(t.mode) ? FS.rmdir(e) : FS.isFile(t.mode) && FS.unlink(e);
        } catch (r) {
          return i(r);
        }
        i(null);
      },
      loadRemoteEntry: function (e, i, n) {
        var t = e.get(i);
        (t.onsuccess = function (e) {
          n(null, e.target.result);
        }),
          (t.onerror = function (e) {
            n(this.error), e.preventDefault();
          });
      },
      storeRemoteEntry: function (e, i, n, t) {
        var r = e.put(n, i);
        (r.onsuccess = function () {
          t(null);
        }),
          (r.onerror = function (e) {
            t(this.error), e.preventDefault();
          });
      },
      removeRemoteEntry: function (e, i, n) {
        var t = e["delete"](i);
        (t.onsuccess = function () {
          n(null);
        }),
          (t.onerror = function (e) {
            n(this.error), e.preventDefault();
          });
      },
      reconcile: function (e, i, n) {
        function t(e) {
          return e
            ? t.errored
              ? void 0
              : ((t.errored = !0), n(e))
            : ++_ >= a
            ? n(null)
            : void 0;
        }
        var r,
          _,
          o,
          l,
          u,
          a = 0,
          s = [];
        return (
          Object.keys(e.entries).forEach(function (n) {
            var t = e.entries[n],
              r = i.entries[n];
            (!r || t.timestamp > r.timestamp) && (s.push(n), a++);
          }),
          (r = []),
          Object.keys(i.entries).forEach(function (n) {
            var t = i.entries[n],
              _ = e.entries[n];
            _ || (r.push(n), a++);
          }),
          a
            ? ((_ = 0),
              (o = "remote" === e.type ? e.db : i.db),
              (l = o.transaction([IDBFS.DB_STORE_NAME], "readwrite")),
              (u = l.objectStore(IDBFS.DB_STORE_NAME)),
              (l.onerror = function (e) {
                t(this.error), e.preventDefault();
              }),
              s.sort().forEach(function (e) {
                "local" === i.type
                  ? IDBFS.loadRemoteEntry(u, e, function (i, n) {
                      return i
                        ? t(i)
                        : (IDBFS.storeLocalEntry(e, n, t), void 0);
                    })
                  : IDBFS.loadLocalEntry(e, function (i, n) {
                      return i
                        ? t(i)
                        : (IDBFS.storeRemoteEntry(u, e, n, t), void 0);
                    });
              }),
              r
                .sort()
                .reverse()
                .forEach(function (e) {
                  "local" === i.type
                    ? IDBFS.removeLocalEntry(e, t)
                    : IDBFS.removeRemoteEntry(u, e, t);
                }),
              void 0)
            : n(null)
        );
      },
    }),
    (NODEFS = {
      isWindows: !1,
      staticInit: function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
        var e = process["binding"]("constants");
        e["fs"] && (e = e["fs"]),
          (NODEFS.flagsForNodeMap = {
            1024: e["O_APPEND"],
            64: e["O_CREAT"],
            128: e["O_EXCL"],
            0: e["O_RDONLY"],
            2: e["O_RDWR"],
            4096: e["O_SYNC"],
            512: e["O_TRUNC"],
            1: e["O_WRONLY"],
          });
      },
      bufferFrom: function (e) {
        return Buffer.alloc ? Buffer.from(e) : new Buffer(e);
      },
      mount: function (e) {
        return (
          assert(ENVIRONMENT_IS_NODE),
          NODEFS.createNode(null, "/", NODEFS.getMode(e.opts.root), 0)
        );
      },
      createNode: function (e, i, n, t) {
        if (!FS.isDir(n) && !FS.isFile(n) && !FS.isLink(n))
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        var r = FS.createNode(e, i, n);
        return (
          (r.node_ops = NODEFS.node_ops), (r.stream_ops = NODEFS.stream_ops), r
        );
      },
      getMode: function (e) {
        var i;
        try {
          (i = fs.lstatSync(e)),
            NODEFS.isWindows && (i.mode = i.mode | ((292 & i.mode) >> 2));
        } catch (n) {
          if (!n.code) throw n;
          throw new FS.ErrnoError(ERRNO_CODES[n.code]);
        }
        return i.mode;
      },
      realPath: function (e) {
        var i = [];
        while (e.parent !== e) i.push(e.name), (e = e.parent);
        return i.push(e.mount.opts.root), i.reverse(), PATH.join.apply(null, i);
      },
      flagsForNode: function (e) {
        var i, n;
        (e &= ~2097152), (e &= ~2048), (e &= ~32768), (e &= ~524288), (i = 0);
        for (n in NODEFS.flagsForNodeMap)
          e & n && ((i |= NODEFS.flagsForNodeMap[n]), (e ^= n));
        if (e) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        return i;
      },
      node_ops: {
        getattr: function (e) {
          var i,
            n = NODEFS.realPath(e);
          try {
            i = fs.lstatSync(n);
          } catch (t) {
            if (!t.code) throw t;
            throw new FS.ErrnoError(ERRNO_CODES[t.code]);
          }
          return (
            NODEFS.isWindows && !i.blksize && (i.blksize = 4096),
            NODEFS.isWindows &&
              !i.blocks &&
              (i.blocks = ((i.size + i.blksize - 1) / i.blksize) | 0),
            {
              dev: i.dev,
              ino: i.ino,
              mode: i.mode,
              nlink: i.nlink,
              uid: i.uid,
              gid: i.gid,
              rdev: i.rdev,
              size: i.size,
              atime: i.atime,
              mtime: i.mtime,
              ctime: i.ctime,
              blksize: i.blksize,
              blocks: i.blocks,
            }
          );
        },
        setattr: function (e, i) {
          var n,
            t = NODEFS.realPath(e);
          try {
            void 0 !== i.mode && (fs.chmodSync(t, i.mode), (e.mode = i.mode)),
              void 0 !== i.timestamp &&
                ((n = new Date(i.timestamp)), fs.utimesSync(t, n, n)),
              void 0 !== i.size && fs.truncateSync(t, i.size);
          } catch (r) {
            if (!r.code) throw r;
            throw new FS.ErrnoError(ERRNO_CODES[r.code]);
          }
        },
        lookup: function (e, i) {
          var n = PATH.join2(NODEFS.realPath(e), i),
            t = NODEFS.getMode(n);
          return NODEFS.createNode(e, i, t);
        },
        mknod: function (e, i, n, t) {
          var r = NODEFS.createNode(e, i, n, t),
            _ = NODEFS.realPath(r);
          try {
            FS.isDir(r.mode)
              ? fs.mkdirSync(_, r.mode)
              : fs.writeFileSync(_, "", { mode: r.mode });
          } catch (o) {
            if (!o.code) throw o;
            throw new FS.ErrnoError(ERRNO_CODES[o.code]);
          }
          return r;
        },
        rename: function (e, i, n) {
          var t = NODEFS.realPath(e),
            r = PATH.join2(NODEFS.realPath(i), n);
          try {
            fs.renameSync(t, r);
          } catch (_) {
            if (!_.code) throw _;
            throw new FS.ErrnoError(ERRNO_CODES[_.code]);
          }
        },
        unlink: function (e, i) {
          var n = PATH.join2(NODEFS.realPath(e), i);
          try {
            fs.unlinkSync(n);
          } catch (t) {
            if (!t.code) throw t;
            throw new FS.ErrnoError(ERRNO_CODES[t.code]);
          }
        },
        rmdir: function (e, i) {
          var n = PATH.join2(NODEFS.realPath(e), i);
          try {
            fs.rmdirSync(n);
          } catch (t) {
            if (!t.code) throw t;
            throw new FS.ErrnoError(ERRNO_CODES[t.code]);
          }
        },
        readdir: function (e) {
          var i = NODEFS.realPath(e);
          try {
            return fs.readdirSync(i);
          } catch (n) {
            if (!n.code) throw n;
            throw new FS.ErrnoError(ERRNO_CODES[n.code]);
          }
        },
        symlink: function (e, i, n) {
          var t = PATH.join2(NODEFS.realPath(e), i);
          try {
            fs.symlinkSync(n, t);
          } catch (r) {
            if (!r.code) throw r;
            throw new FS.ErrnoError(ERRNO_CODES[r.code]);
          }
        },
        readlink: function (e) {
          var i = NODEFS.realPath(e);
          try {
            return (
              (i = fs.readlinkSync(i)),
              (i = NODEJS_PATH.relative(
                NODEJS_PATH.resolve(e.mount.opts.root),
                i
              )),
              i
            );
          } catch (n) {
            if (!n.code) throw n;
            throw new FS.ErrnoError(ERRNO_CODES[n.code]);
          }
        },
      },
      stream_ops: {
        open: function (e) {
          var i = NODEFS.realPath(e.node);
          try {
            FS.isFile(e.node.mode) &&
              (e.nfd = fs.openSync(i, NODEFS.flagsForNode(e.flags)));
          } catch (n) {
            if (!n.code) throw n;
            throw new FS.ErrnoError(ERRNO_CODES[n.code]);
          }
        },
        close: function (e) {
          try {
            FS.isFile(e.node.mode) && e.nfd && fs.closeSync(e.nfd);
          } catch (i) {
            if (!i.code) throw i;
            throw new FS.ErrnoError(ERRNO_CODES[i.code]);
          }
        },
        read: function (e, i, n, t, r) {
          if (0 === t) return 0;
          try {
            return fs.readSync(e.nfd, NODEFS.bufferFrom(i.buffer), n, t, r);
          } catch (_) {
            throw new FS.ErrnoError(ERRNO_CODES[_.code]);
          }
        },
        write: function (e, i, n, t, r) {
          try {
            return fs.writeSync(e.nfd, NODEFS.bufferFrom(i.buffer), n, t, r);
          } catch (_) {
            throw new FS.ErrnoError(ERRNO_CODES[_.code]);
          }
        },
        llseek: function (e, i, n) {
          var t,
            r = i;
          if (1 === n) r += e.position;
          else if (2 === n && FS.isFile(e.node.mode))
            try {
              (t = fs.fstatSync(e.nfd)), (r += t.size);
            } catch (_) {
              throw new FS.ErrnoError(ERRNO_CODES[_.code]);
            }
          if (0 > r) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          return r;
        },
      },
    }),
    (WORKERFS = {
      DIR_MODE: 16895,
      FILE_MODE: 33279,
      reader: null,
      mount: function (e) {
        function i(e) {
          var i,
            n,
            _ = e.split("/"),
            o = t;
          for (i = 0; i < _.length - 1; i++)
            (n = _.slice(0, i + 1).join("/")),
              r[n] ||
                (r[n] = WORKERFS.createNode(o, _[i], WORKERFS.DIR_MODE, 0)),
              (o = r[n]);
          return o;
        }
        function n(e) {
          var i = e.split("/");
          return i[i.length - 1];
        }
        var t, r;
        return (
          assert(ENVIRONMENT_IS_WORKER),
          WORKERFS.reader || (WORKERFS.reader = new FileReaderSync()),
          (t = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0)),
          (r = {}),
          Array.prototype.forEach.call(e.opts["files"] || [], function (e) {
            WORKERFS.createNode(
              i(e.name),
              n(e.name),
              WORKERFS.FILE_MODE,
              0,
              e,
              e.lastModifiedDate
            );
          }),
          (e.opts["blobs"] || []).forEach(function (e) {
            WORKERFS.createNode(
              i(e["name"]),
              n(e["name"]),
              WORKERFS.FILE_MODE,
              0,
              e["data"]
            );
          }),
          (e.opts["packages"] || []).forEach(function (e) {
            e["metadata"].files.forEach(function (t) {
              var r = t.filename.substr(1);
              WORKERFS.createNode(
                i(r),
                n(r),
                WORKERFS.FILE_MODE,
                0,
                e["blob"].slice(t.start, t.end)
              );
            });
          }),
          t
        );
      },
      createNode: function (e, i, n, t, r, _) {
        var o = FS.createNode(e, i, n);
        return (
          (o.mode = n),
          (o.node_ops = WORKERFS.node_ops),
          (o.stream_ops = WORKERFS.stream_ops),
          (o.timestamp = (_ || new Date()).getTime()),
          assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE),
          n === WORKERFS.FILE_MODE
            ? ((o.size = r.size), (o.contents = r))
            : ((o.size = 4096), (o.contents = {})),
          e && (e.contents[i] = o),
          o
        );
      },
      node_ops: {
        getattr: function (e) {
          return {
            dev: 1,
            ino: void 0,
            mode: e.mode,
            nlink: 1,
            uid: 0,
            gid: 0,
            rdev: void 0,
            size: e.size,
            atime: new Date(e.timestamp),
            mtime: new Date(e.timestamp),
            ctime: new Date(e.timestamp),
            blksize: 4096,
            blocks: Math.ceil(e.size / 4096),
          };
        },
        setattr: function (e, i) {
          void 0 !== i.mode && (e.mode = i.mode),
            void 0 !== i.timestamp && (e.timestamp = i.timestamp);
        },
        lookup: function (e, i) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        },
        mknod: function (e, i, n, t) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },
        rename: function (e, i, n) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },
        unlink: function (e, i) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },
        rmdir: function (e, i) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },
        readdir: function (e) {
          var i,
            n = [".", ".."];
          for (i in e.contents) e.contents.hasOwnProperty(i) && n.push(i);
          return n;
        },
        symlink: function (e, i, n) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },
        readlink: function (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },
      },
      stream_ops: {
        read: function (e, i, n, t, r) {
          var _, o;
          return r >= e.node.size
            ? 0
            : ((_ = e.node.contents.slice(r, r + t)),
              (o = WORKERFS.reader.readAsArrayBuffer(_)),
              i.set(new Uint8Array(o), n),
              _.size);
        },
        write: function (e, i, n, t, r) {
          throw new FS.ErrnoError(ERRNO_CODES.EIO);
        },
        llseek: function (e, i, n) {
          var t = i;
          if (
            (1 === n
              ? (t += e.position)
              : 2 === n && FS.isFile(e.node.mode) && (t += e.node.size),
            0 > t)
          )
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          return t;
        },
      },
    }),
    (STATICTOP += 16),
    (STATICTOP += 16),
    (STATICTOP += 16),
    (FS = {
      root: null,
      mounts: [],
      devices: {},
      streams: [],
      nextInode: 1,
      nameTable: null,
      currentPath: "/",
      initialized: !1,
      ignorePermissions: !0,
      trackingDelegate: {},
      tracking: { openFlags: { READ: 1, WRITE: 2 } },
      ErrnoError: null,
      genericErrors: {},
      filesystems: null,
      syncFSRequests: 0,
      handleFSError: function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
        return ___setErrNo(e.errno);
      },
      lookupPath: function (e, i) {
        var n, t, r, _, o, l, u, a, s, c;
        if (((e = PATH.resolve(FS.cwd(), e)), (i = i || {}), !e))
          return { path: "", node: null };
        n = { follow_mount: !0, recurse_count: 0 };
        for (t in n) void 0 === i[t] && (i[t] = n[t]);
        if (i.recurse_count > 8) throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        for (
          r = PATH.normalizeArray(
            e.split("/").filter(function (e) {
              return !!e;
            }),
            !1
          ),
            _ = FS.root,
            o = "/",
            l = 0;
          l < r.length;
          l++
        ) {
          if (((u = l === r.length - 1), u && i.parent)) break;
          if (
            ((_ = FS.lookupNode(_, r[l])),
            (o = PATH.join2(o, r[l])),
            FS.isMountpoint(_) &&
              (!u || (u && i.follow_mount)) &&
              (_ = _.mounted.root),
            !u || i.follow)
          ) {
            a = 0;
            while (FS.isLink(_.mode))
              if (
                ((s = FS.readlink(o)),
                (o = PATH.resolve(PATH.dirname(o), s)),
                (c = FS.lookupPath(o, { recurse_count: i.recurse_count })),
                (_ = c.node),
                a++ > 40)
              )
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
          }
        }
        return { path: o, node: _ };
      },
      getPath: function (e) {
        var i, n;
        while (!0) {
          if (FS.isRoot(e))
            return (
              (n = e.mount.mountpoint),
              i ? ("/" !== n[n.length - 1] ? n + "/" + i : n + i) : n
            );
          (i = i ? e.name + "/" + i : e.name), (e = e.parent);
        }
      },
      hashName: function (e, i) {
        var n,
          t = 0;
        for (n = 0; n < i.length; n++) t = ((t << 5) - t + i.charCodeAt(n)) | 0;
        return ((e + t) >>> 0) % FS.nameTable.length;
      },
      hashAddNode: function (e) {
        var i = FS.hashName(e.parent.id, e.name);
        (e.name_next = FS.nameTable[i]), (FS.nameTable[i] = e);
      },
      hashRemoveNode: function (e) {
        var i,
          n = FS.hashName(e.parent.id, e.name);
        if (FS.nameTable[n] === e) FS.nameTable[n] = e.name_next;
        else {
          i = FS.nameTable[n];
          while (i) {
            if (i.name_next === e) {
              i.name_next = e.name_next;
              break;
            }
            i = i.name_next;
          }
        }
      },
      lookupNode: function (e, i) {
        var n,
          t,
          r,
          _ = FS.mayLookup(e);
        if (_) throw new FS.ErrnoError(_, e);
        for (n = FS.hashName(e.id, i), t = FS.nameTable[n]; t; t = t.name_next)
          if (((r = t.name), t.parent.id === e.id && r === i)) return t;
        return FS.lookup(e, i);
      },
      createNode: function (e, i, n, t) {
        var r, _, o;
        return (
          FS.FSNode ||
            ((FS.FSNode = function (e, i, n, t) {
              e || (e = this),
                (this.parent = e),
                (this.mount = e.mount),
                (this.mounted = null),
                (this.id = FS.nextInode++),
                (this.name = i),
                (this.mode = n),
                (this.node_ops = {}),
                (this.stream_ops = {}),
                (this.rdev = t);
            }),
            (FS.FSNode.prototype = {}),
            (r = 292 | 73),
            (_ = 146),
            Object.defineProperties(FS.FSNode.prototype, {
              read: {
                get: function () {
                  return (this.mode & r) === r;
                },
                set: function (e) {
                  e ? (this.mode |= r) : (this.mode &= ~r);
                },
              },
              write: {
                get: function () {
                  return (this.mode & _) === _;
                },
                set: function (e) {
                  e ? (this.mode |= _) : (this.mode &= ~_);
                },
              },
              isFolder: {
                get: function () {
                  return FS.isDir(this.mode);
                },
              },
              isDevice: {
                get: function () {
                  return FS.isChrdev(this.mode);
                },
              },
            })),
          (o = new FS.FSNode(e, i, n, t)),
          FS.hashAddNode(o),
          o
        );
      },
      destroyNode: function (e) {
        FS.hashRemoveNode(e);
      },
      isRoot: function (e) {
        return e === e.parent;
      },
      isMountpoint: function (e) {
        return !!e.mounted;
      },
      isFile: function (e) {
        return 32768 === (61440 & e);
      },
      isDir: function (e) {
        return 16384 === (61440 & e);
      },
      isLink: function (e) {
        return 40960 === (61440 & e);
      },
      isChrdev: function (e) {
        return 8192 === (61440 & e);
      },
      isBlkdev: function (e) {
        return 24576 === (61440 & e);
      },
      isFIFO: function (e) {
        return 4096 === (61440 & e);
      },
      isSocket: function (e) {
        return 49152 === (49152 & e);
      },
      flagModes: {
        r: 0,
        rs: 1052672,
        "r+": 2,
        w: 577,
        wx: 705,
        xw: 705,
        "w+": 578,
        "wx+": 706,
        "xw+": 706,
        a: 1089,
        ax: 1217,
        xa: 1217,
        "a+": 1090,
        "ax+": 1218,
        "xa+": 1218,
      },
      modeStringToFlags: function (e) {
        var i = FS.flagModes[e];
        if ("undefined" == typeof i)
          throw new Error("Unknown file open mode: " + e);
        return i;
      },
      flagsToPermissionString: function (e) {
        var i = ["r", "w", "rw"][3 & e];
        return 512 & e && (i += "w"), i;
      },
      nodePermissions: function (e, i) {
        return FS.ignorePermissions
          ? 0
          : (i.indexOf("r") === -1 || 292 & e.mode) &&
            (i.indexOf("w") === -1 || 146 & e.mode) &&
            (i.indexOf("x") === -1 || 73 & e.mode)
          ? 0
          : ERRNO_CODES.EACCES;
      },
      mayLookup: function (e) {
        var i = FS.nodePermissions(e, "x");
        return i ? i : e.node_ops.lookup ? 0 : ERRNO_CODES.EACCES;
      },
      mayCreate: function (e, i) {
        try {
          var n = FS.lookupNode(e, i);
          return ERRNO_CODES.EEXIST;
        } catch (t) {}
        return FS.nodePermissions(e, "wx");
      },
      mayDelete: function (e, i, n) {
        var t, r;
        try {
          t = FS.lookupNode(e, i);
        } catch (_) {
          return _.errno;
        }
        if (((r = FS.nodePermissions(e, "wx")), r)) return r;
        if (n) {
          if (!FS.isDir(t.mode)) return ERRNO_CODES.ENOTDIR;
          if (FS.isRoot(t) || FS.getPath(t) === FS.cwd())
            return ERRNO_CODES.EBUSY;
        } else if (FS.isDir(t.mode)) return ERRNO_CODES.EISDIR;
        return 0;
      },
      mayOpen: function (e, i) {
        return e
          ? FS.isLink(e.mode)
            ? ERRNO_CODES.ELOOP
            : FS.isDir(e.mode) &&
              ("r" !== FS.flagsToPermissionString(i) || 512 & i)
            ? ERRNO_CODES.EISDIR
            : FS.nodePermissions(e, FS.flagsToPermissionString(i))
          : ERRNO_CODES.ENOENT;
      },
      MAX_OPEN_FDS: 4096,
      nextfd: function (e, i) {
        (e = e || 0), (i = i || FS.MAX_OPEN_FDS);
        for (var n = e; i >= n; n++) if (!FS.streams[n]) return n;
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },
      getStream: function (e) {
        return FS.streams[e];
      },
      createStream: function (e, i, n) {
        var t, r, _;
        FS.FSStream ||
          ((FS.FSStream = function () {}),
          (FS.FSStream.prototype = {}),
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function () {
                return this.node;
              },
              set: function (e) {
                this.node = e;
              },
            },
            isRead: {
              get: function () {
                return 1 !== (2097155 & this.flags);
              },
            },
            isWrite: {
              get: function () {
                return 0 !== (2097155 & this.flags);
              },
            },
            isAppend: {
              get: function () {
                return 1024 & this.flags;
              },
            },
          })),
          (t = new FS.FSStream());
        for (r in e) t[r] = e[r];
        return (
          (e = t), (_ = FS.nextfd(i, n)), (e.fd = _), (FS.streams[_] = e), e
        );
      },
      closeStream: function (e) {
        FS.streams[e] = null;
      },
      chrdev_stream_ops: {
        open: function (e) {
          var i = FS.getDevice(e.node.rdev);
          (e.stream_ops = i.stream_ops),
            e.stream_ops.open && e.stream_ops.open(e);
        },
        llseek: function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        },
      },
      major: function (e) {
        return e >> 8;
      },
      minor: function (e) {
        return 255 & e;
      },
      makedev: function (e, i) {
        return (e << 8) | i;
      },
      registerDevice: function (e, i) {
        FS.devices[e] = { stream_ops: i };
      },
      getDevice: function (e) {
        return FS.devices[e];
      },
      getMounts: function (e) {
        var i,
          n = [],
          t = [e];
        while (t.length) (i = t.pop()), n.push(i), t.push.apply(t, i.mounts);
        return n;
      },
      syncfs: function (e, i) {
        function n(e) {
          return assert(FS.syncFSRequests > 0), FS.syncFSRequests--, i(e);
        }
        function t(e) {
          if (e) {
            if (!t.errored) return (t.errored = !0), n(e);
          } else ++_ >= r.length && n(null);
        }
        var r, _;
        "function" == typeof e && ((i = e), (e = !1)),
          FS.syncFSRequests++,
          FS.syncFSRequests > 1 &&
            console.log(
              "warning: " +
                FS.syncFSRequests +
                " FS.syncfs operations in flight at once, probably just doing extra work"
            ),
          (r = FS.getMounts(FS.root.mount)),
          (_ = 0),
          r.forEach(function (i) {
            return i.type.syncfs ? (i.type.syncfs(i, e, t), void 0) : t(null);
          });
      },
      mount: function (e, i, n) {
        var t,
          r,
          _,
          o,
          l = "/" === n,
          u = !n;
        if (l && FS.root) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        if (!l && !u) {
          if (
            ((r = FS.lookupPath(n, { follow_mount: !1 })),
            (n = r.path),
            (t = r.node),
            FS.isMountpoint(t))
          )
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          if (!FS.isDir(t.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return (
          (_ = { type: e, opts: i, mountpoint: n, mounts: [] }),
          (o = e.mount(_)),
          (o.mount = _),
          (_.root = o),
          l
            ? (FS.root = o)
            : t && ((t.mounted = _), t.mount && t.mount.mounts.push(_)),
          o
        );
      },
      unmount: function (e) {
        var i,
          n,
          t,
          r,
          _ = FS.lookupPath(e, { follow_mount: !1 });
        if (!FS.isMountpoint(_.node))
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        (i = _.node),
          (n = i.mounted),
          (t = FS.getMounts(n)),
          Object.keys(FS.nameTable).forEach(function (e) {
            var i,
              n = FS.nameTable[e];
            while (n)
              (i = n.name_next),
                t.indexOf(n.mount) !== -1 && FS.destroyNode(n),
                (n = i);
          }),
          (i.mounted = null),
          (r = i.mount.mounts.indexOf(n)),
          assert(r !== -1),
          i.mount.mounts.splice(r, 1);
      },
      lookup: function (e, i) {
        return e.node_ops.lookup(e, i);
      },
      mknod: function (e, i, n) {
        var t,
          r = FS.lookupPath(e, { parent: !0 }),
          _ = r.node,
          o = PATH.basename(e);
        if (!o || "." === o || ".." === o)
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (((t = FS.mayCreate(_, o)), t)) throw new FS.ErrnoError(t);
        if (!_.node_ops.mknod) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        return _.node_ops.mknod(_, o, i, n);
      },
      create: function (e, i) {
        return (
          (i = void 0 !== i ? i : 438),
          (i &= 4095),
          (i |= 32768),
          FS.mknod(e, i, 0)
        );
      },
      mkdir: function (e, i) {
        return (
          (i = void 0 !== i ? i : 511),
          (i &= 511 | 512),
          (i |= 16384),
          FS.mknod(e, i, 0)
        );
      },
      mkdirTree: function (e, i) {
        var n,
          t = e.split("/"),
          r = "";
        for (n = 0; n < t.length; ++n)
          if (t[n]) {
            r += "/" + t[n];
            try {
              FS.mkdir(r, i);
            } catch (_) {
              if (_.errno != ERRNO_CODES.EEXIST) throw _;
            }
          }
      },
      mkdev: function (e, i, n) {
        return (
          "undefined" == typeof n && ((n = i), (i = 438)),
          (i |= 8192),
          FS.mknod(e, i, n)
        );
      },
      symlink: function (e, i) {
        var n, t, r, _;
        if (!PATH.resolve(e)) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (((n = FS.lookupPath(i, { parent: !0 })), (t = n.node), !t))
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (((r = PATH.basename(i)), (_ = FS.mayCreate(t, r)), _))
          throw new FS.ErrnoError(_);
        if (!t.node_ops.symlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        return t.node_ops.symlink(t, r, e);
      },
      rename: function (e, i) {
        var n,
          t,
          r,
          _,
          o,
          l,
          u,
          a,
          s = PATH.dirname(e),
          c = PATH.dirname(i),
          f = PATH.basename(e),
          d = PATH.basename(i);
        try {
          (n = FS.lookupPath(e, { parent: !0 })),
            (t = n.node),
            (n = FS.lookupPath(i, { parent: !0 })),
            (r = n.node);
        } catch (p) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        if (!t || !r) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (t.mount !== r.mount) throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        if (
          ((_ = FS.lookupNode(t, f)),
          (o = PATH.relative(e, c)),
          "." !== o.charAt(0))
        )
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (((o = PATH.relative(i, s)), "." !== o.charAt(0)))
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        try {
          l = FS.lookupNode(r, d);
        } catch (p) {}
        if (_ !== l) {
          if (((u = FS.isDir(_.mode)), (a = FS.mayDelete(t, f, u)), a))
            throw new FS.ErrnoError(a);
          if (((a = l ? FS.mayDelete(r, d, u) : FS.mayCreate(r, d)), a))
            throw new FS.ErrnoError(a);
          if (!t.node_ops.rename) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
          if (FS.isMountpoint(_) || (l && FS.isMountpoint(l)))
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          if (r !== t && ((a = FS.nodePermissions(t, "w")), a))
            throw new FS.ErrnoError(a);
          try {
            FS.trackingDelegate["willMovePath"] &&
              FS.trackingDelegate["willMovePath"](e, i);
          } catch (p) {
            console.log(
              "FS.trackingDelegate['willMovePath']('" +
                e +
                "', '" +
                i +
                "') threw an exception: " +
                p.message
            );
          }
          FS.hashRemoveNode(_);
          try {
            t.node_ops.rename(_, r, d);
          } catch (p) {
            throw p;
          } finally {
            FS.hashAddNode(_);
          }
          try {
            FS.trackingDelegate["onMovePath"] &&
              FS.trackingDelegate["onMovePath"](e, i);
          } catch (p) {
            console.log(
              "FS.trackingDelegate['onMovePath']('" +
                e +
                "', '" +
                i +
                "') threw an exception: " +
                p.message
            );
          }
        }
      },
      rmdir: function (e) {
        var i = FS.lookupPath(e, { parent: !0 }),
          n = i.node,
          t = PATH.basename(e),
          r = FS.lookupNode(n, t),
          _ = FS.mayDelete(n, t, !0);
        if (_) throw new FS.ErrnoError(_);
        if (!n.node_ops.rmdir) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        if (FS.isMountpoint(r)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        try {
          FS.trackingDelegate["willDeletePath"] &&
            FS.trackingDelegate["willDeletePath"](e);
        } catch (o) {
          console.log(
            "FS.trackingDelegate['willDeletePath']('" +
              e +
              "') threw an exception: " +
              o.message
          );
        }
        n.node_ops.rmdir(n, t), FS.destroyNode(r);
        try {
          FS.trackingDelegate["onDeletePath"] &&
            FS.trackingDelegate["onDeletePath"](e);
        } catch (o) {
          console.log(
            "FS.trackingDelegate['onDeletePath']('" +
              e +
              "') threw an exception: " +
              o.message
          );
        }
      },
      readdir: function (e) {
        var i = FS.lookupPath(e, { follow: !0 }),
          n = i.node;
        if (!n.node_ops.readdir) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        return n.node_ops.readdir(n);
      },
      unlink: function (e) {
        var i = FS.lookupPath(e, { parent: !0 }),
          n = i.node,
          t = PATH.basename(e),
          r = FS.lookupNode(n, t),
          _ = FS.mayDelete(n, t, !1);
        if (_) throw new FS.ErrnoError(_);
        if (!n.node_ops.unlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        if (FS.isMountpoint(r)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        try {
          FS.trackingDelegate["willDeletePath"] &&
            FS.trackingDelegate["willDeletePath"](e);
        } catch (o) {
          console.log(
            "FS.trackingDelegate['willDeletePath']('" +
              e +
              "') threw an exception: " +
              o.message
          );
        }
        n.node_ops.unlink(n, t), FS.destroyNode(r);
        try {
          FS.trackingDelegate["onDeletePath"] &&
            FS.trackingDelegate["onDeletePath"](e);
        } catch (o) {
          console.log(
            "FS.trackingDelegate['onDeletePath']('" +
              e +
              "') threw an exception: " +
              o.message
          );
        }
      },
      readlink: function (e) {
        var i = FS.lookupPath(e),
          n = i.node;
        if (!n) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (!n.node_ops.readlink) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        return PATH.resolve(FS.getPath(n.parent), n.node_ops.readlink(n));
      },
      stat: function (e, i) {
        var n = FS.lookupPath(e, { follow: !i }),
          t = n.node;
        if (!t) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (!t.node_ops.getattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        return t.node_ops.getattr(t);
      },
      lstat: function (e) {
        return FS.stat(e, !0);
      },
      chmod: function (e, i, n) {
        var t, r;
        if (
          ("string" == typeof e
            ? ((r = FS.lookupPath(e, { follow: !n })), (t = r.node))
            : (t = e),
          !t.node_ops.setattr)
        )
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        t.node_ops.setattr(t, {
          mode: (4095 & i) | (t.mode & ~4095),
          timestamp: Date.now(),
        });
      },
      lchmod: function (e, i) {
        FS.chmod(e, i, !0);
      },
      fchmod: function (e, i) {
        var n = FS.getStream(e);
        if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        FS.chmod(n.node, i);
      },
      chown: function (e, i, n, t) {
        var r, _;
        if (
          ("string" == typeof e
            ? ((_ = FS.lookupPath(e, { follow: !t })), (r = _.node))
            : (r = e),
          !r.node_ops.setattr)
        )
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        r.node_ops.setattr(r, { timestamp: Date.now() });
      },
      lchown: function (e, i, n) {
        FS.chown(e, i, n, !0);
      },
      fchown: function (e, i, n) {
        var t = FS.getStream(e);
        if (!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        FS.chown(t.node, i, n);
      },
      truncate: function (e, i) {
        var n, t, r;
        if (0 > i) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (
          ("string" == typeof e
            ? ((t = FS.lookupPath(e, { follow: !0 })), (n = t.node))
            : (n = e),
          !n.node_ops.setattr)
        )
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        if (FS.isDir(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        if (!FS.isFile(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (((r = FS.nodePermissions(n, "w")), r)) throw new FS.ErrnoError(r);
        n.node_ops.setattr(n, { size: i, timestamp: Date.now() });
      },
      ftruncate: function (e, i) {
        var n = FS.getStream(e);
        if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        if (0 === (2097155 & n.flags))
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        FS.truncate(n.node, i);
      },
      utime: function (e, i, n) {
        var t = FS.lookupPath(e, { follow: !0 }),
          r = t.node;
        r.node_ops.setattr(r, { timestamp: Math.max(i, n) });
      },
      open: function (e, i, n, t, r) {
        var _, o, l, u, a, s;
        if ("" === e) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (
          ((i = "string" == typeof i ? FS.modeStringToFlags(i) : i),
          (n = "undefined" == typeof n ? 438 : n),
          (n = 64 & i ? (4095 & n) | 32768 : 0),
          "object" == typeof e)
        )
          _ = e;
        else {
          e = PATH.normalize(e);
          try {
            (o = FS.lookupPath(e, { follow: !(131072 & i) })), (_ = o.node);
          } catch (c) {}
        }
        if (((l = !1), 64 & i))
          if (_) {
            if (128 & i) throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
          } else (_ = FS.mknod(e, n, 0)), (l = !0);
        if (!_) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (
          (FS.isChrdev(_.mode) && (i &= ~512), 65536 & i && !FS.isDir(_.mode))
        )
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        if (!l && ((u = FS.mayOpen(_, i)), u)) throw new FS.ErrnoError(u);
        512 & i && FS.truncate(_, 0),
          (i &= ~(128 | 512)),
          (a = FS.createStream(
            {
              node: _,
              path: FS.getPath(_),
              flags: i,
              seekable: !0,
              position: 0,
              stream_ops: _.stream_ops,
              ungotten: [],
              error: !1,
            },
            t,
            r
          )),
          a.stream_ops.open && a.stream_ops.open(a),
          !Module["logReadFiles"] ||
            1 & i ||
            (FS.readFiles || (FS.readFiles = {}),
            e in FS.readFiles ||
              ((FS.readFiles[e] = 1), Module["printErr"]("read file: " + e)));
        try {
          FS.trackingDelegate["onOpenFile"] &&
            ((s = 0),
            1 !== (2097155 & i) && (s |= FS.tracking.openFlags.READ),
            0 !== (2097155 & i) && (s |= FS.tracking.openFlags.WRITE),
            FS.trackingDelegate["onOpenFile"](e, s));
        } catch (c) {
          console.log(
            "FS.trackingDelegate['onOpenFile']('" +
              e +
              "', flags) threw an exception: " +
              c.message
          );
        }
        return a;
      },
      close: function (e) {
        e.getdents && (e.getdents = null);
        try {
          e.stream_ops.close && e.stream_ops.close(e);
        } catch (i) {
          throw i;
        } finally {
          FS.closeStream(e.fd);
        }
      },
      llseek: function (e, i, n) {
        if (!e.seekable || !e.stream_ops.llseek)
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        return (
          (e.position = e.stream_ops.llseek(e, i, n)),
          (e.ungotten = []),
          e.position
        );
      },
      read: function (e, i, n, t, r) {
        var _, o;
        if (0 > t || 0 > r) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (1 === (2097155 & e.flags))
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        if (!e.stream_ops.read) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (((_ = "undefined" != typeof r), _)) {
          if (!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        } else r = e.position;
        return (
          (o = e.stream_ops.read(e, i, n, t, r)), _ || (e.position += o), o
        );
      },
      write: function (e, i, n, t, r, _) {
        var o, l;
        if (0 > t || 0 > r) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (0 === (2097155 & e.flags))
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        if (!e.stream_ops.write) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (
          (1024 & e.flags && FS.llseek(e, 0, 2),
          (o = "undefined" != typeof r),
          o)
        ) {
          if (!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        } else r = e.position;
        (l = e.stream_ops.write(e, i, n, t, r, _)), o || (e.position += l);
        try {
          e.path &&
            FS.trackingDelegate["onWriteToFile"] &&
            FS.trackingDelegate["onWriteToFile"](e.path);
        } catch (u) {
          console.log(
            "FS.trackingDelegate['onWriteToFile']('" +
              path +
              "') threw an exception: " +
              u.message
          );
        }
        return l;
      },
      allocate: function (e, i, n) {
        if (0 > i || 0 >= n) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        if (0 === (2097155 & e.flags))
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        if (!FS.isFile(e.node.mode) && !FS.isDir(e.node.mode))
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        if (!e.stream_ops.allocate)
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        e.stream_ops.allocate(e, i, n);
      },
      mmap: function (e, i, n, t, r, _, o) {
        if (1 === (2097155 & e.flags))
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        if (!e.stream_ops.mmap) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        return e.stream_ops.mmap(e, i, n, t, r, _, o);
      },
      msync: function (e, i, n, t, r) {
        return e && e.stream_ops.msync ? e.stream_ops.msync(e, i, n, t, r) : 0;
      },
      munmap: function (e) {
        return 0;
      },
      ioctl: function (e, i, n) {
        if (!e.stream_ops.ioctl) throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        return e.stream_ops.ioctl(e, i, n);
      },
      readFile: function (e, i) {
        var n, t, r, _, o;
        if (
          ((i = i || {}),
          (i.flags = i.flags || "r"),
          (i.encoding = i.encoding || "binary"),
          "utf8" !== i.encoding && "binary" !== i.encoding)
        )
          throw new Error('Invalid encoding type "' + i.encoding + '"');
        return (
          (t = FS.open(e, i.flags)),
          (r = FS.stat(e)),
          (_ = r.size),
          (o = new Uint8Array(_)),
          FS.read(t, o, 0, _, 0),
          "utf8" === i.encoding
            ? (n = UTF8ArrayToString(o, 0))
            : "binary" === i.encoding && (n = o),
          FS.close(t),
          n
        );
      },
      writeFile: function (e, i, n) {
        var t, r, _;
        if (
          ((n = n || {}),
          (n.flags = n.flags || "w"),
          (t = FS.open(e, n.flags, n.mode)),
          "string" == typeof i)
        )
          (r = new Uint8Array(lengthBytesUTF8(i) + 1)),
            (_ = stringToUTF8Array(i, r, 0, r.length)),
            FS.write(t, r, 0, _, void 0, n.canOwn);
        else {
          if (!ArrayBuffer.isView(i)) throw new Error("Unsupported data type");
          FS.write(t, i, 0, i.byteLength, void 0, n.canOwn);
        }
        FS.close(t);
      },
      cwd: function () {
        return FS.currentPath;
      },
      chdir: function (e) {
        var i,
          n = FS.lookupPath(e, { follow: !0 });
        if (null === n.node) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        if (!FS.isDir(n.node.mode))
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        if (((i = FS.nodePermissions(n.node, "x")), i))
          throw new FS.ErrnoError(i);
        FS.currentPath = n.path;
      },
      createDefaultDirectories: function () {
        FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user");
      },
      createDefaultDevices: function () {
        var e, i;
        FS.mkdir("/dev"),
          FS.registerDevice(FS.makedev(1, 3), {
            read: function () {
              return 0;
            },
            write: function (e, i, n, t, r) {
              return t;
            },
          }),
          FS.mkdev("/dev/null", FS.makedev(1, 3)),
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops),
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops),
          FS.mkdev("/dev/tty", FS.makedev(5, 0)),
          FS.mkdev("/dev/tty1", FS.makedev(6, 0)),
          "undefined" != typeof crypto
            ? ((i = new Uint8Array(1)),
              (e = function () {
                return crypto.getRandomValues(i), i[0];
              }))
            : (e = ENVIRONMENT_IS_NODE
                ? function () {
                    return require("crypto")["randomBytes"](1)[0];
                  }
                : function () {
                    return (256 * Math.random()) | 0;
                  }),
          FS.createDevice("/dev", "random", e),
          FS.createDevice("/dev", "urandom", e),
          FS.mkdir("/dev/shm"),
          FS.mkdir("/dev/shm/tmp");
      },
      createSpecialDirectories: function () {
        FS.mkdir("/proc"),
          FS.mkdir("/proc/self"),
          FS.mkdir("/proc/self/fd"),
          FS.mount(
            {
              mount: function () {
                var e = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
                return (
                  (e.node_ops = {
                    lookup: function (e, i) {
                      var n,
                        t = +i,
                        r = FS.getStream(t);
                      if (!r) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                      return (
                        (n = {
                          parent: null,
                          mount: { mountpoint: "fake" },
                          node_ops: {
                            readlink: function () {
                              return r.path;
                            },
                          },
                        }),
                        (n.parent = n),
                        n
                      );
                    },
                  }),
                  e
                );
              },
            },
            {},
            "/proc/self/fd"
          );
      },
      createStandardStreams: function () {
        var e, i, n;
        Module["stdin"]
          ? FS.createDevice("/dev", "stdin", Module["stdin"])
          : FS.symlink("/dev/tty", "/dev/stdin"),
          Module["stdout"]
            ? FS.createDevice("/dev", "stdout", null, Module["stdout"])
            : FS.symlink("/dev/tty", "/dev/stdout"),
          Module["stderr"]
            ? FS.createDevice("/dev", "stderr", null, Module["stderr"])
            : FS.symlink("/dev/tty1", "/dev/stderr"),
          (e = FS.open("/dev/stdin", "r")),
          assert(0 === e.fd, "invalid handle for stdin (" + e.fd + ")"),
          (i = FS.open("/dev/stdout", "w")),
          assert(1 === i.fd, "invalid handle for stdout (" + i.fd + ")"),
          (n = FS.open("/dev/stderr", "w")),
          assert(2 === n.fd, "invalid handle for stderr (" + n.fd + ")");
      },
      ensureErrnoError: function () {
        FS.ErrnoError ||
          ((FS.ErrnoError = function e(i, n) {
            (this.node = n),
              (this.setErrno = function (e) {
                this.errno = e;
                for (var i in ERRNO_CODES)
                  if (ERRNO_CODES[i] === e) {
                    this.code = i;
                    break;
                  }
              }),
              this.setErrno(i),
              (this.message = ERRNO_MESSAGES[i]),
              this.stack &&
                Object.defineProperty(this, "stack", {
                  value: new Error().stack,
                  writable: !0,
                });
          }),
          (FS.ErrnoError.prototype = new Error()),
          (FS.ErrnoError.prototype.constructor = FS.ErrnoError),
          [ERRNO_CODES.ENOENT].forEach(function (e) {
            (FS.genericErrors[e] = new FS.ErrnoError(e)),
              (FS.genericErrors[e].stack = "<generic error, no stack>");
          }));
      },
      staticInit: function () {
        FS.ensureErrnoError(),
          (FS.nameTable = new Array(4096)),
          FS.mount(MEMFS, {}, "/"),
          FS.createDefaultDirectories(),
          FS.createDefaultDevices(),
          FS.createSpecialDirectories(),
          (FS.filesystems = {
            MEMFS: MEMFS,
            IDBFS: IDBFS,
            NODEFS: NODEFS,
            WORKERFS: WORKERFS,
          });
      },
      init: function (e, i, n) {
        assert(
          !FS.init.initialized,
          "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"
        ),
          (FS.init.initialized = !0),
          FS.ensureErrnoError(),
          (Module["stdin"] = e || Module["stdin"]),
          (Module["stdout"] = i || Module["stdout"]),
          (Module["stderr"] = n || Module["stderr"]),
          FS.createStandardStreams();
      },
      quit: function () {
        var e, i, n;
        for (
          FS.init.initialized = !1, e = Module["_fflush"], e && e(0), i = 0;
          i < FS.streams.length;
          i++
        )
          (n = FS.streams[i]), n && FS.close(n);
      },
      getMode: function (e, i) {
        var n = 0;
        return e && (n |= 292 | 73), i && (n |= 146), n;
      },
      joinPath: function (e, i) {
        var n = PATH.join.apply(null, e);
        return i && "/" == n[0] && (n = n.substr(1)), n;
      },
      absolutePath: function (e, i) {
        return PATH.resolve(i, e);
      },
      standardizePath: function (e) {
        return PATH.normalize(e);
      },
      findObject: function (e, i) {
        var n = FS.analyzePath(e, i);
        return n.exists ? n.object : (___setErrNo(n.error), null);
      },
      analyzePath: function (e, i) {
        var n, t;
        try {
          (n = FS.lookupPath(e, { follow: !i })), (e = n.path);
        } catch (r) {}
        t = {
          isRoot: !1,
          exists: !1,
          error: 0,
          name: null,
          path: null,
          object: null,
          parentExists: !1,
          parentPath: null,
          parentObject: null,
        };
        try {
          (n = FS.lookupPath(e, { parent: !0 })),
            (t.parentExists = !0),
            (t.parentPath = n.path),
            (t.parentObject = n.node),
            (t.name = PATH.basename(e)),
            (n = FS.lookupPath(e, { follow: !i })),
            (t.exists = !0),
            (t.path = n.path),
            (t.object = n.node),
            (t.name = n.node.name),
            (t.isRoot = "/" === n.path);
        } catch (r) {
          t.error = r.errno;
        }
        return t;
      },
      createFolder: function (e, i, n, t) {
        var r = PATH.join2("string" == typeof e ? e : FS.getPath(e), i),
          _ = FS.getMode(n, t);
        return FS.mkdir(r, _);
      },
      createPath: function (e, i, n, t) {
        var r, _, o;
        (e = "string" == typeof e ? e : FS.getPath(e)),
          (r = i.split("/").reverse());
        while (r.length)
          if (((_ = r.pop()), _)) {
            o = PATH.join2(e, _);
            try {
              FS.mkdir(o);
            } catch (l) {}
            e = o;
          }
        return o;
      },
      createFile: function (e, i, n, t, r) {
        var _ = PATH.join2("string" == typeof e ? e : FS.getPath(e), i),
          o = FS.getMode(t, r);
        return FS.create(_, o);
      },
      createDataFile: function (e, i, n, t, r, _) {
        var o,
          l,
          u,
          a,
          s = i ? PATH.join2("string" == typeof e ? e : FS.getPath(e), i) : e,
          c = FS.getMode(t, r),
          f = FS.create(s, c);
        if (n) {
          if ("string" == typeof n) {
            for (o = new Array(n.length), l = 0, u = n.length; u > l; ++l)
              o[l] = n.charCodeAt(l);
            n = o;
          }
          FS.chmod(f, 146 | c),
            (a = FS.open(f, "w")),
            FS.write(a, n, 0, n.length, 0, _),
            FS.close(a),
            FS.chmod(f, c);
        }
        return f;
      },
      createDevice: function (e, i, n, t) {
        var r,
          _ = PATH.join2("string" == typeof e ? e : FS.getPath(e), i),
          o = FS.getMode(!!n, !!t);
        return (
          FS.createDevice.major || (FS.createDevice.major = 64),
          (r = FS.makedev(FS.createDevice.major++, 0)),
          FS.registerDevice(r, {
            open: function (e) {
              e.seekable = !1;
            },
            close: function (e) {
              t && t.buffer && t.buffer.length && t(10);
            },
            read: function (e, i, t, r, _) {
              var o,
                l,
                u = 0;
              for (o = 0; r > o; o++) {
                try {
                  l = n();
                } catch (a) {
                  throw new FS.ErrnoError(ERRNO_CODES.EIO);
                }
                if (void 0 === l && 0 === u)
                  throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                if (null === l || void 0 === l) break;
                u++, (i[t + o] = l);
              }
              return u && (e.node.timestamp = Date.now()), u;
            },
            write: function (e, i, n, r, _) {
              for (var o = 0; r > o; o++)
                try {
                  t(i[n + o]);
                } catch (l) {
                  throw new FS.ErrnoError(ERRNO_CODES.EIO);
                }
              return r && (e.node.timestamp = Date.now()), o;
            },
          }),
          FS.mkdev(_, o, r)
        );
      },
      createLink: function (e, i, n, t, r) {
        var _ = PATH.join2("string" == typeof e ? e : FS.getPath(e), i);
        return FS.symlink(n, _);
      },
      forceLoadFile: function (e) {
        if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
        var i = !0;
        if ("undefined" != typeof XMLHttpRequest)
          throw new Error(
            "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
          );
        if (!Module["read"])
          throw new Error("Cannot load without read() or XMLHttpRequest.");
        try {
          (e.contents = intArrayFromString(Module["read"](e.url), !0)),
            (e.usedBytes = e.contents.length);
        } catch (n) {
          i = !1;
        }
        return i || ___setErrNo(ERRNO_CODES.EIO), i;
      },
      createLazyFile: function (e, i, n, t, r) {
        function _() {
          (this.lengthKnown = !1), (this.chunks = []);
        }
        var o, l, u, a, s;
        if (
          ((_.prototype.get = function c(e) {
            var i, n;
            return e > this.length - 1 || 0 > e
              ? void 0
              : ((i = e % this.chunkSize),
                (n = (e / this.chunkSize) | 0),
                this.getter(n)[i]);
          }),
          (_.prototype.setDataGetter = function f(e) {
            this.getter = e;
          }),
          (_.prototype.cacheLength = function d() {
            var e,
              i,
              t,
              r,
              _,
              o,
              l,
              u = new XMLHttpRequest();
            if (
              (u.open("HEAD", n, !1),
              u.send(null),
              !((u.status >= 200 && u.status < 300) || 304 === u.status))
            )
              throw new Error("Couldn't load " + n + ". Status: " + u.status);
            (e = Number(u.getResponseHeader("Content-length"))),
              (t = (i = u.getResponseHeader("Accept-Ranges")) && "bytes" === i),
              (r =
                (i = u.getResponseHeader("Content-Encoding")) && "gzip" === i),
              (_ = 1024 * 1024),
              t || (_ = e),
              (o = function (i, t) {
                if (i > t)
                  throw new Error(
                    "invalid range (" +
                      i +
                      ", " +
                      t +
                      ") or no bytes requested!"
                  );
                if (t > e - 1)
                  throw new Error(
                    "only " + e + " bytes available! programmer error!"
                  );
                var r = new XMLHttpRequest();
                if (
                  (r.open("GET", n, !1),
                  e !== _ &&
                    r.setRequestHeader("Range", "bytes=" + i + "-" + t),
                  "undefined" != typeof Uint8Array &&
                    (r.responseType = "arraybuffer"),
                  r.overrideMimeType &&
                    r.overrideMimeType("text/plain; charset=x-user-defined"),
                  r.send(null),
                  !((r.status >= 200 && r.status < 300) || 304 === r.status))
                )
                  throw new Error(
                    "Couldn't load " + n + ". Status: " + r.status
                  );
                return void 0 !== r.response
                  ? new Uint8Array(r.response || [])
                  : intArrayFromString(r.responseText || "", !0);
              }),
              (l = this),
              l.setDataGetter(function (i) {
                var n = i * _,
                  t = (i + 1) * _ - 1;
                if (
                  ((t = Math.min(t, e - 1)),
                  "undefined" == typeof l.chunks[i] && (l.chunks[i] = o(n, t)),
                  "undefined" == typeof l.chunks[i])
                )
                  throw new Error("doXHR failed!");
                return l.chunks[i];
              }),
              (r || !e) &&
                ((_ = e = 1),
                (e = this.getter(0).length),
                (_ = e),
                console.log(
                  "LazyFiles on gzip forces download of the whole file when length is accessed"
                )),
              (this._length = e),
              (this._chunkSize = _),
              (this.lengthKnown = !0);
          }),
          "undefined" != typeof XMLHttpRequest)
        ) {
          if (!ENVIRONMENT_IS_WORKER)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          (o = new _()),
            Object.defineProperties(o, {
              length: {
                get: function () {
                  return this.lengthKnown || this.cacheLength(), this._length;
                },
              },
              chunkSize: {
                get: function () {
                  return (
                    this.lengthKnown || this.cacheLength(), this._chunkSize
                  );
                },
              },
            }),
            (l = { isDevice: !1, contents: o });
        } else l = { isDevice: !1, url: n };
        return (
          (u = FS.createFile(e, i, l, t, r)),
          l.contents
            ? (u.contents = l.contents)
            : l.url && ((u.contents = null), (u.url = l.url)),
          Object.defineProperties(u, {
            usedBytes: {
              get: function () {
                return this.contents.length;
              },
            },
          }),
          (a = {}),
          (s = Object.keys(u.stream_ops)),
          s.forEach(function (e) {
            var i = u.stream_ops[e];
            a[e] = function n() {
              if (!FS.forceLoadFile(u))
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              return i.apply(null, arguments);
            };
          }),
          (a.read = function p(e, i, n, t, r) {
            var _, o, l;
            if (!FS.forceLoadFile(u)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
            if (((_ = e.node.contents), r >= _.length)) return 0;
            if (((o = Math.min(_.length - r, t)), assert(o >= 0), _.slice))
              for (l = 0; o > l; l++) i[n + l] = _[r + l];
            else for (l = 0; o > l; l++) i[n + l] = _.get(r + l);
            return o;
          }),
          (u.stream_ops = a),
          u
        );
      },
      createPreloadedFile: function (e, i, n, t, r, _, o, l, u, a) {
        function s(n) {
          function s(n) {
            a && a(),
              l || FS.createDataFile(e, i, n, t, r, u),
              _ && _(),
              removeRunDependency(f);
          }
          var d = !1;
          Module["preloadPlugins"].forEach(function (e) {
            d ||
              (e["canHandle"](c) &&
                (e["handle"](n, c, s, function () {
                  o && o(), removeRunDependency(f);
                }),
                (d = !0)));
          }),
            d || s(n);
        }
        var c, f;
        Browser.init(),
          (c = i ? PATH.resolve(PATH.join2(e, i)) : e),
          (f = getUniqueRunDependency("cp " + c)),
          addRunDependency(f),
          "string" == typeof n
            ? Browser.asyncLoad(
                n,
                function (e) {
                  s(e);
                },
                o
              )
            : s(n);
      },
      indexedDB: function () {
        return (
          window.indexedDB ||
          window.mozIndexedDB ||
          window.webkitIndexedDB ||
          window.msIndexedDB
        );
      },
      DB_NAME: function () {
        return "EM_FS_" + window.location.pathname;
      },
      DB_VERSION: 20,
      DB_STORE_NAME: "FILE_DATA",
      saveFilesToDB: function (e, i, n) {
        var t, r;
        (i = i || function () {}),
          (n = n || function () {}),
          (t = FS.indexedDB());
        try {
          r = t.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (_) {
          return n(_);
        }
        (r.onupgradeneeded = function o() {
          console.log("creating db");
          var e = r.result;
          e.createObjectStore(FS.DB_STORE_NAME);
        }),
          (r.onsuccess = function l() {
            function t() {
              0 == a ? i() : n();
            }
            var _ = r.result,
              o = _.transaction([FS.DB_STORE_NAME], "readwrite"),
              l = o.objectStore(FS.DB_STORE_NAME),
              u = 0,
              a = 0,
              s = e.length;
            e.forEach(function (e) {
              var i = l.put(FS.analyzePath(e).object.contents, e);
              (i.onsuccess = function n() {
                u++, u + a == s && t();
              }),
                (i.onerror = function r() {
                  a++, u + a == s && t();
                });
            }),
              (o.onerror = n);
          }),
          (r.onerror = n);
      },
      loadFilesFromDB: function (e, i, n) {
        var t, r;
        (i = i || function () {}),
          (n = n || function () {}),
          (t = FS.indexedDB());
        try {
          r = t.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (_) {
          return n(_);
        }
        (r.onupgradeneeded = n),
          (r.onsuccess = function o() {
            function t() {
              0 == u ? i() : n();
            }
            var _,
              o,
              l,
              u,
              a,
              s = r.result;
            try {
              _ = s.transaction([FS.DB_STORE_NAME], "readonly");
            } catch (c) {
              return n(c), void 0;
            }
            (o = _.objectStore(FS.DB_STORE_NAME)),
              (l = 0),
              (u = 0),
              (a = e.length),
              e.forEach(function (e) {
                var i = o.get(e);
                (i.onsuccess = function n() {
                  FS.analyzePath(e).exists && FS.unlink(e),
                    FS.createDataFile(
                      PATH.dirname(e),
                      PATH.basename(e),
                      i.result,
                      !0,
                      !0,
                      !0
                    ),
                    l++,
                    l + u == a && t();
                }),
                  (i.onerror = function r() {
                    u++, l + u == a && t();
                  });
              }),
              (_.onerror = n);
          }),
          (r.onerror = n);
      },
    }),
    (Browser = {
      mainLoop: {
        scheduler: null,
        method: "",
        currentlyRunningMainloop: 0,
        func: null,
        arg: 0,
        timingMode: 0,
        timingValue: 0,
        currentFrameNumber: 0,
        queue: [],
        pause: function () {
          (Browser.mainLoop.scheduler = null),
            Browser.mainLoop.currentlyRunningMainloop++;
        },
        resume: function () {
          var e, i, n;
          Browser.mainLoop.currentlyRunningMainloop++,
            (e = Browser.mainLoop.timingMode),
            (i = Browser.mainLoop.timingValue),
            (n = Browser.mainLoop.func),
            (Browser.mainLoop.func = null),
            _emscripten_set_main_loop(n, 0, !1, Browser.mainLoop.arg, !0),
            _emscripten_set_main_loop_timing(e, i),
            Browser.mainLoop.scheduler();
        },
        updateStatus: function () {
          var e, i, n;
          Module["setStatus"] &&
            ((e = Module["statusMessage"] || "Please wait..."),
            (i = Browser.mainLoop.remainingBlockers),
            (n = Browser.mainLoop.expectedBlockers),
            i
              ? n > i
                ? Module["setStatus"](e + " (" + (n - i) + "/" + n + ")")
                : Module["setStatus"](e)
              : Module["setStatus"](""));
        },
        runIter: function (e) {
          if (!ABORT) {
            if (Module["preMainLoop"]) {
              var i = Module["preMainLoop"]();
              if (i === !1) return;
            }
            try {
              e();
            } catch (n) {
              if (n instanceof ExitStatus) return;
              throw (
                (n &&
                  "object" == typeof n &&
                  n.stack &&
                  Module.printErr("exception thrown: " + [n, n.stack]),
                n)
              );
            }
            Module["postMainLoop"] && Module["postMainLoop"]();
          }
        },
      },
      isFullscreen: !1,
      pointerLock: !1,
      moduleContextCreatedCallbacks: [],
      workers: [],
      init: function () {
        function e() {
          Browser.pointerLock =
            document["pointerLockElement"] === Module["canvas"] ||
            document["mozPointerLockElement"] === Module["canvas"] ||
            document["webkitPointerLockElement"] === Module["canvas"] ||
            document["msPointerLockElement"] === Module["canvas"];
        }
        var i, n, t;
        if (
          (Module["preloadPlugins"] || (Module["preloadPlugins"] = []),
          !Browser.initted)
        ) {
          Browser.initted = !0;
          try {
            new Blob(), (Browser.hasBlobConstructor = !0);
          } catch (r) {
            (Browser.hasBlobConstructor = !1),
              console.log(
                "warning: no blob constructor, cannot create blobs with mimetypes"
              );
          }
          (Browser.BlobBuilder =
            "undefined" != typeof MozBlobBuilder
              ? MozBlobBuilder
              : "undefined" != typeof WebKitBlobBuilder
              ? WebKitBlobBuilder
              : Browser.hasBlobConstructor
              ? null
              : console.log("warning: no BlobBuilder")),
            (Browser.URLObject =
              "undefined" != typeof window
                ? window.URL
                  ? window.URL
                  : window.webkitURL
                : void 0),
            Module.noImageDecoding ||
              "undefined" != typeof Browser.URLObject ||
              (console.log(
                "warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."
              ),
              (Module.noImageDecoding = !0)),
            (i = {}),
            (i["canHandle"] = function _(e) {
              return (
                !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(e)
              );
            }),
            (i["handle"] = function o(e, i, n, t) {
              var r,
                _,
                o,
                l = null;
              if (Browser.hasBlobConstructor)
                try {
                  (l = new Blob([e], { type: Browser.getMimetype(i) })),
                    l.size !== e.length &&
                      (l = new Blob([new Uint8Array(e).buffer], {
                        type: Browser.getMimetype(i),
                      }));
                } catch (u) {
                  warnOnce(
                    "Blob constructor present but fails: " +
                      u +
                      "; falling back to blob builder"
                  );
                }
              l ||
                ((r = new Browser.BlobBuilder()),
                r.append(new Uint8Array(e).buffer),
                (l = r.getBlob())),
                (_ = Browser.URLObject.createObjectURL(l)),
                (o = new Image()),
                (o.onload = function a() {
                  var t, r;
                  assert(o.complete, "Image " + i + " could not be decoded"),
                    (t = document.createElement("canvas")),
                    (t.width = o.width),
                    (t.height = o.height),
                    (r = t.getContext("2d")),
                    r.drawImage(o, 0, 0),
                    (Module["preloadedImages"][i] = t),
                    Browser.URLObject.revokeObjectURL(_),
                    n && n(e);
                }),
                (o.onerror = function s(e) {
                  console.log("Image " + _ + " could not be decoded"), t && t();
                }),
                (o.src = _);
            }),
            Module["preloadPlugins"].push(i),
            (n = {}),
            (n["canHandle"] = function l(e) {
              return (
                !Module.noAudioDecoding &&
                e.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 }
              );
            }),
            (n["handle"] = function u(e, i, n, t) {
              function r(t) {
                a || ((a = !0), (Module["preloadedAudios"][i] = t), n && n(e));
              }
              function _() {
                a ||
                  ((a = !0),
                  (Module["preloadedAudios"][i] = new Audio()),
                  t && t());
              }
              var o,
                l,
                u,
                a = !1;
              if (!Browser.hasBlobConstructor) return _();
              try {
                o = new Blob([e], { type: Browser.getMimetype(i) });
              } catch (s) {
                return _();
              }
              (l = Browser.URLObject.createObjectURL(o)),
                (u = new Audio()),
                u.addEventListener(
                  "canplaythrough",
                  function () {
                    r(u);
                  },
                  !1
                ),
                (u.onerror = function c(n) {
                  function t(e) {
                    var i,
                      n,
                      t =
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                      r = "=",
                      _ = "",
                      o = 0,
                      l = 0;
                    for (i = 0; i < e.length; i++) {
                      (o = (o << 8) | e[i]), (l += 8);
                      while (l >= 6)
                        (n = (o >> (l - 6)) & 63), (l -= 6), (_ += t[n]);
                    }
                    return (
                      2 == l
                        ? ((_ += t[(3 & o) << 4]), (_ += r + r))
                        : 4 == l && ((_ += t[(15 & o) << 2]), (_ += r)),
                      _
                    );
                  }
                  a ||
                    (console.log(
                      "warning: browser could not fully decode audio " +
                        i +
                        ", trying slower base64 approach"
                    ),
                    (u.src =
                      "data:audio/x-" + i.substr(-3) + ";base64," + t(e)),
                    r(u));
                }),
                (u.src = l),
                Browser.safeSetTimeout(function () {
                  r(u);
                }, 1e4);
            }),
            Module["preloadPlugins"].push(n),
            (t = Module["canvas"]),
            t &&
              ((t.requestPointerLock =
                t["requestPointerLock"] ||
                t["mozRequestPointerLock"] ||
                t["webkitRequestPointerLock"] ||
                t["msRequestPointerLock"] ||
                function () {}),
              (t.exitPointerLock =
                document["exitPointerLock"] ||
                document["mozExitPointerLock"] ||
                document["webkitExitPointerLock"] ||
                document["msExitPointerLock"] ||
                function () {}),
              (t.exitPointerLock = t.exitPointerLock.bind(document)),
              document.addEventListener("pointerlockchange", e, !1),
              document.addEventListener("mozpointerlockchange", e, !1),
              document.addEventListener("webkitpointerlockchange", e, !1),
              document.addEventListener("mspointerlockchange", e, !1),
              Module["elementPointerLock"] &&
                t.addEventListener(
                  "click",
                  function (e) {
                    !Browser.pointerLock &&
                      Module["canvas"].requestPointerLock &&
                      (Module["canvas"].requestPointerLock(),
                      e.preventDefault());
                  },
                  !1
                ));
        }
      },
      createContext: function (e, i, n, t) {
        var r, _, o, l;
        if (i && Module.ctx && e == Module.canvas) return Module.ctx;
        if (i) {
          if (((o = { antialias: !1, alpha: !1 }), t)) for (l in t) o[l] = t[l];
          (_ = GL.createContext(e, o)), _ && (r = GL.getContext(_).GLctx);
        } else r = e.getContext("2d");
        return r
          ? (n &&
              (i ||
                assert(
                  "undefined" == typeof GLctx,
                  "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"
                ),
              (Module.ctx = r),
              i && GL.makeContextCurrent(_),
              (Module.useWebGL = i),
              Browser.moduleContextCreatedCallbacks.forEach(function (e) {
                e();
              }),
              Browser.init()),
            r)
          : null;
      },
      destroyContext: function (e, i, n) {},
      fullscreenHandlersInstalled: !1,
      lockPointer: void 0,
      resizeCanvas: void 0,
      requestFullscreen: function (e, i, n) {
        function t() {
          Browser.isFullscreen = !1;
          var e = r.parentNode;
          (document["fullscreenElement"] ||
            document["mozFullScreenElement"] ||
            document["msFullscreenElement"] ||
            document["webkitFullscreenElement"] ||
            document["webkitCurrentFullScreenElement"]) === e
            ? ((r.exitFullscreen =
                document["exitFullscreen"] ||
                document["cancelFullScreen"] ||
                document["mozCancelFullScreen"] ||
                document["msExitFullscreen"] ||
                document["webkitCancelFullScreen"] ||
                function () {}),
              (r.exitFullscreen = r.exitFullscreen.bind(document)),
              Browser.lockPointer && r.requestPointerLock(),
              (Browser.isFullscreen = !0),
              Browser.resizeCanvas && Browser.setFullscreenCanvasSize())
            : (e.parentNode.insertBefore(r, e),
              e.parentNode.removeChild(e),
              Browser.resizeCanvas && Browser.setWindowedCanvasSize()),
            Module["onFullScreen"] &&
              Module["onFullScreen"](Browser.isFullscreen),
            Module["onFullscreen"] &&
              Module["onFullscreen"](Browser.isFullscreen),
            Browser.updateCanvasDimensions(r);
        }
        var r, _;
        (Browser.lockPointer = e),
          (Browser.resizeCanvas = i),
          (Browser.vrDevice = n),
          "undefined" == typeof Browser.lockPointer &&
            (Browser.lockPointer = !0),
          "undefined" == typeof Browser.resizeCanvas &&
            (Browser.resizeCanvas = !1),
          "undefined" == typeof Browser.vrDevice && (Browser.vrDevice = null),
          (r = Module["canvas"]),
          Browser.fullscreenHandlersInstalled ||
            ((Browser.fullscreenHandlersInstalled = !0),
            document.addEventListener("fullscreenchange", t, !1),
            document.addEventListener("mozfullscreenchange", t, !1),
            document.addEventListener("webkitfullscreenchange", t, !1),
            document.addEventListener("MSFullscreenChange", t, !1)),
          (_ = document.createElement("div")),
          r.parentNode.insertBefore(_, r),
          _.appendChild(r),
          (_.requestFullscreen =
            _["requestFullscreen"] ||
            _["mozRequestFullScreen"] ||
            _["msRequestFullscreen"] ||
            (_["webkitRequestFullscreen"]
              ? function () {
                  _["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]);
                }
              : null) ||
            (_["webkitRequestFullScreen"]
              ? function () {
                  _["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]);
                }
              : null)),
          n ? _.requestFullscreen({ vrDisplay: n }) : _.requestFullscreen();
      },
      requestFullScreen: function (e, i, n) {
        return (
          Module.printErr(
            "Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead."
          ),
          (Browser.requestFullScreen = function (e, i, n) {
            return Browser.requestFullscreen(e, i, n);
          }),
          Browser.requestFullscreen(e, i, n)
        );
      },
      nextRAF: 0,
      fakeRequestAnimationFrame: function (e) {
        var i,
          n = Date.now();
        if (0 === Browser.nextRAF) Browser.nextRAF = n + 1e3 / 60;
        else while (n + 2 >= Browser.nextRAF) Browser.nextRAF += 1e3 / 60;
        (i = Math.max(Browser.nextRAF - n, 0)), setTimeout(e, i);
      },
      requestAnimationFrame: function l(e) {
        "undefined" == typeof window
          ? Browser.fakeRequestAnimationFrame(e)
          : (window.requestAnimationFrame ||
              (window.requestAnimationFrame =
                window["requestAnimationFrame"] ||
                window["mozRequestAnimationFrame"] ||
                window["webkitRequestAnimationFrame"] ||
                window["msRequestAnimationFrame"] ||
                window["oRequestAnimationFrame"] ||
                Browser.fakeRequestAnimationFrame),
            window.requestAnimationFrame(e));
      },
      safeCallback: function (e) {
        return function () {
          return ABORT ? void 0 : e.apply(null, arguments);
        };
      },
      allowAsyncCallbacks: !0,
      queuedAsyncCallbacks: [],
      pauseAsyncCallbacks: function () {
        Browser.allowAsyncCallbacks = !1;
      },
      resumeAsyncCallbacks: function () {
        if (
          ((Browser.allowAsyncCallbacks = !0),
          Browser.queuedAsyncCallbacks.length > 0)
        ) {
          var e = Browser.queuedAsyncCallbacks;
          (Browser.queuedAsyncCallbacks = []),
            e.forEach(function (e) {
              e();
            });
        }
      },
      safeRequestAnimationFrame: function (e) {
        return Browser.requestAnimationFrame(function () {
          ABORT ||
            (Browser.allowAsyncCallbacks
              ? e()
              : Browser.queuedAsyncCallbacks.push(e));
        });
      },
      safeSetTimeout: function (e, i) {
        return (
          (Module["noExitRuntime"] = !0),
          setTimeout(function () {
            ABORT ||
              (Browser.allowAsyncCallbacks
                ? e()
                : Browser.queuedAsyncCallbacks.push(e));
          }, i)
        );
      },
      safeSetInterval: function (e, i) {
        return (
          (Module["noExitRuntime"] = !0),
          setInterval(function () {
            ABORT || (Browser.allowAsyncCallbacks && e());
          }, i)
        );
      },
      getMimetype: function (e) {
        return {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          bmp: "image/bmp",
          ogg: "audio/ogg",
          wav: "audio/wav",
          mp3: "audio/mpeg",
        }[e.substr(e.lastIndexOf(".") + 1)];
      },
      getUserMedia: function (e) {
        window.getUserMedia ||
          (window.getUserMedia =
            navigator["getUserMedia"] || navigator["mozGetUserMedia"]),
          window.getUserMedia(e);
      },
      getMovementX: function (e) {
        return e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || 0;
      },
      getMovementY: function (e) {
        return e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || 0;
      },
      getMouseWheelDelta: function (e) {
        var i = 0;
        switch (e.type) {
          case "DOMMouseScroll":
            i = e.detail;
            break;
          case "mousewheel":
            i = e.wheelDelta;
            break;
          case "wheel":
            i = e["deltaY"];
            break;
          default:
            throw "unrecognized mouse wheel event: " + e.type;
        }
        return i;
      },
      mouseX: 0,
      mouseY: 0,
      mouseMovementX: 0,
      mouseMovementY: 0,
      touches: {},
      lastTouches: {},
      calculateMouseEvent: function (e) {
        var i, n, t, r, _, o, l, u, a, s, c, f;
        if (Browser.pointerLock)
          "mousemove" != e.type && "mozMovementX" in e
            ? (Browser.mouseMovementX = Browser.mouseMovementY = 0)
            : ((Browser.mouseMovementX = Browser.getMovementX(e)),
              (Browser.mouseMovementY = Browser.getMovementY(e))),
            "undefined" != typeof SDL
              ? ((Browser.mouseX = SDL.mouseX + Browser.mouseMovementX),
                (Browser.mouseY = SDL.mouseY + Browser.mouseMovementY))
              : ((Browser.mouseX += Browser.mouseMovementX),
                (Browser.mouseY += Browser.mouseMovementY));
        else {
          if (
            ((i = Module["canvas"].getBoundingClientRect()),
            (n = Module["canvas"].width),
            (t = Module["canvas"].height),
            (r =
              "undefined" != typeof window.scrollX
                ? window.scrollX
                : window.pageXOffset),
            (_ =
              "undefined" != typeof window.scrollY
                ? window.scrollY
                : window.pageYOffset),
            "touchstart" === e.type ||
              "touchend" === e.type ||
              "touchmove" === e.type)
          ) {
            if (((o = e.touch), void 0 === o)) return;
            return (
              (l = o.pageX - (r + i.left)),
              (u = o.pageY - (_ + i.top)),
              (l *= n / i.width),
              (u *= t / i.height),
              (a = { x: l, y: u }),
              "touchstart" === e.type
                ? ((Browser.lastTouches[o.identifier] = a),
                  (Browser.touches[o.identifier] = a))
                : ("touchend" === e.type || "touchmove" === e.type) &&
                  ((s = Browser.touches[o.identifier]),
                  s || (s = a),
                  (Browser.lastTouches[o.identifier] = s),
                  (Browser.touches[o.identifier] = a)),
              void 0
            );
          }
          (c = e.pageX - (r + i.left)),
            (f = e.pageY - (_ + i.top)),
            (c *= n / i.width),
            (f *= t / i.height),
            (Browser.mouseMovementX = c - Browser.mouseX),
            (Browser.mouseMovementY = f - Browser.mouseY),
            (Browser.mouseX = c),
            (Browser.mouseY = f);
        }
      },
      asyncLoad: function (e, i, n, t) {
        var r = t ? "" : getUniqueRunDependency("al " + e);
        Module["readAsync"](
          e,
          function (n) {
            assert(n, 'Loading data file "' + e + '" failed (no arrayBuffer).'),
              i(new Uint8Array(n)),
              r && removeRunDependency(r);
          },
          function (i) {
            if (!n) throw 'Loading data file "' + e + '" failed.';
            n();
          }
        ),
          r && addRunDependency(r);
      },
      resizeListeners: [],
      updateResizeListeners: function () {
        var e = Module["canvas"];
        Browser.resizeListeners.forEach(function (i) {
          i(e.width, e.height);
        });
      },
      setCanvasSize: function (e, i, n) {
        var t = Module["canvas"];
        Browser.updateCanvasDimensions(t, e, i),
          n || Browser.updateResizeListeners();
      },
      windowedWidth: 0,
      windowedHeight: 0,
      setFullscreenCanvasSize: function () {
        if ("undefined" != typeof SDL) {
          var e = HEAPU32[SDL.screen >> 2];
          (e = 8388608 | e), (HEAP32[SDL.screen >> 2] = e);
        }
        Browser.updateResizeListeners();
      },
      setWindowedCanvasSize: function () {
        if ("undefined" != typeof SDL) {
          var e = HEAPU32[SDL.screen >> 2];
          (e &= ~8388608), (HEAP32[SDL.screen >> 2] = e);
        }
        Browser.updateResizeListeners();
      },
      updateCanvasDimensions: function (e, i, n) {
        var t, r, _;
        i && n
          ? ((e.widthNative = i), (e.heightNative = n))
          : ((i = e.widthNative), (n = e.heightNative)),
          (t = i),
          (r = n),
          Module["forcedAspectRatio"] &&
            Module["forcedAspectRatio"] > 0 &&
            (t / r < Module["forcedAspectRatio"]
              ? (t = Math.round(r * Module["forcedAspectRatio"]))
              : (r = Math.round(t / Module["forcedAspectRatio"]))),
          (document["fullscreenElement"] ||
            document["mozFullScreenElement"] ||
            document["msFullscreenElement"] ||
            document["webkitFullscreenElement"] ||
            document["webkitCurrentFullScreenElement"]) === e.parentNode &&
            "undefined" != typeof screen &&
            ((_ = Math.min(screen.width / t, screen.height / r)),
            (t = Math.round(t * _)),
            (r = Math.round(r * _))),
          Browser.resizeCanvas
            ? (e.width != t && (e.width = t),
              e.height != r && (e.height = r),
              "undefined" != typeof e.style &&
                (e.style.removeProperty("width"),
                e.style.removeProperty("height")))
            : (e.width != i && (e.width = i),
              e.height != n && (e.height = n),
              "undefined" != typeof e.style &&
                (t != i || r != n
                  ? (e.style.setProperty("width", t + "px", "important"),
                    e.style.setProperty("height", r + "px", "important"))
                  : (e.style.removeProperty("width"),
                    e.style.removeProperty("height"))));
      },
      wgetRequests: {},
      nextWgetRequestHandle: 0,
      getNextWgetRequestHandle: function () {
        var e = Browser.nextWgetRequestHandle;
        return Browser.nextWgetRequestHandle++, e;
      },
    }),
    (_environ = STATICTOP),
    (STATICTOP += 16),
    (ENV = {}),
    (SDL = {
      defaults: {
        width: 320,
        height: 200,
        copyOnLock: !0,
        discardOnLock: !1,
        opaqueFrontBuffer: !0,
      },
      version: null,
      surfaces: {},
      canvasPool: [],
      events: [],
      fonts: [null],
      audios: [null],
      rwops: [null],
      music: { audio: null, volume: 1 },
      mixerFrequency: 22050,
      mixerFormat: 32784,
      mixerNumChannels: 2,
      mixerChunkSize: 1024,
      channelMinimumNumber: 0,
      GL: !1,
      glAttributes: {
        0: 3,
        1: 3,
        2: 2,
        3: 0,
        4: 0,
        5: 1,
        6: 16,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 1,
        16: 0,
        17: 0,
        18: 0,
      },
      keyboardState: null,
      keyboardMap: {},
      canRequestFullscreen: !1,
      isRequestingFullscreen: !1,
      textInput: !1,
      startTime: null,
      initFlags: 0,
      buttonState: 0,
      modState: 0,
      DOMButtons: [0, 0, 0],
      DOMEventToSDLEvent: {},
      TOUCH_DEFAULT_ID: 0,
      eventHandler: null,
      eventHandlerContext: null,
      eventHandlerTemp: 0,
      keyCodes: {
        16: 1249,
        17: 1248,
        18: 1250,
        20: 1081,
        33: 1099,
        34: 1102,
        35: 1101,
        36: 1098,
        37: 1104,
        38: 1106,
        39: 1103,
        40: 1105,
        44: 316,
        45: 1097,
        46: 127,
        91: 1251,
        93: 1125,
        96: 1122,
        97: 1113,
        98: 1114,
        99: 1115,
        100: 1116,
        101: 1117,
        102: 1118,
        103: 1119,
        104: 1120,
        105: 1121,
        106: 1109,
        107: 1111,
        109: 1110,
        110: 1123,
        111: 1108,
        112: 1082,
        113: 1083,
        114: 1084,
        115: 1085,
        116: 1086,
        117: 1087,
        118: 1088,
        119: 1089,
        120: 1090,
        121: 1091,
        122: 1092,
        123: 1093,
        124: 1128,
        125: 1129,
        126: 1130,
        127: 1131,
        128: 1132,
        129: 1133,
        130: 1134,
        131: 1135,
        132: 1136,
        133: 1137,
        134: 1138,
        135: 1139,
        144: 1107,
        160: 94,
        161: 33,
        162: 34,
        163: 35,
        164: 36,
        165: 37,
        166: 38,
        167: 95,
        168: 40,
        169: 41,
        170: 42,
        171: 43,
        172: 124,
        173: 45,
        174: 123,
        175: 125,
        176: 126,
        181: 127,
        182: 129,
        183: 128,
        188: 44,
        190: 46,
        191: 47,
        192: 96,
        219: 91,
        220: 92,
        221: 93,
        222: 39,
        224: 1251,
      },
      scanCodes: {
        8: 42,
        9: 43,
        13: 40,
        27: 41,
        32: 44,
        35: 204,
        39: 53,
        44: 54,
        46: 55,
        47: 56,
        48: 39,
        49: 30,
        50: 31,
        51: 32,
        52: 33,
        53: 34,
        54: 35,
        55: 36,
        56: 37,
        57: 38,
        58: 203,
        59: 51,
        61: 46,
        91: 47,
        92: 49,
        93: 48,
        96: 52,
        97: 4,
        98: 5,
        99: 6,
        100: 7,
        101: 8,
        102: 9,
        103: 10,
        104: 11,
        105: 12,
        106: 13,
        107: 14,
        108: 15,
        109: 16,
        110: 17,
        111: 18,
        112: 19,
        113: 20,
        114: 21,
        115: 22,
        116: 23,
        117: 24,
        118: 25,
        119: 26,
        120: 27,
        121: 28,
        122: 29,
        127: 76,
        305: 224,
        308: 226,
        316: 70,
      },
      loadRect: function (e) {
        return {
          x: HEAP32[(e + 0) >> 2],
          y: HEAP32[(e + 4) >> 2],
          w: HEAP32[(e + 8) >> 2],
          h: HEAP32[(e + 12) >> 2],
        };
      },
      updateRect: function (e, i) {
        (HEAP32[e >> 2] = i.x),
          (HEAP32[(e + 4) >> 2] = i.y),
          (HEAP32[(e + 8) >> 2] = i.w),
          (HEAP32[(e + 12) >> 2] = i.h);
      },
      intersectionOfRects: function (e, i) {
        var n = Math.max(e.x, i.x),
          t = Math.max(e.y, i.y),
          r = Math.min(e.x + e.w, i.x + i.w),
          _ = Math.min(e.y + e.h, i.y + i.h);
        return { x: n, y: t, w: Math.max(n, r) - n, h: Math.max(t, _) - t };
      },
      checkPixelFormat: function (e) {},
      loadColorToCSSRGB: function (e) {
        var i = HEAP32[e >> 2];
        return (
          "rgb(" +
          (255 & i) +
          "," +
          ((i >> 8) & 255) +
          "," +
          ((i >> 16) & 255) +
          ")"
        );
      },
      loadColorToCSSRGBA: function (e) {
        var i = HEAP32[e >> 2];
        return (
          "rgba(" +
          (255 & i) +
          "," +
          ((i >> 8) & 255) +
          "," +
          ((i >> 16) & 255) +
          "," +
          ((i >> 24) & 255) / 255 +
          ")"
        );
      },
      translateColorToCSSRGBA: function (e) {
        return (
          "rgba(" +
          (255 & e) +
          "," +
          ((e >> 8) & 255) +
          "," +
          ((e >> 16) & 255) +
          "," +
          (e >>> 24) / 255 +
          ")"
        );
      },
      translateRGBAToCSSRGBA: function (e, i, n, t) {
        return (
          "rgba(" +
          (255 & e) +
          "," +
          (255 & i) +
          "," +
          (255 & n) +
          "," +
          (255 & t) / 255 +
          ")"
        );
      },
      translateRGBAToColor: function (e, i, n, t) {
        return e | (i << 8) | (n << 16) | (t << 24);
      },
      makeSurface: function (e, i, n, t, r, _, o, l, u) {
        var a, s, c, f, d, p, m, y, g, v;
        return (
          (n = n || 0),
          (a = 1 & n),
          (s = 2097152 & n),
          (c = 67108864 & n),
          (f = _malloc(60)),
          (d = _malloc(44)),
          (p = s ? 1 : 4),
          (m = 0),
          a || c || (m = _malloc(e * i * 4)),
          (HEAP32[f >> 2] = n),
          (HEAP32[(f + 4) >> 2] = d),
          (HEAP32[(f + 8) >> 2] = e),
          (HEAP32[(f + 12) >> 2] = i),
          (HEAP32[(f + 16) >> 2] = e * p),
          (HEAP32[(f + 20) >> 2] = m),
          (HEAP32[(f + 36) >> 2] = 0),
          (HEAP32[(f + 40) >> 2] = 0),
          (HEAP32[(f + 44) >> 2] = Module["canvas"].width),
          (HEAP32[(f + 48) >> 2] = Module["canvas"].height),
          (HEAP32[(f + 56) >> 2] = 1),
          (HEAP32[d >> 2] = -2042224636),
          (HEAP32[(d + 4) >> 2] = 0),
          (HEAP8[(d + 8) >> 0] = 8 * p),
          (HEAP8[(d + 9) >> 0] = p),
          (HEAP32[(d + 12) >> 2] = _ || 255),
          (HEAP32[(d + 16) >> 2] = o || 65280),
          (HEAP32[(d + 20) >> 2] = l || 16711680),
          (HEAP32[(d + 24) >> 2] = u || 4278190080),
          (SDL.GL = SDL.GL || c),
          t
            ? (y = Module["canvas"])
            : ((y =
                SDL.canvasPool.length > 0
                  ? SDL.canvasPool.pop()
                  : document.createElement("canvas")),
              (y.width = e),
              (y.height = i)),
          (g = {
            antialias: 0 != SDL.glAttributes[13] && SDL.glAttributes[14] > 1,
            depth: SDL.glAttributes[6] > 0,
            stencil: SDL.glAttributes[7] > 0,
            alpha: SDL.glAttributes[3] > 0,
          }),
          (v = Browser.createContext(y, c, t, g)),
          (SDL.surfaces[f] = {
            width: e,
            height: i,
            canvas: y,
            ctx: v,
            surf: f,
            buffer: m,
            pixelFormat: d,
            alpha: 255,
            flags: n,
            locked: 0,
            usePageCanvas: t,
            source: r,
            isFlagSet: function (e) {
              return n & e;
            },
          }),
          f
        );
      },
      copyIndexedColorData: function (e, i, n, t, r) {
        var _, o, l, u, a, s, c, f, d, p, m, y;
        if (e.colors)
          for (
            _ = Module["canvas"].width,
              o = Module["canvas"].height,
              l = i || 0,
              u = n || 0,
              a = (t || _ - l) + l,
              s = (r || o - u) + u,
              c = e.buffer,
              e.image.data32 ||
                (e.image.data32 = new Uint32Array(e.image.data.buffer)),
              f = e.image.data32,
              d = e.colors32,
              p = u;
            s > p;
            ++p
          )
            for (m = p * _, y = l; a > y; ++y)
              f[m + y] = d[HEAPU8[(c + m + y) >> 0]];
      },
      freeSurface: function (e) {
        var i,
          n = e + 56,
          t = HEAP32[n >> 2];
        return t > 1
          ? ((HEAP32[n >> 2] = t - 1), void 0)
          : ((i = SDL.surfaces[e]),
            !i.usePageCanvas && i.canvas && SDL.canvasPool.push(i.canvas),
            i.buffer && _free(i.buffer),
            _free(i.pixelFormat),
            _free(e),
            (SDL.surfaces[e] = null),
            e === SDL.screen && (SDL.screen = null),
            void 0);
      },
      blitSurface__deps: ["SDL_LockSurface"],
      blitSurface: function (e, i, n, t, r) {
        var _,
          o,
          l,
          u,
          a,
          s,
          c,
          f = SDL.surfaces[e],
          d = SDL.surfaces[n];
        return (
          (_ = i ? SDL.loadRect(i) : { x: 0, y: 0, w: f.width, h: f.height }),
          (o = t ? SDL.loadRect(t) : { x: 0, y: 0, w: f.width, h: f.height }),
          d.clipRect &&
            ((l = r && 0 !== _.w ? _.w / o.w : 1),
            (u = r && 0 !== _.h ? _.h / o.h : 1),
            (o = SDL.intersectionOfRects(d.clipRect, o)),
            (_.w = o.w * l),
            (_.h = o.h * u),
            t && SDL.updateRect(t, o)),
          r ? ((a = o.w), (s = o.h)) : ((a = _.w), (s = _.h)),
          0 === _.w || 0 === _.h || 0 === a || 0 === s
            ? 0
            : ((c = d.ctx.globalAlpha),
              (d.ctx.globalAlpha = f.alpha / 255),
              d.ctx.drawImage(f.canvas, _.x, _.y, _.w, _.h, o.x, o.y, a, s),
              (d.ctx.globalAlpha = c),
              n != SDL.screen &&
                (warnOnce(
                  "WARNING: copying canvas data to memory for compatibility"
                ),
                _SDL_LockSurface(n),
                d.locked--),
              0)
        );
      },
      downFingers: {},
      savedKeydown: null,
      receiveEvent: function (e) {
        function i() {
          for (var e in SDL.keyboardMap)
            SDL.events.push({ type: "keyup", keyCode: SDL.keyboardMap[e] });
        }
        var n, t, r, _, o, l, u, a;
        switch (e.type) {
          case "touchstart":
          case "touchmove":
            if ((e.preventDefault(), (n = []), "touchstart" === e.type))
              for (t = 0; t < e.touches.length; t++)
                (r = e.touches[t]),
                  1 != SDL.downFingers[r.identifier] &&
                    ((SDL.downFingers[r.identifier] = !0), n.push(r));
            else n = e.touches;
            if (((_ = n[0]), _)) {
              switch (
                ("touchstart" == e.type && (SDL.DOMButtons[0] = 1), e.type)
              ) {
                case "touchstart":
                  o = "mousedown";
                  break;
                case "touchmove":
                  o = "mousemove";
              }
              (l = { type: o, button: 0, pageX: _.clientX, pageY: _.clientY }),
                SDL.events.push(l);
            }
            for (t = 0; t < n.length; t++)
              (r = n[t]), SDL.events.push({ type: e.type, touch: r });
            break;
          case "touchend":
            for (e.preventDefault(), t = 0; t < e.changedTouches.length; t++)
              (r = e.changedTouches[t]),
                SDL.downFingers[r.identifier] === !0 &&
                  delete SDL.downFingers[r.identifier];
            for (
              l = {
                type: "mouseup",
                button: 0,
                pageX: e.changedTouches[0].clientX,
                pageY: e.changedTouches[0].clientY,
              },
                SDL.DOMButtons[0] = 0,
                SDL.events.push(l),
                t = 0;
              t < e.changedTouches.length;
              t++
            )
              (r = e.changedTouches[t]),
                SDL.events.push({ type: "touchend", touch: r });
            break;
          case "DOMMouseScroll":
          case "mousewheel":
          case "wheel":
            (u = -Browser.getMouseWheelDelta(e)),
              (u = 0 == u ? 0 : u > 0 ? Math.max(u, 1) : Math.min(u, -1)),
              (a = u > 0 ? 3 : 4),
              SDL.events.push({
                type: "mousedown",
                button: a,
                pageX: e.pageX,
                pageY: e.pageY,
              }),
              SDL.events.push({
                type: "mouseup",
                button: a,
                pageX: e.pageX,
                pageY: e.pageY,
              }),
              SDL.events.push({ type: "wheel", deltaX: 0, deltaY: u }),
              e.preventDefault();
            break;
          case "mousemove":
            if (
              (1 === SDL.DOMButtons[0] &&
                SDL.events.push({
                  type: "touchmove",
                  touch: {
                    identifier: 0,
                    deviceID: -1,
                    pageX: e.pageX,
                    pageY: e.pageY,
                  },
                }),
              Browser.pointerLock &&
                ("mozMovementX" in e &&
                  ((e["movementX"] = e["mozMovementX"]),
                  (e["movementY"] = e["mozMovementY"])),
                0 == e["movementX"] && 0 == e["movementY"]))
            )
              return e.preventDefault(), void 0;
          case "keydown":
          case "keyup":
          case "keypress":
          case "mousedown":
          case "mouseup":
            if (
              (("keydown" !== e.type ||
                (!SDL.unicode && !SDL.textInput) ||
                8 === e.keyCode ||
                9 === e.keyCode) &&
                e.preventDefault(),
              "mousedown" == e.type)
            )
              (SDL.DOMButtons[e.button] = 1),
                SDL.events.push({
                  type: "touchstart",
                  touch: {
                    identifier: 0,
                    deviceID: -1,
                    pageX: e.pageX,
                    pageY: e.pageY,
                  },
                });
            else if ("mouseup" == e.type) {
              if (!SDL.DOMButtons[e.button]) return;
              SDL.events.push({
                type: "touchend",
                touch: {
                  identifier: 0,
                  deviceID: -1,
                  pageX: e.pageX,
                  pageY: e.pageY,
                },
              }),
                (SDL.DOMButtons[e.button] = 0);
            }
            "keydown" === e.type || "mousedown" === e.type
              ? (SDL.canRequestFullscreen = !0)
              : ("keyup" === e.type || "mouseup" === e.type) &&
                (SDL.isRequestingFullscreen &&
                  (Module["requestFullscreen"](!0, !0),
                  (SDL.isRequestingFullscreen = !1)),
                (SDL.canRequestFullscreen = !1)),
              "keypress" === e.type && SDL.savedKeydown
                ? ((SDL.savedKeydown.keypressCharCode = e.charCode),
                  (SDL.savedKeydown = null))
                : "keydown" === e.type && (SDL.savedKeydown = e),
              ("keypress" !== e.type || SDL.textInput) && SDL.events.push(e);
            break;
          case "mouseout":
            for (t = 0; 3 > t; t++)
              SDL.DOMButtons[t] &&
                (SDL.events.push({
                  type: "mouseup",
                  button: t,
                  pageX: e.pageX,
                  pageY: e.pageY,
                }),
                (SDL.DOMButtons[t] = 0));
            e.preventDefault();
            break;
          case "focus":
            SDL.events.push(e), e.preventDefault();
            break;
          case "blur":
            SDL.events.push(e), i(), e.preventDefault();
            break;
          case "visibilitychange":
            SDL.events.push({
              type: "visibilitychange",
              visible: !document.hidden,
            }),
              i(),
              e.preventDefault();
            break;
          case "unload":
            return (
              Browser.mainLoop.runner &&
                (SDL.events.push(e), Browser.mainLoop.runner()),
              void 0
            );
          case "resize":
            SDL.events.push(e), e.preventDefault && e.preventDefault();
        }
        SDL.events.length >= 1e4 &&
          (Module.printErr("SDL event queue full, dropping events"),
          (SDL.events = SDL.events.slice(0, 1e4))),
          SDL.flushEventsToHandler();
      },
      lookupKeyCodeForEvent: function (e) {
        var i = e.keyCode;
        return (
          i >= 65 && 90 >= i
            ? (i += 32)
            : ((i = SDL.keyCodes[e.keyCode] || e.keyCode),
              e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT &&
                i >= (224 | (1 << 10)) &&
                (227 | (1 << 10)) >= i &&
                (i += 4)),
          i
        );
      },
      handleEvent: function (e) {
        var i, n;
        if (!e.handled)
          switch (((e.handled = !0), e.type)) {
            case "touchstart":
            case "touchend":
            case "touchmove":
              Browser.calculateMouseEvent(e);
              break;
            case "keydown":
            case "keyup":
              (i = "keydown" === e.type),
                (n = SDL.lookupKeyCodeForEvent(e)),
                (HEAP8[(SDL.keyboardState + n) >> 0] = i),
                (SDL.modState =
                  (HEAP8[(SDL.keyboardState + 1248) >> 0] ? 64 : 0) |
                  (HEAP8[(SDL.keyboardState + 1249) >> 0] ? 1 : 0) |
                  (HEAP8[(SDL.keyboardState + 1250) >> 0] ? 256 : 0) |
                  (HEAP8[(SDL.keyboardState + 1252) >> 0] ? 128 : 0) |
                  (HEAP8[(SDL.keyboardState + 1253) >> 0] ? 2 : 0) |
                  (HEAP8[(SDL.keyboardState + 1254) >> 0] ? 512 : 0)),
                i
                  ? (SDL.keyboardMap[n] = e.keyCode)
                  : delete SDL.keyboardMap[n];
              break;
            case "mousedown":
            case "mouseup":
              "mousedown" == e.type
                ? (SDL.buttonState |= 1 << e.button)
                : "mouseup" == e.type && (SDL.buttonState &= ~(1 << e.button));
            case "mousemove":
              Browser.calculateMouseEvent(e);
          }
      },
      flushEventsToHandler: function () {
        if (SDL.eventHandler)
          while (SDL.pollEvent(SDL.eventHandlerTemp))
            Module["dynCall_iii"](
              SDL.eventHandler,
              SDL.eventHandlerContext,
              SDL.eventHandlerTemp
            );
      },
      pollEvent: function (e) {
        if (
          (512 & SDL.initFlags &&
            SDL.joystickEventState &&
            SDL.queryJoysticks(),
          e)
        ) {
          while (SDL.events.length > 0)
            if (SDL.makeCEvent(SDL.events.shift(), e) !== !1) return 1;
          return 0;
        }
        return SDL.events.length > 0;
      },
      makeCEvent: function (e, i) {
        var n, t, r, _, o, l, u, a, s, c, f, d, p, m, y, g, v, L, S, E;
        if ("number" == typeof e) return _memcpy(i, e, 28), _free(e), void 0;
        switch ((SDL.handleEvent(e), e.type)) {
          case "keydown":
          case "keyup":
            (n = "keydown" === e.type),
              (t = SDL.lookupKeyCodeForEvent(e)),
              (r = t >= 1024 ? t - 1024 : SDL.scanCodes[t] || t),
              (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP8[(i + 8) >> 0] = n ? 1 : 0),
              (HEAP8[(i + 9) >> 0] = 0),
              (HEAP32[(i + 12) >> 2] = r),
              (HEAP32[(i + 16) >> 2] = t),
              (HEAP16[(i + 20) >> 1] = SDL.modState),
              (HEAP32[(i + 24) >> 2] = e.keypressCharCode || t);
            break;
          case "keypress":
            for (
              HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type],
                _ = intArrayFromString(String.fromCharCode(e.charCode)),
                o = 0;
              o < _.length;
              ++o
            )
              HEAP8[(i + (8 + o)) >> 0] = _[o];
            break;
          case "mousedown":
          case "mouseup":
          case "mousemove":
            "mousemove" != e.type
              ? ((n = "mousedown" === e.type),
                (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
                (HEAP32[(i + 4) >> 2] = 0),
                (HEAP32[(i + 8) >> 2] = 0),
                (HEAP32[(i + 12) >> 2] = 0),
                (HEAP8[(i + 16) >> 0] = e.button + 1),
                (HEAP8[(i + 17) >> 0] = n ? 1 : 0),
                (HEAP32[(i + 20) >> 2] = Browser.mouseX),
                (HEAP32[(i + 24) >> 2] = Browser.mouseY))
              : ((HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
                (HEAP32[(i + 4) >> 2] = 0),
                (HEAP32[(i + 8) >> 2] = 0),
                (HEAP32[(i + 12) >> 2] = 0),
                (HEAP32[(i + 16) >> 2] = SDL.buttonState),
                (HEAP32[(i + 20) >> 2] = Browser.mouseX),
                (HEAP32[(i + 24) >> 2] = Browser.mouseY),
                (HEAP32[(i + 28) >> 2] = Browser.mouseMovementX),
                (HEAP32[(i + 32) >> 2] = Browser.mouseMovementY));
            break;
          case "wheel":
            (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP32[(i + 16) >> 2] = e.deltaX),
              (HEAP32[(i + 20) >> 2] = e.deltaY);
            break;
          case "touchstart":
          case "touchend":
          case "touchmove":
            if (((l = e.touch), !Browser.touches[l.identifier])) break;
            if (
              ((u = Module["canvas"].width),
              (a = Module["canvas"].height),
              (s = Browser.touches[l.identifier].x / u),
              (c = Browser.touches[l.identifier].y / a),
              (f = Browser.lastTouches[l.identifier].x / u),
              (d = Browser.lastTouches[l.identifier].y / a),
              (p = s - f),
              (m = c - d),
              void 0 === l["deviceID"] && (l.deviceID = SDL.TOUCH_DEFAULT_ID),
              0 === p && 0 === m && "touchmove" === e.type)
            )
              return !1;
            (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP32[(i + 4) >> 2] = _SDL_GetTicks()),
              (tempI64 = [
                l.deviceID >>> 0,
                ((tempDouble = l.deviceID),
                +Math_abs(tempDouble) >= 1
                  ? tempDouble > 0
                    ? (0 |
                        Math_min(
                          +Math_floor(tempDouble / 4294967296),
                          4294967295
                        )) >>>
                      0
                    : ~~+Math_ceil(
                        (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                      ) >>> 0
                  : 0),
              ]),
              (HEAP32[(i + 8) >> 2] = tempI64[0]),
              (HEAP32[(i + 12) >> 2] = tempI64[1]),
              (tempI64 = [
                l.identifier >>> 0,
                ((tempDouble = l.identifier),
                +Math_abs(tempDouble) >= 1
                  ? tempDouble > 0
                    ? (0 |
                        Math_min(
                          +Math_floor(tempDouble / 4294967296),
                          4294967295
                        )) >>>
                      0
                    : ~~+Math_ceil(
                        (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
                      ) >>> 0
                  : 0),
              ]),
              (HEAP32[(i + 16) >> 2] = tempI64[0]),
              (HEAP32[(i + 20) >> 2] = tempI64[1]),
              (HEAPF32[(i + 24) >> 2] = s),
              (HEAPF32[(i + 28) >> 2] = c),
              (HEAPF32[(i + 32) >> 2] = p),
              (HEAPF32[(i + 36) >> 2] = m),
              void 0 !== l.force
                ? (HEAPF32[(i + 40) >> 2] = l.force)
                : (HEAPF32[(i + 40) >> 2] = "touchend" == e.type ? 0 : 1);
            break;
          case "unload":
            HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type];
            break;
          case "resize":
            (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP32[(i + 4) >> 2] = e.w),
              (HEAP32[(i + 8) >> 2] = e.h);
            break;
          case "joystick_button_up":
          case "joystick_button_down":
            (y = "joystick_button_up" === e.type ? 0 : 1),
              (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP8[(i + 4) >> 0] = e.index),
              (HEAP8[(i + 5) >> 0] = e.button),
              (HEAP8[(i + 6) >> 0] = y);
            break;
          case "joystick_axis_motion":
            (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP8[(i + 4) >> 0] = e.index),
              (HEAP8[(i + 5) >> 0] = e.axis),
              (HEAP32[(i + 8) >> 2] = SDL.joystickAxisValueConversion(e.value));
            break;
          case "focus":
            (g = 12),
              (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP32[(i + 4) >> 2] = 0),
              (HEAP8[(i + 8) >> 0] = g);
            break;
          case "blur":
            (v = 13),
              (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP32[(i + 4) >> 2] = 0),
              (HEAP8[(i + 8) >> 0] = v);
            break;
          case "visibilitychange":
            (L = 1),
              (S = 2),
              (E = e.visible ? L : S),
              (HEAP32[i >> 2] = SDL.DOMEventToSDLEvent[e.type]),
              (HEAP32[(i + 4) >> 2] = 0),
              (HEAP8[(i + 8) >> 0] = E);
            break;
          default:
            throw "Unhandled SDL event: " + e.type;
        }
      },
      makeFontString: function (e, i) {
        return (
          "'" != i.charAt(0) && '"' != i.charAt(0) && (i = '"' + i + '"'),
          e + "px " + i + ", serif"
        );
      },
      estimateTextWidth: function (e, i) {
        var n,
          t = e.size,
          r = SDL.makeFontString(t, e.name),
          _ = SDL.ttfContext;
        return (
          _.save(),
          (_.font = r),
          (n = 0 | _.measureText(i).width),
          _.restore(),
          n
        );
      },
      allocateChannels: function (e) {
        if (!(SDL.numChannels && SDL.numChannels >= e && 0 != e)) {
          (SDL.numChannels = e), (SDL.channels = []);
          for (var i = 0; e > i; i++)
            SDL.channels[i] = { audio: null, volume: 1 };
        }
      },
      setGetVolume: function (e, i) {
        if (!e) return 0;
        var n = 128 * e.volume;
        if (
          i != -1 &&
          ((e.volume = Math.min(Math.max(i, 0), 128) / 128), e.audio)
        )
          try {
            (e.audio.volume = e.volume),
              e.audio.webAudioGainNode &&
                (e.audio.webAudioGainNode["gain"]["value"] = e.volume);
          } catch (t) {
            Module.printErr("setGetVolume failed to set audio volume: " + t);
          }
        return n;
      },
      setPannerPosition: function (e, i, n, t) {
        e &&
          e.audio &&
          e.audio.webAudioPannerNode &&
          e.audio.webAudioPannerNode["setPosition"](i, n, t);
      },
      playWebAudio: function (e) {
        if (e && !e.webAudioNode && SDL.webAudioAvailable())
          try {
            var i = e.resource.webAudio;
            if (((e.paused = !1), !i.decodedBuffer))
              return (
                void 0 === i.onDecodeComplete &&
                  abort("Cannot play back audio object that was not loaded"),
                i.onDecodeComplete.push(function () {
                  e.paused || SDL.playWebAudio(e);
                }),
                void 0
              );
            (e.webAudioNode = SDL.audioContext["createBufferSource"]()),
              (e.webAudioNode["buffer"] = i.decodedBuffer),
              (e.webAudioNode["loop"] = e.loop),
              (e.webAudioNode["onended"] = function () {
                e["onended"]();
              }),
              (e.webAudioPannerNode = SDL.audioContext["createPanner"]()),
              e.webAudioPannerNode["setPosition"](0, 0, -0.5),
              (e.webAudioPannerNode["panningModel"] = "equalpower"),
              (e.webAudioGainNode = SDL.audioContext["createGain"]()),
              (e.webAudioGainNode["gain"]["value"] = e.volume),
              e.webAudioNode["connect"](e.webAudioPannerNode),
              e.webAudioPannerNode["connect"](e.webAudioGainNode),
              e.webAudioGainNode["connect"](SDL.audioContext["destination"]),
              e.webAudioNode["start"](0, e.currentPosition),
              (e.startTime =
                SDL.audioContext["currentTime"] - e.currentPosition);
          } catch (n) {
            Module.printErr("playWebAudio failed: " + n);
          }
      },
      pauseWebAudio: function (e) {
        if (e) {
          if (e.webAudioNode)
            try {
              (e.currentPosition =
                (SDL.audioContext["currentTime"] - e.startTime) %
                e.resource.webAudio.decodedBuffer.duration),
                (e.webAudioNode["onended"] = void 0),
                e.webAudioNode.stop(0),
                (e.webAudioNode = void 0);
            } catch (i) {
              Module.printErr("pauseWebAudio failed: " + i);
            }
          e.paused = !0;
        }
      },
      openAudioContext: function () {
        SDL.audioContext ||
          ("undefined" != typeof AudioContext
            ? (SDL.audioContext = new AudioContext())
            : "undefined" != typeof webkitAudioContext &&
              (SDL.audioContext = new webkitAudioContext()));
      },
      webAudioAvailable: function () {
        return !!SDL.audioContext;
      },
      fillWebAudioBufferFromHeap: function (e, i, n) {
        var t,
          r,
          _,
          o,
          l = SDL.audio.channels;
        for (t = 0; l > t; ++t) {
          if (((r = n["getChannelData"](t)), r.length != i))
            throw (
              "Web Audio output buffer length mismatch! Destination size: " +
              r.length +
              " samples vs expected " +
              i +
              " samples!"
            );
          if (32784 == SDL.audio.format)
            for (_ = 0; i > _; ++_)
              r[_] = HEAP16[(e + 2 * (_ * l + t)) >> 1] / 32768;
          else if (8 == SDL.audio.format)
            for (_ = 0; i > _; ++_)
              (o = HEAP8[(e + (_ * l + t)) >> 0]),
                (r[_] = (o >= 0 ? o - 128 : o + 128) / 128);
        }
      },
      debugSurface: function (e) {
        var i, n, t, r;
        for (
          console.log(
            "dumping surface " + [e.surf, e.source, e.width, e.height]
          ),
            i = e.ctx.getImageData(0, 0, e.width, e.height),
            n = i.data,
            t = Math.min(e.width, e.height),
            r = 0;
          t > r;
          r++
        )
          console.log(
            "   diagonal " +
              r +
              ":" +
              [
                n[r * e.width * 4 + 4 * r + 0],
                n[r * e.width * 4 + 4 * r + 1],
                n[r * e.width * 4 + 4 * r + 2],
                n[r * e.width * 4 + 4 * r + 3],
              ]
          );
      },
      joystickEventState: 1,
      lastJoystickState: {},
      joystickNamePool: {},
      recordJoystickState: function (e, i) {
        var n,
          t = new Array(i.buttons.length);
        for (n = 0; n < i.buttons.length; n++)
          t[n] = SDL.getJoystickButtonState(i.buttons[n]);
        SDL.lastJoystickState[e] = {
          buttons: t,
          axes: i.axes.slice(0),
          timestamp: i.timestamp,
          index: i.index,
          id: i.id,
        };
      },
      getJoystickButtonState: function (e) {
        return "object" == typeof e ? e["pressed"] : e > 0;
      },
      queryJoysticks: function () {
        var e, i, n, t, r;
        for (e in SDL.lastJoystickState) {
          if (
            ((i = SDL.getGamepad(e - 1)),
            (n = SDL.lastJoystickState[e]),
            "undefined" == typeof i)
          )
            return;
          if ("number" != typeof i.timestamp || i.timestamp !== n.timestamp) {
            for (t = 0; t < i.buttons.length; t++)
              (r = SDL.getJoystickButtonState(i.buttons[t])),
                r !== n.buttons[t] &&
                  SDL.events.push({
                    type: r ? "joystick_button_down" : "joystick_button_up",
                    joystick: e,
                    index: e - 1,
                    button: t,
                  });
            for (t = 0; t < i.axes.length; t++)
              i.axes[t] !== n.axes[t] &&
                SDL.events.push({
                  type: "joystick_axis_motion",
                  joystick: e,
                  index: e - 1,
                  axis: t,
                  value: i.axes[t],
                });
            SDL.recordJoystickState(e, i);
          }
        }
      },
      joystickAxisValueConversion: function (e) {
        return (
          (e = Math.min(1, Math.max(e, -1))),
          Math.ceil(32767.5 * (e + 1) - 32768)
        );
      },
      getGamepads: function () {
        var e =
          navigator.getGamepads ||
          navigator.webkitGamepads ||
          navigator.mozGamepads ||
          navigator.gamepads ||
          navigator.webkitGetGamepads;
        return void 0 !== e ? e.apply(navigator) : [];
      },
      getGamepad: function (e) {
        var i = SDL.getGamepads();
        return i.length > e && e >= 0 ? i[e] : null;
      },
    }),
    (EXCEPTIONS = {
      last: 0,
      caught: [],
      infos: {},
      deAdjust: function (e) {
        var i, n;
        if (!e || EXCEPTIONS.infos[e]) return e;
        for (i in EXCEPTIONS.infos)
          if (((n = EXCEPTIONS.infos[i]), n.adjusted === e)) return i;
        return e;
      },
      addRef: function (e) {
        if (e) {
          var i = EXCEPTIONS.infos[e];
          i.refcount++;
        }
      },
      decRef: function (e) {
        if (e) {
          var i = EXCEPTIONS.infos[e];
          assert(i.refcount > 0),
            i.refcount--,
            0 !== i.refcount ||
              i.rethrown ||
              (i.destructor && Module["dynCall_vi"](i.destructor, e),
              delete EXCEPTIONS.infos[e],
              ___cxa_free_exception(e));
        }
      },
      clearRef: function (e) {
        if (e) {
          var i = EXCEPTIONS.infos[e];
          i.refcount = 0;
        }
      },
    }),
    (SYSCALLS = {
      DEFAULT_POLLMASK: 5,
      mappings: {},
      umask: 511,
      calculateAt: function (e, i) {
        var n, t;
        if ("/" !== i[0]) {
          if (e === -100) n = FS.cwd();
          else {
            if (((t = FS.getStream(e)), !t))
              throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            n = t.path;
          }
          i = PATH.join2(n, i);
        }
        return i;
      },
      doStat: function (e, i, n) {
        try {
          var t = e(i);
        } catch (r) {
          if (
            r &&
            r.node &&
            PATH.normalize(i) !== PATH.normalize(FS.getPath(r.node))
          )
            return -ERRNO_CODES.ENOTDIR;
          throw r;
        }
        return (
          (HEAP32[n >> 2] = t.dev),
          (HEAP32[(n + 4) >> 2] = 0),
          (HEAP32[(n + 8) >> 2] = t.ino),
          (HEAP32[(n + 12) >> 2] = t.mode),
          (HEAP32[(n + 16) >> 2] = t.nlink),
          (HEAP32[(n + 20) >> 2] = t.uid),
          (HEAP32[(n + 24) >> 2] = t.gid),
          (HEAP32[(n + 28) >> 2] = t.rdev),
          (HEAP32[(n + 32) >> 2] = 0),
          (HEAP32[(n + 36) >> 2] = t.size),
          (HEAP32[(n + 40) >> 2] = 4096),
          (HEAP32[(n + 44) >> 2] = t.blocks),
          (HEAP32[(n + 48) >> 2] = (t.atime.getTime() / 1e3) | 0),
          (HEAP32[(n + 52) >> 2] = 0),
          (HEAP32[(n + 56) >> 2] = (t.mtime.getTime() / 1e3) | 0),
          (HEAP32[(n + 60) >> 2] = 0),
          (HEAP32[(n + 64) >> 2] = (t.ctime.getTime() / 1e3) | 0),
          (HEAP32[(n + 68) >> 2] = 0),
          (HEAP32[(n + 72) >> 2] = t.ino),
          0
        );
      },
      doMsync: function (e, i, n, t) {
        var r = new Uint8Array(HEAPU8.subarray(e, e + n));
        FS.msync(i, r, 0, n, t);
      },
      doMkdir: function (e, i) {
        return (
          (e = PATH.normalize(e)),
          "/" === e[e.length - 1] && (e = e.substr(0, e.length - 1)),
          FS.mkdir(e, i, 0),
          0
        );
      },
      doMknod: function (e, i, n) {
        switch (61440 & i) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;
          default:
            return -ERRNO_CODES.EINVAL;
        }
        return FS.mknod(e, i, n), 0;
      },
      doReadlink: function (e, i, n) {
        var t, r, _;
        return 0 >= n
          ? -ERRNO_CODES.EINVAL
          : ((t = FS.readlink(e)),
            (r = Math.min(n, lengthBytesUTF8(t))),
            (_ = HEAP8[i + r]),
            stringToUTF8(t, i, n + 1),
            (HEAP8[i + r] = _),
            r);
      },
      doAccess: function (e, i) {
        var n, t, r;
        return i & ~7
          ? -ERRNO_CODES.EINVAL
          : ((t = FS.lookupPath(e, { follow: !0 })),
            (n = t.node),
            (r = ""),
            4 & i && (r += "r"),
            2 & i && (r += "w"),
            1 & i && (r += "x"),
            r && FS.nodePermissions(n, r) ? -ERRNO_CODES.EACCES : 0);
      },
      doDup: function (e, i, n) {
        var t = FS.getStream(n);
        return t && FS.close(t), FS.open(e, i, 0, n, n).fd;
      },
      doReadv: function (e, i, n, t) {
        var r,
          _,
          o,
          l,
          u = 0;
        for (r = 0; n > r; r++) {
          if (
            ((_ = HEAP32[(i + 8 * r) >> 2]),
            (o = HEAP32[(i + (8 * r + 4)) >> 2]),
            (l = FS.read(e, HEAP8, _, o, t)),
            0 > l)
          )
            return -1;
          if (((u += l), o > l)) break;
        }
        return u;
      },
      doWritev: function (e, i, n, t) {
        var r,
          _,
          o,
          l,
          u = 0;
        for (r = 0; n > r; r++) {
          if (
            ((_ = HEAP32[(i + 8 * r) >> 2]),
            (o = HEAP32[(i + (8 * r + 4)) >> 2]),
            (l = FS.write(e, HEAP8, _, o, t)),
            0 > l)
          )
            return -1;
          u += l;
        }
        return u;
      },
      varargs: 0,
      get: function (e) {
        SYSCALLS.varargs += 4;
        var i = HEAP32[(SYSCALLS.varargs - 4) >> 2];
        return i;
      },
      getStr: function () {
        var e = Pointer_stringify(SYSCALLS.get());
        return e;
      },
      getStreamFromFD: function () {
        var e = FS.getStream(SYSCALLS.get());
        if (!e) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return e;
      },
      getSocketFromFD: function () {
        var e = SOCKFS.getSocket(SYSCALLS.get());
        if (!e) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return e;
      },
      getSocketAddress: function (e) {
        var i,
          n = SYSCALLS.get(),
          t = SYSCALLS.get();
        if (e && 0 === n) return null;
        if (((i = __read_sockaddr(n, t)), i.errno))
          throw new FS.ErrnoError(i.errno);
        return (i.addr = DNS.lookup_addr(i.addr) || i.addr), i;
      },
      get64: function () {
        var e = SYSCALLS.get(),
          i = SYSCALLS.get();
        return assert(e >= 0 ? 0 === i : i === -1), e;
      },
      getZero: function () {
        assert(0 === SYSCALLS.get());
      },
    }),
    (PIPEFS = {
      BUCKET_BUFFER_SIZE: 8192,
      mount: function (e) {
        return FS.createNode(null, "/", 16384 | 511, 0);
      },
      createPipe: function () {
        var e,
          i,
          n,
          t,
          r,
          _,
          o = { buckets: [] };
        return (
          o.buckets.push({
            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
            offset: 0,
            roffset: 0,
          }),
          (e = PIPEFS.nextname()),
          (i = PIPEFS.nextname()),
          (n = FS.createNode(PIPEFS.root, e, 4096, 0)),
          (t = FS.createNode(PIPEFS.root, i, 4096, 0)),
          (n.pipe = o),
          (t.pipe = o),
          (r = FS.createStream({
            path: e,
            node: n,
            flags: FS.modeStringToFlags("r"),
            seekable: !1,
            stream_ops: PIPEFS.stream_ops,
          })),
          (n.stream = r),
          (_ = FS.createStream({
            path: i,
            node: t,
            flags: FS.modeStringToFlags("w"),
            seekable: !1,
            stream_ops: PIPEFS.stream_ops,
          })),
          (t.stream = _),
          { readable_fd: r.fd, writable_fd: _.fd }
        );
      },
      stream_ops: {
        poll: function (e) {
          var i,
            n,
            t = e.node.pipe;
          if (1 === (2097155 & e.flags)) return 256 | 4;
          if (t.buckets.length > 0)
            for (i = 0; i < t.buckets.length; i++)
              if (((n = t.buckets[i]), n.offset - n.roffset > 0)) return 64 | 1;
          return 0;
        },
        ioctl: function (e, i, n) {
          return ERRNO_CODES.EINVAL;
        },
        read: function (e, i, n, t, r) {
          var _,
            o,
            l,
            u,
            a,
            s,
            c,
            f,
            d,
            p = e.node.pipe,
            m = 0;
          for (_ = 0; _ < p.buckets.length; _++)
            (o = p.buckets[_]), (m += o.offset - o.roffset);
          if (
            (assert(i instanceof ArrayBuffer || ArrayBuffer.isView(i)),
            (l = i.subarray(n, n + t)),
            0 >= t)
          )
            return 0;
          if (0 == m) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
          for (
            u = Math.min(m, t), a = u, s = 0, _ = 0;
            _ < p.buckets.length;
            _++
          ) {
            if (((c = p.buckets[_]), (f = c.offset - c.roffset), f >= u)) {
              (d = c.buffer.subarray(c.roffset, c.offset)),
                f > u ? ((d = d.subarray(0, u)), (c.roffset += u)) : s++,
                l.set(d);
              break;
            }
            (d = c.buffer.subarray(c.roffset, c.offset)),
              l.set(d),
              (l = l.subarray(d.byteLength)),
              (u -= d.byteLength),
              s++;
          }
          return (
            s &&
              s == p.buckets.length &&
              (s--, (p.buckets[s].offset = 0), (p.buckets[s].roffset = 0)),
            p.buckets.splice(0, s),
            a
          );
        },
        write: function (e, i, n, t, r) {
          var _,
            o,
            l,
            u,
            a,
            s,
            c,
            f,
            d = e.node.pipe;
          if (
            (assert(i instanceof ArrayBuffer || ArrayBuffer.isView(i)),
            (_ = i.subarray(n, n + t)),
            (o = _.byteLength),
            0 >= o)
          )
            return 0;
          if (
            ((l = null),
            0 == d.buckets.length
              ? ((l = {
                  buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                  offset: 0,
                  roffset: 0,
                }),
                d.buckets.push(l))
              : (l = d.buckets[d.buckets.length - 1]),
            assert(l.offset <= PIPEFS.BUCKET_BUFFER_SIZE),
            (u = PIPEFS.BUCKET_BUFFER_SIZE - l.offset),
            u >= o)
          )
            return l.buffer.set(_, l.offset), (l.offset += o), o;
          for (
            u > 0 &&
              (l.buffer.set(_.subarray(0, u), l.offset),
              (l.offset += u),
              (_ = _.subarray(u, _.byteLength))),
              a = (_.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0,
              s = _.byteLength % PIPEFS.BUCKET_BUFFER_SIZE,
              c = 0;
            a > c;
            c++
          )
            (f = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: PIPEFS.BUCKET_BUFFER_SIZE,
              roffset: 0,
            }),
              d.buckets.push(f),
              f.buffer.set(_.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE)),
              (_ = _.subarray(PIPEFS.BUCKET_BUFFER_SIZE, _.byteLength));
          return (
            s > 0 &&
              ((f = {
                buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                offset: _.byteLength,
                roffset: 0,
              }),
              d.buckets.push(f),
              f.buffer.set(_)),
            o
          );
        },
        close: function (e) {
          var i = e.node.pipe;
          i.buckets = null;
        },
      },
      nextname: function () {
        return (
          PIPEFS.nextname.current || (PIPEFS.nextname.current = 0),
          "pipe[" + PIPEFS.nextname.current++ + "]"
        );
      },
    }),
    (DLFCN = {
      error: null,
      errorMsg: null,
      loadedLibs: {},
      loadedLibNames: {},
    }),
    (JSEvents = {
      keyEvent: 0,
      mouseEvent: 0,
      wheelEvent: 0,
      uiEvent: 0,
      focusEvent: 0,
      deviceOrientationEvent: 0,
      deviceMotionEvent: 0,
      fullscreenChangeEvent: 0,
      pointerlockChangeEvent: 0,
      visibilityChangeEvent: 0,
      touchEvent: 0,
      lastGamepadState: null,
      lastGamepadStateFrame: null,
      numGamepadsConnected: 0,
      previousFullscreenElement: null,
      previousScreenX: null,
      previousScreenY: null,
      removeEventListenersRegistered: !1,
      staticInit: function () {
        if ("undefined" != typeof window) {
          window.addEventListener("gamepadconnected", function () {
            ++JSEvents.numGamepadsConnected;
          }),
            window.addEventListener("gamepaddisconnected", function () {
              --JSEvents.numGamepadsConnected;
            });
          var e = navigator.getGamepads
            ? navigator.getGamepads()
            : navigator.webkitGetGamepads
            ? navigator.webkitGetGamepads()
            : null;
          e && (JSEvents.numGamepadsConnected = e.length);
        }
      },
      registerRemoveEventListeners: function () {
        JSEvents.removeEventListenersRegistered ||
          (__ATEXIT__.push(function () {
            for (var e = JSEvents.eventHandlers.length - 1; e >= 0; --e)
              JSEvents._removeHandler(e);
          }),
          (JSEvents.removeEventListenersRegistered = !0));
      },
      findEventTarget: function (e) {
        return e
          ? ("number" == typeof e && (e = Pointer_stringify(e)),
            "#window" == e
              ? window
              : "#document" == e
              ? document
              : "#screen" == e
              ? window.screen
              : "#canvas" == e
              ? Module["canvas"]
              : "string" == typeof e
              ? document.getElementById(e)
              : e)
          : window;
      },
      deferredCalls: [],
      deferCall: function (e, i, n) {
        function t(e, i) {
          if (e.length != i.length) return !1;
          for (var n in e) if (e[n] != i[n]) return !1;
          return !0;
        }
        var r, _;
        for (r in JSEvents.deferredCalls)
          if (
            ((_ = JSEvents.deferredCalls[r]),
            _.targetFunction == e && t(_.argsList, n))
          )
            return;
        JSEvents.deferredCalls.push({
          targetFunction: e,
          precedence: i,
          argsList: n,
        }),
          JSEvents.deferredCalls.sort(function (e, i) {
            return e.precedence < i.precedence;
          });
      },
      removeDeferredCalls: function (e) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i)
          JSEvents.deferredCalls[i].targetFunction == e &&
            (JSEvents.deferredCalls.splice(i, 1), --i);
      },
      canPerformEventHandlerRequests: function () {
        return (
          JSEvents.inEventHandler &&
          JSEvents.currentEventHandler.allowsDeferredCalls
        );
      },
      runDeferredCalls: function () {
        var e, i;
        if (JSEvents.canPerformEventHandlerRequests())
          for (e = 0; e < JSEvents.deferredCalls.length; ++e)
            (i = JSEvents.deferredCalls[e]),
              JSEvents.deferredCalls.splice(e, 1),
              --e,
              i.targetFunction.apply(this, i.argsList);
      },
      inEventHandler: 0,
      currentEventHandler: null,
      eventHandlers: [],
      isInternetExplorer: function () {
        return (
          navigator.userAgent.indexOf("MSIE") !== -1 ||
          navigator.appVersion.indexOf("Trident/") > 0
        );
      },
      removeAllHandlersOnTarget: function (e, i) {
        for (var n = 0; n < JSEvents.eventHandlers.length; ++n)
          JSEvents.eventHandlers[n].target != e ||
            (i && i != JSEvents.eventHandlers[n].eventTypeString) ||
            JSEvents._removeHandler(n--);
      },
      _removeHandler: function (e) {
        var i = JSEvents.eventHandlers[e];
        i.target.removeEventListener(
          i.eventTypeString,
          i.eventListenerFunc,
          i.useCapture
        ),
          JSEvents.eventHandlers.splice(e, 1);
      },
      registerOrRemoveHandler: function (e) {
        var i,
          n = function t(i) {
            ++JSEvents.inEventHandler,
              (JSEvents.currentEventHandler = e),
              JSEvents.runDeferredCalls(),
              e.handlerFunc(i),
              JSEvents.runDeferredCalls(),
              --JSEvents.inEventHandler;
          };
        if (e.callbackfunc)
          (e.eventListenerFunc = n),
            e.target.addEventListener(e.eventTypeString, n, e.useCapture),
            JSEvents.eventHandlers.push(e),
            JSEvents.registerRemoveEventListeners();
        else
          for (i = 0; i < JSEvents.eventHandlers.length; ++i)
            JSEvents.eventHandlers[i].target == e.target &&
              JSEvents.eventHandlers[i].eventTypeString == e.eventTypeString &&
              JSEvents._removeHandler(i--);
      },
      registerKeyEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.keyEvent || (JSEvents.keyEvent = _malloc(164)),
          (o = function (e) {
            var n,
              _ = e || window.event;
            stringToUTF8(_.key ? _.key : "", JSEvents.keyEvent + 0, 32),
              stringToUTF8(_.code ? _.code : "", JSEvents.keyEvent + 32, 32),
              (HEAP32[(JSEvents.keyEvent + 64) >> 2] = _.location),
              (HEAP32[(JSEvents.keyEvent + 68) >> 2] = _.ctrlKey),
              (HEAP32[(JSEvents.keyEvent + 72) >> 2] = _.shiftKey),
              (HEAP32[(JSEvents.keyEvent + 76) >> 2] = _.altKey),
              (HEAP32[(JSEvents.keyEvent + 80) >> 2] = _.metaKey),
              (HEAP32[(JSEvents.keyEvent + 84) >> 2] = _.repeat),
              stringToUTF8(
                _.locale ? _.locale : "",
                JSEvents.keyEvent + 88,
                32
              ),
              stringToUTF8(
                _["char"] ? _["char"] : "",
                JSEvents.keyEvent + 120,
                32
              ),
              (HEAP32[(JSEvents.keyEvent + 152) >> 2] = _.charCode),
              (HEAP32[(JSEvents.keyEvent + 156) >> 2] = _.keyCode),
              (HEAP32[(JSEvents.keyEvent + 160) >> 2] = _.which),
              (n = Module["dynCall_iiii"](t, r, JSEvents.keyEvent, i)),
              n && _.preventDefault();
          }),
          (l = {
            target: JSEvents.findEventTarget(e),
            allowsDeferredCalls: JSEvents.isInternetExplorer() ? !1 : !0,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      getBoundingClientRectOrZeros: function (e) {
        return e.getBoundingClientRect
          ? e.getBoundingClientRect()
          : { left: 0, top: 0 };
      },
      fillMouseEventData: function (e, i, n) {
        var t;
        (HEAPF64[e >> 3] = JSEvents.tick()),
          (HEAP32[(e + 8) >> 2] = i.screenX),
          (HEAP32[(e + 12) >> 2] = i.screenY),
          (HEAP32[(e + 16) >> 2] = i.clientX),
          (HEAP32[(e + 20) >> 2] = i.clientY),
          (HEAP32[(e + 24) >> 2] = i.ctrlKey),
          (HEAP32[(e + 28) >> 2] = i.shiftKey),
          (HEAP32[(e + 32) >> 2] = i.altKey),
          (HEAP32[(e + 36) >> 2] = i.metaKey),
          (HEAP16[(e + 40) >> 1] = i.button),
          (HEAP16[(e + 42) >> 1] = i.buttons),
          (HEAP32[(e + 44) >> 2] =
            i["movementX"] ||
            i["mozMovementX"] ||
            i["webkitMovementX"] ||
            i.screenX - JSEvents.previousScreenX),
          (HEAP32[(e + 48) >> 2] =
            i["movementY"] ||
            i["mozMovementY"] ||
            i["webkitMovementY"] ||
            i.screenY - JSEvents.previousScreenY),
          Module["canvas"]
            ? ((t = Module["canvas"].getBoundingClientRect()),
              (HEAP32[(e + 60) >> 2] = i.clientX - t.left),
              (HEAP32[(e + 64) >> 2] = i.clientY - t.top))
            : ((HEAP32[(e + 60) >> 2] = 0), (HEAP32[(e + 64) >> 2] = 0)),
          n
            ? ((t = JSEvents.getBoundingClientRectOrZeros(n)),
              (HEAP32[(e + 52) >> 2] = i.clientX - t.left),
              (HEAP32[(e + 56) >> 2] = i.clientY - t.top))
            : ((HEAP32[(e + 52) >> 2] = 0), (HEAP32[(e + 56) >> 2] = 0)),
          "wheel" !== i.type &&
            "mousewheel" !== i.type &&
            ((JSEvents.previousScreenX = i.screenX),
            (JSEvents.previousScreenY = i.screenY));
      },
      registerMouseEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.mouseEvent || (JSEvents.mouseEvent = _malloc(72)),
          (e = JSEvents.findEventTarget(e)),
          (o = function (n) {
            var _,
              o = n || window.event;
            JSEvents.fillMouseEventData(JSEvents.mouseEvent, o, e),
              (_ = Module["dynCall_iiii"](t, r, JSEvents.mouseEvent, i)),
              _ && o.preventDefault();
          }),
          (l = {
            target: e,
            allowsDeferredCalls:
              "mousemove" != _ && "mouseenter" != _ && "mouseleave" != _,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.isInternetExplorer() &&
            "mousedown" == _ &&
            (l.allowsDeferredCalls = !1),
          JSEvents.registerOrRemoveHandler(l);
      },
      registerWheelEventCallback: function (e, i, n, t, r, _) {
        var o, l, u;
        JSEvents.wheelEvent || (JSEvents.wheelEvent = _malloc(104)),
          (e = JSEvents.findEventTarget(e)),
          (o = function (n) {
            var _,
              o = n || window.event;
            JSEvents.fillMouseEventData(JSEvents.wheelEvent, o, e),
              (HEAPF64[(JSEvents.wheelEvent + 72) >> 3] = o["deltaX"]),
              (HEAPF64[(JSEvents.wheelEvent + 80) >> 3] = o["deltaY"]),
              (HEAPF64[(JSEvents.wheelEvent + 88) >> 3] = o["deltaZ"]),
              (HEAP32[(JSEvents.wheelEvent + 96) >> 2] = o["deltaMode"]),
              (_ = Module["dynCall_iiii"](t, r, JSEvents.wheelEvent, i)),
              _ && o.preventDefault();
          }),
          (l = function (n) {
            var _,
              o = n || window.event;
            JSEvents.fillMouseEventData(JSEvents.wheelEvent, o, e),
              (HEAPF64[(JSEvents.wheelEvent + 72) >> 3] =
                o["wheelDeltaX"] || 0),
              (HEAPF64[(JSEvents.wheelEvent + 80) >> 3] = -(o["wheelDeltaY"]
                ? o["wheelDeltaY"]
                : o["wheelDelta"])),
              (HEAPF64[(JSEvents.wheelEvent + 88) >> 3] = 0),
              (HEAP32[(JSEvents.wheelEvent + 96) >> 2] = 0),
              (_ = Module["dynCall_iiii"](t, r, JSEvents.wheelEvent, i)),
              _ && o.preventDefault();
          }),
          (u = {
            target: e,
            allowsDeferredCalls: !0,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: "wheel" == _ ? o : l,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(u);
      },
      pageScrollPos: function () {
        return window.pageXOffset > 0 || window.pageYOffset > 0
          ? [window.pageXOffset, window.pageYOffset]
          : "undefined" != typeof document.documentElement.scrollLeft ||
            "undefined" != typeof document.documentElement.scrollTop
          ? [
              document.documentElement.scrollLeft,
              document.documentElement.scrollTop,
            ]
          : [0 | document.body.scrollLeft, 0 | document.body.scrollTop];
      },
      registerUiEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.uiEvent || (JSEvents.uiEvent = _malloc(36)),
          (e = "scroll" != _ || e ? JSEvents.findEventTarget(e) : document),
          (o = function (n) {
            var _,
              o,
              l = n || window.event;
            l.target == e &&
              ((_ = JSEvents.pageScrollPos()),
              (HEAP32[JSEvents.uiEvent >> 2] = l.detail),
              (HEAP32[(JSEvents.uiEvent + 4) >> 2] = document.body.clientWidth),
              (HEAP32[(JSEvents.uiEvent + 8) >> 2] =
                document.body.clientHeight),
              (HEAP32[(JSEvents.uiEvent + 12) >> 2] = window.innerWidth),
              (HEAP32[(JSEvents.uiEvent + 16) >> 2] = window.innerHeight),
              (HEAP32[(JSEvents.uiEvent + 20) >> 2] = window.outerWidth),
              (HEAP32[(JSEvents.uiEvent + 24) >> 2] = window.outerHeight),
              (HEAP32[(JSEvents.uiEvent + 28) >> 2] = _[0]),
              (HEAP32[(JSEvents.uiEvent + 32) >> 2] = _[1]),
              (o = Module["dynCall_iiii"](t, r, JSEvents.uiEvent, i)),
              o && l.preventDefault());
          }),
          (l = {
            target: e,
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      getNodeNameForTarget: function (e) {
        return e
          ? e == window
            ? "#window"
            : e == window.screen
            ? "#screen"
            : e && e.nodeName
            ? e.nodeName
            : ""
          : "";
      },
      registerFocusEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.focusEvent || (JSEvents.focusEvent = _malloc(256)),
          (o = function (e) {
            var n,
              _ = e || window.event,
              o = JSEvents.getNodeNameForTarget(_.target),
              l = _.target.id ? _.target.id : "";
            stringToUTF8(o, JSEvents.focusEvent + 0, 128),
              stringToUTF8(l, JSEvents.focusEvent + 128, 128),
              (n = Module["dynCall_iiii"](t, r, JSEvents.focusEvent, i)),
              n && _.preventDefault();
          }),
          (l = {
            target: JSEvents.findEventTarget(e),
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      tick: function () {
        return window["performance"] && window["performance"]["now"]
          ? window["performance"]["now"]()
          : Date.now();
      },
      registerDeviceOrientationEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.deviceOrientationEvent ||
          (JSEvents.deviceOrientationEvent = _malloc(40)),
          (o = function (e) {
            var n,
              _ = e || window.event;
            (HEAPF64[JSEvents.deviceOrientationEvent >> 3] = JSEvents.tick()),
              (HEAPF64[(JSEvents.deviceOrientationEvent + 8) >> 3] = _.alpha),
              (HEAPF64[(JSEvents.deviceOrientationEvent + 16) >> 3] = _.beta),
              (HEAPF64[(JSEvents.deviceOrientationEvent + 24) >> 3] = _.gamma),
              (HEAP32[(JSEvents.deviceOrientationEvent + 32) >> 2] =
                _.absolute),
              (n = Module["dynCall_iiii"](
                t,
                r,
                JSEvents.deviceOrientationEvent,
                i
              )),
              n && _.preventDefault();
          }),
          (l = {
            target: JSEvents.findEventTarget(e),
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      registerDeviceMotionEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.deviceMotionEvent ||
          (JSEvents.deviceMotionEvent = _malloc(80)),
          (o = function (e) {
            var n,
              _ = e || window.event;
            (HEAPF64[JSEvents.deviceMotionEvent >> 3] = JSEvents.tick()),
              (HEAPF64[(JSEvents.deviceMotionEvent + 8) >> 3] =
                _.acceleration.x),
              (HEAPF64[(JSEvents.deviceMotionEvent + 16) >> 3] =
                _.acceleration.y),
              (HEAPF64[(JSEvents.deviceMotionEvent + 24) >> 3] =
                _.acceleration.z),
              (HEAPF64[(JSEvents.deviceMotionEvent + 32) >> 3] =
                _.accelerationIncludingGravity.x),
              (HEAPF64[(JSEvents.deviceMotionEvent + 40) >> 3] =
                _.accelerationIncludingGravity.y),
              (HEAPF64[(JSEvents.deviceMotionEvent + 48) >> 3] =
                _.accelerationIncludingGravity.z),
              (HEAPF64[(JSEvents.deviceMotionEvent + 56) >> 3] =
                _.rotationRate.alpha),
              (HEAPF64[(JSEvents.deviceMotionEvent + 64) >> 3] =
                _.rotationRate.beta),
              (HEAPF64[(JSEvents.deviceMotionEvent + 72) >> 3] =
                _.rotationRate.gamma),
              (n = Module["dynCall_iiii"](t, r, JSEvents.deviceMotionEvent, i)),
              n && _.preventDefault();
          }),
          (l = {
            target: JSEvents.findEventTarget(e),
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      screenOrientation: function () {
        return window.screen
          ? window.screen.orientation ||
              window.screen.mozOrientation ||
              window.screen.webkitOrientation ||
              window.screen.msOrientation
          : void 0;
      },
      fillOrientationChangeEventData: function (e, i) {
        var n = [
            "portrait-primary",
            "portrait-secondary",
            "landscape-primary",
            "landscape-secondary",
          ],
          t = ["portrait", "portrait", "landscape", "landscape"],
          r = JSEvents.screenOrientation(),
          _ = n.indexOf(r);
        _ == -1 && (_ = t.indexOf(r)),
          (HEAP32[e >> 2] = 1 << _),
          (HEAP32[(e + 4) >> 2] = window.orientation);
      },
      registerOrientationChangeEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.orientationChangeEvent ||
          (JSEvents.orientationChangeEvent = _malloc(8)),
          (e = e ? JSEvents.findEventTarget(e) : window.screen),
          (o = function (e) {
            var n,
              _ = e || window.event;
            JSEvents.fillOrientationChangeEventData(
              JSEvents.orientationChangeEvent,
              _
            ),
              (n = Module["dynCall_iiii"](
                t,
                r,
                JSEvents.orientationChangeEvent,
                i
              )),
              n && _.preventDefault();
          }),
          "orientationchange" == _ &&
            void 0 !== window.screen.mozOrientation &&
            (_ = "mozorientationchange"),
          (l = {
            target: e,
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      fullscreenEnabled: function () {
        return (
          document.fullscreenEnabled ||
          document.mozFullScreenEnabled ||
          document.webkitFullscreenEnabled ||
          document.msFullscreenEnabled
        );
      },
      fillFullscreenChangeEventData: function (e, i) {
        var n,
          t,
          r,
          _ =
            document.fullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            document.msFullscreenElement,
          o = !!_;
        (HEAP32[e >> 2] = o),
          (HEAP32[(e + 4) >> 2] = JSEvents.fullscreenEnabled()),
          (n = o ? _ : JSEvents.previousFullscreenElement),
          (t = JSEvents.getNodeNameForTarget(n)),
          (r = n && n.id ? n.id : ""),
          stringToUTF8(t, e + 8, 128),
          stringToUTF8(r, e + 136, 128),
          (HEAP32[(e + 264) >> 2] = n ? n.clientWidth : 0),
          (HEAP32[(e + 268) >> 2] = n ? n.clientHeight : 0),
          (HEAP32[(e + 272) >> 2] = screen.width),
          (HEAP32[(e + 276) >> 2] = screen.height),
          o && (JSEvents.previousFullscreenElement = _);
      },
      registerFullscreenChangeEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.fullscreenChangeEvent ||
          (JSEvents.fullscreenChangeEvent = _malloc(280)),
          (e = e ? JSEvents.findEventTarget(e) : document),
          (o = function (e) {
            var n,
              _ = e || window.event;
            JSEvents.fillFullscreenChangeEventData(
              JSEvents.fullscreenChangeEvent,
              _
            ),
              (n = Module["dynCall_iiii"](
                t,
                r,
                JSEvents.fullscreenChangeEvent,
                i
              )),
              n && _.preventDefault();
          }),
          (l = {
            target: e,
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      resizeCanvasForFullscreen: function (e, i) {
        var n,
          t,
          r,
          _ = __registerRestoreOldStyle(e),
          o = i.softFullscreen ? window.innerWidth : screen.width,
          l = i.softFullscreen ? window.innerHeight : screen.height,
          u = e.getBoundingClientRect(),
          a = u.right - u.left,
          s = u.bottom - u.top,
          c = e.width,
          f = e.height;
        return (
          3 == i.scaleMode
            ? (__setLetterbox(e, (l - s) / 2, (o - a) / 2), (o = a), (l = s))
            : 2 == i.scaleMode &&
              (c * l > o * f
                ? ((n = (f * o) / c),
                  __setLetterbox(e, (l - n) / 2, 0),
                  (l = n))
                : ((t = (c * l) / f),
                  __setLetterbox(e, 0, (o - t) / 2),
                  (o = t))),
          e.style.backgroundColor || (e.style.backgroundColor = "black"),
          document.body.style.backgroundColor ||
            (document.body.style.backgroundColor = "black"),
          (e.style.width = o + "px"),
          (e.style.height = l + "px"),
          1 == i.filteringMode &&
            ((e.style.imageRendering = "optimizeSpeed"),
            (e.style.imageRendering = "-moz-crisp-edges"),
            (e.style.imageRendering = "-o-crisp-edges"),
            (e.style.imageRendering = "-webkit-optimize-contrast"),
            (e.style.imageRendering = "optimize-contrast"),
            (e.style.imageRendering = "crisp-edges"),
            (e.style.imageRendering = "pixelated")),
          (r = 2 == i.canvasResolutionScaleMode ? window.devicePixelRatio : 1),
          0 != i.canvasResolutionScaleMode &&
            ((e.width = o * r),
            (e.height = l * r),
            e.GLctxObject &&
              e.GLctxObject.GLctx.viewport(0, 0, e.width, e.height)),
          _
        );
      },
      requestFullscreen: function (e, i) {
        if (
          ((0 != i.scaleMode || 0 != i.canvasResolutionScaleMode) &&
            JSEvents.resizeCanvasForFullscreen(e, i),
          e.requestFullscreen)
        )
          e.requestFullscreen();
        else if (e.msRequestFullscreen) e.msRequestFullscreen();
        else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
        else if (e.mozRequestFullscreen) e.mozRequestFullscreen();
        else {
          if (!e.webkitRequestFullscreen)
            return "undefined" == typeof JSEvents.fullscreenEnabled() ? -1 : -3;
          e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        return (
          i.canvasResizedCallback &&
            Module["dynCall_iiii"](
              i.canvasResizedCallback,
              37,
              0,
              i.canvasResizedCallbackUserData
            ),
          0
        );
      },
      fillPointerlockChangeEventData: function (e, i) {
        var n,
          t,
          r =
            document.pointerLockElement ||
            document.mozPointerLockElement ||
            document.webkitPointerLockElement ||
            document.msPointerLockElement,
          _ = !!r;
        (HEAP32[e >> 2] = _),
          (n = JSEvents.getNodeNameForTarget(r)),
          (t = r && r.id ? r.id : ""),
          stringToUTF8(n, e + 4, 128),
          stringToUTF8(t, e + 132, 128);
      },
      registerPointerlockChangeEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.pointerlockChangeEvent ||
          (JSEvents.pointerlockChangeEvent = _malloc(260)),
          (e = e ? JSEvents.findEventTarget(e) : document),
          (o = function (e) {
            var n,
              _ = e || window.event;
            JSEvents.fillPointerlockChangeEventData(
              JSEvents.pointerlockChangeEvent,
              _
            ),
              (n = Module["dynCall_iiii"](
                t,
                r,
                JSEvents.pointerlockChangeEvent,
                i
              )),
              n && _.preventDefault();
          }),
          (l = {
            target: e,
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      registerPointerlockErrorEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        (e = e ? JSEvents.findEventTarget(e) : document),
          (o = function (e) {
            var n = e || window.event,
              _ = Module["dynCall_iiii"](t, r, 0, i);
            _ && n.preventDefault();
          }),
          (l = {
            target: e,
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      requestPointerLock: function (e) {
        if (e.requestPointerLock) e.requestPointerLock();
        else if (e.mozRequestPointerLock) e.mozRequestPointerLock();
        else if (e.webkitRequestPointerLock) e.webkitRequestPointerLock();
        else {
          if (!e.msRequestPointerLock)
            return document.body.requestPointerLock ||
              document.body.mozRequestPointerLock ||
              document.body.webkitRequestPointerLock ||
              document.body.msRequestPointerLock
              ? -3
              : -1;
          e.msRequestPointerLock();
        }
        return 0;
      },
      fillVisibilityChangeEventData: function (e, i) {
        var n = ["hidden", "visible", "prerender", "unloaded"],
          t = n.indexOf(document.visibilityState);
        (HEAP32[e >> 2] = document.hidden), (HEAP32[(e + 4) >> 2] = t);
      },
      registerVisibilityChangeEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.visibilityChangeEvent ||
          (JSEvents.visibilityChangeEvent = _malloc(8)),
          (e = e ? JSEvents.findEventTarget(e) : document),
          (o = function (e) {
            var n,
              _ = e || window.event;
            JSEvents.fillVisibilityChangeEventData(
              JSEvents.visibilityChangeEvent,
              _
            ),
              (n = Module["dynCall_iiii"](
                t,
                r,
                JSEvents.visibilityChangeEvent,
                i
              )),
              n && _.preventDefault();
          }),
          (l = {
            target: e,
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      registerTouchEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.touchEvent || (JSEvents.touchEvent = _malloc(1684)),
          (e = JSEvents.findEventTarget(e)),
          (o = function (n) {
            var _,
              o,
              l,
              u,
              a,
              s,
              c,
              f,
              d = n || window.event,
              p = {};
            for (_ = 0; _ < d.touches.length; ++_)
              (o = d.touches[_]), (p[o.identifier] = o);
            for (_ = 0; _ < d.changedTouches.length; ++_)
              (o = d.changedTouches[_]),
                (p[o.identifier] = o),
                (o.changed = !0);
            for (_ = 0; _ < d.targetTouches.length; ++_)
              (o = d.targetTouches[_]), (p[o.identifier].onTarget = !0);
            (l = JSEvents.touchEvent),
              (HEAP32[(l + 4) >> 2] = d.ctrlKey),
              (HEAP32[(l + 8) >> 2] = d.shiftKey),
              (HEAP32[(l + 12) >> 2] = d.altKey),
              (HEAP32[(l + 16) >> 2] = d.metaKey),
              (l += 20),
              (u = Module["canvas"]
                ? Module["canvas"].getBoundingClientRect()
                : void 0),
              (a = JSEvents.getBoundingClientRectOrZeros(e)),
              (s = 0);
            for (_ in p)
              if (
                ((c = p[_]),
                (HEAP32[l >> 2] = c.identifier),
                (HEAP32[(l + 4) >> 2] = c.screenX),
                (HEAP32[(l + 8) >> 2] = c.screenY),
                (HEAP32[(l + 12) >> 2] = c.clientX),
                (HEAP32[(l + 16) >> 2] = c.clientY),
                (HEAP32[(l + 20) >> 2] = c.pageX),
                (HEAP32[(l + 24) >> 2] = c.pageY),
                (HEAP32[(l + 28) >> 2] = c.changed),
                (HEAP32[(l + 32) >> 2] = c.onTarget),
                u
                  ? ((HEAP32[(l + 44) >> 2] = c.clientX - u.left),
                    (HEAP32[(l + 48) >> 2] = c.clientY - u.top))
                  : ((HEAP32[(l + 44) >> 2] = 0), (HEAP32[(l + 48) >> 2] = 0)),
                (HEAP32[(l + 36) >> 2] = c.clientX - a.left),
                (HEAP32[(l + 40) >> 2] = c.clientY - a.top),
                (l += 52),
                ++s >= 32)
              )
                break;
            (HEAP32[JSEvents.touchEvent >> 2] = s),
              (f = Module["dynCall_iiii"](t, r, JSEvents.touchEvent, i)),
              f && d.preventDefault();
          }),
          (l = {
            target: e,
            allowsDeferredCalls: "touchstart" == _ || "touchend" == _,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      fillGamepadEventData: function (e, i) {
        var n;
        for (HEAPF64[e >> 3] = i.timestamp, n = 0; n < i.axes.length; ++n)
          HEAPF64[(e + 8 * n + 16) >> 3] = i.axes[n];
        for (n = 0; n < i.buttons.length; ++n)
          "object" == typeof i.buttons[n]
            ? (HEAPF64[(e + 8 * n + 528) >> 3] = i.buttons[n].value)
            : (HEAPF64[(e + 8 * n + 528) >> 3] = i.buttons[n]);
        for (n = 0; n < i.buttons.length; ++n)
          "object" == typeof i.buttons[n]
            ? (HEAP32[(e + 4 * n + 1040) >> 2] = i.buttons[n].pressed)
            : (HEAP32[(e + 4 * n + 1040) >> 2] = 1 == i.buttons[n]);
        (HEAP32[(e + 1296) >> 2] = i.connected),
          (HEAP32[(e + 1300) >> 2] = i.index),
          (HEAP32[(e + 8) >> 2] = i.axes.length),
          (HEAP32[(e + 12) >> 2] = i.buttons.length),
          stringToUTF8(i.id, e + 1304, 64),
          stringToUTF8(i.mapping, e + 1368, 64);
      },
      registerGamepadEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.gamepadEvent || (JSEvents.gamepadEvent = _malloc(1432)),
          (o = function (e) {
            var n,
              _ = e || window.event;
            JSEvents.fillGamepadEventData(JSEvents.gamepadEvent, _.gamepad),
              (n = Module["dynCall_iiii"](t, r, JSEvents.gamepadEvent, i)),
              n && _.preventDefault();
          }),
          (l = {
            target: JSEvents.findEventTarget(e),
            allowsDeferredCalls: !0,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      registerBeforeUnloadEventCallback: function (e, i, n, t, r, _) {
        var o = function (e) {
            var n = e || window.event,
              _ = Module["dynCall_iiii"](t, r, 0, i);
            return (
              _ && (_ = Pointer_stringify(_)),
              _ ? (n.preventDefault(), (n.returnValue = _), _) : void 0
            );
          },
          l = {
            target: JSEvents.findEventTarget(e),
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          };
        JSEvents.registerOrRemoveHandler(l);
      },
      battery: function () {
        return (
          navigator.battery || navigator.mozBattery || navigator.webkitBattery
        );
      },
      fillBatteryEventData: function (e, i) {
        (HEAPF64[e >> 3] = i.chargingTime),
          (HEAPF64[(e + 8) >> 3] = i.dischargingTime),
          (HEAPF64[(e + 16) >> 3] = i.level),
          (HEAP32[(e + 24) >> 2] = i.charging);
      },
      registerBatteryEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        JSEvents.batteryEvent || (JSEvents.batteryEvent = _malloc(32)),
          (o = function (e) {
            var n,
              _ = e || window.event;
            JSEvents.fillBatteryEventData(
              JSEvents.batteryEvent,
              JSEvents.battery()
            ),
              (n = Module["dynCall_iiii"](t, r, JSEvents.batteryEvent, i)),
              n && _.preventDefault();
          }),
          (l = {
            target: JSEvents.findEventTarget(e),
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
      registerWebGlEventCallback: function (e, i, n, t, r, _) {
        var o, l;
        e || (e = Module["canvas"]),
          (o = function (e) {
            var n = e || window.event,
              _ = Module["dynCall_iiii"](t, r, 0, i);
            _ && n.preventDefault();
          }),
          (l = {
            target: JSEvents.findEventTarget(e),
            allowsDeferredCalls: !1,
            eventTypeString: _,
            callbackfunc: t,
            handlerFunc: o,
            useCapture: n,
          }),
          JSEvents.registerOrRemoveHandler(l);
      },
    }),
    (__currentFullscreenStrategy = {}),
    (GL = {
      counter: 1,
      lastError: 0,
      buffers: [],
      mappedBuffers: {},
      programs: [],
      framebuffers: [],
      renderbuffers: [],
      textures: [],
      uniforms: [],
      shaders: [],
      vaos: [],
      contexts: [],
      currentContext: null,
      offscreenCanvases: {},
      timerQueriesEXT: [],
      queries: [],
      samplers: [],
      transformFeedbacks: [],
      syncs: [],
      byteSizeByTypeRoot: 5120,
      byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
      programInfos: {},
      stringCache: {},
      stringiCache: {},
      tempFixedLengthArray: [],
      packAlignment: 4,
      unpackAlignment: 4,
      init: function () {
        var e;
        for (
          GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE), e = 0;
          e < GL.MINI_TEMP_BUFFER_SIZE;
          e++
        )
          GL.miniTempBufferViews[e] = GL.miniTempBuffer.subarray(0, e + 1);
        for (e = 0; 32 > e; e++) GL.tempFixedLengthArray.push(new Array(e));
      },
      recordError: function u(e) {
        GL.lastError || (GL.lastError = e);
      },
      getNewId: function (e) {
        var i,
          n = GL.counter++;
        for (i = e.length; n > i; i++) e[i] = null;
        return n;
      },
      MINI_TEMP_BUFFER_SIZE: 256,
      miniTempBuffer: null,
      miniTempBufferViews: [0],
      getSource: function (e, i, n, t) {
        var r,
          _,
          o,
          l = "";
        for (r = 0; i > r; ++r)
          t
            ? ((o = HEAP32[(t + 4 * r) >> 2]),
              (_ =
                0 > o
                  ? Pointer_stringify(HEAP32[(n + 4 * r) >> 2])
                  : Pointer_stringify(HEAP32[(n + 4 * r) >> 2], o)))
            : (_ = Pointer_stringify(HEAP32[(n + 4 * r) >> 2])),
            (l += _);
        return l;
      },
      createContext: function (e, i) {
        function n(e) {
          r = e.statusMessage || r;
        }
        var t, r, _;
        "undefined" == typeof i["majorVersion"] &&
          "undefined" == typeof i["minorVersion"] &&
          ("undefined" != typeof WebGL2RenderingContext
            ? (i["majorVersion"] = 2)
            : (i["majorVersion"] = 1),
          (i["minorVersion"] = 0)),
          (r = "?");
        try {
          e.addEventListener("webglcontextcreationerror", n, !1);
          try {
            if (1 == i["majorVersion"] && 0 == i["minorVersion"])
              t =
                e.getContext("webgl", i) ||
                e.getContext("experimental-webgl", i);
            else {
              if (2 != i["majorVersion"] || 0 != i["minorVersion"])
                throw (
                  "Unsupported WebGL context version " +
                  majorVersion +
                  "." +
                  minorVersion +
                  "!"
                );
              t = e.getContext("webgl2", i);
            }
          } finally {
            e.removeEventListener("webglcontextcreationerror", n, !1);
          }
          if (!t) throw ":(";
        } catch (o) {
          return (
            Module.print(
              "Could not create canvas: " + [r, o, JSON.stringify(i)]
            ),
            0
          );
        }
        return t ? ((_ = GL.registerContext(t, i)), _) : 0;
      },
      registerContext: function (e, i) {
        function n() {
          var e = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
          return e ? parseInt(e[2], 10) : !1;
        }
        var t = GL.getNewId(GL.contexts),
          r = {
            handle: t,
            attributes: i,
            version: i["majorVersion"],
            GLctx: e,
          };
        return (
          (r.supportsWebGL2EntryPoints =
            r.version >= 2 && (n() === !1 || n() >= 58)),
          e.canvas && (e.canvas.GLctxObject = r),
          (GL.contexts[t] = r),
          ("undefined" == typeof i["enableExtensionsByDefault"] ||
            i["enableExtensionsByDefault"]) &&
            GL.initExtensions(r),
          t
        );
      },
      makeContextCurrent: function (e) {
        var i = GL.contexts[e];
        return i
          ? ((GLctx = Module.ctx = i.GLctx), (GL.currentContext = i), !0)
          : !1;
      },
      getContext: function (e) {
        return GL.contexts[e];
      },
      deleteContext: function (e) {
        GL.currentContext === GL.contexts[e] && (GL.currentContext = null),
          "object" == typeof JSEvents &&
            JSEvents.removeAllHandlersOnTarget(GL.contexts[e].GLctx.canvas),
          GL.contexts[e] &&
            GL.contexts[e].GLctx.canvas &&
            (GL.contexts[e].GLctx.canvas.GLctxObject = void 0),
          (GL.contexts[e] = null);
      },
      initExtensions: function (e) {
        var i, n, t, r, _, o;
        e || (e = GL.currentContext),
          e.initExtensionsDone ||
            ((e.initExtensionsDone = !0),
            (i = e.GLctx),
            (e.maxVertexAttribs = i.getParameter(i.MAX_VERTEX_ATTRIBS)),
            e.version < 2 &&
              ((n = i.getExtension("ANGLE_instanced_arrays")),
              n &&
                ((i["vertexAttribDivisor"] = function (e, i) {
                  n["vertexAttribDivisorANGLE"](e, i);
                }),
                (i["drawArraysInstanced"] = function (e, i, t, r) {
                  n["drawArraysInstancedANGLE"](e, i, t, r);
                }),
                (i["drawElementsInstanced"] = function (e, i, t, r, _) {
                  n["drawElementsInstancedANGLE"](e, i, t, r, _);
                })),
              (t = i.getExtension("OES_vertex_array_object")),
              t &&
                ((i["createVertexArray"] = function () {
                  return t["createVertexArrayOES"]();
                }),
                (i["deleteVertexArray"] = function (e) {
                  t["deleteVertexArrayOES"](e);
                }),
                (i["bindVertexArray"] = function (e) {
                  t["bindVertexArrayOES"](e);
                }),
                (i["isVertexArray"] = function (e) {
                  return t["isVertexArrayOES"](e);
                })),
              (r = i.getExtension("WEBGL_draw_buffers")),
              r &&
                (i["drawBuffers"] = function (e, i) {
                  r["drawBuffersWEBGL"](e, i);
                })),
            (i.disjointTimerQueryExt = i.getExtension(
              "EXT_disjoint_timer_query"
            )),
            (_ = [
              "OES_texture_float",
              "OES_texture_half_float",
              "OES_standard_derivatives",
              "OES_vertex_array_object",
              "WEBGL_compressed_texture_s3tc",
              "WEBGL_depth_texture",
              "OES_element_index_uint",
              "EXT_texture_filter_anisotropic",
              "ANGLE_instanced_arrays",
              "OES_texture_float_linear",
              "OES_texture_half_float_linear",
              "WEBGL_compressed_texture_atc",
              "WEBKIT_WEBGL_compressed_texture_pvrtc",
              "WEBGL_compressed_texture_pvrtc",
              "EXT_color_buffer_half_float",
              "WEBGL_color_buffer_float",
              "EXT_frag_depth",
              "EXT_sRGB",
              "WEBGL_draw_buffers",
              "WEBGL_shared_resources",
              "EXT_shader_texture_lod",
              "EXT_color_buffer_float",
            ]),
            (o = i.getSupportedExtensions()),
            o &&
              o.length > 0 &&
              i.getSupportedExtensions().forEach(function (e) {
                _.indexOf(e) != -1 && i.getExtension(e);
              }));
      },
      populateUniformTable: function (e) {
        var i,
          n,
          t,
          r,
          _,
          o,
          l,
          u,
          a,
          s,
          c,
          f = GL.programs[e];
        for (
          GL.programInfos[e] = {
            uniforms: {},
            maxUniformLength: 0,
            maxAttributeLength: -1,
            maxUniformBlockNameLength: -1,
          },
            i = GL.programInfos[e],
            n = i.uniforms,
            t = GLctx.getProgramParameter(f, GLctx.ACTIVE_UNIFORMS),
            r = 0;
          t > r;
          ++r
        )
          if (
            ((_ = GLctx.getActiveUniform(f, r)),
            (o = _.name),
            (i.maxUniformLength = Math.max(i.maxUniformLength, o.length + 1)),
            o.indexOf("]", o.length - 1) !== -1 &&
              ((l = o.lastIndexOf("[")), (o = o.slice(0, l))),
            (u = GLctx.getUniformLocation(f, o)),
            null != u)
          )
            for (
              a = GL.getNewId(GL.uniforms),
                n[o] = [_.size, a],
                GL.uniforms[a] = u,
                s = 1;
              s < _.size;
              ++s
            )
              (c = o + "[" + s + "]"),
                (u = GLctx.getUniformLocation(f, c)),
                (a = GL.getNewId(GL.uniforms)),
                (GL.uniforms[a] = u);
      },
    }),
    (___tm_current = STATICTOP),
    (STATICTOP += 48),
    (___tm_timezone = allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC)),
    (_llvm_ceil_f32 = Math_ceil),
    (_llvm_ceil_f64 = Math_ceil),
    (cttz_i8 = allocate(
      [
        8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0,
        3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0,
        4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0,
        3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0,
        5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0,
        3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0,
        4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0,
        3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0,
        6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0,
        3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0,
        4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0,
      ],
      "i8",
      ALLOC_STATIC
    )),
    (_llvm_fabs_f32 = Math_abs),
    (_llvm_fabs_f64 = Math_abs),
    (_llvm_floor_f32 = Math_floor),
    (_llvm_floor_f64 = Math_floor),
    (_llvm_pow_f32 = Math_pow),
    (_llvm_pow_f64 = Math_pow),
    (_tzname = STATICTOP),
    (STATICTOP += 16),
    (_daylight = STATICTOP),
    (STATICTOP += 16),
    (_timezone = STATICTOP),
    (STATICTOP += 16),
    (PTHREAD_SPECIFIC = {}),
    (PTHREAD_SPECIFIC_NEXT_KEY = 1),
    (__MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]),
    (__MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]),
    FS.staticInit(),
    __ATINIT__.unshift(function () {
      Module["noFSInit"] || FS.init.initialized || FS.init();
    }),
    __ATMAIN__.push(function () {
      FS.ignorePermissions = !1;
    }),
    __ATEXIT__.push(function () {
      FS.quit();
    }),
    (Module["FS_createPath"] = FS.createPath),
    (Module["FS_createDataFile"] = FS.createDataFile),
    __ATINIT__.unshift(function () {
      TTY.init();
    }),
    __ATEXIT__.push(function () {
      TTY.shutdown();
    }),
    ENVIRONMENT_IS_NODE &&
      ((fs = require("fs")),
      (NODEJS_PATH = require("path")),
      NODEFS.staticInit()),
    (Module["requestFullScreen"] = function a(e, i, n) {
      Module.printErr(
        "Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead."
      ),
        (Module["requestFullScreen"] = Module["requestFullscreen"]),
        Browser.requestFullScreen(e, i, n);
    }),
    (Module["requestFullscreen"] = function s(e, i, n) {
      Browser.requestFullscreen(e, i, n);
    }),
    (Module["requestAnimationFrame"] = function c(e) {
      Browser.requestAnimationFrame(e);
    }),
    (Module["setCanvasSize"] = function f(e, i, n) {
      Browser.setCanvasSize(e, i, n);
    }),
    (Module["pauseMainLoop"] = function d() {
      Browser.mainLoop.pause();
    }),
    (Module["resumeMainLoop"] = function p() {
      Browser.mainLoop.resume();
    }),
    (Module["getUserMedia"] = function m() {
      Browser.getUserMedia();
    }),
    (Module["createContext"] = function y(e, i, n, t) {
      return Browser.createContext(e, i, n, t);
    }),
    (_emscripten_get_now = ENVIRONMENT_IS_NODE
      ? function g() {
          var e = process["hrtime"]();
          return 1e3 * e[0] + e[1] / 1e6;
        }
      : "undefined" != typeof dateNow
      ? dateNow
      : "object" == typeof self &&
        self["performance"] &&
        "function" == typeof self["performance"]["now"]
      ? function () {
          return self["performance"]["now"]();
        }
      : "object" == typeof performance &&
        "function" == typeof performance["now"]
      ? function () {
          return performance["now"]();
        }
      : Date.now),
    ___buildEnvironment(ENV),
    __ATINIT__.push(function () {
      PIPEFS.root = FS.mount(PIPEFS, {}, null);
    }),
    JSEvents.staticInit(),
    GL.init(),
    (DYNAMICTOP_PTR = staticAlloc(4)),
    (STACK_BASE = STACKTOP = alignMemory(STATICTOP)),
    (STACK_MAX = STACK_BASE + TOTAL_STACK),
    (DYNAMIC_BASE = alignMemory(STACK_MAX)),
    (HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE),
    (staticSealed = !0),
    (Module["wasmTableSize"] = 91174),
    (Module["wasmMaxTableSize"] = 91174),
    (Module.asmGlobalArg = {}),
    (Module.asmLibraryArg = {
      abort: abort,
      assert: assert,
      enlargeMemory: enlargeMemory,
      getTotalMemory: getTotalMemory,
      abortOnCannotGrowMemory: abortOnCannotGrowMemory,
      invoke_d: invoke_d,
      invoke_di: invoke_di,
      invoke_diddi: invoke_diddi,
      invoke_didi: invoke_didi,
      invoke_didii: invoke_didii,
      invoke_didiii: invoke_didiii,
      invoke_difi: invoke_difi,
      invoke_dii: invoke_dii,
      invoke_diiddi: invoke_diiddi,
      invoke_diidi: invoke_diidi,
      invoke_diii: invoke_diii,
      invoke_diiii: invoke_diiii,
      invoke_diiiii: invoke_diiiii,
      invoke_diji: invoke_diji,
      invoke_f: invoke_f,
      invoke_ff: invoke_ff,
      invoke_fff: invoke_fff,
      invoke_fi: invoke_fi,
      invoke_fidi: invoke_fidi,
      invoke_fif: invoke_fif,
      invoke_fiff: invoke_fiff,
      invoke_fifffffi: invoke_fifffffi,
      invoke_fiffffi: invoke_fiffffi,
      invoke_fiffffii: invoke_fiffffii,
      invoke_fifffi: invoke_fifffi,
      invoke_fifffii: invoke_fifffii,
      invoke_fifffiiii: invoke_fifffiiii,
      invoke_fiffi: invoke_fiffi,
      invoke_fiffifffi: invoke_fiffifffi,
      invoke_fiffii: invoke_fiffii,
      invoke_fifi: invoke_fifi,
      invoke_fifii: invoke_fifii,
      invoke_fifiii: invoke_fifiii,
      invoke_fii: invoke_fii,
      invoke_fiif: invoke_fiif,
      invoke_fiiffffii: invoke_fiiffffii,
      invoke_fiiffffiiiii: invoke_fiiffffiiiii,
      invoke_fiiffffiiiiii: invoke_fiiffffiiiiii,
      invoke_fiifffiii: invoke_fiifffiii,
      invoke_fiiffi: invoke_fiiffi,
      invoke_fiifi: invoke_fiifi,
      invoke_fiii: invoke_fiii,
      invoke_fiiifi: invoke_fiiifi,
      invoke_fiiifii: invoke_fiiifii,
      invoke_fiiii: invoke_fiiii,
      invoke_fiiiif: invoke_fiiiif,
      invoke_fiiiii: invoke_fiiiii,
      invoke_fiiiiiifiiiiiif: invoke_fiiiiiifiiiiiif,
      invoke_fiiiiiiiifiiiif: invoke_fiiiiiiiifiiiif,
      invoke_fiji: invoke_fiji,
      invoke_i: invoke_i,
      invoke_ii: invoke_ii,
      invoke_iiddi: invoke_iiddi,
      invoke_iidi: invoke_iidi,
      invoke_iidii: invoke_iidii,
      invoke_iidiii: invoke_iidiii,
      invoke_iif: invoke_iif,
      invoke_iifff: invoke_iifff,
      invoke_iiffffi: invoke_iiffffi,
      invoke_iifffi: invoke_iifffi,
      invoke_iifffii: invoke_iifffii,
      invoke_iiffi: invoke_iiffi,
      invoke_iiffifii: invoke_iiffifii,
      invoke_iiffii: invoke_iiffii,
      invoke_iiffiii: invoke_iiffiii,
      invoke_iiffiiii: invoke_iiffiiii,
      invoke_iifi: invoke_iifi,
      invoke_iififii: invoke_iififii,
      invoke_iifii: invoke_iifii,
      invoke_iifiii: invoke_iifiii,
      invoke_iifiiifiii: invoke_iifiiifiii,
      invoke_iifiiii: invoke_iifiiii,
      invoke_iii: invoke_iii,
      invoke_iiid: invoke_iiid,
      invoke_iiidi: invoke_iiidi,
      invoke_iiidii: invoke_iiidii,
      invoke_iiidiii: invoke_iiidiii,
      invoke_iiif: invoke_iiif,
      invoke_iiifffi: invoke_iiifffi,
      invoke_iiifffii: invoke_iiifffii,
      invoke_iiiffi: invoke_iiiffi,
      invoke_iiiffii: invoke_iiiffii,
      invoke_iiiffiii: invoke_iiiffiii,
      invoke_iiifi: invoke_iiifi,
      invoke_iiififii: invoke_iiififii,
      invoke_iiififiii: invoke_iiififiii,
      invoke_iiifii: invoke_iiifii,
      invoke_iiifiifii: invoke_iiifiifii,
      invoke_iiifiifiii: invoke_iiifiifiii,
      invoke_iiifiii: invoke_iiifiii,
      invoke_iiifiiii: invoke_iiifiiii,
      invoke_iiii: invoke_iiii,
      invoke_iiiiffi: invoke_iiiiffi,
      invoke_iiiiffii: invoke_iiiiffii,
      invoke_iiiifi: invoke_iiiifi,
      invoke_iiiififiii: invoke_iiiififiii,
      invoke_iiiififiiii: invoke_iiiififiiii,
      invoke_iiiifii: invoke_iiiifii,
      invoke_iiiifiifiii: invoke_iiiifiifiii,
      invoke_iiiifiii: invoke_iiiifiii,
      invoke_iiiifiiii: invoke_iiiifiiii,
      invoke_iiiifiiiii: invoke_iiiifiiiii,
      invoke_iiiii: invoke_iiiii,
      invoke_iiiiifffii: invoke_iiiiifffii,
      invoke_iiiiifi: invoke_iiiiifi,
      invoke_iiiiifii: invoke_iiiiifii,
      invoke_iiiiifiif: invoke_iiiiifiif,
      invoke_iiiiifiii: invoke_iiiiifiii,
      invoke_iiiiifiiii: invoke_iiiiifiiii,
      invoke_iiiiifiiiif: invoke_iiiiifiiiif,
      invoke_iiiiifiiiii: invoke_iiiiifiiiii,
      invoke_iiiiifiiiiif: invoke_iiiiifiiiiif,
      invoke_iiiiifiiiiii: invoke_iiiiifiiiiii,
      invoke_iiiiii: invoke_iiiiii,
      invoke_iiiiiifffiiifiii: invoke_iiiiiifffiiifiii,
      invoke_iiiiiiffiiiiiiiiiffffiii: invoke_iiiiiiffiiiiiiiiiffffiii,
      invoke_iiiiiiffiiiiiiiiiffffiiii: invoke_iiiiiiffiiiiiiiiiffffiiii,
      invoke_iiiiiiffiiiiiiiiiiiiiii: invoke_iiiiiiffiiiiiiiiiiiiiii,
      invoke_iiiiiifi: invoke_iiiiiifi,
      invoke_iiiiiifii: invoke_iiiiiifii,
      invoke_iiiiiifiif: invoke_iiiiiifiif,
      invoke_iiiiiifiii: invoke_iiiiiifiii,
      invoke_iiiiiii: invoke_iiiiiii,
      invoke_iiiiiiif: invoke_iiiiiiif,
      invoke_iiiiiiifi: invoke_iiiiiiifi,
      invoke_iiiiiiii: invoke_iiiiiiii,
      invoke_iiiiiiiii: invoke_iiiiiiiii,
      invoke_iiiiiiiiii: invoke_iiiiiiiiii,
      invoke_iiiiiiiiiiffffii: invoke_iiiiiiiiiiffffii,
      invoke_iiiiiiiiiifi: invoke_iiiiiiiiiifi,
      invoke_iiiiiiiiiii: invoke_iiiiiiiiiii,
      invoke_iiiiiiiiiiii: invoke_iiiiiiiiiiii,
      invoke_iiiiiiiiiiiiffffii: invoke_iiiiiiiiiiiiffffii,
      invoke_iiiiiiiiiiiii: invoke_iiiiiiiiiiiii,
      invoke_iiiiiiiiiiiiii: invoke_iiiiiiiiiiiiii,
      invoke_iiiiiiiiiiiiiii: invoke_iiiiiiiiiiiiiii,
      invoke_iiiiij: invoke_iiiiij,
      invoke_iiiiiji: invoke_iiiiiji,
      invoke_iiiiijii: invoke_iiiiijii,
      invoke_iiiiijjii: invoke_iiiiijjii,
      invoke_iiiij: invoke_iiiij,
      invoke_iiiiji: invoke_iiiiji,
      invoke_iiiijjii: invoke_iiiijjii,
      invoke_iiiijjiiii: invoke_iiiijjiiii,
      invoke_iiij: invoke_iiij,
      invoke_iiiji: invoke_iiiji,
      invoke_iiijii: invoke_iiijii,
      invoke_iiijiii: invoke_iiijiii,
      invoke_iiijji: invoke_iiijji,
      invoke_iiijjii: invoke_iiijjii,
      invoke_iiijjiiii: invoke_iiijjiiii,
      invoke_iij: invoke_iij,
      invoke_iiji: invoke_iiji,
      invoke_iijii: invoke_iijii,
      invoke_iijiii: invoke_iijiii,
      invoke_iijji: invoke_iijji,
      invoke_iijjii: invoke_iijjii,
      invoke_iijjiii: invoke_iijjiii,
      invoke_iijjji: invoke_iijjji,
      invoke_ijj: invoke_ijj,
      invoke_j: invoke_j,
      invoke_ji: invoke_ji,
      invoke_jidi: invoke_jidi,
      invoke_jidii: invoke_jidii,
      invoke_jifi: invoke_jifi,
      invoke_jii: invoke_jii,
      invoke_jiii: invoke_jiii,
      invoke_jiiii: invoke_jiiii,
      invoke_jiiiii: invoke_jiiiii,
      invoke_jiiiiii: invoke_jiiiiii,
      invoke_jiiiiiiiiii: invoke_jiiiiiiiiii,
      invoke_jiiji: invoke_jiiji,
      invoke_jiijiii: invoke_jiijiii,
      invoke_jiijji: invoke_jiijji,
      invoke_jiji: invoke_jiji,
      invoke_jijii: invoke_jijii,
      invoke_jijj: invoke_jijj,
      invoke_jijji: invoke_jijji,
      invoke_jijjji: invoke_jijjji,
      invoke_v: invoke_v,
      invoke_vd: invoke_vd,
      invoke_vdd: invoke_vdd,
      invoke_vdddddd: invoke_vdddddd,
      invoke_vf: invoke_vf,
      invoke_vff: invoke_vff,
      invoke_vfff: invoke_vfff,
      invoke_vffff: invoke_vffff,
      invoke_vfi: invoke_vfi,
      invoke_vfii: invoke_vfii,
      invoke_vi: invoke_vi,
      invoke_vid: invoke_vid,
      invoke_vidd: invoke_vidd,
      invoke_vidddi: invoke_vidddi,
      invoke_viddi: invoke_viddi,
      invoke_vidi: invoke_vidi,
      invoke_vif: invoke_vif,
      invoke_viff: invoke_viff,
      invoke_vifff: invoke_vifff,
      invoke_viffff: invoke_viffff,
      invoke_vifffffi: invoke_vifffffi,
      invoke_viffffi: invoke_viffffi,
      invoke_viffffii: invoke_viffffii,
      invoke_viffffiii: invoke_viffffiii,
      invoke_viffffiiii: invoke_viffffiiii,
      invoke_vifffi: invoke_vifffi,
      invoke_vifffii: invoke_vifffii,
      invoke_viffi: invoke_viffi,
      invoke_viffii: invoke_viffii,
      invoke_viffiii: invoke_viffiii,
      invoke_vifi: invoke_vifi,
      invoke_vifii: invoke_vifii,
      invoke_vifiii: invoke_vifiii,
      invoke_vifiiii: invoke_vifiiii,
      invoke_vifiiiii: invoke_vifiiiii,
      invoke_vifiiiiiiiiiiiii: invoke_vifiiiiiiiiiiiii,
      invoke_vifiiiiiiiiiiiiiiiiii: invoke_vifiiiiiiiiiiiiiiiiii,
      invoke_vifiiiiiiiiiiiiiiiiiiiiiii: invoke_vifiiiiiiiiiiiiiiiiiiiiiii,
      invoke_vifiiiiiiiiiiiiiiiiiiiiiiiiiiii:
        invoke_vifiiiiiiiiiiiiiiiiiiiiiiiiiiii,
      invoke_vii: invoke_vii,
      invoke_viidddi: invoke_viidddi,
      invoke_viidi: invoke_viidi,
      invoke_viidii: invoke_viidii,
      invoke_viif: invoke_viif,
      invoke_viiff: invoke_viiff,
      invoke_viifff: invoke_viifff,
      invoke_viifffffii: invoke_viifffffii,
      invoke_viiffffi: invoke_viiffffi,
      invoke_viiffffiii: invoke_viiffffiii,
      invoke_viiffffiiiii: invoke_viiffffiiiii,
      invoke_viifffi: invoke_viifffi,
      invoke_viiffi: invoke_viiffi,
      invoke_viiffii: invoke_viiffii,
      invoke_viiffiii: invoke_viiffiii,
      invoke_viifi: invoke_viifi,
      invoke_viifii: invoke_viifii,
      invoke_viifiifi: invoke_viifiifi,
      invoke_viifiii: invoke_viifiii,
      invoke_viifiiii: invoke_viifiiii,
      invoke_viii: invoke_viii,
      invoke_viiidi: invoke_viiidi,
      invoke_viiif: invoke_viiif,
      invoke_viiiffdi: invoke_viiiffdi,
      invoke_viiiffi: invoke_viiiffi,
      invoke_viiiffii: invoke_viiiffii,
      invoke_viiifi: invoke_viiifi,
      invoke_viiifii: invoke_viiifii,
      invoke_viiifiii: invoke_viiifiii,
      invoke_viiifiiii: invoke_viiifiiii,
      invoke_viiifiiiii: invoke_viiifiiiii,
      invoke_viiii: invoke_viiii,
      invoke_viiiif: invoke_viiiif,
      invoke_viiiifffii: invoke_viiiifffii,
      invoke_viiiiffi: invoke_viiiiffi,
      invoke_viiiifi: invoke_viiiifi,
      invoke_viiiififfi: invoke_viiiififfi,
      invoke_viiiififi: invoke_viiiififi,
      invoke_viiiifii: invoke_viiiifii,
      invoke_viiiifiii: invoke_viiiifiii,
      invoke_viiiifiiiiif: invoke_viiiifiiiiif,
      invoke_viiiii: invoke_viiiii,
      invoke_viiiiif: invoke_viiiiif,
      invoke_viiiiiffi: invoke_viiiiiffi,
      invoke_viiiiifi: invoke_viiiiifi,
      invoke_viiiiifii: invoke_viiiiifii,
      invoke_viiiiii: invoke_viiiiii,
      invoke_viiiiiif: invoke_viiiiiif,
      invoke_viiiiiiffii: invoke_viiiiiiffii,
      invoke_viiiiiifi: invoke_viiiiiifi,
      invoke_viiiiiii: invoke_viiiiiii,
      invoke_viiiiiiii: invoke_viiiiiiii,
      invoke_viiiiiiiii: invoke_viiiiiiiii,
      invoke_viiiiiiiiii: invoke_viiiiiiiiii,
      invoke_viiiiiiiiiii: invoke_viiiiiiiiiii,
      invoke_viiiiiiiiiiii: invoke_viiiiiiiiiiii,
      invoke_viiiiiiiiiiiiii: invoke_viiiiiiiiiiiiii,
      invoke_viiiiiiiiiiiiiii: invoke_viiiiiiiiiiiiiii,
      invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii:
        invoke_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii,
      invoke_viiiiji: invoke_viiiiji,
      invoke_viiiijiiii: invoke_viiiijiiii,
      invoke_viiiji: invoke_viiiji,
      invoke_viiijji: invoke_viiijji,
      invoke_viiijjii: invoke_viiijjii,
      invoke_viij: invoke_viij,
      invoke_viiji: invoke_viiji,
      invoke_viijiijiii: invoke_viijiijiii,
      invoke_viijijii: invoke_viijijii,
      invoke_viijijiii: invoke_viijijiii,
      invoke_viijijji: invoke_viijijji,
      invoke_viijj: invoke_viijj,
      invoke_viijji: invoke_viijji,
      invoke_viijjii: invoke_viijjii,
      invoke_viijjiii: invoke_viijjiii,
      invoke_viijjji: invoke_viijjji,
      invoke_vij: invoke_vij,
      invoke_viji: invoke_viji,
      invoke_vijii: invoke_vijii,
      invoke_vijiii: invoke_vijiii,
      invoke_vijiiii: invoke_vijiiii,
      invoke_vijiji: invoke_vijiji,
      invoke_vijj: invoke_vijj,
      invoke_vijji: invoke_vijji,
      invoke_vijjji: invoke_vijjji,
      invoke_vjji: invoke_vjji,
      _GetSharedPath: _GetSharedPath,
      _IMG_Load: _IMG_Load,
      _IMG_Load_RW: _IMG_Load_RW,
      _IsIPodMusicPlaying: _IsIPodMusicPlaying,
      _JS_Cursor_SetImage: _JS_Cursor_SetImage,
      _JS_Cursor_SetShow: _JS_Cursor_SetShow,
      _JS_Eval_ClearTimeout: _JS_Eval_ClearTimeout,
      _JS_Eval_EvalJS: _JS_Eval_EvalJS,
      _JS_Eval_OpenURL: _JS_Eval_OpenURL,
      _JS_Eval_SetTimeout: _JS_Eval_SetTimeout,
      _JS_FileSystem_SetSyncInterval: _JS_FileSystem_SetSyncInterval,
      _JS_FileSystem_Sync: _JS_FileSystem_Sync,
      _JS_Log_StackTrace: _JS_Log_StackTrace,
      _JS_Sound_Create_Channel: _JS_Sound_Create_Channel,
      _JS_Sound_GetLength: _JS_Sound_GetLength,
      _JS_Sound_GetLoadState: _JS_Sound_GetLoadState,
      _JS_Sound_Init: _JS_Sound_Init,
      _JS_Sound_Load: _JS_Sound_Load,
      _JS_Sound_Load_PCM: _JS_Sound_Load_PCM,
      _JS_Sound_Play: _JS_Sound_Play,
      _JS_Sound_ReleaseInstance: _JS_Sound_ReleaseInstance,
      _JS_Sound_Set3D: _JS_Sound_Set3D,
      _JS_Sound_SetListenerOrientation: _JS_Sound_SetListenerOrientation,
      _JS_Sound_SetListenerPosition: _JS_Sound_SetListenerPosition,
      _JS_Sound_SetLoop: _JS_Sound_SetLoop,
      _JS_Sound_SetLoopPoints: _JS_Sound_SetLoopPoints,
      _JS_Sound_SetPitch: _JS_Sound_SetPitch,
      _JS_Sound_SetPosition: _JS_Sound_SetPosition,
      _JS_Sound_SetVolume: _JS_Sound_SetVolume,
      _JS_Sound_Stop: _JS_Sound_Stop,
      _JS_SystemInfo_GetBrowserName: _JS_SystemInfo_GetBrowserName,
      _JS_SystemInfo_GetBrowserVersionString:
        _JS_SystemInfo_GetBrowserVersionString,
      _JS_SystemInfo_GetCurrentCanvasHeight:
        _JS_SystemInfo_GetCurrentCanvasHeight,
      _JS_SystemInfo_GetCurrentCanvasWidth:
        _JS_SystemInfo_GetCurrentCanvasWidth,
      _JS_SystemInfo_GetDocumentURL: _JS_SystemInfo_GetDocumentURL,
      _JS_SystemInfo_GetGPUInfo: _JS_SystemInfo_GetGPUInfo,
      _JS_SystemInfo_GetHeight: _JS_SystemInfo_GetHeight,
      _JS_SystemInfo_GetLanguage: _JS_SystemInfo_GetLanguage,
      _JS_SystemInfo_GetMemory: _JS_SystemInfo_GetMemory,
      _JS_SystemInfo_GetOS: _JS_SystemInfo_GetOS,
      _JS_SystemInfo_GetStreamingAssetsURL:
        _JS_SystemInfo_GetStreamingAssetsURL,
      _JS_SystemInfo_GetWidth: _JS_SystemInfo_GetWidth,
      _JS_SystemInfo_HasCursorLock: _JS_SystemInfo_HasCursorLock,
      _JS_SystemInfo_HasFullscreen: _JS_SystemInfo_HasFullscreen,
      _JS_SystemInfo_HasWebGL: _JS_SystemInfo_HasWebGL,
      _JS_SystemInfo_IsMobile: _JS_SystemInfo_IsMobile,
      _JS_WebGL_InitContextAttributes: _JS_WebGL_InitContextAttributes,
      _JS_WebRequest_Abort: _JS_WebRequest_Abort,
      _JS_WebRequest_Create: _JS_WebRequest_Create,
      _JS_WebRequest_GetResponseHeaders: _JS_WebRequest_GetResponseHeaders,
      _JS_WebRequest_Release: _JS_WebRequest_Release,
      _JS_WebRequest_Send: _JS_WebRequest_Send,
      _JS_WebRequest_SetProgressHandler: _JS_WebRequest_SetProgressHandler,
      _JS_WebRequest_SetRequestHeader: _JS_WebRequest_SetRequestHeader,
      _JS_WebRequest_SetResponseHandler: _JS_WebRequest_SetResponseHandler,
      _JS_WebRequest_SetTimeout: _JS_WebRequest_SetTimeout,
      _Mix_FreeChunk: _Mix_FreeChunk,
      _Mix_HaltMusic: _Mix_HaltMusic,
      _Mix_LoadWAV_RW: _Mix_LoadWAV_RW,
      _Mix_PlayChannel: _Mix_PlayChannel,
      _Mix_PlayMusic: _Mix_PlayMusic,
      _RegisterUnityIPodCallbackListener: _RegisterUnityIPodCallbackListener,
      _SDL_CloseAudio: _SDL_CloseAudio,
      _SDL_FreeRW: _SDL_FreeRW,
      _SDL_GL_SwapBuffers: _SDL_GL_SwapBuffers,
      _SDL_GetTicks: _SDL_GetTicks,
      _SDL_LockSurface: _SDL_LockSurface,
      _SDL_PauseAudio: _SDL_PauseAudio,
      _SDL_RWFromConstMem: _SDL_RWFromConstMem,
      _SDL_RWFromFile: _SDL_RWFromFile,
      _SDL_UpperBlit: _SDL_UpperBlit,
      _SDL_UpperBlitScaled: _SDL_UpperBlitScaled,
      _TTF_FontHeight: _TTF_FontHeight,
      _TTF_RenderText_Solid: _TTF_RenderText_Solid,
      _TTF_SizeText: _TTF_SizeText,
      __ZSt18uncaught_exceptionv: __ZSt18uncaught_exceptionv,
      ___buildEnvironment: ___buildEnvironment,
      ___cxa_allocate_exception: ___cxa_allocate_exception,
      ___cxa_begin_catch: ___cxa_begin_catch,
      ___cxa_end_catch: ___cxa_end_catch,
      ___cxa_find_matching_catch: ___cxa_find_matching_catch,
      ___cxa_find_matching_catch_2: ___cxa_find_matching_catch_2,
      ___cxa_find_matching_catch_3: ___cxa_find_matching_catch_3,
      ___cxa_find_matching_catch_4: ___cxa_find_matching_catch_4,
      ___cxa_free_exception: ___cxa_free_exception,
      ___cxa_pure_virtual: ___cxa_pure_virtual,
      ___cxa_rethrow: ___cxa_rethrow,
      ___cxa_throw: ___cxa_throw,
      ___gxx_personality_v0: ___gxx_personality_v0,
      ___lock: ___lock,
      ___map_file: ___map_file,
      ___resumeException: ___resumeException,
      ___setErrNo: ___setErrNo,
      ___syscall10: ___syscall10,
      ___syscall122: ___syscall122,
      ___syscall140: ___syscall140,
      ___syscall142: ___syscall142,
      ___syscall145: ___syscall145,
      ___syscall146: ___syscall146,
      ___syscall15: ___syscall15,
      ___syscall183: ___syscall183,
      ___syscall192: ___syscall192,
      ___syscall193: ___syscall193,
      ___syscall194: ___syscall194,
      ___syscall195: ___syscall195,
      ___syscall196: ___syscall196,
      ___syscall197: ___syscall197,
      ___syscall199: ___syscall199,
      ___syscall202: ___syscall202,
      ___syscall220: ___syscall220,
      ___syscall221: ___syscall221,
      ___syscall268: ___syscall268,
      ___syscall3: ___syscall3,
      ___syscall33: ___syscall33,
      ___syscall38: ___syscall38,
      ___syscall39: ___syscall39,
      ___syscall4: ___syscall4,
      ___syscall40: ___syscall40,
      ___syscall41: ___syscall41,
      ___syscall42: ___syscall42,
      ___syscall5: ___syscall5,
      ___syscall54: ___syscall54,
      ___syscall6: ___syscall6,
      ___syscall77: ___syscall77,
      ___syscall85: ___syscall85,
      ___syscall91: ___syscall91,
      ___unlock: ___unlock,
      __addDays: __addDays,
      __arraySum: __arraySum,
      __emscripten_sample_gamepad_data: __emscripten_sample_gamepad_data,
      __exit: __exit,
      __isLeapYear: __isLeapYear,
      __setLetterbox: __setLetterbox,
      _abort: _abort,
      _atexit: _atexit,
      _clock: _clock,
      _clock_getres: _clock_getres,
      _clock_gettime: _clock_gettime,
      _difftime: _difftime,
      _dlclose: _dlclose,
      _dlopen: _dlopen,
      _dlsym: _dlsym,
      _emscripten_asm_const_iii: _emscripten_asm_const_iii,
      _emscripten_do_request_fullscreen: _emscripten_do_request_fullscreen,
      _emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
      _emscripten_exit_pointerlock: _emscripten_exit_pointerlock,
      _emscripten_get_fullscreen_status: _emscripten_get_fullscreen_status,
      _emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
      _emscripten_get_main_loop_timing: _emscripten_get_main_loop_timing,
      _emscripten_get_now: _emscripten_get_now,
      _emscripten_get_now_is_monotonic: _emscripten_get_now_is_monotonic,
      _emscripten_get_now_res: _emscripten_get_now_res,
      _emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
      _emscripten_glActiveTexture: _emscripten_glActiveTexture,
      _emscripten_glAttachShader: _emscripten_glAttachShader,
      _emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
      _emscripten_glBindBuffer: _emscripten_glBindBuffer,
      _emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
      _emscripten_glBindProgramARB: _emscripten_glBindProgramARB,
      _emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
      _emscripten_glBindTexture: _emscripten_glBindTexture,
      _emscripten_glBindVertexArray: _emscripten_glBindVertexArray,
      _emscripten_glBlendColor: _emscripten_glBlendColor,
      _emscripten_glBlendEquation: _emscripten_glBlendEquation,
      _emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
      _emscripten_glBlendFunc: _emscripten_glBlendFunc,
      _emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
      _emscripten_glBufferData: _emscripten_glBufferData,
      _emscripten_glBufferSubData: _emscripten_glBufferSubData,
      _emscripten_glCheckFramebufferStatus:
        _emscripten_glCheckFramebufferStatus,
      _emscripten_glClear: _emscripten_glClear,
      _emscripten_glClearColor: _emscripten_glClearColor,
      _emscripten_glClearDepth: _emscripten_glClearDepth,
      _emscripten_glClearDepthf: _emscripten_glClearDepthf,
      _emscripten_glClearStencil: _emscripten_glClearStencil,
      _emscripten_glClientActiveTexture: _emscripten_glClientActiveTexture,
      _emscripten_glColorMask: _emscripten_glColorMask,
      _emscripten_glColorPointer: _emscripten_glColorPointer,
      _emscripten_glCompileShader: _emscripten_glCompileShader,
      _emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
      _emscripten_glCompressedTexSubImage2D:
        _emscripten_glCompressedTexSubImage2D,
      _emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
      _emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
      _emscripten_glCreateProgram: _emscripten_glCreateProgram,
      _emscripten_glCreateShader: _emscripten_glCreateShader,
      _emscripten_glCullFace: _emscripten_glCullFace,
      _emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
      _emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
      _emscripten_glDeleteObjectARB: _emscripten_glDeleteObjectARB,
      _emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
      _emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
      _emscripten_glDeleteShader: _emscripten_glDeleteShader,
      _emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
      _emscripten_glDeleteVertexArrays: _emscripten_glDeleteVertexArrays,
      _emscripten_glDepthFunc: _emscripten_glDepthFunc,
      _emscripten_glDepthMask: _emscripten_glDepthMask,
      _emscripten_glDepthRange: _emscripten_glDepthRange,
      _emscripten_glDepthRangef: _emscripten_glDepthRangef,
      _emscripten_glDetachShader: _emscripten_glDetachShader,
      _emscripten_glDisable: _emscripten_glDisable,
      _emscripten_glDisableVertexAttribArray:
        _emscripten_glDisableVertexAttribArray,
      _emscripten_glDrawArrays: _emscripten_glDrawArrays,
      _emscripten_glDrawArraysInstanced: _emscripten_glDrawArraysInstanced,
      _emscripten_glDrawBuffers: _emscripten_glDrawBuffers,
      _emscripten_glDrawElements: _emscripten_glDrawElements,
      _emscripten_glDrawElementsInstanced: _emscripten_glDrawElementsInstanced,
      _emscripten_glDrawRangeElements: _emscripten_glDrawRangeElements,
      _emscripten_glEnable: _emscripten_glEnable,
      _emscripten_glEnableClientState: _emscripten_glEnableClientState,
      _emscripten_glEnableVertexAttribArray:
        _emscripten_glEnableVertexAttribArray,
      _emscripten_glFinish: _emscripten_glFinish,
      _emscripten_glFlush: _emscripten_glFlush,
      _emscripten_glFramebufferRenderbuffer:
        _emscripten_glFramebufferRenderbuffer,
      _emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
      _emscripten_glFrontFace: _emscripten_glFrontFace,
      _emscripten_glFrustum: _emscripten_glFrustum,
      _emscripten_glGenBuffers: _emscripten_glGenBuffers,
      _emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
      _emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
      _emscripten_glGenTextures: _emscripten_glGenTextures,
      _emscripten_glGenVertexArrays: _emscripten_glGenVertexArrays,
      _emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
      _emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
      _emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
      _emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
      _emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
      _emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
      _emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
      _emscripten_glGetError: _emscripten_glGetError,
      _emscripten_glGetFloatv: _emscripten_glGetFloatv,
      _emscripten_glGetFramebufferAttachmentParameteriv:
        _emscripten_glGetFramebufferAttachmentParameteriv,
      _emscripten_glGetInfoLogARB: _emscripten_glGetInfoLogARB,
      _emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
      _emscripten_glGetObjectParameterivARB:
        _emscripten_glGetObjectParameterivARB,
      _emscripten_glGetPointerv: _emscripten_glGetPointerv,
      _emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
      _emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
      _emscripten_glGetRenderbufferParameteriv:
        _emscripten_glGetRenderbufferParameteriv,
      _emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
      _emscripten_glGetShaderPrecisionFormat:
        _emscripten_glGetShaderPrecisionFormat,
      _emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
      _emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
      _emscripten_glGetString: _emscripten_glGetString,
      _emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
      _emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
      _emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
      _emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
      _emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
      _emscripten_glGetVertexAttribPointerv:
        _emscripten_glGetVertexAttribPointerv,
      _emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
      _emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
      _emscripten_glHint: _emscripten_glHint,
      _emscripten_glIsBuffer: _emscripten_glIsBuffer,
      _emscripten_glIsEnabled: _emscripten_glIsEnabled,
      _emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
      _emscripten_glIsProgram: _emscripten_glIsProgram,
      _emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
      _emscripten_glIsShader: _emscripten_glIsShader,
      _emscripten_glIsTexture: _emscripten_glIsTexture,
      _emscripten_glIsVertexArray: _emscripten_glIsVertexArray,
      _emscripten_glLineWidth: _emscripten_glLineWidth,
      _emscripten_glLinkProgram: _emscripten_glLinkProgram,
      _emscripten_glLoadIdentity: _emscripten_glLoadIdentity,
      _emscripten_glLoadMatrixf: _emscripten_glLoadMatrixf,
      _emscripten_glMatrixMode: _emscripten_glMatrixMode,
      _emscripten_glNormalPointer: _emscripten_glNormalPointer,
      _emscripten_glPixelStorei: _emscripten_glPixelStorei,
      _emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
      _emscripten_glReadPixels: _emscripten_glReadPixels,
      _emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
      _emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
      _emscripten_glRotatef: _emscripten_glRotatef,
      _emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
      _emscripten_glScissor: _emscripten_glScissor,
      _emscripten_glShaderBinary: _emscripten_glShaderBinary,
      _emscripten_glShaderSource: _emscripten_glShaderSource,
      _emscripten_glStencilFunc: _emscripten_glStencilFunc,
      _emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
      _emscripten_glStencilMask: _emscripten_glStencilMask,
      _emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
      _emscripten_glStencilOp: _emscripten_glStencilOp,
      _emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
      _emscripten_glTexCoordPointer: _emscripten_glTexCoordPointer,
      _emscripten_glTexImage2D: _emscripten_glTexImage2D,
      _emscripten_glTexParameterf: _emscripten_glTexParameterf,
      _emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
      _emscripten_glTexParameteri: _emscripten_glTexParameteri,
      _emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
      _emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
      _emscripten_glUniform1f: _emscripten_glUniform1f,
      _emscripten_glUniform1fv: _emscripten_glUniform1fv,
      _emscripten_glUniform1i: _emscripten_glUniform1i,
      _emscripten_glUniform1iv: _emscripten_glUniform1iv,
      _emscripten_glUniform2f: _emscripten_glUniform2f,
      _emscripten_glUniform2fv: _emscripten_glUniform2fv,
      _emscripten_glUniform2i: _emscripten_glUniform2i,
      _emscripten_glUniform2iv: _emscripten_glUniform2iv,
      _emscripten_glUniform3f: _emscripten_glUniform3f,
      _emscripten_glUniform3fv: _emscripten_glUniform3fv,
      _emscripten_glUniform3i: _emscripten_glUniform3i,
      _emscripten_glUniform3iv: _emscripten_glUniform3iv,
      _emscripten_glUniform4f: _emscripten_glUniform4f,
      _emscripten_glUniform4fv: _emscripten_glUniform4fv,
      _emscripten_glUniform4i: _emscripten_glUniform4i,
      _emscripten_glUniform4iv: _emscripten_glUniform4iv,
      _emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
      _emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
      _emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
      _emscripten_glUseProgram: _emscripten_glUseProgram,
      _emscripten_glValidateProgram: _emscripten_glValidateProgram,
      _emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
      _emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
      _emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
      _emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
      _emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
      _emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
      _emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
      _emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
      _emscripten_glVertexAttribDivisor: _emscripten_glVertexAttribDivisor,
      _emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
      _emscripten_glVertexPointer: _emscripten_glVertexPointer,
      _emscripten_glViewport: _emscripten_glViewport,
      _emscripten_is_webgl_context_lost: _emscripten_is_webgl_context_lost,
      _emscripten_longjmp: _emscripten_longjmp,
      _emscripten_memcpy_big: _emscripten_memcpy_big,
      _emscripten_request_fullscreen: _emscripten_request_fullscreen,
      _emscripten_request_pointerlock: _emscripten_request_pointerlock,
      _emscripten_set_blur_callback: _emscripten_set_blur_callback,
      _emscripten_set_canvas_size: _emscripten_set_canvas_size,
      _emscripten_set_devicemotion_callback:
        _emscripten_set_devicemotion_callback,
      _emscripten_set_deviceorientation_callback:
        _emscripten_set_deviceorientation_callback,
      _emscripten_set_focus_callback: _emscripten_set_focus_callback,
      _emscripten_set_fullscreenchange_callback:
        _emscripten_set_fullscreenchange_callback,
      _emscripten_set_keydown_callback: _emscripten_set_keydown_callback,
      _emscripten_set_keypress_callback: _emscripten_set_keypress_callback,
      _emscripten_set_keyup_callback: _emscripten_set_keyup_callback,
      _emscripten_set_main_loop: _emscripten_set_main_loop,
      _emscripten_set_main_loop_timing: _emscripten_set_main_loop_timing,
      _emscripten_set_mousedown_callback: _emscripten_set_mousedown_callback,
      _emscripten_set_mousemove_callback: _emscripten_set_mousemove_callback,
      _emscripten_set_mouseup_callback: _emscripten_set_mouseup_callback,
      _emscripten_set_touchcancel_callback:
        _emscripten_set_touchcancel_callback,
      _emscripten_set_touchend_callback: _emscripten_set_touchend_callback,
      _emscripten_set_touchmove_callback: _emscripten_set_touchmove_callback,
      _emscripten_set_touchstart_callback: _emscripten_set_touchstart_callback,
      _emscripten_set_wheel_callback: _emscripten_set_wheel_callback,
      _emscripten_webgl_create_context: _emscripten_webgl_create_context,
      _emscripten_webgl_destroy_context: _emscripten_webgl_destroy_context,
      _emscripten_webgl_enable_extension: _emscripten_webgl_enable_extension,
      _emscripten_webgl_get_current_context:
        _emscripten_webgl_get_current_context,
      _emscripten_webgl_make_context_current:
        _emscripten_webgl_make_context_current,
      _exit: _exit,
      _flock: _flock,
      _getenv: _getenv,
      _getpwuid: _getpwuid,
      _gettimeofday: _gettimeofday,
      _glActiveTexture: _glActiveTexture,
      _glAttachShader: _glAttachShader,
      _glBeginQuery: _glBeginQuery,
      _glBeginTransformFeedback: _glBeginTransformFeedback,
      _glBindAttribLocation: _glBindAttribLocation,
      _glBindBuffer: _glBindBuffer,
      _glBindBufferBase: _glBindBufferBase,
      _glBindFramebuffer: _glBindFramebuffer,
      _glBindRenderbuffer: _glBindRenderbuffer,
      _glBindSampler: _glBindSampler,
      _glBindTexture: _glBindTexture,
      _glBindTransformFeedback: _glBindTransformFeedback,
      _glBindVertexArray: _glBindVertexArray,
      _glBlendEquation: _glBlendEquation,
      _glBlendEquationSeparate: _glBlendEquationSeparate,
      _glBlendFuncSeparate: _glBlendFuncSeparate,
      _glBlitFramebuffer: _glBlitFramebuffer,
      _glBufferData: _glBufferData,
      _glBufferSubData: _glBufferSubData,
      _glCheckFramebufferStatus: _glCheckFramebufferStatus,
      _glClear: _glClear,
      _glClearColor: _glClearColor,
      _glClearDepthf: _glClearDepthf,
      _glClearStencil: _glClearStencil,
      _glClientWaitSync: _glClientWaitSync,
      _glColorMask: _glColorMask,
      _glCompileShader: _glCompileShader,
      _glCompressedTexImage2D: _glCompressedTexImage2D,
      _glCompressedTexSubImage2D: _glCompressedTexSubImage2D,
      _glCompressedTexSubImage3D: _glCompressedTexSubImage3D,
      _glCopyBufferSubData: _glCopyBufferSubData,
      _glCopyTexImage2D: _glCopyTexImage2D,
      _glCopyTexSubImage2D: _glCopyTexSubImage2D,
      _glCreateProgram: _glCreateProgram,
      _glCreateShader: _glCreateShader,
      _glCullFace: _glCullFace,
      _glDeleteBuffers: _glDeleteBuffers,
      _glDeleteFramebuffers: _glDeleteFramebuffers,
      _glDeleteProgram: _glDeleteProgram,
      _glDeleteQueries: _glDeleteQueries,
      _glDeleteRenderbuffers: _glDeleteRenderbuffers,
      _glDeleteSamplers: _glDeleteSamplers,
      _glDeleteShader: _glDeleteShader,
      _glDeleteSync: _glDeleteSync,
      _glDeleteTextures: _glDeleteTextures,
      _glDeleteTransformFeedbacks: _glDeleteTransformFeedbacks,
      _glDeleteVertexArrays: _glDeleteVertexArrays,
      _glDepthFunc: _glDepthFunc,
      _glDepthMask: _glDepthMask,
      _glDetachShader: _glDetachShader,
      _glDisable: _glDisable,
      _glDisableVertexAttribArray: _glDisableVertexAttribArray,
      _glDrawArrays: _glDrawArrays,
      _glDrawArraysInstanced: _glDrawArraysInstanced,
      _glDrawBuffers: _glDrawBuffers,
      _glDrawElements: _glDrawElements,
      _glDrawElementsInstanced: _glDrawElementsInstanced,
      _glEnable: _glEnable,
      _glEnableVertexAttribArray: _glEnableVertexAttribArray,
      _glEndQuery: _glEndQuery,
      _glEndTransformFeedback: _glEndTransformFeedback,
      _glFenceSync: _glFenceSync,
      _glFinish: _glFinish,
      _glFlush: _glFlush,
      _glFlushMappedBufferRange: _glFlushMappedBufferRange,
      _glFramebufferRenderbuffer: _glFramebufferRenderbuffer,
      _glFramebufferTexture2D: _glFramebufferTexture2D,
      _glFramebufferTextureLayer: _glFramebufferTextureLayer,
      _glFrontFace: _glFrontFace,
      _glGenBuffers: _glGenBuffers,
      _glGenFramebuffers: _glGenFramebuffers,
      _glGenQueries: _glGenQueries,
      _glGenRenderbuffers: _glGenRenderbuffers,
      _glGenSamplers: _glGenSamplers,
      _glGenTextures: _glGenTextures,
      _glGenTransformFeedbacks: _glGenTransformFeedbacks,
      _glGenVertexArrays: _glGenVertexArrays,
      _glGenerateMipmap: _glGenerateMipmap,
      _glGetActiveAttrib: _glGetActiveAttrib,
      _glGetActiveUniform: _glGetActiveUniform,
      _glGetActiveUniformBlockName: _glGetActiveUniformBlockName,
      _glGetActiveUniformBlockiv: _glGetActiveUniformBlockiv,
      _glGetActiveUniformsiv: _glGetActiveUniformsiv,
      _glGetAttribLocation: _glGetAttribLocation,
      _glGetError: _glGetError,
      _glGetFramebufferAttachmentParameteriv:
        _glGetFramebufferAttachmentParameteriv,
      _glGetIntegeri_v: _glGetIntegeri_v,
      _glGetIntegerv: _glGetIntegerv,
      _glGetProgramBinary: _glGetProgramBinary,
      _glGetProgramInfoLog: _glGetProgramInfoLog,
      _glGetProgramiv: _glGetProgramiv,
      _glGetRenderbufferParameteriv: _glGetRenderbufferParameteriv,
      _glGetShaderInfoLog: _glGetShaderInfoLog,
      _glGetShaderPrecisionFormat: _glGetShaderPrecisionFormat,
      _glGetShaderSource: _glGetShaderSource,
      _glGetShaderiv: _glGetShaderiv,
      _glGetString: _glGetString,
      _glGetStringi: _glGetStringi,
      _glGetTexParameteriv: _glGetTexParameteriv,
      _glGetUniformBlockIndex: _glGetUniformBlockIndex,
      _glGetUniformIndices: _glGetUniformIndices,
      _glGetUniformLocation: _glGetUniformLocation,
      _glGetUniformiv: _glGetUniformiv,
      _glGetVertexAttribiv: _glGetVertexAttribiv,
      _glInvalidateFramebuffer: _glInvalidateFramebuffer,
      _glIsEnabled: _glIsEnabled,
      _glIsVertexArray: _glIsVertexArray,
      _glLinkProgram: _glLinkProgram,
      _glMapBufferRange: _glMapBufferRange,
      _glPixelStorei: _glPixelStorei,
      _glPolygonOffset: _glPolygonOffset,
      _glProgramBinary: _glProgramBinary,
      _glProgramParameteri: _glProgramParameteri,
      _glReadBuffer: _glReadBuffer,
      _glReadPixels: _glReadPixels,
      _glRenderbufferStorage: _glRenderbufferStorage,
      _glRenderbufferStorageMultisample: _glRenderbufferStorageMultisample,
      _glSamplerParameteri: _glSamplerParameteri,
      _glScissor: _glScissor,
      _glShaderSource: _glShaderSource,
      _glStencilFuncSeparate: _glStencilFuncSeparate,
      _glStencilMask: _glStencilMask,
      _glStencilOpSeparate: _glStencilOpSeparate,
      _glTexImage2D: _glTexImage2D,
      _glTexImage3D: _glTexImage3D,
      _glTexParameterf: _glTexParameterf,
      _glTexParameteri: _glTexParameteri,
      _glTexParameteriv: _glTexParameteriv,
      _glTexStorage2D: _glTexStorage2D,
      _glTexStorage3D: _glTexStorage3D,
      _glTexSubImage2D: _glTexSubImage2D,
      _glTexSubImage3D: _glTexSubImage3D,
      _glTransformFeedbackVaryings: _glTransformFeedbackVaryings,
      _glUniform1fv: _glUniform1fv,
      _glUniform1i: _glUniform1i,
      _glUniform1iv: _glUniform1iv,
      _glUniform1uiv: _glUniform1uiv,
      _glUniform2fv: _glUniform2fv,
      _glUniform2iv: _glUniform2iv,
      _glUniform2uiv: _glUniform2uiv,
      _glUniform3fv: _glUniform3fv,
      _glUniform3iv: _glUniform3iv,
      _glUniform3uiv: _glUniform3uiv,
      _glUniform4fv: _glUniform4fv,
      _glUniform4iv: _glUniform4iv,
      _glUniform4uiv: _glUniform4uiv,
      _glUniformBlockBinding: _glUniformBlockBinding,
      _glUniformMatrix3fv: _glUniformMatrix3fv,
      _glUniformMatrix4fv: _glUniformMatrix4fv,
      _glUnmapBuffer: _glUnmapBuffer,
      _glUseProgram: _glUseProgram,
      _glValidateProgram: _glValidateProgram,
      _glVertexAttrib4f: _glVertexAttrib4f,
      _glVertexAttrib4fv: _glVertexAttrib4fv,
      _glVertexAttribIPointer: _glVertexAttribIPointer,
      _glVertexAttribPointer: _glVertexAttribPointer,
      _glViewport: _glViewport,
      _gmtime: _gmtime,
      _gmtime_r: _gmtime_r,
      _llvm_ceil_f32: _llvm_ceil_f32,
      _llvm_ceil_f64: _llvm_ceil_f64,
      _llvm_cttz_i32: _llvm_cttz_i32,
      _llvm_eh_typeid_for: _llvm_eh_typeid_for,
      _llvm_exp2_f32: _llvm_exp2_f32,
      _llvm_exp2_f64: _llvm_exp2_f64,
      _llvm_fabs_f32: _llvm_fabs_f32,
      _llvm_fabs_f64: _llvm_fabs_f64,
      _llvm_floor_f32: _llvm_floor_f32,
      _llvm_floor_f64: _llvm_floor_f64,
      _llvm_pow_f32: _llvm_pow_f32,
      _llvm_pow_f64: _llvm_pow_f64,
      _llvm_trap: _llvm_trap,
      _localtime: _localtime,
      _localtime_r: _localtime_r,
      _longjmp: _longjmp,
      _mktime: _mktime,
      _pthread_attr_destroy: _pthread_attr_destroy,
      _pthread_attr_init: _pthread_attr_init,
      _pthread_cond_destroy: _pthread_cond_destroy,
      _pthread_cond_init: _pthread_cond_init,
      _pthread_cond_signal: _pthread_cond_signal,
      _pthread_cond_timedwait: _pthread_cond_timedwait,
      _pthread_cond_wait: _pthread_cond_wait,
      _pthread_create: _pthread_create,
      _pthread_detach: _pthread_detach,
      _pthread_getspecific: _pthread_getspecific,
      _pthread_key_create: _pthread_key_create,
      _pthread_key_delete: _pthread_key_delete,
      _pthread_mutex_destroy: _pthread_mutex_destroy,
      _pthread_mutex_init: _pthread_mutex_init,
      _pthread_mutexattr_destroy: _pthread_mutexattr_destroy,
      _pthread_mutexattr_init: _pthread_mutexattr_init,
      _pthread_mutexattr_settype: _pthread_mutexattr_settype,
      _pthread_once: _pthread_once,
      _pthread_rwlock_init: _pthread_rwlock_init,
      _pthread_rwlock_rdlock: _pthread_rwlock_rdlock,
      _pthread_rwlock_unlock: _pthread_rwlock_unlock,
      _pthread_rwlock_wrlock: _pthread_rwlock_wrlock,
      _pthread_setspecific: _pthread_setspecific,
      _putenv: _putenv,
      _sched_yield: _sched_yield,
      _setenv: _setenv,
      _sigaction: _sigaction,
      _sigemptyset: _sigemptyset,
      _strftime: _strftime,
      _sysconf: _sysconf,
      _time: _time,
      _tzset: _tzset,
      _unsetenv: _unsetenv,
      _utime: _utime,
      emscriptenWebGLComputeImageSize: emscriptenWebGLComputeImageSize,
      emscriptenWebGLGet: emscriptenWebGLGet,
      emscriptenWebGLGetBufferBinding: emscriptenWebGLGetBufferBinding,
      emscriptenWebGLGetHeapForType: emscriptenWebGLGetHeapForType,
      emscriptenWebGLGetIndexed: emscriptenWebGLGetIndexed,
      emscriptenWebGLGetShiftForType: emscriptenWebGLGetShiftForType,
      emscriptenWebGLGetTexPixelData: emscriptenWebGLGetTexPixelData,
      emscriptenWebGLGetUniform: emscriptenWebGLGetUniform,
      emscriptenWebGLGetVertexAttrib: emscriptenWebGLGetVertexAttrib,
      emscriptenWebGLValidateMapBufferTarget:
        emscriptenWebGLValidateMapBufferTarget,
      DYNAMICTOP_PTR: DYNAMICTOP_PTR,
      tempDoublePtr: tempDoublePtr,
      ABORT: ABORT,
      STACKTOP: STACKTOP,
      STACK_MAX: STACK_MAX,
      cttz_i8: cttz_i8,
      _environ: _environ,
    }),
    (asm = Module["asm"](Module.asmGlobalArg, Module.asmLibraryArg, buffer)),
    (Module["asm"] = asm),
    (_SendMessage = Module["_SendMessage"] =
      function () {
        return Module["asm"]["_SendMessage"].apply(null, arguments);
      }),
    (_SendMessageFloat = Module["_SendMessageFloat"] =
      function () {
        return Module["asm"]["_SendMessageFloat"].apply(null, arguments);
      }),
    (_SendMessageString = Module["_SendMessageString"] =
      function () {
        return Module["asm"]["_SendMessageString"].apply(null, arguments);
      }),
    (_SetFullscreen = Module["_SetFullscreen"] =
      function () {
        return Module["asm"]["_SetFullscreen"].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_AIScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_AIScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_AIScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_ARScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_ARScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_ARScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_AccessibilityScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_AccessibilityScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_AccessibilityScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_AnimationClip_cpp = Module[
      "__GLOBAL__sub_I_AnimationClip_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_AnimationClip_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_AnimationScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_AnimationScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_AnimationScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_AppDomain_cpp = Module["__GLOBAL__sub_I_AppDomain_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_AppDomain_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_ArrayMetadata_cpp = Module[
      "__GLOBAL__sub_I_ArrayMetadata_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_ArrayMetadata_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Assembly_cpp = Module["__GLOBAL__sub_I_Assembly_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Assembly_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Assembly_cpp_56069 = Module[
      "__GLOBAL__sub_I_Assembly_cpp_56069"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Assembly_cpp_56069"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_AssetBundleFileSystem_cpp = Module[
      "__GLOBAL__sub_I_AssetBundleFileSystem_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_AssetBundleFileSystem_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_AssetBundleScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_AssetBundleScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_AssetBundleScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_AudioScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_AudioScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_AudioScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Avatar_cpp = Module["__GLOBAL__sub_I_Avatar_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Avatar_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_BoehmGC_cpp = Module["__GLOBAL__sub_I_BoehmGC_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_BoehmGC_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Class_cpp = Module["__GLOBAL__sub_I_Class_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Class_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_ClothScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_ClothScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_ClothScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_CmEventProfiler_cpp = Module[
      "__GLOBAL__sub_I_CmEventProfiler_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_CmEventProfiler_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Console_cpp = Module["__GLOBAL__sub_I_Console_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Console_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_ConstraintManager_cpp = Module[
      "__GLOBAL__sub_I_ConstraintManager_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_ConstraintManager_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_DirectorScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_DirectorScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_DirectorScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Environment_cpp = Module[
      "__GLOBAL__sub_I_Environment_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Environment_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Error_cpp = Module["__GLOBAL__sub_I_Error_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Error_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_External_Yoga_Yoga_0_cpp = Module[
      "__GLOBAL__sub_I_External_Yoga_Yoga_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_External_Yoga_Yoga_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_File_cpp = Module["__GLOBAL__sub_I_File_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_File_cpp"].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_GCHandle_cpp = Module["__GLOBAL__sub_I_GCHandle_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_GCHandle_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_GarbageCollector_cpp = Module[
      "__GLOBAL__sub_I_GarbageCollector_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_GarbageCollector_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_GenericMetadata_cpp = Module[
      "__GLOBAL__sub_I_GenericMetadata_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_GenericMetadata_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_GenericMethod_cpp = Module[
      "__GLOBAL__sub_I_GenericMethod_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_GenericMethod_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_IMGUIScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_IMGUIScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_IMGUIScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Il2CppCodeRegistration_cpp = Module[
      "__GLOBAL__sub_I_Il2CppCodeRegistration_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Il2CppCodeRegistration_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Image_cpp = Module["__GLOBAL__sub_I_Image_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Image_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_InputScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_InputScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_InputScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Interlocked_cpp = Module[
      "__GLOBAL__sub_I_Interlocked_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Interlocked_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_LibraryLoader_cpp = Module[
      "__GLOBAL__sub_I_LibraryLoader_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_LibraryLoader_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_MemoryMapImpl_cpp = Module[
      "__GLOBAL__sub_I_MemoryMapImpl_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_MemoryMapImpl_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_MemoryMappedFile_cpp = Module[
      "__GLOBAL__sub_I_MemoryMappedFile_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_MemoryMappedFile_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_MetadataCache_cpp = Module[
      "__GLOBAL__sub_I_MetadataCache_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_MetadataCache_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Modules_AssetBundle_Public_1_cpp = Module[
      "__GLOBAL__sub_I_Modules_AssetBundle_Public_1_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_AssetBundle_Public_1_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Audio_Public_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Audio_Public_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Audio_Public_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Audio_Public_1_cpp = Module[
      "__GLOBAL__sub_I_Modules_Audio_Public_1_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Audio_Public_1_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Audio_Public_3_cpp = Module[
      "__GLOBAL__sub_I_Modules_Audio_Public_3_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Audio_Public_3_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_CloudWebServices_Public_Session_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_CloudWebServices_Public_Session_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_CloudWebServices_Public_Session_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Grid_Public_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Grid_Public_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Modules_Grid_Public_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Modules_IMGUI_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_IMGUI_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Modules_IMGUI_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Modules_IMGUI_1_cpp = Module[
      "__GLOBAL__sub_I_Modules_IMGUI_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Modules_IMGUI_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Modules_Physics2D_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Physics2D_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Modules_Physics2D_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Physics2D_Public_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Profiler_Public_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Profiler_Public_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Profiler_Public_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Profiler_Runtime_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Profiler_Runtime_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Profiler_Runtime_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Terrain_Public_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Terrain_Public_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Terrain_Public_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Terrain_Public_1_cpp = Module[
      "__GLOBAL__sub_I_Modules_Terrain_Public_1_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Terrain_Public_1_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Terrain_Public_2_cpp = Module[
      "__GLOBAL__sub_I_Modules_Terrain_Public_2_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Terrain_Public_2_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Terrain_VR_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Terrain_VR_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Modules_Terrain_VR_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_TextRendering_Public_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_Tilemap_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Tilemap_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Modules_Tilemap_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_Tilemap_Public_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp = Module[
      "__GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_UnityWebRequest_Public_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp = Module[
      "__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Modules_XR_Subsystems_Input_Public_1_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_NativeDelegateMethodCache_cpp = Module[
      "__GLOBAL__sub_I_NativeDelegateMethodCache_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_NativeDelegateMethodCache_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_ParticleSystemRenderer_cpp = Module[
      "__GLOBAL__sub_I_ParticleSystemRenderer_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_ParticleSystemRenderer_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_ParticleSystemScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Path_cpp = Module["__GLOBAL__sub_I_Path_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Path_cpp"].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Physics2DScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_Physics2DScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Physics2DScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_PhysicsScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_PhysicsScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_PhysicsScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp = Module[
      "__GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_PlatformDependent_WebGL_Source_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_PxsFluidDynamics_cpp = Module[
      "__GLOBAL__sub_I_PxsFluidDynamics_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_PxsFluidDynamics_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_RCW_cpp = Module["__GLOBAL__sub_I_RCW_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_RCW_cpp"].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Reflection_cpp = Module["__GLOBAL__sub_I_Reflection_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Reflection_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_2D_Sorting_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_2D_SpriteAtlas_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Allocator_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Allocator_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Allocator_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Animation_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Animation_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Animation_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Animation_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Animation_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Animation_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Animation_4_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Animation_4_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Animation_4_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Application_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Application_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Application_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_BaseClasses_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_BaseClasses_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_BaseClasses_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_BaseClasses_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_BaseClasses_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_BaseClasses_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_BaseClasses_3_cpp = Module[
      "__GLOBAL__sub_I_Runtime_BaseClasses_3_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_BaseClasses_3_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Burst_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Burst_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Burst_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Camera_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Camera_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Camera_3_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_3_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_3_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Camera_5_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_5_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_5_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Camera_6_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_6_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Camera_6_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Camera_Culling_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Camera_RenderLayers_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Camera_RenderLoops_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Camera_RenderLoops_2_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Cloth_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Cloth_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Cloth_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Containers_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Containers_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Containers_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Core_Callbacks_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Director_Core_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Director_Core_1_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Director_Core_1_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Dynamics_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Dynamics_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Dynamics_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Dynamics_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Dynamics_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Dynamics_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Geometry_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Geometry_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Geometry_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_GfxDevice_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_GfxDevice_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_GfxDevice_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_GfxDevice_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_GfxDevice_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_GfxDevice_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_GfxDevice_3_cpp = Module[
      "__GLOBAL__sub_I_Runtime_GfxDevice_3_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_GfxDevice_3_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_10_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_10_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_10_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_11_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_11_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_11_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_5_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_5_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_5_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_6_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_6_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_6_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_8_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_8_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_8_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_9_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_9_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Graphics_9_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Graphics_Billboard_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Graphics_LOD_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Graphics_Mesh_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Graphics_Mesh_1_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_Mesh_3_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_Mesh_3_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Graphics_Mesh_3_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Graphics_ScriptableRenderLoop_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Input_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Input_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Input_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Interfaces_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Interfaces_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Interfaces_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Interfaces_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Interfaces_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Interfaces_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Interfaces_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Jobs_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Jobs_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Jobs_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Jobs_ScriptBindings_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Logging_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Logging_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Logging_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Math_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Math_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Math_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Math_Random_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Math_Random_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Math_Random_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Misc_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Misc_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Misc_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Misc_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Misc_4_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Misc_4_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_4_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Misc_5_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Misc_5_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Misc_5_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Modules_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Modules_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Modules_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp =
      Module[
        "__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp"
      ] =
        function () {
          return Module["asm"][
            "__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_0_cpp"
          ].apply(null, arguments);
        }),
    (__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp =
      Module[
        "__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp"
      ] =
        function () {
          return Module["asm"][
            "__GLOBAL__sub_I_Runtime_Mono_SerializationBackend_DirectMemoryAccess_1_cpp"
          ].apply(null, arguments);
        }),
    (__GLOBAL__sub_I_Runtime_ParticleSystem_Modules_3_cpp = Module[
      "__GLOBAL__sub_I_Runtime_ParticleSystem_Modules_3_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_ParticleSystem_Modules_3_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_PluginInterface_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_PluginInterface_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_PluginInterface_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_PreloadManager_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_PreloadManager_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_PreloadManager_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_SceneManager_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_SceneManager_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_SceneManager_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_ScriptingBackend_Il2Cpp_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Scripting_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Scripting_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Scripting_3_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Scripting_3_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Scripting_3_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Serialize_TransferFunctions_1_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Shaders_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Shaders_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Shaders_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Shaders_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Shaders_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_Shaders_ShaderImpl_1_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Transform_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Transform_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Transform_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Transform_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Transform_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Transform_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_UI_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_UI_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_UI_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_UI_1_cpp = Module[
      "__GLOBAL__sub_I_Runtime_UI_1_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_UI_1_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_UI_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_UI_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_UI_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Utilities_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Utilities_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Utilities_4_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Utilities_4_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_4_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Utilities_5_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Utilities_5_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_5_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Utilities_6_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Utilities_6_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_6_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Utilities_8_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Utilities_8_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Utilities_8_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_VR_2_cpp = Module[
      "__GLOBAL__sub_I_Runtime_VR_2_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_VR_2_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_VR_PluginInterface_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_VR_PluginInterface_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_VR_PluginInterface_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_Vehicles_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Vehicles_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Vehicles_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_Video_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_Video_0_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_Video_0_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp = Module[
      "__GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_Runtime_VirtualFileSystem_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Runtime_cpp = Module["__GLOBAL__sub_I_Runtime_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Runtime_cpp_56678 = Module[
      "__GLOBAL__sub_I_Runtime_cpp_56678"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Runtime_cpp_56678"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Shader_cpp = Module["__GLOBAL__sub_I_Shader_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Shader_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_ShapeModule_cpp = Module[
      "__GLOBAL__sub_I_ShapeModule_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_ShapeModule_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Socket_cpp = Module["__GLOBAL__sub_I_Socket_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Socket_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_SparseTextureGLES_cpp = Module[
      "__GLOBAL__sub_I_SparseTextureGLES_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_SparseTextureGLES_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_SpriteRendererJobs_cpp = Module[
      "__GLOBAL__sub_I_SpriteRendererJobs_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_SpriteRendererJobs_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_StackTrace_cpp = Module["__GLOBAL__sub_I_StackTrace_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_StackTrace_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_String_cpp = Module["__GLOBAL__sub_I_String_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_String_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_SwCollision_cpp = Module[
      "__GLOBAL__sub_I_SwCollision_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_SwCollision_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_SwInterCollision_cpp = Module[
      "__GLOBAL__sub_I_SwInterCollision_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_SwInterCollision_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_SwSelfCollision_cpp = Module[
      "__GLOBAL__sub_I_SwSelfCollision_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_SwSelfCollision_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_SwSolverKernel_cpp = Module[
      "__GLOBAL__sub_I_SwSolverKernel_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_SwSolverKernel_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_TerrainScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_TerrainScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_TerrainScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_TextRenderingScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_TextRenderingScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_TextRenderingScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_ThreadImpl_cpp = Module["__GLOBAL__sub_I_ThreadImpl_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_ThreadImpl_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Thread_cpp = Module["__GLOBAL__sub_I_Thread_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Thread_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Thread_cpp_55403 = Module[
      "__GLOBAL__sub_I_Thread_cpp_55403"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Thread_cpp_55403"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_TilemapScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_TilemapScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_TilemapScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_TransformFeedbackSkinning_cpp = Module[
      "__GLOBAL__sub_I_TransformFeedbackSkinning_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_TransformFeedbackSkinning_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_Transform_cpp = Module["__GLOBAL__sub_I_Transform_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Transform_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_UIElementsScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_UIElementsScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_UIElementsScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_UIScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_UIScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_UIScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_UnityAdsSettings_cpp = Module[
      "__GLOBAL__sub_I_UnityAdsSettings_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_UnityAdsSettings_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_UnityAnalyticsScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_UnityWebRequestScriptingClasses_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_VideoScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_VideoScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_VideoScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_Wind_cpp = Module["__GLOBAL__sub_I_Wind_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_Wind_cpp"].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_XRScriptingClasses_cpp = Module[
      "__GLOBAL__sub_I_XRScriptingClasses_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_XRScriptingClasses_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp = Module[
      "__GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp"
    ] =
      function () {
        return Module["asm"][
          "__GLOBAL__sub_I_artifacts_WebGL_codegenerator_0_cpp"
        ].apply(null, arguments);
      }),
    (__GLOBAL__sub_I_threadpool_ms_cpp = Module[
      "__GLOBAL__sub_I_threadpool_ms_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_threadpool_ms_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_threadpool_ms_io_cpp = Module[
      "__GLOBAL__sub_I_threadpool_ms_io_cpp"
    ] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_threadpool_ms_io_cpp"].apply(
          null,
          arguments
        );
      }),
    (__GLOBAL__sub_I_umbra_cpp = Module["__GLOBAL__sub_I_umbra_cpp"] =
      function () {
        return Module["asm"]["__GLOBAL__sub_I_umbra_cpp"].apply(
          null,
          arguments
        );
      }),
    (___cxa_can_catch = Module["___cxa_can_catch"] =
      function () {
        return Module["asm"]["___cxa_can_catch"].apply(null, arguments);
      }),
    (___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] =
      function () {
        return Module["asm"]["___cxa_is_pointer_type"].apply(null, arguments);
      }),
    (___cxx_global_var_init_110 = Module["___cxx_global_var_init_110"] =
      function () {
        return Module["asm"]["___cxx_global_var_init_110"].apply(
          null,
          arguments
        );
      }),
    (___cxx_global_var_init_124 = Module["___cxx_global_var_init_124"] =
      function () {
        return Module["asm"]["___cxx_global_var_init_124"].apply(
          null,
          arguments
        );
      }),
    (___cxx_global_var_init_13 = Module["___cxx_global_var_init_13"] =
      function () {
        return Module["asm"]["___cxx_global_var_init_13"].apply(
          null,
          arguments
        );
      }),
    (___cxx_global_var_init_18 = Module["___cxx_global_var_init_18"] =
      function () {
        return Module["asm"]["___cxx_global_var_init_18"].apply(
          null,
          arguments
        );
      }),
    (___cxx_global_var_init_21 = Module["___cxx_global_var_init_21"] =
      function () {
        return Module["asm"]["___cxx_global_var_init_21"].apply(
          null,
          arguments
        );
      }),
    (___cxx_global_var_init_2888 = Module["___cxx_global_var_init_2888"] =
      function () {
        return Module["asm"]["___cxx_global_var_init_2888"].apply(
          null,
          arguments
        );
      }),
    (___cxx_global_var_init_2_758 = Module["___cxx_global_var_init_2_758"] =
      function () {
        return Module["asm"]["___cxx_global_var_init_2_758"].apply(
          null,
          arguments
        );
      }),
    (___cxx_global_var_init_34 = Module["___cxx_global_var_init_34"] =
      function () {
        return Module["asm"]["___cxx_global_var_init_34"].apply(
          null,
          arguments
        );
      }),
    (___errno_location = Module["___errno_location"] =
      function () {
        return Module["asm"]["___errno_location"].apply(null, arguments);
      }),
    (_emscripten_replace_memory = Module["_emscripten_replace_memory"] =
      function () {
        return Module["asm"]["_emscripten_replace_memory"].apply(
          null,
          arguments
        );
      }),
    (_free = Module["_free"] =
      function () {
        return Module["asm"]["_free"].apply(null, arguments);
      }),
    (_htonl = Module["_htonl"] =
      function () {
        return Module["asm"]["_htonl"].apply(null, arguments);
      }),
    (_htons = Module["_htons"] =
      function () {
        return Module["asm"]["_htons"].apply(null, arguments);
      }),
    (_llvm_bswap_i16 = Module["_llvm_bswap_i16"] =
      function () {
        return Module["asm"]["_llvm_bswap_i16"].apply(null, arguments);
      }),
    (_llvm_bswap_i32 = Module["_llvm_bswap_i32"] =
      function () {
        return Module["asm"]["_llvm_bswap_i32"].apply(null, arguments);
      }),
    (_llvm_ctlz_i64 = Module["_llvm_ctlz_i64"] =
      function () {
        return Module["asm"]["_llvm_ctlz_i64"].apply(null, arguments);
      }),
    (_main = Module["_main"] =
      function () {
        return Module["asm"]["_main"].apply(null, arguments);
      }),
    (_malloc = Module["_malloc"] =
      function () {
        return Module["asm"]["_malloc"].apply(null, arguments);
      }),
    (_memalign = Module["_memalign"] =
      function () {
        return Module["asm"]["_memalign"].apply(null, arguments);
      }),
    (_memcpy = Module["_memcpy"] =
      function () {
        return Module["asm"]["_memcpy"].apply(null, arguments);
      }),
    (_memmove = Module["_memmove"] =
      function () {
        return Module["asm"]["_memmove"].apply(null, arguments);
      }),
    (_memset = Module["_memset"] =
      function () {
        return Module["asm"]["_memset"].apply(null, arguments);
      }),
    (_ntohs = Module["_ntohs"] =
      function () {
        return Module["asm"]["_ntohs"].apply(null, arguments);
      }),
    (_pthread_cond_broadcast = Module["_pthread_cond_broadcast"] =
      function () {
        return Module["asm"]["_pthread_cond_broadcast"].apply(null, arguments);
      }),
    (_pthread_mutex_lock = Module["_pthread_mutex_lock"] =
      function () {
        return Module["asm"]["_pthread_mutex_lock"].apply(null, arguments);
      }),
    (_pthread_mutex_unlock = Module["_pthread_mutex_unlock"] =
      function () {
        return Module["asm"]["_pthread_mutex_unlock"].apply(null, arguments);
      }),
    (_realloc = Module["_realloc"] =
      function () {
        return Module["asm"]["_realloc"].apply(null, arguments);
      }),
    (_roundf = Module["_roundf"] =
      function () {
        return Module["asm"]["_roundf"].apply(null, arguments);
      }),
    (_saveSetjmp = Module["_saveSetjmp"] =
      function () {
        return Module["asm"]["_saveSetjmp"].apply(null, arguments);
      }),
    (_sbrk = Module["_sbrk"] =
      function () {
        return Module["asm"]["_sbrk"].apply(null, arguments);
      }),
    (_strstr = Module["_strstr"] =
      function () {
        return Module["asm"]["_strstr"].apply(null, arguments);
      }),
    (_testSetjmp = Module["_testSetjmp"] =
      function () {
        return Module["asm"]["_testSetjmp"].apply(null, arguments);
      }),
    (establishStackSpace = Module["establishStackSpace"] =
      function () {
        return Module["asm"]["establishStackSpace"].apply(null, arguments);
      }),
    (getTempRet0 = Module["getTempRet0"] =
      function () {
        return Module["asm"]["getTempRet0"].apply(null, arguments);
      }),
    (runPostSets = Module["runPostSets"] =
      function () {
        return Module["asm"]["runPostSets"].apply(null, arguments);
      }),
    (setTempRet0 = Module["setTempRet0"] =
      function () {
        return Module["asm"]["setTempRet0"].apply(null, arguments);
      }),
    (setThrew = Module["setThrew"] =
      function () {
        return Module["asm"]["setThrew"].apply(null, arguments);
      }),
    (stackAlloc = Module["stackAlloc"] =
      function () {
        return Module["asm"]["stackAlloc"].apply(null, arguments);
      }),
    (stackRestore = Module["stackRestore"] =
      function () {
        return Module["asm"]["stackRestore"].apply(null, arguments);
      }),
    (stackSave = Module["stackSave"] =
      function () {
        return Module["asm"]["stackSave"].apply(null, arguments);
      }),
    (dynCall_d = Module["dynCall_d"] =
      function () {
        return Module["asm"]["dynCall_d"].apply(null, arguments);
      }),
    (dynCall_di = Module["dynCall_di"] =
      function () {
        return Module["asm"]["dynCall_di"].apply(null, arguments);
      }),
    (dynCall_diddi = Module["dynCall_diddi"] =
      function () {
        return Module["asm"]["dynCall_diddi"].apply(null, arguments);
      }),
    (dynCall_didi = Module["dynCall_didi"] =
      function () {
        return Module["asm"]["dynCall_didi"].apply(null, arguments);
      }),
    (dynCall_didii = Module["dynCall_didii"] =
      function () {
        return Module["asm"]["dynCall_didii"].apply(null, arguments);
      }),
    (dynCall_didiii = Module["dynCall_didiii"] =
      function () {
        return Module["asm"]["dynCall_didiii"].apply(null, arguments);
      }),
    (dynCall_difi = Module["dynCall_difi"] =
      function () {
        return Module["asm"]["dynCall_difi"].apply(null, arguments);
      }),
    (dynCall_dii = Module["dynCall_dii"] =
      function () {
        return Module["asm"]["dynCall_dii"].apply(null, arguments);
      }),
    (dynCall_diiddi = Module["dynCall_diiddi"] =
      function () {
        return Module["asm"]["dynCall_diiddi"].apply(null, arguments);
      }),
    (dynCall_diidi = Module["dynCall_diidi"] =
      function () {
        return Module["asm"]["dynCall_diidi"].apply(null, arguments);
      }),
    (dynCall_diii = Module["dynCall_diii"] =
      function () {
        return Module["asm"]["dynCall_diii"].apply(null, arguments);
      }),
    (dynCall_diiii = Module["dynCall_diiii"] =
      function () {
        return Module["asm"]["dynCall_diiii"].apply(null, arguments);
      }),
    (dynCall_diiiii = Module["dynCall_diiiii"] =
      function () {
        return Module["asm"]["dynCall_diiiii"].apply(null, arguments);
      }),
    (dynCall_diji = Module["dynCall_diji"] =
      function () {
        return Module["asm"]["dynCall_diji"].apply(null, arguments);
      }),
    (dynCall_f = Module["dynCall_f"] =
      function () {
        return Module["asm"]["dynCall_f"].apply(null, arguments);
      }),
    (dynCall_ff = Module["dynCall_ff"] =
      function () {
        return Module["asm"]["dynCall_ff"].apply(null, arguments);
      }),
    (dynCall_fff = Module["dynCall_fff"] =
      function () {
        return Module["asm"]["dynCall_fff"].apply(null, arguments);
      }),
    (dynCall_fi = Module["dynCall_fi"] =
      function () {
        return Module["asm"]["dynCall_fi"].apply(null, arguments);
      }),
    (dynCall_fidi = Module["dynCall_fidi"] =
      function () {
        return Module["asm"]["dynCall_fidi"].apply(null, arguments);
      }),
    (dynCall_fif = Module["dynCall_fif"] =
      function () {
        return Module["asm"]["dynCall_fif"].apply(null, arguments);
      }),
    (dynCall_fiff = Module["dynCall_fiff"] =
      function () {
        return Module["asm"]["dynCall_fiff"].apply(null, arguments);
      }),
    (dynCall_fifffffi = Module["dynCall_fifffffi"] =
      function () {
        return Module["asm"]["dynCall_fifffffi"].apply(null, arguments);
      }),
    (dynCall_fiffffi = Module["dynCall_fiffffi"] =
      function () {
        return Module["asm"]["dynCall_fiffffi"].apply(null, arguments);
      }),
    (dynCall_fiffffii = Module["dynCall_fiffffii"] =
      function () {
        return Module["asm"]["dynCall_fiffffii"].apply(null, arguments);
      }),
    (dynCall_fifffi = Module["dynCall_fifffi"] =
      function () {
        return Module["asm"]["dynCall_fifffi"].apply(null, arguments);
      }),
    (dynCall_fifffii = Module["dynCall_fifffii"] =
      function () {
        return Module["asm"]["dynCall_fifffii"].apply(null, arguments);
      }),
    (dynCall_fifffiiii = Module["dynCall_fifffiiii"] =
      function () {
        return Module["asm"]["dynCall_fifffiiii"].apply(null, arguments);
      }),
    (dynCall_fiffi = Module["dynCall_fiffi"] =
      function () {
        return Module["asm"]["dynCall_fiffi"].apply(null, arguments);
      }),
    (dynCall_fiffifffi = Module["dynCall_fiffifffi"] =
      function () {
        return Module["asm"]["dynCall_fiffifffi"].apply(null, arguments);
      }),
    (dynCall_fiffii = Module["dynCall_fiffii"] =
      function () {
        return Module["asm"]["dynCall_fiffii"].apply(null, arguments);
      }),
    (dynCall_fifi = Module["dynCall_fifi"] =
      function () {
        return Module["asm"]["dynCall_fifi"].apply(null, arguments);
      }),
    (dynCall_fifii = Module["dynCall_fifii"] =
      function () {
        return Module["asm"]["dynCall_fifii"].apply(null, arguments);
      }),
    (dynCall_fifiii = Module["dynCall_fifiii"] =
      function () {
        return Module["asm"]["dynCall_fifiii"].apply(null, arguments);
      }),
    (dynCall_fii = Module["dynCall_fii"] =
      function () {
        return Module["asm"]["dynCall_fii"].apply(null, arguments);
      }),
    (dynCall_fiif = Module["dynCall_fiif"] =
      function () {
        return Module["asm"]["dynCall_fiif"].apply(null, arguments);
      }),
    (dynCall_fiiffffii = Module["dynCall_fiiffffii"] =
      function () {
        return Module["asm"]["dynCall_fiiffffii"].apply(null, arguments);
      }),
    (dynCall_fiiffffiiiii = Module["dynCall_fiiffffiiiii"] =
      function () {
        return Module["asm"]["dynCall_fiiffffiiiii"].apply(null, arguments);
      }),
    (dynCall_fiiffffiiiiii = Module["dynCall_fiiffffiiiiii"] =
      function () {
        return Module["asm"]["dynCall_fiiffffiiiiii"].apply(null, arguments);
      }),
    (dynCall_fiifffiii = Module["dynCall_fiifffiii"] =
      function () {
        return Module["asm"]["dynCall_fiifffiii"].apply(null, arguments);
      }),
    (dynCall_fiiffi = Module["dynCall_fiiffi"] =
      function () {
        return Module["asm"]["dynCall_fiiffi"].apply(null, arguments);
      }),
    (dynCall_fiifi = Module["dynCall_fiifi"] =
      function () {
        return Module["asm"]["dynCall_fiifi"].apply(null, arguments);
      }),
    (dynCall_fiii = Module["dynCall_fiii"] =
      function () {
        return Module["asm"]["dynCall_fiii"].apply(null, arguments);
      }),
    (dynCall_fiiifi = Module["dynCall_fiiifi"] =
      function () {
        return Module["asm"]["dynCall_fiiifi"].apply(null, arguments);
      }),
    (dynCall_fiiifii = Module["dynCall_fiiifii"] =
      function () {
        return Module["asm"]["dynCall_fiiifii"].apply(null, arguments);
      }),
    (dynCall_fiiii = Module["dynCall_fiiii"] =
      function () {
        return Module["asm"]["dynCall_fiiii"].apply(null, arguments);
      }),
    (dynCall_fiiiif = Module["dynCall_fiiiif"] =
      function () {
        return Module["asm"]["dynCall_fiiiif"].apply(null, arguments);
      }),
    (dynCall_fiiiii = Module["dynCall_fiiiii"] =
      function () {
        return Module["asm"]["dynCall_fiiiii"].apply(null, arguments);
      }),
    (dynCall_fiiiiiifiiiiiif = Module["dynCall_fiiiiiifiiiiiif"] =
      function () {
        return Module["asm"]["dynCall_fiiiiiifiiiiiif"].apply(null, arguments);
      }),
    (dynCall_fiiiiiiiifiiiif = Module["dynCall_fiiiiiiiifiiiif"] =
      function () {
        return Module["asm"]["dynCall_fiiiiiiiifiiiif"].apply(null, arguments);
      }),
    (dynCall_fiji = Module["dynCall_fiji"] =
      function () {
        return Module["asm"]["dynCall_fiji"].apply(null, arguments);
      }),
    (dynCall_i = Module["dynCall_i"] =
      function () {
        return Module["asm"]["dynCall_i"].apply(null, arguments);
      }),
    (dynCall_ii = Module["dynCall_ii"] =
      function () {
        return Module["asm"]["dynCall_ii"].apply(null, arguments);
      }),
    (dynCall_iiddi = Module["dynCall_iiddi"] =
      function () {
        return Module["asm"]["dynCall_iiddi"].apply(null, arguments);
      }),
    (dynCall_iidi = Module["dynCall_iidi"] =
      function () {
        return Module["asm"]["dynCall_iidi"].apply(null, arguments);
      }),
    (dynCall_iidii = Module["dynCall_iidii"] =
      function () {
        return Module["asm"]["dynCall_iidii"].apply(null, arguments);
      }),
    (dynCall_iidiii = Module["dynCall_iidiii"] =
      function () {
        return Module["asm"]["dynCall_iidiii"].apply(null, arguments);
      }),
    (dynCall_iif = Module["dynCall_iif"] =
      function () {
        return Module["asm"]["dynCall_iif"].apply(null, arguments);
      }),
    (dynCall_iifff = Module["dynCall_iifff"] =
      function () {
        return Module["asm"]["dynCall_iifff"].apply(null, arguments);
      }),
    (dynCall_iiffffi = Module["dynCall_iiffffi"] =
      function () {
        return Module["asm"]["dynCall_iiffffi"].apply(null, arguments);
      }),
    (dynCall_iifffi = Module["dynCall_iifffi"] =
      function () {
        return Module["asm"]["dynCall_iifffi"].apply(null, arguments);
      }),
    (dynCall_iifffii = Module["dynCall_iifffii"] =
      function () {
        return Module["asm"]["dynCall_iifffii"].apply(null, arguments);
      }),
    (dynCall_iiffi = Module["dynCall_iiffi"] =
      function () {
        return Module["asm"]["dynCall_iiffi"].apply(null, arguments);
      }),
    (dynCall_iiffifii = Module["dynCall_iiffifii"] =
      function () {
        return Module["asm"]["dynCall_iiffifii"].apply(null, arguments);
      }),
    (dynCall_iiffii = Module["dynCall_iiffii"] =
      function () {
        return Module["asm"]["dynCall_iiffii"].apply(null, arguments);
      }),
    (dynCall_iiffiii = Module["dynCall_iiffiii"] =
      function () {
        return Module["asm"]["dynCall_iiffiii"].apply(null, arguments);
      }),
    (dynCall_iiffiiii = Module["dynCall_iiffiiii"] =
      function () {
        return Module["asm"]["dynCall_iiffiiii"].apply(null, arguments);
      }),
    (dynCall_iifi = Module["dynCall_iifi"] =
      function () {
        return Module["asm"]["dynCall_iifi"].apply(null, arguments);
      }),
    (dynCall_iififii = Module["dynCall_iififii"] =
      function () {
        return Module["asm"]["dynCall_iififii"].apply(null, arguments);
      }),
    (dynCall_iifii = Module["dynCall_iifii"] =
      function () {
        return Module["asm"]["dynCall_iifii"].apply(null, arguments);
      }),
    (dynCall_iifiii = Module["dynCall_iifiii"] =
      function () {
        return Module["asm"]["dynCall_iifiii"].apply(null, arguments);
      }),
    (dynCall_iifiiifiii = Module["dynCall_iifiiifiii"] =
      function () {
        return Module["asm"]["dynCall_iifiiifiii"].apply(null, arguments);
      }),
    (dynCall_iifiiii = Module["dynCall_iifiiii"] =
      function () {
        return Module["asm"]["dynCall_iifiiii"].apply(null, arguments);
      }),
    (dynCall_iii = Module["dynCall_iii"] =
      function () {
        return Module["asm"]["dynCall_iii"].apply(null, arguments);
      }),
    (dynCall_iiid = Module["dynCall_iiid"] =
      function () {
        return Module["asm"]["dynCall_iiid"].apply(null, arguments);
      }),
    (dynCall_iiidi = Module["dynCall_iiidi"] =
      function () {
        return Module["asm"]["dynCall_iiidi"].apply(null, arguments);
      }),
    (dynCall_iiidii = Module["dynCall_iiidii"] =
      function () {
        return Module["asm"]["dynCall_iiidii"].apply(null, arguments);
      }),
    (dynCall_iiidiii = Module["dynCall_iiidiii"] =
      function () {
        return Module["asm"]["dynCall_iiidiii"].apply(null, arguments);
      }),
    (dynCall_iiif = Module["dynCall_iiif"] =
      function () {
        return Module["asm"]["dynCall_iiif"].apply(null, arguments);
      }),
    (dynCall_iiifffi = Module["dynCall_iiifffi"] =
      function () {
        return Module["asm"]["dynCall_iiifffi"].apply(null, arguments);
      }),
    (dynCall_iiifffii = Module["dynCall_iiifffii"] =
      function () {
        return Module["asm"]["dynCall_iiifffii"].apply(null, arguments);
      }),
    (dynCall_iiiffi = Module["dynCall_iiiffi"] =
      function () {
        return Module["asm"]["dynCall_iiiffi"].apply(null, arguments);
      }),
    (dynCall_iiiffii = Module["dynCall_iiiffii"] =
      function () {
        return Module["asm"]["dynCall_iiiffii"].apply(null, arguments);
      }),
    (dynCall_iiiffiii = Module["dynCall_iiiffiii"] =
      function () {
        return Module["asm"]["dynCall_iiiffiii"].apply(null, arguments);
      }),
    (dynCall_iiifi = Module["dynCall_iiifi"] =
      function () {
        return Module["asm"]["dynCall_iiifi"].apply(null, arguments);
      }),
    (dynCall_iiififii = Module["dynCall_iiififii"] =
      function () {
        return Module["asm"]["dynCall_iiififii"].apply(null, arguments);
      }),
    (dynCall_iiififiii = Module["dynCall_iiififiii"] =
      function () {
        return Module["asm"]["dynCall_iiififiii"].apply(null, arguments);
      }),
    (dynCall_iiifii = Module["dynCall_iiifii"] =
      function () {
        return Module["asm"]["dynCall_iiifii"].apply(null, arguments);
      }),
    (dynCall_iiifiifii = Module["dynCall_iiifiifii"] =
      function () {
        return Module["asm"]["dynCall_iiifiifii"].apply(null, arguments);
      }),
    (dynCall_iiifiifiii = Module["dynCall_iiifiifiii"] =
      function () {
        return Module["asm"]["dynCall_iiifiifiii"].apply(null, arguments);
      }),
    (dynCall_iiifiii = Module["dynCall_iiifiii"] =
      function () {
        return Module["asm"]["dynCall_iiifiii"].apply(null, arguments);
      }),
    (dynCall_iiifiiii = Module["dynCall_iiifiiii"] =
      function () {
        return Module["asm"]["dynCall_iiifiiii"].apply(null, arguments);
      }),
    (dynCall_iiii = Module["dynCall_iiii"] =
      function () {
        return Module["asm"]["dynCall_iiii"].apply(null, arguments);
      }),
    (dynCall_iiiiffi = Module["dynCall_iiiiffi"] =
      function () {
        return Module["asm"]["dynCall_iiiiffi"].apply(null, arguments);
      }),
    (dynCall_iiiiffii = Module["dynCall_iiiiffii"] =
      function () {
        return Module["asm"]["dynCall_iiiiffii"].apply(null, arguments);
      }),
    (dynCall_iiiifi = Module["dynCall_iiiifi"] =
      function () {
        return Module["asm"]["dynCall_iiiifi"].apply(null, arguments);
      }),
    (dynCall_iiiififiii = Module["dynCall_iiiififiii"] =
      function () {
        return Module["asm"]["dynCall_iiiififiii"].apply(null, arguments);
      }),
    (dynCall_iiiififiiii = Module["dynCall_iiiififiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiififiiii"].apply(null, arguments);
      }),
    (dynCall_iiiifii = Module["dynCall_iiiifii"] =
      function () {
        return Module["asm"]["dynCall_iiiifii"].apply(null, arguments);
      }),
    (dynCall_iiiifiifiii = Module["dynCall_iiiifiifiii"] =
      function () {
        return Module["asm"]["dynCall_iiiifiifiii"].apply(null, arguments);
      }),
    (dynCall_iiiifiii = Module["dynCall_iiiifiii"] =
      function () {
        return Module["asm"]["dynCall_iiiifiii"].apply(null, arguments);
      }),
    (dynCall_iiiifiiii = Module["dynCall_iiiifiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiifiiii"].apply(null, arguments);
      }),
    (dynCall_iiiifiiiii = Module["dynCall_iiiifiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiifiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiii = Module["dynCall_iiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiifffii = Module["dynCall_iiiiifffii"] =
      function () {
        return Module["asm"]["dynCall_iiiiifffii"].apply(null, arguments);
      }),
    (dynCall_iiiiifi = Module["dynCall_iiiiifi"] =
      function () {
        return Module["asm"]["dynCall_iiiiifi"].apply(null, arguments);
      }),
    (dynCall_iiiiifii = Module["dynCall_iiiiifii"] =
      function () {
        return Module["asm"]["dynCall_iiiiifii"].apply(null, arguments);
      }),
    (dynCall_iiiiifiif = Module["dynCall_iiiiifiif"] =
      function () {
        return Module["asm"]["dynCall_iiiiifiif"].apply(null, arguments);
      }),
    (dynCall_iiiiifiii = Module["dynCall_iiiiifiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiifiii"].apply(null, arguments);
      }),
    (dynCall_iiiiifiiii = Module["dynCall_iiiiifiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiifiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiifiiiif = Module["dynCall_iiiiifiiiif"] =
      function () {
        return Module["asm"]["dynCall_iiiiifiiiif"].apply(null, arguments);
      }),
    (dynCall_iiiiifiiiii = Module["dynCall_iiiiifiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiifiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiifiiiiif = Module["dynCall_iiiiifiiiiif"] =
      function () {
        return Module["asm"]["dynCall_iiiiifiiiiif"].apply(null, arguments);
      }),
    (dynCall_iiiiifiiiiii = Module["dynCall_iiiiifiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiifiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiii = Module["dynCall_iiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiifffiiifiii = Module["dynCall_iiiiiifffiiifiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiifffiiifiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiffiiiiiiiiiffffiii = Module[
      "dynCall_iiiiiiffiiiiiiiiiffffiii"
    ] =
      function () {
        return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiffffiii"].apply(
          null,
          arguments
        );
      }),
    (dynCall_iiiiiiffiiiiiiiiiffffiiii = Module[
      "dynCall_iiiiiiffiiiiiiiiiffffiiii"
    ] =
      function () {
        return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiffffiiii"].apply(
          null,
          arguments
        );
      }),
    (dynCall_iiiiiiffiiiiiiiiiiiiiii = Module[
      "dynCall_iiiiiiffiiiiiiiiiiiiiii"
    ] =
      function () {
        return Module["asm"]["dynCall_iiiiiiffiiiiiiiiiiiiiii"].apply(
          null,
          arguments
        );
      }),
    (dynCall_iiiiiifi = Module["dynCall_iiiiiifi"] =
      function () {
        return Module["asm"]["dynCall_iiiiiifi"].apply(null, arguments);
      }),
    (dynCall_iiiiiifii = Module["dynCall_iiiiiifii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiifii"].apply(null, arguments);
      }),
    (dynCall_iiiiiifiif = Module["dynCall_iiiiiifiif"] =
      function () {
        return Module["asm"]["dynCall_iiiiiifiif"].apply(null, arguments);
      }),
    (dynCall_iiiiiifiii = Module["dynCall_iiiiiifiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiifiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiii = Module["dynCall_iiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiif = Module["dynCall_iiiiiiif"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiif"].apply(null, arguments);
      }),
    (dynCall_iiiiiiifi = Module["dynCall_iiiiiiifi"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiifi"].apply(null, arguments);
      }),
    (dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiiiiffffii = Module["dynCall_iiiiiiiiiiffffii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiiiffffii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiiiifi = Module["dynCall_iiiiiiiiiifi"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiiifi"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiiiiiiffffii = Module["dynCall_iiiiiiiiiiiiffffii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiiiiiffffii"].apply(
          null,
          arguments
        );
      }),
    (dynCall_iiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiiiiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_iiiiij = Module["dynCall_iiiiij"] =
      function () {
        return Module["asm"]["dynCall_iiiiij"].apply(null, arguments);
      }),
    (dynCall_iiiiiji = Module["dynCall_iiiiiji"] =
      function () {
        return Module["asm"]["dynCall_iiiiiji"].apply(null, arguments);
      }),
    (dynCall_iiiiijii = Module["dynCall_iiiiijii"] =
      function () {
        return Module["asm"]["dynCall_iiiiijii"].apply(null, arguments);
      }),
    (dynCall_iiiiijjii = Module["dynCall_iiiiijjii"] =
      function () {
        return Module["asm"]["dynCall_iiiiijjii"].apply(null, arguments);
      }),
    (dynCall_iiiij = Module["dynCall_iiiij"] =
      function () {
        return Module["asm"]["dynCall_iiiij"].apply(null, arguments);
      }),
    (dynCall_iiiiji = Module["dynCall_iiiiji"] =
      function () {
        return Module["asm"]["dynCall_iiiiji"].apply(null, arguments);
      }),
    (dynCall_iiiijjii = Module["dynCall_iiiijjii"] =
      function () {
        return Module["asm"]["dynCall_iiiijjii"].apply(null, arguments);
      }),
    (dynCall_iiiijjiiii = Module["dynCall_iiiijjiiii"] =
      function () {
        return Module["asm"]["dynCall_iiiijjiiii"].apply(null, arguments);
      }),
    (dynCall_iiij = Module["dynCall_iiij"] =
      function () {
        return Module["asm"]["dynCall_iiij"].apply(null, arguments);
      }),
    (dynCall_iiiji = Module["dynCall_iiiji"] =
      function () {
        return Module["asm"]["dynCall_iiiji"].apply(null, arguments);
      }),
    (dynCall_iiijii = Module["dynCall_iiijii"] =
      function () {
        return Module["asm"]["dynCall_iiijii"].apply(null, arguments);
      }),
    (dynCall_iiijiii = Module["dynCall_iiijiii"] =
      function () {
        return Module["asm"]["dynCall_iiijiii"].apply(null, arguments);
      }),
    (dynCall_iiijji = Module["dynCall_iiijji"] =
      function () {
        return Module["asm"]["dynCall_iiijji"].apply(null, arguments);
      }),
    (dynCall_iiijjii = Module["dynCall_iiijjii"] =
      function () {
        return Module["asm"]["dynCall_iiijjii"].apply(null, arguments);
      }),
    (dynCall_iiijjiiii = Module["dynCall_iiijjiiii"] =
      function () {
        return Module["asm"]["dynCall_iiijjiiii"].apply(null, arguments);
      }),
    (dynCall_iij = Module["dynCall_iij"] =
      function () {
        return Module["asm"]["dynCall_iij"].apply(null, arguments);
      }),
    (dynCall_iiji = Module["dynCall_iiji"] =
      function () {
        return Module["asm"]["dynCall_iiji"].apply(null, arguments);
      }),
    (dynCall_iijii = Module["dynCall_iijii"] =
      function () {
        return Module["asm"]["dynCall_iijii"].apply(null, arguments);
      }),
    (dynCall_iijiii = Module["dynCall_iijiii"] =
      function () {
        return Module["asm"]["dynCall_iijiii"].apply(null, arguments);
      }),
    (dynCall_iijji = Module["dynCall_iijji"] =
      function () {
        return Module["asm"]["dynCall_iijji"].apply(null, arguments);
      }),
    (dynCall_iijjii = Module["dynCall_iijjii"] =
      function () {
        return Module["asm"]["dynCall_iijjii"].apply(null, arguments);
      }),
    (dynCall_iijjiii = Module["dynCall_iijjiii"] =
      function () {
        return Module["asm"]["dynCall_iijjiii"].apply(null, arguments);
      }),
    (dynCall_iijjji = Module["dynCall_iijjji"] =
      function () {
        return Module["asm"]["dynCall_iijjji"].apply(null, arguments);
      }),
    (dynCall_ijj = Module["dynCall_ijj"] =
      function () {
        return Module["asm"]["dynCall_ijj"].apply(null, arguments);
      }),
    (dynCall_j = Module["dynCall_j"] =
      function () {
        return Module["asm"]["dynCall_j"].apply(null, arguments);
      }),
    (dynCall_ji = Module["dynCall_ji"] =
      function () {
        return Module["asm"]["dynCall_ji"].apply(null, arguments);
      }),
    (dynCall_jidi = Module["dynCall_jidi"] =
      function () {
        return Module["asm"]["dynCall_jidi"].apply(null, arguments);
      }),
    (dynCall_jidii = Module["dynCall_jidii"] =
      function () {
        return Module["asm"]["dynCall_jidii"].apply(null, arguments);
      }),
    (dynCall_jifi = Module["dynCall_jifi"] =
      function () {
        return Module["asm"]["dynCall_jifi"].apply(null, arguments);
      }),
    (dynCall_jii = Module["dynCall_jii"] =
      function () {
        return Module["asm"]["dynCall_jii"].apply(null, arguments);
      }),
    (dynCall_jiii = Module["dynCall_jiii"] =
      function () {
        return Module["asm"]["dynCall_jiii"].apply(null, arguments);
      }),
    (dynCall_jiiii = Module["dynCall_jiiii"] =
      function () {
        return Module["asm"]["dynCall_jiiii"].apply(null, arguments);
      }),
    (dynCall_jiiiii = Module["dynCall_jiiiii"] =
      function () {
        return Module["asm"]["dynCall_jiiiii"].apply(null, arguments);
      }),
    (dynCall_jiiiiii = Module["dynCall_jiiiiii"] =
      function () {
        return Module["asm"]["dynCall_jiiiiii"].apply(null, arguments);
      }),
    (dynCall_jiiiiiiiiii = Module["dynCall_jiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_jiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_jiiji = Module["dynCall_jiiji"] =
      function () {
        return Module["asm"]["dynCall_jiiji"].apply(null, arguments);
      }),
    (dynCall_jiijiii = Module["dynCall_jiijiii"] =
      function () {
        return Module["asm"]["dynCall_jiijiii"].apply(null, arguments);
      }),
    (dynCall_jiijji = Module["dynCall_jiijji"] =
      function () {
        return Module["asm"]["dynCall_jiijji"].apply(null, arguments);
      }),
    (dynCall_jiji = Module["dynCall_jiji"] =
      function () {
        return Module["asm"]["dynCall_jiji"].apply(null, arguments);
      }),
    (dynCall_jijii = Module["dynCall_jijii"] =
      function () {
        return Module["asm"]["dynCall_jijii"].apply(null, arguments);
      }),
    (dynCall_jijj = Module["dynCall_jijj"] =
      function () {
        return Module["asm"]["dynCall_jijj"].apply(null, arguments);
      }),
    (dynCall_jijji = Module["dynCall_jijji"] =
      function () {
        return Module["asm"]["dynCall_jijji"].apply(null, arguments);
      }),
    (dynCall_jijjji = Module["dynCall_jijjji"] =
      function () {
        return Module["asm"]["dynCall_jijjji"].apply(null, arguments);
      }),
    (dynCall_v = Module["dynCall_v"] =
      function () {
        return Module["asm"]["dynCall_v"].apply(null, arguments);
      }),
    (dynCall_vd = Module["dynCall_vd"] =
      function () {
        return Module["asm"]["dynCall_vd"].apply(null, arguments);
      }),
    (dynCall_vdd = Module["dynCall_vdd"] =
      function () {
        return Module["asm"]["dynCall_vdd"].apply(null, arguments);
      }),
    (dynCall_vdddddd = Module["dynCall_vdddddd"] =
      function () {
        return Module["asm"]["dynCall_vdddddd"].apply(null, arguments);
      }),
    (dynCall_vf = Module["dynCall_vf"] =
      function () {
        return Module["asm"]["dynCall_vf"].apply(null, arguments);
      }),
    (dynCall_vff = Module["dynCall_vff"] =
      function () {
        return Module["asm"]["dynCall_vff"].apply(null, arguments);
      }),
    (dynCall_vfff = Module["dynCall_vfff"] =
      function () {
        return Module["asm"]["dynCall_vfff"].apply(null, arguments);
      }),
    (dynCall_vffff = Module["dynCall_vffff"] =
      function () {
        return Module["asm"]["dynCall_vffff"].apply(null, arguments);
      }),
    (dynCall_vfi = Module["dynCall_vfi"] =
      function () {
        return Module["asm"]["dynCall_vfi"].apply(null, arguments);
      }),
    (dynCall_vfii = Module["dynCall_vfii"] =
      function () {
        return Module["asm"]["dynCall_vfii"].apply(null, arguments);
      }),
    (dynCall_vi = Module["dynCall_vi"] =
      function () {
        return Module["asm"]["dynCall_vi"].apply(null, arguments);
      }),
    (dynCall_vid = Module["dynCall_vid"] =
      function () {
        return Module["asm"]["dynCall_vid"].apply(null, arguments);
      }),
    (dynCall_vidd = Module["dynCall_vidd"] =
      function () {
        return Module["asm"]["dynCall_vidd"].apply(null, arguments);
      }),
    (dynCall_vidddi = Module["dynCall_vidddi"] =
      function () {
        return Module["asm"]["dynCall_vidddi"].apply(null, arguments);
      }),
    (dynCall_viddi = Module["dynCall_viddi"] =
      function () {
        return Module["asm"]["dynCall_viddi"].apply(null, arguments);
      }),
    (dynCall_vidi = Module["dynCall_vidi"] =
      function () {
        return Module["asm"]["dynCall_vidi"].apply(null, arguments);
      }),
    (dynCall_vif = Module["dynCall_vif"] =
      function () {
        return Module["asm"]["dynCall_vif"].apply(null, arguments);
      }),
    (dynCall_viff = Module["dynCall_viff"] =
      function () {
        return Module["asm"]["dynCall_viff"].apply(null, arguments);
      }),
    (dynCall_vifff = Module["dynCall_vifff"] =
      function () {
        return Module["asm"]["dynCall_vifff"].apply(null, arguments);
      }),
    (dynCall_viffff = Module["dynCall_viffff"] =
      function () {
        return Module["asm"]["dynCall_viffff"].apply(null, arguments);
      }),
    (dynCall_vifffffi = Module["dynCall_vifffffi"] =
      function () {
        return Module["asm"]["dynCall_vifffffi"].apply(null, arguments);
      }),
    (dynCall_viffffi = Module["dynCall_viffffi"] =
      function () {
        return Module["asm"]["dynCall_viffffi"].apply(null, arguments);
      }),
    (dynCall_viffffii = Module["dynCall_viffffii"] =
      function () {
        return Module["asm"]["dynCall_viffffii"].apply(null, arguments);
      }),
    (dynCall_viffffiii = Module["dynCall_viffffiii"] =
      function () {
        return Module["asm"]["dynCall_viffffiii"].apply(null, arguments);
      }),
    (dynCall_viffffiiii = Module["dynCall_viffffiiii"] =
      function () {
        return Module["asm"]["dynCall_viffffiiii"].apply(null, arguments);
      }),
    (dynCall_vifffi = Module["dynCall_vifffi"] =
      function () {
        return Module["asm"]["dynCall_vifffi"].apply(null, arguments);
      }),
    (dynCall_vifffii = Module["dynCall_vifffii"] =
      function () {
        return Module["asm"]["dynCall_vifffii"].apply(null, arguments);
      }),
    (dynCall_viffi = Module["dynCall_viffi"] =
      function () {
        return Module["asm"]["dynCall_viffi"].apply(null, arguments);
      }),
    (dynCall_viffii = Module["dynCall_viffii"] =
      function () {
        return Module["asm"]["dynCall_viffii"].apply(null, arguments);
      }),
    (dynCall_viffiii = Module["dynCall_viffiii"] =
      function () {
        return Module["asm"]["dynCall_viffiii"].apply(null, arguments);
      }),
    (dynCall_vifi = Module["dynCall_vifi"] =
      function () {
        return Module["asm"]["dynCall_vifi"].apply(null, arguments);
      }),
    (dynCall_vifii = Module["dynCall_vifii"] =
      function () {
        return Module["asm"]["dynCall_vifii"].apply(null, arguments);
      }),
    (dynCall_vifiii = Module["dynCall_vifiii"] =
      function () {
        return Module["asm"]["dynCall_vifiii"].apply(null, arguments);
      }),
    (dynCall_vifiiii = Module["dynCall_vifiiii"] =
      function () {
        return Module["asm"]["dynCall_vifiiii"].apply(null, arguments);
      }),
    (dynCall_vifiiiii = Module["dynCall_vifiiiii"] =
      function () {
        return Module["asm"]["dynCall_vifiiiii"].apply(null, arguments);
      }),
    (dynCall_vifiiiiiiiiiiiii = Module["dynCall_vifiiiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_vifiiiiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_vifiiiiiiiiiiiiiiiiii = Module["dynCall_vifiiiiiiiiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_vifiiiiiiiiiiiiiiiiii"].apply(
          null,
          arguments
        );
      }),
    (dynCall_vifiiiiiiiiiiiiiiiiiiiiiii = Module[
      "dynCall_vifiiiiiiiiiiiiiiiiiiiiiii"
    ] =
      function () {
        return Module["asm"]["dynCall_vifiiiiiiiiiiiiiiiiiiiiiii"].apply(
          null,
          arguments
        );
      }),
    (dynCall_vifiiiiiiiiiiiiiiiiiiiiiiiiiiii = Module[
      "dynCall_vifiiiiiiiiiiiiiiiiiiiiiiiiiiii"
    ] =
      function () {
        return Module["asm"]["dynCall_vifiiiiiiiiiiiiiiiiiiiiiiiiiiii"].apply(
          null,
          arguments
        );
      }),
    (dynCall_vii = Module["dynCall_vii"] =
      function () {
        return Module["asm"]["dynCall_vii"].apply(null, arguments);
      }),
    (dynCall_viidddi = Module["dynCall_viidddi"] =
      function () {
        return Module["asm"]["dynCall_viidddi"].apply(null, arguments);
      }),
    (dynCall_viidi = Module["dynCall_viidi"] =
      function () {
        return Module["asm"]["dynCall_viidi"].apply(null, arguments);
      }),
    (dynCall_viidii = Module["dynCall_viidii"] =
      function () {
        return Module["asm"]["dynCall_viidii"].apply(null, arguments);
      }),
    (dynCall_viif = Module["dynCall_viif"] =
      function () {
        return Module["asm"]["dynCall_viif"].apply(null, arguments);
      }),
    (dynCall_viiff = Module["dynCall_viiff"] =
      function () {
        return Module["asm"]["dynCall_viiff"].apply(null, arguments);
      }),
    (dynCall_viifff = Module["dynCall_viifff"] =
      function () {
        return Module["asm"]["dynCall_viifff"].apply(null, arguments);
      }),
    (dynCall_viifffffii = Module["dynCall_viifffffii"] =
      function () {
        return Module["asm"]["dynCall_viifffffii"].apply(null, arguments);
      }),
    (dynCall_viiffffi = Module["dynCall_viiffffi"] =
      function () {
        return Module["asm"]["dynCall_viiffffi"].apply(null, arguments);
      }),
    (dynCall_viiffffiii = Module["dynCall_viiffffiii"] =
      function () {
        return Module["asm"]["dynCall_viiffffiii"].apply(null, arguments);
      }),
    (dynCall_viiffffiiiii = Module["dynCall_viiffffiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiffffiiiii"].apply(null, arguments);
      }),
    (dynCall_viifffi = Module["dynCall_viifffi"] =
      function () {
        return Module["asm"]["dynCall_viifffi"].apply(null, arguments);
      }),
    (dynCall_viiffi = Module["dynCall_viiffi"] =
      function () {
        return Module["asm"]["dynCall_viiffi"].apply(null, arguments);
      }),
    (dynCall_viiffii = Module["dynCall_viiffii"] =
      function () {
        return Module["asm"]["dynCall_viiffii"].apply(null, arguments);
      }),
    (dynCall_viiffiii = Module["dynCall_viiffiii"] =
      function () {
        return Module["asm"]["dynCall_viiffiii"].apply(null, arguments);
      }),
    (dynCall_viifi = Module["dynCall_viifi"] =
      function () {
        return Module["asm"]["dynCall_viifi"].apply(null, arguments);
      }),
    (dynCall_viifii = Module["dynCall_viifii"] =
      function () {
        return Module["asm"]["dynCall_viifii"].apply(null, arguments);
      }),
    (dynCall_viifiifi = Module["dynCall_viifiifi"] =
      function () {
        return Module["asm"]["dynCall_viifiifi"].apply(null, arguments);
      }),
    (dynCall_viifiii = Module["dynCall_viifiii"] =
      function () {
        return Module["asm"]["dynCall_viifiii"].apply(null, arguments);
      }),
    (dynCall_viifiiii = Module["dynCall_viifiiii"] =
      function () {
        return Module["asm"]["dynCall_viifiiii"].apply(null, arguments);
      }),
    (dynCall_viii = Module["dynCall_viii"] =
      function () {
        return Module["asm"]["dynCall_viii"].apply(null, arguments);
      }),
    (dynCall_viiidi = Module["dynCall_viiidi"] =
      function () {
        return Module["asm"]["dynCall_viiidi"].apply(null, arguments);
      }),
    (dynCall_viiif = Module["dynCall_viiif"] =
      function () {
        return Module["asm"]["dynCall_viiif"].apply(null, arguments);
      }),
    (dynCall_viiiffdi = Module["dynCall_viiiffdi"] =
      function () {
        return Module["asm"]["dynCall_viiiffdi"].apply(null, arguments);
      }),
    (dynCall_viiiffi = Module["dynCall_viiiffi"] =
      function () {
        return Module["asm"]["dynCall_viiiffi"].apply(null, arguments);
      }),
    (dynCall_viiiffii = Module["dynCall_viiiffii"] =
      function () {
        return Module["asm"]["dynCall_viiiffii"].apply(null, arguments);
      }),
    (dynCall_viiifi = Module["dynCall_viiifi"] =
      function () {
        return Module["asm"]["dynCall_viiifi"].apply(null, arguments);
      }),
    (dynCall_viiifii = Module["dynCall_viiifii"] =
      function () {
        return Module["asm"]["dynCall_viiifii"].apply(null, arguments);
      }),
    (dynCall_viiifiii = Module["dynCall_viiifiii"] =
      function () {
        return Module["asm"]["dynCall_viiifiii"].apply(null, arguments);
      }),
    (dynCall_viiifiiii = Module["dynCall_viiifiiii"] =
      function () {
        return Module["asm"]["dynCall_viiifiiii"].apply(null, arguments);
      }),
    (dynCall_viiifiiiii = Module["dynCall_viiifiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiifiiiii"].apply(null, arguments);
      }),
    (dynCall_viiii = Module["dynCall_viiii"] =
      function () {
        return Module["asm"]["dynCall_viiii"].apply(null, arguments);
      }),
    (dynCall_viiiif = Module["dynCall_viiiif"] =
      function () {
        return Module["asm"]["dynCall_viiiif"].apply(null, arguments);
      }),
    (dynCall_viiiifffii = Module["dynCall_viiiifffii"] =
      function () {
        return Module["asm"]["dynCall_viiiifffii"].apply(null, arguments);
      }),
    (dynCall_viiiiffi = Module["dynCall_viiiiffi"] =
      function () {
        return Module["asm"]["dynCall_viiiiffi"].apply(null, arguments);
      }),
    (dynCall_viiiifi = Module["dynCall_viiiifi"] =
      function () {
        return Module["asm"]["dynCall_viiiifi"].apply(null, arguments);
      }),
    (dynCall_viiiififfi = Module["dynCall_viiiififfi"] =
      function () {
        return Module["asm"]["dynCall_viiiififfi"].apply(null, arguments);
      }),
    (dynCall_viiiififi = Module["dynCall_viiiififi"] =
      function () {
        return Module["asm"]["dynCall_viiiififi"].apply(null, arguments);
      }),
    (dynCall_viiiifii = Module["dynCall_viiiifii"] =
      function () {
        return Module["asm"]["dynCall_viiiifii"].apply(null, arguments);
      }),
    (dynCall_viiiifiii = Module["dynCall_viiiifiii"] =
      function () {
        return Module["asm"]["dynCall_viiiifiii"].apply(null, arguments);
      }),
    (dynCall_viiiifiiiiif = Module["dynCall_viiiifiiiiif"] =
      function () {
        return Module["asm"]["dynCall_viiiifiiiiif"].apply(null, arguments);
      }),
    (dynCall_viiiii = Module["dynCall_viiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiif = Module["dynCall_viiiiif"] =
      function () {
        return Module["asm"]["dynCall_viiiiif"].apply(null, arguments);
      }),
    (dynCall_viiiiiffi = Module["dynCall_viiiiiffi"] =
      function () {
        return Module["asm"]["dynCall_viiiiiffi"].apply(null, arguments);
      }),
    (dynCall_viiiiifi = Module["dynCall_viiiiifi"] =
      function () {
        return Module["asm"]["dynCall_viiiiifi"].apply(null, arguments);
      }),
    (dynCall_viiiiifii = Module["dynCall_viiiiifii"] =
      function () {
        return Module["asm"]["dynCall_viiiiifii"].apply(null, arguments);
      }),
    (dynCall_viiiiii = Module["dynCall_viiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiif = Module["dynCall_viiiiiif"] =
      function () {
        return Module["asm"]["dynCall_viiiiiif"].apply(null, arguments);
      }),
    (dynCall_viiiiiiffii = Module["dynCall_viiiiiiffii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiiffii"].apply(null, arguments);
      }),
    (dynCall_viiiiiifi = Module["dynCall_viiiiiifi"] =
      function () {
        return Module["asm"]["dynCall_viiiiiifi"].apply(null, arguments);
      }),
    (dynCall_viiiiiii = Module["dynCall_viiiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiiiiiiii = Module["dynCall_viiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiiiiiiiiiii = Module["dynCall_viiiiiiiiiiiiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiiiiiiiiiiiii"].apply(null, arguments);
      }),
    (dynCall_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii = Module[
      "dynCall_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
    ] =
      function () {
        return Module["asm"][
          "dynCall_viiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
        ].apply(null, arguments);
      }),
    (dynCall_viiiiji = Module["dynCall_viiiiji"] =
      function () {
        return Module["asm"]["dynCall_viiiiji"].apply(null, arguments);
      }),
    (dynCall_viiiijiiii = Module["dynCall_viiiijiiii"] =
      function () {
        return Module["asm"]["dynCall_viiiijiiii"].apply(null, arguments);
      }),
    (dynCall_viiiji = Module["dynCall_viiiji"] =
      function () {
        return Module["asm"]["dynCall_viiiji"].apply(null, arguments);
      }),
    (dynCall_viiijji = Module["dynCall_viiijji"] =
      function () {
        return Module["asm"]["dynCall_viiijji"].apply(null, arguments);
      }),
    (dynCall_viiijjii = Module["dynCall_viiijjii"] =
      function () {
        return Module["asm"]["dynCall_viiijjii"].apply(null, arguments);
      }),
    (dynCall_viij = Module["dynCall_viij"] =
      function () {
        return Module["asm"]["dynCall_viij"].apply(null, arguments);
      }),
    (dynCall_viiji = Module["dynCall_viiji"] =
      function () {
        return Module["asm"]["dynCall_viiji"].apply(null, arguments);
      }),
    (dynCall_viijiijiii = Module["dynCall_viijiijiii"] =
      function () {
        return Module["asm"]["dynCall_viijiijiii"].apply(null, arguments);
      }),
    (dynCall_viijijii = Module["dynCall_viijijii"] =
      function () {
        return Module["asm"]["dynCall_viijijii"].apply(null, arguments);
      }),
    (dynCall_viijijiii = Module["dynCall_viijijiii"] =
      function () {
        return Module["asm"]["dynCall_viijijiii"].apply(null, arguments);
      }),
    (dynCall_viijijji = Module["dynCall_viijijji"] =
      function () {
        return Module["asm"]["dynCall_viijijji"].apply(null, arguments);
      }),
    (dynCall_viijj = Module["dynCall_viijj"] =
      function () {
        return Module["asm"]["dynCall_viijj"].apply(null, arguments);
      }),
    (dynCall_viijji = Module["dynCall_viijji"] =
      function () {
        return Module["asm"]["dynCall_viijji"].apply(null, arguments);
      }),
    (dynCall_viijjii = Module["dynCall_viijjii"] =
      function () {
        return Module["asm"]["dynCall_viijjii"].apply(null, arguments);
      }),
    (dynCall_viijjiii = Module["dynCall_viijjiii"] =
      function () {
        return Module["asm"]["dynCall_viijjiii"].apply(null, arguments);
      }),
    (dynCall_viijjji = Module["dynCall_viijjji"] =
      function () {
        return Module["asm"]["dynCall_viijjji"].apply(null, arguments);
      }),
    (dynCall_vij = Module["dynCall_vij"] =
      function () {
        return Module["asm"]["dynCall_vij"].apply(null, arguments);
      }),
    (dynCall_viji = Module["dynCall_viji"] =
      function () {
        return Module["asm"]["dynCall_viji"].apply(null, arguments);
      }),
    (dynCall_vijii = Module["dynCall_vijii"] =
      function () {
        return Module["asm"]["dynCall_vijii"].apply(null, arguments);
      }),
    (dynCall_vijiii = Module["dynCall_vijiii"] =
      function () {
        return Module["asm"]["dynCall_vijiii"].apply(null, arguments);
      }),
    (dynCall_vijiiii = Module["dynCall_vijiiii"] =
      function () {
        return Module["asm"]["dynCall_vijiiii"].apply(null, arguments);
      }),
    (dynCall_vijiji = Module["dynCall_vijiji"] =
      function () {
        return Module["asm"]["dynCall_vijiji"].apply(null, arguments);
      }),
    (dynCall_vijj = Module["dynCall_vijj"] =
      function () {
        return Module["asm"]["dynCall_vijj"].apply(null, arguments);
      }),
    (dynCall_vijji = Module["dynCall_vijji"] =
      function () {
        return Module["asm"]["dynCall_vijji"].apply(null, arguments);
      }),
    (dynCall_vijjji = Module["dynCall_vijjji"] =
      function () {
        return Module["asm"]["dynCall_vijjji"].apply(null, arguments);
      }),
    (dynCall_vjji = Module["dynCall_vjji"] =
      function () {
        return Module["asm"]["dynCall_vjji"].apply(null, arguments);
      }),
    (Module["asm"] = asm),
    (Module["ccall"] = ccall),
    (Module["cwrap"] = cwrap),
    (Module["stackTrace"] = stackTrace),
    (Module["addRunDependency"] = addRunDependency),
    (Module["removeRunDependency"] = removeRunDependency),
    (Module["FS_createPath"] = FS.createPath),
    (Module["FS_createDataFile"] = FS.createDataFile),
    (ExitStatus.prototype = new Error()),
    (ExitStatus.prototype.constructor = ExitStatus),
    (calledMain = !1),
    (dependenciesFulfilled = function v() {
      Module["calledRun"] || run(),
        Module["calledRun"] || (dependenciesFulfilled = v);
    }),
    (Module["callMain"] = function L(e) {
      var i, n, t, r, _;
      for (
        e = e || [],
          ensureInitRuntime(),
          i = e.length + 1,
          n = stackAlloc(4 * (i + 1)),
          HEAP32[n >> 2] = allocateUTF8OnStack(Module["thisProgram"]),
          t = 1;
        i > t;
        t++
      )
        HEAP32[(n >> 2) + t] = allocateUTF8OnStack(e[t - 1]);
      HEAP32[(n >> 2) + i] = 0;
      try {
        (r = Module["_main"](i, n, 0)), exit(r, !0);
      } catch (o) {
        if (o instanceof ExitStatus) return;
        if ("SimulateInfiniteLoop" == o)
          return (Module["noExitRuntime"] = !0), void 0;
        (_ = o),
          o && "object" == typeof o && o.stack && (_ = [o, o.stack]),
          Module.printErr("exception thrown: " + _),
          Module["quit"](1, o);
      } finally {
        calledMain = !0;
      }
    }),
    (Module["run"] = run),
    (Module["exit"] = exit),
    (Module["abort"] = abort),
    Module["preInit"])
  ) {
    "function" == typeof Module["preInit"] &&
      (Module["preInit"] = [Module["preInit"]]);
    while (Module["preInit"].length > 0) Module["preInit"].pop()();
  }
  (shouldRunNow = !0),
    Module["noInitialRun"] && (shouldRunNow = !1),
    (Module["noExitRuntime"] = !0),
    run();
});
