class APIRequestBuilder {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.endpoint = '';
    this.method = 'GET';
    this.headers = {};
    this.body = null;
    this.params = {};
    this.expectedStatus = 200;
    this.timeout = 5000;
  }

  withBaseURL(url) {
    this.baseURL = url;
    return this;
  }

  get(endpoint) {
    this.method = 'GET';
    this.endpoint = endpoint;
    return this;
  }

  post(endpoint) {
    this.method = 'POST';
    this.endpoint = endpoint;
    return this;
  }

  put(endpoint) {
    this.method = 'PUT';
    this.endpoint = endpoint;
    return this;
  }

  delete(endpoint) {
    this.method = 'DELETE';
    this.endpoint = endpoint;
    return this;
  }

  patch(endpoint) {
    this.method = 'PATCH';
    this.endpoint = endpoint;
    return this;
  }

  withHeaders(headers) {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  withAuth(token) {
    this.headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  withBody(data) {
    this.body = data;
    return this;
  }

  withParams(params) {
    this.params = { ...this.params, ...params };
    return this;
  }

  expectStatus(code) {
    this.expectedStatus = code;
    return this;
  }

  withTimeout(ms) {
    this.timeout = ms;
    return this;
  }

  build() {
    const url = new URL(this.baseURL);
    url.pathname = url.pathname.replace(/\/+$/, '') + '/' + this.endpoint.replace(/^\/+/, '');

    Object.entries(this.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return {
      method: this.method,
      url: url.toString(),
      headers: this.headers,
      body: this.body,
      expectedStatus: this.expectedStatus,
      timeout: this.timeout,
    };
  }

  toString() {
    return JSON.stringify(this.build(), null, 2);
  }
}

class TestScenarioBuilder {
  constructor(description) {
    this.description = description;
    this.steps = [];
    this.assertions = [];
  }

  step(description, action) {
    this.steps.push({ description, action });
    return this;
  }

  assert(description, validator) {
    this.assertions.push({ description, validator });
    return this;
  }

  build() {
    return {
      description: this.description,
      steps: this.steps,
      assertions: this.assertions,
    };
  }

  async execute() {
    console.log(`\n🧪 Scenario: ${this.description}`);

    for (const s of this.steps) {
      console.log(`  ✓ ${s.description}`);
      await s.action();
    }

    for (const a of this.assertions) {
      console.log(`  ✓ ${a.description}`);
      a.validator();
    }
  }
}

module.exports = {
  APIRequestBuilder,
  TestScenarioBuilder,
};
