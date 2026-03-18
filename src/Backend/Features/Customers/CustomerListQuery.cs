using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Backend.Features.Customers;

public class CustomerListQuery : IRequest<List<CustomerListQueryResponse>>
{
    public string? Filter { get; set; }
}

public class CustomerListQueryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Address { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Iban { get; set; } = "";
    public string Code { get; set; } = "";
    public string Description { get; set; } = "";
}

internal class CustomerListQueryHandler(BackendContext context) : IRequestHandler<CustomerListQuery, List<CustomerListQueryResponse>>
{
    private readonly BackendContext context = context;

    public async Task<List<CustomerListQueryResponse>> Handle(CustomerListQuery request, CancellationToken cancellationToken)
    {
        var query = context.Customers
            .Include(q => q.CustomerCategory)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Filter))
        {
            var filter = request.Filter.ToLower();

            query = query.Where(q =>
                q.Name.ToLower().Contains(filter) ||
                q.Email.ToLower().Contains(filter));
        }

        var data = await query.OrderBy(q => q.Name).ToListAsync(cancellationToken);
        var result = new List<CustomerListQueryResponse>();

        foreach (var item in data)
        {
            var resultItem = new CustomerListQueryResponse
            {
                Id = item.Id,
                Name = item.Name,
                Address = item.Address,
                Email = item.Email,
                Phone = item.Phone,
                Iban = item.Iban,
                Code = item.CustomerCategory != null ? item.CustomerCategory.Code : "",
                Description = item.CustomerCategory != null ? item.CustomerCategory.Description : ""
            };

            result.Add(resultItem);
        }

        return result;
    }
}

