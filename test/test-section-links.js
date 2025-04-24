const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const assert = require('assert');
const { splitMarkdownToHtml } = require('../md-splitter');

describe('Section Links Tests', () => {
  const testOutputDir = path.join(__dirname, '../test-output');
  const testInputFile = path.join(testOutputDir, 'test-section-links.md');

  before(() => {
    // Clean up test output directory if it exists
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true });
    }
    fs.mkdirSync(testOutputDir);

    // Create a test markdown file with section links
    const testMarkdown = `# Test Document

## Section One
Some text here.

## Section Two
See [Section One](#Section One) for more details.

## Section Three
See [Section Two](#Section Two) and [Section One](#Section One).
`;
    fs.writeFileSync(testInputFile, testMarkdown);
    
    // Generate HTML files
    splitMarkdownToHtml(testInputFile, testOutputDir, 'Test Documentation');
  });

  it('should convert section links to html file links', () => {
    // Check section-two.html which contains links to section-one
    const sectionTwoPath = path.join(testOutputDir, 'section-two.html');
    assert.ok(fs.existsSync(sectionTwoPath), 'section-two.html should exist');

    const sectionTwoDom = new JSDOM(fs.readFileSync(sectionTwoPath, 'utf-8'));
    const sectionTwoLinks = sectionTwoDom.window.document.querySelectorAll('a');
    
    // Find the link to Section One (excluding navigation links)
    const sectionOneLink = Array.from(sectionTwoLinks).find(link => 
      link.textContent === 'Section One' && !link.classList.contains('nav-link')
    );
    assert.ok(sectionOneLink, 'Should have a link to Section One');
    assert.strictEqual(sectionOneLink.getAttribute('href'), 'section-one.html');

    // Check section-three.html which contains multiple section links
    const sectionThreePath = path.join(testOutputDir, 'section-three.html');
    assert.ok(fs.existsSync(sectionThreePath), 'section-three.html should exist');

    const sectionThreeDom = new JSDOM(fs.readFileSync(sectionThreePath, 'utf-8'));
    const sectionThreeLinks = sectionThreeDom.window.document.querySelectorAll('a');
    
    // Find links to other sections (excluding navigation links)
    const contentLinks = Array.from(sectionThreeLinks).filter(link => 
      !link.classList.contains('nav-link')
    );
    
    const sectionLinks = contentLinks.filter(link => 
      link.textContent === 'Section One' || link.textContent === 'Section Two'
    );
    
    assert.strictEqual(sectionLinks.length, 2, 'Should have links to both sections');
    sectionLinks.forEach(link => {
      assert.ok(
        link.getAttribute('href').endsWith('.html'),
        `Link href should end with .html: ${link.getAttribute('href')}`
      );
    });
  });

  after(() => {
    // Clean up test files
    if (fs.existsSync(testInputFile)) {
      fs.unlinkSync(testInputFile);
    }
  });
});
