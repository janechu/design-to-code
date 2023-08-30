import React, { useEffect, useState } from "react";
import { MessageSystem, getDataFromSchema, SchemaDictionary } from "design-to-code";
import * as testConfigs from "./form/";
import { Form } from "../../src";

const exampleData: any = getDataFromSchema(
    testConfigs.recursiveDefinitions.schema,
    testConfigs.recursiveDefinitions.schema
);

function generateSchemaDictionary(): SchemaDictionary {
    const schemaDictionary: SchemaDictionary = {};

    Object.keys(testConfigs).forEach((testConfigKey: string) => {
        schemaDictionary[testConfigs[testConfigKey].schema.$id] =
            testConfigs[testConfigKey].schema;
    });

    return schemaDictionary;
}

const messageSystem = new MessageSystem({
    webWorker: "message-system.js",
    dataDictionary: [
        {
            foo: {
                schemaId: testConfigs.recursiveDefinitions.schema.$id,
                data: exampleData,
            },
        },
        "foo",
    ],
    schemaDictionary: generateSchemaDictionary(),
});

export function FunctionFormTestPage() {
    const [data, setData] = useState(exampleData);
    const [navigationConfigId, setNavigationConfigId] = useState("");

    const handleMessageSystem = e => {
        switch (e.data?.type) {
            case "data":
                setData(e.data.data);
            default:
                setNavigationConfigId(e.data.activeNavigationConfigId);
        }
    };

    useEffect(() => {
        const messageSystemConfig = {
            onMessage: handleMessageSystem,
        };
        messageSystem.add(messageSystemConfig);

        return () => {
            messageSystem.remove(messageSystemConfig);
        };
    }, []);

    return (
        <div>
            <span>{navigationConfigId}</span>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <Form messageSystem={messageSystem} />
        </div>
    );
}
