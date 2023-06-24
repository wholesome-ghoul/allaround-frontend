import { useState } from "react";
import {
  Button,
  Dropdown,
  Text,
  Checkbox,
  Image,
} from "@allaround/all-components";

import { SocialAccountMap, type AccountType } from "../utils";

type AccountProps = {
  account: AccountType;
  setAccount: (accountId: string, name: string) => any;
};

const Account = ({ account, setAccount }: AccountProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      text={account?.name}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      icon={
        <Image
          src={account?.avatar}
          width="36px"
          height="36px"
          objectFit="contain"
          inheritBorderColor
        />
      }
      styles={{ minWidth: "240px" }}
      paddedItemContainer={false}
      variant="secondary"
      dropperSize="large"
      marginedItem
      enableArrow
      fill
    >
      {account?.socials.map((social, index) => (
        <Dropdown.Item key={index} styles={{ paddingTop: "5px" }}>
          <Button
            onClick={() =>
              setAccount(account.id, social.value)
                .injectText(social.name)
                .skip(!social.enabled)
            }
            icon={SocialAccountMap[social.icon]}
            variant={social.enabled ? "primary" : "secondary"}
            styles={{ padding: "3px" }}
            tooltip={{
              children: "Enable or disable this social",
              preferredPosition: "top",
            }}
            fill
          >
            <Text size="small">{social.name}</Text>
            <Checkbox
              onChange={() => {}}
              size="small"
              iconPosition="right"
              styles={{ justifyContent: "flex-end" }}
              checked={social.enabled}
              text="Enabled"
              fill
            />
          </Button>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

export default Account;
