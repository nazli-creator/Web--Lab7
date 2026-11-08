const BASE_URL = "https://dummyjson.com/products";

async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  // fetch does not reject on HTTP errors, so check the status ourselves
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchProducts(signal) {
  const data = await getJson(`${BASE_URL}?limit=100`, signal);
  return data.products;
}

export async function fetchProduct(id, signal) {
  return getJson(`${BASE_URL}/${id}`, signal);
}
