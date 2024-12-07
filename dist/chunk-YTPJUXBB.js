// src/lib/createConfig.ts
var createCollectionConfig = (slug, config) => {
  return {
    slug,
    access: {
      read: () => true,
      ...config.access
    },
    ...config
  };
};
var createGlobalConfig = (slug, config) => {
  return {
    slug,
    access: {
      read: () => true,
      ...config.access
    },
    ...config
  };
};
var createBlock = (block) => {
  return {
    ...block,
    interfaceName: block?.interfaceName || `${block?.slug}Block`
  };
};

// src/lib/deepMerge.ts
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

// src/lib/createField.ts
function createField(fieldFn) {
  return (props = {}) => {
    const field = fieldFn(props);
    return deepMerge(field, props.overrides || {});
  };
}

// src/lib/blockBuilder.ts
var blockBuilder = (config) => {
  const helper = blockBuilderHelper({
    config
  });
  return helper;
};
var blockBuilderHelper = (props) => {
  const { config } = props;
  let blockKeys = Object.keys(config).filter((b) => {
    const blockSettings = config[b];
    if (typeof blockSettings === "boolean" && blockSettings === false) {
      return false;
    }
    return true;
  }) || [];
  const exclude = (...blocks) => {
    blockKeys = blockKeys.filter((key) => !blocks.includes(key));
    return builder;
  };
  const filter = (predicate) => {
    blockKeys = blockKeys.filter(predicate);
  };
  const only = (...blocks) => {
    blockKeys = blockKeys.filter((key) => blocks.includes(key));
    return builder;
  };
  const build = (params) => {
    const blocks = blockKeys.map((key) => {
      const block = config[key];
      if (!block) {
        console.error(`Block ${key} not found in blockMap`);
        return null;
      }
      return block(params);
    });
    return blocks.filter((b) => b !== null);
  };
  const builder = {
    filter,
    exclude,
    build,
    only
  };
  return builder;
};

export {
  isObject,
  deepMerge,
  createField,
  createCollectionConfig,
  createGlobalConfig,
  createBlock,
  blockBuilder,
  blockBuilderHelper
};
//# sourceMappingURL=chunk-YTPJUXBB.js.map