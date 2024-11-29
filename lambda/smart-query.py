import boto3
import json
from typing import Any, Dict, List

# Initialize AWS DynamoDB client
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda function to perform a simple text search on event tags and filter results by department.
    """
    try:
        # Validate input
        if 'query' not in event or 'departments' not in event:
            return {"statusCode": 400, "body": "Invalid input: Must provide 'query' and 'departments'."}

        query = event['query'].lower()
        filter_departments = event['departments']  # List of departments

        # DynamoDB table configuration
        table_name = "event-metadata"
        table = dynamodb.Table(table_name)

        # Scan all events
        response = table.scan()
        events = response.get('Items', [])

        # Filter events
        relevant_events = []
        for event in events:
            tags = event.get('tags', [])
            department = event.get('department', '')

            # Skip events not matching the department filter (if specified)
            if filter_departments and department not in filter_departments:
                continue

            # Simple text search: check if the query appears in any tag
            if any(query in tag.lower() for tag in tags):
                relevant_events.append(event)

        # Return filtered events
        return {"statusCode": 200, "body": json.dumps(relevant_events)}

    except Exception as e:
        return {"statusCode": 500, "body": str(e)}
