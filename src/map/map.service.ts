import { Injectable } from '@nestjs/common';
import axios from 'axios';

const  apiKey = process.env.GOOGLE_MAPS_API;
@Injectable()
export class MapService {
        constructor(){
        } 

        getAddressCoordinate = async (address) => {
            const apiKey = process.env.GOOGLE_MAPS_API;
            // https://geocode.search.hereapi.com/v1/geocode?q=malaviya&apiKey=
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        
            try {
                const response = await axios.get(url);
                console.log(response);
                if (response.data.status === 'OK') {
                    const location = response.data.results[ 0 ].geometry.location;
                    return {
                        ltd: location.lat,
                        lng: location.lng
                    };
                } else {
                    throw new Error('Unable to fetch coordinates');
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        }

}
