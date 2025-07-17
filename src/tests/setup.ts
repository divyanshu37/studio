import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// JSDOM doesn't implement PointerEvent, so we need to mock it.
// This is a common requirement for testing components that use Radix UI.
if (typeof window !== 'undefined') {
  // Mock PointerEvent
  if (!window.PointerEvent) {
    class PointerEvent extends MouseEvent {}
    window.PointerEvent = PointerEvent as any;
  }

  // Mock pointer capture methods
  if (typeof Element.prototype.hasPointerCapture === 'undefined') {
    Element.prototype.hasPointerCapture = vi.fn();
  }
  if (typeof Element.prototype.releasePointerCapture === 'undefined') {
    Element.prototype.releasePointerCapture = vi.fn();
  }
  if (typeof Element.prototype.setPointerCapture === 'undefined') {
    Element.prototype.setPointerCapture = vi.fn();
  }

  // Mock scrollIntoView, which is not implemented in jsdom
  if (typeof window.HTMLElement.prototype.scrollIntoView === 'undefined') {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  }
}
