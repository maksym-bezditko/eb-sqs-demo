# EventBridge SQS Demo

A serverless application demonstrating event-driven architecture using AWS EventBridge, SQS, and Lambda.

## Architecture

This demo implements a serverless event processing pipeline:

1. External services post events to an API Gateway endpoint
2. API Gateway forwards events to EventBridge
3. EventBridge routes events to an SQS queue based on pattern matching
4. Lambda polls the SQS queue and processes events
5. Failed processing attempts are sent to a Dead Letter Queue (DLQ)

## Prerequisites

- Node.js (v18 or later)
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI (`npm install -g serverless`)

## Installation

```bash
# Clone the repository
git clone https://github.com/maksym-bezditko/eb-sqs-demo.git
cd eb-sqs-demo

# Install dependencies
npm install
```

## Deployment

```bash
# Deploy to dev environment (default)
npm run deploy

# Deploy to production environment
npm run deploy:prod
```

## Usage

After deployment, you'll receive an API Gateway endpoint URL. You can send events to this endpoint:

```bash
curl -X POST \
  https://your-api-endpoint.execute-api.eu-north-1.amazonaws.com/dev/eventbridge \
  -H 'Content-Type: application/json' \
  -d '{
    "detail": {
      "vehicleNo": "ABC123",
      "NIC": "XYZ789"
    }
  }'
```

## Local Development

The project uses the Serverless Framework, which makes it easy to develop and deploy serverless applications.

```bash
# View Lambda logs
npm run logs

# Remove the deployment
npm run remove
```

## Project Structure

- `functions/` - Contains Lambda function code
  - `processEvent.ts` - Main Lambda function for processing SQS events
- `serverless.yml` - Serverless Framework configuration
- `resources.yml` - AWS CloudFormation resources

## Architecture Diagram

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│              │    │              │    │              │    │              │
│  API Gateway ├───►│  EventBridge ├───►│  SQS Queue   ├───►│    Lambda    │
│              │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                                                │
                                                │
                                                ▼
                                        ┌──────────────┐
                                        │              │
                                        │     DLQ      │
                                        │              │
                                        └──────────────┘
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.