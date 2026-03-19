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

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const exportCustomersToXml = (customers: CustomerListQuery[]) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Customers>
${customers
  .map(
    (customer) => `<Customer>
    <Id>${customer.id}</Id>
    <Name>${escapeXml(customer.name)}</Name>
    <Address>${escapeXml(customer.address)}</Address>
    <Email>${escapeXml(customer.email)}</Email>
    <Phone>${escapeXml(customer.phone)}</Phone>
    <Iban>${escapeXml(customer.iban)}</Iban>
    <Code>${escapeXml(customer.code)}</Code>
    <Description>${escapeXml(customer.description)}</Description>
  </Customer>`
  )
  .join("\n")}
</Customers>`;

  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "customers.xml";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};