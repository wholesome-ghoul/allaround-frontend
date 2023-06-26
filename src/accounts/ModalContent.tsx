import {
  Container,
  Image,
  Label,
  Input,
  Button,
  Upload,
  Icons,
} from "@allaround/all-components";

import { Errors } from "./utils";

export type ModalValues = {
  avatar: string | File | any;
  name: string;
  createButton: "Create" | "Update";
  id: string;
};

type ModalContentProps = {
  modalValues: ModalValues;
  handleAccountNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  avatarFile: File | null;
  setAvatarFile: (file: File | null) => void;
  handleAccountModification: () => void;
  handleAccountClose: () => void;
  setIsError: (isError: boolean) => void;
  setErrors: React.Dispatch<React.SetStateAction<typeof Errors>>;
  errors: typeof Errors;
};

const ModalContent = ({
  modalValues,
  handleAccountNameChange,
  avatarFile,
  setAvatarFile,
  setIsError,
  handleAccountModification,
  handleAccountClose,
  setErrors,
  errors,
}: ModalContentProps) => {
  return (
    <Container grid={{ cols: 1, rows: "auto", gap: "30px" }} autoHor>
      {modalValues.avatar || avatarFile ? (
        <Image
          src={avatarFile || modalValues.avatar}
          alt="account avatar"
          width="256px"
          height="256px"
          objectFit="contain"
          icon={<Icons.EditIcon />}
          iconPosition="bottom"
          maxSize={2 * 1024}
          setIsError={setIsError}
          setFile={setAvatarFile}
          editable
        />
      ) : (
        <Upload
          text="Upload avatar"
          accept={["image/png"]}
          maxSize={2 * 1024}
          setIsError={setIsError}
          setFile={setAvatarFile}
        />
      )}

      <Container styles={{ flexFlow: "column" }} gap="10px" noGrid flex>
        <Label size="large" styles={{ alignSelf: "flex-start" }}>
          Name
        </Label>
        <Input
          onChange={handleAccountNameChange}
          value={modalValues.name}
          setIsError={(isError) => {
            setIsError(isError);
            setErrors((prev: typeof Errors) => ({
              ...prev,
              modalValueName: isError,
            }));
          }}
          isError={errors.modalValueName}
          placeholder="account name"
          required
          fill
        />
      </Container>

      <Container gap="10px" noGrid flex>
        <Button onClick={handleAccountModification}>
          {modalValues.createButton}
        </Button>
        <Button onClick={handleAccountClose}>Close</Button>
      </Container>
    </Container>
  );
};

export default ModalContent;
