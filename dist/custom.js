import {
  capitalize,
  formatSlug
} from "./chunk-6F67KADK.js";
import {
  arrayField,
  checkboxField,
  dateField,
  groupField,
  pointField,
  radioField,
  relationshipField,
  rowField,
  selectField,
  textField
} from "./chunk-L66BIA32.js";
import {
  createField,
  deepMerge
} from "./chunk-US6Y2BBA.js";

// src/custom/addressField.ts
var addressField = createField((props) => {
  const fieldCondition = (fieldName) => {
    if (!props.hideFields?.length) return true;
    return props.hideFields.includes(fieldName) ? false : true;
  };
  return groupField({
    name: props.name ?? "address",
    label: props?.label,
    interfaceName: "Address",
    localized: false,
    admin: {
      condition: props?.condition,
      hideGutter: props?.hideGutter,
      description: props?.description
    },
    fields: [
      rowField({
        fields: [
          textField({
            name: "addressLine1",
            label: "Address",
            localized: false,
            required: false
          }),
          textField({
            name: "addressLine2",
            label: "Address extra",
            localized: false,
            required: false,
            admin: {
              condition: (_, siblingData) => fieldCondition("addressLine2")
            }
          })
        ]
      }),
      rowField({
        fields: [
          textField({
            name: "state",
            label: "State",
            localized: false,
            required: false,
            admin: {
              condition: (_, siblingData) => fieldCondition("state")
            }
          }),
          textField({
            name: "city",
            label: "City",
            localized: false,
            required: false,
            admin: {
              condition: (_, siblingData) => fieldCondition("city")
            }
          }),
          textField({
            name: "postalCode",
            label: "Postal Code",
            localized: false,
            required: false,
            admin: {
              condition: (_, siblingData) => fieldCondition("postalCode")
            }
          })
        ]
      }),
      pointField({
        name: "location",
        localized: false,
        required: false,
        admin: {
          condition: (_, siblingData) => fieldCondition("location")
        }
      })
    ]
  });
});

// src/custom/linkField.ts
var linkAppearanceOptions = {
  default: {
    label: "Default",
    value: "default"
  },
  button: {
    label: "Button",
    value: "button"
  },
  cta: {
    label: "CTA",
    value: "cta"
  },
  link: {
    label: "Link",
    value: "link"
  },
  custom: {
    label: "Custom",
    value: "custom"
  }
};
var linkOptions = {
  reference: {
    label: "Internal link",
    value: "reference"
  },
  custom: {
    label: "Custom URL",
    value: "custom"
  }
};
var linkField = createField((props) => {
  const options = rowField({
    fields: [
      radioField({
        name: "type",
        admin: {
          layout: "horizontal",
          width: "50%"
        },
        required: true,
        defaultValue: linkOptions.reference.value,
        options: Object.values(linkOptions)
      }),
      checkboxField({
        name: "newTab",
        admin: {
          style: {
            alignSelf: "flex-end"
          },
          width: "50%"
        },
        label: "Open in new tab"
      })
    ]
  });
  const appearance = selectField({
    name: "appearance",
    label: "Appearance",
    required: true,
    defaultValue: "default",
    options: Object.values(linkAppearanceOptions)
  });
  const types = [
    internalLinkField({
      relationTo: props.relationTo,
      condition: (_, siblingData) => siblingData?.type === "reference"
    }),
    externalLinkField({
      condition: (_, siblingData) => siblingData?.type === "custom"
    })
  ];
  const label = textField({
    name: "label",
    label: "Link Text",
    required: true
  });
  const field = groupField({
    name: props.name || "link",
    label: props.label || "Link",
    admin: {
      hideGutter: true,
      condition: props.condition
    },
    fields: [options, ...types, label, appearance]
  });
  return deepMerge(field, props.overrides);
});
var externalLinkField = createField((props) => {
  const field = textField({
    name: "url",
    admin: {
      condition: props.condition,
      hidden: props.hidden
    },
    label: props.label || "Custom URL",
    required: props.required || true
  });
  return field;
});
var internalLinkField = createField((props) => {
  const field = relationshipField({
    name: "reference",
    admin: {
      condition: props.condition
    },
    label: props.label || "Document to link to",
    maxDepth: 1,
    relationTo: props.relationTo,
    required: props.required || true
  });
  return field;
});

// src/custom/slugField/index.ts
var formatSlugHook = (fallback) => ({ data, operation, originalDoc, value }) => {
  if (typeof value === "string") {
    return formatSlug(value);
  }
  if (operation === "create" || !data?.slug) {
    const fallbackData = data?.[fallback] || data?.[fallback];
    if (fallbackData && typeof fallbackData === "string") {
      return formatSlug(fallbackData);
    }
  }
  return value;
};
var slugField = (fieldToUse = "title", overrides = {}) => {
  const { slugOverrides, checkboxOverrides } = overrides;
  const checkBoxField = {
    name: "slugLock",
    type: "checkbox",
    defaultValue: true,
    admin: {
      hidden: true,
      position: "sidebar"
    },
    ...checkboxOverrides
  };
  const field = textField({
    name: "slug",
    label: "Slug",
    index: true,
    ...slugOverrides || {},
    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse)]
    },
    admin: {
      position: "sidebar",
      ...slugOverrides?.admin || {},
      components: {
        Field: {
          path: "@konstant/payload/components#SlugComponent",
          //
          clientProps: {
            fieldToUse,
            checkboxFieldPath: checkBoxField.name
          }
        }
      }
    }
  });
  return [field, checkBoxField];
};

// src/custom/timeField.ts
var timeField = createField((props) => {
  return dateField({
    name: props.name ?? "time",
    label: props.label ?? "Time",
    required: props?.required,
    localized: false,
    // defaultValue: name === "open" ? "09:00" : "16:00",
    admin: {
      condition: props?.condition,
      description: props?.description,
      date: {
        pickerAppearance: "timeOnly",
        timeFormat: "HH:mm",
        displayFormat: "HH:mm"
      }
    }
  });
});

// src/custom/urlField.ts
var urlField = createField((props) => {
  const required = props?.required ?? true;
  return textField({
    name: props?.name ?? "url",
    label: props?.label ?? "Url",
    hasMany: false,
    required,
    admin: {
      condition: props?.condition
    },
    validate: (val) => {
      if (!required && !val) return true;
      try {
        new URL(val);
        return true;
      } catch (err) {
        return "Invalid URL";
      }
    }
  });
});

// src/custom/openingHoursField.ts
var weekdaysMap = {
  1: "Mondays",
  2: "Tuesdays",
  3: "Wednesdays",
  4: "Thursdays",
  5: "Fridays",
  6: "Saturdays",
  7: "Sundays"
};
var dayOptions = Object.keys(weekdaysMap).map((key) => ({
  label: weekdaysMap[key] || "",
  value: key
}));
var openingHoursField = createField((props) => {
  const items = arrayField({
    name: "items",
    label: "Opening Hours",
    fields: [
      selectField({
        name: "days",
        hasMany: true,
        required: true,
        localized: false,
        defaultValue: [],
        options: dayOptions
      }),
      textField({ name: "label", required: true }),
      ...timeFields()
    ]
  });
  const customOpeningHours = arrayField({
    name: "custom",
    label: "Custom Opening Hours",
    fields: [
      textField({ name: "label", required: true }),
      dateField({
        name: "date",
        label: "Date",
        required: true,
        admin: {
          date: {
            pickerAppearance: "dayOnly",
            displayFormat: "d MMM yyy"
          }
        }
      }),
      ...timeFields()
    ]
  });
  return groupField({
    name: "openingHours",
    interfaceName: "OpeningHours",
    fields: [
      rowField({
        fields: [
          textField({
            name: "openLabel",
            admin: { width: "50%" }
          }),
          textField({
            name: "closedLabel",
            admin: { width: "50%" }
          })
        ]
      }),
      rowField({
        fields: [
          textField({
            name: "openNowLabel",
            admin: { width: "50%" }
          }),
          textField({
            name: "closedNowLabel",
            admin: { width: "50%" }
          })
        ]
      }),
      items,
      customOpeningHours
    ]
  });
});
var timeFields = () => {
  return [
    rowField({
      admin: {
        condition: (_, siblingData) => !siblingData.isClosed
      },
      fields: ["openingTime", "closingTime"].map(
        (name) => timeField({ name, label: capitalize(name) })
      )
    }),
    checkboxField({ name: "isClosed", label: "Closed whole day" }),
    textField({
      name: "closedLabel",
      admin: { condition: (_, siblingData) => siblingData.isClosed }
    })
  ];
};

// src/custom/socialMediaField.ts
var socialsOptions = {
  facebook: {
    label: "Facebook",
    value: "facebook"
  },
  instagram: {
    label: "Instagram",
    value: "instagram"
  },
  twitter: {
    label: "Twitter",
    value: "twitter"
  },
  linkedin: {
    label: "LinkedIn",
    value: "linkedin"
  },
  strava: {
    label: "Strava",
    value: "strava"
  }
};
var fields = (showOnly = []) => Object.keys(socialsOptions).map((key) => {
  const socialKey = key;
  const show = showOnly.length === 0 || showOnly.includes(socialKey);
  return urlField({
    name: socialKey,
    label: socialsOptions[socialKey].label,
    required: false,
    condition: (_, siblingData) => show,
    overrides: {
      admin: {
        width: "50%"
      }
    }
  });
});
var socialsField = createField((props) => {
  return groupField({
    name: props.name || "socialMedia",
    label: props.label || "Social Media",
    fields: [
      rowField({
        fields: fields(props.showOnly)
      })
    ]
  });
});
export {
  addressField,
  externalLinkField,
  formatSlugHook,
  internalLinkField,
  linkField,
  openingHoursField,
  slugField,
  socialsField,
  timeField,
  urlField,
  weekdaysMap
};
//# sourceMappingURL=custom.js.map