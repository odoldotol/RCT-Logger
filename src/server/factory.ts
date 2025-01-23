class ServerFactoryStatic
{
  public create(): Server {
    
    this.initialize();
    
    const instance = new Server();

    return instance;
  }

  private initialize() {}

}

export const ServerFactory = new ServerFactoryStatic();