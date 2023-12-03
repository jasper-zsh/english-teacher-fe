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
 * @interface StudylistsPostRequest
 */
export interface StudylistsPostRequest {
    /**
     * 
     * @type {string}
     * @memberof StudylistsPostRequest
     */
    name: string;
}

/**
 * Check if a given object implements the StudylistsPostRequest interface.
 */
export function instanceOfStudylistsPostRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function StudylistsPostRequestFromJSON(json: any): StudylistsPostRequest {
    return StudylistsPostRequestFromJSONTyped(json, false);
}

export function StudylistsPostRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): StudylistsPostRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
    };
}

export function StudylistsPostRequestToJSON(value?: StudylistsPostRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
    };
}

