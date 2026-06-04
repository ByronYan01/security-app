/**
 * 格式化工具函数
 */

/**
 * 字节单位格式化结果
 */
export interface FormattedBytes {
  value: number; // 格式化后的数值
  unit: string; // 单位（如 GiB、TiB）
  display: string; // 完整显示字符串（如 "1.23 TiB"）
}

/**
 * 将字节数自动转换为合适的单位（GiB、TiB 等）
 * @param bytes 字节数
 * @param decimals 小数位数，默认 2
 * @returns 格式化结果
 */
export function formatBytes(
  bytes: number | null | undefined,
  decimals = 2,
): FormattedBytes {
  if (bytes === null || bytes === undefined || isNaN(bytes)) {
    return { value: 0, unit: "B", display: "0 B" };
  }

  if (bytes === 0) {
    return { value: 0, unit: "B", display: "0 B" };
  }

  // 使用二进制单位（1024）
  const k = 1024;
  const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB"];

  // 计算单位级别
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const unitIndex = Math.min(i, units.length - 1);

  const value = parseFloat((bytes / Math.pow(k, unitIndex)).toFixed(decimals));
  const unit = units[unitIndex];

  return {
    value,
    unit,
    display: `${value} ${unit}`,
  };
}

/**
 * 将 GB 数值自动转换为合适的单位（GiB、TiB 等）
 * @param gb GB 数值（不是字节）
 * @param decimals 小数位数，默认 2
 * @returns 格式化结果
 */
export function formatGBytes(
  gb: number | null | undefined,
  decimals = 2,
): FormattedBytes {
  if (gb === null || gb === undefined || isNaN(gb)) {
    return { value: 0, unit: "GiB", display: "0 GiB" };
  }

  if (gb === 0) {
    return { value: 0, unit: "GiB", display: "0 GiB" };
  }

  // 1 TiB = 1024 GiB
  const k = 1024;

  if (Math.abs(gb) >= k) {
    // 转换为 TiB
    const value = parseFloat((gb / k).toFixed(decimals));
    return { value, unit: "TiB", display: `${value} TiB` };
  } else if (Math.abs(gb) >= 1) {
    // 保持 GiB
    const value = parseFloat(gb.toFixed(decimals));
    return { value, unit: "GiB", display: `${value} GiB` };
  } else {
    // 转换为 MiB
    const value = parseFloat((gb * k).toFixed(decimals));
    return { value, unit: "MiB", display: `${value} MiB` };
  }
}

/**
 * 格式化数字，保留指定小数位
 * @param num 数字
 * @param decimals 小数位数，默认 2
 */
export function formatNumber(
  num: number | null | undefined,
  decimals = 2,
): string {
  if (num === null || num === undefined || isNaN(num)) {
    return "0";
  }
  return parseFloat(num.toFixed(decimals)).toString();
}

/**
 * 将功耗数值自动转换为合适的单位（W、kW、MW 等）
 * @param watts 功耗（瓦特）
 * @param decimals 小数位数，默认 2
 * @returns 格式化结果
 */
export function formatPower(
  watts: number | null | undefined,
  decimals = 2,
): FormattedBytes {
  if (watts === null || watts === undefined || isNaN(watts)) {
    return { value: 0, unit: "W", display: "0 W" };
  }

  if (watts === 0) {
    return { value: 0, unit: "W", display: "0 W" };
  }

  // 使用 1000 为进位
  const k = 1000;
  const units = ["W", "kW", "MW", "GW"];

  // 计算单位级别
  const i = Math.floor(Math.log(Math.abs(watts)) / Math.log(k));
  // 确保索引不越界
  const unitIndex = Math.max(0, Math.min(i, units.length - 1));

  const value = parseFloat((watts / Math.pow(k, unitIndex)).toFixed(decimals));
  const unit = units[unitIndex];

  return {
    value,
    unit,
    display: `${value} ${unit}`,
  };
}
