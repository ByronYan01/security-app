const NAME_REPLACE_MAP: Record<string, string> = {
  "NVIDIA GeForce RTX 5090": "星石",
  "rtx-5090": "x1-50",
};

const GPU_MODEL_NAME_MAP: Record<string, string> = {
  "NVIDIA GeForce RTX 5090": "星石",
};

const GPU_VENDOR_NAME_MAP: Record<string, string> = {
  Nvidia: "星石",
};

export const replaceDisplayName = (raw: string) =>
  Object.entries(NAME_REPLACE_MAP).reduce(
    (name, [from, to]) => name.replaceAll(from, to),
    raw,
  );

export const getGpuModelDisplayName = (modelName: string) =>
  GPU_MODEL_NAME_MAP[modelName] ?? modelName;

export const getGpuVendorDisplayName = (vendorName: string) =>
  GPU_VENDOR_NAME_MAP[vendorName] ?? vendorName;

