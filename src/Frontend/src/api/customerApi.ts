export interface CustomerListQuery {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  code: string;
  description: string;
}

export const getCustomers = async (filter?: string): Promise<CustomerListQuery[]> => {
  let url = "/api/customers/list";

  if (filter && filter.trim() !== "") {
    url += `?filter=${encodeURIComponent(filter)}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load customers");
  }

  return await response.json();
};