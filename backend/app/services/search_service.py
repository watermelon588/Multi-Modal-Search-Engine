from app.services.web_search_service import search_web

from app.services.web_search_service import search_web


def search_pipeline(query: str):

    # Directly call live web search
    web_results = search_web(query)

    return {
        "query": query,
        "results": web_results
    }