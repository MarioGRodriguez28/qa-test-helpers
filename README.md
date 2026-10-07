# QA Test Helpers

[![CI](https://github.com/MarioGRodriguez28/qa-test-helpers/actions/workflows/test.yml/badge.svg)](https://github.com/MarioGRodriguez28/qa-test-helpers/actions/workflows/test.yml)

A professional, production-ready library of QA testing utilities — fluent API builders, realistic test data generators, powerful validators, and beautiful test reporters.

## Features

✨ **Fluent API Builder** — Build API requests with clean, chainable syntax
🎯 **Smart Fixtures** — Generate realistic test data on demand
✅ **Advanced Validators** — Powerful assertions beyond simple equality checks
📊 **Beautiful Reports** — Console, JSON, and HTML test reports
🎨 **Zero Dependencies** — Pure JavaScript, works everywhere

## Installation

```bash
npm install qa-test-helpers
```

## Quick Start

### API Request Builder

```javascript
const { APIRequestBuilder } = require('qa-test-helpers');

const request = new APIRequestBuilder('https://api.example.com')
  .post('/users')
  .withHeaders({ 'Content-Type': 'application/json' })
  .withAuth('my-token-123')
  .withBody({ name: 'John', email: 'john@example.com' })
  .expectStatus(201)
  .build();

console.log(request);
// {
//   method: 'POST',
//   url: 'https://api.example.com/users',
//   headers: { Authorization: 'Bearer my-token-123', ... },
//   body: { name: 'John', email: 'john@example.com' },
//   expectedStatus: 201
// }
```

### Test Data Fixtures

```javascript
const { FixtureGenerator, FixtureBatch } = require('qa-test-helpers');

// Single fixture
const user = FixtureGenerator.generateUser({
  email: 'custom@example.com'
});

// Batch of fixtures
const batch = new FixtureBatch()
  .addUsers(5)
  .addPost(1, { title: 'Custom Title' })
  .addComment(1)
  .build();

console.log(batch);
// {
//   users: [ { id: 1234, username: 'user_abc123', email: '...' }, ... ],
//   posts: [ { id: 5678, userId: 1, title: 'Custom Title', ... } ],
//   comments: [ { id: 9012, postId: 1, author: '...', ... } ]
// }
```

### Smart Validators

```javascript
const { DataValidator, expect } = require('qa-test-helpers');

// Functional validators
DataValidator.isValidEmail('user@example.com');  // true
DataValidator.isValidURL('https://example.com'); // true
DataValidator.hasRequiredFields(user, ['id', 'email', 'username']);

// Fluent assertions
expect(response.status, 'Response status')
  .toBe(200)
  .toBeGreaterThan(199);

expect(user.email, 'Email format')
  .toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

expect(users, 'Users list')
  .toBeDefined()
  .toBeTruthy();
```

### Test Reporters

```javascript
const { TestReport } = require('qa-test-helpers');

const report = new TestReport('User API Tests');

report
  .addTest('GET /users', 'passed', 145)
  .addTest('POST /users', 'passed', 298)
  .addTest('PUT /users/:id', 'failed', 180, 'Expected 200, got 404')
  .addTest('DELETE /users/:id', 'skipped', 0);

// Console output
report.toConsole();

// JSON output
const json = report.toJSON();

// HTML report (save to file)
const html = report.toHTML();
```

## API Reference

### APIRequestBuilder

Fluent builder for constructing HTTP requests.

```javascript
const builder = new APIRequestBuilder(baseURL);

builder
  .get(endpoint)           // or .post(), .put(), .delete(), .patch()
  .withHeaders({})         // Add custom headers
  .withAuth(token)         // Add Bearer token auth
  .withBody(data)          // Set request body
  .withParams({})          // Add query parameters
  .expectStatus(200)       // Set expected response code
  .withTimeout(5000)       // Set timeout in ms
  .build()                 // Return config object
```

### FixtureGenerator

Generate realistic test data.

```javascript
FixtureGenerator.generateId()              // Random ID
FixtureGenerator.generateUUID()            // UUID v4
FixtureGenerator.generateEmail()           // Random email
FixtureGenerator.generateUsername()        // Random username
FixtureGenerator.generatePhoneNumber()     // Random phone
FixtureGenerator.generatePassword()        // Random password
FixtureGenerator.generateUser(overrides)   // Complete user object
FixtureGenerator.generatePost(userId)      // Complete post object
FixtureGenerator.generateComment(postId)   // Complete comment object
FixtureGenerator.generateProduct()         // Complete product object
FixtureGenerator.generateBatch(generator, count) // Batch of items
```

### DataValidator

Validate common data patterns.

```javascript
DataValidator.isValidEmail(email)
DataValidator.isValidURL(url)
DataValidator.isValidPhoneNumber(phone, format)
DataValidator.isValidJSON(string)
DataValidator.hasRequiredFields(object, fields)
DataValidator.isValidDateString(dateString)
DataValidator.isWithinRange(value, min, max)
DataValidator.isValidLength(string, minLength, maxLength)
DataValidator.hasProperties(object, properties)
```

### TestReport

Generate test execution reports.

```javascript
const report = new TestReport('Test Suite Name');

report.addTest(name, status, duration, error)
report.getTotal()          // Total tests
report.getPassRate()       // Pass rate %
report.getDuration()       // Total duration
report.toJSON()            // JSON output
report.toConsole()         // Print to console
report.toHTML()            // HTML string
```

## Usage Examples

### E2E Test with Builders

```javascript
const { 
  APIRequestBuilder, 
  FixtureGenerator, 
  TestReport,
  DataValidator 
} = require('qa-test-helpers');

async function testUserWorkflow() {
  const report = new TestReport('User Management Workflow');

  const newUser = FixtureGenerator.generateUser();

  const createReq = new APIRequestBuilder('https://api.example.com')
    .post('/users')
    .withBody(newUser)
    .expectStatus(201)
    .build();

  // Execute request and validate
  const createStart = Date.now();
  const response = await fetch(createReq.url, {
    method: createReq.method,
    headers: createReq.headers,
    body: JSON.stringify(createReq.body),
  });
  const createDuration = Date.now() - createStart;

  if (response.status === createReq.expectedStatus) {
    report.addTest('Create User', 'passed', createDuration);
  } else {
    report.addTest('Create User', 'failed', createDuration, 
      `Expected ${createReq.expectedStatus}, got ${response.status}`);
  }

  // Validate response data
  const userData = await response.json();
  const isValid = DataValidator.hasRequiredFields(userData, ['id', 'email', 'username']);
  
  report.addTest('User Data Validation', isValid ? 'passed' : 'failed', 10);

  report.toConsole();
  return report.toJSON();
}
```

### Batch Test Data

```javascript
const { FixtureBatch, expect } = require('qa-test-helpers');

const testData = new FixtureBatch()
  .addUsers(10)
  .addPost(1, { title: 'Featured Post' })
  .addPost(1, { title: 'Draft Post', status: 'draft' })
  .addPost(2)
  .addComment(1)
  .addComment(2, { approved: false })
  .build();

expect(testData.users.length).toBe(10);
expect(testData.posts.length).toBeGreaterThan(2);
```

## Best Practices

1. **Use Builders for Complex Requests** — Chain methods for readability
2. **Override Fixtures** — Pass `overrides` object for customization
3. **Validate Early** — Catch data issues before test execution
4. **Generate Reports** — Always capture test metrics for analysis
5. **Reuse Batches** — Build complex test data once, use multiple times

## Architecture

- **Zero Dependencies** — Pure JavaScript, no external packages
- **Composable** — Mix and match builders, fixtures, validators
- **Type-Safe** — Clear method names and return values
- **Extensible** — Easy to subclass and customize

## License

MIT

## Author

Mario Rodríguez - QA Automation Engineer

---

For issues, questions, or contributions: [GitHub Issues](https://github.com/MarioGRodriguez28/qa-test-helpers/issues)

---

Part of my [QA automation portfolio](https://github.com/MarioGRodriguez28/qa-portfolio-docs). More about my work at [mariogrodriguez.com](https://mariogrodriguez.com).
