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
  previewNoticeStart: string;
  previewNoticeEnd: string;
  signInToSave: string;
  pendingPreviews: string;
  pendingPreviewsNotice: string;
  save: string;
  saveAll: string;
  discard: string;
  saveFailed: string;
  urlLimitReached: string;
  disclaimerTitle: string;
  disclaimerText: string;
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
  previewNoticeStart: 'This is a preview \u2014 the link will not work.',
  previewNoticeEnd: 'to save your URLs.',
  signInToSave: 'Sign in to save',
  pendingPreviews: 'Pending previews',
  pendingPreviewsNotice: 'These URLs were created before you signed in. Save them to keep them.',
  save: 'Save',
  saveAll: 'Save all',
  discard: 'Discard',
  saveFailed: 'Failed to save URL',
  urlLimitReached: 'You have reached the limit of 2 URLs. Delete one to create a new one.',
  disclaimerTitle: 'Demo environment',
  disclaimerText: 'This project runs on free-tier services (Render, Upstash, CloudAMQP). Cold starts may cause delays up to 30 s and data is not persisted between restarts.',
};: Messages = {
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
  previewNoticeStart: 'Esta é uma prévia \u2014 o link não funcionará.',
  previewNoticeEnd: 'para salvar suas URLs.',
  signInToSave: 'Entrar para salvar',
  pendingPreviews: 'Prévias pendentes',
  pendingPreviewsNotice: 'Estas URLs foram criadas antes do login. Salve-as para mantê-las.',
  save: 'Salvar',
  saveAll: 'Salvar todas',
  discard: 'Descartar',
  saveFailed: 'Falha ao salvar URL',
  urlLimitReached: 'Você atingiu o limite de 2 URLs. Exclua uma para criar outra.',
  disclaimerTitle: 'Ambiente de demonstração',
  disclaimerText: 'Este projeto roda em serviços gratuitos (Render, Upstash, CloudAMQP). Cold starts podem causar atrasos de até 30 s e os dados não são persistidos entre reinicializações.',
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
