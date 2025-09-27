import { addCollection, type IconifyJSON } from "@iconify/react";

(async () => {
  const data = (await import("@iconify-json/simple-icons/icons.json")).default as IconifyJSON;
  addCollection(data);
})();
