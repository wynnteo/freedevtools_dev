import { useState } from 'react';
import { Container, Copy, Download, Plus, Trash2, Play, Database, Globe, Lock } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

interface Service {
  id: number;
  name: string;
  image: string;
  ports: Port[];
  volumes: Volume[];
  environment: EnvVar[];
  networks: string[];
  dependsOn: string[];
  restart: string;
  command: string;
  workingDir: string;
  user: string;
}

interface Port {
  id: number;
  host: string;
  container: string;
}

interface Volume {
  id: number;
  host: string;
  container: string;
  mode: string;
}

interface EnvVar {
  id: number;
  key: string;
  value: string;
}

interface Network {
  id: number;
  name: string;
  driver: string;
  external: boolean;
}

interface VolumeConfig {
  id: number;
  name: string;
  driver: string;
  external: boolean;
}

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

const restartPolicies = [
  'no',
  'always',
  'on-failure',
  'unless-stopped'
];

const networkDrivers = [
  'bridge',
  'host',
  'overlay',
  'macvlan',
  'none'
];

const volumeDrivers = [
  'local',
  'nfs',
  'rexray',
  'convoy'
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Docker Compose Generator",
  "description": "Generate Docker Compose YAML files with multiple services, networks, and volumes configuration.",
  "url": "https://devtools-hub.com/docker-compose-generator",
  "applicationCategory": "DeveloperApplication",
  "featureList": [
    "Multi-service Docker Compose generation",
    "Network and volume configuration",
    "Environment variables management",
    "Port mapping and dependencies",
    "Export and download YAML files"
  ]
};

export default function DockerComposeGenerator() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'web',
      image: 'nginx:alpine',
      ports: [{ id: 1, host: '80', container: '80' }],
      volumes: [],
      environment: [],
      networks: [],
      dependsOn: [],
      restart: 'unless-stopped',
      command: '',
      workingDir: '',
      user: ''
    }
  ]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [volumes, setVolumes] = useState<VolumeConfig[]>([]);
  const [composeVersion, setComposeVersion] = useState('3.8');
  const [generatedYaml, setGeneratedYaml] = useState('');

  const addService = () => {
    const newService: Service = {
      id: Date.now(),
      name: '',
      image: '',
      ports: [],
      volumes: [],
      environment: [],
      networks: [],
      dependsOn: [],
      restart: 'unless-stopped',
      command: '',
      workingDir: '',
      user: ''
    };
    setServices([...services, newService]);
  };

  const removeService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
  };

  const updateService = (id: number, field: keyof Service, value: any) => {
    setServices(services.map(service =>
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const addServicePort = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const newPort: Port = { id: Date.now(), host: '', container: '' };
      updateService(serviceId, 'ports', [...service.ports, newPort]);
    }
  };

  const removeServicePort = (serviceId: number, portId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      updateService(serviceId, 'ports', service.ports.filter(p => p.id !== portId));
    }
  };

  const updateServicePort = (serviceId: number, portId: number, field: keyof Port, value: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const updatedPorts = service.ports.map(port =>
        port.id === portId ? { ...port, [field]: value } : port
      );
      updateService(serviceId, 'ports', updatedPorts);
    }
  };

  const addServiceVolume = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const newVolume: Volume = { id: Date.now(), host: '', container: '', mode: 'rw' };
      updateService(serviceId, 'volumes', [...service.volumes, newVolume]);
    }
  };

  const removeServiceVolume = (serviceId: number, volumeId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      updateService(serviceId, 'volumes', service.volumes.filter(v => v.id !== volumeId));
    }
  };

  const updateServiceVolume = (serviceId: number, volumeId: number, field: keyof Volume, value: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const updatedVolumes = service.volumes.map(volume =>
        volume.id === volumeId ? { ...volume, [field]: value } : volume
      );
      updateService(serviceId, 'volumes', updatedVolumes);
    }
  };

  const addServiceEnvVar = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const newEnvVar: EnvVar = { id: Date.now(), key: '', value: '' };
      updateService(serviceId, 'environment', [...service.environment, newEnvVar]);
    }
  };

  const removeServiceEnvVar = (serviceId: number, envId: number) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      updateService(serviceId, 'environment', service.environment.filter(e => e.id !== envId));
    }
  };

  const updateServiceEnvVar = (serviceId: number, envId: number, field: keyof EnvVar, value: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const updatedEnvVars = service.environment.map(envVar =>
        envVar.id === envId ? { ...envVar, [field]: value } : envVar
      );
      updateService(serviceId, 'environment', updatedEnvVars);
    }
  };

  const addNetwork = () => {
    const newNetwork: Network = {
      id: Date.now(),
      name: '',
      driver: 'bridge',
      external: false
    };
    setNetworks([...networks, newNetwork]);
  };

  const removeNetwork = (id: number) => {
    setNetworks(networks.filter(network => network.id !== id));
  };

  const updateNetwork = (id: number, field: keyof Network, value: any) => {
    setNetworks(networks.map(network =>
      network.id === id ? { ...network, [field]: value } : network
    ));
  };

  const addVolume = () => {
    const newVolume: VolumeConfig = {
      id: Date.now(),
      name: '',
      driver: 'local',
      external: false
    };
    setVolumes([...volumes, newVolume]);
  };

  const removeVolume = (id: number) => {
    setVolumes(volumes.filter(volume => volume.id !== id));
  };

  const updateVolume = (id: number, field: keyof VolumeConfig, value: any) => {
    setVolumes(volumes.map(volume =>
      volume.id === id ? { ...volume, [field]: value } : volume
    ));
  };

  const generateYaml = () => {
    let yaml = `version: '${composeVersion}'\n\nservices:\n`;
    
    services.forEach(service => {
      if (!service.name) return;
      
      yaml += `  ${service.name}:\n`;
      
      if (service.image) {
        yaml += `    image: ${service.image}\n`;
      }
      
      if (service.command) {
        yaml += `    command: ${service.command}\n`;
      }
      
      if (service.workingDir) {
        yaml += `    working_dir: ${service.workingDir}\n`;
      }
      
      if (service.user) {
        yaml += `    user: ${service.user}\n`;
      }
      
      if (service.ports.length > 0) {
        yaml += `    ports:\n`;
        service.ports.forEach(port => {
          if (port.host && port.container) {
            yaml += `      - "${port.host}:${port.container}"\n`;
          }
        });
      }
      
      if (service.volumes.length > 0) {
        yaml += `    volumes:\n`;
        service.volumes.forEach(volume => {
          if (volume.host && volume.container) {
            const mode = volume.mode !== 'rw' ? `:${volume.mode}` : '';
            yaml += `      - ${volume.host}:${volume.container}${mode}\n`;
          }
        });
      }
      
      if (service.environment.length > 0) {
        yaml += `    environment:\n`;
        service.environment.forEach(env => {
          if (env.key) {
            yaml += `      ${env.key}: ${env.value || ''}\n`;
          }
        });
      }
      
      if (service.networks.length > 0) {
        yaml += `    networks:\n`;
        service.networks.forEach(network => {
          yaml += `      - ${network}\n`;
        });
      }
      
      if (service.dependsOn.length > 0) {
        yaml += `    depends_on:\n`;
        service.dependsOn.forEach(dep => {
          yaml += `      - ${dep}\n`;
        });
      }
      
      if (service.restart) {
        yaml += `    restart: ${service.restart}\n`;
      }
      
      yaml += '\n';
    });
    
    if (networks.length > 0) {
      yaml += 'networks:\n';
      networks.forEach(network => {
        if (!network.name) return;
        yaml += `  ${network.name}:\n`;
        if (network.external) {
          yaml += `    external: true\n`;
        } else {
          yaml += `    driver: ${network.driver}\n`;
        }
      });
      yaml += '\n';
    }
    
    if (volumes.length > 0) {
      yaml += 'volumes:\n';
      volumes.forEach(volume => {
        if (!volume.name) return;
        yaml += `  ${volume.name}:\n`;
        if (volume.external) {
          yaml += `    external: true\n`;
        } else {
          yaml += `    driver: ${volume.driver}\n`;
        }
      });
    }
    
    setGeneratedYaml(yaml);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedYaml);
      alert('Docker Compose YAML copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadYaml = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedYaml], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'docker-compose.yml';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addImageFromPopular = (serviceId: number, image: string, tag: string) => {
    updateService(serviceId, 'image', `${image}:${tag}`);
  };

  return (
    <Layout>
      <SEO 
        title="Docker Compose Generator"
        description="Generate Docker Compose YAML files with multiple services, networks, and volumes configuration. Easy-to-use interface for creating production-ready Docker configurations."
        keywords="docker compose generator, docker compose yaml, container orchestration, docker services, docker networks, docker volumes, containerization tool"
        canonicalUrl="https://freedevtools.dev/docker-compose-generator"
        structuredData={structuredData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Container className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Docker Compose Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate Docker Compose YAML files with multiple services, networks, and volumes configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compose Version
              </label>
              <select
                value={composeVersion}
                onChange={(e) => setComposeVersion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3.8">3.8</option>
                <option value="3.7">3.7</option>
                <option value="3.6">3.6</option>
                <option value="3.5">3.5</option>
                <option value="3.4">3.4</option>
                <option value="3.3">3.3</option>
                <option value="3.2">3.2</option>
                <option value="3.1">3.1</option>
                <option value="3.0">3.0</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Services</h3>
                <button
                  onClick={addService}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service
                </button>
              </div>

              {services.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                      placeholder="Service name"
                    />
                    <button
                      onClick={() => removeService(service.id)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Image</label>
                      <input
                        type="text"
                        value={service.image}
                        onChange={(e) => updateService(service.id, 'image', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="nginx:alpine"
                      />
                      <div className="mt-1">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const [image, tag] = e.target.value.split(':');
                              addImageFromPopular(service.id, image, tag);
                              e.target.value = '';
                            }
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                          defaultValue=""
                        >
                          <option value="">Popular images...</option>
                          {popularImages.map(img => (
                            <option key={`${img.name}:${img.tag}`} value={`${img.name}:${img.tag}`}>
                              {img.name}:{img.tag} - {img.description}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Restart Policy</label>
                      <select
                        value={service.restart}
                        onChange={(e) => updateService(service.id, 'restart', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {restartPolicies.map(policy => (
                          <option key={policy} value={policy}>{policy}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Command</label>
                      <input
                        type="text"
                        value={service.command}
                        onChange={(e) => updateService(service.id, 'command', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="/bin/sh"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Working Dir</label>
                      <input
                        type="text"
                        value={service.workingDir}
                        onChange={(e) => updateService(service.id, 'workingDir', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="/app"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">User</label>
                      <input
                        type="text"
                        value={service.user}
                        onChange={(e) => updateService(service.id, 'user', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="1000:1000"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600">Ports</label>
                        <button
                          onClick={() => addServicePort(service.id)}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {service.ports.map(port => (
                        <div key={port.id} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            value={port.host}
                            onChange={(e) => updateServicePort(service.id, port.id, 'host', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Host"
                          />
                          <span className="self-center">:</span>
                          <input
                            type="text"
                            value={port.container}
                            onChange={(e) => updateServicePort(service.id, port.id, 'container', e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Container"
                          />
                          <button
                            onClick={() => removeServicePort(service.id, port.id)}
                            className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600">Volumes</label>
                        <button
                          onClick={() => addServiceVolume(service.id)}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {service.volumes.map(volume => (
                        <div key={volume.id} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            value={volume.host}
                            onChange={(e) => updateServiceVolume(service.id, volume.id, 'host', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Host path"
                          />
                          <span className="self-center">:</span>
                          <input
                            type="text"
                            value={volume.container}
                            onChange={(e) => updateServiceVolume(service.id, volume.id, 'container', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Container path"
                          />
                          <select
                            value={volume.mode}
                            onChange={(e) => updateServiceVolume(service.id, volume.id, 'mode', e.target.value)}
                            className="w-16 px-1 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="rw">rw</option>
                            <option value="ro">ro</option>
                          </select>
                          <button
                            onClick={() => removeServiceVolume(service.id, volume.id)}
                            className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600">Environment Variables</label>
                        <button
                          onClick={() => addServiceEnvVar(service.id)}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {service.environment.map(env => (
                        <div key={env.id} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            value={env.key}
                            onChange={(e) => updateServiceEnvVar(service.id, env.id, 'key', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Key"
                          />
                          <input
                            type="text"
                            value={env.value}
                            onChange={(e) => updateServiceEnvVar(service.id, env.id, 'value', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Value"
                          />
                          <button
                            onClick={() => removeServiceEnvVar(service.id, env.id)}
                            className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Networks
                  </h3>
                  <button
                    onClick={addNetwork}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
                {networks.map(network => (
                  <div key={network.id} className="border border-gray-200 rounded p-3 mb-2">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={network.name}
                        onChange={(e) => updateNetwork(network.id, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Network name"
                      />
                      <button
                        onClick={() => removeNetwork(network.id)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={network.driver}
                        onChange={(e) => updateNetwork(network.id, 'driver', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        disabled={network.external}
                      >
                        {networkDrivers.map(driver => (
                          <option key={driver} value={driver}>{driver}</option>
                        ))}
                      </select>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={network.external}
                          onChange={(e) => updateNetwork(network.id, 'external', e.target.checked)}
                          className="mr-1"
                        />
                        External
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Volumes
                  </h3>
                  <button
                    onClick={addVolume}
                    className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
                {volumes.map(volume => (
                  <div key={volume.id} className="border border-gray-200 rounded p-3 mb-2">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={volume.name}
                        onChange={(e) => updateVolume(volume.id, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Volume name"
                      />
                      <button
                        onClick={() => removeVolume(volume.id)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={volume.driver}
                        onChange={(e) => updateVolume(volume.id, 'driver', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        disabled={volume.external}
                      >
                        {volumeDrivers.map(driver => (
                          <option key={driver} value={driver}>{driver}</option>
                        ))}
                      </select>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={volume.external}
                          onChange={(e) => updateVolume(volume.id, 'external', e.target.checked)}
                          className="mr-1"
                        />
                        External
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={generateYaml}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Play className="mr-2 h-5 w-5" />
              Generate Docker Compose
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Generated Docker Compose YAML
              </label>
              {generatedYaml && (
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                  <button
                    onClick={downloadYaml}
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
                {generatedYaml || 'Configure your services and click "Generate Docker Compose" to see the YAML here...'}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Docker Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularImages.map(image => (
              <div key={`${image.name}:${image.tag}`} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center mb-2">
                  <Container className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">{image.name}:{image.tag}</h3>
                </div>
                <p className="text-sm text-gray-600">{image.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <div className="flex items-center mb-2">
                <Container className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold">Multi-Service Support</h3>
              </div>
              <p className="text-sm">Configure multiple Docker services with dependencies, networks, and volumes.</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Globe className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold">Network Configuration</h3>
              </div>
              <p className="text-sm">Create custom networks with different drivers and external network support.</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Database className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold">Volume Management</h3>
              </div>
              <p className="text-sm">Configure named volumes, bind mounts, and volume drivers for data persistence.</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <Lock className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold">Environment Variables</h3>
              </div>
              <p className="text-sm">Set environment variables for configuration and secrets management.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}