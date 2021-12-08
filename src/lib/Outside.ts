export function isOutside(
  target: HTMLElement,
  parent: HTMLElement
): boolean {
  if (target == document.body) return true;
  if (!(target instanceof HTMLElement)) return true;
  if (target == parent) return false;
  return isOutside(target.parentElement!, parent);
}