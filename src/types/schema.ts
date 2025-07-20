export interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'nested' | 'objectId' | 'float' | 'boolean' | 'array';
  required: boolean;
  children?: SchemaField[];
}

export interface JsonOutput {
  [key: string]: any;
}