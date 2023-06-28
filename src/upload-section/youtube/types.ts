type Option = {
  label: string;
  value: string | number;
};

type Category = {
  id: string;
  snippet: {
    title: string;
  };
};

export type { Option, Category };
