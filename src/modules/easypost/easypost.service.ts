import EasyPost from '@easypost/api';

interface AddressData {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  company?: string;
  name?: string;
  phone?: string;
}

interface VerifiedAddress {
  id: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  company?: string;
  name?: string;
  phone?: string;
  verified: boolean;
  verification_errors?: string[];
}

class EasyPostService {
  private client: any;

  constructor() {
    const apiKey = process.env.EASYPOST_API_KEY;
    if (!apiKey) {
      throw new Error('EASYPOST_API_KEY environment variable is required');
    }
    this.client = new EasyPost(apiKey);
  }

  /**
   * Verify and create an address using EasyPost
   */
  async verifyAddress(addressData: AddressData): Promise<VerifiedAddress> {
    try {
      const address = await this.client.Address.create({
        street1: addressData.street1,
        street2: addressData.street2,
        city: addressData.city,
        state: addressData.state,
        zip: addressData.zip,
        country: addressData.country,
        company: addressData.company,
        name: addressData.name,
        phone: addressData.phone,
        verify: ['delivery', 'zip4']
      });

      return {
        id: address.id,
        street1: address.street1,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        company: address.company,
        name: address.name,
        phone: address.phone,
        verified: address.verifications?.delivery?.success || false,
        verification_errors: address.verifications?.delivery?.errors?.map((error: any) => error.message) || []
      };
    } catch (error: any) {
      console.error('EasyPost address verification error:', error);
      throw new Error(`Address verification failed: ${error.message}`);
    }
  }

  /**
   * Search for addresses using EasyPost
   */
  async searchAddresses(query: string): Promise<any[]> {
    try {
      // Note: EasyPost doesn't have a direct address search API
      // This is a placeholder for future implementation
      // You might want to use a different service like Google Places API for address search
      throw new Error('Address search not implemented yet');
    } catch (error: any) {
      console.error('EasyPost address search error:', error);
      throw new Error(`Address search failed: ${error.message}`);
    }
  }

  /**
   * Get address by ID
   */
  async getAddress(addressId: string): Promise<VerifiedAddress> {
    try {
      const address = await this.client.Address.retrieve(addressId);
      
      return {
        id: address.id,
        street1: address.street1,
        street2: address.street2,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        company: address.company,
        name: address.name,
        phone: address.phone,
        verified: true
      };
    } catch (error: any) {
      console.error('EasyPost get address error:', error);
      throw new Error(`Failed to retrieve address: ${error.message}`);
    }
  }
}

export default EasyPostService;
