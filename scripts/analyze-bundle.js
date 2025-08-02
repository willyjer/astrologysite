#!/usr/bin/env node

/**
 * Comprehensive Bundle Analysis Script
 * 
 * Analyzes bundle size, dependencies, and provides optimization recommendations
 * for the entire AstroAnon project.
 */

const fs = require('fs');
const path = require('path');

// Performance budgets
const PERFORMANCE_BUDGETS = {
  totalBundleSize: 500 * 1024, // 500KB
  individualComponentSize: 50 * 1024, // 50KB
  thirdPartyDependencies: 200 * 1024, // 200KB
  cssSize: 100 * 1024, // 100KB
};

// Critical paths to analyze
const CRITICAL_PATHS = [
  'app/(main)/intro',
  'app/(main)/birth-form',
  'app/(main)/payment',
  'app/(main)/qualified-readings',
  'app/components',
  'app/lib',
];

// Third-party dependencies to monitor
const THIRD_PARTY_DEPS = [
  'lucide-react',
  'luxon',
  'react-hook-form',
  '@hookform/resolvers',
  '@stripe/react-stripe-js',
  '@stripe/stripe-js',
  'stripe',
  'zod',
  'clsx',
];

class BundleAnalyzer {
  constructor() {
    this.results = {
      totalSize: 0,
      files: [],
      dependencies: new Set(),
      recommendations: [],
      warnings: [],
      errors: [],
    };
  }

  analyzeFile(filePath) {
    // Use absolute path for analysis
    if (!fs.existsSync(filePath)) return null;

    const stats = fs.statSync(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    
    return {
      path: relativePath,
      size: stats.size,
      sizeKB: (stats.size / 1024).toFixed(2),
      type: this.getFileType(filePath),
    };
  }

  getFileType(filePath) {
    const ext = path.extname(filePath);
    if (ext === '.tsx' || ext === '.ts') return 'TypeScript';
    if (ext === '.css' || ext === '.module.css') return 'CSS';
    if (ext === '.js' || ext === '.jsx') return 'JavaScript';
    return 'Other';
  }

  analyzeDirectory(dirPath) {
    const fullPath = path.join(process.cwd(), dirPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Directory not found: ${dirPath}`);
      return;
    }

    console.log(`Analyzing directory: ${fullPath}`);
    const files = this.getFilesRecursively(fullPath);
    console.log(`Found ${files.length} files in ${dirPath}`);
    
    files.forEach(file => {
      const analysis = this.analyzeFile(file);
      if (analysis) {
        this.results.files.push(analysis);
        this.results.totalSize += analysis.size;
      }
    });
  }

  getFilesRecursively(dirPath) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dirPath);

      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        
        try {
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            // Skip node_modules and .next
            if (item !== 'node_modules' && item !== '.next' && !item.startsWith('.')) {
              files.push(...this.getFilesRecursively(fullPath));
            }
          } else {
            // Only analyze relevant file types
            const ext = path.extname(item);
            if (['.tsx', '.ts', '.js', '.jsx', '.css', '.module.css'].includes(ext)) {
              files.push(fullPath);
            }
          }
        } catch (error) {
          // Skip files that can't be accessed
          console.log(`Skipping file: ${fullPath}`);
        }
      });
    } catch (error) {
      console.log(`Error reading directory: ${dirPath}`);
    }

    return files;
  }

  analyzeDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Analyze production dependencies
      if (packageJson.dependencies) {
        Object.keys(packageJson.dependencies).forEach(dep => {
          this.results.dependencies.add(dep);
        });
      }
    }
  }

  generateRecommendations() {
    const totalSizeKB = (this.results.totalSize / 1024).toFixed(2);

    // Check total bundle size
    if (this.results.totalSize > PERFORMANCE_BUDGETS.totalBundleSize) {
      this.results.warnings.push({
        type: 'bundle-size',
        message: `Total bundle size (${totalSizeKB}KB) exceeds budget (${PERFORMANCE_BUDGETS.totalBundleSize / 1024}KB)`,
        priority: 'high',
      });
    }

    // Check for large individual files
    const largeFiles = this.results.files.filter(file => 
      file.size > PERFORMANCE_BUDGETS.individualComponentSize
    );
    
    if (largeFiles.length > 0) {
      this.results.warnings.push({
        type: 'large-files',
        message: `Large files detected: ${largeFiles.map(f => `${f.path} (${f.sizeKB}KB)`).join(', ')}`,
        priority: 'medium',
      });
    }

    // Check third-party dependencies
    const thirdPartySize = this.results.files
      .filter(file => file.path.includes('node_modules'))
      .reduce((sum, file) => sum + file.size, 0);

    if (thirdPartySize > PERFORMANCE_BUDGETS.thirdPartyDependencies) {
      this.results.warnings.push({
        type: 'third-party-size',
        message: `Third-party dependencies (${(thirdPartySize / 1024).toFixed(2)}KB) exceed budget`,
        priority: 'high',
      });
    }

    // Generate optimization recommendations
    this.results.recommendations = [
      {
        type: 'code-splitting',
        message: 'Implement dynamic imports for non-critical components',
        priority: 'high',
      },
      {
        type: 'tree-shaking',
        message: 'Ensure all third-party libraries support tree shaking',
        priority: 'medium',
      },
      {
        type: 'icon-optimization',
        message: 'Consider using icon subsets or SVG sprites instead of full lucide-react',
        priority: 'medium',
      },
      {
        type: 'css-optimization',
        message: 'Implement CSS purging and critical CSS inlining',
        priority: 'medium',
      },
    ];
  }

  printResults() {
    console.log('\n📊 Bundle Analysis Results\n');
    console.log('=' .repeat(50));

    // Summary
    const totalSizeKB = (this.results.totalSize / 1024).toFixed(2);
    console.log(`📦 Total Bundle Size: ${totalSizeKB}KB`);
    console.log(`📁 Files Analyzed: ${this.results.files.length}`);
    console.log(`🔗 Dependencies: ${this.results.dependencies.size}`);

    // Warnings
    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.results.warnings.forEach(warning => {
        console.log(`  • ${warning.message}`);
      });
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.results.recommendations.forEach(rec => {
        console.log(`  • ${rec.message}`);
      });
    }

    // Top 10 largest files
    const largestFiles = this.results.files
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    if (largestFiles.length > 0) {
      console.log('\n📈 Top 10 Largest Files:');
      largestFiles.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.path} (${file.sizeKB}KB)`);
      });
    }

    console.log('\n' + '=' .repeat(50));
  }

  run() {
    console.log('🔍 Analyzing bundle...\n');

    // Analyze critical paths
    CRITICAL_PATHS.forEach(path => {
      console.log(`Analyzing: ${path}`);
      this.analyzeDirectory(path);
    });

    // Analyze dependencies
    this.analyzeDependencies();

    // Generate recommendations
    this.generateRecommendations();

    // Print results
    this.printResults();

    return this.results;
  }
}

// Run analysis
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.run();
}

module.exports = BundleAnalyzer; 