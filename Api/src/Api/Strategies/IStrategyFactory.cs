namespace Api.Strategies
{
    public interface IStrategyFactory
    {
         ISearchStrategy GetSearchStrategy();

         IVisitNodeStrategy GetVisitNodeStrategy();
    }
}