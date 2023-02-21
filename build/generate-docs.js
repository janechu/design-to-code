const path = require("path");
const sidebar = require("../docs-files/sidebar.js");
const versions = require("../docs-files/versions.json");

const ghPagesBaseUrl = "https://janechu.github.io/design-to-code";
const githubUrl = "https://github.com/janechu/design-to-code";
const root = path.resolve(__dirname, "../");

import("static-docs").then(({ StaticDocs }) => {
    const staticDocs = new StaticDocs({
        root,
        docs: path.resolve(root, "docs-files"),
        target: path.resolve(root, "docs"),
        projectTitle: "Design to code",
        sidebar,
        baseUrl: ghPagesBaseUrl,
        githubUrl,
        frontpageContent:
            "<h1>Design to code</h1><p>Welcome to the design to code project, the intent of the project is to provide tooling to create web experiences that allow a user to manipulate HTML, JavaScript/TypeScript, and CSS in an WYSIWYG editor.</p><p>To get started click on the docs link in the top navigation.</p>",
        versions,
    });

    staticDocs.generate();
});
