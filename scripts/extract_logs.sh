#!/bin/bash

# Define the log file path
LOG_FILE="/root/.pm2/logs/slow-out.log"

# Create a directory to store the monthly log files
mkdir -p /root/monthly_logs

# Loop through each month
for month in Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec; do
  # Use grep to extract lines matching the month
  grep "\[$month" $LOG_FILE > /root/monthly_logs/${month}_logs.log
done

echo "Logs have been extracted into the /root/monthly_logs directory."
