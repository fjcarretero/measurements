import proxy from 'koa-proxies';

export default {
    open: true,
    watch: true,
    appIndex: 'index.html',
    nodeResolve: {
      exportConditions: ['development'],
    },
    middleware: [
      proxy('/api/', {
        target: 'http://localhost:9000/',
      }),
    ],
    esbuildTarget: 'auto',
  };