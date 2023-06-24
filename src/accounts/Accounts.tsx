import { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Heading,
  Icons,
  Input,
  Label,
  Upload,
  Image,
  hooks,
  Checkbox,
} from "@allaround/all-components";

import {
  DisplayError,
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../utils";
import Account from "./Account";
import type { AccountType } from "../utils";
import {
  getAccount,
  getSocialOauthUrl,
  isSocialEnabled,
  updateAccount,
} from "./utils";
import Context from "../context";

const { useConfirm, useModal } = hooks;

const DEFAULT_ACCOUNT_AVATAR = "/assets/images/account.webp";

type ModalValues = {
  avatar: string | File | any;
  name: string;
  createButton: "Create" | "Update";
  id: string;
};

const Accounts = () => {
  const { activeAccount, setActiveAccount } = useContext(Context.Account);
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const { show, close, modal: Modal } = useModal();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [modalValues, setModalValues] = useState<ModalValues>({
    avatar: "",
    name: "",
    createButton: "Create",
    id: "",
  });
  const [error, setError] = useState<DisplayError>({
    texts: [],
    show: false,
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      const response = await getRequest({
        url: `${process.env.SERVER}/api/accounts`,
        credentials: "include",
      });

      if (response.success) {
        const fetchedAccounts = (response.data.accounts as AccountType[]).map(
          getAccount
        );

        setAccounts(fetchedAccounts);
      }
    };

    fetchAccounts();
  }, []);

  const [handleSocialClick, confirmPrompt] = useConfirm(
    async (id: string, value: string) => {
      const url = getSocialOauthUrl(value);

      if (!accounts.find(isSocialEnabled(id, value))) {
        const response = await getRequest({
          url,
          query: { accountId: id },
          credentials: "include",
        });

        if (response.success) {
          const authUrl = response.data.authorizationUrl as string;

          if (authUrl) {
            window.open(authUrl, "_blank")?.focus();
            // setActiveAccount(accounts.find((acc) => acc.id === id) ?? null);
            // TODO: update accounts
          }
        } else {
          console.log(response.data.error);
        }
      } else {
        const response = await deleteRequest({
          url,
          body: { accountId: id },
          expectedStatus: 201,
          credentials: "include",
        });

        if (response.success) {
          setAccounts((prev) => [...prev.map(updateAccount(value)(id))]);
          // setActiveAccount(accounts.find((acc) => acc.id === id) ?? null);
        } else {
          console.log(response.data.error);
        }
      }
    },
    {
      prompt: 'Are you sure you want to remove "#INJECT_NAME#"?',
      confirm: "Yes",
      cancel: "No",
      injectText: true,
      enableSkip: true,
    }
  );

  const [handleAccountRemove] = useConfirm(
    async (accountId: string) => {
      const response = await deleteRequest({
        url: `${process.env.SERVER}/api/accounts`,
        body: {
          accountId,
        },
        expectedStatus: 201,
        credentials: "include",
      });

      if (response.success) {
        setAccounts((prev) => [...prev.filter((acc) => acc.id !== accountId)]);
      }
    },
    {
      prompt: 'Are you sure you want to remove "#INJECT_NAME#"?',
      confirm: "Yes",
      cancel: "No",
      injectText: true,
    }
  );

  const handleAccountModification = () => {
    if (modalValues.createButton === "Create") {
      createAccount();
    } else {
      accountUpdate();
    }

    close();
  };

  const openAccountAddModal = () => {
    setModalValues((prev) => ({
      ...prev,
      createButton: "Create",
    }));

    show();
  };

  const createAvatarUrl = async () => {
    const formData = new FormData();
    formData.append("file", avatarFile as File);

    const response = await postRequest({
      url: `${process.env.SERVER}/aws/s3/upload/avatar`,
      body: formData,
      credentials: "include",
      formData: true,
    });

    if (response.success) {
      return response.data.url as string;
    } else {
      console.log(response.data.error);
    }

    return DEFAULT_ACCOUNT_AVATAR;
  };

  const createAccount = async () => {
    const avatar = await createAvatarUrl();

    const response = await postRequest({
      url: `${process.env.SERVER}/api/accounts`,
      credentials: "include",
      body: {
        name: modalValues.name,
        position: "",
        avatar,
      },
    });

    if (response.success) {
      const fetchedAccount = response.data.account as AccountType;

      setAccounts((prev) => [...prev, getAccount(fetchedAccount)]);
    }
  };

  const openAccountEditModal = (account: AccountType) => {
    setModalValues({
      avatar: account.avatar,
      name: account.name,
      createButton: "Update",
      id: account.id,
    });

    show();
  };

  const accountUpdate = async () => {
    const updatedAccountValues = modalValues;

    if (avatarFile) {
      const basename = modalValues.avatar.split("/").pop();
      const filename = basename?.split("-")[1];

      if (filename !== avatarFile.name) {
        const avatar = await createAvatarUrl();
        updatedAccountValues.avatar = avatar;
      }
    }

    const response = await putRequest({
      url: `${process.env.SERVER}/api/accounts`,
      credentials: "include",
      body: {
        ...updatedAccountValues,
        accountId: updatedAccountValues.id,
      },
      expectedStatus: 201,
    });

    if (response.success) {
      setAccounts((prev) => [
        ...prev.map((acc) => {
          if (acc.id === updatedAccountValues.id) {
            const updatedAccount = {
              ...(response.data.account as AccountType),
              ...updatedAccountValues,
            };
            return getAccount(updatedAccount);
          }

          return acc;
        }),
      ]);
    } else {
      console.log(response.data.error);
    }
  };

  /**
   * @description closes the modal and resets the values
   */
  const handleAccountClose = () => {
    setModalValues((prev) => ({
      ...prev,
      avatar: "",
      name: "",
    }));

    setError({
      texts: [],
      show: false,
    });

    setAvatarFile(null);

    close();
  };

  const textRef = useRef<HTMLDivElement>(null);
  return (
    <Container
      grid={{ rows: "auto", cols: 1, gap: "16px" }}
      styles={{ padding: "8px" }}
    >
      <Modal>
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
              handleError={({ text, show }) =>
                setError({ texts: [text], show })
              }
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
                handleError={({ text, show }) =>
                  setError({ texts: [text], show })
                }
                setFile={setAvatarFile}
              />
              {error.show && (
                <Container noGrid>{error.texts.join("")}</Container>
              )}
            </>
          )}

          <Container styles={{ flexFlow: "column" }} gap="10px" noGrid flex>
            <Label size="large" styles={{ alignSelf: "flex-start" }}>
              Name
            </Label>
            <Input
              onChange={(event) =>
                setModalValues((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
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
      </Modal>

      {confirmPrompt}
      <Heading.h2
        styles={{ justifySelf: "start", padding: "8px" }}
        innerRef={textRef}
      >
        Accounts
      </Heading.h2>

      {accounts.map((account, index) => (
        <Container
          styles={{ alignItems: "flex-start" }}
          key={index}
          noGrid
          flex
        >
          <Account account={account} setAccount={handleSocialClick} />
          <Checkbox
            onChange={() => setActiveAccount(account)}
            size="medium"
            iconPosition="right"
            styles={{ alignItems: "flex-start", marginTop: "16px" }}
            checked={activeAccount?.id === account.id}
            tooltip={{
              children: "set as active account",
              preferredPosition: "left",
            }}
            shape="round"
            color="blue"
          />
          <Button
            onClick={() => openAccountEditModal(account)}
            icon={<Icons.EditIcon size="medium" />}
            styles={{ marginTop: "13px" }}
            tooltip={{
              children: "edit account",
              preferredPosition: "left",
            }}
            noBorder
          />
          <Button
            onClick={() =>
              handleAccountRemove(account.id).injectText(account.name)
            }
            icon={<Icons.RemoveIcon size="medium" />}
            styles={{ marginTop: "13px" }}
            tooltip={{
              children: "remove account",
              preferredPosition: "left",
            }}
            noBorder
          />
        </Container>
      ))}

      <Button
        onClick={openAccountAddModal}
        icon={<Icons.PlusIcon size="large" />}
        styles={{ alignSelf: "center" }}
        tooltip={{
          children: "add account",
          preferredPosition: "left",
        }}
        noBorder
      />
    </Container>
  );
};

export default Accounts;
