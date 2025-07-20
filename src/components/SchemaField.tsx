import React from 'react';
import { Input, Select, Switch, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { SchemaField as SchemaFieldType } from '../types/schema';

const { Option } = Select;

interface Props {
  field: SchemaFieldType;
  onUpdate: (field: SchemaFieldType) => void;
  onDelete: () => void;
  onAddChild: () => void;
  level: number;
}

const SchemaField: React.FC<Props> = ({ field, onUpdate, onDelete, onAddChild, level }) => {
  const handleNameChange = (value: string) => {
    onUpdate({ ...field, name: value });
  };

  const handleTypeChange = (value: any) => {
    onUpdate({ ...field, type: value, children: value === 'nested' ? [] : undefined });
  };

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({ ...field, required: checked });
  };

  const handleChildUpdate = (index: number, updatedChild: SchemaFieldType) => {
    if (!field.children) return;
    const newChildren = [...field.children];
    newChildren[index] = updatedChild;
    onUpdate({ ...field, children: newChildren });
  };

  const handleChildDelete = (index: number) => {
    if (!field.children) return;
    const newChildren = field.children.filter((_, i) => i !== index);
    onUpdate({ ...field, children: newChildren });
  };

  const handleAddNestedChild = () => {
    const newChild: SchemaFieldType = {
      id: `field_${Date.now()}_${Math.random()}`,
      name: `nest${(field.children?.length || 0) + 1}`,
      type: 'string',
      required: false
    };
    const newChildren = field.children ? [...field.children, newChild] : [newChild];
    onUpdate({ ...field, children: newChildren });
  };

  const marginLeft = level * 20;

  return (
    <div style={{ marginLeft: `${marginLeft}px`, marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '8px 12px',
        backgroundColor: level === 0 ? '#fafafa' : '#f5f5f5',
        borderRadius: '6px',
        border: '1px solid #e8e8e8'
      }}>
        <Input
          value={field.name}
          onChange={(e) => handleNameChange(e.target.value)}
          style={{ width: '160px' }}
          placeholder="Field name"
        />
        <Select
          value={field.type}
          onChange={handleTypeChange}
          style={{ width: '120px' }}
        >
          <Option value="string">string</Option>
          <Option value="number">number</Option>
          <Option value="nested">nested</Option>
          <Option value="objectId">objectId</Option>
          <Option value="float">float</Option>
          <Option value="boolean">boolean</Option>
          <Option value="array">array</Option>
        </Select>
        <Switch
          checked={field.required}
          onChange={handleRequiredChange}
          size="small"
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={onDelete}
          danger
          size="small"
          style={{ marginLeft: 'auto' }}
        />
      </div>

      {field.type === 'nested' && (
        <div style={{ 
          marginLeft: '20px', 
          marginTop: '12px',
          borderLeft: '3px solid #1890ff', 
          paddingLeft: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px'
        }}>
          {field.children?.map((child, index) => (
            <SchemaField
              key={child.id}
              field={child}
              onUpdate={(updatedChild) => handleChildUpdate(index, updatedChild)}
              onDelete={() => handleChildDelete(index)}
              onAddChild={() => {}}
              level={level + 1}
            />
          ))}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNestedChild}
            block
            style={{ 
              marginTop: '12px',
              backgroundColor: '#52c41a',
              borderColor: '#52c41a'
            }}
          >
            + Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchemaField;