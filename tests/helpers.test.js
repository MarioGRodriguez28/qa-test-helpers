const {
  APIRequestBuilder,
  TestScenarioBuilder,
  FixtureGenerator,
  FixtureBatch,
  DataValidator,
  expect: check,
  TestReport,
} = require('../src');

describe('APIRequestBuilder', () => {
  it('builds a request with method, url, headers and body', () => {
    const req = new APIRequestBuilder('https://api.example.com')
      .post('/users')
      .withAuth('abc')
      .withBody({ name: 'Ana' })
      .expectStatus(201)
      .build();

    expect(req.method).toBe('POST');
    expect(req.url).toBe('https://api.example.com/users');
    expect(req.headers.Authorization).toBe('Bearer abc');
    expect(req.body).toEqual({ name: 'Ana' });
    expect(req.expectedStatus).toBe(201);
  });

  it('appends query params', () => {
    const req = new APIRequestBuilder('https://api.example.com')
      .get('/posts')
      .withParams({ userId: 1, page: 2 })
      .build();

    expect(req.url).toBe('https://api.example.com/posts?userId=1&page=2');
  });

  it('keeps a base path without duplicating slashes', () => {
    const req = new APIRequestBuilder('https://api.example.com/v1/').get('/users').build();

    expect(req.url).toBe('https://api.example.com/v1/users');
  });
});

describe('TestScenarioBuilder', () => {
  it('runs steps and assertions in order', async () => {
    const calls = [];
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    await new TestScenarioBuilder('demo')
      .step('first', async () => calls.push('step'))
      .assert('then', () => calls.push('assert'))
      .execute();

    log.mockRestore();
    expect(calls).toEqual(['step', 'assert']);
  });
});

describe('FixtureGenerator', () => {
  it('generates a user with a valid email and overrides', () => {
    const user = FixtureGenerator.generateUser({ active: false });

    expect(DataValidator.isValidEmail(user.email)).toBe(true);
    expect(user.active).toBe(false);
  });

  it('generates a phone number that passes validation', () => {
    expect(DataValidator.isValidPhoneNumber(FixtureGenerator.generatePhoneNumber())).toBe(true);
  });

  it('generates passwords of the requested length', () => {
    expect(FixtureGenerator.generatePassword(20)).toHaveLength(20);
  });

  it('generates unique UUIDs', () => {
    expect(FixtureGenerator.generateUUID()).not.toBe(FixtureGenerator.generateUUID());
  });

  it('generates a batch of the requested size', () => {
    const batch = FixtureGenerator.generateBatch(FixtureGenerator.generateProduct, 4);

    expect(batch).toHaveLength(4);
  });
});

describe('FixtureBatch', () => {
  it('collects users, posts and comments', () => {
    const data = new FixtureBatch().addUsers(3).addPost(1).addComment(1).build();

    expect(data.users).toHaveLength(3);
    expect(data.posts).toHaveLength(1);
    expect(data.comments).toHaveLength(1);
  });

  it('clears its content', () => {
    const data = new FixtureBatch().addUsers(2).clear().build();

    expect(data.users).toHaveLength(0);
  });
});

describe('DataValidator', () => {
  it.each([
    ['isValidEmail', 'a@b.co', true],
    ['isValidEmail', 'not-an-email', false],
    ['isValidURL', 'https://example.com', true],
    ['isValidURL', 'example', false],
    ['isValidJSON', '{"a":1}', true],
    ['isValidJSON', '{a:1}', false],
    ['isValidDateString', '2026-10-04', true],
    ['isValidDateString', 'nope', false],
  ])('%s(%p) -> %p', (fn, input, expected) => {
    expect(DataValidator[fn](input)).toBe(expected);
  });

  it('checks required fields, ranges and lengths', () => {
    expect(DataValidator.hasRequiredFields({ id: 1, name: null }, ['id', 'name'])).toBe(false);
    expect(DataValidator.hasRequiredFields({ id: 1, name: 'x' }, ['id', 'name'])).toBe(true);
    expect(DataValidator.isWithinRange(5, 1, 10)).toBe(true);
    expect(DataValidator.isWithinRange(11, 1, 10)).toBe(false);
    expect(DataValidator.isValidLength('abc', 2, 3)).toBe(true);
  });
});

describe('expect assertions', () => {
  it('passes when the condition holds and chains', () => {
    expect(() => check(5, 'n').toBe(5).toBeGreaterThan(1).toBeLessThan(10)).not.toThrow();
  });

  it('throws a descriptive error when it does not', () => {
    expect(() => check(5, 'status').toBe(6)).toThrow('status expected 6, got 5');
  });

  it('compares objects by value', () => {
    expect(() => check({ a: 1 }).toEqual({ a: 1 })).not.toThrow();
    expect(() => check({ a: 1 }).toEqual({ a: 2 })).toThrow();
  });
});

describe('TestReport', () => {
  const build = () =>
    new TestReport('Suite')
      .addTest('a', 'passed', 10)
      .addTest('b', 'failed', 20, 'boom')
      .addTest('c', 'skipped');

  it('counts results and computes the pass rate', () => {
    const report = build();

    expect(report.getTotal()).toBe(3);
    expect(report.passed).toBe(1);
    expect(report.failed).toBe(1);
    expect(report.skipped).toBe(1);
    expect(report.getPassRate()).toBe('33.33');
  });

  it('serialises to JSON and HTML', () => {
    const report = build();

    expect(report.toJSON().summary.total).toBe(3);
    expect(report.toHTML()).toContain('<td>b</td>');
    expect(report.toHTML()).toContain('boom');
  });

  it('returns a 0 pass rate when empty', () => {
    expect(new TestReport().getPassRate()).toBe(0);
  });
});
