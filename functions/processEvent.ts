import { SQSHandler } from "aws-lambda";

/**
 * Interface representing the expected event detail structure
 */
interface VehicleEventDetail {
  vehicleNo: string;
  NIC: string;
  [key: string]: unknown;
}

/**
 * Interface for the EventBridge event structure
 */
interface EventBridgeEvent {
  detail: VehicleEventDetail;
  [key: string]: unknown;
}

/**
 * Custom error for validation failures
 */
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates the event payload has the required fields
 * @param parsedBody The parsed event body to validate
 * @throws ValidationError if validation fails
 */
const validateEventPayload = (parsedBody: unknown): EventBridgeEvent => {
  if (!parsedBody || typeof parsedBody !== 'object') {
    throw new ValidationError('Invalid event format');
  }
  
  const event = parsedBody as EventBridgeEvent;
  
  if (!event.detail) {
    throw new ValidationError('Missing event detail');
  }
  
  if (!event.detail.vehicleNo) {
    throw new ValidationError('Missing vehicleNo in event detail');
  }
  
  if (!event.detail.NIC) {
    throw new ValidationError('Missing NIC in event detail');
  }
  
  return event;
};

/**
 * Process a single vehicle record
 * @param body The raw body string from SQS
 */
const processVehicleRecord = async (body: string): Promise<void> => {
  const parsedBody = JSON.parse(body);
  const event = validateEventPayload(parsedBody);
  
  // Log with consistent structure
  console.log(JSON.stringify({
    level: 'info',
    message: `Processing vehicle details ${event.detail.vehicleNo}`,
    vehicleNo: event.detail.vehicleNo,
    timestamp: new Date().toISOString()
  }));
  
  // Here would be the actual business logic to process the vehicle
  // For this demo, we just log the success
  
  console.log(JSON.stringify({
    level: 'info',
    message: `Processing successful for vehicle ${event.detail.vehicleNo}`,
    vehicleNo: event.detail.vehicleNo,
    timestamp: new Date().toISOString()
  }));
};

/**
 * Main handler for processing SQS events
 */
export const handler: SQSHandler = async (event) => {
  const records = event.Records;
  const batchItemFailures: Array<{ itemIdentifier: string }> = [];

  console.log(JSON.stringify({
    level: 'info',
    message: 'Starting batch processing',
    batchSize: records.length,
    timestamp: new Date().toISOString()
  }));

  if (records.length) {
    for (const record of records) {
      try {
        await processVehicleRecord(record.body);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorName = error instanceof Error ? error.name : 'Error';
        
        console.log(JSON.stringify({
          level: 'error',
          message: `Failed to process message: ${errorMessage}`,
          errorType: errorName,
          messageId: record.messageId,
          timestamp: new Date().toISOString()
        }));

        batchItemFailures.push({
          itemIdentifier: record.messageId,
        });
      }
    }
  }

  console.log(JSON.stringify({
    level: 'info',
    message: 'Batch processing complete',
    failedItems: batchItemFailures.length,
    timestamp: new Date().toISOString()
  }));

  return {
    batchItemFailures,
  };
};