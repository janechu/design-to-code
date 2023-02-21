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
        sidebar,
        baseUrl: ghPagesBaseUrl,
        githubUrl,
        frontpageContent: "Design to code",
        versions,
    });

    staticDocs.generate();
});
