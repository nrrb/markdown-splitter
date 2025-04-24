const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const assert = require('assert');
const { splitMarkdownToHtml } = require('../md-splitter');

describe('TOC Links Tests', () => {
  const testOutputDir = path.join(__dirname, '../test-output');
  const readmePath = path.join(__dirname, '../README.md');

  before(() => {
    // Clean up test output directory if it exists
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true });
    }
    
    // Generate HTML files from README.md
    splitMarkdownToHtml(readmePath, testOutputDir, 'Documentation');
  });

  it('should have TOC links with .html extension', () => {
    const tocPath = path.join(testOutputDir, 'toc.html');
    assert.ok(fs.existsSync(tocPath), 'toc.html should exist');

    const dom = new JSDOM(fs.readFileSync(tocPath, 'utf-8'));
    const links = dom.window.document.querySelectorAll('a');
    
    assert.ok(links.length > 0, 'TOC should have links');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      assert.ok(href, 'Link should have href attribute');
      assert.ok(href.endsWith('.html'), `Link "${href}" should end with .html`);
      
      // Check if the target file exists
      const targetFile = path.join(testOutputDir, href);
      assert.ok(fs.existsSync(targetFile), `Target file ${targetFile} should exist`);
    });
  });
});
