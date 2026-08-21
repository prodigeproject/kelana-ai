def calculate_daily_budget(budget, days):
    return budget / days


def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif budget <= 5000:
        return "Standard"
    else:
        return "Luxury"


def get_travel_style(category):
    if category == "Backpacker":
        return "Backpacker"
    elif category == "Standard":
        return "Normal"
    elif category == "Luxury":
        return "Rich Fam"


def get_transportation(category):
    if category == "Backpacker":
        return "Bus"
    elif category == "Standard":
        return "Train"
    elif category == "Luxury":
        return "Flight"
    else:
        return "Unknown"


def get_recommended_places(destination):
    recommendations = {
        "Japan": [
            "Tokyo Tower",
            "Shibuya Crossing",
            "Mount Fuji"
        ],
        "Korea": [
            "N Seoul Tower",
            "Gyeongbokgung Palace",
            "Myeongdong"
        ],
        "Indonesia": [
            "Bali",
            "Borobudur",
            "Raja Ampat"
        ],
        "Paris": [
            "Eiffel Tower",
            "Louvre Museum",
            "Notre-Dame Cathedral"
        ],
        "Tokyo": [
            "Tokyo Tower",
            "Senso-ji Temple",
            "Shibuya Crossing"
        ],
        "New York": [
            "Statue of Liberty",
            "Central Park",
            "Times Square"
        ]
    }

    return recommendations.get(
        destination,
        [
            "City Center",
            "Popular Landmark",
            "Local Market"
        ]
    )


def get_travel_season(month):
    if month == "December":
        return "Peak Season"
    elif month == "June":
        return "Holiday Season"
    else:
        return "Regular Season"


def get_recommended_transport(travel_style):
    if travel_style == "Family":
        return get_transportation("Standard")
    elif travel_style == "Backpacker":
        return get_transportation("Backpacker")
    else:
        return "Unknown"