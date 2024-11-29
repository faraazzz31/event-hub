import boto3
import json
from typing import Any, Dict, List

# Initialize AWS clients
comprehend = boto3.client('comprehend')
lambda_client = boto3.client('lambda')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda function to process JSON input, extract key phrases using Amazon Comprehend,
    and forward the updated JSON to another Lambda function.
    """
    try:
        # Validate input JSON structure
        required_keys: List[str] = ['department', 'date', 'time', 'title', 'location', 'description', 'tags']
        if not all(key in event for key in required_keys):
            return {
                "statusCode": 400,
                "body": "Input JSON must contain 'department', 'date', 'time', 'title', 'location', 'description', 'tags'."
            }

        # Extract title and description
        title: str = event['title']
        description: str = event['description']

        # Combine title and description for key phrase extraction
        text_to_analyze: str = f"{title} {description}"

        # Call Amazon Comprehend to extract key phrases
        comprehend_response: Dict[str, Any] = comprehend.detect_key_phrases(
            Text=text_to_analyze,
            LanguageCode='en'
        )

        # Extract top 10 key phrases
        key_phrases: List[str] = [
            phrase['Text'] for phrase in comprehend_response.get('KeyPhrases', [])
        ]
        top_key_phrases: List[str] = key_phrases[:10]  # Get the first 10 phrases

        # Update tags in the input JSON
        event['tags'] = top_key_phrases

        # Invoke the database Lambda function
        db_lambda_name: str = "database-store"  # Replace with the actual name of the database Lambda
        db_lambda_response = lambda_client.invoke(
            FunctionName=db_lambda_name,
            InvocationType='RequestResponse',  # Synchronous invocation
            Payload=json.dumps(event)
        )

        # Read and parse the database Lambda response
        db_response_payload: Dict[str, Any] = json.loads(db_lambda_response['Payload'].read())

        # Return the updated JSON and the database Lambda's response
        return {
            "statusCode": 200,
            "body": {
                "updated_json": event,
                "db_response": db_response_payload
            }
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e)
        }
