export const exceptionMessages = {
  NOT_FOUND: 'Entity not found',
  BAD_REQUEST: 'Verify your request and try again',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  ALREADY_EXISTS: 'Entity resource already exists',
  DELETE_CONFLICT: 'Entity resource is being used by other resources',
  FK_INVALID: 'Foreign key is invalid',
} as const;

export const exceptions = {
  auth: {
    unauthorized: {
      errKey: 'unauthorized',
      message: exceptionMessages.UNAUTHORIZED,
      friendlyMessage: 'Você não está autorizado a realizar esta ação',
    },
    invalidToken: {
      errKey: 'invalidToken',
      message: exceptionMessages.UNAUTHORIZED,
      friendlyMessage: 'Tokens de autenticação inválidos',
    },
    invalidSecret: {
      errKey: 'invalidSecret',
      message: exceptionMessages.UNAUTHORIZED,
      friendlyMessage: 'Chave secreta inválida',
    },
    locked: {
      errKey: 'locked',
      message: exceptionMessages.UNAUTHORIZED,
      friendlyMessage: 'Usuário bloqueado ou email não verificado',
    },
    twoFactorInvalid: {
      errKey: 'twoFactorInvalid',
      message: exceptionMessages.BAD_REQUEST,
      friendlyMessage: 'Código de autenticação inválido',
    },
  },
  users: {
    notFound: {
      errKey: 'userNotFound',
      message: exceptionMessages.NOT_FOUND,
      friendlyMessage: 'Usuário não encontrado',
    },
    emailAlreadyExists: {
      errKey: 'emailAlreadyExists',
      message: exceptionMessages.ALREADY_EXISTS,
      friendlyMessage: 'E-mail já cadastrado',
    },
    cpfAlreadyExists: {
      errKey: 'cpfAlreadyExists',
      message: exceptionMessages.ALREADY_EXISTS,
      friendlyMessage: 'CPF já cadastrado',
    },
  },
  files: {
    upload: {
      errKey: 'uploadFile',
      message: exceptionMessages.INTERNAL_SERVER_ERROR,
      friendlyMessage: 'Erro ao fazer upload do arquivo',
    },
    delete: {
      errKey: 'deleteFile',
      message: exceptionMessages.INTERNAL_SERVER_ERROR,
      friendlyMessage: 'Erro ao deletar arquivo',
    },
    download: {
      errKey: 'downloadFile',
      message: exceptionMessages.INTERNAL_SERVER_ERROR,
      friendlyMessage: 'Erro ao fazer download do arquivo',
    },
    invalidType: {
      errKey: 'invalidFileType',
      message: exceptionMessages.BAD_REQUEST,
      friendlyMessage: 'Tipo de arquivo inválido',
    },
  },
  validation: {
    invalidMail: {
      errKey: 'invalidMail',
      message: exceptionMessages.BAD_REQUEST,
      friendlyMessage: 'E-mail inválido',
    },
    invalidSysParam: {
      errKey: 'invalidSysParam',
      message: exceptionMessages.BAD_REQUEST,
      friendlyMessage: 'Parâmetro de sistema inválido',
    },
  },
  misc: {
    unknownError: {
      errKey: 'unknownError',
      message: exceptionMessages.INTERNAL_SERVER_ERROR,
      friendlyMessage: 'Erro desconhecido',
    },
    internal: {
      errKey: 'internalError',
      message: exceptionMessages.INTERNAL_SERVER_ERROR,
      friendlyMessage: 'Erro interno',
    },
  },
} as const;
