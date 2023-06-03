import cx from "classnames";

import Props from "./types";
import styles from "./style.module.scss";
import StyledButton from "./StyledButton";

const Button = ({
  children,
  size,
  onClick,
  transparent,
  disabled,
  active,
  className,
}: Props) => {
  return (
    <StyledButton
      className={cx(
        styles.button,
        styles[`${size}Button`],
        {
          [styles.transparent]: transparent,
          [styles.disabled]: disabled,
          [styles.active]: active,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

Button.defaultProps = {
  size: "small",
  transparent: false,
  disabled: false,
  active: false,
};

export default Button;
