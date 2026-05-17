export type Locale = 'en' | 'pt';

export interface Messages {
  signIn: string;
  login: string;
  register: string;
  email: string;
  password: string;
  logout: string;
  hello: string;
  shortenUrl: string;
  shorten: string;
  placeholder: string;
  yourUrls: string;
  noUrls: string;
  short: string;
  original: string;
  hits: string;
  actions: string;
  confirmDelete: string;
  yes: string;
  no: string;
  delete: string;
  authFailed: string;
  shortenFailed: string;
  deleteFailed: string;
  loading: string;
  footer: string;
  previewBadge: string;
  previewNotice: string;
  signInToSave: string;
}

const en: Messages = {
  signIn: 'Sign in',
  login: 'Login',
  register: 'Register',
  email: 'Email',
  password: 'Password',
  logout: 'Logout',
  hello: 'Hello',
  shortenUrl: 'Shorten URL',
  shorten: 'Shorten',
  placeholder: 'https://example.com/very/long/url',
  yourUrls: 'Your URLs',
  noUrls: 'No URLs yet.',
  short: 'Short',
  original: 'Original',
  hits: 'Hits',
  actions: 'Actions',
  confirmDelete: 'Delete?',
  yes: 'Yes',
  no: 'No',
  delete: 'Delete',
  authFailed: 'Authentication failed',
  shortenFailed: 'Failed to shorten URL',
  deleteFailed: 'Failed to delete',
  loading: 'Loading...',
  footer: 'Built with Spring Boot 3 · Next.js · Redis · RabbitMQ — by',
  previewBadge: 'Preview',
  previewNotice: 'This is a preview — the link will not work. Sign in to save your URLs.',
  signInToSave: 'Sign in to save',
};

const pt: Messages = {
  signIn: 'Entrar',
  login: 'Login',
  register: 'Registrar',
  email: 'E-mail',
  password: 'Senha',
  logout: 'Sair',
  hello: 'Olá',
  shortenUrl: 'Encurtar URL',
  shorten: 'Encurtar',
  placeholder: 'https://exemplo.com/url/muito/longa',
  yourUrls: 'Suas URLs',
  noUrls: 'Nenhuma URL ainda.',
  short: 'Curta',
  original: 'Original',
  hits: 'Cliques',
  actions: 'Ações',
  confirmDelete: 'Excluir?',
  yes: 'Sim',
  no: 'Não',
  delete: 'Excluir',
  authFailed: 'Falha na autenticação',
  shortenFailed: 'Falha ao encurtar URL',
  deleteFailed: 'Falha ao excluir',
  loading: 'Carregando...',
  footer: 'Feito com Spring Boot 3 · Next.js · Redis · RabbitMQ — por',
  previewBadge: 'Prévia',
  previewNotice: 'Esta é uma prévia — o link não funcionará. Entre para salvar suas URLs.',
  signInToSave: 'Entrar para salvar',
};

const messages: Record<Locale, Messages> = { en, pt };

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('pt')) return 'pt';
  return 'en';
}

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
