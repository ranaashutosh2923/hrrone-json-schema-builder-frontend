import React, { useMemo } from 'react';
import { Card, Typography } from 'antd';
import { SchemaField } from '../context/SchemaContext';

const { Text } = Typography;

interface Props {
  fields: SchemaField[];
}

const JsonPreview: React.FC<Props> = ({ fields }) => {
  const jsonOutput = useMemo(() => {
    const generateJson = (fieldList: SchemaField[]): any => {
      if (fieldList.length === 0) return {};
      
      const result: any = {};
      
      fieldList.forEach(field => {
        switch(field.type) {
          case 'string':
            result[field.name] = "";
            break;
          case 'number':
            result[field.name] = 0;
            break;
          case 'float':
            result[field.name] = 0.0;
            break;
          case 'boolean':
            result[field.name] = false;
            break;
          case 'objectId':
            result[field.name] = "ObjectId('...')";
            break;
          case 'array':
            result[field.name] = [];
            break;
          case 'nested':
            result[field.name] = field.children ? generateJson(field.children) : {};
            break;
          default:
            result[field.name] = null;  // Default null assignment
        }
      });

      return result;
    };

    return generateJson(fields);
  }, [fields]);

  const formattedJson = useMemo(() => {
    return JSON.stringify(jsonOutput, null, 2);
  }, [jsonOutput]);

  const syntaxHighlight = useMemo(() => {
    let json = formattedJson;
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
    return json;
  }, [formattedJson]);

  return (
    <Card 
      title="JSON Preview" 
      style={{ 
        height: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      extra={
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Real-time preview
        </Text>
      }
    >
      <style>
        {`
          .json-key { color: #92c5f8; font-weight: bold; }
          .json-string { color: #a8cc8c; }
          .json-number { color: #d19a66; }
          .json-boolean { color: #c678dd; }
          .json-null { color: #e06c75; }
        `}
      </style>
      <div style={{ 
        backgroundColor: '#1e1e1e', 
        color: '#d4d4d4',
        padding: '20px', 
        borderRadius: '8px',
        fontSize: '14px',
        overflow: 'auto',
        maxHeight: '500px',
        fontFamily: 'Fira Code, Consolas, Monaco, Courier New, monospace',
        lineHeight: '1.8',
        border: '1px solid #333',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        <div dangerouslySetInnerHTML={{ __html: syntaxHighlight }} />
      </div>
    </Card>
  );
};

export default JsonPreview;