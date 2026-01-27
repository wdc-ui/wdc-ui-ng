#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

const program = new Command();

// --- CONFIGURATION ---
const GITHUB_USER = 'wdc-ui';
const REPO_NAME = 'wdc-ui-ng';
const BRANCH = 'main';

const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/refs/heads/${BRANCH}`;
const REGISTRY_URL = `${BASE_URL}/registry.json`;
const CONFIG_FILE_NAME = 'wdc.json';

// Default Config Structure
const DEFAULT_CONFIG = {
  $schema: 'https://ui.wdcoders.com/schema.json',
  style: 'default',
  tailwind: {
    css: 'src/styles.css',
    baseColor: 'slate',
    cssVariables: true,
  },
  aliases: {
    utils: '@shared/utils',
    components: '@shared/components',
    directives: '@shared/directives',
    ui: '@shared/components/ui',
  },
  paths: {
    root: './',
    components: 'src/app/shared/components',
    ui: 'src/app/shared/components/ui',
    utils: 'src/app/shared/utils',
    directives: 'src/app/shared/directives',
    theme: 'src/styles.css',
  },
};

// --- HELPER FUNCTIONS ---

async function getConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILE_NAME);
  if (await fs.pathExists(configPath)) {
    return await fs.readJson(configPath);
  }
  return null;
}

async function getRegistry() {
  const res = await fetch(REGISTRY_URL);
  if (!res.ok) throw new Error(`Could not fetch registry from GitHub.`);
  return await res.json();
}

// [HELPER] Rewrite imports based on user alias
function transformImports(content, config) {
  let newContent = content.replace(/@shared\/utils/g, config.aliases.utils);
  newContent = newContent.replace(/@shared\/components\/ui/g, config.aliases.ui);
  return newContent;
}

// [HELPER] Update tsconfig.json paths automatically
// [HELPER] Update tsconfig.json paths
async function updateTsConfig(config) {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');

  try {
    // ... (Same logic to try reading/writing) ...
    // If you are using strip-json-comments, try it here.
    // If not, standard JSON.parse will throw error on comments, triggering catch block.
    const tsConfig = await fs.readJson(tsConfigPath);

    // ... (Your logic to add paths) ...

    await fs.writeJson(tsConfigPath, tsConfig, { spaces: 2 });
    console.log(chalk.green('✅ tsconfig.json updated automatically.'));
  } catch (error) {
    // --- THIS IS THE IMPORTANT PART ---
    console.log(chalk.yellow(`\n⚠️  Automatic tsconfig update failed (likely due to comments).`));
    console.log(
      chalk.white(`Please add the following paths to your `) +
        chalk.cyan.bold(`tsconfig.json`) +
        chalk.white(` manually:`),
    );

    console.log(
      chalk.gray(`
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "${config.aliases.utils}/*": ["${config.paths.utils}/*"],
      "${config.aliases.ui}/*": ["${config.paths.ui}/*"],
      "${config.aliases.directives}/*": ["${config.paths.directives}/*"],
    }
  }
        `),
    );
  }
}

async function downloadFiles(files, targetDir, spinner, config) {
  for (const file of files) {
    const sourceUrl = `${BASE_URL}/${file.path}`;
    const fileRes = await fetch(sourceUrl);

    if (!fileRes.ok) {
      if (spinner) spinner.warn(`Failed to download ${file.name}`);
      continue;
    }

    let content = await fileRes.text();

    // Apply Import Transformation
    if (config) {
      content = transformImports(content, config);
    }

    const targetPath = path.join(targetDir, file.name);

    await fs.ensureDir(targetDir);
    await fs.writeFile(targetPath, content);
  }
}

program.name('wdc').description('Add components to your Angular project').version('1.0.2');

// =======================================================
// COMMAND: INIT
// =======================================================
program
  .command('init')
  .description('Initialize wdc-ui in your project')
  .action(async () => {
    console.log(chalk.cyan('🚀 Initializing wdc-ui configuration...'));

    if (await fs.pathExists(CONFIG_FILE_NAME)) {
      console.log(chalk.yellow('⚠️  wdc.json already exists.'));
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to overwrite configuration?',
          default: false,
        },
      ]);
      if (!proceed) return;
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'globalCss',
        message: 'Where is your global CSS file?',
        default: 'src/styles.css',
      },
      {
        type: 'input',
        name: 'uiPath',
        message: 'Where do you want to install UI components?',
        default: 'src/app/shared/components/ui',
      },
      {
        type: 'input',
        name: 'utilsAlias',
        message: 'What is your import alias for utils? (e.g. @shared/utils)',
        default: '@shared/utils',
      },
    ]);

    const config = { ...DEFAULT_CONFIG };
    config.tailwind.css = answers.globalCss;
    config.paths.theme = answers.globalCss;
    config.paths.ui = answers.uiPath;
    config.aliases.utils = answers.utilsAlias;

    await fs.writeJson(CONFIG_FILE_NAME, config, { spaces: 2 });
    console.log(chalk.green('✅ wdc.json created.'));

    const spinner = ora('Setting up project...').start();

    try {
      const registry = await getRegistry();

      // 4. Download UTILS
      const utilsItem = registry.items.find((i) => i.type === 'utils');
      if (utilsItem) {
        spinner.text = 'Downloading Utils...';
        const target = path.join(process.cwd(), config.paths.utils);
        await downloadFiles(utilsItem.files, target, spinner, config);
      }

      // 5. Download DIRECTIVES
      const directivesItem = registry.items.find((i) => i.type === 'directives');
      if (directivesItem) {
        spinner.text = 'Downloading Directives...';
        const target = path.join(process.cwd(), config.paths.directives);
        await downloadFiles(directivesItem.files, target, spinner, config);
      }

      // 6. Handle THEME
      const themeItem = registry.items.find((i) => i.type === 'theme');
      if (themeItem) {
        spinner.text = 'Configuring Theme...';

        const themeFile = themeItem.files[0];
        const sourceUrl = `${BASE_URL}/${themeFile.path}`;
        const res = await fetch(sourceUrl);

        if (res.ok) {
          const themeCssContent = await res.text();
          const globalCssPath = path.join(process.cwd(), config.paths.theme);
          const cssDir = path.dirname(globalCssPath);

          // A. Write theme.css
          const themeFilePath = path.join(cssDir, 'theme.css');
          await fs.writeFile(themeFilePath, themeCssContent);

          // B. Add Import to styles.css
          if (await fs.pathExists(globalCssPath)) {
            let currentCss = await fs.readFile(globalCssPath, 'utf8');
            const importStatement = "@import './theme.css';";

            if (!currentCss.includes(importStatement)) {
              const newCss = `${importStatement}\n${currentCss}`;
              await fs.writeFile(globalCssPath, newCss);
            }
          } else {
            await fs.writeFile(globalCssPath, "@import './theme.css';\n");
          }
        }
      }

      // 7. Update TSConfig
      spinner.text = 'Configuring TypeScript paths...';
      await updateTsConfig(config);

      // 8. Install Dependencies
      spinner.text = 'Installing dependencies...';
      execSync('npm install clsx tailwind-merge class-variance-authority @angular/cdk', {
        stdio: 'ignore',
      });

      spinner.succeed(chalk.green('Project initialized successfully!'));
      console.log(chalk.blue('\nYou can now add components using:'));
      console.log(chalk.cyan('  npx @wdc-ui/ng add button'));
      console.log(
        chalk.yellow('\nNote: You may need to restart your Angular server to apply path changes.'),
      );
    } catch (err) {
      spinner.fail('Initialization failed.');
      console.error(err);
    }
  });

// =======================================================
// COMMAND: ADD
// =======================================================
program
  .command('add <component>')
  .description('Add a component')
  .option('-p, --path <path>', 'Custom installation path')
  .action(async (componentName, options) => {
    let config = await getConfig();
    if (!config) config = DEFAULT_CONFIG;

    const spinner = ora(`Checking registry for ${componentName}...`).start();

    try {
      const registry = await getRegistry();
      const component = registry.items.find(
        (c) => c.name === componentName && c.type === 'components:ui',
      );

      if (!component) {
        spinner.fail(chalk.red(`Component '${componentName}' not found.`));
        return;
      }

      let installPath = config.paths.ui;
      if (options.path) installPath = options.path;

      const targetDir = path.join(process.cwd(), installPath, componentName);

      if (await fs.pathExists(targetDir)) {
        spinner.stop();
        const { proceed } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'proceed',
            message: chalk.yellow(`⚠️  Component '${componentName}' already exists. Overwrite?`),
            default: false,
          },
        ]);

        if (!proceed) return;
        spinner.start(`Overwriting ${componentName}...`);
      }

      spinner.text = `Installing ${componentName}...`;

      // Pass config for import rewriting
      await downloadFiles(component.files, targetDir, spinner, config);

      spinner.succeed(chalk.green(`Success! ${componentName} added.`));

      if (component.dependencies && component.dependencies.length > 0) {
        const newDeps = component.dependencies.filter(
          (d) =>
            !['clsx', 'tailwind-merge', 'class-variance-authority', '@angular/cdk'].includes(d),
        );

        if (newDeps.length > 0) {
          console.log(chalk.yellow(`\n⚠️  This component needs extra packages:`));
          console.log(chalk.cyan(`  npm install ${newDeps.join(' ')}`));
        }
      }
    } catch (error) {
      spinner.fail(chalk.red('Error installing component.'));
      console.error(error.message);
    }
  });

program.parse(process.argv);
