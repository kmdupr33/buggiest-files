# Buggiest Files

Find the files in your github repo that have caused the most bugs.

## Usage

```bash
npx buggiest-files get

gets the buggiest files in a repo

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --token     your github personal access token (required for private repos or
              if you run into rate limits)                              [string]
  --owner     the owner of the repo                          [string] [required]
  --repo      the name of the repo                           [string] [required]
  --bugLabel  the label used to tag issues as bugs     [string] [default: "bug"]

```

## Example

Here's an example of the code running on the react repo:

```bash
npx buggiest-files get --owner facebook --repo react --token 04460bce703eba0176c8fef21d36b4d64dbdd11a --bugLabel "Type: Bug"

[
  {
    "file": "packages/react-reconciler/src/ReactFiberCommitWork.js",
    "total": 3,
    "bugs": [
      "https://github.com/facebook/react/issues/14811",
      "https://github.com/facebook/react/issues/13512",
      "https://github.com/facebook/react/issues/13188"
    ]
  },
  {
    "file": "packages/eslint-plugin-react-hooks/__tests__/ESLintRuleExhaustiveDeps-test.js",
    "total": 2,
    "bugs": [
      "https://github.com/facebook/react/issues/18985",
      "https://github.com/facebook/react/issues/18902"
    ]
  },
  {
    "file": "packages/eslint-plugin-react-hooks/src/ExhaustiveDeps.js",
    "total": 2,
    "bugs": [
      "https://github.com/facebook/react/issues/18985",
      "https://github.com/facebook/react/issues/18902"
    ]
  },
  ...
]
```

## How it works

The script associates a file with a bug if there's a commit that references a github issue labelled with the label specified by the `bugLabel` option.
