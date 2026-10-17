// Shows a quote shared from Cairn. The quote is in the link after "#"
// (v=1&t=…&a=…&s=…&by=…), which the browser never sends to a server; this
// script only reads it and writes it into the page as plain text. It makes
// no network requests. Mirrors QuoteLink in the app: same fields, same caps.
(function () {
  "use strict";

  var LIMITS = { t: 1000, a: 100, s: 200, by: 50 };

  // Drop control characters and invisible direction overrides, keep line
  // breaks in the quote (at most one blank line), trim, and cap the length.
  function clean(value, limit, keepsLines) {
    if (typeof value !== "string") return null;
    var text = value.replace(/\r\n?/g, "\n");
    text = text.replace(/[‪-‮⁦-⁩]/g, "");
    text = text.replace(/\n/g, keepsLines ? "\n" : " ");
    text = text.replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, "");
    text = text.replace(/\n{3,}/g, "\n\n").trim();
    text = Array.from(text).slice(0, limit).join("").trim();
    return text.length ? text : null;
  }

  function fields() {
    var result = {};
    var hash = window.location.hash.replace(/^#/, "");
    hash.split("&").forEach(function (pair) {
      var at = pair.indexOf("=");
      if (at < 0) return;
      try {
        result[pair.slice(0, at)] = decodeURIComponent(pair.slice(at + 1));
      } catch (e) {
        // A broken escape: skip that field.
      }
    });
    return result;
  }

  function show() {
    var f = fields();
    var text = f.v === "1" ? clean(f.t, LIMITS.t, true) : null;
    var quote = document.getElementById("quote");
    var missing = document.getElementById("missing");
    var open = document.getElementById("open");
    if (!text) {
      open.hidden = true;
      document.getElementById("from").textContent = "A quote for you";
      quote.hidden = true;
      missing.hidden = false;
      return;
    }
    var author = clean(f.a, LIMITS.a, false);
    var source = clean(f.s, LIMITS.s, false);
    var sender = clean(f.by, LIMITS.by, false);

    document.getElementById("text").textContent = text;
    var credit = [author, source].filter(Boolean).join(", ");
    var caption = document.getElementById("credit");
    caption.textContent = credit;
    caption.hidden = !credit;
    document.getElementById("from").textContent =
      sender ? sender + " shared a quote with you" : "A quote for you";
    missing.hidden = true;
    quote.hidden = false;
    // The same fragment, handed to the app. Cairn checks it again.
    document.getElementById("open-link").href = "cairn://q" + window.location.hash;
    open.hidden = false;
  }

  document.addEventListener("DOMContentLoaded", show);
  window.addEventListener("hashchange", show);
})();
