const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const assert = require('assert');
const { splitMarkdownToHtml } = require('../md-splitter');

describe('Code Block Tests', () => {
  const testOutputDir = path.join(__dirname, '../test-code-blocks-output');
  const readmePath = path.join(__dirname, '../README.md');

  before(() => {
    // Clean up test output directory if it exists
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true });
    }
    
    // Generate HTML files from README.md
    splitMarkdownToHtml(readmePath, testOutputDir, 'Documentation', { syntaxHighlight: true });
  });

  it('should add copy buttons to all code blocks', () => {
    // Get all HTML files in the output directory
    const htmlFiles = fs.readdirSync(testOutputDir)
      .filter(file => file.endsWith('.html'))
      .map(file => path.join(testOutputDir, file));

    // Check each HTML file
    htmlFiles.forEach(htmlFile => {
      const html = fs.readFileSync(htmlFile, 'utf-8');
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Find all pre elements (code blocks)
      const codeBlocks = document.querySelectorAll('pre');
      
      if (codeBlocks.length > 0) {
        console.log(`Found ${codeBlocks.length} code blocks in ${path.basename(htmlFile)}`);
        
        // Check for copy button script
        const scripts = Array.from(document.querySelectorAll('script'));
        const copyButtonScript = scripts.find(script => 
          script.textContent.includes('document.querySelectorAll(\'pre\')') &&
          script.textContent.includes('code-copy-button')
        );
        
        assert.ok(
          copyButtonScript,
          `${path.basename(htmlFile)} is missing the copy button script`
        );
      }
    });
  });

  after(() => {
    // Clean up test output directory
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true });
    }
  });
});
