using System.Threading.Tasks;
using AspNetCore.ApplicationBlocks.Console;

namespace GraphWorker
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            using (var context = new ConsoleApplicationBuilder(
                // Add your IModules here to register their dependencies into
                // the composition root
                new ServiceModule()
            // Tell the Builder the interface and implementation Types of your
            // application's configuration. It will automatically register the
            // interface for you to inject anywhere.
            ).Build<IAppConfig, AppConfig>())
            {
                // Get an instance of your application's entry point from the
                // composition root, accessed via the ConsoleApplicationContext.
                await context.Container.GetInstance<Service>().RunAsync();
            }
        }
    }
}
