import { server } from "./init";

async function bootstrap() {
  await server.start();
}

bootstrap();