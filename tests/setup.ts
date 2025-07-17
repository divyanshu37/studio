import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Polyfill for PointerEvent which is not fully supported in JSDOM
if (typeof window !== 'undefined' && !window.PointerEvent) {
    class PointerEvent extends MouseEvent {}
    window.PointerEvent = PointerEvent as any;
}

// Polyfill for hasPointerCapture which is also not supported in JSDOM
if (typeof Element.prototype.hasPointerCapture === 'undefined') {
  Element.prototype.hasPointerCapture = vi.fn();
}
if (typeof Element.prototype.releasePointerCapture === 'undefined') {
    Element.prototype.releasePointerCapture = vi.fn();
}
