import type { App } from "vue";

import VueDd from "./VueDd.vue";
import XRay from "./XRay.vue";

function install(app: App) {
  // Base entities
  app.component("VueDd", VueDd);
  app.component("XRay", XRay);
}

export {
  install,
  // Base entities
  VueDd,
  XRay
};
