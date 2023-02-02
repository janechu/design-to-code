# Publishing

This project uses [Beachball](https://microsoft.github.io/beachball/) to publish packages to NPM. The process involves a series of script commands located in the root `package.json` file to check, change, and publish NPM packages.

The pipeline process looks for change files on an automated schedule or manual execution and publishes to the NPM Registry.

## How it works

Beachball is configured for patches and minor changes in a single file (`./beachball.config.js`). _Major changes are ignored, except when manually planning a Major release._

Running `npm run change` triggers an interactive process on the command line to capture the type and description of the change. These details are used to generate a file in the `./change/*` folder. Change file names are formatted as `{package-name}-{guid}.json` with the following example.

File location and name: `change/design-to-code-4685ad54-b24a-4d2b-b160-519d410f468d.json`
```json
{
  "type": "minor",
  "comment": "Add fancy new feature for components.",
  "packageName": "design-to-code",
  "email": "name@example.com",
  "dependentChangeType": "minor",
  "date": "2021-03-01T19:10:06.323Z"
}
```
:::note
More information on the change process and change types can be found on the [Beachball website](https://microsoft.github.io/beachball/cli/change.html#change).
:::

These changes are then committed and submitted as a pull request for code review. Once approved and merged into `main`.

# Steps

Follow these steps to publish the packages:
```bash
npm ci
```

```bash
npm run check
```

```bash
npm run build --if-present
```

```bash
npm run test --if-present
```

```bash
npm run publish-ci
```

```bash
git push
```

Once fired, the `./change/*` files are used as instructions for Beachball's [Semantic versioning](https://semver.org/) and changelog generation. The process then runs `npm run publish-ci` to publish new package versions to the NPM registry. You may need to authenticate your username on NPM to publish.

## Testing

When Beachball configurations are changed it's a great idea to validate the entire Beachball publishing process.

1. Check that changes are acknowledged
```bash
npm run check
```

2. Check for changes and that a change file is generated
```bash
npm run change
```

3. Check that each package is versioned and changelogs are created (Changelogs are named `CHANGELOG.json` and `CHANGELOG.md`). This command simulates publishing, without updating the NPM registry. This is a verification step only, the bumped changes should not be staged or committed. Simply revert after the changes are successful.
```bash
npm run bump
```
