import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { nanoid } from 'nanoid';

export interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'nested' | 'objectId' | 'float' | 'boolean' | 'array';
  required: boolean;
  children?: SchemaField[];
}

interface SchemaState {
  fields: SchemaField[];
}

type SchemaAction =
  | { type: 'ADD_FIELD' }
  | { type: 'UPDATE_FIELD'; payload: { index: number; field: SchemaField } }
  | { type: 'DELETE_FIELD'; payload: { index: number } }
  | { type: 'SET_FIELDS'; payload: { fields: SchemaField[] } };

const initialState: SchemaState = {
  fields: [
    {
      id: nanoid(),
      name: 'hno',
      type: 'number',
      required: false
    },
    {
      id: nanoid(),
      name: 'city',
      type: 'string',
      required: false
    },
    {
      id: nanoid(),
      name: 'pin',
      type: 'number',
      required: false
    }
  ]
};

const schemaReducer = (state: SchemaState, action: SchemaAction): SchemaState => {
  switch (action.type) {
    case 'ADD_FIELD': {
      const fieldCount = state.fields.length + 1;
      const newField: SchemaField = {
        id: nanoid(),
        name: `field${fieldCount}`,
        type: 'string',
        required: false
      };
      return {
        ...state,
        fields: [...state.fields, newField]
      };
    }
    case 'UPDATE_FIELD': {
      const newFields = [...state.fields];
      newFields[action.payload.index] = action.payload.field;
      return {
        ...state,
        fields: newFields
      };
    }
    case 'DELETE_FIELD': {
      const newFields = state.fields.filter((_, i) => i !== action.payload.index);
      return {
        ...state,
        fields: renameFields(newFields)
      };
    }
    case 'SET_FIELDS':
      return {
        ...state,
        fields: action.payload.fields
      };
    default:
      return state;
  }
};

const renameFields = (fields: SchemaField[]): SchemaField[] => {
  return fields.map((field, index) => {
    const updatedField = {
      ...field,
      name: field.name.startsWith('field') ? `field${index + 1}` : field.name,
    };
    if (field.children) {
      updatedField.children = renameFields(field.children);
    }
    return updatedField;
  });
};

interface SchemaContextValue {
  state: SchemaState;
  addField: () => void;
  updateField: (index: number, field: SchemaField) => void;
  deleteField: (index: number) => void;
}

const SchemaContext = createContext<SchemaContextValue | undefined>(undefined);

export const useSchema = () => {
  const context = useContext(SchemaContext);
  if (!context) {
    throw new Error('useSchema must be used within a SchemaProvider');
  }
  return context;
};

export const SchemaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(schemaReducer, initialState);

  const addField = () => {
    dispatch({ type: 'ADD_FIELD' });
  };

  const updateField = (index: number, field: SchemaField) => {
    dispatch({ type: 'UPDATE_FIELD', payload: { index, field } });
  };

  const deleteField = (index: number) => {
    dispatch({ type: 'DELETE_FIELD', payload: { index } });
  };

  const value = {
    state,
    addField,
    updateField,
    deleteField
  };

  return (
    <SchemaContext.Provider value={value}>
      {children}
    </SchemaContext.Provider>
  );
};