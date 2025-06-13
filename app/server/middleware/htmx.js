const debug = require("debug")("apply-juggling-license:htmx");

/**
 * A configuration object for HTMX. Each property is optional; if not provided,
 * HTMX will use its default value. For more details, see:
 * https://htmx.org/reference/#config
 *
 * @typedef {Object} HtmxConfig
 *
 * @property {boolean} [historyEnabled=true]
 *   Enables HTMX-driven browser history (push/pop).
 *
 * @property {number} [historyCacheSize=10]
 *   Number of entries to keep in HTMX's local history cache.
 *
 * @property {boolean} [refreshOnHistoryMiss=false]
 *   If `true`, performs a full page reload on history misses (instead of AJAX).
 *
 * @property {string} [defaultSwapStyle="innerHTML"]
 *   Default swap mode for incoming content (e.g., "innerHTML", "outerHTML").
 *
 * @property {number} [defaultSwapDelay=0]
 *   Delay (ms) before HTMX swaps in new content.
 *
 * @property {number} [defaultSettleDelay=20]
 *   Delay (ms) before swapped content is considered "settled."
 *
 * @property {boolean} [includeIndicatorStyles=true]
 *   If `true`, injects default CSS for request indicators.
 *
 * @property {string} [indicatorClass="htmx-indicator"]
 *   Class toggled on/off during requests (often used to show a spinner).
 *
 * @property {string} [requestClass="htmx-request"]
 *   Class applied while a request is active (on the element or `hx-indicator`).
 *
 * @property {string} [addedClass="htmx-added"]
 *   Class applied to incoming content before swap; removed after settle.
 *
 * @property {string} [settlingClass="htmx-settling"]
 *   Class applied post-swap until content settles.
 *
 * @property {string} [swappingClass="htmx-swapping"]
 *   Class applied just before swapping, removed immediately after.
 *
 * @property {boolean} [allowEval=true]
 *   If `false`, disables `eval()` usage (e.g., for trigger filters).
 *
 * @property {boolean} [allowScriptTags=true]
 *   If `false`, ignores and never executes script tags in swapped content.
 *
 * @property {string} [inlineScriptNonce=""]
 *   Nonce attribute added to inline scripts for CSP.
 *
 * @property {string} [inlineStyleNonce=""]
 *   Nonce attribute added to inline styles for CSP.
 *
 * @property {string[]} [attributesToSettle=["class","style","width","height"]]
 *   Attributes preserved during the "settle" phase of a swap.
 *
 * @property {string} [wsReconnectDelay="full-jitter"]
 *   Reconnect strategy for WebSockets (e.g., "full-jitter").
 *
 * @property {string} [wsBinaryType="blob"]
 *   Type for binary data received over WebSocket ("blob" or "arraybuffer").
 *
 * @property {string} [disableSelector="[hx-disable], [data-hx-disable]"]
 *   Selector for elements (or parents) that HTMX should skip processing.
 *
 * @property {boolean} [disableInheritance=false]
 *   Disables attribute inheritance unless explicitly enabled with `hx-inherit`.
 *
 * @property {boolean} [withCredentials=false]
 *   If `true`, cross-origin requests include credentials (cookies, headers).
 *
 * @property {number} [timeout=0]
 *   Max time (ms) before an AJAX request aborts. `0` means no timeout.
 *
 * @property {"instant"|"smooth"|"auto"} [scrollBehavior="instant"]
 *   Scroll behavior when `show` is used in `hx-swap`.
 *
 * @property {boolean} [defaultFocusScroll=false]
 *   If `true`, newly focused elements are scrolled into view.
 *
 * @property {boolean} [getCacheBusterParam=false]
 *   If `true`, appends `org.htmx.cache-buster=<targetElementId>` to GET requests.
 *
 * @property {boolean} [globalViewTransitions=false]
 *   If `true`, globally uses the View Transition API when swapping content.
 *
 * @property {string[]} [methodsThatUseUrlParams=["get","delete"]]
 *   Methods whose form data is sent via query params (rather than the request body).
 *
 * @property {boolean} [selfRequestsOnly=true]
 *   Restricts requests to the same domain as the current page.
 *
 * @property {boolean} [ignoreTitle=false]
 *   If `true`, ignores `<title>` in swapped content (doesn't update document title).
 *
 * @property {boolean} [scrollIntoViewOnBoost=true]
 *   Scrolls to the target element after a boosted navigation; if no target, scrolls to top.
 *
 * @property {Object|null} [triggerSpecsCache=null]
 *   Cache for parsed trigger specifications. Pass a plain or proxy object to enable caching.
 *
 * @property {Object.<number, "swap"|"error">} [responseHandling]
 *   Overrides default response handling by HTTP status code (e.g., `{404: "error"}`).
 *
 * @property {boolean} [allowNestedOobSwaps=true]
 *   If `true`, processes OOB swaps nested inside the main response element.
 */

/**
 * Log HTMX request headers.
 * See {@link https://htmx.org/reference/#request_headers|the docs}
 * @param {import('express').Request} req
 * @returns {void}
 */
function logHtmxHeaders(req) {
  if (!debug.enabled) {
    return;
  }

  const htmxHeaderEntries = Object.entries(req.headers).filter(([key]) =>
    key.startsWith("hx-"),
  );

  const htmxHeaders = Object.fromEntries(htmxHeaderEntries);

  debug(htmxHeaders);
}

/**
 * Pass HTMX config into Nunjucks
 * @param {import('express').Response} res
 * @returns {void}
 */
function setHtmxConfig(res) {
  /**
   * @type {HtmxConfig}
   */
  const htmxConfig = {
    inlineScriptNonce: res.locals.cspNonce,
    responseHandling: [
      { code: "404", swap: true, error: true },
      { code: "422", swap: true },
      { code: "500", swap: true, error: true },
      { code: "503", swap: true, error: true },
      { code: "204", swap: false },
      { code: "[23]..", swap: true },
      { code: "[45]..", swap: false, error: true },
      { code: "...", swap: false },
    ],
    scrollBehavior: "smooth",
  };

  res.locals.htmxConfig = JSON.stringify(htmxConfig);
}

/**
 * Middleware to log HTMX request headers.
 * See {@link https://htmx.org/reference/#request_headers|the docs}
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
function htmxMiddleware(req, res, next) {
  logHtmxHeaders(req);
  setHtmxConfig(res);
  next();
}

module.exports = { htmxMiddleware };
