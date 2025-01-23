async function bootstrap() {

  const ioInterface = IOInterfaceFactory.create();

  const io = IOFactory.create(ioInterface);
  const app = AppFactory.create(ioInterface);

  const server = ServerFactory.create(
    io,
    app,
  );

  process.on('SIGINT', async () => {
    await server.terminate();
    process.exit();
  });

  await server.start();
}

bootstrap();