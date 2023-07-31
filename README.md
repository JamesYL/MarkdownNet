# MarkdownNet

Used to convert a complex directory of markdown files into a single JSON representation.

Example Usage:

```ts
import { getMarkdownNet, Settings, getDefaultSettings } from 'markdown_net';

const settings: Settings = {
  // By default, index.md files will get mapped to their parent directory instead
  ...getDefaultSettings(), 
  // This setting specifies the file structure of the directory
  directoryStructure: {
    "test.md": {}, 
    "test2.md": {},
  },
};  

const results = getMarkdownNet(
  // This directory contains a bunch of markdown files
  "path/to/directory", 
  // This describes the validation for the front matter
  z.object({ test: z.string().length(1) }),
  settings,
);
```

## Development

Clone this repo. Developed on MacOS, not tested on Windows or WSL.

Run `npm install && npm run prepare`

### Tests

Read docs for how mocha works, and check out how `npm test` works in `package.json`.

For running a particular suite:

- `npm test -- -g "test suite describe name here"`
