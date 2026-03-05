import { singleTemplates, multiTemplates } from './templates.js';
import JSZip from 'jszip';

const GITHUB_REPO = 'https://github.com/DeveloperTobi/mc-lib';

const GITHUB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;

const VERSIONS = {
  java: ['17', '21', '25'],
  kotlin: ['2.2.21', '2.1.0'],
  paper: ['1.21.11-R0.1-SNAPSHOT', '1.21.4-R0.1-SNAPSHOT', '1.21.3-R0.1-SNAPSHOT', '1.21.1-R0.1-SNAPSHOT', '1.20.4-R0.1-SNAPSHOT'],
};

function toCamelCase(str) {
  return str
    .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function replacePlaceholders(text, vars) {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value ?? '');
  }
  return result;
}

function processConditionalBlocks(text, vars) {
  if (!vars.GITHUB_PUBLISH || vars.GITHUB_PUBLISH !== 'true') {
    return text.replace(/\{\{#GITHUB_PUBLISH\}\}[\s\S]*?\{\{\/GITHUB_PUBLISH\}\}/g, '');
  }
  return text.replace(/\{\{#GITHUB_PUBLISH\}\}/g, '').replace(/\{\{\/GITHUB_PUBLISH\}\}/g, '');
}

function generateZip(vars, templates) {
  const zip = new JSZip();
  const BINARY_PREFIX = '__BINARY_BASE64__';
  for (const [filePath, content] of Object.entries(templates)) {
    const resolvedPath = replacePlaceholders(filePath, vars);
    if (typeof content === 'string' && content.startsWith(BINARY_PREFIX)) {
      const base64 = content.slice(BINARY_PREFIX.length);
      const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      zip.file(resolvedPath, binary);
    } else {
      let resolvedContent = replacePlaceholders(content, vars);
      resolvedContent = processConditionalBlocks(resolvedContent, vars);
      zip.file(resolvedPath, resolvedContent);
    }
  }
  return zip;
}

function downloadZip(zip, filename) {
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}

export function initApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="wizard">
      <header class="header">
        <h1>Paper Plugin Generator</h1>
        <p>Generate a Kotlin Paper plugin project – single or multi-module</p>
      </header>

      <div class="main">
        <div class="config">
          <form id="wizard-form" class="form">
            <section class="section">
              <h2>Project</h2>
              <div class="option-group">
                <label><input type="radio" name="projectType" value="single" checked> Single</label>
                <label><input type="radio" name="projectType" value="multi"> Multi-Module</label>
              </div>
            </section>

            <section class="section">
              <h2>Project Metadata</h2>
              <div class="project-metadata">
                <div class="field">
                  <label for="projectName">Name</label>
                  <input type="text" id="projectName" name="projectName" value="my-plugin" required
                    placeholder="my-plugin">
                </div>
                <div class="field">
                  <label for="groupId">Group</label>
                  <input type="text" id="groupId" name="groupId" value="com.example" required
                    placeholder="com.example">
                </div>
              </div>
            </section>

            <section id="modules-section" class="section hidden">
              <h2>Modules</h2>
              <div class="project-metadata">
                <div class="field">
                  <label for="apiModule">API Module</label>
                  <input type="text" id="apiModule" name="apiModule" value="mclib-api"
                    placeholder="mclib-api">
                </div>
                <div class="field">
                  <label for="pluginModule">Plugin Module</label>
                  <input type="text" id="pluginModule" name="pluginModule" value="mclib-plugin"
                    placeholder="mclib-plugin">
                </div>
              </div>
            </section>

            <section class="section">
              <h2>Java</h2>
              <div class="option-group">
                ${VERSIONS.java.map((v) => `
                <label><input type="radio" name="javaVersion" value="${v}" ${v === '21' ? 'checked' : ''}> ${v}</label>
                `).join('')}
              </div>
            </section>

            <section class="section">
              <h2>Versions</h2>
              <div class="project-metadata">
                <div class="field">
                  <label for="kotlinVersion">Kotlin</label>
                  <select id="kotlinVersion" name="kotlinVersion">
                    ${VERSIONS.kotlin.map((v) => `<option value="${v}" ${v === '2.2.21' ? 'selected' : ''}>${v}</option>`).join('')}
                  </select>
                </div>
                <div class="field">
                  <label for="paperVersion">Paper API</label>
                  <select id="paperVersion" name="paperVersion">
                    ${VERSIONS.paper.map((v) => `<option value="${v}" ${v.includes('1.21.11') ? 'selected' : ''}>${v}</option>`).join('')}
                  </select>
                </div>
              </div>
            </section>

            <section id="github-section" class="section hidden">
              <h2>Publishing</h2>
              <label class="checkbox-label">
                <input type="checkbox" id="githubPublish" name="githubPublish">
                GitHub Packages Maven Publish
              </label>
              <div id="github-owner-field" class="field hidden" style="margin-top: 1rem;">
                <label for="githubOwner">GitHub Owner</label>
                <input type="text" id="githubOwner" name="githubOwner" placeholder="username">
              </div>
            </section>
          </form>
        </div>

        <aside class="sidebar">
          <h3 class="sidebar-title">Output</h3>
          <p>Generates a Gradle project with Kotlin DSL, Paper API, and shadow plugin. Single-module or API + Plugin split.</p>
        </aside>
      </div>

      <footer class="footer">
        <a href="${GITHUB_REPO}" target="_blank" rel="noopener noreferrer" class="btn-gh" title="View on GitHub">${GITHUB_ICON}</a>
        <button type="submit" form="wizard-form" class="btn btn-primary">Generate</button>
      </footer>
    </div>
  `;

  const form = document.getElementById('wizard-form');
  const projectTypeRadios = form.querySelectorAll('input[name="projectType"]');
  const modulesSection = document.getElementById('modules-section');
  const githubSection = document.getElementById('github-section');
  const githubOwnerField = document.getElementById('github-owner-field');

  projectTypeRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const isMulti = form.querySelector('input[name="projectType"]:checked').value === 'multi';
      modulesSection.classList.toggle('hidden', !isMulti);
      githubSection.classList.toggle('hidden', !isMulti);
    });
  });

  document.getElementById('githubPublish').addEventListener('change', (e) => {
    githubOwnerField.classList.toggle('hidden', !e.target.checked);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const projectType = formData.get('projectType');
    const projectName = formData.get('projectName').trim();
    const groupId = formData.get('groupId').trim();

    if (!projectName || !groupId) {
      alert('Please fill in Project Name and Group ID.');
      return;
    }

    const paperVersion = formData.get('paperVersion');
    const paperApiVersion = paperVersion.split('-')[0];

    const vars = {
      PROJECT_NAME: projectName,
      PROJECT_NAME_CAMEL: toCamelCase(projectName.replace(/-/g, ' ')),
      GROUP_ID: groupId,
      PACKAGE_PATH: groupId.replace(/\./g, '/'),
      JAVA_VERSION: formData.get('javaVersion'),
      KOTLIN_VERSION: formData.get('kotlinVersion'),
      PAPER_VERSION: paperVersion,
      PAPER_API_VERSION: paperApiVersion,
      GITHUB_PUBLISH: formData.get('githubPublish') ? 'true' : 'false',
      GITHUB_OWNER: formData.get('githubOwner') || 'github',
    };

    if (projectType === 'multi') {
      const apiModule = formData.get('apiModule').trim();
      const pluginModule = formData.get('pluginModule').trim();
      if (!apiModule || !pluginModule) {
        alert('Please fill in API and Plugin module names.');
        return;
      }
      vars.API_MODULE = apiModule;
      vars.PLUGIN_MODULE = pluginModule;
    }

    const templates = projectType === 'multi' ? multiTemplates : singleTemplates;
    const zip = generateZip(vars, templates);
    downloadZip(zip, `${projectName}.zip`);
  });
}
