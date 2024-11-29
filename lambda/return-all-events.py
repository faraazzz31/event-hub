import boto3
import json
from typing import Any, Dict

# Initialize AWS DynamoDB client
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda function to retrieve all events from the DynamoDB table.
    """
    try:
        # DynamoDB table configuration
        table_name = "event-metadata"  # Replace with your table name
        table = dynamodb.Table(table_name)

        # Scan all events
        response = table.scan()
        events = response.get('Items', [])

        # Return all events
        return {
            "statusCode": 200,
            "body": json.dumps(events)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e)
        }
