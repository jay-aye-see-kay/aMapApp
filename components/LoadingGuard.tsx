import { QueryResult } from "react-apollo";

type Props = {
  children: any;
  loading: boolean;
  error: QueryResult["error"];
};

export const LoadingGuard = ({ children, loading, error }: Props) => {
  if (loading) {
    return null; // TODO
  }

  if (error) {
    console.log('Apollo error', error);
    return null;
  }

  return children;
};

