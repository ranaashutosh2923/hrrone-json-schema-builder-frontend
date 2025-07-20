import React, { useCallback, useMemo } from 'react';
import { Input, Select, Switch, Button, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { SchemaField as SchemaFieldType } from '../context/SchemaContext';

const { Option } = Select;

interface Props {
  field: SchemaFieldType;
  onUpdate: (field: SchemaFieldType) => void;
  onDelete: () => void;
  level: number;
}

const SchemaField: React.FC<Props> = ({ field, onUpdate, onDelete, level }) => {
  const handleNameChange = useCallback((value: string) => {
    onUpdate({ ...field, name: value });
  }, [field, onUpdate]);

  const handleTypeChange = useCallback((value: SchemaFieldType['type']) => {
    const updatedField = { 
      ...field, 
      type: value, 
      children: value === 'nested' ? [] : undefined 
    };
    onUpdate(updatedField);
  }, [field, onUpdate]);

  const handleRequiredChange = useCallback((checked: boolean) => {
    onUpdate({ ...field, required: checked });
  }, [field, onUpdate]);

  const handleChildUpdate = useCallback((index: number, updatedChild: SchemaFieldType) => {
    if (!field.children) return;
    const newChildren = [...field.children];
    newChildren[index] = updatedChild;
    onUpdate({ ...field, children: newChildren });
  }, [field, onUpdate]);

  const handleChildDelete = useCallback((index: number) => {
    if (!field.children) return;
    const newChildren = field.children.filter((_, i) => i !== index);
    onUpdate({ ...field, children: newChildren });
  }, [field, onUpdate]);

  const handleAddNestedChild = useCallback(() => {
    const newChild: SchemaFieldType = {
      id: nanoid(),
      name: `nest${(field.children?.length || 0) + 1}`,
      type: 'string',
      required: false
    };
    const newChildren = field.children ? [...field.children, newChild] : [newChild];
    onUpdate({ ...field, children: newChildren });
  }, [field, onUpdate]);

  const marginLeft = useMemo(() => level * 20, [level]);

  const fieldTypeOptions = useMemo(() => [
    { label: 'string', value: 'string' },
    { label: 'number', value: 'number' },
    { label: 'nested', value: 'nested' },
    { label: 'objectId', value: 'objectId' },
    { label: 'float', value: 'float' },
    { label: 'boolean', value: 'boolean' },
    { label: 'array', value: 'array' }
  ], []);

  return (
    <div style={{ marginLeft: `${marginLeft}px`, marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px 16px',
        backgroundColor: level === 0 ? '#fafafa' : '#f5f5f5',
        borderRadius: '8px',
        border: '1px solid #e8e8e8',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
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
          {fieldTypeOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Switch
            checked={field.required}
            onChange={handleRequiredChange}
            size="small"
          />
          <Tooltip title="Mark field as required">
            <InfoCircleOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} />
          </Tooltip>
        </div>
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
          borderRadius: '4px',
          padding: '12px'
        }}>
          {field.children?.map((child, index) => (
            <SchemaField
              key={child.id}
              field={child}
              onUpdate={(updatedChild) => handleChildUpdate(index, updatedChild)}
              onDelete={() => handleChildDelete(index)}
              level={level + 1}
            />
          ))}
          <Button
            type="primary"
            onClick={handleAddNestedChild}
            block
            style={{ 
              marginTop: '12px',
              backgroundColor: '#52c41a',
              borderColor: '#52c41a',
              height: '40px'
            }}
          >
            <PlusOutlined /> Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchemaField;