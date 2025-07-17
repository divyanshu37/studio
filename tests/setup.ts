import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// JSDOM doesn't implement PointerEvent so we need to mock it
if (typeof window !== 'undefined') {
  if (!window.PointerEvent) {
    class PointerEvent extends MouseEvent {}
    window.PointerEvent = PointerEvent as any;
  }
  
  // JSDOM doesn't implement these functions, so we need to mock them
  if (typeof Element.prototype.hasPointerCapture === 'undefined') {
    Element.prototype.hasPointerCapture = vi.fn();
  }
  if (typeof Element.prototype.releasePointerCapture === 'undefined') {
    Element.prototype.releasePointerCapture = vi.fn();
  }
  if (typeof Element.prototype.setPointerCapture === 'undefined') {
    Element.prototype.setPointerCapture = vi.fn();
  }
}
