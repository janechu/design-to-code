import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    MessageSystem,
    getDataFromSchema,
    MessageSystemType,
    SchemaDictionary,
} from "design-to-code";
import * as testConfigs from "./form/index";
import { Form } from "../../src";

const messageSystem = new MessageSystem({
    webWorker: "message-system.js",
});

function getExampleData(schema: string | null) {
    if (schema) {
        return getDataFromSchema(testConfigs[schema].schema, testConfigs[schema].schema);
    }

    return {};
}

function generateSchemaDictionary(): SchemaDictionary {
    const schemaDictionary: SchemaDictionary = {};

    Object.keys(testConfigs).forEach((testConfigKey: string) => {
        schemaDictionary[testConfigs[testConfigKey].schema.$id] =
            testConfigs[testConfigKey].schema;
    });

    return schemaDictionary;
}

function initializeMessageSystem(schema: string | null, exampleData: any) {
    if (schema) {
        messageSystem.postMessage({
            type: MessageSystemType.initialize,
            data: [
                {
                    foo: {
                        schemaId: testConfigs[schema].schema.$id,
                        data: exampleData,
                    },
                },
                "foo",
            ],
            schemaDictionary: generateSchemaDictionary(),
        });
    }
}

export function FormTestPage() {
    const [data, setData] = useState({});
    const [ready, setReady] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleMessageSystem = e => {
        switch (e.data?.type) {
            case "data":
            case "initialize":
                setData(e.data.data);
        }
    };

    useEffect(() => {
        // run on first load
        const messageSystemConfig = {
            onMessage: handleMessageSystem,
        };
        messageSystem.add(messageSystemConfig);
        setReady(true);

        return () => {
            messageSystem.remove(messageSystemConfig);
        };
    }, []);

    useEffect(() => {
        // run when ready (second load)
        initializeMessageSystem(
            searchParams.get("schema"),
            getExampleData(searchParams.get("schema"))
        );
    }, [ready]);

    function handleSchemaUpdate(e) {
        initializeMessageSystem(e.target.value, getExampleData(e.target.value));
        setSearchParams({ schema: e.target.value });
    }

    return ready ? (
        <div>
            <select
                onChange={handleSchemaUpdate}
                defaultValue={searchParams?.get("schema") || void 0}
            >
                {Object.keys(testConfigs).map((testConfigKey: string, index: number) => {
                    return (
                        <option key={index} value={testConfigKey}>
                            {testConfigKey}
                        </option>
                    );
                })}
            </select>
            <Form messageSystem={messageSystem} />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    ) : null;
}
