export enum FileTypes {
  FILE = "file",
  FOLDER = "folder",
}

export interface File {
  id: string;
  filename: string;
  absolutePath: string;
  parent: File;
  type: FileTypes;
  __typename: "File";
}
