import { toString as dateToString } from "./Date";
import Long, { fromBytes as longFromBytes, toBytes as longToBytes, toString as longToString } from "./Long";
import { escape } from "./RegExp";
const fsFormatRegExp = /(^|[^%])%([0+ ]*)(-?\d+)?(?:\.(\d+))?(\w)/;
const formatRegExp = /\{(\d+)(,-?\d+)?(?:\:([a-zA-Z])(\d{0,2})|\:(.+?))?\}/g; // RFC 4122 compliant. From https://stackoverflow.com/a/13653180/3922220
// const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
// Relax GUID parsing, see #1637

const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function cmp(x, y, ic) {
  function isIgnoreCase(i) {
    return i === true || i === 1
    /* CurrentCultureIgnoreCase */
    || i === 3
    /* InvariantCultureIgnoreCase */
    || i === 5
    /* OrdinalIgnoreCase */
    ;
  }

  function isOrdinal(i) {
    return i === 4
    /* Ordinal */
    || i === 5
    /* OrdinalIgnoreCase */
    ;
  }

  if (x == null) {
    return y == null ? 0 : -1;
  }

  if (y == null) {
    return 1;
  } // everything is bigger than null


  if (isOrdinal(ic)) {
    if (isIgnoreCase(ic)) {
      x = x.toLowerCase();
      y = y.toLowerCase();
    }

    return x === y ? 0 : x < y ? -1 : 1;
  } else {
    if (isIgnoreCase(ic)) {
      x = x.toLocaleLowerCase();
      y = y.toLocaleLowerCase();
    }

    return x.localeCompare(y);
  }
}

export function compare(...args) {
  switch (args.length) {
    case 2:
      return cmp(args[0], args[1], false);

    case 3:
      return cmp(args[0], args[1], args[2]);

    case 4:
      return cmp(args[0], args[1], args[2] === true);

    case 5:
      return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), false);

    case 6:
      return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), args[5]);

    case 7:
      return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), args[5] === true);

    default:
      throw new Error("String.compare: Unsupported number of parameters");
  }
}
export function compareOrdinal(x, y) {
  return cmp(x, y, 4
  /* Ordinal */
  );
}
export function compareTo(x, y) {
  return cmp(x, y, 0
  /* CurrentCulture */
  );
}
export function startsWith(str, pattern, ic) {
  if (str.length >= pattern.length) {
    return cmp(str.substr(0, pattern.length), pattern, ic) === 0;
  }

  return false;
}
export function indexOfAny(str, anyOf, ...args) {
  if (str == null || str === "") {
    return -1;
  }

  const startIndex = args.length > 0 ? args[0] : 0;

  if (startIndex < 0) {
    throw new Error("Start index cannot be negative");
  }

  const length = args.length > 1 ? args[1] : str.length - startIndex;

  if (length < 0) {
    throw new Error("Length cannot be negative");
  }

  if (length > str.length - startIndex) {
    throw new Error("Invalid startIndex and length");
  }

  str = str.substr(startIndex, length);

  for (const c of anyOf) {
    const index = str.indexOf(c);

    if (index > -1) {
      return index + startIndex;
    }
  }

  return -1;
}

function toHex(x) {
  if (x instanceof Long) {
    return longToString(x.unsigned ? x : longFromBytes(longToBytes(x), true), 16);
  } else {
    return (Number(x) >>> 0).toString(16);
  }
}

export function printf(input) {
  return {
    input,
    cont: fsFormat(input)
  };
}
export function toConsole(arg) {
  // Don't remove the lambda here, see #1357
  return arg.cont(x => {
    console.log(x);
  });
}
export function toConsoleError(arg) {
  return arg.cont(x => {
    console.error(x);
  });
}
export function toText(arg) {
  return arg.cont(x => x);
}
export function toFail(arg) {
  return arg.cont(x => {
    throw new Error(x);
  });
}

function formatOnce(str2, rep) {
  return str2.replace(fsFormatRegExp, (_, prefix, flags, pad, precision, format) => {
    switch (format) {
      case "f":
      case "F":
        rep = Number(rep).toFixed(precision || 6);
        break;

      case "g":
      case "G":
        rep = Number(rep).toPrecision(precision);
        break;

      case "e":
      case "E":
        rep = Number(rep).toExponential(precision);
        break;

      case "O":
      case "A":
        rep = String(rep);
        break;

      case "x":
        rep = toHex(rep);
        break;

      case "X":
        rep = toHex(rep).toUpperCase();
        break;
    }

    const plusPrefix = flags.indexOf("+") >= 0 && parseInt(rep, 10) >= 0;
    pad = parseInt(pad, 10);

    if (!isNaN(pad)) {
      const ch = pad >= 0 && flags.indexOf("0") >= 0 ? "0" : " ";
      rep = padLeft(String(rep), Math.abs(pad) - (plusPrefix ? 1 : 0), ch, pad < 0);
    }

    const once = prefix + (plusPrefix ? "+" + rep : rep);
    return once.replace(/%/g, "%%");
  });
}

function createPrinter(str, cont) {
  return (...args) => {
    // Make a copy as the function may be used several times
    let strCopy = str;

    for (const arg of args) {
      strCopy = formatOnce(strCopy, arg);
    }

    return fsFormatRegExp.test(strCopy) ? createPrinter(strCopy, cont) : cont(strCopy.replace(/%%/g, "%"));
  };
}

export function fsFormat(str) {
  return cont => {
    return fsFormatRegExp.test(str) ? createPrinter(str, cont) : cont(str);
  };
}
export function format(str, ...args) {
  if (typeof str === "object" && args.length > 0) {
    // Called with culture info
    str = args[0];
    args.shift();
  }

  return str.replace(formatRegExp, (match, idx, pad, format, precision, pattern) => {
    let rep = args[idx];
    let padSymbol = " ";
    const isNumericType = typeof rep === "number" || rep instanceof Long; // TODO: || (rep instanceof Decimal) || (rep instanceof BigInt);

    if (isNumericType) {
      switch (format) {
        case "f":
        case "F":
          rep = precision ? rep.toFixed(precision) : rep.toFixed(2);
          break;

        case "g":
        case "G":
          rep = precision ? rep.toPrecision(precision) : rep.toPrecision();
          break;

        case "e":
        case "E":
          rep = precision ? rep.toExponential(precision) : rep.toExponential();
          break;

        case "p":
        case "P":
          rep = (precision ? (rep * 100).toFixed(precision) : (rep * 100).toFixed(2)) + " %";
          break;

        case "d":
        case "D":
          rep = precision ? padLeft(rep.toString(), precision, "0") : rep.toString();
          break;

        case "x":
        case "X":
          rep = precision ? padLeft(toHex(rep), precision, "0") : toHex(rep);

          if (format === "X") {
            rep = rep.toUpperCase();
          }

          break;

        default:
          const m = /^(0+)(\.0+)?$/.exec(pattern);

          if (m != null) {
            let decs = 0;

            if (m[2] != null) {
              rep = rep.toFixed(decs = m[2].length - 1);
            }

            pad = "," + (m[1].length + (decs ? decs + 1 : 0)).toString();
            padSymbol = "0";
          } else if (pattern) {
            rep = pattern;
          }

      }
    } else if (rep instanceof Date) {
      rep = dateToString(rep, pattern || format);
    }

    pad = parseInt((pad || "").substring(1), 10);

    if (!isNaN(pad)) {
      rep = padLeft(String(rep), Math.abs(pad), padSymbol, pad < 0);
    }

    return rep;
  });
}
export function endsWith(str, search) {
  const idx = str.lastIndexOf(search);
  return idx >= 0 && idx === str.length - search.length;
}
export function initialize(n, f) {
  if (n < 0) {
    throw new Error("String length must be non-negative");
  }

  const xs = new Array(n);

  for (let i = 0; i < n; i++) {
    xs[i] = f(i);
  }

  return xs.join("");
}
export function insert(str, startIndex, value) {
  if (startIndex < 0 || startIndex > str.length) {
    throw new Error("startIndex is negative or greater than the length of this instance.");
  }

  return str.substring(0, startIndex) + value + str.substring(startIndex);
}
export function isNullOrEmpty(str) {
  return typeof str !== "string" || str.length === 0;
}
export function isNullOrWhiteSpace(str) {
  return typeof str !== "string" || /^\s*$/.test(str);
}
export function join(delimiter, ...xs) {
  return xs.map(x => String(x)).join(delimiter);
}
export function joinWithIndices(delimiter, xs, startIndex, count) {
  const endIndexPlusOne = startIndex + count;

  if (endIndexPlusOne > xs.length) {
    throw new Error("Index and count must refer to a location within the buffer.");
  }

  return join(delimiter, ...xs.slice(startIndex, endIndexPlusOne));
}
/** Validates UUID as specified in RFC4122 (versions 1-5). Trims braces. */

export function validateGuid(str, doNotThrow) {
  const trimmedAndLowered = trim(str, "{", "}").toLowerCase();

  if (guidRegex.test(trimmedAndLowered)) {
    return doNotThrow ? [true, trimmedAndLowered] : trimmedAndLowered;
  } else if (doNotThrow) {
    return [false, "00000000-0000-0000-0000-000000000000"];
  }

  throw new Error("Guid should contain 32 digits with 4 dashes: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
} // From https://gist.github.com/LeverOne/1308368

export function newGuid() {
  let b = "";

  for (let a = 0; a++ < 36;) {
    b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : "-";
  }

  return b;
} // Maps for number <-> hex string conversion

let _convertMapsInitialized = false;

let _byteToHex;

let _hexToByte;

function initConvertMaps() {
  _byteToHex = new Array(256);
  _hexToByte = {};

  for (let i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  _convertMapsInitialized = true;
}
/** Parse a UUID into it's component bytes */
// Adapted from https://github.com/zefferus/uuid-parse


export function guidToArray(s) {
  if (!_convertMapsInitialized) {
    initConvertMaps();
  }

  let i = 0;
  const buf = new Uint8Array(16);
  s.toLowerCase().replace(/[0-9a-f]{2}/g, oct => {
    switch (i) {
      // .NET saves first three byte groups with different endianness
      // See https://stackoverflow.com/a/16722909/3922220
      case 0:
      case 1:
      case 2:
      case 3:
        buf[3 - i++] = _hexToByte[oct];
        break;

      case 4:
      case 5:
        buf[9 - i++] = _hexToByte[oct];
        break;

      case 6:
      case 7:
        buf[13 - i++] = _hexToByte[oct];
        break;

      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        buf[i++] = _hexToByte[oct];
        break;
    }
  }); // Zero out remaining bytes if string was short

  while (i < 16) {
    buf[i++] = 0;
  }

  return buf;
}
/** Convert UUID byte array into a string */

export function arrayToGuid(buf) {
  if (buf.length !== 16) {
    throw new Error("Byte array for GUID must be exactly 16 bytes long");
  }

  if (!_convertMapsInitialized) {
    initConvertMaps();
  }

  return _byteToHex[buf[3]] + _byteToHex[buf[2]] + _byteToHex[buf[1]] + _byteToHex[buf[0]] + "-" + _byteToHex[buf[5]] + _byteToHex[buf[4]] + "-" + _byteToHex[buf[7]] + _byteToHex[buf[6]] + "-" + _byteToHex[buf[8]] + _byteToHex[buf[9]] + "-" + _byteToHex[buf[10]] + _byteToHex[buf[11]] + _byteToHex[buf[12]] + _byteToHex[buf[13]] + _byteToHex[buf[14]] + _byteToHex[buf[15]];
}

function notSupported(name) {
  throw new Error("The environment doesn't support '" + name + "', please use a polyfill.");
}

export function toBase64String(inArray) {
  let str = "";

  for (let i = 0; i < inArray.length; i++) {
    str += String.fromCharCode(inArray[i]);
  }

  return typeof btoa === "function" ? btoa(str) : notSupported("btoa");
}
export function fromBase64String(b64Encoded) {
  const binary = typeof atob === "function" ? atob(b64Encoded) : notSupported("atob");
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}
export function padLeft(str, len, ch, isRight) {
  ch = ch || " ";
  len = len - str.length;

  for (let i = 0; i < len; i++) {
    str = isRight ? str + ch : ch + str;
  }

  return str;
}
export function padRight(str, len, ch) {
  return padLeft(str, len, ch, true);
}
export function remove(str, startIndex, count) {
  if (startIndex >= str.length) {
    throw new Error("startIndex must be less than length of string");
  }

  if (typeof count === "number" && startIndex + count > str.length) {
    throw new Error("Index and count must refer to a location within the string.");
  }

  return str.slice(0, startIndex) + (typeof count === "number" ? str.substr(startIndex + count) : "");
}
export function replace(str, search, replace) {
  return str.replace(new RegExp(escape(search), "g"), replace);
}
export function replicate(n, x) {
  return initialize(n, () => x);
}
export function getCharAtIndex(input, index) {
  if (index < 0 || index >= input.length) {
    throw new Error("Index was outside the bounds of the array.");
  }

  return input[index];
}
export function split(str, splitters, count, removeEmpty) {
  count = typeof count === "number" ? count : null;
  removeEmpty = typeof removeEmpty === "number" ? removeEmpty : null;

  if (count < 0) {
    throw new Error("Count cannot be less than zero");
  }

  if (count === 0) {
    return [];
  }

  if (!Array.isArray(splitters)) {
    if (removeEmpty === 0) {
      return str.split(splitters, count);
    }

    const len = arguments.length;
    splitters = Array(len - 1);

    for (let key = 1; key < len; key++) {
      splitters[key - 1] = arguments[key];
    }
  }

  splitters = splitters.map(x => escape(x));
  splitters = splitters.length > 0 ? splitters : [" "];
  let i = 0;
  const splits = [];
  const reg = new RegExp(splitters.join("|"), "g");

  while (count == null || count > 1) {
    const m = reg.exec(str);

    if (m === null) {
      break;
    }

    if (!removeEmpty || m.index - i > 0) {
      count = count != null ? count - 1 : count;
      splits.push(str.substring(i, m.index));
    }

    i = reg.lastIndex;
  }

  if (!removeEmpty || str.length - i > 0) {
    splits.push(str.substring(i));
  }

  return splits;
}
export function trim(str, ...chars) {
  if (chars.length === 0) {
    return str.trim();
  }

  const pattern = "[" + escape(chars.join("")) + "]+";
  return str.replace(new RegExp("^" + pattern), "").replace(new RegExp(pattern + "$"), "");
}
export function trimStart(str, ...chars) {
  return chars.length === 0 ? str.trimStart() : str.replace(new RegExp("^[" + escape(chars.join("")) + "]+"), "");
}
export function trimEnd(str, ...chars) {
  return chars.length === 0 ? str.trimEnd() : str.replace(new RegExp("[" + escape(chars.join("")) + "]+$"), "");
}
export function filter(pred, x) {
  return x.split("").filter(c => pred(c)).join("");
}