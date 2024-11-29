import boto3
import json
import uuid
from typing import Any, Dict

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda function to store event metadata and tags in DynamoDB and verify by reading back the record.
    Expects an input JSON with 'department', 'date', 'time', 'title', 'location', 'description', and 'tags' fields.
    """
    try:
        # Validate input
        required_keys = ['department', 'date', 'time', 'title', 'location', 'description', 'tags']
        if not all(key in event for key in required_keys):
            return {
                "statusCode": 400,
                "body": "Invalid input: Missing required keys. Input must contain 'department', 'date', 'time', 'title', 'location', 'description', and 'tags'."
            }

        # Generate a unique event ID
        event_id = str(uuid.uuid4())

        # Get the DynamoDB table
        table_name = "event-metadata"  # Replace with your table name
        table = dynamodb.Table(table_name)

        # Prepare the item to insert
        item = {
            "event_id": event_id,
            "department": event["department"],
            "date": event["date"],
            "time": event["time"],
            "title": event["title"],
            "location": event["location"],
            "description": event["description"],
            "tags": event["tags"]  # Assuming 'tags' is a list of strings
        }

        # Insert the item into the DynamoDB table
        table.put_item(Item=item)

        # Read the item back for verification
        response = table.get_item(Key={"event_id": event_id})

        # Check if the stored and retrieved items match
        if 'Item' not in response:
            return {
                "statusCode": 500,
                "body": f"Sanity check failed: Unable to retrieve the stored item with event_id {event_id}."
            }

        retrieved_item = response['Item']

        # Compare the original and retrieved items
        if item != retrieved_item:
            return {
                "statusCode": 500,
                "body": {
                    "message": "Sanity check failed: Stored and retrieved items do not match.",
                    "original_item": item,
                    "retrieved_item": retrieved_item
                }
            }

        # Return success response
        return {
            "statusCode": 200,
            "body": {
                "message": "Event metadata stored and verified successfully.",
                "event_id": event_id,
                "stored_item": item
            }
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": str(e)
        }
