const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    console.error(`FAIL: ${name} - ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertDeepEqual(a, b, msg) {
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    throw new Error(msg || `Expected ${JSON.stringify(a)} to equal ${JSON.stringify(b)}`);
  }
}

// Load jest config
const jestConfig = require(path.join(__dirname, '..', 'jest.config.js'));

test('jest.config.js exists and exports config', () => {
  assert(typeof jestConfig === 'object', 'should export an object');
});

test('testEnvironment is node', () => {
  assert(jestConfig.testEnvironment === 'node', 'testEnvironment should be node');
});

test('has roots configured', () => {
  assert(Array.isArray(jestConfig.roots), 'roots should be an array');
  assert(jestConfig.roots.includes('<rootDir>/src'), 'roots should include src');
});

test('has testMatch patterns', () => {
  assert(Array.isArray(jestConfig.testMatch), 'testMatch should be an array');
  assert(jestConfig.testMatch.length >= 2, 'should have at least 2 patterns');
});

test('has coverage config', () => {
  assert(Array.isArray(jestConfig.collectCoverageFrom), 'collectCoverageFrom should be an array');
});

test('has coverageThresholds', () => {
  assert(jestConfig.coverageThresholds, 'should have coverageThresholds');
  assert(jestConfig.coverageThresholds.global.branches === 80, 'branches threshold should be 80');
});

test('has fakeTimers config with legacyFakeTimers', () => {
  assert(jestConfig.fakeTimers, 'should have fakeTimers config');
  assert(jestConfig.fakeTimers.legacyFakeTimers === true, 'legacyFakeTimers should be true');
  assert(jestConfig.fakeTimers.enableGlobally === false, 'enableGlobally should be false');
});

test('has snapshotFormat config', () => {
  assert(jestConfig.snapshotFormat, 'should have snapshotFormat');
  assert(jestConfig.snapshotFormat.escapeString === true, 'escapeString should be true');
  assert(jestConfig.snapshotFormat.printBasicPrototype === true, 'printBasicPrototype should be true');
});

test('has moduleNameMapper', () => {
  assert(jestConfig.moduleNameMapper, 'should have moduleNameMapper');
  assert(jestConfig.moduleNameMapper['^@utils/(.*)$'], 'should map @utils');
  assert(jestConfig.moduleNameMapper['^@processors/(.*)$'], 'should map @processors');
});

test('jest package is installed', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  assert(pkg.devDependencies.jest, 'jest should be in devDependencies');
  assert(pkg.devDependencies.jest.startsWith('28'), `jest should be 28.x, got ${pkg.devDependencies.jest}`);
});

test('source files exist', () => {
  assert(fs.existsSync(path.join(__dirname, '..', 'src', 'utils', 'validator.js')), 'validator.js should exist');
  assert(fs.existsSync(path.join(__dirname, '..', 'src', 'utils', 'formatter.js')), 'formatter.js should exist');
  assert(fs.existsSync(path.join(__dirname, '..', 'src', 'processors', 'csv.js')), 'csv.js should exist');
});

// Test the actual utilities
const { isEmail, isUrl, isNumeric, isNonEmpty } = require(path.join(__dirname, '..', 'src', 'utils', 'validator'));
const { formatCurrency, truncate, slugify } = require(path.join(__dirname, '..', 'src', 'utils', 'formatter'));
const { parseCSV, toCSV } = require(path.join(__dirname, '..', 'src', 'processors', 'csv'));

test('validator: isEmail works', () => {
  assert(isEmail('test@example.com'), 'should validate email');
  assert(!isEmail('not-email'), 'should reject non-email');
});

test('validator: isUrl works', () => {
  assert(isUrl('https://example.com'), 'should validate URL');
  assert(!isUrl('not-url'), 'should reject non-URL');
});

test('validator: isNumeric works', () => {
  assert(isNumeric(42), 'should validate number');
  assert(isNumeric('3.14'), 'should validate numeric string');
  assert(!isNumeric('abc'), 'should reject non-numeric');
});

test('formatter: truncate works', () => {
  assert(truncate('hello', 10) === 'hello', 'short string unchanged');
  assert(truncate('hello world this is long', 10) === 'hello w...', 'long string truncated');
});

test('formatter: slugify works', () => {
  assert(slugify('Hello World') === 'hello-world', 'basic slugify');
  assert(slugify('  Special @#$ chars  ') === 'special-chars', 'special chars removed');
});

test('csv: parseCSV works', () => {
  const result = parseCSV('name,age\nAlice,30\nBob,25');
  assert(result.length === 2, 'should parse 2 rows');
  assert(result[0].name === 'Alice', 'first row name');
  assert(result[1].age === '25', 'second row age');
});

test('csv: toCSV works', () => {
  const result = toCSV([{ name: 'Alice', age: 30 }]);
  assert(result.includes('name,age'), 'should have headers');
  assert(result.includes('Alice,30'), 'should have data');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
