import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Heading,
  Icons,
  hooks,
} from "@allaround/all-components";

import { deleteRequest, getRequest, postRequest } from "../utils";
import Account from "./Account";
import type { AccountType } from "./types";
import { getAccount } from "./utils";

const { useConfirm } = hooks;

const toggleEnabled = (name: string) => (social: any) => {
  if (social.name === name) {
    return {
      ...social,
      enabled: !social.enabled,
    };
  }

  return social;
};

const updateAccount =
  (name: string) => (id: string) => (account: AccountType) => {
    if (account.id === id) {
      return {
        ...account,
        socials: account.socials.map(toggleEnabled(name)),
      };
    }

    return account;
  };

const Accounts = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);

  const confirm1 = (arg1: string) => {
    console.log("confirmed 1" + arg1);
  };
  const confirm2 = () => {
    console.log("confirmed 2");
  };
  const [prompt1, confirmPrompt] = useConfirm(confirm1, {
    prompt: "Are you sure?",
    confirm: "Yes",
    cancel: "No",
  });
  const [prompt2] = useConfirm(confirm2, {
    prompt: "Are you sure?",
    confirm: "Yes",
    cancel: "No",
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

  const handleSocialClick = (id: string) => (name: string) => {
    // TODO: confirm
    setAccounts((prev) => [...prev.map(updateAccount(name)(id))]);
  };

  const handleAccountRemove = async (accountId: string) => {
    // TODO: confirm
    const response = await deleteRequest({
      url: `${process.env.SERVER}/api/accounts`,
      body: {
        accountId,
      },
      credentials: "include",
    });

    console.log(response.data);

    setAccounts((prev) => [...prev.filter((acc) => acc.id !== accountId)]);
  };

  const handleAccountAdd = async () => {
    const response = await postRequest({
      url: `${process.env.SERVER}/api/accounts`,
      credentials: "include",
      body: {
        name: "new account",
        position: "new position",
        avatar: "new avatar",
      },
    });

    if (response.success) {
      const fetchedAccount = response.data.account as AccountType;

      setAccounts((prev) => [...prev, getAccount(fetchedAccount)]);
    }
  };

  return (
    <Container
      grid={{ rows: "auto", cols: 1, gap: "16px" }}
      styles={{ padding: "10px" }}
    >
      {confirmPrompt}
      <Heading.h2>Accounts</Heading.h2>

      <button onClick={prompt1}>action 1</button>
      <button onClick={prompt2}>action 2</button>

      {accounts.map((account, index) => (
        <Container
          styles={{ alignItems: "flex-start" }}
          key={index}
          noGrid
          flex
        >
          <Account account={account} setAccount={handleSocialClick} />
          <Button
            onClick={() => handleAccountRemove(account.id)}
            icon={<Icons.RemoveIcon size="large" />}
            styles={{ padding: "10px 0 16px 12px" }}
            noBorder
          />
        </Container>
      ))}

      <Button
        onClick={handleAccountAdd}
        icon={<Icons.PlusIcon size="large" />}
        styles={{ alignSelf: "center" }}
        noBorder
      />
    </Container>
  );
};

export default Accounts;
