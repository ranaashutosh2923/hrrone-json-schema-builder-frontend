import React from 'react';
import { Layout, Row, Col, Button, Card, Typography } from 'antd';
import { PlusOutlined, CodeOutlined } from '@ant-design/icons';
import SchemaField from './components/SchemaField';
import JsonPreview from './components/JsonPreview';
import { useSchema } from './context/SchemaContext';
import './App.css';

const { Content, Header } = Layout;
const { Title } = Typography;

function App() {
  const { state, addField, updateField, deleteField } = useSchema();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: 'linear-gradient(90deg, #1890ff 0%, #52c41a 100%)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <CodeOutlined style={{ fontSize: '24px', color: 'white', marginRight: '12px' }} />
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          JSON Schema Builder
        </Title>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Card 
              title="Schema Configuration" 
              style={{ 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '8px'
              }}
            >
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {state.fields.map((field, index) => (
                  <SchemaField
                    key={field.id}
                    field={field}
                    onUpdate={(updatedField) => updateField(index, updatedField)}
                    onDelete={() => deleteField(index)}
                    level={0}
                  />
                ))}
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={addField}
                block
                size="large"
                style={{ 
                  marginTop: '20px',
                  height: '48px',
                  fontSize: '16px',
                  background: 'linear-gradient(90deg, #1890ff 0%, #52c41a 100%)',
                  border: 'none'
                }}
              >
                Add Item
              </Button>
            </Card>
          </Col>
          <Col span={12}>
            <JsonPreview fields={state.fields} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;