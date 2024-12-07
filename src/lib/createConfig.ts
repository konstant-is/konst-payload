import { Block, CollectionConfig, GlobalConfig } from "payload";

export const createCollectionConfig = (
  slug: string,
  config: Omit<CollectionConfig, "slug">
): CollectionConfig => {
  return {
    slug,
    access: {
      read: () => true,
      ...config.access,
    },
    ...config,
  };
};

export const createGlobalConfig = (
  slug: string,
  config: Omit<GlobalConfig, "slug">
): GlobalConfig => {
  return {
    slug,
    access: {
      read: () => true,
      ...config.access,
    },
    ...config,
  };
};

// type Props<P = unknown> = P;

// type BlockCreationFunction = <P>(props: Props<P>) => Block;

// export const createBlock = (blockCreationFunction: BlockCreationFunction) => {
//   return (props: Props) => {
//     const result = blockCreationFunction(props);
//     return createBlockHelper(result);
//   };
// };

export const createBlock = (block: Block): Block => {
  return {
    ...block,
    interfaceName: block?.interfaceName || `${block?.slug}Block`,
  };
};
