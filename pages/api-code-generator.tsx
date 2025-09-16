import { useState } from 'react';
import { Code, Copy, Download, Play, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
interface Header {
  key: string;
  value: string;
  id: number;
}

interface FormField {
  key: string;
  value: string;
  id: number;
}

interface Language {
  id: string;
  name: string;
  ext: string;
}

const languages: Language[] = [
  { id: 'javascript', name: 'JavaScript (Fetch)', ext: 'js' },
  { id: 'typescript', name: 'TypeScript (Axios)', ext: 'ts' },
  { id: 'python', name: 'Python (Requests)', ext: 'py' },
  { id: 'curl', name: 'cURL', ext: 'sh' },
  { id: 'nodejs', name: 'Node.js (Native)', ext: 'js' },
  { id: 'php', name: 'PHP (cURL)', ext: 'php' },
  { id: 'go', name: 'Go (Net/HTTP)', ext: 'go' },
  { id: 'java', name: 'Java (OkHttp)', ext: 'java' },
  { id: 'ruby', name: 'Ruby (Net::HTTP)', ext: 'rb' },
];

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const contentTypes = [
  'application/json',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'text/plain',
  'application/xml',
  'text/html',
  'application/octet-stream'
];

const commonHeaders = [
  { name: 'Content-Type', value: 'application/json' },
  { name: 'Accept', value: 'application/json' },
  { name: 'Authorization', value: 'Bearer your-token-here' },
  { name: 'X-API-Key', value: 'your-api-key-here' },
  { name: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  { name: 'Accept-Language', value: 'en-US,en;q=0.9' },
  { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
  { name: 'Cache-Control', value: 'no-cache' },
  { name: 'Connection', value: 'keep-alive' },
  { name: 'Origin', value: 'https://yoursite.com' },
  { name: 'Referer', value: 'https://yoursite.com' },
  { name: 'X-Requested-With', value: 'XMLHttpRequest' },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Enhanced API Code Generator",
  "description": "Generate REST API client code in multiple programming languages including JavaScript, Python, Java, C#, Go, PHP, and Ruby with authentication support.",
  "url": "https://devtools-hub.com/api-code-generator",
  "applicationCategory": "DeveloperApplication",
  "featureList": [
    "Multi-language API client generation",
    "Support for all HTTP methods",
    "Multiple authentication types",
    "Custom headers and request bodies",
    "Copy and download generated code"
  ]
};

export default function EnhancedAPIGenerator() {
  const [url, setUrl] = useState('https://api.example.com/users');
  const [method, setMethod] = useState('GET');
  const [language, setLanguage] = useState('javascript');
  const [authType, setAuthType] = useState('none');
  const [authValue, setAuthValue] = useState('');
  const [showAuthValue, setShowAuthValue] = useState(false);
  const [bodyType, setBodyType] = useState('none');
  const [contentType, setContentType] = useState('application/json');
  const [customHeaders, setCustomHeaders] = useState<Header[]>([]);
  const [body, setBody] = useState('{\n  "name": "John Doe",\n  "email": "john@example.com"\n}');
  const [formData, setFormData] = useState<FormField[]>([{ key: 'name', value: 'John Doe', id: Date.now() }]);
  const [generatedCode, setGeneratedCode] = useState('');

  const addCustomHeader = () => {
    setCustomHeaders([...customHeaders, { key: '', value: '', id: Date.now() }]);
  };

  const addCommonHeader = (headerName: string) => {
    const commonHeader = commonHeaders.find(h => h.name === headerName);
    if (commonHeader) {
      setCustomHeaders([...customHeaders, { 
        key: commonHeader.name, 
        value: commonHeader.value, 
        id: Date.now() 
      }]);
    }
  };

  const removeCustomHeader = (id: number) => {
    setCustomHeaders(customHeaders.filter(header => header.id !== id));
  };

  const updateCustomHeader = (id: number, field: keyof Header, value: string) => {
    if (field === 'id') return; // Don't allow updating the id
    setCustomHeaders(customHeaders.map(header => 
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const addFormField = () => {
    setFormData([...formData, { key: '', value: '', id: Date.now() }]);
  };

  const removeFormField = (id: number) => {
    setFormData(formData.filter(field => field.id !== id));
  };

  const updateFormField = (id: number, field: keyof FormField, value: string) => {
    if (field === 'id') return; // Don't allow updating the id
    setFormData(formData.map(field_item => 
      field_item.id === id ? { ...field_item, [field]: value } : field_item
    ));
  };

  const getHeaders = () => {
    const headers: Record<string, string> = {};
    
    if (bodyType !== 'none' && bodyType !== 'form-data') {
      if (bodyType === 'form-urlencoded') {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        headers['Content-Type'] = contentType;
      }
    }
    
    if (authType === 'bearer' && authValue) {
      headers['Authorization'] = 'Bearer ' + authValue;
    } else if (authType === 'apikey' && authValue) {
      headers['X-API-Key'] = authValue;
    } else if (authType === 'basic' && authValue) {
      headers['Authorization'] = 'Basic ' + btoa(authValue);
    }
    
    customHeaders.forEach(header => {
      if (header.key && header.value) {
        headers[header.key] = header.value;
      }
    });
    
    return headers;
  };

  const getRequestBody = () => {
    if (bodyType === 'none') return null;
    if (bodyType === 'json') return body;
    if (bodyType === 'raw') return body;
    if (bodyType === 'form-urlencoded') {
      return formData.filter(f => f.key && f.value)
        .map(f => encodeURIComponent(f.key) + '=' + encodeURIComponent(f.value))
        .join('&');
    }
    if (bodyType === 'form-data') {
      return formData.filter(f => f.key && f.value);
    }
    return null;
  };

  // Filter out auth-related headers from common headers dropdown
  const getAvailableCommonHeaders = () => {
    const authHeaders = ['Authorization', 'X-API-Key'];
    return commonHeaders.filter(header => {
      // Hide auth headers if auth is already configured
      if (authType !== 'none' && authHeaders.includes(header.name)) {
        return false;
      }
      // Hide Content-Type if body type is set (it's handled automatically)
      if (bodyType !== 'none' && header.name === 'Content-Type') {
        return false;
      }
      return true;
    });
  };

  const generateCode = () => {
    const headers = getHeaders();
    const requestBody = getRequestBody();
    let code = '';

    switch (language) {
      case 'javascript':
        const headerLines = Object.entries(headers)
          .map(([key, value]) => `    '${key}': '${value}'`)
          .join(',\n');

        let jsCode = '';
        if (bodyType === 'form-data') {
          const formDataLines = formData
            .filter(f => f.key && f.value)
            .map(f => `formData.append('${f.key}', '${f.value}');`)
            .join('\n');
          jsCode += `const formData = new FormData();\n${formDataLines}\n\n`;
        }

        jsCode += `const response = await fetch('${url}', {\n  method: '${method}',\n  headers: {\n${headerLines}\n  }`;

        if (requestBody) {
          if (bodyType === 'json') {
            jsCode += `,\n  body: JSON.stringify(${body})`;
          } else if (bodyType === 'form-data') {
            jsCode += `,\n  body: formData`;
          } else {
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/'/g, "\\'") : JSON.stringify(requestBody);
            jsCode += `,\n  body: '${escapedBody}'`;
          }
        }

        jsCode += `\n});\n\nif (!response.ok) {\n  throw new Error(\`HTTP error! status: \${response.status}\`);\n}\n\nconst data = await response.json();\nconsole.log(data);`;
        code = jsCode;
        break;

      case 'typescript':
        const tsHeaderLines = Object.entries(headers)
          .map(([key, value]) => `    '${key}': '${value}'`)
          .join(',\n');

        let tsCode = `import axios, { AxiosResponse } from 'axios';\n\ninterface ApiResponse {\n  [key: string]: any;\n}\n\n`;

        if (bodyType === 'form-data') {
          const tsFormLines = formData
            .filter(f => f.key && f.value)
            .map(f => `formData.append('${f.key}', '${f.value}');`)
            .join('\n');
          tsCode += `const formData = new FormData();\n${tsFormLines}\n\n`;
        }

        tsCode += `try {\n  const response: AxiosResponse<ApiResponse> = await axios({\n    method: '${method.toLowerCase()}',\n    url: '${url}',\n    headers: {\n${tsHeaderLines}\n    }`;

        if (requestBody) {
          if (bodyType === 'json') {
            tsCode += `,\n    data: ${body}`;
          } else if (bodyType === 'form-data') {
            tsCode += `,\n    data: formData`;
          } else {
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/'/g, "\\'") : JSON.stringify(requestBody);
            tsCode += `,\n    data: '${escapedBody}'`;
          }
        }

        tsCode += `\n  });\n\n  console.log(response.data);\n} catch (error) {\n  console.error('Error:', error);\n}`;
        code = tsCode;
        break;

      case 'python':
        const pyHeaderLines = Object.entries(headers)
          .map(([key, value]) => `    '${key}': '${value}'`)
          .join(',\n');

        let pyCode = `import requests\nimport json\n\nheaders = {\n${pyHeaderLines}\n}\n\n`;

        if (bodyType === 'form-data') {
          const pyFormLines = formData
            .filter(f => f.key && f.value)
            .map(f => `    '${f.key}': '${f.value}'`)
            .join(',\n');
          pyCode += `files = {\n${pyFormLines}\n}\n\n`;
        } else if (requestBody) {
          if (bodyType === 'json') {
            pyCode += `data = ${body}\n\n`;
          } else {
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/'/g, "\\'") : JSON.stringify(requestBody);
            pyCode += `data = '${escapedBody}'\n\n`;
          }
        }

        pyCode += `try:\n    response = requests.${method.toLowerCase()}('${url}', headers=headers`;
        
        if (bodyType === 'form-data') {
          pyCode += `, files=files`;
        } else if (requestBody) {
          pyCode += bodyType === 'json' ? `, json=data` : `, data=data`;
        }
        
        pyCode += `)\n    response.raise_for_status()\n    print(response.json())\nexcept requests.exceptions.RequestException as e:\n    print(f"Error: {e}")`;
        code = pyCode;
        break;

      case 'curl':
        let curlCmd = `curl -X ${method} '${url}'`;
        Object.entries(headers).forEach(([key, value]) => {
          curlCmd += ` \\\\\n  -H '${key}: ${value}'`;
        });
        
        if (requestBody) {
          if (bodyType === 'form-data') {
            formData.filter(f => f.key && f.value).forEach(f => {
              curlCmd += ` \\\\\n  -F '${f.key}=${f.value}'`;
            });
          } else {
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/'/g, "\\'") : JSON.stringify(requestBody);
            curlCmd += ` \\\\\n  -d '${escapedBody}'`;
          }
        }
        code = curlCmd;
        break;

      case 'nodejs':
        const nodeHeaderLines = Object.entries(headers)
          .map(([key, value]) => `    '${key}': '${value}'`)
          .join(',\n');

        let nodeCode = `const https = require('https');\nconst http = require('http');\nconst url = require('url');\n`;
        
        if (bodyType === 'form-data') {
          nodeCode += `const FormData = require('form-data');\n`;
        }

        nodeCode += `\nconst parsedUrl = new URL('${url}');\nconst client = parsedUrl.protocol === 'https:' ? https : http;\n\n`;

        if (bodyType === 'form-data') {
          const nodeFormLines = formData
            .filter(f => f.key && f.value)
            .map(f => `form.append('${f.key}', '${f.value}');`)
            .join('\n');
          nodeCode += `const form = new FormData();\n${nodeFormLines}\n\n`;
        }

        nodeCode += `const options = {\n  hostname: parsedUrl.hostname,\n  port: parsedUrl.port,\n  path: parsedUrl.pathname + parsedUrl.search,\n  method: '${method}',\n  headers: {\n${nodeHeaderLines}`;
        
        if (bodyType === 'form-data') {
          nodeCode += `,\n    ...form.getHeaders()`;
        }
        
        nodeCode += `\n  }\n};\n\nconst req = client.request(options, (res) => {\n  let data = '';\n  res.on('data', (chunk) => {\n    data += chunk;\n  });\n  res.on('end', () => {\n    console.log(JSON.parse(data));\n  });\n});\n\nreq.on('error', (error) => {\n  console.error('Error:', error);\n});\n\n`;

        if (requestBody) {
          if (bodyType === 'form-data') {
            nodeCode += `form.pipe(req);`;
          } else {
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/'/g, "\\'") : JSON.stringify(requestBody);
            nodeCode += `req.write('${escapedBody}');\nreq.end();`;
          }
        } else {
          nodeCode += `req.end();`;
        }
        
        code = nodeCode;
        break;

      case 'php':
        const phpHeaderLines = Object.entries(headers)
          .map(([key, value]) => `    '${key}: ${value}'`)
          .join(',\n');

        let phpCode = `<?php\n\n$url = '${url}';\n$headers = [\n${phpHeaderLines}\n];\n\n$ch = curl_init();\ncurl_setopt($ch, CURLOPT_URL, $url);\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\ncurl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');\n`;

        if (requestBody) {
          if (bodyType === 'form-data') {
            const phpFormLines = formData
              .filter(f => f.key && f.value)
              .map(f => `    '${f.key}' => '${f.value}'`)
              .join(',\n');
            phpCode += `\n$postFields = [\n${phpFormLines}\n];\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);\n`;
          } else {
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/'/g, "\\'") : JSON.stringify(requestBody);
            phpCode += `\n$postData = '${escapedBody}';\ncurl_setopt($ch, CURLOPT_POSTFIELDS, $postData);\n`;
          }
        }

        phpCode += `\n$response = curl_exec($ch);\n\nif (curl_errno($ch)) {\n    echo 'Error: ' . curl_error($ch);\n} else {\n    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);\n    if ($httpCode >= 200 && $httpCode < 300) {\n        echo json_decode($response, true);\n    } else {\n        echo "HTTP Error: $httpCode";\n    }\n}\n\ncurl_close($ch);\n\n?>`;
        code = phpCode;
        break;

      case 'go':
        const goHeaderLines = Object.entries(headers)
          .map(([key, value]) => `\treq.Header.Set("${key}", "${value}")`)
          .join('\n');

        let goCode = `package main\n\nimport (\n\t"bytes"\n\t"encoding/json"\n\t"fmt"\n\t"io"\n\t"net/http"\n`;
        
        if (bodyType === 'form-data') {
          goCode += `\t"mime/multipart"\n\t"strings"\n`;
        }
        
        goCode += `)\n\nfunc main() {\n`;

        if (requestBody) {
          if (bodyType === 'form-data') {
            const goFormLines = formData
              .filter(f => f.key && f.value)
              .map(f => `\twriter.WriteField("${f.key}", "${f.value}")`)
              .join('\n');
            goCode += `\tvar buf bytes.Buffer\n\twriter := multipart.NewWriter(&buf)\n${goFormLines}\n\twriter.Close()\n\n\treq, err := http.NewRequest("${method}", "${url}", &buf)\n`;
          } else {
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/"/g, '\\"') : JSON.stringify(requestBody).replace(/"/g, '\\"');
            goCode += `\tpayload := strings.NewReader("${escapedBody}")\n\treq, err := http.NewRequest("${method}", "${url}", payload)\n`;
          }
        } else {
          goCode += `\treq, err := http.NewRequest("${method}", "${url}", nil)\n`;
        }

        goCode += `\tif err != nil {\n\t\tfmt.Println("Error creating request:", err)\n\t\treturn\n\t}\n\n${goHeaderLines}\n`;
        
        if (bodyType === 'form-data') {
          goCode += `\treq.Header.Set("Content-Type", writer.FormDataContentType())\n`;
        }

        goCode += `\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tfmt.Println("Error making request:", err)\n\t\treturn\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, err := io.ReadAll(resp.Body)\n\tif err != nil {\n\t\tfmt.Println("Error reading response:", err)\n\t\treturn\n\t}\n\n\tvar result map[string]interface{}\n\tjson.Unmarshal(body, &result)\n\tfmt.Println(result)\n}`;
        code = goCode;
        break;

      case 'java':
        const javaHeaderLines = Object.entries(headers)
          .map(([key, value]) => `        .header("${key}", "${value}")`)
          .join('\n');

        let javaCode = `import okhttp3.*;\nimport java.io.IOException;\n`;
        
        if (bodyType === 'form-data') {
          javaCode += `import java.util.concurrent.TimeUnit;\n`;
        }
        
        javaCode += `\npublic class ApiClient {\n    public static void main(String[] args) {\n        OkHttpClient client = new OkHttpClient();\n\n`;

        if (requestBody) {
          if (bodyType === 'form-data') {
            const javaFormLines = formData
              .filter(f => f.key && f.value)
              .map(f => `                .addFormDataPart("${f.key}", "${f.value}")`)
              .join('\n');
            javaCode += `        MultipartBody.Builder builder = new MultipartBody.Builder()\n                .setType(MultipartBody.FORM);\n${javaFormLines};\n        RequestBody body = builder.build();\n\n`;
          } else {
            const mediaType = bodyType === 'json' ? 'application/json' : contentType;
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/"/g, '\\"') : JSON.stringify(requestBody).replace(/"/g, '\\"');
            javaCode += `        MediaType mediaType = MediaType.parse("${mediaType}");\n        RequestBody body = RequestBody.create(mediaType, "${escapedBody}");\n\n`;
          }
        }

        javaCode += `        Request request = new Request.Builder()\n                .url("${url}")\n                .method("${method}", ${requestBody ? 'body' : 'null'})\n${javaHeaderLines}\n                .build();\n\n        try (Response response = client.newCall(request).execute()) {\n            if (response.isSuccessful()) {\n                System.out.println(response.body().string());\n            } else {\n                System.err.println("HTTP Error: " + response.code());\n            }\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n    }\n}`;
        code = javaCode;
        break;

      case 'ruby':
        const rubyHeaderLines = Object.entries(headers)
          .map(([key, value]) => `request['${key}'] = '${value}'`)
          .join('\n');

        let rubyCode = `require 'net/http'\nrequire 'json'\nrequire 'uri'\n\nuri = URI('${url}')\nhttp = Net::HTTP.new(uri.host, uri.port)\n`;
        
        if (url.startsWith('https')) {
          rubyCode += `http.use_ssl = true\n`;
        }
        
        rubyCode += `\nrequest = Net::HTTP::${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}.new(uri)\n${rubyHeaderLines}\n`;

        if (requestBody) {
          if (bodyType === 'form-data') {
            const rubyFormData = formData
              .filter(f => f.key && f.value)
              .map(f => `  '${f.key}' => '${f.value}'`)
              .join(',\n');
            rubyCode += `\nrequire 'net/http/post/multipart'\nrequest.set_form({\n${rubyFormData}\n}, 'multipart/form-data')\n`;
          } else {
            const escapedBody = typeof requestBody === 'string' ? requestBody.replace(/'/g, "\\'") : JSON.stringify(requestBody).replace(/'/g, "\\'");
            rubyCode += `\nrequest.body = '${escapedBody}'\n`;
          }
        }

        rubyCode += `\nbegin\n  response = http.request(request)\n  if response.code.to_i >= 200 && response.code.to_i < 300\n    puts JSON.parse(response.body)\n  else\n    puts "HTTP Error: #{response.code}"\n  end\nrescue => e\n  puts "Error: #{e.message}"\nend`;
        code = rubyCode;
        break;

      default:
        code = 'Language implementation not available';
    }

    setGeneratedCode(code);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadCode = () => {
    const selectedLang = languages.find(lang => lang.id === language);
    const element = document.createElement('a');
    const file = new Blob([generatedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `api-client.${selectedLang?.ext || 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <SEO 
        title="Enhanced API Code Generator"
        description="Generate REST API client code in multiple programming languages including JavaScript, Python, Java, C#, Go, PHP, and Ruby with authentication support."
        keywords="API code generator, REST API client, HTTP request code, JavaScript fetch, Python requests, API testing, code generator tool, multi-language API client"
        canonicalUrl="https://freedevtools.dev/api-code-generator"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Code className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Enhanced API Code Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate REST API client code in multiple programming languages with authentication, custom headers, and various body types.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://api.example.com/endpoint"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTTP Method
                </label>
                <select
                  value={method}
                  onChange={(e) => {
                    setMethod(e.target.value);
                    if (e.target.value === 'GET' || e.target.value === 'DELETE') {
                      setBodyType('none');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Authentication
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="apikey">API Key</option>
                  <option value="basic">Basic Auth</option>
                </select>
                
                {authType !== 'none' && (
                  <>
                    <div className="relative col-span-2">
                      <input
                        type={showAuthValue ? "text" : "password"}
                        value={authValue}
                        onChange={(e) => setAuthValue(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                        placeholder={authType === 'basic' ? 'username:password' : 'token/key'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthValue(!showAuthValue)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showAuthValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </>
                )}
              </div>
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
                    {getAvailableCommonHeaders().map(header => (
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

            {method !== 'GET' && method !== 'DELETE' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Type
                  </label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">No Body</option>
                    <option value="json">JSON</option>
                    <option value="raw">Raw Text</option>
                    <option value="form-data">Form Data</option>
                    <option value="form-urlencoded">URL Encoded</option>
                  </select>
                </div>

                {bodyType !== 'none' && bodyType !== 'form-data' && bodyType !== 'form-urlencoded' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {contentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                )}

                {(bodyType === 'json' || bodyType === 'raw') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Body
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      placeholder={bodyType === 'json' ? '{"key": "value"}' : 'Raw request body'}
                    />
                  </div>
                )}

                {(bodyType === 'form-data' || bodyType === 'form-urlencoded') && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Form Fields
                      </label>
                      <button
                        onClick={addFormField}
                        className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Field
                      </button>
                    </div>
                    {formData.map(field => (
                      <div key={field.id} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={field.key}
                          onChange={(e) => updateFormField(field.id, 'key', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Field name"
                        />
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => updateFormField(field.id, 'value', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Field value"
                        />
                        <button
                          onClick={() => removeFormField(field.id)}
                          className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <button
              onClick={generateCode}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Play className="mr-2 h-5 w-5" />
              Generate Code
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Generated Code
              </label>
              {generatedCode && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={downloadCode}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md min-h-96 overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {generatedCode || 'Configure your API request and click "Generate Code" to see the code here...'}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Languages & Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">JavaScript (Fetch)</h3>
              <p className="text-sm text-gray-600">Modern fetch API with async/await and proper error handling</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">TypeScript (Axios)</h3>
              <p className="text-sm text-gray-600">Type-safe HTTP client with comprehensive error handling</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Python (Requests)</h3>
              <p className="text-sm text-gray-600">Popular requests library with JSON support and exception handling</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Node.js (Native)</h3>
              <p className="text-sm text-gray-600">Built-in http/https modules with stream handling</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">PHP (cURL)</h3>
              <p className="text-sm text-gray-600">cURL with proper error handling and JSON decoding</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Go (Net/HTTP)</h3>
              <p className="text-sm text-gray-600">Standard net/http package with proper resource management</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Java (OkHttp)</h3>
              <p className="text-sm text-gray-600">Modern OkHttp client with try-with-resources pattern</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Ruby (Net::HTTP)</h3>
              <p className="text-sm text-gray-600">Built-in Net::HTTP with JSON parsing and HTTPS support</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">cURL Command</h3>
              <p className="text-sm text-gray-600">Command-line tool with all headers and body types</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Authentication Support</h3>
              <p className="text-sm">Bearer tokens, API keys, and Basic authentication with secure input handling.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Smart Header Management</h3>
              <p className="text-sm">Intelligent header suggestions that avoid conflicts with authentication and body types.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Multiple Body Types</h3>
              <p className="text-sm">Support for JSON, raw text, form data, and URL-encoded body formats.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Code Export</h3>
              <p className="text-sm">Copy to clipboard or download generated code in multiple programming languages.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}