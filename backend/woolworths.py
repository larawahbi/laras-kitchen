import httpx

_SEARCH_URL = "https://www.woolworths.com.au/apis/ui/Search/products"
_PRODUCT_URL = "https://www.woolworths.com.au/shop/productdetails/{stockcode}/{slug}"
_HEADERS = {
    "accept": "application/json, text/plain, */*",
    "user-agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "referer": "https://www.woolworths.com.au/shop/search/products",
}


def search_woolworths(query: str) -> dict | None:
    try:
        resp = httpx.get(
            _SEARCH_URL,
            params={"searchTerm": query, "pageSize": 5},
            headers=_HEADERS,
            timeout=10,
            follow_redirects=True,
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception:
        return None

    outer = data.get("Products", [])
    if not outer:
        return None

    inner = outer[0].get("Products", [])
    if not inner:
        return None

    product = inner[0]

    price = product.get("Price")
    if price is None:
        return None

    stockcode = product.get("Stockcode", "")
    slug = product.get("UrlFriendlyName", "")
    brand = product.get("Brand") or None

    return {
        "product_name": product.get("Name"),
        "brand": brand,
        "weight": product.get("PackageSize"),
        "price": float(price),
        "url": _PRODUCT_URL.format(stockcode=stockcode, slug=slug) if stockcode and slug else None,
    }
