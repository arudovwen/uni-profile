import { ref, reactive, watch, onMounted } from "vue";

export interface SearchQueryOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  [key: string]: any;
}

export interface SearchableDataOptions {
  service: (query: SearchQueryOptions) => Promise<any>;
  initialQuery?: SearchQueryOptions;
  mapResponse: (data: any[]) => Array<{ label: string; value: any }>;
  debounceMs?: number;
}

export function useSearchableData(options: SearchableDataOptions) {
  const {
    service,
    initialQuery = { search: "", page: 1, pageSize: 100 },
    mapResponse,
    debounceMs = 300,
  } = options;

  const items = ref<Array<{ label: string; value: any }>>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const query = reactive<SearchQueryOptions>({
    ...initialQuery,
  });

  let debounceTimer: ReturnType<typeof setTimeout>;

  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await service(query);
      if (response?.status === 200 && response?.data) {
        const responseData = response.data.data || response.data;
        items.value = mapResponse(Array.isArray(responseData) ? responseData : []);
      }
    } catch (err: any) {
      error.value = err?.message || "Failed to fetch data";
      console.error("Error fetching searchable data:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const debouncedFetch = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchData, debounceMs);
  };

  const resetQuery = () => {
    Object.assign(query, initialQuery);
    fetchData();
  };

  const updateQuery = (field: string, value: any) => {
    query[field] = value;
  };

  onMounted(fetchData);

  watch(
    () => query.search,
    () => {
      debouncedFetch();
    }
  );

  return {
    items,
    isLoading,
    error,
    query,
    fetchData,
    debouncedFetch,
    resetQuery,
    updateQuery,
  };
}
