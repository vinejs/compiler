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
  return `function report(message, rule, field, args) {
  field.isValid = false;
  errorReporter.report(messagesProvider.getMessage(message, rule, field, args), rule, field, args);
};
function memo(fn) {
  let value;
  return () => {
    if (value) {
      return value
    }
    value = fn()
    return value
  }
};
function defineValue(value, field) {
  ${options.convertEmptyStringsToNull ? `if (value === '') { value = null; }` : ''}
  field.value = value;
  field.isDefined = value !== undefined && value !== null;
  return field;
};
function ensureExists(field) {
  if (field.value === undefined || field.value === null) {
    field.report(REQUIRED, 'required', field);
    return false;
  }
  return true;
};
function ensureIsDefined(field) {
  if (field.value === undefined) {
    field.report(REQUIRED, 'required', field);
    return false;
  }
  return true;
};
function ensureIsObject(field) {
  if (!field.isDefined) {
    return false;
  }
  if (typeof field.value == 'object' && !Array.isArray(field.value)) {
    return true;
  }
  field.report(NOT_AN_OBJECT, 'object', field);
  return false;
};
function ensureIsArray(field) {
  if (!field.isDefined) {
    return false;
  }
  if (Array.isArray(field.value)) {
    return true;
  }
  field.report(NOT_AN_ARRAY, 'array', field);
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
