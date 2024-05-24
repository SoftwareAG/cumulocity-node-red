import { ConfigurationOptions } from '@c8y/devkit/dist/options';
import * as config from '../package.json';

const { author, description, version, license } = config;

export default {
  runTime: {
    author,
    description,
    version,
    license,
    name: "Node-RED",
    contextPath: "sag-ps-iot-pkg-node-red-ui",
    key: "sag-ps-iot-pkg-node-red-ui-application-key",
    tabsHorizontal: true,
    dynamicOptionsUrl: "/apps/public/public-options/options.json",
    isPackage: true,
    package: "blueprint",
    exports: [
      {
        name: "Node-RED Admin Plugin",
        module: "NodeRedAdminModule",
        path: "./src/app/node-red-admin/node-red-admin.module.ts",
        description: "Adds an UI for administrating Node-RED."
      },
      {
        name: "Node-RED Dashboard Plugin",
        module: "NodeRedDashboardModule",
        path: "./src/app/node-red-dashboard/node-red-dashboard.module.ts",
        description: "Adds an UI for viewing Dashboards of Node-RED."
      }
    ],
    icon: {
      url: "url(/apps/sag-ps-iot-pkg-node-red-ui/assets/app-icon.png)"
    }
  },
  buildTime: {
    federation: [
      '@angular/animations',
      '@angular/cdk',
      '@angular/common',
      '@angular/compiler',
      '@angular/core',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/router',
      // '@angular/upgrade',
      '@c8y/client',
      '@c8y/ngx-components',
      'ngx-bootstrap',
      '@ngx-translate/core',
      '@ngx-formly/core'
    ],
    copy: [
      { from: "../images", to: "images" },
      { from: "../README.md", to: "README.md" },
      { from: "../LICENSE", to: "LICENSE.txt" }
    ]
  }
} satisfies ConfigurationOptions;
