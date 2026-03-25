using MongoDB.Driver;
using Nethereum.Web3;
using WebApplication2.Models;
using WebApplication2.Services;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSingleton(sp =>
{
    var cfg = sp.GetRequiredService<IConfiguration>();
    return new Web3(cfg["Blockchain:RpcUrl"]);
});

builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoDb"));

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var cfg = sp.GetRequiredService<IConfiguration>();

    var settings = cfg
        .GetSection("MongoDb")
        .Get<MongoSettings>()
        ?? throw new Exception("MongoDb settings not found");

    return new MongoClient(settings.ConnectionString);
});

builder.Services.AddSingleton<UserMongoService>();

builder.Services.AddSingleton<ProductMongoService>();

builder.Services.AddSingleton<OrderMongoService>();

var app = builder.Build();

var scope = app.Services.CreateScope();
var userService = scope.ServiceProvider.GetRequiredService<UserMongoService>();
var productService = scope.ServiceProvider.GetRequiredService<ProductMongoService>();

await userService.SeedAdminAsync();
await productService.SeedProductsAsync();

app.UseCors("ReactCors");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();