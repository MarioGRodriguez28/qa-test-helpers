const { APIRequestBuilder, TestScenarioBuilder } = require('./api-builder');
const { FixtureGenerator, FixtureBatch } = require('./fixtures');
const { AssertionBuilder, DataValidator, expect } = require('./validators');
const { TestReport } = require('./reporters');

module.exports = {
  // API Builders
  APIRequestBuilder,
  TestScenarioBuilder,

  // Fixtures
  FixtureGenerator,
  FixtureBatch,

  // Validators
  AssertionBuilder,
  DataValidator,
  expect,

  // Reporters
  TestReport,

  // Convenience shortcuts
  api: (baseURL) => new APIRequestBuilder(baseURL),
  scenario: (description) => new TestScenarioBuilder(description),
  fixtures: FixtureGenerator,
  batch: () => new FixtureBatch(),
  validate: (value, desc) => new AssertionBuilder(value, desc),
  report: (title) => new TestReport(title),
};
