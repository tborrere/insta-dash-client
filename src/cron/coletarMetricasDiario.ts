// src/cron/coletarMetricasDiario.ts

const CLIENTE_ID = '36f76037-3629-4951-8bd3-64b4714ffdcb';
const INSTAGRAM_ID = '17841400177002253';
const ACCESS_TOKEN = 'EAAMNP47IjXoBO3ubkCd4EIncAMLujxvfl03qEEh9FWklDAqXGH01R2rbeFCby5vxrx3gdeRS5UWMnh1GO3a5zoZBBCGnPmtCWbW1amh8QXusrZB3Vn2ZBZACaQMZAoleIwC6lHsY1gizE3j38dirCeDcyh4qcaZA5ZAXRjpekxU2nQW5dSZB8d30YVmNhIkpEnqm4eXcpo73DXxSYSlNXFdLMpVSM6cZD';

async function coletarMetricasDiarias() {
  try {
    const response = await fetch('/api/coletar-metricas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: ACCESS_TOKEN,
        instagramId: INSTAGRAM_ID,
        clienteId: CLIENTE_ID,
      }),
    });

    const resultado = await response.json();
    console.log('Coleta diária finalizada:', resultado);
  } catch (err) {
    console.error('Erro ao coletar métricas automaticamente:', err);
  }
}

// Executa uma vez por dia (em milissegundos: 24h = 86_400_000)
setInterval(coletarMetricasDiarias, 86_400_000);

// Executa também assim que o projeto rodar
coletarMetricasDiarias();
