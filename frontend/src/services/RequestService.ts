/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable no-useless-catch */
import { API_HOST } from "../constants/Api"

export async function request(endpoint: string, method: string, requestBody?: string): Promise<any> {
    try {
        const response = await fetch(API_HOST + endpoint, {
            method,
            headers: {'Content-Type': 'application/json' },
            body: requestBody ? requestBody : null
        });

        if (!response.ok) {
            var err = await response.text()
            throw new Error(JSON.parse(err)?.error);
        }

        if(response.status === 204){
            return null
        }
        try{
            return await response.json()
        }catch(e){
            return null;
        }
    } catch (err) {
        throw err;
    }
}