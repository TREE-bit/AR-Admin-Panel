import { Modal } from "ant-design-vue";

const OVERLAY_SELECTORS = [
  ".ant-modal-root",
  ".ant-modal-mask",
  ".ant-modal-wrap",
  ".ant-image-preview-root",
];

export function clearGlobalOverlays() {
  if (typeof document === "undefined") return;

  Modal.destroyAll();

  OVERLAY_SELECTORS.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => node.remove());
  });

  document.body.classList.remove("ant-scrolling-effect");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("overflow-x");
  document.body.style.removeProperty("overflow-y");
  document.body.style.removeProperty("width");
}
