const crypto = require('crypto');

class FixtureGenerator {
  static generateId() {
    return Math.floor(Math.random() * 10000);
  }

  static generateUUID() {
    return crypto.randomUUID();
  }

  static generateEmail(domain = 'test.com') {
    const random = Math.random().toString(36).substring(7);
    return `user_${random}@${domain}`;
  }

  static generateUsername(prefix = 'user') {
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}_${random}`;
  }

  static generatePhoneNumber(format = '+1XXXXXXXXXX') {
    let phone = format;
    while (phone.includes('X')) {
      phone = phone.replace('X', Math.floor(Math.random() * 10));
    }
    return phone;
  }

  static generatePassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  static generateUser(overrides = {}) {
    return {
      id: this.generateId(),
      username: this.generateUsername(),
      email: this.generateEmail(),
      firstName: `User_${Math.random().toString(36).substring(7)}`,
      lastName: `Test_${Math.random().toString(36).substring(7)}`,
      phone: this.generatePhoneNumber(),
      active: true,
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static generatePost(userId = 1, overrides = {}) {
    return {
      id: this.generateId(),
      userId,
      title: `Test Post ${Date.now()}`,
      content: `This is a test post content generated at ${new Date().toISOString()}`,
      status: 'draft',
      tags: ['test', 'automation', 'qa'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static generateComment(postId = 1, overrides = {}) {
    return {
      id: this.generateId(),
      postId,
      author: this.generateUsername(),
      email: this.generateEmail(),
      content: `Test comment on post ${postId}`,
      approved: true,
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static generateProduct(overrides = {}) {
    return {
      id: this.generateId(),
      sku: `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      name: `Test Product ${Date.now()}`,
      description: 'Test product for automation testing',
      price: parseFloat((Math.random() * 1000).toFixed(2)),
      quantity: Math.floor(Math.random() * 100),
      category: 'test',
      active: true,
      createdAt: new Date().toISOString(),
      ...overrides,
    };
  }

  static generateBatch(generator, count = 10, overrides = {}) {
    const batch = [];
    for (let i = 0; i < count; i++) {
      batch.push(generator.call(this, { ...overrides, id: this.generateId() }));
    }
    return batch;
  }
}

class FixtureBatch {
  constructor() {
    this.users = [];
    this.posts = [];
    this.comments = [];
  }

  addUser(overrides = {}) {
    this.users.push(FixtureGenerator.generateUser(overrides));
    return this;
  }

  addUsers(count = 5) {
    for (let i = 0; i < count; i++) {
      this.addUser();
    }
    return this;
  }

  addPost(userId = 1, overrides = {}) {
    this.posts.push(FixtureGenerator.generatePost(userId, overrides));
    return this;
  }

  addComment(postId = 1, overrides = {}) {
    this.comments.push(FixtureGenerator.generateComment(postId, overrides));
    return this;
  }

  build() {
    return {
      users: this.users,
      posts: this.posts,
      comments: this.comments,
    };
  }

  clear() {
    this.users = [];
    this.posts = [];
    this.comments = [];
    return this;
  }
}

module.exports = {
  FixtureGenerator,
  FixtureBatch,
};
