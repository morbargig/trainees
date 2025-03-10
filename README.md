# Senior Web Developer Task (BIKS)

## Project Overview

This project is a **Single Page Application (SPA)** that displays test results of trainees.

### Requirements

1. **State Preservation**: Filters and selections should persist when navigating between pages (without refreshing).
2. **Functionality**: Filters, clicks, and other interactions must work properly.
3. **Filter Behavior**:
   - Empty filters should display all results.
   - Filters are only active when a value is entered.
4. **Bonus Points**:
   - Using **Angular** is preferred.
   - Adding **unit tests** (2-3 examples) will earn extra points.
   - **Documentation** is highly appreciated.
   - **UI/UX**: Any design framework is acceptable, but **Angular Material** is recommended.

## Application Layout (UI Sketch)

```
+----------------------------+
|        Main Menu           |
|----------------------------|
| ▶ Data                     |
| ▶ Analysis                 |
| ▶ Monitor                  |
+----------------------------+
|                            |
|  +----------------------+  |
|  |                      |  |
|  |   Content Area       |  |
|  |   (Page changes)     |  |
|  |                      |  |
|  +----------------------+  |
|                            |
+----------------------------+
```

## Application Features

### Data Page (UI Sketch)

```
+--------------------------------------+
|  Filter: [____________________] 🔍   |
+--------------------------------------+
| ID   | Name     | Grade | Date       |
|------|----------|-------|------------|
| 101  | Alice    |  92   | 2024-03-10 |
| 102  | Bob      |  85   | 2024-03-09 |
| 103  | Charlie  |  78   | 2024-03-08 |
| ...  | ...      | ...   | ...        |
+--------------------------------------+
| [⬅ Prev]  Page 1/3  [Next ➡]        |
+--------------------------------------+
```

### Analysis Page (UI Sketch)

```
+------------------------------------------------+
| Select IDs: [101, 102, 103]                    |
| Select Subjects: [Math, Science, History]      |
+------------------------------------------------+
|          Performance Graph                     |
|    +--------------------------+                |
|  A |    *                     | Subject 1      |
|  B |  *  *                    | Subject 2      |
|  C |  *  *  *                 | Subject 3      |
|    +--------------------------+                |
+------------------------------------------------+
```

### Monitor Page (UI Sketch)

```
+-------------------------------------------+
| Filter by Status: [✅ Passed] [❌ Failed]  |
+-------------------------------------------+
|  Name     | Average  | Status             |
|-----------|----------|--------------------|
| Alice     |  88.5    | ✅ Passed          |
| Bob       |  64.2    | ❌ Failed          |
| Charlie   |  71.3    | ✅ Passed          |
+-------------------------------------------+
```

---

# Nx App

### Infrastructures code for Nx workspace and Angular infrastructure libs and more

- `<app-name>` refers to an app or library (app/lib names can be found in `workspace.json`)

## Install

### Install all monorepo apps dependencies

```sh
npm i
```

#### If there are issues, try with npm proxy

```sh
npm config delete proxy
npm config delete https-proxy
```

### Clean the project

#### Cleanup the project folder from `node_modules`, etc.

```sh
npm run clean
```

#### Cleanup npm cache

```sh
npm run clean:npm
```

## Install VSC Extensions

1. Open the Extensions tab
2. Type `@recommended`
3. Install all results

[VSC workspace recommended extensions docs](https://code.visualstudio.com/docs/editor/extension-marketplace#_extensions-view-filters)

## Run Workspace in Docker with VSC (Docker Desktop must be installed)

1. After installing all recommended extensions in the last section [Install VSC Extensions](#install-vsc-extensions)
2. Press <kbd>Control</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
3. Start typing `Dev Containers: Reopen in Container` and select it (this will reopen the folder in Docker with terminal access)
4. Run any Nx workspace command, such as [Nx workspace command](#nx-workspace-command)

[Dev Containers Extension Docs](https://code.visualstudio.com/docs/devcontainers/containers)

## Development Example

### Front - Main App

```sh
npx nx run main-app:serve
```

### BFF

```sh
npx nx run api:serve
```

## Nx Workspace Commands

Refer to [Nx command docs](https://nx.dev/reference/commands)

### Serve

#### Serve default app

```sh
npx nx serve
```

#### Serve specific app

```sh
npx nx run <app-name>:serve
```

### Test

#### Test default app

```sh
npx nx test
```

#### Test specific app

```sh
npx nx run <app-name>:test
```

#### Test in watch mode

```sh
npx nx run <app-name>:test --watch
```

### Lint

#### Lint default app

```sh
npx nx lint
```

#### Lint specific app

```sh
npx nx run <app-name>:lint
```

### Build

#### Build default app

```sh
npx nx build
```

#### Build specific app

```sh
npx nx run <app-name>:build
```

### Storybook

#### Serve Storybook for an app or lib

```sh
npx nx run <app-name>:storybook
```

#### Build Storybook for an app or lib

```sh
npx nx run <app-name>:build-storybook
```

### Graph

#### Show project dependencies and explore them via UI

```sh
npx nx graph
```

### Migrate

#### Update Nx and all supported Nx plugins and dependencies

```sh
npx nx migrate latest
```

## Monorepo Structure

### Project Base Tree

```bash
Jenkins
   |-- Jenkinsfile
   |-- jenkins.dio
Makefile
README.md
apps
   |-- main-app
   |   |-- Dockerfile
   |   |-- Jenkins
libs
   |-- api-interfaces
   |-- front
   |   |-- dynamic-forms
   |   |-- dynamic-table
   |   |-- base-client
   |   |-- ui-standalone-components
nx.json
package.json
```



---

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/getting-started/intro)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

## ☁ Nx Cloud

Nx Cloud enables faster builds and tests by caching computations.

[Learn More](https://nx.app/)

