import { useState } from 'react';
import { Layers, Copy, Download, Plus, Trash2, Shuffle } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

interface Field {
  id: number;
  name: string;
  type: string;
  options: string;
}

const dataTypes = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'fullName', label: 'Full Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'address', label: 'Street Address' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'country', label: 'Country' },
  { value: 'zipCode', label: 'ZIP Code' },
  { value: 'company', label: 'Company Name' },
  { value: 'jobTitle', label: 'Job Title' },
  { value: 'department', label: 'Department' },
  { value: 'website', label: 'Website URL' },
  { value: 'avatar', label: 'Avatar URL' },
  { value: 'uuid', label: 'UUID' },
  { value: 'username', label: 'Username' },
  { value: 'password', label: 'Password' },
  { value: 'date', label: 'Date' },
  { value: 'dateTime', label: 'Date Time' },
  { value: 'pastDate', label: 'Past Date' },
  { value: 'futureDate', label: 'Future Date' },
  { value: 'age', label: 'Age' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'integer', label: 'Integer' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'price', label: 'Price' },
  { value: 'productName', label: 'Product Name' },
  { value: 'category', label: 'Category' },
  { value: 'color', label: 'Color' },
  { value: 'imageUrl', label: 'Image URL' },
  { value: 'description', label: 'Description' },
  { value: 'sentence', label: 'Sentence' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'words', label: 'Random Words' },
  { value: 'custom', label: 'Custom List' }
];

const outputFormats = [
  { value: 'json', label: 'JSON', ext: 'json' },
  { value: 'csv', label: 'CSV', ext: 'csv' },
  { value: 'sql', label: 'SQL Insert', ext: 'sql' },
  { value: 'xml', label: 'XML', ext: 'xml' },
  { value: 'yaml', label: 'YAML', ext: 'yaml' }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Mock Data Generator",
  "description": "Generate realistic mock data for testing, development, and prototyping. Support for multiple data types and export formats including JSON, CSV, SQL, XML, and YAML.",
  "url": "https://devtools-hub.com/mock-data-generator",
  "applicationCategory": "DeveloperApplication",
  "featureList": [
    "Multiple data types (names, emails, addresses, dates, etc.)",
    "Custom field definitions",
    "Bulk data generation",
    "Multiple export formats",
    "Realistic fake data"
  ]
};

export default function MockDataGenerator() {
  const [fields, setFields] = useState<Field[]>([
    { id: 1, name: 'id', type: 'integer', options: '' },
    { id: 2, name: 'firstName', type: 'firstName', options: '' },
    { id: 3, name: 'lastName', type: 'lastName', options: '' },
    { id: 4, name: 'email', type: 'email', options: '' },
    { id: 5, name: 'age', type: 'age', options: '' }
  ]);
  const [count, setCount] = useState(10);
  const [tableName, setTableName] = useState('users');
  const [outputFormat, setOutputFormat] = useState('json');
  const [generatedData, setGeneratedData] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley', 'Christopher', 'Amanda', 'Matthew', 'Stephanie', 'Joshua', 'Jennifer', 'Daniel', 'Elizabeth', 'Andrew', 'Samantha'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const companies = ['Tech Corp', 'Data Systems', 'Cloud Solutions', 'Digital Works', 'Smart Tech', 'Future Labs', 'Cyber Dynamics', 'Innovation Hub', 'NextGen Co', 'Alpha Technologies'];
  const jobTitles = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'Marketing Manager', 'Sales Representative', 'HR Specialist', 'Financial Analyst', 'Operations Manager', 'Customer Success Manager'];
  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Customer Success', 'Design', 'Legal'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'Brazil', 'India', 'Mexico'];
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown', 'Black', 'White'];
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Health', 'Beauty', 'Food', 'Automotive'];
  const productNames = ['Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'Coffee Mug', 'Desk Chair', 'Monitor', 'Keyboard', 'Mouse', 'Phone Case', 'Water Bottle'];

  const addField = () => {
    setFields([...fields, { id: Date.now(), name: '', type: 'firstName', options: '' }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: number, key: keyof Field, value: string | number) => {
    if (key === 'id') return;
    setFields(fields.map(field => 
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const generateValue = (type: string, options: string) => {
    const customList = options ? options.split(',').map(item => item.trim()) : [];
    
    switch (type) {
      case 'firstName':
        return firstNames[Math.floor(Math.random() * firstNames.length)];
      case 'lastName':
        return lastNames[Math.floor(Math.random() * lastNames.length)];
      case 'fullName':
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      case 'email':
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase();
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase();
        const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'];
        return `${firstName}.${lastName}@${domains[Math.floor(Math.random() * domains.length)]}`;
      case 'phone':
        return `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
      case 'address':
        return `${Math.floor(Math.random() * 9999 + 1)} ${['Main', 'Oak', 'Pine', 'Cedar', 'Elm', 'Washington', 'Lincoln', 'Jefferson'][Math.floor(Math.random() * 8)]} ${['St', 'Ave', 'Blvd', 'Dr', 'Ln'][Math.floor(Math.random() * 5)]}`;
      case 'city':
        return cities[Math.floor(Math.random() * cities.length)];
      case 'state':
        return states[Math.floor(Math.random() * states.length)];
      case 'country':
        return countries[Math.floor(Math.random() * countries.length)];
      case 'zipCode':
        return Math.floor(Math.random() * 90000 + 10000).toString();
      case 'company':
        return companies[Math.floor(Math.random() * companies.length)];
      case 'jobTitle':
        return jobTitles[Math.floor(Math.random() * jobTitles.length)];
      case 'department':
        return departments[Math.floor(Math.random() * departments.length)];
      case 'website':
        return `https://www.${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(' ', '')}.com`;
      case 'avatar':
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random().toString(36).substring(7)}`;
      case 'uuid':
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      case 'username':
        return `${firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()}${Math.floor(Math.random() * 999)}`;
      case 'password':
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let result = '';
        for (let i = 0; i < 12; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      case 'date':
        return new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0];
      case 'dateTime':
        return new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString();
      case 'pastDate':
        return new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      case 'futureDate':
        return new Date(Date.now() + Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      case 'age':
        return Math.floor(Math.random() * 60 + 18);
      case 'boolean':
        return Math.random() < 0.5;
      case 'integer':
        const min = options ? parseInt(options.split('-')[0]) || 1 : 1;
        const max = options ? parseInt(options.split('-')[1]) || 100 : 100;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      case 'decimal':
        return Math.round((Math.random() * 1000) * 100) / 100;
      case 'price':
        return Math.round((Math.random() * 1000 + 10) * 100) / 100;
      case 'productName':
        return productNames[Math.floor(Math.random() * productNames.length)];
      case 'category':
        return categories[Math.floor(Math.random() * categories.length)];
      case 'color':
        return colors[Math.floor(Math.random() * colors.length)];
      case 'imageUrl':
        return `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`;
      case 'description':
        const descriptions = [
          'High-quality product with excellent features and durability.',
          'Perfect for everyday use with modern design and functionality.',
          'Premium materials and craftsmanship for long-lasting performance.',
          'Innovative solution designed to meet your specific needs.',
          'Reliable and efficient with user-friendly interface.'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
      case 'sentence':
        const words = ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'and', 'runs', 'through', 'forest'];
        return Array.from({length: 8 + Math.floor(Math.random() * 5)}, () => words[Math.floor(Math.random() * words.length)]).join(' ') + '.';
      case 'paragraph':
        const sentences = [];
        for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
          const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod'];
          sentences.push(Array.from({length: 6 + Math.floor(Math.random() * 6)}, () => words[Math.floor(Math.random() * words.length)]).join(' ') + '.');
        }
        return sentences.join(' ');
      case 'words':
        const wordList = ['apple', 'banana', 'cherry', 'dog', 'elephant', 'forest', 'guitar', 'house'];
        return Array.from({length: 3 + Math.floor(Math.random() * 3)}, () => wordList[Math.floor(Math.random() * wordList.length)]).join(' ');
      case 'custom':
        return customList.length > 0 ? customList[Math.floor(Math.random() * customList.length)] : 'custom';
      default:
        return 'sample';
    }
  };

  const generateData = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const data = [];
      for (let i = 0; i < count; i++) {
        const row: Record<string, any> = {};
        fields.forEach(field => {
          if (field.name) {
            row[field.name] = generateValue(field.type, field.options);
          }
        });
        data.push(row);
      }

      let output = '';
      
      switch (outputFormat) {
        case 'json':
          output = JSON.stringify(data, null, 2);
          break;
        case 'csv':
          if (data.length > 0) {
            const headers = Object.keys(data[0]);
            output = headers.join(',') + '\n';
            output += data.map(row => headers.map(header => {
              const value = row[header];
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')).join('\n');
          }
          break;
        case 'sql':
          if (data.length > 0) {
            const headers = Object.keys(data[0]);
            output = `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES\n`;
            output += data.map(row => {
              const values = headers.map(header => {
                const value = row[header];
                if (typeof value === 'string') {
                  return `'${value.replace(/'/g, "''")}'`;
                }
                return value;
              });
              return `(${values.join(', ')})`;
            }).join(',\n') + ';';
          }
          break;
        case 'xml':
          output = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
          data.forEach((row, index) => {
            output += `  <item id="${index + 1}">\n`;
            Object.entries(row).forEach(([key, value]) => {
              output += `    <${key}>${value}</${key}>\n`;
            });
            output += `  </item>\n`;
          });
          output += '</data>';
          break;
        case 'yaml':
          output = data.map((row, index) => {
            let yamlItem = `- id: ${index + 1}\n`;
            Object.entries(row).forEach(([key, value]) => {
              yamlItem += `  ${key}: ${typeof value === 'string' ? `"${value}"` : value}\n`;
            });
            return yamlItem;
          }).join('');
          break;
      }

      setGeneratedData(output);
      setIsGenerating(false);
    }, 500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedData);
      alert('Data copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadData = () => {
    const format = outputFormats.find(f => f.value === outputFormat);
    const element = document.createElement('a');
    const file = new Blob([generatedData], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `mock-data.${format?.ext || 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadTemplate = (template: string) => {
    const templates = {
      users: [
        { id: Date.now(), name: 'id', type: 'integer', options: '1-1000' },
        { id: Date.now() + 1, name: 'firstName', type: 'firstName', options: '' },
        { id: Date.now() + 2, name: 'lastName', type: 'lastName', options: '' },
        { id: Date.now() + 3, name: 'email', type: 'email', options: '' },
        { id: Date.now() + 4, name: 'age', type: 'age', options: '' },
        { id: Date.now() + 5, name: 'phone', type: 'phone', options: '' }
      ],
      products: [
        { id: Date.now(), name: 'id', type: 'integer', options: '1-1000' },
        { id: Date.now() + 1, name: 'name', type: 'productName', options: '' },
        { id: Date.now() + 2, name: 'price', type: 'price', options: '' },
        { id: Date.now() + 3, name: 'category', type: 'category', options: '' },
        { id: Date.now() + 4, name: 'description', type: 'description', options: '' },
        { id: Date.now() + 5, name: 'image', type: 'imageUrl', options: '' }
      ],
      employees: [
        { id: Date.now(), name: 'id', type: 'integer', options: '1-1000' },
        { id: Date.now() + 1, name: 'fullName', type: 'fullName', options: '' },
        { id: Date.now() + 2, name: 'email', type: 'email', options: '' },
        { id: Date.now() + 3, name: 'jobTitle', type: 'jobTitle', options: '' },
        { id: Date.now() + 4, name: 'department', type: 'department', options: '' },
        { id: Date.now() + 5, name: 'company', type: 'company', options: '' }
      ]
    };

    setFields(templates[template as keyof typeof templates] || []);
  };

  return (
    <Layout>
      <SEO
        title="Mock Data Generator - Generate Realistic Test Data"
        description="Generate realistic mock data for testing, development, and prototyping. Support for multiple data types and export formats including JSON, CSV, SQL, XML, and YAML."
        keywords="mock data generator, fake data generator, test data generator, random data generator, JSON generator, CSV generator, API testing data"
        canonicalUrl="https://devtools-hub.com/mock-data-generator"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Layers className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mock Data Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate realistic mock data for testing, development, and prototyping. Create custom datasets with multiple data types and export in various formats.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Records
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {outputFormats.map(format => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {outputFormat === 'sql' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Name
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="users"
                />
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Field Configuration
                </label>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        loadTemplate(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    defaultValue=""
                  >
                    <option value="">Load Template</option>
                    <option value="users">Users</option>
                    <option value="products">Products</option>
                    <option value="employees">Employees</option>
                  </select>
                  <button
                    onClick={addField}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {fields.map((field) => (
                  <div key={field.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Field name"
                      />
                    </div>
                    <div className="col-span-3">
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, 'type', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {dataTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={field.options}
                        onChange={(e) => updateField(field.id, 'options', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder={field.type === 'custom' ? 'item1,item2,item3' : field.type === 'integer' ? '1-100' : 'Options'}
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeField(field.id)}
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={generateData}
              disabled={isGenerating || fields.length === 0}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center disabled:bg-gray-400"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Shuffle className="mr-2 h-5 w-5" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Mock Data'}
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Generated Data ({count} records)
              </label>
              {generatedData && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={downloadData}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md h-96 overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {generatedData || 'Configure your fields and click "Generate Mock Data" to see the output here...'}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Data Types</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Personal Data</h3>
              <p className="text-sm text-gray-600">Names, emails, phone numbers, addresses, and personal identifiers</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Business Data</h3>
              <p className="text-sm text-gray-600">Companies, job titles, departments, and professional information</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Dates & Numbers</h3>
              <p className="text-sm text-gray-600">Timestamps, ages, prices, integers, decimals, and boolean values</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Product Data</h3>
              <p className="text-sm text-gray-600">Product names, categories, descriptions, colors, and images</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Text Content</h3>
              <p className="text-sm text-gray-600">Sentences, paragraphs, random words, and custom text lists</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Web Data</h3>
              <p className="text-sm text-gray-600">URLs, usernames, passwords, UUIDs, and avatar images</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Export Formats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">JSON Format</h3>
              <p className="text-sm">Perfect for API testing, frontend development, and JavaScript applications.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">CSV Format</h3>
              <p className="text-sm">Excel-compatible format ideal for data analysis and spreadsheet imports.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">SQL Insert</h3>
              <p className="text-sm">Ready-to-execute SQL statements for database seeding and testing.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">XML & YAML</h3>
              <p className="text-sm">Structured formats for configuration files and data exchange.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}