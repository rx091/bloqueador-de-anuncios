const chave = document.getElementById("chave");
const rotulo = document.getElementById("rotulo");

function atualizarRotulo(ativo) {
  rotulo.textContent = ativo ? "Proteção ativada" : "Proteção desativada";
}

chrome.storage.local.get({ ativo: true }, ({ ativo }) => {
  chave.checked = ativo;
  atualizarRotulo(ativo);
});

chave.addEventListener("change", () => {
  chrome.storage.local.set({ ativo: chave.checked });
  atualizarRotulo(chave.checked);
});
