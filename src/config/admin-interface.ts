export const ChartColors: string[] = [
  "#f3a935",
  "#c73558",
  "#6ebe9f",
  "#2586a4",
  "#55596a",
  "#0f4032",
  "#8ebd6e",
  "#25848c",
  "#e9b941",
  "#cc5d26",
  "#316185",
  "#80b4cf",
  "#2c4554",
  "#eba82b",
  "#e96019",
  "#fff1c9",
  "#f7b7a3",
  "#ea5f89",
  "#9b3192",
  "#57167e",
  "#2b0b3f",
];
export enum AdminRequestType {
  Ban,
  Unban,
  CreateNotification,
  EditNotification,
  CreateMailTemplate,
  UpdateMailTemplate,
  Maintain,
}

export enum AdminRequestStatus {
  Pending,
  Approved,
  Rejected,
  Deleted,
}
export enum ConfigDataType {
  String,
  Number,
  Boolean,
  Date,
}
export enum CellDisplay {
  Text = "text",
  Number = "number",
  Date = "date",
  Image = "image",
  Switch = "switch",
  Enum = "enum",
  Entity = "entity",
  JSON = "json",
  Entities = "entities",
  ArrayString = "arraystring",
}
export interface GridColumn {
  label: string;
  field: string;
  display: CellDisplay;
  api?: string;
  sorter?: boolean;
  defaultSortOrder?: string;
  enumName?: string;
}
export interface Button {
  label: string;
  pageMode?: string;
  classes?: string;
  icon?: string;
  showInColumn?: string;
  action: "api" | "redirect";
  api?: string;
  redirectUrl?: string;
  redirectUrlEmbed?: object;
  popupData?: object;
  confirmText?: string;
  backOnAction?: boolean;
  position?: string;
}
export enum SchemaDataType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Array = "array",
  Object = "object",
}
export enum SchemaControl {
  Enum = "enum",
  Text = "text",
  TextArea = "textarea",
  Image = "image",
  ArrayImage = "arrayimage",
  Location = "location",
  RichText = "richtext",
  Password = "password",
  Captcha = "captcha",
  Label = "label",
  Step = "step",
  Entity = "entity",
  JSON = "json",
  Date = "date",
  TextArray = "textarray",
  Divider = "divider",
  CheckList = "checklist",
  Schema = "schema",
  Teacher = "teacher",
  Upload = "upload",
}
export interface FormControl {
  label: string;
  field: string;
  dataType: SchemaDataType;
  caption?: string;
  required: boolean;
  disabled: boolean;
  control: SchemaControl;
  enum: string;
  hideExpression?: object;
  requireExpression?: object;
  api: string;
  multiple?: boolean;
}
export interface EnumItem {
  value: string;
  label: string;
  classes?: string;
}
export interface SearchItem {
  label: string;
  field: string;
  type: "text" | "number" | "date";
  isRange: boolean;
  enum?: string;
  multiple?: boolean;
}
export interface Query {
  where?: any;
  offset?: number;
  limit?: number;
  include?: any[];
  payload?: any;
}

export class Form {
  name: string;
  label: string;
  api: string;
  buttons: Button[];
  controls: FormControl[];
}

export class Grid {
  name: string;
  label: string;
  api: string;
  buttons: Button[];
  columns: GridColumn[];
  filter: SearchItem[];
}

export class Enum {
  items: EnumItem[];
  value_type: "string" | "number";
  name: string;
}

export class Menu {
  name: string;
  url: string;
  sequence: number;
  icon: string;
  permissions: number[];
  parent_id: number;
}

export class Api {
  name: string;
  model: string;
  action: string;
  query: Query;
  permissions: number[];
  request_fields: string[];
  response_fields: string[];
}
