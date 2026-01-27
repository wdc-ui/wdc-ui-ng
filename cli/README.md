# @wdc-ui/ng

**Beautifully designed components that you can copy and paste into your Angular applications.**

`@wdc-ui/ng` is not a component library. It's a collection of re-usable components that you copy and paste into your apps. It is built on top of **Angular (Signals + Standalone)**, **Tailwind CSS**, and **Angular CDK**.

## 🚀 Why copy/paste?

The idea behind this project is to give you full control over your code. Instead of installing a massive dependency like `@material/core` where styling is hard to override, `@wdc-ui/ng` delivers the source code directly to your project.

- **100% Customizable:** The code is yours. Change the styles, logic, or structure.
- **Modern Angular:** Built with **Signals**, **Control Flow** (`@if`, `@for`), and **Standalone Components**.
- **Accessible:** Uses `@angular/cdk` for complex interactions (Dialogs, Popovers, etc.).
- **Lightweight:** You only add the components you need.

## 🛠️ Prerequisites

Before you start, ensure you have an Angular project setup with Tailwind CSS.

1. **Angular v17+** (Required for Signals support)
2. **Tailwind CSS** installed and configured.

## 📦 Installation & Setup

You don't need to install this package as a dependency. You use the CLI to initialize and add components.

### 1. Initialize the project

Run the `init` command to set up the base configuration, theme, and utility files.

```bash
npx @wdc-ui/ng@latest init

```

**What this does:**

1. Creates a `wdc.json` config file.
2. Creates a `theme.css` file and imports it into your global styles.
3. Installs required dependencies (`clsx`, `tailwind-merge`, `@angular/cdk`).
4. Downloads base utility helpers (e.g., `cn.ts`) to `src/app/shared/utils`.

### 2. Add Components

Once initialized, you can add components to your project.

```bash
npx @wdc-ui/ng@latest add button

```

This will download the `ButtonComponent` source code into `src/app/shared/components/ui/button`.

## 🧩 Available Components

You can add any of the following components:

- `button`
- `input`
- `card`
- `dialog`
- `drawer`
- `select`
- `popover`
- `tooltip`
- `accordion`
- `calendar`
- `sidebar`
- `data-table`
- `image-gallery`

## 🎨 Theming

When you run `init`, a `theme.css` file is created. This uses CSS variables for strict separation of concerns.

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

To customize the look of your app, simply change these CSS variable values.

## ⚙️ Configuration (`wdc.json`)

The `wdc.json` file controls where components are placed.

```json
{
  "$schema": "https://ui.wdcoders.com/schema.json",
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "utils": "@shared/utils",
    "components": "@shared/components",
    "ui": "@shared/components/ui"
  },
  "paths": {
    "root": "./",
    "components": "src/app/shared/components",
    "ui": "src/app/shared/components/ui",
    "utils": "src/app/shared/utils",
    "directives": "src/app/shared/directives",
    "theme": "src/styles.css"
  }
}
```

## 🤝 How to Contribute

We love contributions! Whether it's fixing a bug, adding a new component, or improving documentation, here is how you can help:

### 1. Fork and Clone

1.  **Fork** the repository to your own GitHub account.
2.  **Clone** the project to your local machine:

    ```bash
    git clone https://github.com/wdc-ui/wdc-ui-ng.git
    ```

### 2. Create a Branch

Always create a new branch for your changes. Do not work on the `master` branch directly.

```bash
git checkout -b feature/amazing-new-component
```

### 3. Make Changes

- Add your component in src/app/shared/components/ui.
- Ensure the code follows the project style.
- Test your changes locally.

### 4. Push and Pull Request

1. Push your branch to your forked repository:

   ```
   git push origin feature/amazing-new-component
   ```

2. Open a Pull Request (PR) on the main `wdc-ui-ng` repository.
3. Describe your changes clearly.

### 5. Review

Once you submit a PR, the maintainers will review your code. We might ask for some changes. Once everything looks good, we will merge it into the main codebase!

Thank you for helping us build the best Angular UI library! 🚀

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

---

Built by [wdcoders](https://wdcoders.com/)
