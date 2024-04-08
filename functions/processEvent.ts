import { SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (event) => {
  const records = event.Records;

  const batchItemFailures: Array<{ itemIdentifier: string }> = [];

	console.log('BATCH IS PROCESSING...')

  if (records.length) {
    for (const record of records) {
      try {
        const parsedBody = JSON.parse(record.body);

        if (!parsedBody.detail.vehicleNo || !parsedBody.detail.NIC) {
          throw new Error("Bad request");
        }

        console.log(
          "Processing vehicle details " + parsedBody.detail.vehicleNo
        );

        console.log("Processing is successful " + parsedBody.detail.vehicleNo);
      } catch (e) {
        console.log(e);

        batchItemFailures.push({
          itemIdentifier: record.messageId,
        });
      }
    }
  }

  return {
    batchItemFailures,
  };
};
