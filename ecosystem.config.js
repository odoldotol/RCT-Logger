module.exports = {
  apps: [
    {
      name: 'RCTLogger',
      script: 'dist/logger/main.js',
      restart_delay: 500,
      error_file: '/home/lygo/rct/rct_logger_error.log', // temp
      out_file: '/home/lygo/rct/rct_logger_out.log', // temp
      max_memory_restart: '300M',
    }
  ]
};