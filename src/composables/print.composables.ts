export function usePrintPop(routeName: string, id: number) {
  function openPrintWindow() {
    const url = `${window.location.origin}${window.location.pathname}#/pop/print/${routeName}/${id}`;
    window.open(url, '_blank');
  }
  return { openPrintWindow };
}
