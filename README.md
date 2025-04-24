# Markdown Splitter

A tool that splits a Markdown file on header tags into a series of rendered HTML files. Each HTML file links to the previous and next file and includes a drop-down table of contents in the top menu bar.

[![npm version](https://badge.fury.io/js/%40beautifullife%2Fmarkdown-splitter.svg)](https://www.npmjs.com/package/@beautifullife/markdown-splitter)

[Usage](#usage)

## Features

- Split Markdown files into multiple HTML files based on heading tags
- Each HTML file includes:
  - Links to previous and next sections
  - A dropdown table of contents with links to all sections
  - Clean, responsive styling
  - Syntax highlighting for code blocks (powered by Prism.js)
  - Copy button for code blocks
- Offline mode support (disable syntax highlighting for fully offline docs)
- Automatic index.html that redirects to the first section

## Installation

### Option 1: Local Installation

1. Clone this repository:
   ```
   git clone https://github.com/nrrb/markdown-splitter.git
   cd markdown-splitter
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Link the command globally:
   ```
   npm link
   ```

### Option 2: Install from npm

```
npm install -g @beautifullife/markdown-splitter
```

## Usage

### Command Line

```
md-split [options] <input-file>
```

Options:
- `-i, --input <file>`: Input Markdown file
- `-o, --output <dir>`: Output directory for HTML files (default: "output-html")
- `-t, --title <title>`: Base title for HTML documents (default: "Documentation")
- `--no-syntax-highlight`: Disable syntax highlighting in code blocks (default: enabled)
  - When enabled (default), code blocks are syntax-highlighted using Prism.js loaded from a CDN
  - Requires internet connection for viewers when enabled
  - Disable this option for fully offline documentation
  - Copy button functionality works in both modes
- `-h, --help`: Show help information

Example:
```
md-split -i documentation.md -o docs-html -t "API Documentation"
```

### Programmatically

```javascript
const { splitMarkdownToHtml } = require('markdown-splitter');

// Split a Markdown file into multiple HTML files
splitMarkdownToHtml('input.md', 'output-dir', 'Document Title');
```

## Example Output

After running the tool, you'll get:

1. An `index.html` file that redirects to the first section
2. Multiple HTML files named after each section ID (derived from heading text)
3. Each HTML file contains:
   - The section content
   - Navigation links to previous/next sections
   - A dropdown table of contents

Open the `index.html` file in your browser to start browsing the documentation.

## Testing Code Blocks

HTML code blocks are properly escaped and displayed as text. For example:

```html
<!-- Navigation menu -->
<nav class="main-nav">
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- Dangerous HTML that will be safely escaped -->
<script>
  alert('This will not execute!');
</script>
<style>
  body { background: red; }
</style>
```

The HTML above will be displayed exactly as written, with all tags visible and properly escaped. No HTML will be interpreted or executed.

Other language examples with syntax highlighting:

```python
# Python example
class DocumentSplitter:
    def __init__(self, input_file):
        self.input_file = input_file
        
    def split_sections(self):
        with open(self.input_file, 'r') as f:
            content = f.read()
        return [section for section in content.split('##')]
```

```javascript
// JavaScript example
class DocumentProcessor {
  constructor(content) {
    this.content = content;
  }

  async processMarkdown() {
    const sections = this.content.split(/^##\s/m);
    return sections.map(section => this.parseSection(section));
  }
}
```

```bash
# Shell script example
#!/bin/bash
for file in *.md; do
  echo "Processing $file..."
  md-split --input "$file" --output "${file%.md}-html"
  echo "Done!"
done
```

```text
Plain text example:
-----------------
This is just plain text
without any special formatting
or syntax highlighting.
-------------------
```

```sql
-- SQL example
SELECT 
  documents.title,
  sections.heading,
  sections.content
FROM documents
JOIN sections ON sections.document_id = documents.id
WHERE documents.type = 'markdown'
ORDER BY sections.position;
```

All code blocks above will be syntax-highlighted using Prism.js (when enabled) and include a copy button for easy copying.

## Requirements

- Node.js 12.x or higher
- npm or yarn

## License

MIT