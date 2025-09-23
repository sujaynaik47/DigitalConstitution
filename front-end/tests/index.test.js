// front-end/tests/index.test.js
const fs     = require('fs');
const path   = require('path');
const { JSDOM } = require('jsdom');

describe('index.html', () => {
  it('contains <h1>Welcome to Minor Project D5</h1>', () => {
    const file = path.resolve(__dirname, '../index.html');
    const html = fs.readFileSync(file, 'utf-8');
    const dom  = new JSDOM(html);
    const h1   = dom.window.document.querySelector('h1');
    expect(h1.textContent).toBe('Welcome to Minor Project D5');
  });
});
