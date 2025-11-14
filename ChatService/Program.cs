using ChatService.Hubs;
using ChatService.Services;

var builder = WebApplication.CreateBuilder(args);

//Add service SignalR
builder.Services.AddSignalR();
builder.Services.AddSingleton<IChatServices, ChatServices>();


builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("reactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (app.Environment.IsProduction())
{
    var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
    app.Urls.Add($"http://0.0.0.0:{port}");
}

app.UseHttpsRedirection();
app.UseCors("reactApp");
app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/chat");

app.Run();
