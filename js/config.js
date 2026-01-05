// Configurações da aplicação
const APP_CONFIG = {
  // Nome da aplicação
  nome: 'Sistema de Agendamento - Dra. Wanária Miranda',
  
  // Versão
  versao: '1.0.0',
  
  // URL do Backend
  apiURL: 'http://localhost:3000/api',
  
  // Horários de atendimento
  horarioAtendimento: {
    inicio: '08:00',
    fim: '18:00',
    intervalo: 30 // minutos
  },
  
  // Dias da semana de atendimento (0 = Domingo, 6 = Sábado)
  diasAtendimento: [1, 2, 3, 4, 5], // Segunda a Sexta
  
  // Configurações de agendamento
  agendamento: {
    antecedenciaMinima: 1, // dias
    antecedenciaMaxima: 90, // dias
    cancelamentoPrazo: 24 // horas antes
  },
  
  // Status de agendamento
  statusAgendamento: {
    pendente: 'Pendente',
    confirmado: 'Confirmado',
    cancelado: 'Cancelado',
    concluido: 'Concluído'
  },
  
  // Mensagens do sistema
  mensagens: {
    sucessoAgendamento: '✓ Agendamento realizado com sucesso!',
    erroCamposObrigatorios: 'Preencha todos os campos obrigatórios.',
    erroHorarioIndisponivel: 'Este horário não está mais disponível.',
    erroLoginNecessario: 'É necessário fazer login para agendar.',
    sucessoCancelamento: 'Agendamento cancelado com sucesso.',
    erroCancelamento: 'Não foi possível cancelar o agendamento.'
  }
};

// Função para verificar se é dia útil
function isDiaUtil(data) {
  const diaSemana = data.getDay();
  return APP_CONFIG.diasAtendimento.includes(diaSemana);
}

// Função para validar data de agendamento
function validarDataAgendamento(data) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const dataAgendamento = new Date(data);
  dataAgendamento.setHours(0, 0, 0, 0);
  
  // Verificar se é dia útil
  if (!isDiaUtil(dataAgendamento)) {
    return { valido: false, mensagem: 'Não atendemos neste dia da semana.' };
  }
  
  // Verificar antecedência mínima
  const diffDias = Math.floor((dataAgendamento - hoje) / (1000 * 60 * 60 * 24));
  if (diffDias < APP_CONFIG.agendamento.antecedenciaMinima) {
    return { 
      valido: false, 
      mensagem: `Agendamento deve ser feito com pelo menos ${APP_CONFIG.agendamento.antecedenciaMinima} dia(s) de antecedência.` 
    };
  }
  
  // Verificar antecedência máxima
  if (diffDias > APP_CONFIG.agendamento.antecedenciaMaxima) {
    return { 
      valido: false, 
      mensagem: `Agendamento só pode ser feito com até ${APP_CONFIG.agendamento.antecedenciaMaxima} dias de antecedência.` 
    };
  }
  
  return { valido: true };
}

// Função para formatar data
function formatarData(data) {
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

// Função para exibir notificações
function mostrarNotificacao(mensagem, tipo = 'info') {
  const cores = {
    sucesso: '#4caf50',
    erro: '#f44336',
    info: '#2196F3',
    aviso: '#ff9800'
  };

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${cores[tipo] || cores.info};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = mensagem;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
  window.isDiaUtil = isDiaUtil;
  window.validarDataAgendamento = validarDataAgendamento;
  window.formatarData = formatarData;
  window.mostrarNotificacao = mostrarNotificacao;
}