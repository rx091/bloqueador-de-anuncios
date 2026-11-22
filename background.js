// Bloqueador de anuncios - Criado por - Rx0 @rodrigocoutinho91

async function aplicarEstado(ativo) {
  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets(
      ativo
        ? { enableRulesetIds: ["ruleset_ads"] }
        : { disableRulesetIds: ["ruleset_ads"] }
    );
  } catch (e) {
    console.error("Erro ao atualizar regras:", e);
  }
  chrome.action.setBadgeText({ text: ativo ? "" : "OFF" });
  chrome.action.setBadgeBackgroundColor({ color: "#777777" });
}

async function sincronizar() {
  const { ativo } = await chrome.storage.local.get({ ativo: true });
  aplicarEstado(ativo);
}

chrome.runtime.onInstalled.addListener(async () => {
  const { ativo } = await chrome.storage.local.get({ ativo: true });
  await chrome.storage.local.set({ ativo });
  sincronizar();
});

chrome.runtime.onStartup.addListener(sincronizar);

chrome.storage.onChanged.addListener((mudancas, area) => {
  if (area === "local" && mudancas.ativo) {
    aplicarEstado(mudancas.ativo.newValue !== false);
  }
});
