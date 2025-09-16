import { useState } from 'react';
import { Server, Copy, Download, Plus, Trash2, Play } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

interface Resource {
  id: number;
  kind: string;
  metadata: Metadata;
  spec: any;
}

interface Metadata {
  name: string;
  namespace: string;
  labels: Label[];
  annotations: Label[];
}

interface Label {
  id: number;
  key: string;
  value: string;
}

interface Container {
  id: number;
  name: string;
  image: string;
  ports: ContainerPort[];
  env: EnvVar[];
  volumeMounts: VolumeMount[];
  resources: ResourceRequirements;
  command: string[];
  args: string[];
  imagePullPolicy: string;
}

interface ContainerPort {
  id: number;
  name: string;
  containerPort: string;
  protocol: string;
}

interface VolumeMount {
  id: number;
  name: string;
  mountPath: string;
  subPath: string;
  readOnly: boolean;
}

interface EnvVar {
  id: number;
  name: string;
  value: string;
  valueFrom: string;
}

interface ResourceRequirements {
  requests: ResourceList;
  limits: ResourceList;
}

interface ResourceList {
  cpu: string;
  memory: string;
  storage: string;
}

interface Volume {
  id: number;
  name: string;
  type: string;
  configMap: string;
  secret: string;
  persistentVolumeClaim: string;
  hostPath: string;
}

const resourceTypes = [
  'Deployment',
  'Service',
  'ConfigMap',
  'Secret',
  'Ingress',
  'PersistentVolume',
  'PersistentVolumeClaim',
  'StatefulSet',
  'DaemonSet',
  'Job',
  'CronJob',
  'ServiceAccount',
  'Role',
  'RoleBinding',
  'ClusterRole',
  'ClusterRoleBinding',
  'NetworkPolicy',
  'HorizontalPodAutoscaler'
];

const serviceTypes = [
  'ClusterIP',
  'NodePort',
  'LoadBalancer',
  'ExternalName'
];

const imagePullPolicies = [
  'Always',
  'IfNotPresent',
  'Never'
];

const protocols = [
  'TCP',
  'UDP',
  'SCTP'
];

const volumeTypes = [
  'emptyDir',
  'hostPath',
  'configMap',
  'secret',
  'persistentVolumeClaim',
  'nfs',
  'awsElasticBlockStore',
  'gcePersistentDisk',
  'azureDisk'
];

const popularImages = [
  { name: 'nginx', tag: 'alpine', description: 'Web server' },
  { name: 'mysql', tag: '8.0', description: 'MySQL database' },
  { name: 'postgres', tag: '15-alpine', description: 'PostgreSQL database' },
  { name: 'redis', tag: 'alpine', description: 'Redis cache' },
  { name: 'mongo', tag: 'latest', description: 'MongoDB database' },
  { name: 'node', tag: '18-alpine', description: 'Node.js runtime' },
  { name: 'python', tag: '3.11-slim', description: 'Python runtime' },
  { name: 'php', tag: 'fpm-alpine', description: 'PHP runtime' },
  { name: 'apache', tag: 'latest', description: 'Apache web server' },
  { name: 'traefik', tag: 'v3.0', description: 'Load balancer' },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Kubernetes YAML Generator",
  "description": "Generate Kubernetes YAML manifests with multiple resources, deployments, services, and configurations.",
  "url": "https://devtools-hub.com/kubernetes-yaml-generator",
  "applicationCategory": "DeveloperApplication",
  "featureList": [
    "Multi-resource Kubernetes manifest generation",
    "Deployment and service configuration",
    "ConfigMap and secret management",
    "Volume and storage configuration",
    "Export and download YAML files"
  ]
};

export default function KubernetesYamlGenerator() {
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      kind: 'Deployment',
      metadata: {
        name: 'app-deployment',
        namespace: 'default',
        labels: [{ id: 1, key: 'app', value: 'myapp' }],
        annotations: []
      },
      spec: {
        replicas: 3,
        selector: {
          matchLabels: { app: 'myapp' }
        },
        template: {
          metadata: {
            labels: { app: 'myapp' }
          },
          spec: {
            containers: [{
              id: 1,
              name: 'app',
              image: 'nginx:alpine',
              ports: [{ id: 1, name: 'http', containerPort: '80', protocol: 'TCP' }],
              env: [],
              volumeMounts: [],
              resources: {
                requests: { cpu: '100m', memory: '128Mi', storage: '' },
                limits: { cpu: '500m', memory: '512Mi', storage: '' }
              },
              command: [],
              args: [],
              imagePullPolicy: 'IfNotPresent'
            }],
            volumes: []
          }
        }
      }
    }
  ]);
  const [generatedYaml, setGeneratedYaml] = useState('');

  const addResource = () => {
    const newResource: Resource = {
      id: Date.now(),
      kind: 'Deployment',
      metadata: {
        name: '',
        namespace: 'default',
        labels: [],
        annotations: []
      },
      spec: {}
    };
    setResources([...resources, newResource]);
  };

  const removeResource = (id: number) => {
    setResources(resources.filter(resource => resource.id !== id));
  };

  const updateResource = (id: number, field: string, value: any) => {
    setResources(resources.map(resource =>
      resource.id === id ? { ...resource, [field]: value } : resource
    ));
  };

  const updateResourceMetadata = (id: number, field: string, value: any) => {
    setResources(resources.map(resource =>
      resource.id === id ? { 
        ...resource, 
        metadata: { ...resource.metadata, [field]: value }
      } : resource
    ));
  };

  const addLabel = (resourceId: number, type: 'labels' | 'annotations') => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      const newLabel: Label = { id: Date.now(), key: '', value: '' };
      updateResourceMetadata(resourceId, type, [...resource.metadata[type], newLabel]);
    }
  };

  const removeLabel = (resourceId: number, labelId: number, type: 'labels' | 'annotations') => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      updateResourceMetadata(resourceId, type, resource.metadata[type].filter(l => l.id !== labelId));
    }
  };

  const updateLabel = (resourceId: number, labelId: number, field: keyof Label, value: string, type: 'labels' | 'annotations') => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      const updatedLabels = resource.metadata[type].map(label =>
        label.id === labelId ? { ...label, [field]: value } : label
      );
      updateResourceMetadata(resourceId, type, updatedLabels);
    }
  };

  const addContainer = (resourceId: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const newContainer: Container = {
        id: Date.now(),
        name: '',
        image: '',
        ports: [],
        env: [],
        volumeMounts: [],
        resources: {
          requests: { cpu: '100m', memory: '128Mi', storage: '' },
          limits: { cpu: '500m', memory: '512Mi', storage: '' }
        },
        command: [],
        args: [],
        imagePullPolicy: 'IfNotPresent'
      };
      
      const updatedSpec = {
        ...resource.spec,
        template: {
          ...resource.spec.template,
          spec: {
            ...resource.spec.template.spec,
            containers: [...(resource.spec.template.spec.containers || []), newContainer]
          }
        }
      };
      updateResource(resourceId, 'spec', updatedSpec);
    }
  };

  const removeContainer = (resourceId: number, containerId: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const updatedSpec = {
        ...resource.spec,
        template: {
          ...resource.spec.template,
          spec: {
            ...resource.spec.template.spec,
            containers: resource.spec.template.spec.containers.filter((c: Container) => c.id !== containerId)
          }
        }
      };
      updateResource(resourceId, 'spec', updatedSpec);
    }
  };

  const updateContainer = (resourceId: number, containerId: number, field: keyof Container, value: any) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const updatedContainers = resource.spec.template.spec.containers.map((container: Container) =>
        container.id === containerId ? { ...container, [field]: value } : container
      );
      
      const updatedSpec = {
        ...resource.spec,
        template: {
          ...resource.spec.template,
          spec: {
            ...resource.spec.template.spec,
            containers: updatedContainers
          }
        }
      };
      updateResource(resourceId, 'spec', updatedSpec);
    }
  };

  const addContainerPort = (resourceId: number, containerId: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const container = resource.spec.template.spec.containers.find((c: Container) => c.id === containerId);
      if (container) {
        const newPort: ContainerPort = { id: Date.now(), name: '', containerPort: '', protocol: 'TCP' };
        updateContainer(resourceId, containerId, 'ports', [...container.ports, newPort]);
      }
    }
  };

  const removeContainerPort = (resourceId: number, containerId: number, portId: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const container = resource.spec.template.spec.containers.find((c: Container) => c.id === containerId);
      if (container) {
        updateContainer(resourceId, containerId, 'ports', container.ports.filter(p => p.id !== portId));
      }
    }
  };

  const updateContainerPort = (resourceId: number, containerId: number, portId: number, field: keyof ContainerPort, value: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const container = resource.spec.template.spec.containers.find((c: Container) => c.id === containerId);
      if (container) {
        const updatedPorts = container.ports.map(port =>
          port.id === portId ? { ...port, [field]: value } : port
        );
        updateContainer(resourceId, containerId, 'ports', updatedPorts);
      }
    }
  };

  const addContainerEnvVar = (resourceId: number, containerId: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const container = resource.spec.template.spec.containers.find((c: Container) => c.id === containerId);
      if (container) {
        const newEnvVar: EnvVar = { id: Date.now(), name: '', value: '', valueFrom: '' };
        updateContainer(resourceId, containerId, 'env', [...container.env, newEnvVar]);
      }
    }
  };

  const removeContainerEnvVar = (resourceId: number, containerId: number, envId: number) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const container = resource.spec.template.spec.containers.find((c: Container) => c.id === containerId);
      if (container) {
        updateContainer(resourceId, containerId, 'env', container.env.filter(e => e.id !== envId));
      }
    }
  };

  const updateContainerEnvVar = (resourceId: number, containerId: number, envId: number, field: keyof EnvVar, value: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.kind === 'Deployment') {
      const container = resource.spec.template.spec.containers.find((c: Container) => c.id === containerId);
      if (container) {
        const updatedEnvVars = container.env.map(envVar =>
          envVar.id === envId ? { ...envVar, [field]: value } : envVar
        );
        updateContainer(resourceId, containerId, 'env', updatedEnvVars);
      }
    }
  };

  const generateYaml = () => {
    let yaml = '';
    
    resources.forEach((resource, index) => {
      if (index > 0) yaml += '---\n';
      
      yaml += `apiVersion: ${getApiVersion(resource.kind)}\n`;
      yaml += `kind: ${resource.kind}\n`;
      yaml += `metadata:\n`;
      
      if (resource.metadata.name) {
        yaml += `  name: ${resource.metadata.name}\n`;
      }
      
      if (resource.metadata.namespace && resource.metadata.namespace !== 'default') {
        yaml += `  namespace: ${resource.metadata.namespace}\n`;
      }
      
      if (resource.metadata.labels.length > 0) {
        yaml += `  labels:\n`;
        resource.metadata.labels.forEach(label => {
          if (label.key && label.value) {
            yaml += `    ${label.key}: ${label.value}\n`;
          }
        });
      }
      
      if (resource.metadata.annotations.length > 0) {
        yaml += `  annotations:\n`;
        resource.metadata.annotations.forEach(annotation => {
          if (annotation.key && annotation.value) {
            yaml += `    ${annotation.key}: ${annotation.value}\n`;
          }
        });
      }
      
      yaml += generateResourceSpec(resource);
      yaml += '\n';
    });
    
    setGeneratedYaml(yaml);
  };

  const getApiVersion = (kind: string) => {
    const apiVersions: { [key: string]: string } = {
      'Deployment': 'apps/v1',
      'Service': 'v1',
      'ConfigMap': 'v1',
      'Secret': 'v1',
      'Ingress': 'networking.k8s.io/v1',
      'PersistentVolume': 'v1',
      'PersistentVolumeClaim': 'v1',
      'StatefulSet': 'apps/v1',
      'DaemonSet': 'apps/v1',
      'Job': 'batch/v1',
      'CronJob': 'batch/v1',
      'ServiceAccount': 'v1',
      'Role': 'rbac.authorization.k8s.io/v1',
      'RoleBinding': 'rbac.authorization.k8s.io/v1',
      'ClusterRole': 'rbac.authorization.k8s.io/v1',
      'ClusterRoleBinding': 'rbac.authorization.k8s.io/v1',
      'NetworkPolicy': 'networking.k8s.io/v1',
      'HorizontalPodAutoscaler': 'autoscaling/v2'
    };
    return apiVersions[kind] || 'v1';
  };

  const generateResourceSpec = (resource: Resource) => {
    let spec = 'spec:\n';
    
    if (resource.kind === 'Deployment') {
      spec += `  replicas: ${resource.spec.replicas || 1}\n`;
      spec += `  selector:\n`;
      spec += `    matchLabels:\n`;
      spec += `      app: ${resource.metadata.name}\n`;
      spec += `  template:\n`;
      spec += `    metadata:\n`;
      spec += `      labels:\n`;
      spec += `        app: ${resource.metadata.name}\n`;
      spec += `    spec:\n`;
      
      if (resource.spec.template?.spec?.containers) {
        spec += `      containers:\n`;
        resource.spec.template.spec.containers.forEach((container: Container) => {
          if (container.name) {
            spec += `      - name: ${container.name}\n`;
            if (container.image) {
              spec += `        image: ${container.image}\n`;
            }
            if (container.imagePullPolicy) {
              spec += `        imagePullPolicy: ${container.imagePullPolicy}\n`;
            }
            
            if (container.ports.length > 0) {
              spec += `        ports:\n`;
              container.ports.forEach(port => {
                if (port.containerPort) {
                  spec += `        - containerPort: ${port.containerPort}\n`;
                  if (port.name) {
                    spec += `          name: ${port.name}\n`;
                  }
                  if (port.protocol) {
                    spec += `          protocol: ${port.protocol}\n`;
                  }
                }
              });
            }
            
            if (container.env.length > 0) {
              spec += `        env:\n`;
              container.env.forEach(env => {
                if (env.name) {
                  spec += `        - name: ${env.name}\n`;
                  if (env.value) {
                    spec += `          value: "${env.value}"\n`;
                  }
                  if (env.valueFrom) {
                    spec += `          valueFrom: ${env.valueFrom}\n`;
                  }
                }
              });
            }
            
            if (container.resources.requests.cpu || container.resources.requests.memory || 
                container.resources.limits.cpu || container.resources.limits.memory) {
              spec += `        resources:\n`;
              if (container.resources.requests.cpu || container.resources.requests.memory) {
                spec += `          requests:\n`;
                if (container.resources.requests.cpu) {
                  spec += `            cpu: ${container.resources.requests.cpu}\n`;
                }
                if (container.resources.requests.memory) {
                  spec += `            memory: ${container.resources.requests.memory}\n`;
                }
              }
              if (container.resources.limits.cpu || container.resources.limits.memory) {
                spec += `          limits:\n`;
                if (container.resources.limits.cpu) {
                  spec += `            cpu: ${container.resources.limits.cpu}\n`;
                }
                if (container.resources.limits.memory) {
                  spec += `            memory: ${container.resources.limits.memory}\n`;
                }
              }
            }
          }
        });
      }
    } else if (resource.kind === 'Service') {
      if (resource.spec.type) {
        spec += `  type: ${resource.spec.type}\n`;
      }
      spec += `  selector:\n`;
      spec += `    app: ${resource.metadata.name}\n`;
      if (resource.spec.ports) {
        spec += `  ports:\n`;
        resource.spec.ports.forEach((port: any) => {
          spec += `  - port: ${port.port}\n`;
          if (port.targetPort) {
            spec += `    targetPort: ${port.targetPort}\n`;
          }
          if (port.nodePort) {
            spec += `    nodePort: ${port.nodePort}\n`;
          }
        });
      }
    } else if (resource.kind === 'ConfigMap') {
      if (resource.spec.data) {
        spec += `data:\n`;
        Object.entries(resource.spec.data).forEach(([key, value]) => {
          spec += `  ${key}: "${value}"\n`;
        });
      }
    } else if (resource.kind === 'Secret') {
      if (resource.spec.type) {
        spec += `type: ${resource.spec.type}\n`;
      }
      if (resource.spec.data) {
        spec += `data:\n`;
        Object.entries(resource.spec.data).forEach(([key, value]) => {
          spec += `  ${key}: ${value}\n`;
        });
      }
    }
    
    return spec;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedYaml);
      alert('Kubernetes YAML copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadYaml = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedYaml], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'kubernetes-manifests.yaml';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addImageFromPopular = (resourceId: number, containerId: number, image: string, tag: string) => {
    updateContainer(resourceId, containerId, 'image', `${image}:${tag}`);
  };

  return (
    <Layout>
      <SEO structuredData={structuredData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Server className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kubernetes YAML Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate Kubernetes YAML manifests with multiple resources, deployments, services, and configurations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Resources</h3>
                <button
                  onClick={addResource}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </button>
              </div>

              {resources.map((resource) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      value={resource.kind}
                      onChange={(e) => updateResource(resource.id, 'kind', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    >
                      {resourceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeResource(resource.id)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={resource.metadata.name}
                        onChange={(e) => updateResourceMetadata(resource.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="resource-name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Namespace</label>
                      <input
                        type="text"
                        value={resource.metadata.namespace}
                        onChange={(e) => updateResourceMetadata(resource.id, 'namespace', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="default"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600">Labels</label>
                        <button
                          onClick={() => addLabel(resource.id, 'labels')}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {resource.metadata.labels.map(label => (
                        <div key={label.id} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            value={label.key}
                            onChange={(e) => updateLabel(resource.id, label.id, 'key', e.target.value, 'labels')}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Key"
                          />
                          <input
                            type="text"
                            value={label.value}
                            onChange={(e) => updateLabel(resource.id, label.id, 'value', e.target.value, 'labels')}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Value"
                          />
                          <button
                            onClick={() => removeLabel(resource.id, label.id, 'labels')}
                            className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {resource.kind === 'Deployment' && (
                      <div>
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Replicas</label>
                          <input
                            type="number"
                            value={resource.spec.replicas || 1}
                            onChange={(e) => updateResource(resource.id, 'spec', { ...resource.spec, replicas: parseInt(e.target.value) })}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-600">Containers</label>
                            <button
                              onClick={() => addContainer(resource.id)}
                              className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {resource.spec.template?.spec?.containers?.map((container: Container) => (
                            <div key={container.id} className="border border-gray-200 rounded p-3 mb-3">
                              <div className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={container.name}
                                  onChange={(e) => updateContainer(resource.id, container.id, 'name', e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                  placeholder="Container name"
                                />
                                <button
                                  onClick={() => removeContainer(resource.id, container.id)}
                                  className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                <div>
                                  <input
                                    type="text"
                                    value={container.image}
                                    onChange={(e) => updateContainer(resource.id, container.id, 'image', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    placeholder="nginx:alpine"
                                  />
                                </div>
                                <div>
                                  <select
                                    value={container.imagePullPolicy}
                                    onChange={(e) => updateContainer(resource.id, container.id, 'imagePullPolicy', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  >
                                    {imagePullPolicies.map(policy => (
                                      <option key={policy} value={policy}>{policy}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="mb-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Popular Images</label>
                                <div className="grid grid-cols-4 gap-1">
                                  {popularImages.slice(0, 8).map(image => (
                                    <button
                                      key={`${image.name}-${image.tag}`}
                                      onClick={() => addImageFromPopular(resource.id, container.id, image.name, image.tag)}
                                      className="px-1 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors truncate"
                                      title={image.description}
                                    >
                                      {image.name}:{image.tag}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mb-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-xs font-medium text-gray-600">Ports</label>
                                  <button
                                    onClick={() => addContainerPort(resource.id, container.id)}
                                    className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                {container.ports.map(port => (
                                  <div key={port.id} className="flex gap-2 mb-1">
                                    <input
                                      type="text"
                                      value={port.name}
                                      onChange={(e) => updateContainerPort(resource.id, container.id, port.id, 'name', e.target.value)}
                                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                      placeholder="Port name"
                                    />
                                    <input
                                      type="text"
                                      value={port.containerPort}
                                      onChange={(e) => updateContainerPort(resource.id, container.id, port.id, 'containerPort', e.target.value)}
                                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                                      placeholder="80"
                                    />
                                    <select
                                      value={port.protocol}
                                      onChange={(e) => updateContainerPort(resource.id, container.id, port.id, 'protocol', e.target.value)}
                                      className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                                    >
                                      {protocols.map(protocol => (
                                        <option key={protocol} value={protocol}>{protocol}</option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => removeContainerPort(resource.id, container.id, port.id)}
                                      className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mb-2">
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-xs font-medium text-gray-600">Environment Variables</label>
                                  <button
                                    onClick={() => addContainerEnvVar(resource.id, container.id)}
                                    className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                {container.env.map(envVar => (
                                  <div key={envVar.id} className="flex gap-2 mb-1">
                                    <input
                                      type="text"
                                      value={envVar.name}
                                      onChange={(e) => updateContainerEnvVar(resource.id, container.id, envVar.id, 'name', e.target.value)}
                                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                      placeholder="ENV_NAME"
                                    />
                                    <input
                                      type="text"
                                      value={envVar.value}
                                      onChange={(e) => updateContainerEnvVar(resource.id, container.id, envVar.id, 'value', e.target.value)}
                                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                      placeholder="value"
                                    />
                                    <button
                                      onClick={() => removeContainerEnvVar(resource.id, container.id, envVar.id)}
                                      className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>

                              <div className="mb-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Resources</label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs text-gray-500">Requests</label>
                                    <div className="grid grid-cols-2 gap-3">
                                      <input
                                        type="text"
                                        value={container.resources.requests.cpu}
                                        onChange={(e) => updateContainer(resource.id, container.id, 'resources', {
                                          ...container.resources,
                                          requests: { ...container.resources.requests, cpu: e.target.value }
                                        })}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                        placeholder="100m"
                                      />
                                      <input
                                        type="text"
                                        value={container.resources.requests.memory}
                                        onChange={(e) => updateContainer(resource.id, container.id, 'resources', {
                                          ...container.resources,
                                          requests: { ...container.resources.requests, memory: e.target.value }
                                        })}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                        placeholder="128Mi"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs text-gray-500">Limits</label>
                                    <div className="grid grid-cols-2 gap-3">
                                      <input
                                        type="text"
                                        value={container.resources.limits.cpu}
                                        onChange={(e) => updateContainer(resource.id, container.id, 'resources', {
                                          ...container.resources,
                                          limits: { ...container.resources.limits, cpu: e.target.value }
                                        })}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                        placeholder="500m"
                                      />
                                      <input
                                        type="text"
                                        value={container.resources.limits.memory}
                                        onChange={(e) => updateContainer(resource.id, container.id, 'resources', {
                                          ...container.resources,
                                          limits: { ...container.resources.limits, memory: e.target.value }
                                        })}
                                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                        placeholder="512Mi"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resource.kind === 'Service' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Service Type</label>
                          <select
                            value={resource.spec.type || 'ClusterIP'}
                            onChange={(e) => updateResource(resource.id, 'spec', { ...resource.spec, type: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {serviceTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-600">Ports</label>
                            <button
                              onClick={() => {
                                const newPorts = [...(resource.spec.ports || []), { port: '', targetPort: '', nodePort: '' }];
                                updateResource(resource.id, 'spec', { ...resource.spec, ports: newPorts });
                              }}
                              className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {(resource.spec.ports || []).map((port: any, index: number) => (
                            <div key={index} className="flex gap-2 mb-1">
                              <input
                                type="text"
                                value={port.port}
                                onChange={(e) => {
                                  const updatedPorts = [...resource.spec.ports];
                                  updatedPorts[index] = { ...updatedPorts[index], port: e.target.value };
                                  updateResource(resource.id, 'spec', { ...resource.spec, ports: updatedPorts });
                                }}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                placeholder="Port"
                              />
                              <input
                                type="text"
                                value={port.targetPort}
                                onChange={(e) => {
                                  const updatedPorts = [...resource.spec.ports];
                                  updatedPorts[index] = { ...updatedPorts[index], targetPort: e.target.value };
                                  updateResource(resource.id, 'spec', { ...resource.spec, ports: updatedPorts });
                                }}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                placeholder="Target"
                              />
                              {resource.spec.type === 'NodePort' && (
                                <input
                                  type="text"
                                  value={port.nodePort}
                                  onChange={(e) => {
                                    const updatedPorts = [...resource.spec.ports];
                                    updatedPorts[index] = { ...updatedPorts[index], nodePort: e.target.value };
                                    updateResource(resource.id, 'spec', { ...resource.spec, ports: updatedPorts });
                                  }}
                                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                  placeholder="NodePort"
                                />
                              )}
                              <button
                                onClick={() => {
                                  const updatedPorts = resource.spec.ports.filter((_: any, i: number) => i !== index);
                                  updateResource(resource.id, 'spec', { ...resource.spec, ports: updatedPorts });
                                }}
                                className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resource.kind === 'ConfigMap' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium text-gray-600">Data</label>
                          <button
                            onClick={() => {
                              const newData = { ...resource.spec.data, '': '' };
                              updateResource(resource.id, 'spec', { ...resource.spec, data: newData });
                            }}
                            className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        {resource.spec.data && Object.entries(resource.spec.data).map(([key, value], index) => (
                          <div key={index} className="flex gap-2 mb-1">
                            <input
                              type="text"
                              value={key}
                              onChange={(e) => {
                                const newData = { ...resource.spec.data };
                                delete newData[key];
                                newData[e.target.value] = value;
                                updateResource(resource.id, 'spec', { ...resource.spec, data: newData });
                              }}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                              placeholder="Key"
                            />
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) => {
                                const newData = { ...resource.spec.data };
                                newData[key] = e.target.value;
                                updateResource(resource.id, 'spec', { ...resource.spec, data: newData });
                              }}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                              placeholder="Value"
                            />
                            <button
                              onClick={() => {
                                const newData = { ...resource.spec.data };
                                delete newData[key];
                                updateResource(resource.id, 'spec', { ...resource.spec, data: newData });
                              }}
                              className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {resource.kind === 'Secret' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                          <input
                            type="text"
                            value={resource.spec.type || 'Opaque'}
                            onChange={(e) => updateResource(resource.id, 'spec', { ...resource.spec, type: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Opaque"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-600">Data (Base64 encoded)</label>
                            <button
                              onClick={() => {
                                const newData = { ...resource.spec.data, '': '' };
                                updateResource(resource.id, 'spec', { ...resource.spec, data: newData });
                              }}
                              className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          {resource.spec.data && Object.entries(resource.spec.data).map(([key, value], index) => (
                            <div key={index} className="flex gap-2 mb-1">
                              <input
                                type="text"
                                value={key}
                                onChange={(e) => {
                                  const newData = { ...resource.spec.data };
                                  delete newData[key];
                                  newData[e.target.value] = value;
                                  updateResource(resource.id, 'spec', { ...resource.spec, data: newData });
                                }}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                placeholder="Key"
                              />
                              <input
                                type="text"
                                value={value as string}
                                onChange={(e) => {
                                  const newData = { ...resource.spec.data };
                                  newData[key] = e.target.value;
                                  updateResource(resource.id, 'spec', { ...resource.spec, data: newData });
                                }}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                placeholder="Base64 value"
                              />
                              <button
                                onClick={() => {
                                  const newData = { ...resource.spec.data };
                                  delete newData[key];
                                  updateResource(resource.id, 'spec', { ...resource.spec, data: newData });
                                }}
                                className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateYaml}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
              >
                <Play className="h-4 w-4 mr-2" />
                Generate YAML
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Generated YAML</h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!generatedYaml}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center disabled:opacity-50"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={downloadYaml}
                    disabled={!generatedYaml}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center disabled:opacity-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {generatedYaml || 'Click "Generate YAML" to see the output...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}