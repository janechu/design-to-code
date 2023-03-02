const path = require("path");
const copyfiles = require("copyfiles");
const sidebar = require("../docs-files/sidebar.js");
const versions = require("../docs-files/versions.json");
const toolbarConfig = require("./toolbar-config.js");
const root = path.resolve(__dirname, "../");

import("static-docs").then(({ StaticDocs }) => {
    const target = path.resolve(root, "docs");
    const staticDocs = new StaticDocs({
        root,
        docs: path.resolve(root, "docs-files"),
        target,
        sidebar,
        frontpageContent:
            "<h1>Design to code</h1><p>Welcome to the design to code project, the intent of the project is to provide tooling to create web experiences that allow a user to manipulate HTML, JavaScript/TypeScript, and CSS in an WYSIWYG editor.</p><p>To get started click on the docs link in the top navigation.</p>",
        versions,
        ...toolbarConfig,
    });

    staticDocs.generate();

    // Copy the editor, this assumes execution of the script from the root
    copyfiles(
        [
            "app/www/**/*.js",
            "app/www/**/*.html",
            "app/www/**/*.css",
            path.resolve(root, "docs", "editor"),
        ],
        {
            error: true,
            up: 2,
        },
        e => {
            if (e) {
                console.error("Editor files not copied successfully", e);
            } else {
                console.info("Editor copied successfully");
            }
        }
    );
});
