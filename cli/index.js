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
const GITHUB_USER = 'devtechkamal';
const REPO_NAME = 'ui-ng-wd';
const BRANCH = 'master';

const BASE_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/refs/heads/${BRANCH}`;
const REGISTRY_URL = `${BASE_URL}/registry.json`;
const CONFIG_FILE_NAME = 'wdc.json';

// Default Config Structure
const DEFAULT_CONFIG = {
    $schema: 'https://ui.wdcoders.com/schema.json',
    style: 'default',
    tailwind: {
        config: 'tailwind.config.js',
        css: 'src/styles.css',
        baseColor: 'slate',
        cssVariables: true,
    },
    aliases: {
        utils: '@shared/utils',
        components: '@shared/components',
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

async function downloadFiles(files, targetDir, spinner) {
    for (const file of files) {
        const sourceUrl = `${BASE_URL}/${file.path}`;
        const fileRes = await fetch(sourceUrl);

        if (!fileRes.ok) {
            if (spinner) spinner.warn(`Failed to download ${file.name}`);
            continue;
        }

        const content = await fileRes.text();
        const targetPath = path.join(targetDir, file.name);

        await fs.ensureDir(targetDir);
        await fs.writeFile(targetPath, content);
    }
}

program.name('wdc').description('Add components to your Angular project').version('1.0.1');

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
        ]);

        const config = { ...DEFAULT_CONFIG };
        config.tailwind.css = answers.globalCss;
        config.paths.theme = answers.globalCss;
        config.paths.ui = answers.uiPath;

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
                await downloadFiles(utilsItem.files, target, spinner);
            }

            // 5. Download DIRECTIVES
            const directivesItem = registry.items.find((i) => i.type === 'directives');
            if (directivesItem) {
                spinner.text = 'Downloading Directives...';
                const target = path.join(process.cwd(), config.paths.directives);
                await downloadFiles(directivesItem.files, target, spinner);
            }

            // 6. Handle THEME (UPDATED LOGIC)
            const themeItem = registry.items.find((i) => i.type === 'theme');
            if (themeItem) {
                spinner.text = 'Configuring Theme...';

                const themeFile = themeItem.files[0];
                const sourceUrl = `${BASE_URL}/${themeFile.path}`;
                const res = await fetch(sourceUrl);

                if (res.ok) {
                    const themeCssContent = await res.text();
                    const globalCssPath = path.join(process.cwd(), config.paths.theme);
                    const cssDir = path.dirname(globalCssPath); // e.g., src/

                    // A. Write theme.css in the same folder as styles.css
                    const themeFilePath = path.join(cssDir, 'theme.css');
                    await fs.writeFile(themeFilePath, themeCssContent);

                    // B. Add Import to styles.css
                    if (await fs.pathExists(globalCssPath)) {
                        let currentCss = await fs.readFile(globalCssPath, 'utf8');
                        const importStatement = "@import './theme.css';";

                        // Only add if not already present
                        if (!currentCss.includes(importStatement)) {
                            // Prepend to the top (CSS imports must be first)
                            const newCss = `${importStatement}\n${currentCss}`;
                            await fs.writeFile(globalCssPath, newCss);
                        }
                    } else {
                        // If styles.css doesn't exist, create it
                        await fs.writeFile(globalCssPath, "@import './theme.css';\n");
                    }
                }
            }

            // 7. Install Dependencies
            spinner.text = 'Installing dependencies...';
            execSync('npm install clsx tailwind-merge class-variance-authority @angular/cdk', {
                stdio: 'ignore',
            });

            spinner.succeed(chalk.green('Project initialized successfully!'));
            console.log(chalk.blue('\nYou can now add components using:'));
            console.log(chalk.cyan('  npx @wdc-ui/ng add button'));
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
                        message: chalk.yellow(
                            `⚠️  Component '${componentName}' already exists. Overwrite?`,
                        ),
                        default: false,
                    },
                ]);

                if (!proceed) return;
                spinner.start(`Overwriting ${componentName}...`);
            }

            spinner.text = `Installing ${componentName}...`;
            await downloadFiles(component.files, targetDir, spinner);

            spinner.succeed(chalk.green(`Success! ${componentName} added.`));

            if (component.dependencies && component.dependencies.length > 0) {
                const newDeps = component.dependencies.filter(
                    (d) =>
                        ![
                            'clsx',
                            'tailwind-merge',
                            'class-variance-authority',
                            '@angular/cdk',
                        ].includes(d),
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
