// Gerenciamento de autenticação (apenas sessionStorage)
const storage = {
  
  // ========== USUÁRIO LOGADO ==========
  getUsuarioLogado() {
    const usuarioStr = sessionStorage.getItem('usuarioLogado');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  },

  setUsuarioLogado(usuario) {
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
  },

  getToken() {
    return sessionStorage.getItem('authToken');
  },

  setToken(token) {
    sessionStorage.setItem('authToken', token);
  },

  logout() {
    sessionStorage.removeItem('usuarioLogado');
    sessionStorage.removeItem('authToken');
    window.location.href = 'index.html';
  },

  // Verificar se usuário está autenticado
  isAutenticado() {
    return this.getUsuarioLogado() !== null;
  },

  // Obter nome do usuário
  getNomeUsuario() {
    const usuario = this.getUsuarioLogado();
    return usuario ? usuario.nome_completo : null;
  },

  // Obter primeiro nome
  getPrimeiroNome() {
    const nome = this.getNomeUsuario();
    return nome ? nome.split(' ')[0] : null;
  }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.storage = storage;
}