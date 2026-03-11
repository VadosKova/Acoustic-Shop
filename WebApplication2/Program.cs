using Nethereum.Web3;

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

var app = builder.Build();

app.UseCors("ReactCors");
app.UseHttpsRedirection();
app.MapControllers();
app.Run();