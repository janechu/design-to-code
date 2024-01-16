import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    AjvValidator,
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
new AjvValidator({
    messageSystem,
    ajvOptions: {
        strict: false,
        useDefaults: true,
    },
});

function getExampleData(schema: string | null) {
    if (schema) {
        const keys = Object.keys(testConfigs[schema]);

        if (keys.includes("data")) {
            return testConfigs[schema].data;
        }

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
    const [data, setData] = useState();
    const [ready, setReady] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [displayValidationInline, setDisplayValidationInline] = useState(false);
    const [displayValidationErrorList, setDisplayValidationErrorList] = useState(false);
    const [showValidation, setShowValidation] = useState(false);

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

        const displayValidationInline = searchParams.get("displayValidationInline");
        const displayValidationErrorList = searchParams.get("displayValidationErrorList");
        const showValidation = searchParams.get("showValidation");

        if (displayValidationInline) {
            setDisplayValidationInline(!!displayValidationInline);
        }

        if (displayValidationErrorList) {
            setDisplayValidationErrorList(!!displayValidationErrorList);
        }

        if (showValidation) {
            setShowValidation(!!showValidation);
        }
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
            <Form
                messageSystem={messageSystem}
                displayValidationInline={displayValidationInline}
                displayValidationErrorList={displayValidationErrorList}
                showValidation={showValidation}
            />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    ) : null;
}
