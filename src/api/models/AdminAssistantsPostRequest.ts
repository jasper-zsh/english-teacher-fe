/* tslint:disable */
/* eslint-disable */
/**
 * English Teacher
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface AdminAssistantsPostRequest
 */
export interface AdminAssistantsPostRequest {
    /**
     * 
     * @type {string}
     * @memberof AdminAssistantsPostRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof AdminAssistantsPostRequest
     */
    prompt: string;
}

/**
 * Check if a given object implements the AdminAssistantsPostRequest interface.
 */
export function instanceOfAdminAssistantsPostRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "prompt" in value;

    return isInstance;
}

export function AdminAssistantsPostRequestFromJSON(json: any): AdminAssistantsPostRequest {
    return AdminAssistantsPostRequestFromJSONTyped(json, false);
}

export function AdminAssistantsPostRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AdminAssistantsPostRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'prompt': json['prompt'],
    };
}

export function AdminAssistantsPostRequestToJSON(value?: AdminAssistantsPostRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'prompt': value.prompt,
    };
}
