type TpNode = React.ReactNode;

interface ILayout {
  children: TpNode;
}

interface IWrapper {
  children: TpNode;
  className?: string;
}

interface IFetchHook {
  data?: any;
  isLoading?: boolean | null | undefined | any;
  isError?: string | null | any;
  fn: (...args: any) => Promise<boolean>;
}
