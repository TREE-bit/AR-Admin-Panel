export default {
  mounted(el: HTMLElement) {
    el.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const trimmedValue = target.value.trim();
      if (target.value !== trimmedValue) {
        target.value = trimmedValue;

        const inputEvent = new Event('input', { bubbles: true });
        target.dispatchEvent(inputEvent);
      }
    });
  },
};
