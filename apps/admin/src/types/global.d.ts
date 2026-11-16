import { ComponentCustomProperties } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    $copyId: (id: any) => void;
    $getMapItem: (map: Map<any, any>, key: any) => any;
    $getMenuName: () => any;
  }
}