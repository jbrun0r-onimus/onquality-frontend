import { PublicPathState } from 'vee-validate';

export function groupByField<T, K extends keyof T>(
  list: T[],
  field: K
): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();
  for (const item of list) {
    const key = item[field];
    const list = map.get(key);
    if (list) {
      list.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}

export function inputBindsConfig(state: PublicPathState) {
  return {
    props: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modelValue: state.value as any,
      error: !!state.errors.length,
      'error-message': state.errors[0],
    },
  };
}

export function makeInputMaskFromDateFormat(dateFormat: string): string {
  return dateFormat.replace(/y|Y|m|M|d|D/g, '#');
}

export function trimObject<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value !== undefined && value !== '' && value !== null ? value : undefined,
    ])
  ) as Partial<T>;
}

export function toNumberOrNull(value: unknown): number | null {
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

export function keepPresent<T>(array: Array<T | null | undefined>): T[] {
  return array.filter(Boolean) as T[];
}

export function includesAll<T>(set: Set<T>, values: T[]): boolean {
  for (const value of values) {
    if (!set.has(value)) return false;
  }
  return true;
}

export function includesAny<T>(set: Set<T>, values: T[]): boolean {
  for (const value of values) {
    if (set.has(value)) return true;
  }
  return false;
}
