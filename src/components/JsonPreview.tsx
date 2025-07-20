import React from 'react';
import { Card } from 'antd';
import { SchemaField } from '../types/schema';

interface Props {
  fields: SchemaField[];
}

const JsonPreview: React.FC<Props> = ({ fields }) => {
  const generateJson = (fieldList: SchemaField[]): any => {
    const result: any = {};
    
    fieldList.forEach(field => {
      switch(field.type) {
        case 'string':
          result[field.name] = 'STRING';
          break;
        case 'number':
          result[field.name] = 'NUMBER';
          break;
        case 'float':
          result[field.name] = 'FLOAT';
          break;
        case 'boolean':
          result[field.name] = 'BOOLEAN';
          break;
        case 'objectId':
          result[field.name] = 'OBJECTID';
          break;
        case 'array':
          result[field.name] = 'ARRAY';
          break;
        case 'nested':
          if (field.children) {
            result[field.name] = generateJson(field.children);
          }
          break;
        default:
          result[field.name] = 'STRING';
      }
    });

    return result;
  };

  const jsonOutput = generateJson(fields);

  return (
    <Card 
      title="JSON Preview" 
      style={{ 
        height: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <pre style={{ 
        backgroundColor: '#2f3349', 
        color: '#a6accd',
        padding: '20px', 
        borderRadius: '8px',
        fontSize: '13px',
        overflow: 'auto',
        maxHeight: '500px',
        fontFamily: 'Consolas, Monaco, monospace'
      }}>
        {JSON.stringify(jsonOutput, null, 2)}
      </pre>
    </Card>
  );
};

export default JsonPreview;