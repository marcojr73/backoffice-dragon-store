const dateShouldNotInThePast = 'A data não pode ser anterior a hoje.';
const dateShouldNotAfterThan = (dueDate: string) =>
  `A data não pode ser posterior à ${dueDate}.`;
const requiredField = 'Campo obrigatório';

export const errorMessages = {
  dateShouldNotInThePast,
  dateShouldNotAfterThan,
  requiredField,
};
