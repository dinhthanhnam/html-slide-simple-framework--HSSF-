/**
 * Browser IIFE entry — assigns window.HSSF public API.
 */

import {
  init,
  version,
  attachGlobal,
  highlightCode,
  hljs,
  fitStage,
  computeScale,
  parseHash,
  formatHash,
  toggleFullscreen,
} from "./index.js";

const api = {
  init,
  version,
  highlight: highlightCode,
  hljs,
  fitStage,
  computeScale,
  parseHash,
  formatHash,
  toggleFullscreen,
};

attachGlobal(api);

export {
  init,
  version,
  highlightCode as highlight,
  hljs,
  fitStage,
  computeScale,
  parseHash,
  formatHash,
  toggleFullscreen,
};
