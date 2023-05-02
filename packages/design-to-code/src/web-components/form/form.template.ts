import { html, ViewTemplate } from "@microsoft/fast-element";
import { Form } from "./form.js";
import * as DTCFrameBare from "./frames/bare/frame.bare.define.js";
import * as DTCControlSection from "./controls/section/control.section.define.js";

// tree-shaking
DTCFrameBare;
DTCControlSection;

/**
 * The template for the form component.
 * @public
 */
export const formTemplate: ViewTemplate<Form> = html`
    <div class="dtc-form">
        ${x => {
            return x.navigationDictionary
                ? html`
                      <form>
                          <dtc-frame-bare>
                              <dtc-section
                                  array-control="${x.arrayControl}"
                                  button-control="${x.buttonControl}"
                                  checkbox-control="${x.checkboxControl}"
                                  display-control="${x.displayControl}"
                                  number-field-control="${x.numberFieldControl}"
                                  section-link-control="${x.sectionLinkControl}"
                                  select-control="${x.selectControl}"
                                  textarea-control="${x.textareaControl}"
                                  ?root="${true}"
                                  disabled="${x => x.disabled}"
                                  :dataDictionary="${x => x.dataDictionary}"
                                  :schemaDictionary="${x => x.schemaDictionary}"
                                  :data="${x => x.navigationItem?.data}"
                                  :schema="${x => x.navigationItem?.schema}"
                                  data-location="${x =>
                                      x.navigationDictionary[0][x.activeDictionaryId][0][
                                          x.navigationItem.self
                                      ].relativeDataLocation}"
                                  :navigation="${x => x.navigation}"
                                  :navigationItem="${x => x.navigationItem}"
                              ></dtc-section>
                          </dtc-frame-bare>
                      </form>
                  `
                : "";
        }}
    </div>
`;
