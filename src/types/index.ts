export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  tipoUsuario: 'estabelecimento' | 'instituicao';
}

export interface LoginResponse {
  mensagem: string;
  token: string;
  expiracao: string;
  usuario: Usuario;
}

export interface Alimento {
  idAlimento: number;
  idEstabelecimento: number;
  tipoAlimento: string;
  quantidade: number;
  unidade: string;
  dataValidade: string;
  disponibilidade: boolean;
  dataCadastro: string;
}

export interface Solicitacao {
  idSolicitacao: number;
  idAlimento: number;
  idInstituicao: number;
  quantidadeSolicitada: number;
  dataSolicitacao: string;
  statusSolicitacao: string;
  dataResposta?: string;
  idAlimentoNavigation?: Alimento;
}