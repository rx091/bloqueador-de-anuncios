// Bloqueador de anuncios v1.1 - Criado por - Rx0 @rodrigocoutinho91
// Roda no contexto da página para barrar pop-ups de anúncio (window.open).
(() => {
  const HOSTS = [
    "doubleclick.net", "exoclick.com", "exosrv.com", "juicyads.com", "trafficjunky.com",
    "trafficjunky.net", "trafficfactory.com", "trafficstars.com", "adsterra.com", "magsrv.com",
    "realsrv.com", "pemsrv.com", "popads.net", "popcash.net", "propellerads.com",
    "clickadu.com", "tsyndicate.com", "ero-advertising.com", "adnxs.com",
    "profitableratecpm.com", "effectivegatecpm.com", "highperformanceformat.com",
    "xlirdr.com", "xlviirdr.com"
  ];
  const original = window.open;
  window.open = function (url, ...resto) {
    try {
      if (url) {
        const h = new URL(url, location.href).hostname;
        if (HOSTS.some((d) => h === d || h.endsWith("." + d))) return null;
      }
    } catch (e) {}
    return original.call(this, url, ...resto);
  };
})();
