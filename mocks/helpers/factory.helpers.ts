export function createBulkFactory<T>(factory: () => T): (count: number) => T[] {
  return (count: number) => {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(factory());
    }
    return results;
  };
}
