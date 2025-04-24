const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const assert = require('assert');
const { splitMarkdownToHtml } = require('../md-splitter');

describe('HTML Code Block Tests', () => {
  const testOutputDir = path.join(__dirname, '../test-output');
  const testInputFile = path.join(testOutputDir, 'test-html-blocks.md');

  before(() => {
    // Clean up test output directory if it exists
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true });
    }
    fs.mkdirSync(testOutputDir);

    // Create a test markdown file with HTML code blocks
    const testMarkdown = `# HTML Code Blocks

## Example One
\`\`\`html
<div class="example">
  <h1>Hello World</h1>
  <p>This is a test</p>
</div>
\`\`\`

## Example Two
\`\`\`html
<!-- Comment -->
<script>alert('test');</script>
<style>body { color: red; }</style>
\`\`\`
`;
    fs.writeFileSync(testInputFile, testMarkdown);
    
    // Generate HTML files
    splitMarkdownToHtml(testInputFile, testOutputDir, 'Test Documentation');
  });

  it('should properly escape HTML in code blocks', () => {
    // Check example-one.html
    const exampleOnePath = path.join(testOutputDir, 'example-one.html');
    assert.ok(fs.existsSync(exampleOnePath), 'example-one.html should exist');

    const dom = new JSDOM(fs.readFileSync(exampleOnePath, 'utf-8'));
    const codeBlock = dom.window.document.querySelector('code.language-html');
    assert.ok(codeBlock, 'Should have HTML code block');

    const codeContent = codeBlock.textContent;
    
    // Verify HTML tags are visible as text
    assert.ok(codeContent.includes('<div class="example">'), 'Should show HTML tags as text');
    assert.ok(codeContent.includes('<h1>'), 'Should show HTML tags as text');
    
    // Verify HTML isn't being interpreted
    const actualDivs = dom.window.document.querySelectorAll('div.example');
    assert.strictEqual(actualDivs.length, 0, 'HTML in code block should not be interpreted');
    
    // Check example-two.html for potentially dangerous HTML
    const exampleTwoPath = path.join(testOutputDir, 'example-two.html');
    const dom2 = new JSDOM(fs.readFileSync(exampleTwoPath, 'utf-8'));
    const codeBlock2 = dom2.window.document.querySelector('code.language-html');
    
    const codeContent2 = codeBlock2.textContent;
    assert.ok(codeContent2.includes('<script>'), 'Should show script tags as text');
    assert.ok(codeContent2.includes('<style>'), 'Should show style tags as text');
    
    // Verify script and style tags aren't being interpreted
    const scripts = dom2.window.document.querySelectorAll('script');
    const styles = dom2.window.document.querySelectorAll('style');
    assert.ok(!Array.from(scripts).some(s => s.textContent.includes("alert('test')")), 'Script should not be interpreted');
    assert.ok(!Array.from(styles).some(s => s.textContent.includes('color: red')), 'Style should not be interpreted');
  });

  after(() => {
    // Clean up test files
    if (fs.existsSync(testInputFile)) {
      fs.unlinkSync(testInputFile);
    }
  });
});
