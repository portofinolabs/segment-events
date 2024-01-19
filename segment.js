export default function initSegment() {
  !(function () {
    var segment = (window.analytics = window.analytics || []);
    console.log("segment", segment);
    if (!segment.initialize) {
      if (segment.invoked)
        window.console &&
          console.error &&
          console.error("Segment snippet included twice.");
      else {
        segment.invoked = !0;
        segment.methods = [
          "trackSubmit",
          "trackClick",
          "trackLink",
          "trackForm",
          "pageview",
          "identify",
          "reset",
          "group",
          "track",
          "ready",
          "alias",
          "debug",
          "page",
          "screen",
          "once",
          "off",
          "on",
          "addSourceMiddleware",
          "addIntegrationMiddleware",
          "setAnonymousId",
          "addDestinationMiddleware",
          "register",
        ];
        segment.factory = function (e) {
          return function () {
            var i = Array.prototype.slice.call(arguments);
            i.unshift(e);
            segment.push(i);
            return segment;
          };
        };
        for (var i = 0; i < segment.methods.length; i++) {
          var key = segment.methods[i];
          segment[key] = segment.factory(key);
        }
        segment.load = function (key, i) {
          var t = document.createElement("script");
          t.type = "text/javascript";
          t.async = !0;
          t.src =
            "https://cdn.segment.com/analytics.js/v1/" +
            key +
            "/analytics.min.js";
          var n = document.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(t, n);
          segment._loadOptions = i;
        };
        segment._writeKey = "bevOsoWqV9duPDtFxcCpLG7DJQbKdbLM";
        segment.SNIPPET_VERSION = "5.2.0";
        segment.load("bevOsoWqV9duPDtFxcCpLG7DJQbKdbLM");
      }
    }
  })();
}
