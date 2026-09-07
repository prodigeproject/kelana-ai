import os
import boto3

KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID", "")
MODEL_ARN = os.getenv("KNOWLEDGE_BASE_MODEL_ARN", "")


def ask_knowledge_base(question: str) -> dict:
    if not KNOWLEDGE_BASE_ID or not MODEL_ARN:
        return {"answer": "Knowledge Base is not configured. Set KNOWLEDGE_BASE_ID and KNOWLEDGE_BASE_MODEL_ARN.", "sources": []}
    client = boto3.client("bedrock-agent-runtime", region_name=os.getenv("AWS_REGION", "ap-southeast-2"))
    response = client.retrieve_and_generate(
        input={"text": question},
        retrieveAndGenerateConfiguration={
            "type": "KNOWLEDGE_BASE",
            "knowledgeBaseConfiguration": {
                "knowledgeBaseId": KNOWLEDGE_BASE_ID,
                "modelArn": MODEL_ARN,
            },
        },
    )
    citations = response.get("citations", [])
    sources = [citation.get("retrievedReferences", [{}])[0].get("location", {}).get("s3Location", {}).get("uri", "") for citation in citations]
    return {"answer": response.get("output", {}).get("text", ""), "sources": sources}
