const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const UI_PATH = path.join(__dirname, '../src/app/shared/components/ui'); // Components kahan hain
const OUTPUT_FILE = path.join(__dirname, '../registry.json'); // Registry kahan save karni hai

// Dependencies Map (Agar kisi component ko extra library chahiye)
// Yahan aap define kar sakte hain ki kis component ke liye kya install karna padega
const COMPONENT_DEPENDENCIES = {
  dialog: ['@angular/cdk'],
  select: ['@angular/cdk'],
  sheet: ['@angular/cdk'],
  tabs: ['@angular/cdk'],
  accordion: ['@angular/cdk'],
  // Baaki sab ke liye default dependencies niche logic mein hain (clsx, tailwind-merge)
};

const DEFAULT_DEPENDENCIES = ['clsx', 'tailwind-merge', 'class-variance-authority'];

async function buildRegistry() {
  console.log('🏗️  Building registry...');

  // 1. Check if UI folder exists
  if (!fs.existsSync(UI_PATH)) {
    console.error(`❌ UI folder not found at: ${UI_PATH}`);
    process.exit(1);
  }

  // 2. Read all folders inside src/app/ui
  const componentFolders = fs
    .readdirSync(UI_PATH, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const components = [];

  // 3. Loop through each folder (button, card, input...)
  for (const componentName of componentFolders) {
    const componentPath = path.join(UI_PATH, componentName);

    // Folder ke andar ki saari files read karein
    const files = fs.readdirSync(componentPath).map((fileName) => {
      return {
        name: fileName,
        // Path relative to project root (taaki CLI download kar sake)
        path: `src/app/shared/components/ui/${componentName}/${fileName}`,
      };
    });

    // Dependencies calculate karein
    const specificDeps = COMPONENT_DEPENDENCIES[componentName] || [];
    const allDeps = [...new Set([...DEFAULT_DEPENDENCIES, ...specificDeps])];

    // Component object banayein
    components.push({
      name: componentName,
      type: 'components:ui',
      dependencies: allDeps,
      files: files,
    });

    console.log(`✅ Processed: ${componentName} (${files.length} files)`);
  }

  // 4. Registry JSON Object
  const registry = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    components: components,
  };

  // 5. Write to registry.json
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));
  console.log(`\n🎉 Registry saved to ${OUTPUT_FILE}`);
}

buildRegistry();
