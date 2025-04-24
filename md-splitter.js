const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Configure marked for code blocks
marked.setOptions({
  highlight: function(code, lang) {
    return code;
  }
});

// Configure marked renderer for code blocks and section links
const renderer = new marked.Renderer();
renderer.code = function(code, lang) {
  return `<pre class="language-${lang || 'plaintext'}"><code class="language-${lang || 'plaintext'}">${code}</code></pre>`;
};

// Store the original link renderer
const originalLinkRenderer = renderer.link.bind(renderer);

// Override the link renderer to handle section links
renderer.link = function(href, title, text) {
  if (href.startsWith('#')) {
    // This is a section link, convert the header text to an ID
    const headerText = href.slice(1); // Remove the # prefix
    if (this.sectionIds && this.sectionIds[headerText]) {
      // If we have a matching section, update the href to point to the HTML file
      href = this.sectionIds[headerText] + '.html';
    }
  }
  return originalLinkRenderer(href, title, text);
};

marked.use({ renderer });

/**
 * Splits a Markdown file into multiple HTML files based on headers
 * Each HTML file includes a navigation menu with links to other sections
 * @param {string} inputFile - Path to the input Markdown file
 * @param {string} outputDir - Directory to output HTML files
 * @param {string} baseTitle - Base title for HTML documents
 */
function splitMarkdownToHtml(inputFile, outputDir, baseTitle, options = { syntaxHighlight: true }) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read the input Markdown file
  const markdownContent = fs.readFileSync(inputFile, 'utf-8');
  
  // Parse the markdown to get the tokens
  const tokens = marked.lexer(markdownContent);
  
  // Build a map of header text to section IDs
  const sectionIds = {};
  tokens.forEach(token => {
    if (token.type === 'heading') {
      const id = token.text.toLowerCase().replace(/[^\w]+/g, '-');
      sectionIds[token.text] = id;
    }
  });
  
  // Add the section IDs to the renderer for link processing
  renderer.sectionIds = sectionIds;
  
  // Extract sections and build TOC
  const sections = [];
  const toc = [];
  let currentSection = { title: 'Introduction', level: 1, content: [], id: 'introduction' };
  
  tokens.forEach(token => {
    if (token.type === 'heading') {
      // Save the previous section
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      
      // Create a new section
      const id = token.text.toLowerCase().replace(/[^\w]+/g, '-');
      currentSection = {
        title: token.text,
        level: token.depth,
        content: [token],
        id: id
      };
      
      // Add to table of contents
      toc.push({
        title: token.text,
        id: id,
        level: token.depth
      });
    } else {
      // Add token to current section
      currentSection.content.push(token);
    }
  });
  
  // Add the last section if not empty
  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }
  
  // Generate HTML files for each section
  sections.forEach((section, index) => {
    const prevSection = index > 0 ? sections[index - 1] : null;
    const nextSection = index < sections.length - 1 ? sections[index + 1] : null;
    
    const htmlContent = generateHtml(section, toc, prevSection, nextSection, baseTitle, options);
    const outputFile = path.join(outputDir, `${section.id}.html`);
    fs.writeFileSync(outputFile, htmlContent);
  });
  
  console.log(`Successfully split Markdown into ${sections.length} HTML files in ${outputDir}`);
  
  // Create an index.html that redirects to the first section
  if (sections.length > 0) {
    const indexHtml = generateIndexHtml(sections[0].id, baseTitle);
    fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

    // Create a standalone toc.html file
    const tocTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'toc.html'), 'utf-8');
    const currentId = null; // No current page in standalone TOC
    const tocHtml = eval('`' + tocTemplate + '`'); // Using template literal to process the template
    fs.writeFileSync(path.join(outputDir, 'toc.html'), tocHtml);
  }
}

/**
 * Generates HTML content for a section
 * @param {Object} section - Section object with title, content, etc.
 * @param {Array} toc - Table of contents array
 * @param {Object} prevSection - Previous section or null
 * @param {Object} nextSection - Next section or null
 * @param {string} baseTitle - Base title for HTML documents
 * @returns {string} - HTML content
 */
function generateHtml(section, toc, prevSection, nextSection, baseTitle, options) {
  // Parse section content to HTML
  const sectionContent = marked.parser(section.content);
  
  // Generate navigation links
  const prevLink = prevSection ? 
    `<a href="${prevSection.id}.html" class="nav-link">« ${prevSection.title}</a>` : '';
  const nextLink = nextSection ? 
    `<a href="${nextSection.id}.html" class="nav-link">${nextSection.title} »</a>` : '';
  
  // Generate TOC dropdown
  const tocHtml = generateTocDropdown(toc, section.id);
  
  // Load and process the section template
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'section.html'), 'utf-8');
  return eval('`' + template + '`');
}

/**
 * Generates a dropdown menu for the table of contents
 * @param {Array} toc - Table of contents array
 * @param {string} currentId - ID of the current section
 * @returns {string} - HTML content for TOC dropdown
 */
function generateTocDropdown(toc, currentId) {
  // Load and process the TOC template
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'toc.html'), 'utf-8');
  return eval('`' + template + '`');
}

/**
 * Generates index.html that redirects to the first section
 * @param {string} firstSectionId - ID of the first section
 * @param {string} baseTitle - Base title for HTML documents
 * @returns {string} - HTML content for index.html
 */
function generateIndexHtml(firstSectionId, baseTitle) {
  // Load and process the index template
  const template = fs.readFileSync(path.join(__dirname, 'templates', 'index.html'), 'utf-8');
  return eval('`' + template + '`');
}

// Example usage
// splitMarkdownToHtml('input.md', 'output-html', 'My Documentation');

module.exports = { splitMarkdownToHtml };