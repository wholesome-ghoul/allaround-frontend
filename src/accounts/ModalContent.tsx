import {
  Container,
  Image,
  Label,
  Input,
  Button,
  Upload,
  Icons,
} from "@allaround/all-components";

import { DisplayError } from "../utils";

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
  error: DisplayError;
  setError: (error: DisplayError) => void;
  handleAccountModification: () => void;
  handleAccountClose: () => void;
};

const ModalContent = ({
  modalValues,
  handleAccountNameChange,
  avatarFile,
  setAvatarFile,
  error,
  setError,
  handleAccountModification,
  handleAccountClose,
}: ModalContentProps) => {
  return (
    <Container grid={{ cols: 1, rows: "auto", gap: "20px" }} autoHor>
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
          isError={error.show}
          handleError={({ text, show }) => setError({ texts: [text], show })}
          setFile={setAvatarFile}
          editable
        />
      ) : (
        <>
          <Upload
            text="Upload avatar"
            accept={["image/png"]}
            maxSize={2 * 1024}
            isError={error.show}
            handleError={({ text, show }) => setError({ texts: [text], show })}
            setFile={setAvatarFile}
          />
          {error.show && <Container noGrid>{error.texts.join("")}</Container>}
        </>
      )}

      <Container styles={{ flexFlow: "column" }} gap="10px" noGrid flex>
        <Label size="large" styles={{ alignSelf: "flex-start" }}>
          Name
        </Label>
        <Input
          onChange={handleAccountNameChange}
          value={modalValues.name}
          placeholder="account name"
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
