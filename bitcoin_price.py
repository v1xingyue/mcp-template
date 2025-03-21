import requests
from datetime import datetime

def get_bitcoin_price():
    try:
        # CoinGecko API endpoint for Bitcoin price in USD
        url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        data = response.json()
        price = data["bitcoin"]["usd"]
        
        # Get current timestamp
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        print(f"Bitcoin Price as of {current_time}")
        print(f"${price:,.2f} USD")
        return price
        
    except requests.RequestException as e:
        print(f"Error fetching Bitcoin price: {e}")
        return None

if __name__ == "__main__":
    get_bitcoin_price() 