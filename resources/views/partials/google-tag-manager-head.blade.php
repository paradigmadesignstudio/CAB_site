@if ($gtmContainerId = config('site.analytics.gtm_container_id'))
<!-- Google Tag Manager (deferred until after load) -->
<script>
(function () {
  var gtmId = @json($gtmContainerId);

  function loadGtm() {
    if (window.__cabGtmLoaded) {
      return;
    }

    window.__cabGtmLoaded = true;
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',gtmId);
  }

  function scheduleGtm() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadGtm, { timeout: 2500 });
      return;
    }

    window.setTimeout(loadGtm, 1);
  }

  window.addEventListener('load', scheduleGtm, { once: true });
})();
</script>
<!-- End Google Tag Manager -->
@endif
