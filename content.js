// Bloqueador de anuncios v1.1 - Criado por - Rx0 @rodrigocoutinho91
(() => {
  const STYLE_ID = "bda-estilo-ocultar";

  const HOSTS_ANUNCIO = [
    "doubleclick.net", "googlesyndication.com", "googleadservices.com", "exoclick.com",
    "exosrv.com", "exdynsrv.com", "juicyads.com", "trafficjunky.com", "trafficjunky.net",
    "trafficfactory.com", "trafficstars.com", "adsterra.com", "magsrv.com", "realsrv.com",
    "pemsrv.com", "popads.net", "popcash.net", "propellerads.com", "clickadu.com",
    "tsyndicate.com", "ero-advertising.com", "a-ads.com", "adnxs.com", "mgid.com",
    "taboola.com", "outbrain.com", "revcontent.com", "profitableratecpm.com",
    "highperformanceformat.com", "effectivegatecpm.com", "xlirdr.com", "xlviirdr.com"
  ];

  const SELETORES = [
    "ins.adsbygoogle", "[id^='google_ads']", "[id^='div-gpt-ad']",
    ".exo-native-widget", ".ad-banner", ".ad-container", ".ads-container", ".adsbox",
    ".banner-ads", ".adv-block", ".advertising", "[class*='ad-slot']", "[id*='ad-slot']",
    "[class*='-ads-']", "[id^='ad_']", "[id^='ads_']", "[class^='ad_']", "[class^='ads_']",
    ".video-ad", ".preroll", ".pre-roll", ".vjs-ad", ".jw-ad", "#video-ad", "#ad-overlay",
    "[class*='sponsor-banner']", "[class*='pop-under']",
    // YouTube
    "#masthead-ad", "#player-ads", ".ytp-ad-module", ".ytp-ad-overlay-container",
    ".ytp-ad-overlay-slot", "ytd-ad-slot-renderer", "ytd-display-ad-renderer",
    "ytd-in-feed-ad-layout-renderer", "ytd-promoted-sparkles-web-renderer",
    "ytd-promoted-video-renderer", "ytd-banner-promo-renderer", "ytd-companion-slot-renderer",
    "ytd-action-companion-ad-renderer", "ytd-statement-banner-renderer",
    "ytd-primetime-promo-renderer", "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)",
    "ytd-rich-section-renderer:has(ytd-ad-slot-renderer)", ".ytd-ad-slot-renderer"
  ];

  let ativo = true;
  let observer = null;
  let intervalo = null;

  const ehAnuncioHost = (url) => {
    try {
      const h = new URL(url, location.href).hostname;
      return HOSTS_ANUNCIO.some((d) => h === d || h.endsWith("." + d));
    } catch (e) { return false; }
  };

  function injetarEstilo() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    const hostSel = HOSTS_ANUNCIO.flatMap((d) => [
      `iframe[src*='${d}']`, `a[href*='${d}']`, `img[src*='${d}']`
    ]);
    style.textContent = SELETORES.concat(hostSel).join(",\n") + " { display: none !important; visibility: hidden !important; }";
    (document.head || document.documentElement).appendChild(style);
  }

  function removerEstilo() {
    const el = document.getElementById(STYLE_ID);
    if (el) el.remove();
  }

  function limparIframes() {
    document.querySelectorAll("iframe[src]").forEach((f) => {
      if (ehAnuncioHost(f.src)) f.remove();
    });
  }

  function pularAnuncioYouTube() {
    if (!location.hostname.endsWith("youtube.com")) return;
    const player = document.querySelector(".html5-video-player");
    if (!player) return;
    const emAnuncio = player.classList.contains("ad-showing") || player.classList.contains("ad-interrupting");
    if (!emAnuncio) return;

    document.querySelectorAll(
      ".ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-container button, .ytp-ad-overlay-close-button"
    ).forEach((b) => b.click());

    const video = player.querySelector("video.html5-main-video") || player.querySelector("video");
    if (video) {
      video.muted = true;
      video.playbackRate = 16;
      if (isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration - 0.1;
      }
    }
  }

  function varrer() {
    pularAnuncioYouTube();
    limparIframes();
  }

  function iniciar() {
    injetarEstilo();
    varrer();
    if (!observer) {
      observer = new MutationObserver(() => varrer());
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    }
    if (!intervalo) intervalo = setInterval(varrer, 300);
  }

  function parar() {
    removerEstilo();
    if (observer) { observer.disconnect(); observer = null; }
    if (intervalo) { clearInterval(intervalo); intervalo = null; }
  }

  const aplicar = () => (ativo ? iniciar() : parar());

  try {
    chrome.storage.local.get({ ativo: true }, (r) => {
      ativo = r.ativo !== false;
      aplicar();
    });
    chrome.storage.onChanged.addListener((mud, area) => {
      if (area === "local" && mud.ativo) {
        ativo = mud.ativo.newValue !== false;
        aplicar();
      }
    });
  } catch (e) {
    iniciar();
  }
})();
