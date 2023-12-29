/**
 * DO NOT EDIT - generated from /build/guidance.js
 */
import { html } from "@microsoft/fast-element";
import { FormGuidance } from "./form-guidance.js";

export const formGuidanceTemplate = html<FormGuidance>`
    <dtc-guidance>
        <dtc-guidance-document title="Validation">
            <!-- title: Validation -->

            <h1 id="validation">Validation</h1>
            <p>
                The form itself does not assess JSON schema against data, a separate
                service can be used leveraging
                <a href="https://ajv.js.org/">AJV</a>
                . What the form will do is when recieving messages with type
                <code>&quot;validation&quot;</code>
                it will apply any errors to form elements based on the error list produced
                by AJV. These are then reported once the form element has been been
                focused and subsequantly defocused.
            </p>
            <p>
                An additional AJV validator messages web component may be used in
                conjunction with both the AJV service and the form, allowing the complete
                error list to be always visible outside of the form.
            </p>
        </dtc-guidance-document>
        <dtc-guidance-document title="Using Multiple Schemas">
            <!-- title: Using Multiple Schemas -->

            <h1 id="using-multiple-schemas">Using Multiple Schemas</h1>
            <p>
                JSON schema has some combination keywords that can be used in the form. A
                select will appear if the
                <code>oneOf</code>
                or
                <code>anyOf</code>
                keyword is been used. This will allow a user to choose between diffent
                types.
            </p>
            <p>Example JSON schema:</p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;https://json-schema.org/draft/2019-09/schema&quot;,
    &quot;$id&quot;: &quot;https://example.com/one-of.json&quot;,
    &quot;title&quot;: &quot;oneOf&quot;,
    &quot;oneOf&quot;: [
        {
            &quot;title&quot;: &quot;A string&quot;,
            &quot;type&quot;: &quot;string&quot;
        },
        {
            &quot;title&quot;: &quot;A number&quot;,
            &quot;type&quot;: &quot;number&quot;
        }
    ]
}
</code></pre>
        </dtc-guidance-document>
        <dtc-guidance-document title="Restrictive Schemas">
            <!-- title: Restrictive Schemas -->

            <h1 id="restrictive-schemas">Restrictive Schemas</h1>
            <p>
                It is always recommended to create as restrictive schemas as possible.
                This way the form has as much data as possible when deciding what kind of
                form elements to display. The
                <code>&quot;type&quot;</code>
                should always be set. If unaccounted for properties exist this will cause
                issues as the form will not render them and may not allow the user to
                remove them if they are invalid.
            </p>
        </dtc-guidance-document>
        <dtc-guidance-document title="Referencing Properties for Array Items">
            <!-- title: Referencing Properties for Array Items -->

            <h1 id="referencing-properties-for-array-items">
                Referencing Properties for Array Items
            </h1>
            <p>
                If array items are
                <code>string</code>
                types, they will automatically be used as the display text when displaying
                the list of array items. If the array item is an object or complex type,
                the data path/location may be used to indicate if that property has been
                filled in, it should be used when viewing the array list.
            </p>
            <p>Example JSON schema:</p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;https://json-schema.org/draft/2019-09/schema&quot;,
    &quot;$id&quot;: &quot;https://example.com/my-array.json&quot;,
    &quot;title&quot;: &quot;My Array&quot;,
    &quot;type&quot;: &quot;array&quot;,
    &quot;dtc:form:control:array:display-text&quot;: &quot;a&quot;,
    &quot;items&quot;: {
        &quot;title&quot;: &quot;Array Item&quot;,
        &quot;type&quot;: &quot;object&quot;,
        &quot;properties&quot;: {
            &quot;a&quot;: {
                &quot;title&quot;: &quot;Property A&quot;,
                &quot;type&quot;: &quot;string&quot;
            }
        }
    }
}
</code></pre>
        </dtc-guidance-document>
        <dtc-guidance-document title="References">
            <!-- title: References -->

            <h1 id="references">References</h1>
            <p>
                A JSON schema may use references with the
                <code>$ref</code>
                keyword. This allows parts of the JSON schema to be re-used. This can
                allow for multiple uses of a single definition (it is recommended to use
                the
                <code>$defs</code>
                keyword below but not necessary). It can also be used to create recursive
                patterns for nesting.
            </p>
            <p>Example JSON schema:</p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;http://json-schema.org/schema#&quot;,
    &quot;$id&quot;: &quot;definitions&quot;,
    &quot;title&quot;: &quot;My References&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;a&quot;: { &quot;$ref&quot;: &quot;#/$defs/a&quot; },
    },
    &quot;$defs&quot;: {
        &quot;a&quot;: {
            &quot;title&quot;: &quot;A&quot;,
            &quot;type&quot;: &quot;string&quot;
        }
    }
}
</code></pre>
        </dtc-guidance-document>
        <dtc-guidance-document title="No Additional Properties">
            <!-- title: No Additional Properties -->

            <h1 id="no-additional-properties">No Additional Properties</h1>
            <p>
                If an object is declared that is not a dictionary, it would be advisable
                to use the
                <code>noAdditionalProperties</code>
                property set to
                <code>true</code>
                . If additional properties are on the object but the object does not have
                <code>additionalProperties</code>
                set and the properties are arbitrary values, the form will not show the
                properties and allow them to be removed.
            </p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;https://json-schema.org/draft/2019-09/schema&quot;,
    &quot;$id&quot;: &quot;https://example.com/my-object.json&quot;,
    &quot;title&quot;: &quot;My Object&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;a&quot;: {
            &quot;title&quot;: &quot;Property A&quot;,
            &quot;type&quot;: &quot;string&quot;
        }
    },
    &quot;noAdditionalProperties&quot;: true
}
</code></pre>
        </dtc-guidance-document>
        <dtc-guidance-document title="Labels">
            <!-- title: Labels -->

            <h1 id="labels">Labels</h1>
            <p>
                Each form element generated from a
                <code>&quot;type&quot;</code>
                such as
                <code>&quot;type&quot;: &quot;string&quot;</code>
                is accompanied by a label, such that the HTML generated is readable. In
                order to achieve this, where a
                <code>&quot;type&quot;</code>
                is declared, there should always be a
                <code>&quot;title&quot;</code>
                .
            </p>
            <p>Example JSON schema:</p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;https://json-schema.org/draft/2019-09/schema&quot;,
    &quot;$id&quot;: &quot;https://example.com/my-object.json&quot;,
    &quot;title&quot;: &quot;My Object&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;a&quot;: {
            &quot;title&quot;: &quot;Property A&quot;,
            &quot;type&quot;: &quot;string&quot;
        },
        &quot;b&quot;: {
            &quot;title&quot;: &quot;Property B&quot;,
            &quot;type&quot;: &quot;string&quot;
        }
    }
}
</code></pre>
        </dtc-guidance-document>
        <dtc-guidance-document title="Getting Started">
            <!-- title: Getting Started -->

            <h1 id="getting-started">Getting Started</h1>
            <h2 id="basic-concepts">Basic concepts</h2>
            <p>
                The purpose of the form is to generate HTML form elements based on the
                JSON schema provided. Simple types such as
                <code>string</code>
                ,
                <code>number</code>
                ,
                <code>boolean</code>
                ,
                <code>null</code>
                , and so on are converted to a form element that allows a user to input
                based on that type, for example
                <code>string</code>
                will create a
                <code>textarea</code>
                or
                <code>input</code>
                with type
                <code>text</code>
                . More complex types such as
                <code>object</code>
                and
                <code>array</code>
                will have custom controls which may navigate the user through whatever
                nested data may exist, or allow they to create that nested data.
            </p>
            <h2 id="example-json-schemas">Example JSON schemas</h2>
            <h3 id="object">Object</h3>
            <p>Example JSON schema:</p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;https://json-schema.org/draft/2019-09/schema&quot;,
    &quot;$id&quot;: &quot;https://example.com/my-object.json&quot;,
    &quot;title&quot;: &quot;My Object&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;properties&quot;: {
        &quot;a&quot;: {
            &quot;title&quot;: &quot;Property A&quot;,
            &quot;type&quot;: &quot;string&quot;
        }
    }
}
</code></pre>
            <h3 id="array">Array</h3>
            <p>Example JSON schema:</p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;https://json-schema.org/draft/2019-09/schema&quot;,
    &quot;$id&quot;: &quot;https://example.com/my-array.json&quot;,
    &quot;title&quot;: &quot;My Array&quot;,
    &quot;type&quot;: &quot;array&quot;,
    &quot;items&quot;: {
        &quot;title&quot;: &quot;Array Item&quot;,
        &quot;type&quot;: &quot;string&quot;
    }
}
</code></pre>
            <h2 id="supported-json-schema-drafts--vocabulary">
                Supported JSON schema drafts &amp; vocabulary
            </h2>
            <p>
                The current support of JSON schema vocabulary is constantly being updated,
                to see what the current version of the packages support check the
                <a
                    href="https://janechu.github.io/design-to-code/docs/json-schema/support/"
                >
                    support
                </a>
                page for details.
            </p>
            <p>
                To request support for any current unsupported vocabulary
                <a href="https://github.com/janechu/design-to-code/issues/new/choose">
                    file an issue
                </a>
                , be sure to include a proposed solution and JSON schema example.
            </p>
        </dtc-guidance-document>
        <dtc-guidance-document title="Format">
            <!-- title: Format -->

            <h1 id="format">Format</h1>
            <p>
                The
                <code>format</code>
                keyword is supported where they have a direct correlation to standard HTML
                <code>input</code>
                attribute
                <code>type</code>
                .
            </p>
            <p>The following are supported:</p>
            <ul>
                <li><code>date</code></li>
                <li><code>time</code></li>
                <li><code>date-time</code></li>
                <li><code>email</code></li>
            </ul>
            <p>Example JSON schema:</p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;http://json-schema.org/schema#&quot;,
    &quot;$id&quot;: &quot;https://example.com/my-date.json&quot;,
    &quot;title&quot;: &quot;Date&quot;,
    &quot;type&quot;: &quot;string&quot;,
    &quot;format&quot;: &quot;date&quot;
}
</code></pre>
        </dtc-guidance-document>
        <dtc-guidance-document title="Dictionaries">
            <!-- title: Dictionaries -->

            <h1 id="dictionaries">Dictionaries</h1>
            <p>
                Dictionaries, or objects which may have any property key but have property
                values defined, are accounted for when the form is generating controls.
                This will allow data to be created that can have any number of properties,
                but still conform to form elements as they are defined in the JSON schema.
            </p>
            <p>Example JSON schema:</p>
            <pre><code class="language-json">{
    &quot;$schema&quot;: &quot;https://json-schema.org/draft/2019-09/schema&quot;,
    &quot;$id&quot;: &quot;https://example.com/my-dictionary.json&quot;,
    &quot;title&quot;: &quot;My Object&quot;,
    &quot;type&quot;: &quot;object&quot;,
    &quot;additionalProperties&quot;: {
        &quot;title&quot;: &quot;String item&quot;,
        &quot;type&quot;: &quot;string&quot;,
    },
}
</code></pre>
        </dtc-guidance-document>
    </dtc-guidance>
`;
