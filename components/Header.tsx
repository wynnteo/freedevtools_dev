import Link from "next/link";
import { Code, Menu, X } from "lucide-react";
import { useState } from "react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tools = [
    { name: "API Code Generator", href: "/api-code-generator" },
    { name: "GraphQL Query Generator", href: "/graphql-query-generator" },
    { name: "Docker Compose Generator", href: "/docker-compose-generator" },
    { name: "GitHub Actions Generator", href: "/github-actions-generator" },
    { name: "Kubernetes YAML Generator", href: "/kubernetes-yaml-generator" },
    { name: "Mock Data Generator", href: "/mock-data-generator" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-gray-900" />
              <span className="font-bold text-xl text-gray-900">
                FreeDevTools Hub
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {tool.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu items */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="text-gray-600 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
