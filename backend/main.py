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

    print("========================")
    print("KelanaAI")
    print("========================")
    print(f"Destination : {destination}")
    print(f"Country     : {country}")
    print(f"Days        : {days}")
    print(f"Budget      : {budget} {currency}")
    print(f"Currency    : {currency}")
    print(f"Month       : {travel_month}")        
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
print_trip_summary("Japan", "Japan", 5, 1500, "USD", "December", "Family", 900, 300, 250, 100)
print_trip_summary("Bali", "Indonesia", 3, 800, "USD", "October", "Backpacker", 500, 150, 100, 75)