from dotenv import load_dotenv
import boto3
import os

# Load environment variables from .env
load_dotenv()


class BedrockService:
    def __init__(self):
        # Simple initialization
        self.region = os.getenv("AWS_REGION", "ap-southeast-2")
        self.model_id = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")
        
        # Try to create client, but it's okay if it fails
        try:
            self.client = boto3.client(
                service_name="bedrock-runtime",
                region_name=self.region
            )
            self.available = True
        except:
            self.available = False
            self.client = None

    def ask_ai(self, question: str) -> str:
        """Ask AI a simple question about travel."""
        
        if not self.available or self.client is None:
            # Simple fallback responses
            if "recommend" in question.lower():
                return "Based on common travel advice: Visit popular landmarks, try local food, and use public transport."
            elif "budget" in question.lower():
                return "Budget tip: Plan ahead, book early, and consider off-season travel for better deals."
            elif "safety" in question.lower():
                return "Safety tip: Keep valuables secure, stay aware of surroundings, and have emergency contacts."
            else:
                return "Travel advice: Research your destination, respect local customs, and enjoy your journey!"
        
        try:
            # Simple prompt
            prompt = f"As a travel assistant, answer this question: {question}"
            
            response = self.client.converse(
                modelId=self.model_id,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            )
            
            return response["output"]["message"]["content"][0]["text"]
            
        except Exception as e:
            return f"AI service temporarily unavailable. General travel tip: Plan your itinerary in advance."

    def get_trip_suggestion(self, destination: str, days: int, budget: float) -> str:
        """Get AI suggestion for a trip with structured daily plan."""
        
        if not self.available:
            # Simple fallback
            suggestions = {
                "Japan": f"For {days} days in Japan with ${budget}: Visit Tokyo, try sushi, use trains.",
                "Bali": f"For {days} days in Bali with ${budget}: Enjoy beaches, temples, local food.",
                "Paris": f"For {days} days in Paris with ${budget}: See Eiffel Tower, museums, cafes.",
                "default": f"For {days} days in {destination} with ${budget}: Explore landmarks, try local cuisine."
            }
            
            return suggestions.get(destination, suggestions["default"])
        
        try:
            prompt = f"""Create a detailed daily travel plan for {destination} for {days} days with ${budget} budget.

Please provide structured daily plans with these mandatory sections for EACH day:

Morning activities: Provide 2-3 specific morning activities per day
Afternoon activities: Include cultural sites and local experiences
Evening activities: Suggest dinner spots and nightlife options

Format each day as:
Day [X]: [Theme/Title]

Morning:
- [Activity 1]
- [Activity 2]
- [Activity 3]

Afternoon:
- [Cultural site 1]
- [Local experience]
- [Cultural site 2]

Evening:
- [Dinner spot recommendation]
- [Nightlife activity]

Make the recommendations practical, culturally appropriate, and tailored to the budget."""
            
            response = self.client.converse(
                modelId=self.model_id,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            )
            
            return response["output"]["message"]["content"][0]["text"]
            
        except:
            return f"Visit {destination} for {days} days. Suggested budget: ${budget}. Enjoy your trip!"


# Simple instance
bedrock_service = BedrockService()