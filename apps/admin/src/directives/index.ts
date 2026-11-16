import { App } from 'vue';
import { vPermission } from './permission.directive';
import trim from './trim.directive';

export default function (app: App) {
  vPermission(app);
  app.directive('trim', trim);
}