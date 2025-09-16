import Link from 'next/link';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { 
  Code, 
  Database, 
  Container, 
  GitBranch, 
  Server,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Layers
} from 'lucide-react';

const tools = [
  {
    id: 'api-code-generator',
    name: 'API Code Generator',
    description: 'Generate REST API code snippets, client libraries, and server endpoints for multiple programming languages including JavaScript, Python, Java, and more.',
    icon: Code,
    href: '/api-code-generator',
    keywords: 'API code generator, REST API generator, client library generator, endpoint generator'
  },
  {
    id: 'graphql-query-generator',
    name: 'GraphQL Query Generator',
    description: 'Build complex GraphQL queries, mutations, and subscriptions with intelligent schema introspection and auto-completion features.',
    icon: Database,
    href: '/graphql-query-generator',
    keywords: 'GraphQL query generator, GraphQL mutation builder, schema introspection, GraphQL playground'
  },
  {
    id: 'docker-compose-generator',
    name: 'Docker Compose Generator',
    description: 'Create production-ready Docker Compose configurations with service definitions, networking, volumes, and environment variables.',
    icon: Container,
    href: '/docker-compose-generator',
    keywords: 'Docker compose generator, containerization tool, microservices configuration, Docker YAML'
  },
  {
    id: 'github-actions-generator',
    name: 'GitHub Actions Generator',
    description: 'Build CI/CD workflows for GitHub Actions with pre-configured templates for testing, deployment, and automation pipelines.',
    icon: GitBranch,
    href: '/github-actions-generator',
    keywords: 'GitHub Actions generator, CI/CD pipeline, workflow automation, continuous integration'
  },
  {
    id: 'kubernetes-yaml-generator',
    name: 'Kubernetes YAML Generator',
    description: 'Generate Kubernetes manifests including deployments, services, ingress, configmaps, and secrets with best practice configurations.',
    icon: Server,
    href: '/kubernetes-yaml-generator',
    keywords: 'Kubernetes YAML generator, K8s manifest generator, deployment configuration, service mesh'
  },
  {
    id: 'mock-data-generator',
    name: 'Mock Data Generator',
    description: 'Create realistic mock data for testing and development purposes with customizable schemas and data types.',
    icon: Layers,
    href: '/mock-data-generator',
    keywords: 'mock data generator, test data creation, data schema generator, fake data tool'
  }
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate production-ready code and configurations in seconds, not hours.'
  },
  {
    icon: Shield,
    title: 'Best Practices',
    description: 'All generated code follows industry standards and security best practices.'
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Reduce development time by 70% with automated code generation tools.'
  }
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FreeDevTools Hub",
  "applicationCategory": "DeveloperApplication",
  "description": "Professional developer workflow tools for generating API code, GraphQL queries, Docker configurations, GitHub Actions, and Kubernetes YAML manifests.",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "API Code Generator",
    "GraphQL Query Generator", 
    "Docker Compose Generator",
    "GitHub Actions Workflow Generator",
    "Kubernetes YAML Generator",
    "Mock Data Generator"
  ]
};

export default function Home() {
  return (
    <Layout>
      <SEO
        title="Professional Developer Workflow Tools"
        description="Generate API code, GraphQL queries, Docker Compose, GitHub Actions workflows, and Kubernetes YAML configurations instantly. Free developer tools to accelerate your workflow."
        keywords="developer tools, API code generator, GraphQL generator, Docker compose generator, GitHub Actions generator, Kubernetes YAML generator, workflow automation, DevOps tools"
        canonicalUrl="https://freedevtools.dev"
        structuredData={structuredData}
      />

      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional Developer
              <span className="block text-blue-600">Workflow Tools</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate production-ready code, configurations, and workflows instantly. 
              Accelerate your development process with our suite of professional developer tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#tools" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center justify-center"
              >
                Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FreeDevTools Hub?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built by developers, for developers. Our tools are designed to streamline your workflow and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" id="tools">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Developer Workflow Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive suite of code generators and configuration tools to accelerate your development workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={tool.href}>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{tool.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{tool.description}</p>
                    <div className="flex items-center text-blue-600 font-medium text-sm">
                      Try Now <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Accelerate Your Development?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start using our professional developer tools today and experience the difference in your workflow efficiency.
          </p>
          <Link 
            href="#tools" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}