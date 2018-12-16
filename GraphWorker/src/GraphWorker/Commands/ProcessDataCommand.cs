using System.Threading.Tasks;
using AspNetCore.Logging;
using AspNetCore.Patterns.Commands;

namespace GraphWorker.Commands
{
    public class ProcessDataCommand : IAction
    {
        public string Data { get; }

        public ProcessDataCommand(string data)
        {
            this.Data = data;
        }

        public class Handler : IActionHandlerAsync<ProcessDataCommand>
        {
            private readonly IEventLogger<Handler> logger;

            public Handler(IEventLogger<Handler> logger)
            {
                this.logger = logger;
            }

            public Task ExecuteAsync(ProcessDataCommand action)
            {
                using (logger.StartTimer("ProcessDataRuntime"))
                {
                    logger.DebugEvent("ProcessingData");
                    return Task.Delay(5000);
                }
            }
        }
    }
}