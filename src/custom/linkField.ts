import { Field } from "payload";

import {
  checkboxField,
  groupField,
  radioField,
  relationshipField,
  rowField,
  selectField,
  textField,
} from "@/fields";
import { createField, deepMerge } from "@/utils";



type LinkTypes = "reference" | "custom";

const linkOptions: Record<LinkTypes, { label: string; value: string }> = {
  reference: {
    label: "Internal link",
    value: "reference",
  },
  custom: {
    label: "Custom URL",
    value: "custom",
  },
};



export const linkField= createField<{
  relationTo: string | string[];
  appearance?: "default" | "button" | "cta" | "link" | "custom";
}>((props) => {
  const options = rowField({
    fields: [
      radioField({
        name: "type",
        admin: {
          layout: "horizontal",
          width: "50%",
        },
        defaultValue: linkOptions.reference.value,
        options: Object.values(linkOptions),
      }),
      checkboxField({
        name: "newTab",

        admin: {
          style: {
            alignSelf: "flex-end",
          },
          width: "50%",
        },
        label: "Open in new tab",
      }),
    ],
  });

  const appearance = selectField({
    name: "appearance",
    label: "Appearance",
    defaultValue: "default",
    options: [
      {
        label: "Default",
        value: "default",
      },
      {
        label: "Button",
        value: "button",
      },
      {
        label: "CTA",
        value: "cta",
      },
      {
        label: "Link",
        value: "link",
      },
    ],
  });

  const types: Field[] = [
    internalLinkField({
      relationTo: props.relationTo,
      condition: (_, siblingData) => siblingData?.type === "reference",
    }),
    externalLinkField({
      condition: (_, siblingData) => siblingData?.type === "custom",
    }),
  ];

  const label = textField({
    name: "label",
    label: "Link Text",
    required: true,
  });

  const field = groupField({
    name: "link",
    admin: {
      hideGutter: true,
    },
    fields: [options, ...types, label, appearance],
  });

  return deepMerge(field, props.overrides);
});

export const externalLinkField = createField((props) => {
  const field = textField({
    name: "url",
    admin: {
      condition: props.condition,
      hidden: props.hidden,
    },
    label: props.label || "Custom URL",
    required: props.required || true,
  });

  return field;
});

export const internalLinkField = createField<{
  relationTo: string | string[];
}>((props) => {
  const field = relationshipField({
    name: "reference",
    admin: {
      condition: props.condition,
    },
    label: props.label || "Document to link to",
    maxDepth: 1,
    relationTo: props.relationTo,
    required: props.required || true,
  });

  return field;
});
