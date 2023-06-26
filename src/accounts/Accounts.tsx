import { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Heading,
  Icons,
  hooks,
  Checkbox,
} from "@allaround/all-components";

import { deleteRequest, getRequest, postRequest, putRequest } from "../utils";
import type { AccountType } from "../utils";
import Account from "./Account";
import {
  getAccount,
  getSocialOauthUrl,
  isSocialEnabled,
  updateAccount,
  createAvatarUrl,
  Errors,
} from "./utils";
import Context from "../context";
import ModalContent, { ModalValues } from "./ModalContent";

const { useConfirm, useModal } = hooks;

const MODAL_DEFAULTS: ModalValues = {
  avatar: "",
  name: "",
  createButton: "Create",
  id: "",
};

const Accounts = () => {
  const { activeAccount, setActiveAccount } = useContext(Context.Account);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [modalValues, setModalValues] = useState<ModalValues>(MODAL_DEFAULTS);
  const setModalDefaults = () => {
    setErrors(Errors);
    setIsError(false);
    setModalValues(MODAL_DEFAULTS);
    setAvatarFile(null);
  };
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const { show, close, modal: Modal } = useModal({ onEsc: setModalDefaults });
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState<typeof Errors>(Errors);

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
            window.open(authUrl, "_blank");
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

          if (activeAccount?.id === id) {
            const updatedAccount = {
              ...activeAccount,
              [value]: false,
            };
            setActiveAccount(updatedAccount);
          }
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

        if (activeAccount?.id === accountId) {
          setActiveAccount(null);
        }
      }
    },
    {
      prompt: 'Are you sure you want to remove "#INJECT_NAME#"?',
      confirm: "Yes",
      cancel: "No",
      injectText: true,
    }
  );

  const handleAccountModification = async () => {
    let success = false;
    if (modalValues.createButton === "Create") {
      success = await createAccount();
    } else {
      success = await accountUpdate();
    }

    success && close(setModalDefaults);
  };

  const openAccountAddModal = () => {
    setModalValues((prev) => ({
      ...prev,
      createButton: "Create",
    }));

    show();
  };

  const createAccount = async () => {
    if (isError) return false;

    const avatar = await createAvatarUrl(avatarFile);

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

      return true;
    }

    return false;
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
    if (isError) return false;

    const updatedAccountValues = modalValues;

    if (avatarFile) {
      const basename = modalValues.avatar.split("/").pop();
      const filename = basename?.split("-")[1];

      if (filename !== avatarFile.name) {
        const avatar = await createAvatarUrl(avatarFile);
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

      if (activeAccount?.id === updatedAccountValues.id) {
        const updatedActiveAccount: AccountType = {
          ...activeAccount,
          name: updatedAccountValues.name,
          avatar: updatedAccountValues.avatar,
        };

        setActiveAccount(updatedActiveAccount);
      }

      return true;
    } else {
      console.log(response.data.error);
    }

    return false;
  };

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalValues((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  return (
    <Container
      grid={{ rows: "auto", cols: 1, gap: "16px" }}
      styles={{ padding: "8px" }}
    >
      <Modal>
        <ModalContent
          modalValues={modalValues}
          handleAccountNameChange={handleAccountNameChange}
          handleAccountModification={handleAccountModification}
          handleAccountClose={() => close(setModalDefaults)}
          avatarFile={avatarFile}
          setAvatarFile={setAvatarFile}
          setIsError={setIsError}
          setErrors={setErrors}
          errors={errors}
        />
      </Modal>

      {confirmPrompt}
      <Heading.h2 styles={{ justifySelf: "start", padding: "8px" }}>
        Accounts
      </Heading.h2>

      {accounts &&
        accounts.map((account, index) => (
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
          preferredPosition: "top",
        }}
        noBorder
      />
    </Container>
  );
};

export default Accounts;
