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
import type { AccountType, Social } from "./types";
import { getAccount, getSocialOauthUrl } from "./utils";

const { useConfirm } = hooks;

const toggleEnabled = (value: string) => (social: Social) => {
  if (social.value === value) {
    return {
      ...social,
      enabled: !social.enabled,
    };
  }

  return social;
};

const updateAccount =
  (value: string) => (id: string) => (account: AccountType) => {
    if (account.id === id) {
      return {
        ...account,
        socials: account.socials.map(toggleEnabled(value)),
      };
    }

    return account;
  };

const isSocialEnabled = (accountId: string, value: string) => {
  return (account: AccountType) => {
    if (account.id === accountId) {
      return account.socials.find((social) => social.value === value)?.enabled;
    }

    return false;
  };
};

const Accounts = () => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);

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
        console.log(response.data);
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
      styles={{ padding: "8px" }}
    >
      {confirmPrompt}
      <Heading.h2 styles={{ justifySelf: "start", padding: "8px" }}>
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
          <Button
            onClick={() => {}}
            icon={<Icons.EditIcon size="medium" />}
            styles={{ paddingTop: "14px" }}
            noBorder
          />
          <Button
            onClick={() =>
              handleAccountRemove(account.id).injectText(account.name)
            }
            icon={<Icons.RemoveIcon size="medium" />}
            styles={{ paddingTop: "14px" }}
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
