import requests

# 1. GITHUB API
print("1. GITHUB API:")
github_url = "https://api.github.com/repos/python/cpython"
response = requests.get(github_url)
data = response.json()

print(f"Tên repo: {data['name']}")
print(f"Owner: {data['owner']['login']}")
print(f"Stars: {data['stargazers_count']}")
print(f"Forks: {data['forks_count']}\n")


# 2. OPENWEATHER API
print("2. OPENWEATHER API:")
# api_key = "YOUR_OPENWEATHER_API_KEY"
# weather_url = f"http://api.openweathermap.org/data/2.5/weather?q=Hanoi&appid={api_key}&units=metric"
# response = requests.get(weather_url)
# data = response.json()

# print(f"Thành phố: {data['name']}")
# print(f"Nhiệt độ: {data['main']['temp']}°C")
# print(f"Thời tiết: {data['weather'][0]['description']}\n")


# 3. RANDOM USER API
print("3. RANDOM USER API:")
user_url = "https://randomuser.me/api/"
response = requests.get(user_url)
data = response.json()

user = data['results'][0]

print(f"Tên: {user['name']['first']} {user['name']['last']}")
print(f"Email: {user['email']}")
print(f"Quốc gia: {user['location']['country']}\n")