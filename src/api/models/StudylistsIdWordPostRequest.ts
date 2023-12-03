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
 * @interface StudylistsIdWordPostRequest
 */
export interface StudylistsIdWordPostRequest {
    /**
     * 
     * @type {string}
     * @memberof StudylistsIdWordPostRequest
     */
    wordEntryId: string;
}

/**
 * Check if a given object implements the StudylistsIdWordPostRequest interface.
 */
export function instanceOfStudylistsIdWordPostRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "wordEntryId" in value;

    return isInstance;
}

export function StudylistsIdWordPostRequestFromJSON(json: any): StudylistsIdWordPostRequest {
    return StudylistsIdWordPostRequestFromJSONTyped(json, false);
}

export function StudylistsIdWordPostRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): StudylistsIdWordPostRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'wordEntryId': json['wordEntryId'],
    };
}

export function StudylistsIdWordPostRequestToJSON(value?: StudylistsIdWordPostRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'wordEntryId': value.wordEntryId,
    };
}

