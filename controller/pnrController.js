


 export function generatePNR() {
    // Get the current timestamp (milliseconds since January 1, 1970) and extract the last few digits
    const timestampPart = Date.now().toString().slice(-5); // Use the last 5 digits of the timestamp
  
    // Generate a random 4-digit number for additional uniqueness
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit random number
  
    // Combine the timestamp and random part to create a 9-digit PNR number
    const pnr = `${timestampPart}${randomPart}`;
    
    return pnr;
  }
  
  // Example usage
  const pnrNumber = generatePNR();
  console.log("Generated PNR Number:", pnrNumber);
  