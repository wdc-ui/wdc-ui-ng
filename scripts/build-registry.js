const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const PROJECT_ROOT = path.join(__dirname, '../'); // Root of your library project
const APP_SHARED_PATH = path.join(__dirname, '../src/app/shared');

// Source Paths
const UI_PATH = path.join(APP_SHARED_PATH, 'components/ui');
const UTILS_PATH = path.join(APP_SHARED_PATH, 'utils'); // Where cn.ts lives
const DIRECTIVES_PATH = path.join(APP_SHARED_PATH, 'directives'); // Where global directives live
const THEME_FILE_PATH = path.join(__dirname, '../src/theme.css'); // Your source theme file

const OUTPUT_FILE = path.join(__dirname, '../registry.json');

// --- DEPENDENCIES ---
const COMPONENT_DEPENDENCIES = {
  dialog: ['@angular/cdk'],
  select: ['@angular/cdk'],
  sheet: ['@angular/cdk'],
  tabs: ['@angular/cdk'],
  accordion: ['@angular/cdk'],
  popover: ['@angular/cdk'],
  tooltip: ['@angular/cdk'],
  'scroll-top': ['@angular/cdk'], // If needed
};

const DEFAULT_DEPENDENCIES = ['clsx', 'tailwind-merge', 'class-variance-authority'];

// Helper to get relative path for the registry
const getProjectRelativePath = (absolutePath) => {
  return path.relative(PROJECT_ROOT, absolutePath).replace(/\\/g, '/');
};

async function buildRegistry() {
  console.log('🏗️  Building registry...');

  const items = [];

  // =========================================
  // 1. UTILS (cn.ts, etc.)
  // =========================================
  if (fs.existsSync(UTILS_PATH)) {
    const utilFiles = fs
      .readdirSync(UTILS_PATH)
      .filter((file) => file.endsWith('.ts'))
      .map((file) => ({
        name: file,
        path: getProjectRelativePath(path.join(UTILS_PATH, file)),
        target: 'src/app/shared/utils', // Hint for CLI where to put it
      }));

    if (utilFiles.length > 0) {
      items.push({
        name: 'utils',
        type: 'utils', // Type for init command
        dependencies: ['clsx', 'tailwind-merge'],
        files: utilFiles,
      });
      console.log(`✅ Processed: Utils (${utilFiles.length} files)`);
    }
  }

  // =========================================
  // 2. DIRECTIVES (Global directives)
  // =========================================
  if (fs.existsSync(DIRECTIVES_PATH)) {
    const directiveFiles = fs
      .readdirSync(DIRECTIVES_PATH)
      .filter((file) => file.endsWith('.ts'))
      .map((file) => ({
        name: file,
        path: getProjectRelativePath(path.join(DIRECTIVES_PATH, file)),
        target: 'src/app/shared/directives',
      }));

    if (directiveFiles.length > 0) {
      items.push({
        name: 'directives',
        type: 'directives', // Type for init command
        dependencies: [],
        files: directiveFiles,
      });
      console.log(`✅ Processed: Directives (${directiveFiles.length} files)`);
    }
  }

  // =========================================
  // 3. THEME (CSS)
  // =========================================
  if (fs.existsSync(THEME_FILE_PATH)) {
    items.push({
      name: 'theme',
      type: 'theme',
      dependencies: [],
      files: [
        {
          name: 'theme.css',
          path: getProjectRelativePath(THEME_FILE_PATH),
          target: 'src/styles',
        },
      ],
    });
    console.log(`✅ Processed: Theme`);
  } else {
    console.warn(`⚠️  Theme file not found at ${THEME_FILE_PATH}`);
  }

  // =========================================
  // 4. UI COMPONENTS
  // =========================================
  if (fs.existsSync(UI_PATH)) {
    const componentFolders = fs
      .readdirSync(UI_PATH, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const componentName of componentFolders) {
      const componentPath = path.join(UI_PATH, componentName);

      const files = fs.readdirSync(componentPath).map((fileName) => {
        return {
          name: fileName,
          path: getProjectRelativePath(path.join(componentPath, fileName)),
          target: `src/app/shared/components/ui/${componentName}`,
        };
      });

      const specificDeps = COMPONENT_DEPENDENCIES[componentName] || [];
      const allDeps = [...new Set([...DEFAULT_DEPENDENCIES, ...specificDeps])];

      items.push({
        name: componentName,
        type: 'components:ui',
        dependencies: allDeps,
        files: files,
      });

      console.log(`✅ Processed: ${componentName} (${files.length} files)`);
    }
  }

  // =========================================
  // 5. SAVE
  // =========================================
  const registry = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    items: items, // renamed from 'components' to 'items' to reflect mixed content
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));
  console.log(`\n🎉 Registry saved to ${OUTPUT_FILE}`);
}

buildRegistry();
