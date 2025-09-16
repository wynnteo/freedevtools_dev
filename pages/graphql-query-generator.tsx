import { useState } from 'react';
import { Database, Copy, Download, Play, Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

interface Variable {
  name: string;
  type: string;
  value: string;
  id: number;
}

interface Field {
  name: string;
  selected: boolean;
  type: string;
  args: Argument[];
  fields: Field[];
  id: number;
}

interface Argument {
  name: string;
  type: string;
  value: string;
  required: boolean;
  id: number;
}

interface Header {
  key: string;
  value: string;
  id: number;
}

const operationTypes = ['query', 'mutation', 'subscription'];

const scalarTypes = [
  'String', 'Int', 'Float', 'Boolean', 'ID',
  'String!', 'Int!', 'Float!', 'Boolean!', 'ID!',
  '[String]', '[Int]', '[Float]', '[Boolean]', '[ID]',
  '[String]!', '[Int]!', '[Float]!', '[Boolean]!', '[ID]!'
];

const commonHeaders = [
  { name: 'Authorization', value: 'Bearer your-token-here' },
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Accept', value: 'application/json' },
  { name: 'X-API-Key', value: 'your-api-key-here' },
  { name: 'User-Agent', value: 'GraphQL Client' },
  { name: 'Origin', value: 'https://yoursite.com' }
];

const sampleSchema = `type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post]
  createdAt: String
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  published: Boolean!
  createdAt: String
}

type Query {
  users: [User]
  user(id: ID!): User
  posts: [Post]
  post(id: ID!): Post
  searchPosts(query: String!): [Post]
}

type Mutation {
  createUser(name: String!, email: String!): User
  updateUser(id: ID!, name: String, email: String): User
  deleteUser(id: ID!): Boolean
  createPost(title: String!, content: String!, authorId: ID!): Post
  updatePost(id: ID!, title: String, content: String): Post
  deletePost(id: ID!): Boolean
}

type Subscription {
  postAdded: Post
  userAdded: User
}`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "GraphQL Query Generator",
  "description": "Build complex GraphQL queries, mutations, and subscriptions with intelligent schema introspection and auto-completion features.",
  "url": "https://devtools-hub.com/graphql-query-generator",
  "applicationCategory": "DeveloperApplication",
  "featureList": [
    "GraphQL query builder",
    "Schema introspection",
    "Mutation generator",
    "Subscription support",
    "Variable management",
    "Custom headers"
  ]
};

export default function GraphQLQueryGenerator() {
  const [endpoint, setEndpoint] = useState('https://api.example.com/graphql');
  const [operationType, setOperationType] = useState('query');
  const [operationName, setOperationName] = useState('MyQuery');
  const [schema, setSchema] = useState(sampleSchema);
  const [showSchema, setShowSchema] = useState(false);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [customHeaders, setCustomHeaders] = useState<Header[]>([]);
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [expandedFields, setExpandedFields] = useState<Set<number>>(new Set());

  const addVariable = () => {
    const newVar = { name: '', type: 'String', value: '', id: Date.now() + Math.random() };
    setVariables([...variables, newVar]);
  };

  const removeVariable = (id: number) => {
    setVariables(variables.filter(variable => variable.id !== id));
  };

  const updateVariable = (id: number, field: keyof Variable, value: string | number) => {
    if (field === 'id') return;
    setVariables(variables.map(variable => 
      variable.id === id ? { ...variable, [field]: value } : variable
    ));
  };

  const addCustomHeader = () => {
    const newHeader = { key: '', value: '', id: Date.now() + Math.random() };
    setCustomHeaders([...customHeaders, newHeader]);
  };

  const addCommonHeader = (headerName: string) => {
    const commonHeader = commonHeaders.find(h => h.name === headerName);
    if (commonHeader) {
      const newHeader = { 
        key: commonHeader.name, 
        value: commonHeader.value, 
        id: Date.now() + Math.random()
      };
      setCustomHeaders([...customHeaders, newHeader]);
    }
  };

  const removeCustomHeader = (id: number) => {
    setCustomHeaders(customHeaders.filter(header => header.id !== id));
  };

  const updateCustomHeader = (id: number, field: keyof Header, value: string | number) => {
    if (field === 'id') return;
    setCustomHeaders(customHeaders.map(header => 
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const parseSchema = () => {
    const fields: Field[] = [];
    const lines = schema.split('\n').filter(line => line.trim());
    let currentType = '';
    let currentFields: Field[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('type Query') || 
          trimmed.startsWith('type Mutation') || 
          trimmed.startsWith('type Subscription')) {
        if (currentFields.length > 0 && currentType) {
          if (currentType === operationType) {
            fields.push(...currentFields);
          }
        }
        currentType = trimmed.includes('Query') ? 'query' : 
                     trimmed.includes('Mutation') ? 'mutation' : 'subscription';
        currentFields = [];
      } else if (trimmed.includes(':') && !trimmed.startsWith('type') && currentType === operationType) {
        const fieldMatch = trimmed.match(/(\w+)(\([^)]*\))?\s*:\s*(.+)/);
        if (fieldMatch) {
          const [, name, argsStr, type] = fieldMatch;
          const args: Argument[] = [];
          
          if (argsStr) {
            const argMatches = argsStr.slice(1, -1).split(',');
            argMatches.forEach(arg => {
              const argMatch = arg.trim().match(/(\w+)\s*:\s*(.+)/);
              if (argMatch) {
                const [, argName, argType] = argMatch;
                args.push({
                  name: argName,
                  type: argType.trim(),
                  value: '',
                  required: argType.includes('!'),
                  id: Date.now() + Math.random()
                });
              }
            });
          }
          
          currentFields.push({
            name,
            selected: false,
            type: type.trim(),
            args,
            fields: [],
            id: Date.now() + Math.random()
          });
        }
      }
    });
    
    if (currentFields.length > 0 && currentType === operationType) {
      fields.push(...currentFields);
    }
    
    setSelectedFields(fields);
  };

  const toggleFieldSelection = (id: number) => {
    setSelectedFields(prevFields => 
      prevFields.map(field => 
        field.id === id ? { ...field, selected: !field.selected } : field
      )
    );
  };

  const updateFieldArg = (fieldId: number, argId: number, value: string) => {
    setSelectedFields(prevFields => 
      prevFields.map(field => 
        field.id === fieldId ? {
          ...field,
          args: field.args.map(arg => 
            arg.id === argId ? { ...arg, value } : arg
          )
        } : field
      )
    );
  };

  const toggleFieldExpansion = (id: number) => {
    setExpandedFields(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const generateQuery = () => {
    const selectedFieldsList = selectedFields.filter(field => field.selected);
    
    if (selectedFieldsList.length === 0) {
      setGeneratedQuery('# Please select at least one field to generate a query');
      return;
    }

    let query = '';
    const hasVariables = variables.some(v => v.name && v.type);
    
    if (hasVariables) {
      const variableDefinitions = variables
        .filter(v => v.name && v.type)
        .map(v => `$${v.name}: ${v.type}`)
        .join(', ');
      query += `${operationType} ${operationName}(${variableDefinitions}) {\n`;
    } else {
      query += `${operationType}${operationName ? ` ${operationName}` : ''} {\n`;
    }

    selectedFieldsList.forEach(field => {
      let fieldStr = `  ${field.name}`;
      
      if (field.args.some(arg => arg.value)) {
        const argStrs = field.args
          .filter(arg => arg.value)
          .map(arg => {
            const variable = variables.find(v => v.name === arg.value.replace('$', ''));
            return variable ? `${arg.name}: $${variable.name}` : `${arg.name}: ${arg.value}`;
          });
        
        if (argStrs.length > 0) {
          fieldStr += `(${argStrs.join(', ')})`;
        }
      }
      
      if (field.type.includes('User') || field.type.includes('Post') || 
          field.type.includes('[User]') || field.type.includes('[Post]')) {
        fieldStr += ` {\n    id\n    name\n  }`;
      }
      
      query += fieldStr + '\n';
    });

    query += '}';

    if (hasVariables && variables.some(v => v.name && v.value)) {
      query += '\n\n# Variables:\n{\n';
      variables
        .filter(v => v.name && v.value)
        .forEach(v => {
          const value = v.type.includes('String') ? `"${v.value}"` : v.value;
          query += `  "${v.name}": ${value},\n`;
        });
      query = query.replace(/,\n$/, '\n') + '}';
    }

    setGeneratedQuery(query);
  };

  const generateFetchCode = () => {
    const headers = customHeaders
      .filter(h => h.key && h.value)
      .reduce((acc: Record<string, string>, h) => {
        acc[h.key] = h.value;
        return acc;
      }, {});

    headers['Content-Type'] = 'application/json';

    const variablesObj = variables
      .filter(v => v.name && v.value)
      .reduce((acc: Record<string, any>, v) => {
        acc[v.name] = v.type.includes('String') ? v.value : 
                     v.type.includes('Int') || v.type.includes('Float') ? Number(v.value) :
                     v.type.includes('Boolean') ? v.value === 'true' : v.value;
        return acc;
      }, {});

    const queryOnly = generatedQuery.split('\n# Variables:')[0];

    const fetchCode = `const query = \`${queryOnly}\`;

const variables = ${JSON.stringify(variablesObj, null, 2)};

const response = await fetch('${endpoint}', {
  method: 'POST',
  headers: ${JSON.stringify(headers, null, 4)},
  body: JSON.stringify({
    query,${Object.keys(variablesObj).length > 0 ? '\n    variables' : ''}
  })
});

if (!response.ok) {
  throw new Error(\`HTTP error! status: \${response.status}\`);
}

const data = await response.json();

if (data.errors) {
  console.error('GraphQL errors:', data.errors);
} else {
  console.log('Data:', data.data);
}`;

    return fetchCode;
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadContent = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  return (
    <Layout>
      <SEO 
      title="GraphQL Query Generator"
      description="Build complex GraphQL queries, mutations, and subscriptions with intelligent schema introspection and auto-completion features. Perfect for API testing and development."
      keywords="graphql query builder, graphql generator, api testing, schema introspection, mutation generator, subscription builder, graphql tool"
      canonicalUrl="https://freedevtools.dev/graphql-query-generator"
      structuredData={structuredData}
    />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Database className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GraphQL Query Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build complex GraphQL queries, mutations, and subscriptions with intelligent schema introspection and auto-completion features.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GraphQL Endpoint
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://api.example.com/graphql"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operation Type
                </label>
                <select
                  value={operationType}
                  onChange={(e) => {
                    setOperationType(e.target.value);
                    setSelectedFields([]);
                    setGeneratedQuery('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {operationTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operation Name
                </label>
                <input
                  type="text"
                  value={operationName}
                  onChange={(e) => setOperationName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MyQuery"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  GraphQL Schema
                </label>
                <button
                  onClick={() => setShowSchema(!showSchema)}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors flex items-center"
                >
                  {showSchema ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showSchema ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showSchema && (
                <textarea
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Paste your GraphQL schema here..."
                />
              )}
              
              <button
                onClick={parseSchema}
                className="w-full mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Parse Schema
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Variables
                </label>
                <button
                  onClick={addVariable}
                  className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
              
              {variables.map(variable => (
                <div key={variable.id} className="grid grid-cols-12 gap-2 mb-2">
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                    className="col-span-4 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="name"
                  />
                  <select
                    value={variable.type}
                    onChange={(e) => updateVariable(variable.id, 'type', e.target.value)}
                    className="col-span-3 px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {scalarTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={variable.value}
                    onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                    className="col-span-4 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="value"
                  />
                  <button
                    onClick={() => removeVariable(variable.id)}
                    className="col-span-1 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Headers
                </label>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addCommonHeader(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    defaultValue=""
                  >
                    <option value="">Add Common</option>
                    {commonHeaders.map(header => (
                      <option key={header.name} value={header.name}>{header.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={addCustomHeader}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Custom
                  </button>
                </div>
              </div>
              
              {customHeaders.map(header => (
                <div key={header.id} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => updateCustomHeader(header.id, 'key', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Header name"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => updateCustomHeader(header.id, 'value', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Header value"
                  />
                  <button
                    onClick={() => removeCustomHeader(header.id)}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Available Fields
              </label>
              
              <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
                {selectedFields.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Parse schema to see available fields
                  </div>
                ) : (
                  selectedFields.map(field => (
                    <div key={field.id} className="border-b border-gray-100 last:border-b-0">
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.selected}
                              onChange={() => toggleFieldSelection(field.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-900">{field.name}</span>
                            <span className="text-xs text-gray-500">{field.type}</span>
                          </label>
                          
                          {field.args.length > 0 && (
                            <button
                              onClick={() => toggleFieldExpansion(field.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {expandedFields.has(field.id) ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </button>
                          )}
                        </div>
                        
                        {expandedFields.has(field.id) && field.args.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {field.args.map(arg => (
                              <div key={arg.id} className="flex items-center space-x-2">
                                <span className="text-xs text-gray-600 w-20">{arg.name}:</span>
                                <input
                                  type="text"
                                  value={arg.value}
                                  onChange={(e) => updateFieldArg(field.id, arg.id, e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                  placeholder={`${arg.type}${arg.required ? ' (required)' : ''}`}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={generateQuery}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Play className="mr-2 h-5 w-5" />
              Generate Query
            </button>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Generated Query
                </label>
                {generatedQuery && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(generatedQuery)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadContent(generatedQuery, 'query.graphql')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md min-h-64 overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {generatedQuery || 'Configure your query and click "Generate Query" to see the GraphQL query here...'}
                </pre>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Fetch Code
                </label>
                {generatedQuery && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(generateFetchCode())}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadContent(generateFetchCode(), 'graphql-client.js')}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-900 text-gray-100 p-4 rounded-md min-h-64 overflow-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {generatedQuery ? generateFetchCode() : 'Generated JavaScript fetch code will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Schema Introspection</h3>
              <p className="text-sm text-gray-600">Parse GraphQL schemas to automatically discover available fields, types, and arguments.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Visual Query Builder</h3>
              <p className="text-sm text-gray-600">Select fields with checkboxes and configure arguments through an intuitive interface.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Variable Management</h3>
              <p className="text-sm text-gray-600">Define and manage GraphQL variables with proper type checking and validation.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Operations</h3>
              <p className="text-sm text-gray-600">Support for queries, mutations, and subscriptions with operation naming.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Client Code Generation</h3>
              <p className="text-sm text-gray-600">Generate ready-to-use JavaScript fetch code with proper error handling.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Custom Headers</h3>
              <p className="text-sm text-gray-600">Add authentication and custom headers with common header presets.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Started</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Enter your GraphQL endpoint URL</li>
                <li>2. Choose your operation type (query, mutation, or subscription)</li>
                <li>3. Paste your GraphQL schema or use the sample</li>
                <li>4. Click "Parse Schema" to extract available fields</li>
                <li>5. Select the fields you want to include in your query</li>
                <li>6. Configure field arguments if needed</li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Advanced Features</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Add variables for dynamic queries</li>
                <li>2. Set up custom headers for authentication</li>
                <li>3. Generate the query and copy the result</li>
                <li>4. Use the generated fetch code in your application</li>
                <li>5. Download queries and code for later use</li>
                <li>6. Test different operation types and field combinations</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}