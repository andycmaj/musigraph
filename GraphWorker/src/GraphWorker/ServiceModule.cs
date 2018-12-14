using AspNetCore.ApplicationBlocks.DependencyInjection;
using SimpleInjector;

namespace GraphWorker
{
    public class ServiceModule : IModule
    {
        public void RegisterServices(Container container)
        {
            container.Register<Service>();
        }
    }
}