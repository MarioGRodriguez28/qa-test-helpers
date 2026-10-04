class TestReport {
  constructor(title = 'Test Report') {
    this.title = title;
    this.startTime = Date.now();
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
  }

  addTest(name, status, duration = 0, error = null) {
    this.tests.push({
      name,
      status,
      duration,
      error,
      timestamp: new Date().toISOString(),
    });

    if (status === 'passed') this.passed++;
    if (status === 'failed') this.failed++;
    if (status === 'skipped') this.skipped++;

    return this;
  }

  getTotal() {
    return this.tests.length;
  }

  getPassRate() {
    const total = this.getTotal();
    return total === 0 ? 0 : ((this.passed / total) * 100).toFixed(2);
  }

  getDuration() {
    return ((Date.now() - this.startTime) / 1000).toFixed(2);
  }

  toJSON() {
    return {
      title: this.title,
      summary: {
        total: this.getTotal(),
        passed: this.passed,
        failed: this.failed,
        skipped: this.skipped,
        passRate: `${this.getPassRate()}%`,
        duration: `${this.getDuration()}s`,
      },
      tests: this.tests,
      generatedAt: new Date().toISOString(),
    };
  }

  toConsole() {
    console.log('\n' + '='.repeat(60));
    console.log(`📊 ${this.title}`);
    console.log('='.repeat(60));

    this.tests.forEach(test => {
      const icon = test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '⊘';
      console.log(
        `${icon} ${test.name} (${test.duration}ms)`
      );
      if (test.error) {
        console.log(`  ❌ ${test.error}`);
      }
    });

    console.log('='.repeat(60));
    console.log(`📈 Summary`);
    console.log(`   Passed: ${this.passed}`);
    console.log(`   Failed: ${this.failed}`);
    console.log(`   Skipped: ${this.skipped}`);
    console.log(`   Total: ${this.getTotal()}`);
    console.log(`   Pass Rate: ${this.getPassRate()}%`);
    console.log(`   Duration: ${this.getDuration()}s`);
    console.log('='.repeat(60) + '\n');

    return this;
  }

  toHTML() {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${this.title}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 20px; }
    .report { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; }
    .stat { background: #f0f0f0; padding: 15px; border-radius: 4px; text-align: center; }
    .stat-value { font-size: 24px; font-weight: bold; }
    .stat-label { font-size: 12px; color: #666; }
    .passed { color: green; }
    .failed { color: red; }
    .skipped { color: orange; }
    .test { padding: 10px; border-left: 4px solid #ddd; margin: 10px 0; }
    .test.passed { border-left-color: green; background: #f0fff0; }
    .test.failed { border-left-color: red; background: #fff0f0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f0f0f0; font-weight: bold; }
  </style>
</head>
<body>
  <div class="report">
    <h1>${this.title}</h1>
    <div class="summary">
      <div class="stat">
        <div class="stat-value">${this.passed}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat">
        <div class="stat-value failed">${this.failed}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat">
        <div class="stat-value skipped">${this.skipped}</div>
        <div class="stat-label">Skipped</div>
      </div>
      <div class="stat">
        <div class="stat-value">${this.getPassRate()}%</div>
        <div class="stat-label">Pass Rate</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Test</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Error</th>
        </tr>
      </thead>
      <tbody>
        ${this.tests
          .map(
            test => `
          <tr class="${test.status}">
            <td>${test.name}</td>
            <td>${test.status.toUpperCase()}</td>
            <td>${test.duration}ms</td>
            <td>${test.error || '-'}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
    <p style="margin-top: 20px; color: #999; font-size: 12px;">
      Generated at ${new Date().toISOString()}
    </p>
  </div>
</body>
</html>
    `;
    return html;
  }
}

module.exports = {
  TestReport,
};
