using System;
using SimpleInjector;

namespace Api.Strategies
{
    public class StrategyFactory : IStrategyFactory
    {
        private readonly Container container;
        private readonly IAppConfig config;

        public StrategyFactory(Container container, IAppConfig config)
        {
            this.container = container;
            this.config = config;
        }

        public ISearchStrategy GetSearchStrategy()
        {
            switch (config.DataSource)
            {
                case "Discogs":
                    return container.GetInstance<DiscogsSearchStrategy>();
                case "Spotify":
                    return container.GetInstance<SpotifySearchStrategy>();
                default:
                    throw new NotImplementedException($"DataSource {config.DataSource} not supported.");
            }
        }

        public IVisitNodeStrategy GetVisitNodeStrategy()
        {
            switch (config.DataSource)
            {
                case "Discogs":
                    return container.GetInstance<DiscogsVisitNodeStrategy>();
                case "Spotify":
                default:
                    throw new NotImplementedException($"DataSource {config.DataSource} not supported.");
            }
        }
    }
}