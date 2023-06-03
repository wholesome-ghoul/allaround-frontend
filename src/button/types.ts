type BaseProps = {
  className?: string;
};

type Props = BaseProps & {
  children?: React.ReactNode;
  size?: "small" | "medium" | "large";
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  icon?: React.ReactNode;
  transparent?: boolean;
  disabled?: boolean;
  active?: boolean;
}

export default Props
