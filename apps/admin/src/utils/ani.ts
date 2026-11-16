// 动态高度过渡
export const beforeEnterHeight = (element: Element) => {
  const el = element as HTMLElement;
  el.style.height = '0';
  el.style.opacity = '0';
  el.style.overflow = 'hidden';
}

export const enterHeight = (element: Element) => {
  const el = element as HTMLElement;
  void el.offsetHeight;
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
  el.style.height = el.scrollHeight + 'px';
  el.style.opacity = '1';
}

export const afterEnterHeight = (element: Element) => {
  const el = element as HTMLElement;
  el.style.height = 'auto';
  el.style.overflow = '';
}

export const beforeLeaveHeight = (element: Element) => {
  const el = element as HTMLElement;
  el.style.height = el.scrollHeight + 'px';
  el.style.opacity = '1';
  el.style.overflow = 'hidden';
}

export const leaveHeight = (element: Element) => {
  const el = element as HTMLElement;
  void el.offsetHeight;
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
  el.style.height = '0';
  el.style.opacity = '0';
}

export const afterLeaveHeight = (element: Element) => {
  const el = element as HTMLElement;
  el.style.height = '';
  el.style.transition = '';
  el.style.overflow = '';
  el.style.opacity = '';
}