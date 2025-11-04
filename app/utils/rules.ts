const email = {
  pattern: {
    value: /^[A-Za-z0-9@._-]+$/,
    message: 'O campo deve ser um e-mail',
  },
};

export const rules = { email };
