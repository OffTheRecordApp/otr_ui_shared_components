# otr_ui_shared_components
## Install
``` npm i @otr-app/otr-ui-shared-components --save```

## Import
### Non-minifed version for bundle
```import '@otr-app/otr-ui-shared-components```

or in index.html

```<script src='node_modules/@otr-app/otr-ui-shared-components/index.js'></script>```

### Minifed version for bundle
```import '@otr-app/otrui-shared-components/index.min```

or in index.html

```<script src='node_modules/@otr-app/otr-ui-shared-components/index.min.js'></script>```

<hr /><br />

### Set up NPM link:
- Run `npm install` on the parent application; make sure all packages that are needed are installed
- In ui-shared-components run `npm run build:devo`
- In ui-shared-components repo run `npm link`
  - You can add an alias => `npm link myAlias`
  - If you do not provide an alias then the name in package.json will be used
- Go to parent application and run:
  - If alias is used => `npm link myAlias`
  - If no alias => `npm link @otr-app/ui-shared-components`

<br />

### Making changes on ui-shared-components: (subject to change)
If you make changes on ui-shared-components and wish to see them in the parent application:
- Run `npm run build:devo` in ui-shared-components
- Refresh parent application in browser and you should see the changes
