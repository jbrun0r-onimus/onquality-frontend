export function getFlexAlignmentClass(
  align: 'left' | 'center' | 'right' | undefined
): string {
  switch (align) {
    case 'left':
      return 'justify-start';
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-end';
    default:
      return '';
  }
}
