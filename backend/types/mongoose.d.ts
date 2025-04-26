// Extend the interface
import 'mongoose';

declare module 'mongoose' {
  interface Query<
    ResultType = any,
    DocType = any,
    THelpers = {},
    RawDocType = DocType,
    QueryOp = string,
    QueryType = unknown
  > {
    emCache(): this;
    useCache?: boolean;
  }
}
