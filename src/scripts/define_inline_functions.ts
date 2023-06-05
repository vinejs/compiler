/*
 * @vinejs/compiler
 *
 * (c) VineJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Returns JS fragment for inline function needed by the
 * validation runtime code.
 */
export function defineInlineFunctions(options: { convertEmptyStringsToNull: boolean }) {
  return `function report(message, rule, ctx, args) {
  ctx.isValid = false;
  errorReporter.report(messagesProvider.getMessage(message, rule, ctx, args), rule, ctx, args);
};
function defineValue(value, ctx) {
  ${options.convertEmptyStringsToNull ? `if (value === '') { value = null; }` : ''}
  ctx.value = value;
  ctx.isDefined = value !== undefined && value !== null;
  return ctx;
};
function ensureExists(ctx) {
  if (ctx.value === undefined || ctx.value === null) {
    ctx.report(REQUIRED, 'required', ctx);
    return false;
  }
  return true;
};
function ensureIsDefined(ctx) {
  if (ctx.value === undefined) {
    ctx.report(REQUIRED, 'required', ctx);
    return false;
  }
  return true;
};
function ensureIsObject(ctx) {
  if (!ctx.isDefined) {
    return false;
  }
  if (typeof ctx.value == 'object' && !Array.isArray(ctx.value)) {
    return true;
  }
  ctx.report(NOT_AN_OBJECT, 'object', ctx);
  return false;
};
function ensureIsArray(ctx) {
  if (!ctx.isDefined) {
    return false;
  }
  if (Array.isArray(ctx.value)) {
    return true;
  }
  ctx.report(NOT_AN_ARRAY, 'array', ctx);
  return false;
};
function copyProperties(val) {
  let k, out, tmp;

  if (Array.isArray(val)) {
    out = Array((k = val.length))
    while (k--) out[k] = (tmp = val[k]) && typeof tmp == 'object' ? copyProperties(tmp) : tmp
    return out
  }

  if (Object.prototype.toString.call(val) === '[object Object]') {
    out = {} // null
    for (k in val) {
      out[k] = (tmp = val[k]) && typeof tmp == 'object' ? copyProperties(tmp) : tmp
    }
    return out
  }
  return val
};
function moveProperties(source, destination, ignoreKeys) {
  for (let key in source) {
    if (!ignoreKeys.includes(key)) {
      const value = source[key]
      destination[key] = copyProperties(value)
    }
  }
};`
}
