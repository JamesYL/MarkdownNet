export interface DocObject {
  title: string;
  desc: string;
  content: string;
  createdDate: Date;
  updatedDate: Date;
  path: string;
  fileType: string;
  priority: number;
}

export interface Metadata {
  title: string;
  desc: string;
  priority: number;
}
