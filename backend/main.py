from services.trip_service import (
    calculate_daily_budget,
    get_recommended_places,
    get_transportation,
    get_trip_category,
    get_travel_season,
    get_travel_style,
    get_transportation,
)

# DAY 1

def print_trip_summary(
    destination,
    country,
    days,
    budget,
    currency,
    travel_month,
    travel_style,
    hotel_cost,
    food_cost,
    transport_cost,
    misc_cost,
):
    total_estimated_cost = (
        hotel_cost
        + food_cost
        + transport_cost
        + misc_cost
    )

    season = get_travel_season(travel_month)

    print("========================")
    print("KelanaAI")
    print("========================")
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget} {currency}")
    print(f"Currency    : {currency}")
    print(f"Month       : {travel_month}")
    print(f"Season      : {season}")
    print(f"Style       : {travel_style}")
    print(f"Hotel Cost  : {hotel_cost} {currency}")
    print(f"Food Cost   : {food_cost} {currency}")
    print(f"Transport   : {transport_cost} {currency}")
    print(f"Misc Cost   : {misc_cost} {currency}")
    print(f"Total Cost  : {total_estimated_cost} {currency}")

    if total_estimated_cost > budget:
        print("⚠ Budget exceeded.")

    print()


# Call it with any trip

print_trip_summary(
    "Japan",
    "Japan",
    5,
    1500,
    "USD",
    "December",
    "Family",
    900,
    300,
    250,
    100,
)

print_trip_summary(
    "Bali",
    "Indonesia",
    3,
    800,
    "USD",
    "October",
    "Backpacker",
    500,
    150,
    100,
    75,
)

# DAY 2
# Destinations

def print_destinations(destinations):
    print("Your Destinations")

    index = 0

    while index < len(destinations):
        print(f"{index + 1}. {destinations[index]}")
        index += 1


def print_recommended_places(destinations):
    print("Recommended Places")
    print()

    for destination in destinations:
        print(destination)

        for place in get_recommended_places(destination):
            print(f"- {place}")

        print()


def print_trip_plan(destinations, days, budget):
    daily_budget = calculate_daily_budget(budget, days)
    category = get_trip_category(budget)
    transportation = get_transportation(category)

    print("========================")
    print("KelanaAI")
    print("========================")
    print()

    print_destinations(destinations)

    print()
    print(f"Days        = {days}")
    print(f"Budget      = {budget} USD")
    print(f'Category    = "{category}"')
    print(f"Daily Budget = {daily_budget} USD/day")
    print(f"Recommended Transportation = {transportation}")

    print()

    print_recommended_places(destinations)

# PLAN TRIP SUMMARY

recommended_destinations = (
    "Japan",
    "Korea",
    "Indonesia",
)

print("Selected Destinations:")
print(recommended_destinations[0])
print(recommended_destinations[1])
print(recommended_destinations[2])

print()


# ========================================
# Loop through destinations
# ========================================

for destination in recommended_destinations:
    print(f" - {destination}")

print()

# Run Day 2 Trip Plan

destinations = [
    "Japan",
    "Korea",
    "Indonesia",
]

print_trip_plan(
    destinations,
    5,
    1500,
)

# Day 3

from fastapi import FastAPI
from pydantic import BaseModel


class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str


app = FastAPI()

# Default data for homework
recommended_destination = "Japan"

available_categories = [
    "Backpacker",
    "Standard",
    "Luxury"
]

# GET endpoint at the root path
@app.get("/")
def home():
    return {
        "message": "Welcome to KelanaAI"
    }

# CORE CHALENGE
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(
        request.budget
    )

    recommendation_transport = get_transportation(
        request.travel_style
    )

    return {
        "destination": request.destination,
        "budget": request.budget,
        "daily_budget": daily_budget,
        "category": category,
        "recommendation_transport": recommendation_transport,

    }

# BONUS CHALLENGE
@app.get("/api/v1/trip-categories")
def trip_categories():
    return available_categories

# HOMEWORK CHALLENGE
@app.get("/api/v1/recommendations")
def recommended_places():
    return get_recommended_places(
        recommended_destination
    )

@app.get("/api/v1/transportations")
def recommended_transport():
    return [
        get_transportation(category)
        for category in available_categories
    ]
    

