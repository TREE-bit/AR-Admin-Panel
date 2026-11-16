import { ref } from 'vue'
const selectedColor = "#ececec"

let target:any = null;
let targetTd:any = null;
export const selectedRow = (e:any=event) => {
  clearSelected();
  target = e.target as HTMLElement;
  while (target && target.tagName !== 'TR') {
    if(target.tagName === 'TD') {
      targetTd = target;
    }
    target = target.parentElement as HTMLElement;
  }
  if(target) {
    target.style.backgroundColor = selectedColor;
  }
  if(targetTd) {
    targetTd.style.backgroundColor = selectedColor;
  }
}
export const clearSelected = () => {
  if(target) {
    target.style.backgroundColor='';
    targetTd.style.backgroundColor='';
  }
}