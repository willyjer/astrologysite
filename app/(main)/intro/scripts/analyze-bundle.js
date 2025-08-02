#!/usr/bin/env node

/**
 * Bundle Analysis Script for Intro Page
 * 
 * This script analyzes the bundle size and dependencies for the intro page
 * to help identify optimization opportunities.
 */

const fs = require('fs');
const path = require('path');

// Bundle analysis configuration
const BUNDLE_CONFIG = {
  introPage: {
    entry: 'app/(main)/intro/page.tsx',
    components: [
      'app/(main)/intro/IntroHero/IntroHero.tsx',
      'app/(main)/intro/LearnList/LearnList.tsx',
      'app/(main)/intro/components/IntroErrorFallback.tsx',
    ],
    dependencies: [
      'react',
      'next/navigation',
      'lucide-react',
      'next/link',
    ],
  },
};

// Analyze file sizes
function analyzeFileSizes() {
  
  
  const results = {
    totalSize: 0,
    files: [],
    dependencies: new Set(),
  };

  // Analyze main page
  const pagePath = path.join(process.cwd(), BUNDLE_CONFIG.introPage.entry);
  if (fs.existsSync(pagePath)) {
    const stats = fs.statSync(pagePath);
    results.files.push({
      name: 'page.tsx',
      size: stats.size,
      sizeKB: (stats.size / 1024).toFixed(2),
    });
    results.totalSize += stats.size;
  }

  // Analyze components
  BUNDLE_CONFIG.introPage.components.forEach(componentPath => {
    const fullPath = path.join(process.cwd(), componentPath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const name = path.basename(componentPath);
      results.files.push({
        name,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
      });
      results.totalSize += stats.size;
    }
  });

  // Analyze CSS files
  const cssFiles = [
    'app/(main)/intro/page.module.css',
    'app/(main)/intro/IntroHero/styles.module.css',
    'app/(main)/intro/LearnList/styles.module.css',
    'app/(main)/intro/components/IntroErrorFallback.module.css',
  ];

  cssFiles.forEach(cssPath => {
    const fullPath = path.join(process.cwd(), cssPath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const name = path.basename(cssPath);
      results.files.push({
        name,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        type: 'CSS',
      });
      results.totalSize += stats.size;
    }
  });

  return results;
}

// Generate optimization recommendations
function generateRecommendations(analysis) {
  const recommendations = [];

  // Check total bundle size
  const totalSizeKB = (analysis.totalSize / 1024).toFixed(2);
  if (analysis.totalSize > 50 * 1024) { // 50KB threshold
    recommendations.push({
      type: 'warning',
      message: `Bundle size is ${totalSizeKB}KB - consider code splitting`,
    });
  }

  // Check for large components
  const largeFiles = analysis.files.filter(file => file.size > 5 * 1024); // 5KB threshold
  if (largeFiles.length > 0) {
    recommendations.push({
      type: 'info',
      message: `Large files detected: ${largeFiles.map(f => f.name).join(', ')}`,
    });
  }

  // Check for unused dependencies
  if (analysis.dependencies.size > 10) {
    recommendations.push({
      type: 'warning',
      message: 'Many dependencies detected - consider tree shaking',
    });
  }

  return recommendations;
}

// Print analysis results
function printResults(analysis, recommendations) {
  // Development logging removed for production
}

// Main execution
function main() {
  try {
    const analysis = analyzeFileSizes();
    const recommendations = generateRecommendations(analysis);
    printResults(analysis, recommendations);
  } catch (bundleAnalysisError) {
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeFileSizes,
  generateRecommendations,
  printResults,
}; 