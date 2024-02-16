# App

This app folder is a manual testing area for utilities that are best tested in browser such as with Monaco Editor.

## Adding a New Example

- Add a folder to `examples/`
- Add an entry `index.ts` to the new example folder
- Add an HTML file `index.html` to the new example folder
    - Ensure that the head tags are filtered so that only the folder name is used
- Add the name of the new example folder to the `examples.cjs` export array