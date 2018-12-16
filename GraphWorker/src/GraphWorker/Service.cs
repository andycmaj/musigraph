using System.Threading.Tasks;
using AspNetCore.Logging;
using AspNetCore.Patterns.Commands;
using GraphWorker.Commands;

namespace GraphWorker
{
    public class Service
    {
        private readonly IAppConfig appConfig;
        private readonly IEventLogger<Service> logger;
        private readonly ICommandRouter commandRouter;

        public Service(IEventLogger<Service> logger, ICommandRouter commandRouter, IAppConfig appConfig)
        {
            this.commandRouter = commandRouter;
            this.logger = logger;
            this.appConfig = appConfig;
        }

        public async Task RunAsync()
        {
            using (logger.StartTimer("ServiceRuntime"))
            {
                await commandRouter.ExecuteActionAsync(new ProcessDataCommand("data"));
            }
        }
    }
}