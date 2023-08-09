const thereIsAnError = (errors: { [key: string]: boolean }) => {
  return Object.values(errors).some((error) => error);
};

type UploadGuardsPassed = {
  errors: { [key: string]: boolean };
  title: string;
  videoUrl: string | null;
  videoS3Key: string;
};

const uploadGaurdsPassed = ({ errors, title, videoUrl, videoS3Key }: UploadGuardsPassed) => {
  if (thereIsAnError(errors) ||
  title === "" ||
  videoUrl === null ||
  videoS3Key === "") return false;

  return true;
};

export { uploadGaurdsPassed };
