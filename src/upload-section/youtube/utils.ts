const thereIsAnError = (errors: { [key: string]: boolean }) => {
  return Object.values(errors).some((error) => error);
};

type UploadGuardsPassed = {
  errors: { [key: string]: boolean };
  video: File | string | null;
  title: string;
};

const uploadGaurdsPassed = ({ errors, video, title }: UploadGuardsPassed) => {
  if (thereIsAnError(errors)) return false;

  if (video === null) return false;

  if (title === "") return false;

  return true;
};

export { uploadGaurdsPassed };
