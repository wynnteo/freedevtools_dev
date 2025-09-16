import Link from "next/link";
import { Code, GitBranch, Globe, Mail, Coffee, ArrowRight} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="h-6 w-6 text-gray-900" />
              <span className="font-bold text-lg text-gray-900">
                FreeDevTools Hub
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Professional developer workflow tools to accelerate your
              development process. Generate code, configurations, and workflows
              instantly.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tools</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/api-code-generator" className="hover:text-gray-900">
                  API Code Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/graphql-query-generator"
                  className="hover:text-gray-900"
                >
                  GraphQL Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/docker-compose-generator"
                  className="hover:text-gray-900"
                >
                  Docker Compose
                </Link>
              </li>
              <li>
                <Link
                  href="/github-actions-generator"
                  className="hover:text-gray-900"
                >
                  GitHub Actions
                </Link>
              </li>
              <li>
                <Link
                  href="/kubernetes-yaml-generator"
                  className="hover:text-gray-900"
                >
                  Kubernetes YAML
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/wynnteo/freedevtools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <GitBranch className="h-4 w-4" />
                <span className="flex items-center gap-1">
                  Star on GitHub
                  <ArrowRight className="h-3 w-3" />
                </span>
              </a>
              <a 
                href="https://cloudfullstack.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Globe className="h-4 w-4" />
                <span className="flex items-center gap-1">
                  Blog
                  <ArrowRight className="h-3 w-3" />
                </span>
              </a>
              <Link 
                href="/feedback"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Mail className="h-4 w-4" />
                <span>Contact Us</span>
              </Link>
              <a 
                href="https://ko-fi.com/wynnteo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Coffee className="h-4 w-4" />
                <span className="flex items-center gap-1">
                  Buy me a coffee
                  <ArrowRight className="h-3 w-3" />
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © 2025 FreeDevTools Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;