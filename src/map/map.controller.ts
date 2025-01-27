import { Controller, Get, Query } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {

    constructor (private mapService : MapService){}
    // Map API endpoints here
    // For example, /map/search, /map/directions, etc.
    // Implement methods to handle these endpoints
    // and interact with the Map API
    // to provide real-time location updates, route planning, etc.
    // ...
    // You can also utilize third-party libraries like @googlemaps/google-maps-services-node
    // to simplify the integration with the Map API
    // ...
    // Implement your logic here
    // ...
    // Example method to search for a location
    @Get('get-coordinates')
    async getCoordinates(@Query('address') location: string): Promise<any> {
        return await this.mapService.getAddressCoordinate(location);
    }
    @Get('get-distance-time')
    async getDistanceTime(@Query('location') location: string): Promise<any> {
        
    }
    @Get('get-suggestions')
    async getSuggestions(@Query('location') location: string): Promise<any> {
        
    }
}

