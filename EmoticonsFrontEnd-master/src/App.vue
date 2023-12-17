<template>
  <router-view />
</template>

<style>
:root {
  --sz: 4vmin;
  --on: #4CAF50;
  --of: #f50000;
  --gr: #666666;
  --tr: all 0.5s ease 0s;
  --lg: var(--of);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: var(--tr);
}

html,
body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
