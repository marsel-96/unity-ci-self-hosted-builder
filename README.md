# Unity CI Self Hosted Builder

# Package
```
npm run package'
```

# Test Script Locally

### Install ts-node
```
npm install -g ts-node typescript '@types/node'
```

### Set environment variables

```
$env:GITHUB_WORKSPACE = 'C:\Users\marco\Desktop\actions-runner\_work\test-game-ci\test-game-ci'

$env:INPUT_UNITYVERSION = '2022.3.43f1'
$env:INPUT_UNITYBUILDNAME = 'Build-Test-Name'
$env:INPUT_UNITYBUILDVERSION = '0.1.0'
$env:INPUT_UNITYBUILDTARGET = 'StandaloneWindows64'
$env:INPUT_UNITYBUILDMETHOD = 'BuildCommand.PerformBuild'
$env:INPUT_UNITYBUILDPATH = 'build'
$env:INPUT_UNITYCUSTOMARGUMENTS = ''
```

### Run index.ts

```
ts-node src/index.ts
```