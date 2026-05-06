declare module 'react-native-sqlite-storage' {
  export type ResultSetRowList = {
    length: number;
    item: (index: number) => unknown;
  };

  export type ResultSet = {
    rows: ResultSetRowList;
  };

  export type SQLiteDatabase = {
    executeSql: (
      sqlStatement: string,
      args?: Array<string | number | null>,
    ) => Promise<[ResultSet]>;
  };

  const SQLite: {
    enablePromise: (enabled: boolean) => void;
    openDatabase: (params: {
      name: string;
      location: string;
    }) => Promise<SQLiteDatabase>;
  };

  export default SQLite;
}
