module.exports = {
    disallowedChangeTypes: ["major"],
    bumpDeps: true,
    groups: [
        {
            name: "dtc",
            include: ["packages/design-to-code", "packages/design-to-code-react"],
        },
    ],
};
