import { useState } from 'react';
import { GitBranch, Copy, Download, Plus, Trash2, Play, Settings, Code, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

interface Job {
  id: number;
  name: string;
  runsOn: string;
  needs: string[];
  if: string;
  steps: Step[];
  strategy: Strategy;
  env: EnvVar[];
  services: Service[];
  timeoutMinutes: string;
}

interface Step {
  id: number;
  name: string;
  uses: string;
  run: string;
  with: { [key: string]: string };
  env: { [key: string]: string };
  if: string;
  continueOnError: boolean;
  workingDirectory: string;
}

interface Strategy {
  matrix: { [key: string]: string[] };
  failFast: boolean;
  maxParallel: string;
}

interface Service {
  id: number;
  name: string;
  image: string;
  ports: string[];
  env: { [key: string]: string };
  options: string;
}

interface EnvVar {
  id: number;
  key: string;
  value: string;
}

interface Trigger {
  id: number;
  type: string;
  branches: string[];
  paths: string[];
  schedule: string;
}

const popularActions = [
  { name: 'actions/checkout', version: 'v4', description: 'Checkout repository' },
  { name: 'actions/setup-node', version: 'v4', description: 'Setup Node.js' },
  { name: 'actions/setup-python', version: 'v4', description: 'Setup Python' },
  { name: 'actions/setup-java', version: 'v4', description: 'Setup Java' },
  { name: 'actions/cache', version: 'v3', description: 'Cache dependencies' },
  { name: 'actions/upload-artifact', version: 'v3', description: 'Upload artifacts' },
  { name: 'actions/download-artifact', version: 'v3', description: 'Download artifacts' },
  { name: 'docker/setup-buildx-action', version: 'v3', description: 'Setup Docker Buildx' },
  { name: 'docker/login-action', version: 'v3', description: 'Docker login' },
  { name: 'docker/build-push-action', version: 'v5', description: 'Build and push Docker' },
];

const runnerTypes = [
  'ubuntu-latest',
  'ubuntu-22.04',
  'ubuntu-20.04',
  'windows-latest',
  'windows-2022',
  'windows-2019',
  'macos-latest',
  'macos-13',
  'macos-12',
  'self-hosted'
];

const triggerTypes = [
  'push',
  'pull_request',
  'schedule',
  'workflow_dispatch',
  'release',
  'issues',
  'pull_request_target',
  'repository_dispatch'
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "GitHub Actions Generator",
  "description": "Generate GitHub Actions YAML files with multiple jobs, triggers, and workflow configuration.",
  "url": "https://devtools-hub.com/github-actions-generator",
  "applicationCategory": "DeveloperApplication",
  "featureList": [
    "Multi-job GitHub Actions generation",
    "Workflow triggers configuration",
    "Matrix strategy and environment variables",
    "Popular actions integration",
    "Export and download YAML files"
  ]
};

export default function GitHubActionsGenerator() {
  const [workflowName, setWorkflowName] = useState('CI/CD Pipeline');
  const [triggers, setTriggers] = useState<Trigger[]>([
    { id: 1, type: 'push', branches: ['main'], paths: [], schedule: '' }
  ]);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      name: 'build',
      runsOn: 'ubuntu-latest',
      needs: [],
      if: '',
      steps: [
        {
          id: 1,
          name: 'Checkout code',
          uses: 'actions/checkout@v4',
          run: '',
          with: {},
          env: {},
          if: '',
          continueOnError: false,
          workingDirectory: ''
        }
      ],
      strategy: {
        matrix: {},
        failFast: true,
        maxParallel: ''
      },
      env: [],
      services: [],
      timeoutMinutes: ''
    }
  ]);
  const [generatedYaml, setGeneratedYaml] = useState('');

  const addTrigger = () => {
    const newTrigger: Trigger = {
      id: Date.now(),
      type: 'push',
      branches: [],
      paths: [],
      schedule: ''
    };
    setTriggers([...triggers, newTrigger]);
  };

  const removeTrigger = (id: number) => {
    setTriggers(triggers.filter(trigger => trigger.id !== id));
  };

  const updateTrigger = (id: number, field: keyof Trigger, value: any) => {
    setTriggers(triggers.map(trigger =>
      trigger.id === id ? { ...trigger, [field]: value } : trigger
    ));
  };

  const addJob = () => {
    const newJob: Job = {
      id: Date.now(),
      name: '',
      runsOn: 'ubuntu-latest',
      needs: [],
      if: '',
      steps: [],
      strategy: {
        matrix: {},
        failFast: true,
        maxParallel: ''
      },
      env: [],
      services: [],
      timeoutMinutes: ''
    };
    setJobs([...jobs, newJob]);
  };

  const removeJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const updateJob = (id: number, field: keyof Job, value: any) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  const addJobStep = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const newStep: Step = {
        id: Date.now(),
        name: '',
        uses: '',
        run: '',
        with: {},
        env: {},
        if: '',
        continueOnError: false,
        workingDirectory: ''
      };
      updateJob(jobId, 'steps', [...job.steps, newStep]);
    }
  };

  const removeJobStep = (jobId: number, stepId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      updateJob(jobId, 'steps', job.steps.filter(s => s.id !== stepId));
    }
  };

  const updateJobStep = (jobId: number, stepId: number, field: keyof Step, value: any) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const updatedSteps = job.steps.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      );
      updateJob(jobId, 'steps', updatedSteps);
    }
  };

  const addJobEnvVar = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const newEnvVar: EnvVar = { id: Date.now(), key: '', value: '' };
      updateJob(jobId, 'env', [...job.env, newEnvVar]);
    }
  };

  const removeJobEnvVar = (jobId: number, envId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      updateJob(jobId, 'env', job.env.filter(e => e.id !== envId));
    }
  };

  const updateJobEnvVar = (jobId: number, envId: number, field: keyof EnvVar, value: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const updatedEnvVars = job.env.map(envVar =>
        envVar.id === envId ? { ...envVar, [field]: value } : envVar
      );
      updateJob(jobId, 'env', updatedEnvVars);
    }
  };

  const addJobService = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const newService: Service = {
        id: Date.now(),
        name: '',
        image: '',
        ports: [],
        env: {},
        options: ''
      };
      updateJob(jobId, 'services', [...job.services, newService]);
    }
  };

  const removeJobService = (jobId: number, serviceId: number) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      updateJob(jobId, 'services', job.services.filter(s => s.id !== serviceId));
    }
  };

  const updateJobService = (jobId: number, serviceId: number, field: keyof Service, value: any) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      const updatedServices = job.services.map(service =>
        service.id === serviceId ? { ...service, [field]: value } : service
      );
      updateJob(jobId, 'services', updatedServices);
    }
  };

  const generateYaml = () => {
    let yaml = `name: ${workflowName}\n\n`;

    yaml += 'on:\n';
    triggers.forEach(trigger => {
      if (trigger.type === 'schedule') {
        yaml += `  ${trigger.type}:\n`;
        yaml += `    - cron: '${trigger.schedule}'\n`;
      } else if (trigger.type === 'workflow_dispatch') {
        yaml += `  ${trigger.type}:\n`;
      } else {
        yaml += `  ${trigger.type}:\n`;
        if (trigger.branches.length > 0) {
          yaml += `    branches:\n`;
          trigger.branches.forEach(branch => {
            yaml += `      - ${branch}\n`;
          });
        }
        if (trigger.paths.length > 0) {
          yaml += `    paths:\n`;
          trigger.paths.forEach(path => {
            yaml += `      - '${path}'\n`;
          });
        }
      }
    });

    yaml += '\njobs:\n';
    jobs.forEach(job => {
      if (!job.name) return;

      yaml += `  ${job.name}:\n`;
      yaml += `    runs-on: ${job.runsOn}\n`;

      if (job.timeoutMinutes) {
        yaml += `    timeout-minutes: ${job.timeoutMinutes}\n`;
      }

      if (job.needs.length > 0) {
        yaml += `    needs: [${job.needs.join(', ')}]\n`;
      }

      if (job.if) {
        yaml += `    if: ${job.if}\n`;
      }

      if (Object.keys(job.strategy.matrix).length > 0) {
        yaml += `    strategy:\n`;
        if (!job.strategy.failFast) {
          yaml += `      fail-fast: false\n`;
        }
        if (job.strategy.maxParallel) {
          yaml += `      max-parallel: ${job.strategy.maxParallel}\n`;
        }
        yaml += `      matrix:\n`;
        Object.entries(job.strategy.matrix).forEach(([key, values]) => {
          yaml += `        ${key}: [${values.join(', ')}]\n`;
        });
      }

      if (job.env.length > 0) {
        yaml += `    env:\n`;
        job.env.forEach(env => {
          if (env.key) {
            yaml += `      ${env.key}: ${env.value || ''}\n`;
          }
        });
      }

      if (job.services.length > 0) {
        yaml += `    services:\n`;
        job.services.forEach(service => {
          if (service.name) {
            yaml += `      ${service.name}:\n`;
            yaml += `        image: ${service.image}\n`;
            if (service.ports.length > 0) {
              yaml += `        ports:\n`;
              service.ports.forEach(port => {
                yaml += `          - ${port}\n`;
              });
            }
            if (Object.keys(service.env).length > 0) {
              yaml += `        env:\n`;
              Object.entries(service.env).forEach(([key, value]) => {
                yaml += `          ${key}: ${value}\n`;
              });
            }
            if (service.options) {
              yaml += `        options: ${service.options}\n`;
            }
          }
        });
      }

      yaml += `    steps:\n`;
      job.steps.forEach(step => {
        yaml += `      - name: ${step.name || 'Step'}\n`;

        if (step.uses) {
          yaml += `        uses: ${step.uses}\n`;
        }

        if (step.run) {
          yaml += `        run: ${step.run}\n`;
        }

        if (Object.keys(step.with).length > 0) {
          yaml += `        with:\n`;
          Object.entries(step.with).forEach(([key, value]) => {
            yaml += `          ${key}: ${value}\n`;
          });
        }

        if (Object.keys(step.env).length > 0) {
          yaml += `        env:\n`;
          Object.entries(step.env).forEach(([key, value]) => {
            yaml += `          ${key}: ${value}\n`;
          });
        }

        if (step.if) {
          yaml += `        if: ${step.if}\n`;
        }

        if (step.continueOnError) {
          yaml += `        continue-on-error: true\n`;
        }

        if (step.workingDirectory) {
          yaml += `        working-directory: ${step.workingDirectory}\n`;
        }
      });

      yaml += '\n';
    });

    setGeneratedYaml(yaml);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedYaml);
      alert('GitHub Actions YAML copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadYaml = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedYaml], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'workflow.yml';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addActionFromPopular = (jobId: number, stepId: number, action: string, version: string) => {
    updateJobStep(jobId, stepId, 'uses', `${action}@${version}`);
  };

  return (
    <Layout>
      <SEO structuredData={structuredData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GitBranch className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GitHub Actions Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate GitHub Actions YAML files with multiple jobs, triggers, and workflow configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CI/CD Pipeline"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Triggers</h3>
                <button
                  onClick={addTrigger}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Trigger
                </button>
              </div>

              {triggers.map((trigger) => (
                <div key={trigger.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      value={trigger.type}
                      onChange={(e) => updateTrigger(trigger.id, 'type', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                    >
                      {triggerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeTrigger(trigger.id)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {(trigger.type === 'push' || trigger.type === 'pull_request') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Branches</label>
                        <input
                          type="text"
                          value={trigger.branches.join(', ')}
                          onChange={(e) => updateTrigger(trigger.id, 'branches', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="main, develop"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Paths</label>
                        <input
                          type="text"
                          value={trigger.paths.join(', ')}
                          onChange={(e) => updateTrigger(trigger.id, 'paths', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="src/**, *.js"
                        />
                      </div>
                    </div>
                  )}

                  {trigger.type === 'schedule' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Cron Schedule</label>
                      <input
                        type="text"
                        value={trigger.schedule}
                        onChange={(e) => updateTrigger(trigger.id, 'schedule', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0 2 * * *"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Jobs</h3>
                <button
                  onClick={addJob}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Job
                </button>
              </div>

              {jobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      value={job.name}
                      onChange={(e) => updateJob(job.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                      placeholder="Job name"
                    />
                    <button
                      onClick={() => removeJob(job.id)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Runs On</label>
                      <select
                        value={job.runsOn}
                        onChange={(e) => updateJob(job.id, 'runsOn', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {runnerTypes.map(runner => (
                          <option key={runner} value={runner}>{runner}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Needs</label>
                      <input
                        type="text"
                        value={job.needs.join(', ')}
                        onChange={(e) => updateJob(job.id, 'needs', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="build, test"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Timeout (minutes)</label>
                      <input
                        type="text"
                        value={job.timeoutMinutes}
                        onChange={(e) => updateJob(job.id, 'timeoutMinutes', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="60"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">If condition</label>
                    <input
                      type="text"
                      value={job.if}
                      onChange={(e) => updateJob(job.id, 'if', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="github.ref == 'refs/heads/main'"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600">Environment Variables</label>
                        <button
                          onClick={() => addJobEnvVar(job.id)}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {job.env.map(env => (
                        <div key={env.id} className="flex gap-2 mb-1">
                          <input
                            type="text"
                            value={env.key}
                            onChange={(e) => updateJobEnvVar(job.id, env.id, 'key', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Key"
                          />
                          <input
                            type="text"
                            value={env.value}
                            onChange={(e) => updateJobEnvVar(job.id, env.id, 'value', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Value"
                          />
                          <button
                            onClick={() => removeJobEnvVar(job.id, env.id)}
                            className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600">Services</label>
                        <button
                          onClick={() => addJobService(job.id)}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {job.services.map(service => (
                        <div key={service.id} className="border border-gray-200 rounded p-2 mb-2">
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => updateJobService(job.id, service.id, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Service name"
                            />
                            <input
                              type="text"
                              value={service.image}
                              onChange={(e) => updateJobService(job.id, service.id, 'image', e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="postgres:13"
                            />
                            <button
                              onClick={() => removeJobService(job.id, service.id)}
                              className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={service.ports.join(', ')}
                              onChange={(e) => updateJobService(job.id, service.id, 'ports', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="5432:5432"
                            />
                            <input
                              type="text"
                              value={service.options}
                              onChange={(e) => updateJobService(job.id, service.id, 'options', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="--health-cmd pg_isready"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600">Steps</label>
                        <button
                          onClick={() => addJobStep(job.id)}
                          className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs hover:bg-green-200 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {job.steps.map(step => (
                        <div key={step.id} className="border border-gray-200 rounded p-2 mb-2">
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={step.name}
                              onChange={(e) => updateJobStep(job.id, step.id, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Step name"
                            />
                            <button
                              onClick={() => removeJobStep(job.id, step.id)}
                              className="px-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <input
                              type="text"
                              value={step.uses}
                              onChange={(e) => updateJobStep(job.id, step.id, 'uses', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="actions/checkout@v4"
                            />
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const [name, version] = e.target.value.split('@');
                                  updateJobStep(job.id, step.id, 'uses', `${name}@${version}`);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs mt-1"
                              defaultValue=""
                            >
                              <option value="">Popular actions...</option>
                              {popularActions.map(action => (
                                <option key={`${action.name}@${action.version}`} value={`${action.name}@${action.version}`}>
                                  {action.name}@{action.version} - {action.description}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <textarea
                              value={step.run}
                              onChange={(e) => updateJobStep(job.id, step.id, 'run', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="npm install && npm test"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generateYaml}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
          >
            <Play className="mr-2 h-5 w-5" />
            Generate GitHub Actions
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Generated GitHub Actions YAML
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
              {generatedYaml || 'Configure your workflow and click "Generate GitHub Actions" to see the YAML here...'}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular GitHub Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularActions.map(action => (
            <div key={`${action.name}@${action.version}`} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center mb-2">
                <Code className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">{action.name}@{action.version}</h3>
              </div>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <div className="flex items-center mb-2">
              <GitBranch className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold">Multi-Job Workflows</h3>
            </div>
            <p className="text-sm">Configure multiple jobs with dependencies, conditions, and parallel execution.</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <Zap className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold">Event Triggers</h3>
            </div>
            <p className="text-sm">Set up various triggers including push, pull requests, schedules, and manual dispatch.</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <Settings className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold">Matrix Strategies</h3>
            </div>
            <p className="text-sm">Configure matrix builds for testing across multiple environments and versions.</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <Code className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold">Popular Actions</h3>
            </div>
            <p className="text-sm">Quick access to commonly used GitHub Actions with version suggestions.</p>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}