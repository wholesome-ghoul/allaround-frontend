import { useState } from "react";
import {
  Button,
  Dropdown,
  Text,
  Checkbox,
  Image,
} from "@allaround/all-components";

import type { AccountProps } from "./types";

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
            icon={social.icon}
            variant={social.enabled ? "primary" : "secondary"}
            styles={{ padding: "3px" }}
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
            />
          </Button>
        </Dropdown.Item>
      ))}
    </Dropdown>
  );
};

export default Account;
