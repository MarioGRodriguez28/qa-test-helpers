class AssertionBuilder {
  constructor(actual, description = '') {
    this.actual = actual;
    this.description = description;
  }

  toBe(expected) {
    if (this.actual !== expected) {
      throw new Error(
        `${this.description} expected ${expected}, got ${this.actual}`
      );
    }
    return this;
  }

  toEqual(expected) {
    if (JSON.stringify(this.actual) !== JSON.stringify(expected)) {
      throw new Error(
        `${this.description} objects do not match\nExpected: ${JSON.stringify(expected)}\nGot: ${JSON.stringify(this.actual)}`
      );
    }
    return this;
  }

  toBeGreaterThan(expected) {
    if (!(this.actual > expected)) {
      throw new Error(
        `${this.description} expected > ${expected}, got ${this.actual}`
      );
    }
    return this;
  }

  toBeLessThan(expected) {
    if (!(this.actual < expected)) {
      throw new Error(
        `${this.description} expected < ${expected}, got ${this.actual}`
      );
    }
    return this;
  }

  toContain(value) {
    if (!this.actual.includes(value)) {
      throw new Error(
        `${this.description} expected to contain ${value}`
      );
    }
    return this;
  }

  toMatch(pattern) {
    if (!pattern.test(this.actual)) {
      throw new Error(
        `${this.description} expected to match ${pattern}`
      );
    }
    return this;
  }

  toBeDefined() {
    if (this.actual === undefined) {
      throw new Error(`${this.description} expected to be defined`);
    }
    return this;
  }

  toBeNull() {
    if (this.actual !== null) {
      throw new Error(`${this.description} expected to be null, got ${this.actual}`);
    }
    return this;
  }

  toBeTruthy() {
    if (!this.actual) {
      throw new Error(`${this.description} expected truthy, got ${this.actual}`);
    }
    return this;
  }

  toBeFalsy() {
    if (this.actual) {
      throw new Error(`${this.description} expected falsy, got ${this.actual}`);
    }
    return this;
  }
}

class DataValidator {
  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidPhoneNumber(phone, format = 'international') {
    const patterns = {
      international: /^\+?[1-9]\d{1,14}$/,
      us: /^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    };
    return patterns[format]?.test(phone) ?? false;
  }

  static isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  static hasRequiredFields(obj, fields) {
    return fields.every(field => field in obj && obj[field] !== null && obj[field] !== undefined);
  }

  static isValidDateString(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  }

  static isWithinRange(value, min, max) {
    return value >= min && value <= max;
  }

  static isValidLength(str, minLength, maxLength) {
    return str.length >= minLength && str.length <= maxLength;
  }

  static hasProperties(obj, properties) {
    return properties.every(prop => prop in obj);
  }
}

function expect(actual, description = '') {
  return new AssertionBuilder(actual, description);
}

module.exports = {
  AssertionBuilder,
  DataValidator,
  expect,
};
