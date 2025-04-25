import fs from 'fs';
import path from 'path';

interface OrderTemplateData {
  productName: string;
  price: number;
  quantity: number;
}

export function formatOrderResponse(data: OrderTemplateData): string {
  try {
    // Read the template file
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'order_response_template.txt');
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // Format price with Indian number format (includes commas)
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(data.price);
    
    // Replace placeholders with actual data
    template = template
      .replace('{product_name}', data.productName)
      .replace('{price}', formattedPrice)
      .replace('{quantity}', data.quantity.toString());

    return template;
  } catch (error) {
    console.error('Error formatting order response:', error);
    return 'Error generating response template';
  }
}

// Example usage:
/*
const response = formatOrderResponse({
  productName: "Tommy Hilfiger Watch",
  price: 2299,
  quantity: 1
});
console.log(response);
*/ 